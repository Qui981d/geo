"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const elements = [
    { icon: "⭐⭐⭐⭐⭐", label: "127 avis", sub: "Note maximale" },
    { icon: "📞", label: "Appeler", sub: "En un tap" },
    { icon: "📍", label: "Itinéraire", sub: "Navigation GPS" },
    { icon: "🕐", label: "Ouvert — 19h", sub: "Horaires à jour" },
    { icon: "🌐", label: "Site Web", sub: "Lien direct" },
    { icon: "📸", label: "42 photos", sub: "Galerie optimisée" },
];

export default function GmbExploded() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 0.8", "center center"],
    });

    const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

    return (
        <section className="relative py-32 px-6" ref={containerRef}>
            <div className="max-w-5xl mx-auto">
                {/* Section label */}
                <motion.div
                    className="flex items-center gap-4 mb-16"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <span className="text-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: "var(--color-gold)" }}>
                        02
                    </span>
                    <div className="h-px flex-1" style={{ background: "var(--color-white-10)" }} />
                    <span className="text-mono text-[11px] tracking-[0.15em] uppercase" style={{ color: "var(--color-white-30)" }}>
                        La solution
                    </span>
                </motion.div>

                {/* Title */}
                <motion.h2
                    className="text-display mb-6"
                    style={{ fontSize: "clamp(36px, 7vw, 80px)" }}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    Une fiche Google
                    <br />
                    <span className="glow-gold" style={{ color: "var(--color-gold)" }}>
                        qui travaille pour vous.
                    </span>
                </motion.h2>

                <motion.p
                    className="text-lg mb-16 max-w-md"
                    style={{ color: "var(--color-white-30)" }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    Chaque élément de votre fiche Google est optimisé pour attirer, convaincre et convertir.
                </motion.p>

                {/* Card */}
                <div className="max-w-lg mx-auto">
                    <div className="glass-dark rounded-2xl overflow-hidden">
                        {/* Card header */}
                        <div className="p-6 flex items-center gap-4" style={{ borderBottom: "1px solid var(--color-white-05)" }}>
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                                style={{ background: "var(--color-gold-dim)" }}
                            >
                                🏪
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg" style={{ fontFamily: "var(--font-display)" }}>
                                    Votre Entreprise
                                </h3>
                                <p className="text-sm" style={{ color: "var(--color-white-30)" }}>
                                    Commerce local vérifié ✓
                                </p>
                            </div>
                        </div>

                        {/* Elements fly in */}
                        <div className="p-4 space-y-1">
                            {elements.map((el, i) => {
                                const staggerStart = i * 0.13;
                                const staggerEnd = Math.min(staggerStart + 0.4, 1);
                                const x = useTransform(progress, [staggerStart, staggerEnd], [i % 2 === 0 ? -300 : 300, 0]);
                                const opacity = useTransform(progress, [staggerStart, staggerStart + 0.15], [0, 1]);
                                const scale = useTransform(progress, [staggerStart, staggerEnd], [0.7, 1]);

                                return (
                                    <motion.div
                                        key={i}
                                        className="flex items-center gap-4 p-4 rounded-xl transition-colors"
                                        style={{
                                            x,
                                            opacity,
                                            scale,
                                            background: "var(--color-white-05)",
                                        }}
                                    >
                                        <span className="text-xl flex-shrink-0 w-10 text-center">{el.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium" style={{ fontFamily: "var(--font-display)" }}>{el.label}</p>
                                            <p className="text-xs" style={{ color: "var(--color-white-30)" }}>{el.sub}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Mini map */}
                        <motion.div
                            className="mx-4 mb-4 rounded-xl overflow-hidden"
                            style={{
                                opacity: useTransform(progress, [0.7, 1], [0, 1]),
                                background: "var(--color-white-05)",
                                height: 80,
                            }}
                        >
                            <svg width="100%" height="100%" viewBox="0 0 400 80" preserveAspectRatio="none">
                                <defs>
                                    <pattern id="mapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                                    </pattern>
                                </defs>
                                <rect width="400" height="80" fill="url(#mapGrid)" />
                                <circle cx="200" cy="40" r="6" fill="none" stroke="var(--color-gold)" strokeWidth="1" opacity="0.4" />
                                <circle cx="200" cy="40" r="2.5" fill="var(--color-gold)" />
                            </svg>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
