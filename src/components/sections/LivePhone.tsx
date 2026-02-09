"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const notifications = [
    { icon: "⭐", text: "Nouvel avis 5 étoiles", sub: "Il y a 2 min", delay: 0 },
    { icon: "📞", text: "Appel entrant", sub: "Depuis Google Maps", delay: 0.15 },
    { icon: "📍", text: "Nouveau itinéraire", sub: "Client en route", delay: 0.3 },
    { icon: "🔔", text: "Réservation confirmée", sub: "Pour demain 19h", delay: 0.45 },
    { icon: "💬", text: "Nouveau message", sub: "Question sur vos horaires", delay: 0.6 },
];

const stats = [
    { value: "+340%", label: "Vues Maps" },
    { value: "+89", label: "Appels/mois" },
    { value: "+127", label: "Avis positifs" },
];

export default function LivePhone() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 0.7", "center center"],
    });

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
                        04
                    </span>
                    <div className="h-px flex-1" style={{ background: "var(--color-white-10)" }} />
                    <span className="text-mono text-[11px] tracking-[0.15em] uppercase" style={{ color: "var(--color-white-30)" }}>
                        La projection
                    </span>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-16 items-center">
                    {/* Text side */}
                    <div>
                        <motion.h2
                            className="text-display mb-6"
                            style={{ fontSize: "clamp(36px, 7vw, 80px)" }}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            Votre téléphone
                            <br />
                            <span style={{ color: "var(--color-gold)" }}>
                                ne s&apos;arrête plus.
                            </span>
                        </motion.h2>

                        <motion.p
                            className="text-lg mb-12"
                            style={{ color: "var(--color-white-30)" }}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            Les clients vous contactent en continu. Appels, avis, messages — votre commerce devient une destination.
                        </motion.p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    className="glass-dark p-4 rounded-xl text-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                >
                                    <p className="text-display text-xl md:text-2xl mb-1" style={{ color: "var(--color-gold)" }}>
                                        {stat.value}
                                    </p>
                                    <p className="text-mono text-[9px] uppercase tracking-wider" style={{ color: "var(--color-white-30)" }}>
                                        {stat.label}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Phone mockup */}
                    <motion.div
                        className="relative mx-auto"
                        style={{ maxWidth: 280 }}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {/* Phone frame */}
                        <div
                            className="rounded-[40px] p-3 relative"
                            style={{
                                background: "var(--color-surface)",
                                border: "1px solid var(--color-white-10)",
                                boxShadow: "0 0 60px rgba(0,0,0,0.5), 0 0 120px rgba(212,168,85,0.05)",
                            }}
                        >
                            {/* Notch */}
                            <div
                                className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 rounded-b-2xl"
                                style={{ background: "var(--color-surface)" }}
                            />

                            {/* Screen */}
                            <div
                                className="rounded-[28px] overflow-hidden relative"
                                style={{ background: "var(--color-bg)", minHeight: 500 }}
                            >
                                {/* Status bar */}
                                <div className="flex items-center justify-between px-6 py-2 text-[10px] font-medium"
                                    style={{ color: "var(--color-white-60)" }}
                                >
                                    <span>9:41</span>
                                    <div className="flex items-center gap-1">
                                        <div className="w-4 h-2 rounded-sm border border-white/30 relative">
                                            <div className="absolute inset-0.5 rounded-[1px] bg-green-500" />
                                        </div>
                                    </div>
                                </div>

                                {/* Header */}
                                <div className="px-5 pt-4 pb-3" style={{ borderBottom: "1px solid var(--color-white-05)" }}>
                                    <p className="text-xs" style={{ color: "var(--color-white-30)" }}>Google Business</p>
                                    <p className="font-semibold text-sm mt-0.5" style={{ fontFamily: "var(--font-display)" }}>
                                        Notifications
                                    </p>
                                </div>

                                {/* Notifications */}
                                <div className="p-3 space-y-2">
                                    {notifications.map((notif, i) => {
                                        const start = i * 0.15;
                                        const end = start + 0.3;
                                        const x = useTransform(scrollYProgress, [start, end], [200, 0]);
                                        const opacity = useTransform(scrollYProgress, [start, start + 0.1], [0, 1]);

                                        return (
                                            <motion.div
                                                key={i}
                                                className="flex items-start gap-3 p-3 rounded-xl"
                                                style={{
                                                    x,
                                                    opacity,
                                                    background: "var(--color-white-05)",
                                                    border: "1px solid var(--color-white-05)",
                                                }}
                                            >
                                                <span className="text-lg flex-shrink-0">{notif.icon}</span>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-medium truncate">{notif.text}</p>
                                                    <p className="text-[10px] mt-0.5" style={{ color: "var(--color-white-30)" }}>
                                                        {notif.sub}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
