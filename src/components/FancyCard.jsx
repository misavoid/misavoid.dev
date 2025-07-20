import { motion } from "framer-motion";

export default function FancyCard({ title, children, github, variant = "neutral", className = "" }) {
    // ...styles as before
    const isGradient = variant === "gradient";
    const base =
        "relative rounded-2xl border p-6 sm:p-8 mb-6 transition-all duration-200 flex flex-col gap-2 max-w-xl w-full cursor-pointer";
    const neutral =
        "bg-white/90 border-gray-200 shadow-lg text-gray-900 hover:-translate-y-1";
    const gradient =
        "bg-gradient-to-br from-indigo-500/90 to-fuchsia-500/80 border-white/30 shadow-xl text-white hover:shadow-2xl";

    return (
        <motion.div
            whileHover={{
                scale: 1.025,
                boxShadow: isGradient
                    ? "0 16px 40px 0 rgba(136,58,255,0.14)"
                    : "0 12px 32px 0 rgba(0,0,0,0.07)",
                y: -8
            }}
            // 👇 Forward the className prop!
            className={`${base} ${isGradient ? gradient : neutral} ${className}`}
            style={{ willChange: "transform, box-shadow" }}
        >
            {github && (
                <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View on GitHub"
                    className={`absolute top-4 right-4 p-2 rounded-full bg-[#FFD600] hover:bg-yellow-400 shadow-lg border-2 border-white/60 transition`}
                >
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M12 .297a12 12 0 00-3.79 23.4c.6.11.82-.26.82-.58v-2.19c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.09-.73.09-.73 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.67-.31-5.47-1.34-5.47-5.94 0-1.31.47-2.38 1.24-3.22-.12-.32-.54-1.58.12-3.3 0 0 1.01-.32 3.3 1.23a11.47 11.47 0 016 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.72.24 2.98.12 3.3.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.48 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.21.69.83.57A12.004 12.004 0 0012 .297"
                        />
                    </svg>
                </a>
            )}
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">{title}</h2>
            <div className="text-lg opacity-90">{children}</div>
        </motion.div>
    );
}
