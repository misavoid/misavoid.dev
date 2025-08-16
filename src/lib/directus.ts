export const DIRECTUS_URL =
    import.meta.env.PUBLIC_DIRECTUS_URL || 'https://directus.misavoid.dev';

export type Post = {
    id: string;
    title: string;
    slug: string;
    content?: string;
    published_at?: string | null;
    tags?: string[] | null;
    cover?: { id: string } | null;
};

async function safeJSON(res: Response) {
    try { return await res.json(); } catch { return { data: null }; }
}

export async function fetchPosts(): Promise<Post[]> {
    try {
        const url = new URL(`${DIRECTUS_URL}/items/posts`);
        url.searchParams.set('fields', 'id,title,slug,published_at,tags,cover.id');
        url.searchParams.set('filter[status][_eq]', 'published');
        url.searchParams.set('sort[]', '-published_at');
        url.searchParams.set('limit', '30');

        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return [];
        const json = await safeJSON(res);
        return json.data ?? [];
    } catch {
        return [];
    }
}

export async function fetchPost(slug: string): Promise<Post | null> {
    try {
        const url = new URL(`${DIRECTUS_URL}/items/posts`);
        url.searchParams.set('fields', 'id,title,slug,content,published_at,tags,cover.id');
        url.searchParams.set('filter[slug][_eq]', slug);
        url.searchParams.set('filter[status][_eq]', 'published');
        url.searchParams.set('limit', '1');

        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return null;
        const json = await safeJSON(res);
        return (json.data && json.data[0]) || null;
    } catch {
        return null;
    }
}
