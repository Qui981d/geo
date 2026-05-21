"use client";

import { useState, useEffect, useCallback, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   CHANNEL DATA
   ═══════════════════════════════════════════════════════════════ */
const CHANNELS = [
    { id: 1, name: "AGENCE TV", color: "#e63946", icon: "📡" },
    { id: 2, name: "LE JOURNAL", color: "#1d3557", icon: "📰" },
    { id: 3, name: "PUB PRIME", color: "#e9c46a", icon: "✨" },
    { id: 4, name: "SOCIAL LIVE", color: "#e76f51", icon: "📱" },
    { id: 5, name: "LA MÉTÉO", color: "#2a9d8f", icon: "🌤️" },
    { id: 6, name: "L'APPEL", color: "#6c63ff", icon: "📞" },
];


/* ═══════════════════════════════════════════════════════════════
   TV STATIC — glitch transition effect
   ═══════════════════════════════════════════════════════════════ */
function TVStatic({ active }: { active: boolean }) {
    return (
        <AnimatePresence>
            {active && (
                <motion.div
                    className="absolute inset-0 z-[60] pointer-events-none"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                >
                    {/* Noise layer */}
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                            backgroundSize: "128px 128px",
                            opacity: 0.7,
                            mixBlendMode: "overlay",
                            animation: "staticMove 0.1s steps(8) infinite",
                        }}
                    />
                    {/* White flash bars */}
                    <motion.div
                        className="absolute left-0 right-0"
                        style={{
                            height: "3px",
                            background: "rgba(255,255,255,0.8)",
                            top: "30%",
                        }}
                        animate={{ top: ["10%", "90%"] }}
                        transition={{ duration: 0.12, repeat: 2 }}
                    />
                    <motion.div
                        className="absolute left-0 right-0"
                        style={{
                            height: "2px",
                            background: "rgba(255,255,255,0.5)",
                            top: "60%",
                        }}
                        animate={{ top: ["80%", "5%"] }}
                        transition={{ duration: 0.08, repeat: 3 }}
                    />
                    {/* Color distortion */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: "linear-gradient(transparent 50%, rgba(0,0,0,0.15) 50%)",
                            backgroundSize: "100% 4px",
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}


/* ═══════════════════════════════════════════════════════════════
   TV OSD — on-screen display (channel number popup)
   ═══════════════════════════════════════════════════════════════ */
function TVOSD({ channel, visible }: { channel: typeof CHANNELS[0]; visible: boolean }) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="absolute top-6 right-6 z-[55] flex items-center gap-3"
                    initial={{ opacity: 0, x: 30, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 30, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div
                        className="px-4 py-2 rounded-lg flex items-center gap-2.5"
                        style={{
                            background: "rgba(0,0,0,0.75)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255,255,255,0.1)",
                        }}
                    >
                        <span className="text-lg">{channel.icon}</span>
                        <div>
                            <div className="flex items-center gap-2">
                                <span
                                    className="font-mono text-2xl font-black leading-none"
                                    style={{ color: channel.color }}
                                >
                                    {channel.id}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                                    {channel.name}
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}


/* ═══════════════════════════════════════════════════════════════
   SCAN LINES + TV EFFECTS OVERLAY
   ═══════════════════════════════════════════════════════════════ */
function TVOverlay() {
    return (
        <div className="absolute inset-0 pointer-events-none z-[40]">
            {/* Scan lines */}
            <div
                className="absolute inset-0"
                style={{
                    background: "repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
                }}
            />
            {/* Screen curvature vignette */}
            <div
                className="absolute inset-0"
                style={{
                    background: "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 60%, rgba(0,0,0,0.4) 100%)",
                }}
            />
            {/* Screen reflection */}
            <div
                className="absolute"
                style={{
                    top: "5%",
                    left: "10%",
                    width: "35%",
                    height: "25%",
                    background: "linear-gradient(135deg, rgba(255,255,255,0.04), transparent)",
                    borderRadius: "50%",
                    filter: "blur(20px)",
                }}
            />
            {/* REC indicator */}
            <div className="absolute bottom-4 left-5 flex items-center gap-2">
                <motion.div
                    className="w-2 h-2 rounded-full"
                    style={{ background: "#e63946" }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="font-mono text-[10px] text-white/30 tracking-widest">REC</span>
            </div>
        </div>
    );
}


/* ═══════════════════════════════════════════════════════════════
   CH.1 — AGENCE TV (Test Pattern / Mire)
   ═══════════════════════════════════════════════════════════════ */
function ChannelMire() {
    return (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden"
            style={{ background: "#0a0a0a" }}
        >
            {/* Retro color bars at top */}
            <div className="absolute top-0 left-0 right-0 flex h-[6px]">
                {["#fff", "#ffff00", "#00ffff", "#00ff00", "#ff00ff", "#ff0000", "#0000ff"].map((c, i) => (
                    <div key={i} style={{ flex: 1, background: c }} />
                ))}
            </div>

            {/* Central content */}
            <motion.div
                className="text-center relative z-10"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* Animated rings */}
                <div className="relative inline-block mb-8">
                    {[120, 160, 200].map((size, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                width: size,
                                height: size,
                                border: `1px solid rgba(255,255,255,${0.08 - i * 0.02})`,
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                            }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20 + i * 10, repeat: Infinity, ease: "linear" }}
                        />
                    ))}
                    <motion.div
                        className="text-7xl relative z-10"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        📡
                    </motion.div>
                </div>

                <motion.h1
                    className="text-5xl md:text-7xl font-black tracking-tighter"
                    style={{ color: "#fff" }}
                    initial={{ y: 30 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    MOSH
                </motion.h1>
                <motion.div
                    className="mt-2 font-mono text-sm tracking-[0.4em] uppercase"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Agence de Communication
                </motion.div>

                {/* Pulse line */}
                <motion.div
                    className="mt-10 mx-auto"
                    style={{
                        width: "200px",
                        height: "2px",
                        background: "linear-gradient(90deg, transparent, #e63946, transparent)",
                    }}
                    animate={{ scaleX: [0, 1, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />

                <motion.p
                    className="mt-8 font-mono text-xs"
                    style={{ color: "rgba(255,255,255,0.2)" }}
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    Zappez pour découvrir nos services →
                </motion.p>
            </motion.div>

            {/* Bottom color bars */}
            <div className="absolute bottom-0 left-0 right-0 flex h-[6px]">
                {["#0000ff", "#ff0000", "#ff00ff", "#00ff00", "#00ffff", "#ffff00", "#fff"].map((c, i) => (
                    <div key={i} style={{ flex: 1, background: c }} />
                ))}
            </div>

            {/* Timestamp */}
            <div className="absolute bottom-6 right-5 font-mono text-[10px] text-white/20">
                <ClockDisplay />
            </div>
        </div>
    );
}


/* ═══════════════════════════════════════════════════════════════
   CLOCK DISPLAY — live time for TV realism
   ═══════════════════════════════════════════════════════════════ */
function ClockDisplay() {
    const [time, setTime] = useState("");
    useEffect(() => {
        const tick = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString("fr-CH", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);
    return <span>{time}</span>;
}


/* ═══════════════════════════════════════════════════════════════
   CH.2 — LE JOURNAL (News broadcast)
   ═══════════════════════════════════════════════════════════════ */
const NEWS_ITEMS = [
    "🔴 FLASH — Une PME locale augmente son CA de 340% grâce au SEO",
    "📊 ÉTUDE — 76% des recherches locales mènent à une visite en 24h",
    "🏆 PALMARÈS — MOSH élue agence #1 en Suisse romande",
    "💡 TENDANCE — L'IA révolutionne le marketing digital en 2026",
    "📈 RECORD — +520% d'appels pour les fiches Google optimisées",
    "🌍 MONDE — Les recherches \"près de moi\" explosent de +900%",
];

function ChannelJournal() {
    return (
        <div className="absolute inset-0 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0d1b2a, #1b2838, #1d3557)" }}
        >
            {/* News set background glow */}
            <div className="absolute inset-0"
                style={{ background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(29,53,87,0.5), transparent)" }}
            />

            {/* Top bar — BREAKING NEWS */}
            <motion.div
                className="absolute top-0 left-0 right-0 z-10"
                initial={{ y: -60 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="flex items-center" style={{ background: "#c1121f" }}>
                    <div className="px-4 py-2 font-black text-white text-sm tracking-wider flex items-center gap-2"
                        style={{ background: "#780000" }}
                    >
                        <motion.div
                            className="w-2 h-2 rounded-full bg-white"
                            animate={{ opacity: [1, 0.2, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                        />
                        DIRECT
                    </div>
                    <div className="px-4 py-2 text-white text-xs font-bold tracking-wide">
                        LE JOURNAL DE 20H — ÉDITION SPÉCIALE DIGITAL
                    </div>
                </div>
            </motion.div>

            {/* Main content — headline */}
            <div className="absolute inset-0 flex items-center justify-center px-8 md:px-16">
                <motion.div
                    className="max-w-3xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    <div className="font-mono text-xs tracking-widest uppercase mb-4"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                        Rapport exclusif
                    </div>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight"
                        style={{ color: "#fff" }}
                    >
                        Les entreprises{" "}
                        <span style={{ color: "#ffd166" }}>visibles en ligne</span>{" "}
                        génèrent{" "}
                        <span style={{ color: "#06d6a0" }}>3x plus</span>{" "}
                        de revenus
                    </h2>

                    {/* Stats ticker */}
                    <div className="mt-8 grid grid-cols-3 gap-4">
                        {[
                            { value: "91.5%", label: "ne vont jamais en page 2" },
                            { value: "+340%", label: "CA moyen de nos clients" },
                            { value: "24h", label: "visite après recherche locale" },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                className="text-center py-3 rounded-lg"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + i * 0.15 }}
                            >
                                <div className="text-xl md:text-2xl font-black" style={{ color: "#ffd166" }}>{stat.value}</div>
                                <div className="text-[10px] mt-1 text-white/40">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Breaking news ticker — bottom crawl */}
            <div className="absolute bottom-0 left-0 right-0 z-10">
                <div style={{ background: "rgba(0,0,0,0.7)", borderTop: "2px solid #c1121f" }}>
                    <div className="overflow-hidden py-2.5">
                        <motion.div
                            className="flex whitespace-nowrap"
                            animate={{ x: [0, -3000] }}
                            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                        >
                            {[...NEWS_ITEMS, ...NEWS_ITEMS].map((item, i) => (
                                <span key={i} className="mx-8 text-sm font-medium" style={{ color: "#fff" }}>
                                    {item}
                                </span>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Time stamp */}
            <div className="absolute top-14 right-5 font-mono text-xs text-white/30">
                <ClockDisplay />
            </div>
        </div>
    );
}


/* ═══════════════════════════════════════════════════════════════
   CH.3 — PUB PRIME (Luxury commercial)
   ═══════════════════════════════════════════════════════════════ */
function ChannelPub() {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setPhase(p => (p + 1) % 3);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const slides = [
        {
            title: "Votre marque",
            subtitle: "mérite l'excellence",
            detail: "Identité visuelle · Logo · Charte graphique",
            gradient: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
        },
        {
            title: "Sites web",
            subtitle: "qui convertissent",
            detail: "Landing pages · E-commerce · Applications",
            gradient: "linear-gradient(135deg, #0f3460, #533483, #e94560)",
        },
        {
            title: "Design",
            subtitle: "sans compromis",
            detail: "UX/UI · Motion design · Print & digital",
            gradient: "linear-gradient(135deg, #e94560, #c8944a, #e9c46a)",
        },
    ];

    const current = slides[phase];

    return (
        <div className="absolute inset-0 overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={phase}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: current.gradient }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Decorative elements */}
                    <motion.div
                        className="absolute"
                        style={{
                            width: "500px",
                            height: "500px",
                            borderRadius: "50%",
                            border: "1px solid rgba(255,255,255,0.06)",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                        }}
                        animate={{ scale: [0.8, 1.2], rotate: [0, 180] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />

                    <div className="text-center px-8 relative z-10">
                        {/* Pub marker */}
                        <motion.div
                            className="inline-block mb-6 px-4 py-1 rounded-full text-[10px] font-bold tracking-[0.3em] uppercase"
                            style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Publicité
                        </motion.div>

                        <motion.h2
                            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none"
                            style={{ color: "#fff" }}
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {current.title}
                        </motion.h2>
                        <motion.h3
                            className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight mt-1"
                            style={{ color: "rgba(255,255,255,0.6)" }}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {current.subtitle}
                        </motion.h3>

                        {/* Luxury divider */}
                        <motion.div
                            className="mt-8 mx-auto"
                            style={{
                                width: "60px",
                                height: "1px",
                                background: "linear-gradient(90deg, transparent, #e9c46a, transparent)",
                            }}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.7, duration: 0.6 }}
                        />

                        <motion.p
                            className="mt-6 text-sm tracking-wider"
                            style={{ color: "rgba(255,255,255,0.35)" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                        >
                            {current.detail}
                        </motion.p>

                        {/* MOSH watermark */}
                        <motion.div
                            className="mt-12 font-black text-lg tracking-[0.5em]"
                            style={{ color: "rgba(255,255,255,0.08)" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
                        >
                            MOSH
                        </motion.div>
                    </div>

                    {/* Slide dots */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                        {slides.map((_, i) => (
                            <div
                                key={i}
                                className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                                style={{
                                    background: i === phase ? "#fff" : "rgba(255,255,255,0.2)",
                                    transform: i === phase ? "scale(1.5)" : "scale(1)",
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}


/* ═══════════════════════════════════════════════════════════════
   CH.4 — SOCIAL LIVE (Live show / social media)
   ═══════════════════════════════════════════════════════════════ */
function ChannelSocial() {
    const [likeCount, setLikeCount] = useState(2847);
    const [comments] = useState([
        { user: "Marie_GSE", text: "Incroyable résultat ! 🔥", time: "il y a 2 min" },
        { user: "Tech_Swiss", text: "On a triplé notre visibilité", time: "il y a 5 min" },
        { user: "PizzaGenève", text: "Le meilleur investissement !", time: "il y a 8 min" },
        { user: "BoulangerieAlex", text: "Merci l'équipe MOSH! 💪", time: "il y a 12 min" },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setLikeCount(c => c + Math.floor(Math.random() * 3));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden"
            style={{ background: "linear-gradient(150deg, #1a0a2e, #2d1b4e, #16213e)" }}
        >
            {/* Live badge */}
            <motion.div
                className="absolute top-4 left-5 z-10 flex items-center gap-2.5"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                    style={{ background: "#e63946" }}
                >
                    <motion.div
                        className="w-2 h-2 rounded-full bg-white"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span className="text-white text-xs font-bold">LIVE</span>
                </div>
                <span className="text-white/40 text-xs font-mono">{likeCount.toLocaleString("fr-CH")} viewers</span>
            </motion.div>

            {/* Main content */}
            <div className="absolute inset-0 flex items-center px-8 md:px-16">
                <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
                    {/* Left — big metrics */}
                    <motion.div
                        className="md:col-span-3"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="text-white/30 text-xs font-mono tracking-wider uppercase mb-4">En direct — Social Media</div>
                        <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                            Vos clients sont{" "}
                            <span className="relative inline-block">
                                <span style={{ color: "#e76f51" }}>en ligne</span>
                                <motion.div
                                    className="absolute -bottom-1 left-0 right-0 h-0.5"
                                    style={{ background: "#e76f51" }}
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 0.8, duration: 0.6 }}
                                />
                            </span>
                        </h2>
                        <p className="mt-4 text-white/40 text-sm leading-relaxed max-w-md">
                            Community management · Création de contenu · Campagnes sponsorisées · Influence marketing
                        </p>

                        {/* Social metrics */}
                        <div className="mt-8 flex flex-wrap gap-3">
                            {[
                                { icon: "❤️", value: "+240%", label: "Engagement" },
                                { icon: "👥", value: "50K+", label: "Followers gagnés" },
                                { icon: "📊", value: "x4.2", label: "ROI moyen" },
                            ].map((m, i) => (
                                <motion.div
                                    key={i}
                                    className="px-4 py-3 rounded-xl"
                                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                >
                                    <span className="text-sm">{m.icon}</span>
                                    <div className="text-lg font-black text-white mt-1">{m.value}</div>
                                    <div className="text-[10px] text-white/30">{m.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right — live comments feed */}
                    <motion.div
                        className="md:col-span-2"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="rounded-2xl overflow-hidden"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                        >
                            <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                <span className="text-xs font-bold text-white/50">💬 Chat en direct</span>
                            </div>
                            <div className="p-3 space-y-2.5">
                                {comments.map((c, i) => (
                                    <motion.div
                                        key={i}
                                        className="flex gap-2"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.7 + i * 0.2 }}
                                    >
                                        <div className="w-6 h-6 rounded-full shrink-0"
                                            style={{ background: `hsl(${i * 80}, 60%, 50%)` }}
                                        />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[11px] font-bold text-white/70">@{c.user}</span>
                                                <span className="text-[9px] text-white/20">{c.time}</span>
                                            </div>
                                            <p className="text-[11px] text-white/50 mt-0.5">{c.text}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}


/* ═══════════════════════════════════════════════════════════════
   CH.5 — LA MÉTÉO (Digital trends forecast)
   ═══════════════════════════════════════════════════════════════ */
function ChannelMeteo() {
    const forecasts = [
        { day: "SEO", icon: "☀️", status: "En hausse", pct: "+92%", color: "#06d6a0" },
        { day: "Social", icon: "⛅", status: "Variable", pct: "+45%", color: "#ffd166" },
        { day: "E-mail", icon: "🌤️", status: "Stable", pct: "+28%", color: "#118ab2" },
        { day: "Ads", icon: "🔥", status: "Très chaud", pct: "+150%", color: "#ef476f" },
        { day: "Contenu", icon: "🌈", status: "Excellent", pct: "+78%", color: "#06d6a0" },
    ];

    return (
        <div className="absolute inset-0 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #073b4c, #118ab2, #2a9d8f)" }}
        >
            {/* Weather map background */}
            <div className="absolute inset-0 opacity-[0.05]"
                style={{
                    backgroundImage: `radial-gradient(circle at 30% 40%, white 1px, transparent 1px),
                                      radial-gradient(circle at 70% 60%, white 1px, transparent 1px),
                                      radial-gradient(circle at 50% 30%, white 1px, transparent 1px)`,
                    backgroundSize: "100px 100px, 150px 150px, 80px 80px",
                }}
            />

            {/* Header */}
            <motion.div
                className="absolute top-0 left-0 right-0 px-6 py-4 flex items-center justify-between"
                style={{ background: "rgba(0,0,0,0.2)" }}
                initial={{ y: -40 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex items-center gap-2">
                    <span className="text-lg">🌤️</span>
                    <span className="text-white font-bold text-sm">MÉTÉO DIGITALE</span>
                </div>
                <span className="text-white/40 text-xs font-mono">Prévisions 2026</span>
            </motion.div>

            {/* Main content */}
            <div className="absolute inset-0 flex items-center justify-center px-8">
                <div className="w-full max-w-4xl">
                    {/* Main forecast */}
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <motion.div
                            className="text-6xl md:text-8xl mb-2"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            ☀️
                        </motion.div>
                        <h2 className="text-3xl md:text-5xl font-black text-white">
                            Temps <span style={{ color: "#ffd166" }}>favorable</span>
                        </h2>
                        <p className="mt-2 text-white/40 text-sm">pour la croissance digitale</p>
                    </motion.div>

                    {/* 5-day forecast strip */}
                    <div className="grid grid-cols-5 gap-2 md:gap-4">
                        {forecasts.map((f, i) => (
                            <motion.div
                                key={i}
                                className="text-center py-4 px-2 rounded-xl"
                                style={{
                                    background: "rgba(255,255,255,0.08)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    backdropFilter: "blur(5px)",
                                }}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                            >
                                <div className="text-[11px] font-bold text-white/50 uppercase tracking-wider">{f.day}</div>
                                <div className="text-3xl my-2">{f.icon}</div>
                                <div className="text-lg font-black" style={{ color: f.color }}>{f.pct}</div>
                                <div className="text-[9px] text-white/30 mt-1">{f.status}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom forecast text */}
                    <motion.p
                        className="text-center mt-8 text-sm text-white/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        🌡️ Conditions idéales pour lancer votre stratégie digitale
                    </motion.p>
                </div>
            </div>
        </div>
    );
}


/* ═══════════════════════════════════════════════════════════════
   CH.6 — L'APPEL (Contact / call-in)
   ═══════════════════════════════════════════════════════════════ */
function ChannelContact() {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        setSubmitted(true);
    };

    return (
        <div className="absolute inset-0 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0a0a20, #1a1040, #2d1b6e)" }}
        >
            {/* Phone rings */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: "radial-gradient(circle at 50% 50%, rgba(108,99,255,0.1), transparent 60%)",
                }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
            />

            <div className="absolute inset-0 flex items-center justify-center px-6">
                <AnimatePresence mode="wait">
                    {!submitted ? (
                        <motion.div
                            key="form"
                            className="w-full max-w-md"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Header */}
                            <div className="text-center mb-8">
                                <motion.div
                                    className="text-5xl mb-4"
                                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
                                >
                                    📞
                                </motion.div>
                                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                                    À vous l&apos;antenne
                                </h2>
                                <p className="mt-2 text-sm text-white/40">
                                    Appelez le plateau — on répond sous 24h
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Votre nom"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3.5 rounded-xl text-sm outline-none"
                                    style={{
                                        background: "rgba(255,255,255,0.06)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        color: "#fff",
                                    }}
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3.5 rounded-xl text-sm outline-none"
                                    style={{
                                        background: "rgba(255,255,255,0.06)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        color: "#fff",
                                    }}
                                />
                                <textarea
                                    placeholder="Votre message..."
                                    rows={3}
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-4 py-3.5 rounded-xl text-sm outline-none resize-none"
                                    style={{
                                        background: "rgba(255,255,255,0.06)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        color: "#fff",
                                    }}
                                />
                                <motion.button
                                    type="submit"
                                    className="w-full mt-2 py-4 rounded-xl text-sm font-bold cursor-pointer"
                                    style={{
                                        background: "linear-gradient(135deg, #6c63ff, #e63946)",
                                        color: "#fff",
                                        border: "none",
                                    }}
                                    whileHover={{ scale: 1.02, boxShadow: "0 8px 40px rgba(108,99,255,0.4)" }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Prendre l&apos;antenne →
                                </motion.button>
                            </form>

                            <p className="text-center mt-4 text-[10px] text-white/20">
                                Gratuit · Sans engagement · Réponse sous 24h
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            className="text-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="text-6xl mb-6">🎬</div>
                            <h2 className="text-3xl font-black text-white">C&apos;est dans la boîte !</h2>
                            <p className="mt-4 text-white/40">Notre équipe vous recontacte sous 24h.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}


/* ═══════════════════════════════════════════════════════════════
   TV REMOTE CONTROL — floating panel
   ═══════════════════════════════════════════════════════════════ */
function TVRemote({
    currentChannel,
    onChannelChange,
}: {
    currentChannel: number;
    onChannelChange: (ch: number) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile toggle */}
            <motion.button
                className="fixed bottom-5 right-5 z-[200] w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer md:hidden"
                style={{
                    background: "linear-gradient(135deg, #1a1a2e, #2d2d44)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                    color: "#fff",
                    fontSize: "20px",
                }}
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.9 }}
            >
                {isOpen ? "✕" : "📺"}
            </motion.button>

            {/* Remote panel */}
            <motion.div
                className={`fixed z-[199] ${isOpen ? 'bottom-24 right-5' : 'bottom-auto right-5 top-1/2 -translate-y-1/2'} ${isOpen ? '' : 'hidden md:block'}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
            >
                <div
                    className="rounded-3xl p-4 flex flex-col items-center gap-3"
                    style={{
                        background: "linear-gradient(145deg, #1a1a2e, #12121f)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        boxShadow: "0 16px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
                        width: "72px",
                    }}
                >
                    {/* Power LED */}
                    <div
                        className="w-2 h-2 rounded-full mb-1"
                        style={{ background: "#06d6a0", boxShadow: "0 0 6px #06d6a0" }}
                    />

                    {/* Channel up/down */}
                    <button
                        className="w-10 h-8 rounded-lg flex items-center justify-center text-xs cursor-pointer"
                        style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#fff" }}
                        onClick={() => onChannelChange(currentChannel === 1 ? 6 : currentChannel - 1)}
                    >
                        ▲
                    </button>
                    <div className="text-[9px] font-mono text-white/30">CH</div>
                    <button
                        className="w-10 h-8 rounded-lg flex items-center justify-center text-xs cursor-pointer"
                        style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#fff" }}
                        onClick={() => onChannelChange(currentChannel === 6 ? 1 : currentChannel + 1)}
                    >
                        ▼
                    </button>

                    {/* Divider */}
                    <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.06)" }} />

                    {/* Channel number buttons */}
                    <div className="grid grid-cols-2 gap-1.5">
                        {CHANNELS.map(ch => (
                            <motion.button
                                key={ch.id}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold cursor-pointer"
                                style={{
                                    background: currentChannel === ch.id ? ch.color : "rgba(255,255,255,0.06)",
                                    border: "none",
                                    color: currentChannel === ch.id ? "#fff" : "rgba(255,255,255,0.4)",
                                    boxShadow: currentChannel === ch.id ? `0 2px 10px ${ch.color}60` : "none",
                                }}
                                onClick={() => onChannelChange(ch.id)}
                                whileTap={{ scale: 0.85 }}
                                whileHover={{ scale: 1.1 }}
                            >
                                {ch.id}
                            </motion.button>
                        ))}
                    </div>

                    {/* MOSH branding */}
                    <div className="mt-1 text-[7px] font-bold tracking-[0.2em] text-white/10">MOSH</div>
                </div>
            </motion.div>
        </>
    );
}


/* ═══════════════════════════════════════════════════════════════
   TV FRAME — realistic flat-screen on a stand
   ═══════════════════════════════════════════════════════════════ */
function TVFrame({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center" style={{ width: "100%", maxWidth: "1200px" }}>
            {/* ── The TV itself ── */}
            <div
                className="relative w-full rounded-[6px] overflow-hidden"
                style={{
                    aspectRatio: "16 / 9",
                    border: "6px solid #111118",
                    borderBottom: "32px solid #111118",
                    borderRadius: "8px 8px 6px 6px",
                    boxShadow: `
                        0 6px 40px rgba(0,0,0,0.35),
                        0 2px 8px rgba(0,0,0,0.25),
                        inset 0 0 0 1px rgba(255,255,255,0.04)
                    `,
                    background: "#000",
                }}
            >
                {children}

                {/* ── Bottom chin with MOSH branding ── */}
                <div className="absolute bottom-[-28px] left-0 right-0 flex items-center justify-center gap-3 h-[28px] pointer-events-none">
                    <motion.div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "#e63946", boxShadow: "0 0 6px #e63946" }}
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-[9px] font-bold tracking-[0.35em] uppercase"
                        style={{ color: "rgba(255,255,255,0.2)" }}
                    >
                        MOSH
                    </span>
                </div>
            </div>

            {/* ── TV Stand / Neck ── */}
            <div className="flex flex-col items-center">
                {/* Neck */}
                <div
                    style={{
                        width: "60px",
                        height: "28px",
                        background: "linear-gradient(to right, #1a1a24, #25252f, #1a1a24)",
                        borderRadius: "0 0 4px 4px",
                    }}
                />
                {/* Base foot */}
                <div
                    style={{
                        width: "180px",
                        height: "10px",
                        background: "linear-gradient(to bottom, #25252f, #1a1a24)",
                        borderRadius: "0 0 10px 10px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    }}
                />
            </div>
        </div>
    );
}


/* ═══════════════════════════════════════════════════════════════
   CHANNEL RENDERER — routes to the correct channel
   ═══════════════════════════════════════════════════════════════ */
function ChannelRenderer({ channel }: { channel: number }) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={channel}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
            >
                {channel === 1 && <ChannelMire />}
                {channel === 2 && <ChannelJournal />}
                {channel === 3 && <ChannelPub />}
                {channel === 4 && <ChannelSocial />}
                {channel === 5 && <ChannelMeteo />}
                {channel === 6 && <ChannelContact />}
            </motion.div>
        </AnimatePresence>
    );
}


/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT — TV Experience
   ═══════════════════════════════════════════════════════════════ */
export default function DigitalStore() {
    const [currentChannel, setCurrentChannel] = useState(1);
    const [showStatic, setShowStatic] = useState(false);
    const [showOSD, setShowOSD] = useState(true);
    const osdTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const changeChannel = useCallback((ch: number) => {
        if (ch === currentChannel) return;

        // Show static
        setShowStatic(true);

        // Switch channel after brief static
        setTimeout(() => {
            setCurrentChannel(ch);
            setShowStatic(false);
        }, 250);

        // Show OSD
        setShowOSD(true);
        if (osdTimeout.current) clearTimeout(osdTimeout.current);
        osdTimeout.current = setTimeout(() => setShowOSD(false), 3000);
    }, [currentChannel]);

    // Keyboard handler — 1-6 for channels, arrows for up/down
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const num = parseInt(e.key);
            if (num >= 1 && num <= 6) {
                changeChannel(num);
                return;
            }
            if (e.key === "ArrowUp" || e.key === "ArrowRight") {
                changeChannel(currentChannel === 6 ? 1 : currentChannel + 1);
            }
            if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
                changeChannel(currentChannel === 1 ? 6 : currentChannel - 1);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentChannel, changeChannel]);

    // Initial OSD timeout
    useEffect(() => {
        osdTimeout.current = setTimeout(() => setShowOSD(false), 4000);
        return () => { if (osdTimeout.current) clearTimeout(osdTimeout.current); };
    }, []);

    const channel = CHANNELS[currentChannel - 1];

    return (
        <div
            className="h-screen w-screen overflow-hidden relative flex flex-col"
            style={{
                background: "linear-gradient(180deg, #f5f0eb 0%, #ede8e2 60%, #ddd5cc 100%)",
            }}
        >
            {/* CSS animation for static noise */}
            <style>{`
                @keyframes staticMove {
                    0% { transform: translate(0, 0); }
                    10% { transform: translate(-5%, -5%); }
                    20% { transform: translate(-10%, 5%); }
                    30% { transform: translate(5%, -10%); }
                    40% { transform: translate(-5%, 15%); }
                    50% { transform: translate(-10%, 5%); }
                    60% { transform: translate(15%, 0); }
                    70% { transform: translate(0, 10%); }
                    80% { transform: translate(-15%, 0); }
                    90% { transform: translate(10%, 5%); }
                    100% { transform: translate(5%, 0); }
                }
            `}</style>

            {/* ── WALL — white/cream background with subtle texture ── */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Subtle wall texture */}
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 50% 0%, rgba(255,255,255,0.6) 0%, transparent 60%)`,
                }} />
                {/* Baseboard / plinthe line */}
                <div className="absolute bottom-[15%] left-0 right-0" style={{
                    height: "8px",
                    background: "linear-gradient(to bottom, #c4b8a8, #b8a898)",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                }} />
                {/* Wall below baseboard — slightly darker */}
                <div className="absolute bottom-0 left-0 right-0" style={{
                    height: "15%",
                    background: "linear-gradient(to bottom, #ddd5cc, #d0c8be)",
                }} />
            </div>

            {/* ── ROOM DECORATIONS ── */}
            {/* Small plant decoration — left */}
            <div className="absolute bottom-[16%] left-[8%] hidden lg:block" style={{ zIndex: 5 }}>
                <div className="text-3xl">🌿</div>
            </div>
            {/* Small frame on wall — right */}
            <div className="absolute top-[12%] right-[10%] hidden lg:block" style={{ zIndex: 5 }}>
                <div style={{
                    width: "60px",
                    height: "45px",
                    borderRadius: "3px",
                    border: "3px solid #c4b8a8",
                    background: "linear-gradient(135deg, #e8e0d6, #ddd5cc)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }} />
            </div>
            {/* Ambient warm light behind TV */}
            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 pointer-events-none" style={{
                width: "600px",
                height: "400px",
                background: "radial-gradient(ellipse, rgba(255,220,180,0.15), transparent 70%)",
                filter: "blur(40px)",
                zIndex: 1,
            }} />

            {/* ── TV + STAND + MEUBLE — centered ── */}
            <div className="flex-1 flex flex-col items-center justify-end px-4 pb-0 relative" style={{ zIndex: 10 }}>
                {/* TV with frame */}
                <div className="w-full flex justify-center" style={{ maxWidth: "min(90vw, 1100px)" }}>
                    <TVFrame>
                        {/* Screen content */}
                        <div className="relative w-full h-full overflow-hidden" style={{ background: "#000" }}>
                            {/* Active channel */}
                            <ChannelRenderer channel={currentChannel} />

                            {/* TV Effects overlay */}
                            <TVOverlay />

                            {/* Static transition */}
                            <TVStatic active={showStatic} />

                            {/* OSD channel indicator */}
                            <TVOSD channel={channel} visible={showOSD && !showStatic} />
                        </div>
                    </TVFrame>
                </div>

                {/* ── TV MEUBLE (furniture) ── */}
                <div className="w-full flex justify-center">
                    <div
                        style={{
                            width: "min(85vw, 1000px)",
                            height: "clamp(40px, 6vh, 70px)",
                            background: "linear-gradient(180deg, #3a2f26 0%, #2e2318 40%, #241c14 100%)",
                            borderRadius: "0 0 8px 8px",
                            boxShadow: "0 8px 28px rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
                            position: "relative",
                        }}
                    >
                        {/* Wood grain texture */}
                        <div className="absolute inset-0 rounded-[0_0_8px_8px] overflow-hidden" style={{
                            backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.015) 40px, rgba(255,255,255,0.015) 41px)",
                        }} />
                        {/* Top edge highlight */}
                        <div className="absolute top-0 left-0 right-0" style={{
                            height: "2px",
                            background: "linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)",
                        }} />
                        {/* Decorative elements on meuble */}
                        <div className="absolute top-1/2 -translate-y-1/2 left-6 hidden md:flex items-center gap-1.5">
                            <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: "rgba(255,255,255,0.04)" }} />
                            <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: "rgba(255,255,255,0.04)" }} />
                        </div>
                    </div>
                </div>

                {/* ── Meuble legs ── */}
                <div className="flex justify-center" style={{ width: "min(85vw, 1000px)" }}>
                    <div className="flex justify-between w-full px-8">
                        <div style={{
                            width: "8px",
                            height: "clamp(20px, 3vh, 35px)",
                            background: "linear-gradient(to bottom, #2e2318, #1a1410)",
                            borderRadius: "0 0 3px 3px",
                        }} />
                        <div style={{
                            width: "8px",
                            height: "clamp(20px, 3vh, 35px)",
                            background: "linear-gradient(to bottom, #2e2318, #1a1410)",
                            borderRadius: "0 0 3px 3px",
                        }} />
                    </div>
                </div>

                {/* Spacer for floor area */}
                <div style={{ height: "clamp(20px, 4vh, 50px)" }} />
            </div>

            {/* Remote control */}
            <TVRemote currentChannel={currentChannel} onChannelChange={changeChannel} />

            {/* Keyboard hint — desktop only */}
            <motion.div
                className="fixed bottom-4 left-4 z-[100] hidden md:block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
            >
                <div className="px-3 py-2 rounded-lg text-[10px] font-mono"
                    style={{ background: "rgba(60,50,40,0.06)", color: "rgba(60,50,40,0.35)" }}
                >
                    Touches 1-6 ou ↑↓ pour zapper
                </div>
            </motion.div>
        </div>
    );
}
