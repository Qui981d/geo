"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

interface ScoreCategory {
    label: string;
    score: number;
    max: number;
    color: string;
    detail: string;
}

function ScoreRing({
    score, max, size, strokeWidth, color, delay,
}: {
    score: number; max: number; size: number; strokeWidth: number; color: string; delay: number;
}) {
    const r = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * r;
    const pct = score / max;
    const offset = circumference * (1 - pct);

    return (
        <svg width={size} height={size} className="transform -rotate-90">
            {/* Track */}
            <circle
                cx={size / 2} cy={size / 2} r={r}
                fill="none" stroke="#E8E6E1" strokeWidth={strokeWidth}
            />
            {/* Progress */}
            <motion.circle
                cx={size / 2} cy={size / 2} r={r}
                fill="none" stroke={color} strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ delay, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
        </svg>
    );
}

function AnimNum({ value, delay = 0 }: { value: number; delay?: number }) {
    const [display, setDisplay] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });
    const started = useRef(false);

    useEffect(() => {
        if (!inView || started.current) return;
        started.current = true;
        const timeout = setTimeout(() => {
            const start = performance.now();
            const animate = (now: number) => {
                const p = Math.min((now - start) / 1200, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                setDisplay(Math.round(eased * value));
                if (p < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }, delay * 1000);
        return () => clearTimeout(timeout);
    }, [inView, value, delay]);

    return <span ref={ref}>{display}</span>;
}

export default function AuditScore() {
    const [business, setBusiness] = useState("");
    const [phase, setPhase] = useState<"idle" | "scanning" | "done">("idle");
    const [scores, setScores] = useState<ScoreCategory[]>([]);

    const scan = useCallback(() => {
        if (!business.trim() || phase !== "idle") return;
        setPhase("scanning");

        setTimeout(() => {
            setScores([
                { label: "Visibilité", score: 32, max: 100, color: "#E53935", detail: "Très faible" },
                { label: "Fiche Google", score: 45, max: 100, color: "#F57C00", detail: "Incomplète" },
                { label: "Avis clients", score: 58, max: 100, color: "#F57C00", detail: "Peut mieux faire" },
                { label: "Photos", score: 20, max: 100, color: "#E53935", detail: "Insuffisant" },
            ]);
            setPhase("done");
        }, 2800);
    }, [business, phase]);

    const globalScore = scores.length
        ? Math.round(scores.reduce((s, c) => s + c.score, 0) / scores.length)
        : 0;

    const getGrade = (s: number) => {
        if (s >= 90) return { grade: "A+", color: "#43A047" };
        if (s >= 75) return { grade: "A", color: "#43A047" };
        if (s >= 60) return { grade: "B", color: "#F57C00" };
        if (s >= 40) return { grade: "C", color: "#F57C00" };
        return { grade: "D", color: "#E53935" };
    };

    const { grade, color: gradeColor } = getGrade(globalScore);

    return (
        <section className="relative py-28 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <div className="grid md:grid-cols-2 gap-8 items-end mb-16">
                    <div>
                        <motion.p
                            className="font-mono text-[11px] tracking-[0.2em] uppercase mb-4"
                            style={{ color: "#C8944A" }}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            01 — Diagnostic
                        </motion.p>
                        <motion.h2
                            className="font-editorial"
                            style={{ fontSize: "clamp(32px, 6vw, 64px)" }}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            Votre score de
                            <br />
                            <em style={{ color: "#C8944A", fontStyle: "italic" }}>visibilité locale</em>
                        </motion.h2>
                    </div>
                    <motion.p
                        className="text-lg leading-relaxed"
                        style={{ color: "#8A8A82" }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        Nous analysons 4 critères clés pour évaluer la performance de votre présence sur Google Maps.
                    </motion.p>
                </div>

                {/* Input */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-3 max-w-xl mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <input
                        type="text"
                        value={business}
                        onChange={(e) => setBusiness(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && scan()}
                        placeholder="Nom de votre commerce..."
                        disabled={phase !== "idle"}
                        className="flex-1 px-5 py-4 rounded-2xl text-sm outline-none transition-all"
                        style={{
                            background: "white",
                            border: "1.5px solid #E8E6E1",
                            color: "#1A1A1A",
                        }}
                    />
                    <motion.button
                        onClick={scan}
                        disabled={phase !== "idle" || !business.trim()}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-8 py-4 rounded-2xl text-sm font-semibold tracking-wide transition-all disabled:opacity-40"
                        style={{
                            background: "#0F2B46",
                            color: "white",
                            fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        {phase === "scanning" ? "Analyse..." : "Analyser"}
                    </motion.button>
                </motion.div>

                {/* Scanning state */}
                <AnimatePresence>
                    {phase === "scanning" && (
                        <motion.div
                            className="flex flex-col items-center py-20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {/* Pulsing rings */}
                            <div className="relative w-24 h-24 mb-8">
                                {[0, 0.5, 1].map((delay) => (
                                    <motion.div
                                        key={delay}
                                        className="absolute inset-0 rounded-full"
                                        style={{ border: "1.5px solid #C8944A" }}
                                        animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
                                        transition={{ delay, duration: 2, repeat: Infinity }}
                                    />
                                ))}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-3 h-3 rounded-full" style={{ background: "#C8944A" }} />
                                </div>
                            </div>
                            <p className="font-mono text-xs tracking-wider" style={{ color: "#8A8A82" }}>
                                Analyse en cours pour <strong style={{ color: "#1A1A1A" }}>{business}</strong>
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results */}
                <AnimatePresence>
                    {phase === "done" && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="grid md:grid-cols-[280px_1fr] gap-16 items-start">
                                {/* Global score */}
                                <motion.div
                                    className="text-center p-10 rounded-3xl"
                                    style={{ background: "white", border: "1px solid #E8E6E1" }}
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="relative inline-block mb-4">
                                        <ScoreRing score={globalScore} max={100} size={140} strokeWidth={6} color={gradeColor} delay={0.4} />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="font-editorial text-4xl" style={{ color: gradeColor }}>
                                                {grade}
                                            </span>
                                            <span className="font-mono text-xs mt-1" style={{ color: "#8A8A82" }}>
                                                <AnimNum value={globalScore} delay={0.5} />/100
                                            </span>
                                        </div>
                                    </div>
                                    <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "#8A8A82" }}>
                                        Score global
                                    </p>
                                    <p className="text-sm mt-2 font-medium" style={{ color: gradeColor }}>
                                        Potentiel sous-exploité
                                    </p>
                                </motion.div>

                                {/* Category breakdown */}
                                <div className="space-y-6">
                                    {scores.map((cat, i) => (
                                        <motion.div
                                            key={cat.label}
                                            className="flex items-center gap-6 p-5 rounded-2xl"
                                            style={{ background: "white", border: "1px solid #E8E6E1" }}
                                            initial={{ opacity: 0, x: 30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + i * 0.12 }}
                                        >
                                            {/* Mini ring */}
                                            <div className="flex-shrink-0 relative">
                                                <ScoreRing
                                                    score={cat.score} max={cat.max} size={56} strokeWidth={4} color={cat.color}
                                                    delay={0.5 + i * 0.15}
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="font-mono text-xs font-bold" style={{ color: cat.color }}>
                                                        <AnimNum value={cat.score} delay={0.6 + i * 0.15} />
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-sm font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>
                                                        {cat.label}
                                                    </h4>
                                                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-full"
                                                        style={{ background: `${cat.color}12`, color: cat.color }}
                                                    >
                                                        {cat.detail}
                                                    </span>
                                                </div>
                                                {/* Progress bar */}
                                                <div className="h-1.5 rounded-full" style={{ background: "#F0EEE9" }}>
                                                    <motion.div
                                                        className="h-full rounded-full"
                                                        style={{ background: cat.color }}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${cat.score}%` }}
                                                        transition={{ delay: 0.6 + i * 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {/* CTA */}
                                    <motion.div
                                        className="p-6 rounded-2xl text-center"
                                        style={{ background: "rgba(200,148,74,0.06)", border: "1px solid rgba(200,148,74,0.15)" }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1 }}
                                    >
                                        <p className="text-sm mb-1" style={{ color: "#8A8A82" }}>
                                            Envie du rapport complet avec les recommandations ?
                                        </p>
                                        <p className="text-sm font-semibold" style={{ color: "#C8944A" }}>
                                            ↓ Demandez votre audit gratuit ci-dessous
                                        </p>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
