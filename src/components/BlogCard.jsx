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
                layoutId={title} // important for smooth animation
                className={`relative rounded-2xl border p-6 sm:p-8 transition-all duration-200
          flex flex-col gap-3 w-full h-48 md:h-56 overflow-hidden
          bg-white/90 border-gray-200 shadow-lg text-gray-900
          hover:-translate-y-1 cursor-pointer ${className}`}
                onClick={() => setIsOpen(true)}
            >
                {dateStr && (
                    <div className="absolute top-4 right-4">
            <span className="text-xs px-2 py-1 rounded-full border bg-gray-100 border-gray-200">
              {dateStr}
            </span>
                    </div>
                )}

                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
                    {title}
                </h2>

                {summary && (
                    <p className="text-lg opacity-90 line-clamp-3">{summary}</p>
                )}
            </motion.div>

            {/* expanded modal version */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6"
                        onClick={() => setIsOpen(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            layoutId={title}
                            className="relative bg-white rounded-2xl shadow-xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="absolute top-4 right-4 rounded-full bg-gray-200 hover:bg-gray-300 p-2"
                                onClick={() => setIsOpen(false)}
                            >
                                ✕
                            </button>

                            <h2 className="text-3xl font-extrabold mb-4">{title}</h2>

                            {dateStr && (
                                <div className="text-sm text-gray-500 mb-6">{dateStr}</div>
                            )}

                            <div className="prose prose-lg max-w-none">
                                {content && content.trim().length > 0 ? content : summary}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
