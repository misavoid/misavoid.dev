import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
 

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.summary]
 * @param {string} [props.content]
 * @param {string | Date | null} [props.date]
 * @param {string} [props.slug]
 * @param {string} [props.prevSlug]
 * @param {string} [props.nextSlug]
 * @param {{slug:string,title:string,summary?:string,content?:string,published_at?:string|null}[]} [props.postsData]
 * @param {string} [props.className]
 */
export default function BlogCard({
                                     title,
                                     summary,
                                     content,
                                     date,
                                     slug,
                                     prevSlug,
                                     nextSlug,
                                     postsData = [],
                                     className = "",
                                 }) {
    const [isOpen, setIsOpen] = useState(false);
    const [current, setCurrent] = useState(() => ({
        title,
        summary,
        content,
        date,
        slug,
    }));
    const [direction, setDirection] = useState(0); // -1 left, 1 right

    // Slight per-card tilt for the collapsed deck look
    const baseTilt = useMemo(() => (Math.random() * 2 - 1) * 3, []); // -3..3 deg
    const deckTiltA = baseTilt - 2; // back layer
    const deckTiltB = baseTilt + 2; // middle layer
    const [hovered, setHovered] = useState(false);

    const computedDate = current?.date;
    let dateStr = "";
    if (computedDate) {
        const d = computedDate instanceof Date ? computedDate : new Date(computedDate);
        if (!Number.isNaN(d.getTime())) dateStr = d.toLocaleDateString();
    }

    const slugs = useMemo(() => (postsData?.length ? postsData.map(p => p.slug) : []), [postsData]);
    const currentIndex = useMemo(() => slugs.indexOf(current?.slug ?? ""), [slugs, current?.slug]);
    const hasPrev = currentIndex >= 0 && currentIndex + 1 < slugs.length;
    const hasNext = currentIndex > 0;

    function loadByIndex(nextIndex, dir) {
        if (nextIndex < 0 || nextIndex >= slugs.length) return;
        const item = postsData[nextIndex];
        if (!item) return;
        setDirection(dir);
        setCurrent({
            title: item.title,
            summary: item.summary ?? undefined,
            content: item.content ?? undefined,
            date: item.published_at ?? null,
            slug: item.slug,
        });
    }

    // Keyboard navigation when modal is open
    useEffect(() => {
        if (!isOpen) return;
        function onKey(e) {
            if (e.key === 'ArrowLeft') {
                if (hasPrev) {
                    e.preventDefault();
                    loadByIndex(currentIndex + 1, -1);
                }
            } else if (e.key === 'ArrowRight') {
                if (hasNext) {
                    e.preventDefault();
                    loadByIndex(currentIndex - 1, 1);
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                setIsOpen(false);
            }
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, hasPrev, hasNext, currentIndex]);

    return (
        <>
            {/* collapsed card */}
            <motion.div
                className={`relative rounded-2xl p-6 sm:p-8 transition-transform duration-200 transform-gpu
          flex flex-col gap-3 w-full h-48 md:h-56 text-gray-900
          cursor-pointer ${className}`}
                whileHover={{ y: -8, rotate: baseTilt * 0.8, scale: 1.015 }}
                whileTap={{ scale: 0.995 }}
                transition={{ type: 'spring', stiffness: 760, damping: 20, mass: 0.55 }}
                onHoverStart={() => setHovered(true)}
                onHoverEnd={() => setHovered(false)}
                onClick={() => setIsOpen(true)}
            >
                {/* Deck-style stacked cards background for grid view */}
                <div className="pointer-events-none absolute inset-0 z-0">
                    <motion.div
                        className="absolute -inset-x-4 -top-4 -bottom-4 rounded-2xl bg-white/70 shadow-md"
                        aria-hidden
                        initial={false}
                        animate={hovered ? 'hover' : 'rest'}
                        variants={{
                            rest: { rotate: deckTiltA, y: 0, transition: { type: 'spring', stiffness: 600, damping: 26 } },
                            hover: { rotate: deckTiltA + (deckTiltA >= 0 ? -2.5 : 2.5), y: -1, transition: { type: 'spring', stiffness: 900, damping: 18, mass: 0.5 } },
                        }}
                    />
                    <motion.div
                        className="absolute -inset-x-3 -top-3 -bottom-3 rounded-2xl bg-white/80 shadow-lg"
                        aria-hidden
                        initial={false}
                        animate={hovered ? 'hover' : 'rest'}
                        variants={{
                            rest: { rotate: deckTiltB, y: 0, transition: { type: 'spring', stiffness: 600, damping: 26 } },
                            hover: { rotate: deckTiltB + (deckTiltB >= 0 ? 3.5 : -3.5), y: -2, transition: { type: 'spring', stiffness: 900, damping: 18, mass: 0.5 } },
                        }}
                    />
                </div>
                {/* Animated background panel (shared) */}
                <motion.div
                    layoutId={`${title}-panel`}
                    className="absolute inset-0 z-10 rounded-2xl bg-white/90 border border-gray-200"
                    initial={false}
                    animate={hovered ? 'hover' : 'rest'}
                    variants={{
                        rest: { boxShadow: '0 12px 20px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.05)' },
                        hover: { boxShadow: '0 28px 48px rgba(0,0,0,0.16), 0 8px 16px rgba(0,0,0,0.1)' },
                    }}
                    transition={{ type: 'spring', stiffness: 700, damping: 24, mass: 0.6 }}
                    aria-hidden
                />
                {dateStr && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
            <span className="text-xs px-2 py-1 rounded-full border bg-gray-100 border-gray-200">
              {dateStr}
            </span>
                    </div>
                )}

                <h2 className={`relative z-20 text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 ${dateStr ? 'mt-7 sm:mt-0' : ''}`}>
                    {title}
                </h2>

                {summary && (
                    <p className="relative z-20 text-lg opacity-90 line-clamp-3">{summary}</p>
                )}
            </motion.div>

            {/* expanded modal version */}
            <AnimatePresence mode="wait">
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6 overflow-hidden"
                        onClick={() => setIsOpen(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                        style={{ willChange: 'opacity' }}
                    >
                        <motion.div
                            className="relative rounded-2xl p-8 max-w-3xl w-full min-h-[65vh] transform-gpu"
                            onClick={(e) => e.stopPropagation()}
                            style={{ willChange: 'transform, height, width' }}
                        >
                            {/* Deck-style stacked cards background (oversized to peek around edges) */}
                            <div className="pointer-events-none absolute inset-0 z-0">
                                <div className="absolute -inset-x-8 -top-8 -bottom-8 rounded-2xl bg-white/70 shadow-lg rotate-[-3deg]" aria-hidden="true"></div>
                                <div className="absolute -inset-x-6 -top-6 -bottom-6 rounded-2xl bg-white/80 shadow-xl rotate-[3deg]" aria-hidden="true"></div>
                            </div>
                            {/* Animate the entire top card (panel + content) */}
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={(current?.slug || 'current') + ':' + direction}
                                    className="absolute inset-0 z-10 rounded-2xl"
                                    initial={{ opacity: 0.92, x: direction > 0 ? 160 : direction < 0 ? -160 : 0, rotate: direction > 0 ? 5 : direction < 0 ? -5 : 0 }}
                                    animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: direction > 0 ? -360 : 360, y: 18, rotate: direction > 0 ? -12 : 12 }}
                                    transition={{ type: 'spring', stiffness: 680, damping: 22, mass: 0.6, restDelta: 0.5, restSpeed: 10 }}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={0.25}
                                    onDragEnd={(e, info) => {
                                        const { offset, velocity } = info;
                                        const vx = velocity.x || 0;
                                        const ox = offset.x || 0;
                                        const swipePower = Math.abs(ox) * 0.5 + Math.abs(vx);
                                        const shouldSwipe = swipePower > 600 || Math.abs(ox) > 140;
                                        if (!shouldSwipe) return;
                                        if (ox < 0 && hasNext) {
                                            // swiped left -> go to newer (next)
                                            loadByIndex(currentIndex - 1, 1);
                                        } else if (ox > 0 && hasPrev) {
                                            // swiped right -> go to older (prev)
                                            loadByIndex(currentIndex + 1, -1);
                                        }
                                    }}
                                    style={{ willChange: 'transform, opacity' }}
                                >
                                    {/* Top card panel */}
                                    <motion.div
                                        layoutId={`${(current?.title || title)}-panel`}
                                        className="absolute inset-0 rounded-2xl bg-white shadow-2xl border border-gray-200"
                                        transition={{ type: 'tween', duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
                                        aria-hidden
                                    />

                                    {/* Close button on the moving card */}
                                    <button
                                        type="button"
                                        className="absolute z-30 top-4 right-4 rounded-full bg-gray-200 hover:bg-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                        onPointerDown={(e) => { e.stopPropagation(); }}
                                        onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                                        aria-label="Close"
                                    >
                                        ✕
                                    </button>

                                    {/* Card inner content */}
                                    <div className="relative p-8 sm:p-10 h-full pb-20">
                                        <h2 className="text-3xl font-extrabold mb-4 text-gray-900">{current?.title}</h2>

                                        {dateStr && (
                                            <div className="text-sm text-gray-500 mb-6">{dateStr}</div>
                                        )}

                                        <div className="prose prose-lg max-w-none">
                                            {current?.content && String(current.content).trim().length > 0
                                                ? current.content
                                                : current?.summary}
                                        </div>
                                    </div>

                                    {/* Read more pinned inside the moving card (bottom-right of full card) */}
                                    {current?.slug && (
                                        <a
                                            href={`/blog/${current.slug}`}
                                            className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-gray-900 text-white px-4 py-2 text-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                        >
                                            Read more
                                            <span aria-hidden>→</span>
                                        </a>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* prev/next navigation buttons (link to full post pages) */}
                            {hasPrev && (
                                <button
                                    type="button"
                                    onClick={() => loadByIndex(currentIndex + 1, -1)}
                                    className="group absolute z-20 -left-4 top-1/2 -translate-y-1/2 -translate-x-full sm:translate-x-0 flex items-center justify-center w-11 h-11 rounded-full bg-white border border-gray-200 shadow-md hover:shadow-lg text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    aria-label="Previous post"
                                >
                                    <span aria-hidden>←</span>
                                </button>
                            )}
                            {hasNext && (
                                <button
                                    type="button"
                                    onClick={() => loadByIndex(currentIndex - 1, 1)}
                                    className="group absolute z-20 -right-4 top-1/2 -translate-y-1/2 translate-x-full sm:translate-x-0 flex items-center justify-center w-11 h-11 rounded-full bg-white border border-gray-200 shadow-md hover:shadow-lg text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    aria-label="Next post"
                                >
                                    <span aria-hidden>→</span>
                                </button>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
