import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.summary]
 * @param {string} [props.content]
 * @param {string | Date | null} [props.date]
 * @param {string} [props.className]
 */
export default function BlogCard({
                                     title,
                                     summary,
                                     content,
                                     date,
                                     className = "",
                                 }) {
    const [isOpen, setIsOpen] = useState(false);

    let dateStr = "";
    if (date) {
        const d = date instanceof Date ? date : new Date(date);
        if (!Number.isNaN(d.getTime())) {
            dateStr = d.toLocaleDateString();
        }
    }

    return (
        <>
            {/* collapsed card */}
            <motion.div
                className={`relative rounded-2xl p-6 sm:p-8 transition-transform duration-200 transform-gpu
          flex flex-col gap-3 w-full h-48 md:h-56 overflow-hidden text-gray-900
          cursor-pointer ${className}`}
                onClick={() => setIsOpen(true)}
            >
                {/* Animated background panel (shared) */}
                <motion.div
                    layoutId={`${title}-panel`}
                    className="absolute inset-0 rounded-2xl bg-white/90 border border-gray-200 shadow-lg"
                    transition={{ type: 'tween', duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
                    aria-hidden
                />
                {dateStr && (
                    <div className="absolute top-4 right-4">
            <span className="text-xs px-2 py-1 rounded-full border bg-gray-100 border-gray-200">
              {dateStr}
            </span>
                    </div>
                )}

                <h2 className="relative z-10 text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
                    {title}
                </h2>

                {summary && (
                    <p className="relative z-10 text-lg opacity-90 line-clamp-3">{summary}</p>
                )}
            </motion.div>

            {/* expanded modal version */}
            <AnimatePresence mode="wait">
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6"
                        onClick={() => setIsOpen(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                        style={{ willChange: 'opacity' }}
                    >
                        <motion.div
                            className="relative rounded-2xl p-8 max-w-3xl w-full min-h-[65vh] max-h-[90vh] overflow-y-auto transform-gpu"
                            onClick={(e) => e.stopPropagation()}
                            style={{ willChange: 'transform, height, width' }}
                        >
                            {/* Animated background panel (shared) */}
                            <motion.div
                                layoutId={`${title}-panel`}
                                className="absolute inset-0 rounded-2xl bg-white shadow-xl"
                                transition={{ type: 'tween', duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
                                aria-hidden
                            />
                            <button
                                className="absolute top-4 right-4 rounded-full bg-gray-200 hover:bg-gray-300 p-2"
                                onClick={() => setIsOpen(false)}
                            >
                                ✕
                            </button>

                            <motion.div
                                key="content"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 8 }}
                                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                                layout={false}
                            >
                                <h2 className="relative z-10 text-3xl font-extrabold mb-4">{title}</h2>

                                {dateStr && (
                                    <div className="relative z-10 text-sm text-gray-500 mb-6">{dateStr}</div>
                                )}

                                <div className="relative z-10 prose prose-lg max-w-none">
                                    {content && content.trim().length > 0 ? content : summary}
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
