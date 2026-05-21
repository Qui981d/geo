"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

// ═══════════════════════════════════════════════════════════════
//    ANIMATED COUNTER — counts up to target
// ═══════════════════════════════════════════════════════════════
function AnimatedCounter({
    target,
    prefix = "",
    suffix = "",
    isVisible,
}: {
    target: number;
    prefix?: string;
    suffix?: string;
    isVisible: boolean;
}) {
    const [count, setCount] = useState(0);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!isVisible || hasAnimated.current) return;
        hasAnimated.current = true;
        const start = performance.now();
        const duration = 2000;

        const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setCount(Math.round(eased * target * 10) / 10);
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [isVisible, target]);

    const display = target % 1 === 0 ? Math.round(count).toLocaleString("fr-CH") : count.toFixed(1);
    return <>{prefix}{display}{suffix}</>;
}


/* ═══════════════════════════════════════════════════════════════
   SCENE DATA
   ═══════════════════════════════════════════════════════════════ */
const SCENES = [
    {
        id: "hero",
        number: 2847,
        prefix: "",
        suffix: "",
        text: "personnes cherchent un commerce comme le vôtre sur Google.",
        subtext: "En ce moment même, dans votre ville.",
        source: null,
        icon: "🔍",
    },
    {
        id: "page2",
        number: 91.5,
        prefix: "",
        suffix: "%",
        text: "des utilisateurs ne dépassent jamais la première page.",
        subtext: "Si vous n'y êtes pas, vous n'existez pas.",
        source: "Backlinko 2024",
        icon: "👻",
    },
    {
        id: "position1",
        number: 27.6,
        prefix: "",
        suffix: "%",
        text: "des clics vont au résultat #1.",
        subtext: "Le #5 ? Seulement 2.4%. Le #10 ? 0.4%.",
        source: "Backlinko 2024",
        icon: "📊",
    },
    {
        id: "maps",
        number: 76,
        prefix: "",
        suffix: "%",
        text: "des recherches locales mènent à une visite en 24h.",
        subtext: "Votre fiche Google est votre vitrine digitale.",
        source: "Google / Ipsos",
        icon: "📍",
    },
    {
        id: "reviews",
        number: 4.5,
        prefix: "★ ",
        suffix: "+",
        text: "Les commerces au-dessus génèrent 35% de revenus en plus.",
        subtext: "La réputation en ligne est votre meilleur vendeur.",
        source: "Google Business Profile",
        icon: "⭐",
    },
    {
        id: "photos",
        number: 520,
        prefix: "+",
        suffix: "%",
        text: "d'appels en plus pour les fiches avec des photos de qualité.",
        subtext: "Vos clients veulent voir avant de venir.",
        source: "Google",
        icon: "📸",
    },
    {
        id: "nearme",
        number: 900,
        prefix: "+",
        suffix: "%",
        text: "de hausse des recherches « près de moi » en 2 ans.",
        subtext: "Le local est l'avenir. Êtes-vous prêt ?",
        source: "Think with Google",
        icon: "📱",
    },
];


/* ═══════════════════════════════════════════════════════════════
   FLOATING PARTICLES along the axis
   ═══════════════════════════════════════════════════════════════ */
const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    initialY: Math.random() * 100,
    x: (Math.random() - 0.5) * 40,
    size: 1.5 + Math.random() * 2.5,
    duration: 6 + Math.random() * 8,
    delay: Math.random() * 5,
    opacity: 0.15 + Math.random() * 0.35,
}));

function AxisParticles() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
            {PARTICLES.map(p => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{
                        left: `calc(50% + ${p.x}px)`,
                        width: p.size,
                        height: p.size,
                        background: `rgba(79,70,229,${p.opacity})`,
                        boxShadow: `0 0 ${p.size * 3}px rgba(79,70,229,${p.opacity * 0.7})`,
                    }}
                    animate={{
                        top: [`${p.initialY}%`, `${p.initialY - 30}%`],
                        opacity: [0, p.opacity, p.opacity, 0],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "linear",
                    }}
                />
            ))}
        </div>
    );
}


/* ═══════════════════════════════════════════════════════════════
   LIGHT PULSE TRAIL — energy pulse that descends the axis
   ═══════════════════════════════════════════════════════════════ */
function LightPulseTrail({ scrollYProgress }: { scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
    const pulseY = useTransform(scrollYProgress, [0, 1], ["5%", "95%"]);
    const pulseOpacity = useTransform(scrollYProgress, (p: number) => {
        const wave = Math.sin(p * Math.PI * SCENES.length);
        return 0.4 + wave * 0.4;
    });

    return (
        <motion.div
            className="absolute pointer-events-none"
            style={{
                left: "50%",
                top: pulseY,
                transform: "translate(-50%, -50%)",
                zIndex: 3,
            }}
        >
            {/* Core bright dot */}
            <motion.div
                style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#7c6bff",
                    opacity: pulseOpacity,
                    boxShadow: "0 0 12px #7c6bff, 0 0 40px rgba(124,107,255,0.4), 0 0 80px rgba(79,70,229,0.2)",
                }}
            />
            {/* Trailing glow */}
            <motion.div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 60,
                    height: 120,
                    borderRadius: "50%",
                    background: "radial-gradient(ellipse, rgba(79,70,229,0.15), transparent 70%)",
                    opacity: pulseOpacity,
                }}
            />
        </motion.div>
    );
}


/* ═══════════════════════════════════════════════════════════════
   STARFIELD — parallax background stars
   ═══════════════════════════════════════════════════════════════ */
const STARS = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 0.5 + Math.random() * 1.5,
    twinkleDuration: 2 + Math.random() * 4,
    delay: Math.random() * 3,
    opacity: 0.1 + Math.random() * 0.25,
}));

function Starfield({ scrollYProgress }: { scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
    const starsY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

    return (
        <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ y: starsY, zIndex: 0 }}
        >
            {STARS.map(s => (
                <motion.div
                    key={s.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${s.x}%`,
                        top: `${s.y}%`,
                        width: s.size,
                        height: s.size,
                        background: "rgba(255,255,255,0.6)",
                    }}
                    animate={{ opacity: [s.opacity, s.opacity * 0.3, s.opacity] }}
                    transition={{
                        duration: s.twinkleDuration,
                        repeat: Infinity,
                        delay: s.delay,
                    }}
                />
            ))}
        </motion.div>
    );
}


/* ═══════════════════════════════════════════════════════════════
   HELIX CONFIG
   ═══════════════════════════════════════════════════════════════ */
const HELIX = {
    xRadius: 320,
    ySpacing: 210,
    angleStep: (2 * Math.PI) / SCENES.length,
};


/* ═══════════════════════════════════════════════════════════════
   HELIX CARD — each card spiraling around the central axis
   ═══════════════════════════════════════════════════════════════ */
function HelixCard({
    scene,
    index,
    total,
    scrollYProgress,
}: {
    scene: (typeof SCENES)[number];
    index: number;
    total: number;
    scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
    const [isActive, setIsActive] = useState(index === 0);

    useMotionValueEvent(scrollYProgress, "change", (p: number) => {
        const activeIdx = Math.round(p * (total - 1));
        setIsActive(activeIdx === index);
    });

    // Horizontal swing — sine creates the circular motion around axis
    const x = useTransform(scrollYProgress, (p: number) => {
        const delta = index - p * (total - 1);
        return Math.sin(delta * HELIX.angleStep) * HELIX.xRadius;
    });

    // Vertical position — spiral descent
    const y = useTransform(scrollYProgress, (p: number) => {
        const delta = index - p * (total - 1);
        return delta * HELIX.ySpacing;
    });

    // Scale — bigger when in front (cos ≈ 1)
    const cardScale = useTransform(scrollYProgress, (p: number) => {
        const delta = index - p * (total - 1);
        const z = Math.cos(delta * HELIX.angleStep);
        return 0.5 + 0.5 * Math.max(0, z);
    });

    // Opacity — visible when facing user
    const cardOpacity = useTransform(scrollYProgress, (p: number) => {
        const delta = index - p * (total - 1);
        const z = Math.cos(delta * HELIX.angleStep);
        if (z > 0.85) return 1;
        if (z > 0.4) return 0.4;
        if (z > 0) return 0.1;
        return 0.02;
    });

    // Z-index — front cards layered above back cards
    const cardZIndex = useTransform(scrollYProgress, (p: number) => {
        const delta = index - p * (total - 1);
        const z = Math.cos(delta * HELIX.angleStep);
        return Math.round(z * 10 + 10);
    });

    // Perspective tilt — cards angle as they go around
    const cardRotateY = useTransform(scrollYProgress, (p: number) => {
        const delta = index - p * (total - 1);
        return Math.sin(delta * HELIX.angleStep) * 50;
    });

    // Dynamic glassmorphism — computed from isActive state instead of MotionValues
    // (MotionValue-driven background/border strings can cause rendering bugs)

    // Connector line X position (how far card is from axis)
    const connectorWidth = useTransform(scrollYProgress, (p: number) => {
        const delta = index - p * (total - 1);
        const z = Math.cos(delta * HELIX.angleStep);
        if (z > 0.85) return Math.abs(Math.sin(delta * HELIX.angleStep) * HELIX.xRadius);
        return 0;
    });

    const connectorOpacity = useTransform(scrollYProgress, (p: number) => {
        const delta = index - p * (total - 1);
        const z = Math.cos(delta * HELIX.angleStep);
        return z > 0.85 ? 0.25 : 0;
    });

    const connectorSide = useTransform(scrollYProgress, (p: number) => {
        const delta = index - p * (total - 1);
        return Math.sin(delta * HELIX.angleStep) > 0 ? "left" : "right";
    });

    return (
        <>
            {/* Connector line from card to axis */}
            <motion.div
                className="hidden md:block"
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    height: "1px",
                    width: connectorWidth,
                    opacity: connectorOpacity,
                    background: "linear-gradient(90deg, rgba(79,70,229,0.4), rgba(79,70,229,0.05))",
                    transform: "translateX(-50%)",
                    zIndex: 3,
                    y,
                }}
            />

            <motion.div
                className="rounded-3xl p-8 md:p-10"
                style={{
                    position: "absolute",
                    x,
                    y,
                    scale: cardScale,
                    opacity: cardOpacity,
                    zIndex: cardZIndex,
                    rotateY: cardRotateY,
                    width: "clamp(300px, 42vw, 480px)",
                    left: "50%",
                    top: "50%",
                    marginLeft: "clamp(-150px, -21vw, -240px)",
                    marginTop: "-140px",
                    background: isActive ? "#0f0c28" : "#0c0c10",
                    border: isActive ? "1px solid rgba(79,70,229,0.35)" : "1px solid rgba(255,255,255,0.06)",
                    boxShadow: isActive ? "0 0 30px rgba(79,70,229,0.15), 0 0 60px rgba(79,70,229,0.05)" : "none",
                }}
            >
                {/* Icon */}
                <span className="text-2xl md:text-3xl block mb-4">{scene.icon}</span>

                {/* Big number */}
                <p
                    className="font-mono tracking-tight leading-none"
                    style={{
                        fontSize: "clamp(44px, 10vw, 96px)",
                        fontWeight: 800,
                        color: isActive ? "#c4b5fd" : "rgba(255,255,255,0.9)",
                    }}
                >
                    <AnimatedCounter
                        target={scene.number}
                        prefix={scene.prefix}
                        suffix={scene.suffix}
                        isVisible={isActive}
                    />
                </p>

                {/* Description */}
                <p
                    className="mt-5 text-base md:text-lg leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.85)" }}
                >
                    {scene.text}
                </p>

                <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {scene.subtext}
                </p>

                {scene.source && (
                    <p
                        className="mt-5 font-mono text-[10px] tracking-widest uppercase"
                        style={{ color: "rgba(255,255,255,0.15)" }}
                    >
                        Source : {scene.source}
                    </p>
                )}
            </motion.div>
        </>
    );
}


/* ═══════════════════════════════════════════════════════════════
   CTA + FORM
   ═══════════════════════════════════════════════════════════════ */
function FormSection() {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({ company: "", name: "", email: "", phone: "", employees: "" });

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.2 });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        setSubmitted(true);
    };

    const inputStyle = {
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "#fff",
    };

    return (
        <section
            id="audit-form"
            ref={ref}
            className="relative flex items-center justify-center px-6"
            style={{
                minHeight: "100vh",
                background: "radial-gradient(ellipse 80% 50% at 50% 60%, rgba(79,70,229,0.1) 0%, #0a0a0a 70%)",
            }}
        >
            <div className="max-w-lg mx-auto w-full text-center">
                <AnimatePresence mode="wait">
                    {!submitted ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 40 }}
                            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight" style={{ color: "#fff" }}>
                                Êtes-vous visible ?
                            </h2>
                            <p className="mt-4 text-base md:text-lg" style={{ color: "rgba(255,255,255,0.45)" }}>
                                Recevez votre pack visibilité locale — stratégie personnalisée pour dominer Google dans votre ville.
                            </p>

                            <form onSubmit={handleSubmit} className="mt-10 space-y-4 text-left">
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Entreprise" required value={formData.company}
                                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                                        autoComplete="organization"
                                        className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all" style={inputStyle} />
                                    <input type="text" placeholder="Nom complet" required value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        autoComplete="name"
                                        className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all" style={inputStyle} />
                                </div>
                                <input type="email" placeholder="Email professionnel" required value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    autoComplete="email"
                                    className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all" style={inputStyle} />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="tel" placeholder="Téléphone" value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        autoComplete="tel"
                                        className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all" style={inputStyle} />
                                    <select required value={formData.employees}
                                        onChange={e => setFormData({ ...formData, employees: e.target.value })}
                                        className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all cursor-pointer"
                                        style={{ ...inputStyle, color: formData.employees ? "#fff" : "rgba(255,255,255,0.4)" }}>
                                        <option value="" disabled>Nombre d&apos;employés</option>
                                        <option value="10-25">10 – 25</option>
                                        <option value="25-50">25 – 50</option>
                                        <option value="50-100">50 – 100</option>
                                        <option value="100+">100+</option>
                                    </select>
                                </div>
                                <motion.button type="submit"
                                    className="w-full mt-4 py-4 rounded-xl text-sm font-semibold tracking-wide cursor-pointer"
                                    style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7c3aed 100%)", color: "#fff", border: "none" }}
                                    whileHover={{ scale: 1.02, boxShadow: "0 8px 40px rgba(79,70,229,0.4)" }}
                                    whileTap={{ scale: 0.98 }}>
                                    Recevoir mon pack visibilité →
                                </motion.button>
                            </form>
                            <p className="mt-6 text-[11px]" style={{ color: "rgba(255,255,255,0.2)" }}>Gratuit · Sans engagement · Réponse sous 24h</p>
                        </motion.div>
                    ) : (
                        <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                            <div className="text-6xl mb-6">🎉</div>
                            <h2 className="text-3xl font-bold" style={{ color: "#fff" }}>C&apos;est envoyé !</h2>
                            <p className="mt-4 text-base" style={{ color: "rgba(255,255,255,0.5)" }}>
                                Notre équipe vous contacte sous 24h avec votre stratégie personnalisée.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}


/* ═══════════════════════════════════════════════════════════════
   PROGRESS BAR
   ═══════════════════════════════════════════════════════════════ */
function ProgressBar() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight > 0) setProgress(scrollTop / docHeight);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-1 h-full z-50 hidden md:block" style={{ background: "rgba(255,255,255,0.03)" }}>
            <motion.div
                className="w-full rounded-b-full"
                style={{
                    height: `${progress * 100}%`,
                    background: "linear-gradient(to bottom, #4F46E5, #7c3aed)",
                    boxShadow: "0 0 10px rgba(79,70,229,0.5)",
                }}
            />
        </div>
    );
}


/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT — 3D Helix Scroll Experience
   ═══════════════════════════════════════════════════════════════ */
export default function LocalBoostExperience() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const [activeScene, setActiveScene] = useState(0);

    useMotionValueEvent(scrollYProgress, "change", (p: number) => {
        setActiveScene(Math.round(p * (SCENES.length - 1)));
    });

    return (
        <div style={{ background: "#0a0a0a" }}>
            <ProgressBar />

            {/* ── Helix Scroll Section ── */}
            <section ref={containerRef} style={{ height: `${(SCENES.length + 1) * 100}vh` }}>
                <div
                    className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
                    style={{ perspective: "1200px" }}
                >
                    {/* Starfield background */}
                    <Starfield scrollYProgress={scrollYProgress} />

                    {/* Central axis line */}
                    <div
                        style={{
                            position: "absolute",
                            left: "50%",
                            top: 0,
                            bottom: 0,
                            width: "3px",
                            borderRadius: "2px",
                            background: "linear-gradient(to bottom, transparent 5%, rgba(79,70,229,0.25) 20%, rgba(79,70,229,0.5) 50%, rgba(79,70,229,0.25) 80%, transparent 95%)",
                            boxShadow: "0 0 8px rgba(79,70,229,0.3), 0 0 20px rgba(79,70,229,0.1)",
                            transform: "translateX(-50%)",
                            zIndex: 1,
                        }}
                    />

                    {/* Axis glow */}
                    <div
                        style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            width: "400px",
                            height: "400px",
                            borderRadius: "50%",
                            background: "radial-gradient(circle, rgba(79,70,229,0.1), transparent 70%)",
                            transform: "translate(-50%, -50%)",
                            zIndex: 0,
                        }}
                    />

                    {/* Floating particles along axis */}
                    <AxisParticles />

                    {/* Light pulse trail */}
                    <LightPulseTrail scrollYProgress={scrollYProgress} />

                    {/* Dot markers on axis */}
                    <div
                        className="absolute hidden md:block"
                        style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", zIndex: 4 }}
                    >
                        <motion.div
                            className="w-3 h-3 rounded-full"
                            style={{
                                background: "#7c6bff",
                                boxShadow: "0 0 14px rgba(124,107,255,0.6), 0 0 40px rgba(79,70,229,0.25)",
                            }}
                            animate={{ scale: [1, 1.4, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>

                    {/* Helix cards */}
                    <div style={{ position: "relative", width: "100%", height: "100%" }}>
                        {SCENES.map((scene, i) => (
                            <HelixCard
                                key={scene.id}
                                scene={scene}
                                index={i}
                                total={SCENES.length}
                                scrollYProgress={scrollYProgress}
                            />
                        ))}
                    </div>

                    {/* Scene counter */}
                    <div className="absolute top-8 right-8 hidden md:flex items-center gap-3">
                        <span
                            className="font-mono text-[11px] tracking-wider"
                            style={{ color: "rgba(255,255,255,0.25)" }}
                        >
                            {String(activeScene + 1).padStart(2, "0")} / {String(SCENES.length).padStart(2, "0")}
                        </span>
                    </div>

                    {/* Active scene label */}
                    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={activeScene}
                                className="font-mono text-xs tracking-wider uppercase"
                                style={{ color: "rgba(79,70,229,0.5)" }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                {SCENES[activeScene]?.id}
                            </motion.p>
                        </AnimatePresence>
                    </div>

                    {/* Scroll indicator */}
                    <motion.div
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.5, duration: 1 }}
                    >
                        <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.2)" }}>
                            Scrollez pour explorer
                        </span>
                        <div className="w-5 h-8 rounded-full relative" style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
                            <motion.div
                                className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1 h-1.5 rounded-full"
                                style={{ background: "rgba(255,255,255,0.4)" }}
                                animate={{ y: [0, 8, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            <FormSection />

            <footer className="py-12 text-center" style={{ background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <p className="font-mono text-xs tracking-wider" style={{ color: "rgba(255,255,255,0.15)" }}>
                    © {new Date().getFullYear()} Local Boost
                </p>
            </footer>

            {/* Sticky CTA */}
            <motion.a
                href="#audit-form"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="fixed bottom-6 right-6 z-[99] md:bottom-8 md:right-10 px-6 py-3.5 rounded-full text-sm font-semibold tracking-wide backdrop-blur-md flex items-center gap-3 transition-colors"
                style={{
                    background: "rgba(79,70,229,0.15)",
                    border: "1px solid rgba(79,70,229,0.3)",
                    color: "#fff",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 0 10px rgba(79,70,229,0.1)"
                }}
                whileHover={{ scale: 1.05, background: "rgba(79,70,229,0.35)", boxShadow: "0 8px 40px rgba(79,70,229,0.5)" }}
                whileTap={{ scale: 0.95 }}
            >
                <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                </span>
                Audit Gratuit
            </motion.a>
        </div>
    );
}
