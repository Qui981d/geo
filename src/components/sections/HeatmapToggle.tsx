"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const districts = [
    { id: "d1", d: "M80,120 L120,80 L200,90 L220,130 L180,160 L100,150 Z", label: "Centre-Ville" },
    { id: "d2", d: "M220,130 L280,100 L340,140 L320,190 L260,180 L220,160 Z", label: "Rive Droite" },
    { id: "d3", d: "M100,150 L180,160 L200,220 L160,260 L90,240 L70,190 Z", label: "Quartier Sud" },
    { id: "d4", d: "M220,160 L260,180 L300,230 L260,280 L200,260 L200,220 Z", label: "Zone Est" },
    { id: "d5", d: "M40,80 L80,120 L100,150 L70,190 L30,160 L20,110 Z", label: "Rive Gauche" },
    { id: "d6", d: "M200,90 L280,100 L310,60 L260,30 L200,40 L180,60 Z", label: "Zone Nord" },
    { id: "d7", d: "M160,260 L200,260 L260,280 L240,330 L180,340 L140,310 Z", label: "Banlieue" },
    { id: "d8", d: "M300,230 L360,210 L380,270 L350,310 L290,300 L260,280 Z", label: "Zone Ind." },
];

export default function HeatmapToggle() {
    const [active, setActive] = useState(false);

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
                        05
                    </span>
                    <div className="h-px flex-1" style={{ background: "var(--color-white-10)" }} />
                    <span className="text-mono text-[11px] tracking-[0.15em] uppercase" style={{ color: "var(--color-white-30)" }}>
                        La preuve visuelle
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
                    Votre zone de
                    <br />
                    <span style={{ color: active ? "var(--color-gold)" : "var(--color-white-30)", transition: "color 0.6s" }}>
                        couverture.
                    </span>
                </motion.h2>

                <motion.p
                    className="text-lg mb-8 max-w-md"
                    style={{ color: "var(--color-white-30)" }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    La différence de visibilité avant et après notre intervention.
                </motion.p>

                {/* Toggle */}
                <div className="flex items-center gap-4 mb-12">
                    <span
                        className="text-sm font-semibold transition-colors"
                        style={{
                            color: !active ? "white" : "var(--color-white-30)",
                            fontFamily: "var(--font-display)",
                        }}
                    >
                        Sans le Pack
                    </span>
                    <button
                        onClick={() => setActive(!active)}
                        className={`toggle-cinema ${active ? "active" : ""}`}
                        aria-label="Toggle pack visibility"
                    />
                    <span
                        className="text-sm font-semibold transition-colors"
                        style={{
                            color: active ? "var(--color-gold)" : "var(--color-white-30)",
                            fontFamily: "var(--font-display)",
                        }}
                    >
                        Avec le Pack
                    </span>
                </div>

                {/* Map */}
                <div className="glass-dark p-8 rounded-2xl max-w-2xl">
                    <svg viewBox="0 0 400 370" className="w-full">
                        {/* Grid dots */}
                        {Array.from({ length: 18 }, (_, row) =>
                            Array.from({ length: 20 }, (_, col) => (
                                <circle
                                    key={`${row}-${col}`}
                                    cx={col * 22 + 10}
                                    cy={row * 22 + 10}
                                    r="0.8"
                                    fill="rgba(255,255,255,0.06)"
                                />
                            ))
                        )}

                        {/* Districts */}
                        {districts.map((district, i) => {
                            const isCenter = i === 0;
                            const delay = i * 0.08;

                            return (
                                <g key={district.id}>
                                    <motion.path
                                        d={district.d}
                                        fill={
                                            active
                                                ? isCenter
                                                    ? "rgba(212,168,85,0.4)"
                                                    : `rgba(212,168,85,${0.08 + i * 0.03})`
                                                : isCenter
                                                    ? "rgba(255,255,255,0.06)"
                                                    : "rgba(255,255,255,0.02)"
                                        }
                                        stroke={
                                            active
                                                ? "rgba(212,168,85,0.3)"
                                                : "rgba(255,255,255,0.06)"
                                        }
                                        strokeWidth="1"
                                        initial={false}
                                        animate={{
                                            fill: active
                                                ? isCenter
                                                    ? "rgba(212,168,85,0.4)"
                                                    : `rgba(212,168,85,${0.08 + i * 0.03})`
                                                : isCenter
                                                    ? "rgba(255,255,255,0.06)"
                                                    : "rgba(255,255,255,0.02)",
                                        }}
                                        transition={{ duration: 0.6, delay }}
                                    />
                                    {active && (
                                        <motion.path
                                            d={district.d}
                                            fill="none"
                                            stroke="rgba(212,168,85,0.5)"
                                            strokeWidth="1.5"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: [0, 0.5, 0] }}
                                            transition={{ duration: 2.5, delay: delay + 0.3, repeat: Infinity }}
                                            style={{ filter: "blur(3px)" }}
                                        />
                                    )}
                                </g>
                            );
                        })}

                        {/* Center marker */}
                        <motion.circle
                            cx="160"
                            cy="140"
                            r={active ? 7 : 4}
                            fill={active ? "var(--color-gold)" : "rgba(255,255,255,0.25)"}
                            transition={{ duration: 0.4 }}
                            style={{
                                filter: active
                                    ? "drop-shadow(0 0 12px rgba(212,168,85,0.6))"
                                    : "none",
                            }}
                        />
                        {active && (
                            <motion.circle
                                cx="160" cy="140" r="7"
                                fill="none"
                                stroke="var(--color-gold)"
                                strokeWidth="1.5"
                                initial={{ r: 7, opacity: 0.6 }}
                                animate={{ r: 35, opacity: 0 }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                        )}

                        {/* Labels */}
                        {districts.slice(0, 4).map((district, i) => {
                            const positions = [
                                { x: 150, y: 125 }, { x: 280, y: 155 },
                                { x: 140, y: 210 }, { x: 245, y: 225 },
                            ];
                            return (
                                <motion.text
                                    key={`label-${district.id}`}
                                    x={positions[i].x}
                                    y={positions[i].y}
                                    textAnchor="middle"
                                    fontSize="8"
                                    fontWeight="500"
                                    fill={active ? "var(--color-gold)" : "rgba(255,255,255,0.15)"}
                                    fontFamily="var(--font-mono)"
                                    initial={false}
                                    animate={{ opacity: active ? 0.8 : 0.3 }}
                                    transition={{ duration: 0.4, delay: i * 0.1 }}
                                >
                                    {district.label}
                                </motion.text>
                            );
                        })}
                    </svg>

                    {/* Legend */}
                    <div className="flex items-center gap-6 mt-4 pt-4" style={{ borderTop: "1px solid var(--color-white-05)" }}>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-2.5 h-2.5 rounded-full transition-all"
                                style={{
                                    background: active ? "var(--color-gold)" : "rgba(255,255,255,0.15)",
                                    boxShadow: active ? "0 0 8px rgba(212,168,85,0.4)" : "none",
                                }}
                            />
                            <span className="text-mono text-[10px]" style={{ color: "var(--color-white-30)" }}>
                                Votre position
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-2.5 h-2.5 rounded transition-all"
                                style={{
                                    background: active ? "rgba(212,168,85,0.25)" : "rgba(255,255,255,0.06)",
                                }}
                            />
                            <span className="text-mono text-[10px]" style={{ color: "var(--color-white-30)" }}>
                                Zone de visibilité
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
