"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroSection() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });
    const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
    const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

    return (
        <section ref={ref} className="relative min-h-screen flex items-center justify-center px-6">
            {/* Ambient gradient */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: "radial-gradient(ellipse 80% 50% at 50% 40%, rgba(200, 148, 74, 0.06) 0%, transparent 60%)",
                }}
            />

            <motion.div className="relative z-10 text-center max-w-4xl mx-auto" style={{ y, opacity }}>
                {/* Overline */}
                <motion.p
                    className="font-mono text-xs tracking-[0.25em] uppercase mb-10"
                    style={{ color: "#8A8A82" }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    Audit SEO Local — Gratuit & Sans Engagement
                </motion.p>

                {/* Headline */}
                <h1 className="font-editorial" style={{ fontSize: "clamp(44px, 10vw, 120px)" }}>
                    {["Vos", "clients"].map((word, i) => (
                        <motion.span
                            key={word}
                            className="inline-block mr-[0.22em]"
                            initial={{ y: 60, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 + i * 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {word}
                        </motion.span>
                    ))}
                    <br />
                    <motion.span
                        className="inline-block"
                        style={{ color: "#C8944A" }}
                        initial={{ y: 60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.65, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    >
                        vous cherchent.
                    </motion.span>
                </h1>

                {/* Subline */}
                <motion.p
                    className="mt-8 text-xl max-w-md mx-auto leading-relaxed"
                    style={{ color: "#8A8A82" }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                >
                    Ils ne vous trouvent pas encore.
                    <br />
                    Nous changeons ça.
                </motion.p>

                {/* Scroll cue */}
                <motion.div
                    className="absolute -bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6 }}
                >
                    <motion.div
                        className="w-5 h-8 rounded-full relative"
                        style={{ border: "1.5px solid #E8E6E1" }}
                    >
                        <motion.div
                            className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1 h-1.5 rounded-full"
                            style={{ background: "#C8944A" }}
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity }}
                        />
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
}
