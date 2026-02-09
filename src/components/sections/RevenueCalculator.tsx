"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

function AnimatedNumber({ value, duration = 1.5 }: { value: number; duration?: number }) {
    const [display, setDisplay] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: false });

    useEffect(() => {
        if (!isInView) return;
        const startTime = performance.now();
        const animate = (now: number) => {
            const elapsed = now - startTime;
            const p = Math.min(elapsed / (duration * 1000), 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(Math.round(eased * value));
            if (p < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [value, duration, isInView]);

    return <span ref={ref}>{display.toLocaleString("fr-CH")}</span>;
}

export default function RevenueCalculator() {
    const [basket, setBasket] = useState(80);
    const [clients, setClients] = useState(15);

    const additionalClients = Math.round(clients * 0.4);
    const monthlyGain = basket * additionalClients;
    const yearlyGain = monthlyGain * 12;

    const bars = [
        { label: "Actuel", value: clients },
        { label: "+1 mois", value: clients + additionalClients * 0.3 },
        { label: "+3 mois", value: clients + additionalClients * 0.6 },
        { label: "+6 mois", value: clients + additionalClients },
    ];
    const maxBar = Math.max(...bars.map((b) => b.value));

    return (
        <section className="relative py-32 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Section label */}
                <motion.div
                    className="flex items-center gap-4 mb-16"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <span className="text-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: "var(--color-gold)" }}>
                        03
                    </span>
                    <div className="h-px flex-1" style={{ background: "var(--color-white-10)" }} />
                    <span className="text-mono text-[11px] tracking-[0.15em] uppercase" style={{ color: "var(--color-white-30)" }}>
                        Le manque à gagner
                    </span>
                </motion.div>

                {/* Title */}
                <motion.h2
                    className="text-display mb-16"
                    style={{ fontSize: "clamp(36px, 7vw, 80px)" }}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    Combien vous{" "}
                    <span style={{ color: "var(--color-gold)" }}>perdez</span>
                    <br />
                    <span style={{ color: "var(--color-white-30)" }}>chaque mois ?</span>
                </motion.h2>

                <div className="grid md:grid-cols-2 gap-16 items-start">
                    {/* Sliders */}
                    <div className="space-y-8">
                        {/* Basket slider */}
                        <div className="glass-dark p-6 rounded-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <label className="text-sm" style={{ color: "var(--color-white-60)", fontFamily: "var(--font-display)" }}>
                                    Panier moyen
                                </label>
                                <span className="text-mono text-lg font-bold" style={{ color: "var(--color-gold)" }}>
                                    {basket} CHF
                                </span>
                            </div>
                            <input
                                type="range" min="20" max="300" value={basket}
                                onChange={(e) => setBasket(Number(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-mono text-[10px] mt-3" style={{ color: "var(--color-white-30)" }}>
                                <span>20</span><span>300</span>
                            </div>
                        </div>

                        {/* Clients slider */}
                        <div className="glass-dark p-6 rounded-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <label className="text-sm" style={{ color: "var(--color-white-60)", fontFamily: "var(--font-display)" }}>
                                    Clients / semaine
                                </label>
                                <span className="text-mono text-lg font-bold" style={{ color: "var(--color-gold)" }}>
                                    {clients}
                                </span>
                            </div>
                            <input
                                type="range" min="5" max="100" value={clients}
                                onChange={(e) => setClients(Number(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-mono text-[10px] mt-3" style={{ color: "var(--color-white-30)" }}>
                                <span>5</span><span>100</span>
                            </div>
                        </div>

                        {/* Yearly result */}
                        <div className="glass-dark p-8 rounded-2xl text-center" style={{ border: "1px solid rgba(212,168,85,0.15)" }}>
                            <p className="text-mono text-xs uppercase tracking-wider mb-3" style={{ color: "var(--color-white-30)" }}>
                                Revenue manqué par an
                            </p>
                            <p className="text-display shimmer-gold" style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>
                                +<AnimatedNumber value={yearlyGain} /> CHF
                            </p>
                            <p className="text-mono text-xs mt-3" style={{ color: "var(--color-white-30)" }}>
                                soit +{additionalClients} clients/semaine × {basket} CHF
                            </p>
                        </div>
                    </div>

                    {/* Growth bars */}
                    <motion.div
                        className="flex items-end justify-center gap-6 h-80"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        {bars.map((bar, i) => (
                            <div key={bar.label} className="flex flex-col items-center gap-3 flex-1">
                                <span className="text-mono text-[10px]" style={{ color: "var(--color-white-30)" }}>
                                    {i === 0 ? "" : `+${Math.round(((bar.value - clients) / clients) * 100)}%`}
                                </span>
                                <motion.div
                                    className="w-full rounded-t-lg relative overflow-hidden"
                                    style={{
                                        background: i === 0
                                            ? "var(--color-white-10)"
                                            : `linear-gradient(180deg, var(--color-gold) 0%, rgba(212,168,85,0.3) 100%)`,
                                        maxWidth: 64,
                                    }}
                                    initial={{ height: 0 }}
                                    whileInView={{ height: `${(bar.value / maxBar) * 240}px` }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 + i * 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    {i > 0 && (
                                        <motion.div
                                            className="absolute inset-0"
                                            style={{
                                                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                                                backgroundSize: "200% 100%",
                                            }}
                                            animate={{ backgroundPosition: ["-200% 0%", "200% 0%"] }}
                                            transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
                                        />
                                    )}
                                </motion.div>
                                <span className="text-mono text-[10px] text-center" style={{ color: "var(--color-white-30)" }}>
                                    {bar.label}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
