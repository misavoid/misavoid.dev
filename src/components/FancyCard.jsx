import { useMemo, useState } from "react";
import { motion } from "framer-motion";

export default function FancyCard({ title, children, github, website, variant = "neutral", deck = false, className = "" }) {
    // ...styles as before
    const isGradient = variant === "gradient";
    const base =
        "relative rounded-2xl border p-6 sm:p-8 transition-all duration-200 flex flex-col gap-2 w-full h-full transform-gpu";
    const neutral =
        "bg-white/90 border-gray-200 shadow-lg text-gray-900 hover:-translate-y-1";
    const gradient =
        "bg-gradient-to-br from-indigo-500/90 to-fuchsia-500/80 border-white/30 ring-1 ring-white/20 shadow-xl text-white hover:shadow-2xl";

    // Slight per-card tilt and hover state for jiggly deck
    const baseTilt = useMemo(() => (Math.random() * 2 - 1) * 3, []); // -3..3 deg
    const deckTiltA = baseTilt - 2;
    const deckTiltB = baseTilt + 2;
    const [hovered, setHovered] = useState(false);

    return (
        <div className={`${className} relative w-full h-full`}>
            {deck && (
                <div className="pointer-events-none absolute inset-0 z-0">
                    <motion.div
                        className={`absolute -inset-x-4 -top-4 -bottom-4 rounded-2xl ${
                            isGradient
                                ? 'bg-gradient-to-br from-violet-300/30 to-fuchsia-300/25'
                                : 'bg-white/70'
                        } shadow-md blur-[1px]`}
                        aria-hidden
                        initial={false}
                        animate={hovered ? 'hover' : 'rest'}
                        variants={{
                            rest: { rotate: deckTiltA, y: 0, transition: { type: 'spring', stiffness: 600, damping: 26 } },
                            hover: { rotate: deckTiltA + (deckTiltA >= 0 ? -2.5 : 2.5), y: -2, transition: { type: 'spring', stiffness: 900, damping: 18, mass: 0.5 } },
                        }}
                    />
                    <motion.div
                        className={`absolute -inset-x-3 -top-3 -bottom-3 rounded-2xl ${
                            isGradient
                                ? 'bg-gradient-to-br from-violet-200/30 to-fuchsia-200/20'
                                : 'bg-white/80'
                        } shadow-lg blur-[0.5px]`}
                        aria-hidden
                        initial={false}
                        animate={hovered ? 'hover' : 'rest'}
                        variants={{
                            rest: { rotate: deckTiltB, y: 0, transition: { type: 'spring', stiffness: 600, damping: 26 } },
                            hover: { rotate: deckTiltB + (deckTiltB >= 0 ? 3.5 : -3.5), y: -3, transition: { type: 'spring', stiffness: 900, damping: 18, mass: 0.5 } },
                        }}
                    />
                </div>
            )}

            <motion.div
            whileHover={{
                scale: 1.02,
                rotate: deck ? -5 : (baseTilt * 0.7),
                boxShadow: isGradient
                    ? "0 22px 52px 0 rgba(136,58,255,0.18)"
                    : "0 18px 44px 0 rgba(0,0,0,0.10)",
                y: -10
            }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            // 👇 Forward the className prop!
            className={`${base} ${isGradient ? gradient : neutral}`}
            style={{ willChange: "transform, box-shadow" }}
        >

            {github && (
                <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View on GitHub"
                    onClick={(e) => e.stopPropagation()}
                    className={`absolute z-10 top-4 right-4 p-2 rounded-full bg-[#FFD600] hover:bg-yellow-400 shadow-lg border-2 border-white/60 transition cursor-pointer`}
                >
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M12 .297a12 12 0 00-3.79 23.4c.6.11.82-.26.82-.58v-2.19c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.09-.73.09-.73 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.67-.31-5.47-1.34-5.47-5.94 0-1.31.47-2.38 1.24-3.22-.12-.32-.54-1.58.12-3.3 0 0 1.01-.32 3.3 1.23a11.47 11.47 0 016 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.72.24 2.98.12 3.3.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.48 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.21.69.83.57A12.004 12.004 0 0012 .297"
                        />
                    </svg>
                </a>
            )}
            {website && (
                <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit website"
                    onClick={(e) => e.stopPropagation()}
                    className={`absolute z-10 top-4 right-4 p-2 rounded-full bg-[#FFD600] hover:bg-yellow-400 shadow-lg border-2 border-white/60 transition cursor-pointer`}
                >
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                </a>
            )}
            <h2 className="relative z-10 text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">{title}</h2>
            <div className="relative z-10 text-lg opacity-90">{children}</div>
        </motion.div>
        </div>
    );
}
