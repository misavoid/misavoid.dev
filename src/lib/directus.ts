// src/lib/directus.ts
export const DIRECTUS_URL =
    import.meta.env.PUBLIC_DIRECTUS_URL || "https://directus.misavoid.dev";

export type Post = {
    id: string;
    title: string;
    href: string;
    summary?: string | null;
    content?: string | null;
    published_at?: string | null;
    tags?: string[] | null;
    cover?: { id: string } | null;
};

async function safeJSON(res: Response) {
    try {
        return await res.json();
    } catch {
        return { data: null };
    }
}

export async function fetchPosts(): Promise<Post[]> {
    try {
        const url = new URL(`${DIRECTUS_URL}/items/posts`);
        // request all fields needed for the LIST view/cards
        url.searchParams.append("fields[]", "id");
        url.searchParams.append("fields[]", "title");
        url.searchParams.append("fields[]", "slug");
        url.searchParams.append("fields[]", "summary");     // <-- add
        url.searchParams.append("fields[]", "content");     // <-- for fallback preview
        url.searchParams.append("fields[]", "published_at");
        url.searchParams.append("fields[]", "cover.id");

        url.searchParams.set("filter[status][_eq]", "published");
        url.searchParams.append("sort[]", "-published_at");
        url.searchParams.set("limit", "30");

        const res = await fetch(url, { cache: "no-store" });

        if (import.meta.env.DEV) {
            console.log("[fetchPosts] url:", url.toString());
            const raw = await res.clone().text();
            console.log("[fetchPosts] raw response:", raw);
        }

        if (!res.ok) return [];
        const json = await safeJSON(res);
        return Array.isArray(json.data) ? (json.data as Post[]) : [];
    } catch (err) {
        if (import.meta.env.DEV) console.error("[fetchPosts] error", err);
        return [];
    }
}

export async function fetchPost(slug: string): Promise<Post | null> {
    try {
        const url = new URL(`${DIRECTUS_URL}/items/posts`);
        url.searchParams.append("fields[]", "id");
        url.searchParams.append("fields[]", "title");
        url.searchParams.append("fields[]", "slug");
        url.searchParams.append("fields[]", "summary");
        url.searchParams.append("fields[]", "content");
        url.searchParams.append("fields[]", "published_at");
        url.searchParams.append("fields[]", "tags");
        url.searchParams.append("fields[]", "cover.id");

        url.searchParams.set("filter[slug][_eq]", slug);
        url.searchParams.set("filter[status][_eq]", "published");
        url.searchParams.set("limit", "1");

        const res = await fetch(url, { cache: "no-store" });

        if (import.meta.env.DEV) {
            console.log("[fetchPost] url:", url.toString());
            const raw = await res.clone().text();
            console.log("[fetchPost] raw response:", raw);
        }

        if (!res.ok) return null;
        const json = await safeJSON(res);
        return Array.isArray(json.data) && json.data.length > 0
            ? (json.data[0] as Post)
            : null;
    } catch (err) {
        if (import.meta.env.DEV) console.error("[fetchPost] error", err);
        return null;
    }
}
