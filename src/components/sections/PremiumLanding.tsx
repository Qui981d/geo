"use client";
import ImmersiveChatHero from "./ImmersiveChatHero";

import { useState, useRef, useEffect, FormEvent, useCallback } from "react";
import {
    motion, useInView, useScroll, useTransform,
    useSpring, AnimatePresence, useMotionValue,
} from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════════════════════════════ */
const C = {
    bg:           "#FAFAF8",
    dark:         "#000000",
    white:        "#FFFFFF",
    text:         "#0D0D0D",
    muted:        "#5A5A5A",
    dim:          "#9A9A92",
    teal:         "#44e1c8",
    purple:       "#b27cc8",
    border:       "rgba(0,0,0,0.10)",
    D:   "'Bebas Neue', var(--font-bebas), 'Arial Black', sans-serif",
    M:   "'Courier Prime', var(--font-courier), 'Courier New', monospace",
};
const EX = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ═══════════════════════════════════════════════════════════════
   UTILS
   ═══════════════════════════════════════════════════════════════ */
function R({ children, className = "", delay = 0, y = 36 }: {
    children: React.ReactNode; className?: string; delay?: number; y?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const v = useInView(ref, { once: true, margin: "-60px" });
    return (
        <motion.div ref={ref} className={className}
            initial={{ opacity: 0, y }}
            animate={v ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay, ease: EX }}
        >{children}</motion.div>
    );
}

function SplitText({ text, style = {}, delay = 0, className = "" }: {
    text: string; style?: React.CSSProperties; delay?: number; className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const v = useInView(ref, { once: true, margin: "-15%" });
    return (
        <div ref={ref} className={`overflow-hidden ${className}`} style={style}>
            <div className="flex flex-wrap">
                {text.split(" ").map((w, i) => (
                    <span key={i} className="overflow-hidden inline-block mr-[0.22em]">
                        <motion.span className="inline-block"
                            initial={{ y: 80, opacity: 0 }}
                            animate={v ? { y: 0, opacity: 1 } : {}}
                            transition={{ duration: 0.85, delay: delay + i * 0.04, ease: EX }}
                        >{w}</motion.span>
                    </span>
                ))}
            </div>
        </div>
    );
}

function Num({ v: target, s = "", p = "" }: { v: number; s?: string; p?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });
    const [val, setVal] = useState(0);
    useEffect(() => {
        if (!inView) return;
        const dur = 2200, start = performance.now();
        const tick = (now: number) => {
            const prog = Math.min((now - start) / dur, 1);
            setVal((1 - Math.pow(1 - prog, 3)) * target);
            if (prog < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [inView, target]);
    const fmt = target % 1 === 0 ? Math.round(val).toLocaleString("fr-FR") : val.toFixed(1);
    return <span ref={ref}>{p}{fmt}{s}</span>;
}

function GrainOverlay() {
    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.018]"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundSize: "256px",
                mixBlendMode: "multiply",
            }}
        />
    );
}

/* ═══════════════════════════════════════════════════════════════
   INTRO SPLASH
   ═══════════════════════════════════════════════════════════════ */
function IntroSplash({ onComplete }: { onComplete: () => void }) {
    const [exit, setExit] = useState(false);
    useEffect(() => {
        // Lock scroll while splash is visible
        document.body.style.overflow = "hidden";
        const t1 = setTimeout(() => setExit(true), 1800);
        const t2 = setTimeout(() => {
            document.body.style.overflow = "";
            onComplete();
        }, 2600);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            document.body.style.overflow = "";
        };
    }, [onComplete]);

    return (
        <motion.div className="fixed inset-0 z-[999999] flex flex-col items-center justify-center"
            style={{ background: C.dark }}
            animate={exit ? { y: "-100%" } : { y: "0%" }}
            transition={exit ? { duration: 0.9, ease: EX } : {}}
        >
            <motion.div className="flex flex-col items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EX }}
            >
                <span style={{ fontFamily: C.D, fontSize: "clamp(80px, 14vw, 130px)", color: C.white, letterSpacing: "0.1em", lineHeight: 1 }}>
                    GEO
                </span>
                <p style={{ fontFamily: C.M, fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                    Generative Engine Optimization
                </p>
                <div className="flex gap-3 mt-2">
                    {["ChatGPT", "Perplexity", "Gemini"].map((n, i) => (
                        <motion.span key={n}
                            style={{ fontFamily: C.M, fontSize: "10px", padding: "4px 10px", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" }}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + i * 0.08 }}
                        >{n}</motion.span>
                    ))}
                </div>
            </motion.div>

            <div className="absolute bottom-12 left-16 right-16">
                <div className="h-[1px]" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <motion.div className="h-full origin-left"
                        style={{ background: `linear-gradient(90deg, ${C.teal}, ${C.purple})` }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.4, duration: 1.4, ease: [0.25, 1, 0.5, 1] }}
                    />
                </div>
            </div>
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   CUSTOM CURSOR
   ═══════════════════════════════════════════════════════════════ */
function CustomCursor() {
    const x = useMotionValue(-100);
    const y = useMotionValue(-100);
    const rx = useSpring(x, { stiffness: 140, damping: 18, mass: 0.4 });
    const ry = useSpring(y, { stiffness: 140, damping: 18, mass: 0.4 });
    const [hov, setHov] = useState(false);
    const [hide, setHide] = useState(false);

    useEffect(() => {
        const mv = (e: MouseEvent) => {
            x.set(e.clientX); y.set(e.clientY);
            setHov(!!(e.target as HTMLElement).closest('button,a,input,select,[role="button"]'));
        };
        window.addEventListener("mousemove", mv);
        document.documentElement.addEventListener("mouseleave", () => setHide(true));
        document.documentElement.addEventListener("mouseenter", () => setHide(false));
        return () => window.removeEventListener("mousemove", mv);
    }, [x, y]);

    return (
        <>
            <motion.div className="fixed top-0 left-0 pointer-events-none z-[9999999] rounded-full"
                style={{ x, y, translateX: "-50%", translateY: "-50%", background: hov ? C.purple : C.teal, opacity: hide ? 0 : 1 }}
                animate={{ width: hov ? 6 : 8, height: hov ? 6 : 8 }}
                transition={{ duration: 0.15 }}
            />
            <motion.div className="fixed top-0 left-0 pointer-events-none z-[9999998] rounded-full"
                style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%", border: `1.5px solid ${hov ? C.purple : `${C.teal}80`}`, opacity: hide ? 0 : 1 }}
                animate={{ width: hov ? 48 : 32, height: hov ? 48 : 32 }}
                transition={{ duration: 0.2 }}
            />
        </>
    );
}

/* ═══════════════════════════════════════════════════════════════
   NAV
   ═══════════════════════════════════════════════════════════════ */
function Nav({ splashDone }: { splashDone: boolean }) {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", h, { passive: true });
        return () => window.removeEventListener("scroll", h);
    }, []);

    return (
        <motion.nav
            className="fixed left-0 right-0 z-[9997] flex items-center justify-between py-5 px-8 md:px-16 transition-all duration-500"
            style={{
                top: 0,
                borderBottom: scrolled ? `1px solid rgba(255,255,255,0.08)` : "1px solid transparent",
                background: scrolled ? "rgba(0,0,0,0.92)" : "transparent",
                backdropFilter: scrolled ? "blur(20px)" : "none",
            }}
            initial={{ opacity: 0, y: -100 }}
            animate={splashDone && scrolled ? { opacity: 1, y: 0 } : { opacity: 0, y: -100, pointerEvents: 'none' }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
        >
            <span style={{ fontFamily: C.D, fontSize: "26px", letterSpacing: "0.1em", color: C.white, lineHeight: 1 }}>
                GEO BOOST
            </span>
            <motion.a href="#form"
                className="px-6 py-2.5 transition-all duration-300"
                style={{ fontFamily: C.D, fontSize: "16px", letterSpacing: "0.12em", border: `2px solid ${C.teal}`, color: C.teal, background: "transparent" }}
                whileHover={{ background: C.teal, color: C.dark }}
                whileTap={{ scale: 0.97 }}
            >
                AUDIT GRATUIT
            </motion.a>
        </motion.nav>
    );
}

/* ═══════════════════════════════════════════════════════════════
   CHAT MOCK — replica fidèle de l'interface ChatGPT
   ═══════════════════════════════════════════════════════════════ */
const UI = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif";

/* OpenAI logo SVG path */
function OpenAIIcon({ size = 14, color = "white" }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 41 41" fill={color} xmlns="http://www.w3.org/2000/svg">
            <path d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-6.205-2.799 10.079 10.079 0 0 0-10.783 7.044 9.963 9.963 0 0 0-6.645 4.816 10.079 10.079 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 6.205 2.799 10.079 10.079 0 0 0 10.785-7.044 9.965 9.965 0 0 0 6.644-4.816 10.079 10.079 0 0 0-1.241-11.818zm-15.006 21.055a7.452 7.452 0 0 1-4.789-1.727l.239-.136 7.964-4.6a1.294 1.294 0 0 0 .655-1.134v-11.24l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.5 7.502zm-16.134-6.901a7.454 7.454 0 0 1-.894-5.023l.239.144 7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.242-2.747zm-2.09-17.438a7.482 7.482 0 0 1 3.908-3.285v9.458a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.012l-8.048-4.648a7.498 7.498 0 0 1-2.757-10.227zm27.658 6.437l-9.724-5.615 3.367-1.943a.121.121 0 0 1 .114-.012l8.048 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.647-1.13zm3.35-5.043l-.239-.144-7.964-4.6a1.297 1.297 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.048-4.648a7.498 7.498 0 0 1 11.138 7.769zm-21.063 6.929l-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756l-.239.136-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.003 11.223zm1.829-3.943l4.33-2.501 4.332 2.5v4.999l-4.331 2.5-4.331-2.5z" />
        </svg>
    );
}

function ChatMock({ mode, delay = 0 }: { mode: "without" | "with"; delay?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-10%" });
    const [phase, setPhase] = useState<0 | 1 | 2>(0);
    const isWith = mode === "with";

    useEffect(() => {
        if (!inView) return;
        const t1 = setTimeout(() => setPhase(1), delay + 400);
        const t2 = setTimeout(() => setPhase(2), delay + 2000);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [inView, delay]);

    const results = isWith ? [
        { name: "Votre Entreprise", note: "4.9", desc: "Expertise locale reconnue · Présence vérifiée · Avis certifiés", you: true },
        { name: "Concurrent A", note: "4.6", desc: "Bien noté par ses clients, présence locale solide", you: false },
        { name: "Concurrent B", note: "4.4", desc: "Actif depuis 2018, réputation correcte", you: false },
    ] : [
        { name: "Concurrent A", note: "4.9", desc: "Expert local reconnu · Forte présence en ligne", you: false },
        { name: "Concurrent B", note: "4.7", desc: "Très bien noté, mentionné dans plusieurs guides locaux", you: false },
        { name: "Concurrent C", note: "4.5", desc: "Présence établie dans la région", you: false },
    ];

    /* ChatGPT authentic colours */
    const G = {
        winBar:    "#0d0d0d",
        sidebar:   "#171717",
        bg:        "#212121",
        userMsg:   "#2f2f2f",
        border:    "rgba(255,255,255,0.07)",
        text:      "#ececec",
        muted:     "#8e8ea0",
        dimText:   "rgba(255,255,255,0.35)",
        green:     "#10a37f",
        inputBg:   "#2f2f2f",
    };

    const StarIcon = ({ filled }: { filled: boolean }) => (
        <svg width="10" height="10" viewBox="0 0 24 24" fill={filled ? "#F59E0B" : "none"} stroke="#F59E0B" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );

    return (
        <div ref={ref} style={{
            fontFamily: UI,
            background: G.bg,
            border: isWith ? `1.5px solid ${C.teal}55` : `1px solid ${G.border}`,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: isWith
                ? `0 0 0 1px ${C.teal}20, 0 20px 60px rgba(0,0,0,0.5)`
                : "0 20px 60px rgba(0,0,0,0.4)",
        }}>
            {/* ── macOS window chrome ── */}
            <div style={{
                position: "relative",
                background: G.winBar,
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                borderBottom: `1px solid rgba(255,255,255,0.05)`,
                flexShrink: 0,
                userSelect: "none",
            }}>
                <div style={{ display: "flex", gap: 7 }}>
                    {["#FF5F57", "#FFBD2E", "#28C840"].map((col, i) => (
                        <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: col, opacity: 0.88 }} />
                    ))}
                </div>
                <span style={{
                    position: "absolute", left: "50%", transform: "translateX(-50%)",
                    fontSize: "12px", color: G.dimText, letterSpacing: "0.02em",
                }}>
                    ChatGPT
                </span>
            </div>

            {/* ── ChatGPT top bar ── */}
            <div style={{
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: `1px solid ${G.border}`,
                background: G.bg,
                flexShrink: 0,
            }}>
                {/* Model selector */}
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <div style={{
                        width: 22, height: 22, borderRadius: "50%",
                        background: G.green,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                    }}>
                        <OpenAIIcon size={12} color="white" />
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: G.text, letterSpacing: "-0.01em" }}>ChatGPT</span>
                    <span style={{ fontSize: "12px", color: G.muted }}>4o</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9l6 6 6-6" stroke={G.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                {/* Right icons */}
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke={G.dimText} strokeWidth="1.5" />
                        <path d="M8 12h8M12 8l4 4-4 4" stroke={G.dimText} strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <div style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "11px", fontWeight: 700, color: "white",
                    }}>U</div>
                </div>
            </div>

            {/* ── Conversation area ── */}
            <div style={{ padding: "22px 18px 16px", flex: 1, overflowY: "hidden" }}>
                {/* User message */}
                <motion.div
                    style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.3, delay: delay / 1000 + 0.1 }}
                >
                    <div style={{
                        background: G.userMsg,
                        padding: "10px 15px",
                        borderRadius: "18px 18px 4px 18px",
                        maxWidth: "78%",
                        border: `1px solid rgba(255,255,255,0.06)`,
                    }}>
                        <p style={{ fontSize: "13.5px", color: G.text, lineHeight: 1.5, margin: 0 }}>
                            Quel est le meilleur [secteur] à [ville] ?
                        </p>
                    </div>
                </motion.div>

                {/* AI response row */}
                <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                    {/* GPT avatar */}
                    <div style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: G.green, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        marginTop: 1,
                    }}>
                        <OpenAIIcon size={14} color="white" />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Typing dots */}
                        {phase === 1 && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                style={{ display: "flex", gap: 5, alignItems: "center", paddingTop: 6 }}
                            >
                                {[0, 1, 2].map(i => (
                                    <motion.div key={i}
                                        style={{ width: 6, height: 6, borderRadius: "50%", background: G.muted }}
                                        animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
                                        transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                                    />
                                ))}
                            </motion.div>
                        )}

                        {/* Results */}
                        {phase === 2 && (
                            <div>
                                <motion.p
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    style={{ fontSize: "13.5px", color: G.text, lineHeight: 1.65, marginBottom: 12, margin: "0 0 12px" }}
                                >
                                    Voici les meilleures options pour <strong style={{ color: G.text }}>[secteur]</strong> à <strong style={{ color: G.text }}>[ville]</strong> :
                                </motion.p>

                                {results.map((r, i) => (
                                    <motion.div key={i}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.13, duration: 0.35 }}
                                        style={{
                                            padding: "10px 12px",
                                            marginBottom: 6,
                                            borderRadius: 10,
                                            border: r.you
                                                ? `1.5px solid ${C.teal}`
                                                : `1px solid rgba(255,255,255,0.07)`,
                                            background: r.you
                                                ? `${C.teal}0D`
                                                : "rgba(255,255,255,0.02)",
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                                            <span style={{
                                                fontSize: "13px", fontWeight: 600,
                                                color: r.you ? C.teal : G.text,
                                            }}>
                                                {r.you && <span style={{ fontSize: "10px", background: C.teal, color: C.dark, padding: "1px 6px", borderRadius: 3, marginRight: 6, fontWeight: 700, letterSpacing: "0.04em" }}>VOUS</span>}
                                                {r.name}
                                            </span>
                                            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                                <div style={{ display: "flex", gap: 1 }}>
                                                    {[1,2,3,4,5].map(n => (
                                                        <StarIcon key={n} filled={n <= Math.round(parseFloat(r.note))} />
                                                    ))}
                                                </div>
                                                <span style={{ fontSize: "11px", color: "#F59E0B", fontWeight: 600, marginLeft: 2 }}>{r.note}</span>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: "12px", color: G.muted, lineHeight: 1.45, margin: 0 }}>{r.desc}</p>
                                    </motion.div>
                                ))}

                                {!isWith && (
                                    <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                                        style={{
                                            marginTop: 10, padding: "9px 12px",
                                            borderRadius: 8,
                                            borderLeft: `3px solid rgba(255,80,80,0.35)`,
                                            background: "rgba(255,80,80,0.04)",
                                        }}
                                    >
                                        <p style={{ fontSize: "12px", color: "rgba(255,140,140,0.6)", fontStyle: "italic", margin: 0 }}>
                                            Votre entreprise n&apos;apparaît pas dans ces résultats.
                                        </p>
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Input bar ── */}
            <div style={{
                padding: "10px 14px 14px",
                flexShrink: 0,
            }}>
                <div style={{
                    background: G.inputBg,
                    borderRadius: 13,
                    padding: "11px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    border: `1px solid rgba(255,255,255,0.08)`,
                }}>
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)", flex: 1 }}>
                        Envoyer un message à ChatGPT
                    </span>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinejoin="round" />
                        </svg>
                        <div style={{
                            width: 30, height: 30, borderRadius: 8,
                            background: phase === 2 ? G.green : "rgba(255,255,255,0.07)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "background 500ms",
                        }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                <path d="M12 19V5M5 12l7-7 7 7" stroke={phase === 2 ? "white" : "rgba(255,255,255,0.2)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
                <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.12)", textAlign: "center", marginTop: 8 }}>
                    ChatGPT peut faire des erreurs. Vérifiez les informations importantes.
                </p>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 1 — HERO
   ═══════════════════════════════════════════════════════════════ */
function Hero({ splashDone }: { splashDone: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
    const op = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    return (
        <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden" style={{ background: C.dark }}>

            {/* Ambient glow */}
            <motion.div className="absolute pointer-events-none"
                style={{ width: 600, height: 600, top: "-10%", left: "-8%", borderRadius: "50%", background: `radial-gradient(circle, ${C.teal}08 0%, transparent 70%)`, filter: "blur(80px)" }}
                animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div className="absolute pointer-events-none"
                style={{ width: 400, height: 400, top: "30%", right: "-5%", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}08 0%, transparent 70%)`, filter: "blur(80px)" }}
                animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            />

            <motion.div className="relative z-10 w-full px-8 md:px-16 pt-28 pb-20" style={{ y, opacity: op }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 items-center max-w-7xl mx-auto">

                    {/* Left — headline */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={splashDone ? { opacity: 1 } : {}}
                            transition={{ duration: 0.6, delay: 0.3, ease: EX }}
                        >
                            <div className="inline-flex items-center gap-3 mb-10"
                                style={{ border: "1px solid rgba(255,255,255,0.10)", padding: "6px 14px" }}>
                                <motion.div style={{ width: 5, height: 5, borderRadius: "50%", background: C.teal }}
                                    animate={{ opacity: [1, 0.3, 1] }}
                                    transition={{ duration: 1.4, repeat: Infinity }}
                                />
                                <span style={{ fontFamily: C.M, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
                                    GEO · 2025
                                </span>
                            </div>
                        </motion.div>

                        {/* Stacked headline — Bebas, huge */}
                        <div style={{ overflow: "hidden" }}>
                            {["L'IA VIENT DE", "RECOMMANDER", "UN DE", "VOS CONCURRENTS."].map((line, i) => (
                                <div key={i} style={{ overflow: "hidden" }}>
                                    <motion.p
                                        style={{
                                            fontFamily: C.D,
                                            fontSize: (i === 1 || i === 2) ? "clamp(3.8rem, 9vw, 9rem)" : "clamp(2.8rem, 7vw, 7rem)",
                                            letterSpacing: "0.04em",
                                            lineHeight: 0.9,
                                            color: i === 3 ? C.teal : C.white,
                                            marginBottom: "0.06em",
                                        }}
                                        initial={{ y: 100, opacity: 0 }}
                                        animate={splashDone ? { y: 0, opacity: 1 } : {}}
                                        transition={{ duration: 0.9, delay: 0.4 + i * 0.1, ease: EX }}
                                    >{line}</motion.p>
                                </div>
                            ))}
                        </div>

                        <motion.p
                            className="mt-8 max-w-md"
                            style={{ fontFamily: C.M, fontSize: "14px", lineHeight: 1.8, color: "rgba(255,255,255,0.45)" }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={splashDone ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.9, delay: 0.8, ease: EX }}
                        >
                            ChatGPT, Perplexity, Gemini — chaque jour, vos clients interrogent
                            une IA pour trouver votre type de service. 9 fois sur 10,
                            c&apos;est votre concurrent qui apparaît.
                        </motion.p>

                        <motion.div
                            className="mt-10 flex items-center gap-4"
                            initial={{ opacity: 0 }}
                            animate={splashDone ? { opacity: 1 } : {}}
                            transition={{ duration: 0.8, delay: 1.0, ease: EX }}
                        >
                            <motion.a href="#form"
                                className="px-8 py-3.5 transition-all duration-300"
                                style={{ fontFamily: C.D, fontSize: "18px", letterSpacing: "0.12em", border: `3px solid ${C.teal}`, color: C.teal, background: "transparent" }}
                                whileHover={{ background: C.teal, color: C.dark }}
                                whileTap={{ scale: 0.97 }}
                            >
                                VOIR MON AUDIT GRATUIT
                            </motion.a>
                        </motion.div>
                    </div>

                    {/* Right — Chat mock */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={splashDone ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 1, delay: 0.6, ease: EX }}
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <span style={{ fontFamily: C.M, fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
                                Simulation en temps réel
                            </span>
                            <motion.div className="flex gap-1"
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                {[0, 1, 2].map(i => <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: C.teal, opacity: 1 - i * 0.3 }} />)}
                            </motion.div>
                        </div>
                        <ChatMock mode="without" delay={800} />
                    </motion.div>
                </div>

                {/* Scroll cue */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={splashDone ? { opacity: 1 } : {}}
                    transition={{ delay: 1.4, duration: 1 }}
                >
                    <motion.div style={{ width: 1, height: 48, background: `linear-gradient(to bottom, transparent, ${C.teal})` }}
                        animate={{ scaleY: [0, 1, 0], originY: "top" }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 2 — L'ÉVIDENCE (2 stats, traitement éditorial)
   ═══════════════════════════════════════════════════════════════ */
function EvidenceSection() {
    return (
        <section aria-label="Statistiques clés sur la recherche IA" style={{ background: C.bg, padding: "120px 0" }}>
            <div className="px-8 md:px-16 max-w-7xl mx-auto">

                {/* Stat 1 — teal accent */}
                <R>
                    <div className="flex flex-col md:flex-row items-start gap-8 md:gap-16"
                        style={{ borderTop: `3px solid ${C.teal}`, paddingTop: 28 }}>
                        <div style={{ flexShrink: 0 }}>
                            <p style={{ fontFamily: C.D, fontSize: "clamp(6rem, 16vw, 14rem)", lineHeight: 0.85, letterSpacing: "0.02em", color: C.teal }}>
                                <Num v={65} s="%" />
                            </p>
                        </div>
                        <div className="md:pt-8 max-w-lg">
                            <h2 style={{ fontFamily: C.D, fontSize: "clamp(1.6rem, 3.5vw, 3rem)", letterSpacing: "0.05em", lineHeight: 1, color: C.text, marginBottom: 16 }}>
                                DES RECHERCHES GOOGLE AFFICHENT UNE RÉPONSE IA EN PREMIER.
                            </h2>
                            <p style={{ fontFamily: C.M, fontSize: "14px", lineHeight: 1.8, color: C.muted }}>
                                Le résultat #1 que vous cherchez à atteindre depuis des années ?
                                Il est maintenant en dessous de la réponse IA. Le jeu a changé.
                                La question n&apos;est plus d&apos;être premier sur Google.
                            </p>
                            <p style={{ fontFamily: C.M, fontSize: "10px", marginTop: 16, letterSpacing: "0.18em", textTransform: "uppercase", color: C.dim }}>
                                SparkToro · 2024
                            </p>
                        </div>
                    </div>
                </R>

                {/* Séparateur */}
                <div style={{ height: 1, background: C.border, margin: "80px 0" }} />

                {/* Stat 2 — alignée à droite */}
                <R>
                    <div className="flex flex-col md:flex-row-reverse items-start gap-8 md:gap-16"
                        style={{ borderTop: `3px solid ${C.text}`, paddingTop: 28 }}>
                        <div style={{ flexShrink: 0 }}>
                            <p style={{ fontFamily: C.D, fontSize: "clamp(6rem, 16vw, 14rem)", lineHeight: 0.85, letterSpacing: "0.02em", color: C.text }}>
                                9<span style={{ fontSize: "0.45em", color: C.dim }}>/10</span>
                            </p>
                        </div>
                        <div className="md:pt-8 max-w-lg md:text-right">
                            <h2 style={{ fontFamily: C.D, fontSize: "clamp(1.6rem, 3.5vw, 3rem)", letterSpacing: "0.05em", lineHeight: 1, color: C.text, marginBottom: 16 }}>
                                PME LOCALES ABSENTES DES RÉPONSES IA DANS LEUR SECTEUR.
                            </h2>
                            <p style={{ fontFamily: C.M, fontSize: "14px", lineHeight: 1.8, color: C.muted }}>
                                Nous avons interrogé les principales IA sur des milliers de
                                requêtes locales. Le constat est sans appel : la quasi-totalité
                                des PME n&apos;existe pas pour les algorithmes génératifs.
                            </p>
                            <p style={{ fontFamily: C.M, fontSize: "10px", marginTop: 16, letterSpacing: "0.18em", textTransform: "uppercase", color: C.dim }}>
                                Étude interne · 2024
                            </p>
                        </div>
                    </div>
                </R>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 3 — DÉMONSTRATION (avant / après)
   ═══════════════════════════════════════════════════════════════ */
function DemoSection() {
    return (
        <section style={{ background: C.dark, padding: "120px 0", borderTop: `2px solid ${C.text}` }}>
            <div className="px-8 md:px-16 max-w-7xl mx-auto">

                <R className="mb-16">
                    <div>
                        <p style={{ fontFamily: C.M, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: C.teal, marginBottom: 14 }}>
                            Ce que voit votre client
                        </p>
                        <SplitText
                            text="La différence en une image."
                            style={{ fontFamily: C.D, fontSize: "clamp(2.8rem, 7vw, 7rem)", letterSpacing: "0.04em", lineHeight: 0.9, color: C.white }}
                        />
                        <p className="mt-6 max-w-lg" style={{ fontFamily: C.M, fontSize: "14px", lineHeight: 1.8, color: "rgba(255,255,255,0.4)" }}>
                            Voici exactement ce qui se passe quand votre client pose sa
                            question à une IA — et ce qui pourrait se passer après votre audit GEO.
                        </p>
                    </div>
                </R>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {/* Sans GEO */}
                    <R delay={0.1}>
                        <div>
                            <div className="flex items-center gap-3 mb-4"
                                style={{ paddingBottom: 14, borderBottom: `2px solid rgba(255,255,255,0.08)` }}>
                                <div style={{ width: 8, height: 8, background: C.dim }} />
                                <span style={{ fontFamily: C.M, fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: C.dim }}>
                                    Aujourd&apos;hui — sans GEO
                                </span>
                            </div>
                            <ChatMock mode="without" delay={200} />
                        </div>
                    </R>

                    {/* Avec GEO */}
                    <R delay={0.25}>
                        <div>
                            <div className="flex items-center gap-3 mb-4"
                                style={{ paddingBottom: 14, borderBottom: `2px solid ${C.teal}` }}>
                                <div style={{ width: 8, height: 8, background: C.teal }} />
                                <span style={{ fontFamily: C.M, fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: C.teal }}>
                                    Après GEO Boost
                                </span>
                            </div>
                            <ChatMock mode="with" delay={600} />
                        </div>
                    </R>
                </div>

                {/* Stat clé entre les deux */}
                <R delay={0.4}>
                    <div className="mt-16 pt-12 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        {[
                            { v: "3", l: "citations maximum par réponse IA" },
                            { v: "#1", l: "la première citation capte tout l'intent" },
                            { v: "94%", l: "ne reposent jamais la même question" },
                        ].map((d, i) => (
                            <div key={i} className="text-center"
                                style={{ borderTop: i === 0 ? `2px solid ${C.teal}` : "2px solid rgba(255,255,255,0.12)", paddingTop: 12, minWidth: 100 }}>
                                <p style={{ fontFamily: C.D, fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "0.06em", color: i === 0 ? C.teal : C.white }}>
                                    {d.v}
                                </p>
                                <p style={{ fontFamily: C.M, fontSize: "11px", marginTop: 6, letterSpacing: "0.08em", color: "rgba(255,255,255,0.3)", maxWidth: 140, textAlign: "center" }}>
                                    {d.l}
                                </p>
                            </div>
                        ))}
                    </div>
                </R>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION — CE QUE LES IA ANALYSENT
   ═══════════════════════════════════════════════════════════════ */
function GeoSignalsSection() {
    const signals = [
        {
            num: "01",
            name: "E-E-A-T",
            sub: "Expérience · Expertise · Autorité · Confiance",
            desc: "Les IA privilégient les sources qui démontrent une expertise métier réelle et vérifiable — témoignages, mentions presse, certifications sectorielles.",
        },
        {
            num: "02",
            name: "SCHEMA.ORG",
            sub: "Données structurées",
            desc: "Les balises Schema.org permettent aux IA de comprendre précisément votre activité, vos services, votre zone géographique et vos horaires.",
        },
        {
            num: "03",
            name: "COHÉRENCE NAP",
            sub: "Nom · Adresse · Téléphone",
            desc: "Une incohérence entre votre site, Google Business et les annuaires suffit à vous exclure des recommandations locales.",
        },
        {
            num: "04",
            name: "AVIS & NOTES",
            sub: "Volume · Qualité · Récence",
            desc: "Les algorithmes génératifs analysent le volume, la qualité et la récence de vos avis. Un faible volume = zéro confiance = zéro citation.",
        },
        {
            num: "05",
            name: "MENTIONS TIERCES",
            sub: "Citations hors domaine",
            desc: "Êtes-vous cité dans des articles de presse, des comparatifs, des forums locaux ? Ces signaux indépendants sont cruciaux pour la confiance des IA.",
        },
        {
            num: "06",
            name: "AUTORITÉ DOMAINE",
            sub: "Domain Authority",
            desc: "La qualité et la quantité des sites qui pointent vers votre domaine reste un signal fondamental pour la crédibilité aux yeux des moteurs génératifs.",
        },
    ];

    return (
        <section aria-label="Les 6 signaux analysés par les IA" style={{ background: C.bg, padding: "120px 0" }}>
            <div className="px-8 md:px-16 max-w-7xl mx-auto">
                <R className="mb-16">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                        <div>
                            <p style={{ fontFamily: C.M, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: C.teal, marginBottom: 14 }}>
                                Notre méthode d&apos;analyse
                            </p>
                            <SplitText
                                text="Ce que les IA analysent."
                                style={{ fontFamily: C.D, fontSize: "clamp(2.8rem, 7vw, 6rem)", letterSpacing: "0.04em", lineHeight: 0.9, color: C.text }}
                            />
                        </div>
                        <p className="max-w-sm md:pb-2" style={{ fontFamily: C.M, fontSize: "14px", lineHeight: 1.8, color: C.muted }}>
                            Six signaux déterminent si une IA vous cite ou vous ignore.
                            Notre audit les mesure tous avec précision.
                        </p>
                    </div>
                </R>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {signals.map((s, i) => (
                        <R key={i} delay={i * 0.06}>
                            <motion.div
                                className="p-8"
                                style={{ borderTop: `2px solid ${C.border}`, cursor: "default" }}
                                whileHover={{ borderTopColor: C.teal } as any}
                                transition={{ duration: 0.2 }}
                            >
                                <span style={{ fontFamily: C.M, fontSize: "10px", letterSpacing: "0.14em", color: C.dim, display: "block", marginBottom: 16 }}>
                                    {s.num}
                                </span>
                                <h3 style={{ fontFamily: C.D, fontSize: "clamp(1.6rem, 2.8vw, 2.5rem)", letterSpacing: "0.06em", lineHeight: 0.9, color: C.text, marginBottom: 10 }}>
                                    {s.name}
                                </h3>
                                <p style={{ fontFamily: C.M, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: C.teal, marginBottom: 14 }}>
                                    {s.sub}
                                </p>
                                <p style={{ fontFamily: C.M, fontSize: "13px", lineHeight: 1.7, color: C.muted }}>
                                    {s.desc}
                                </p>
                            </motion.div>
                        </R>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION — APERÇU RAPPORT D'AUDIT
   ═══════════════════════════════════════════════════════════════ */
function AuditPreviewSection() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    const scores = [
        { label: "Score GEO Global", val: 18, max: 100, tag: "CRITIQUE", color: "#EF4444" },
        { label: "Visibilité ChatGPT", val: 1, max: 10, tag: "ABSENT", color: "#EF4444" },
        { label: "Visibilité Perplexity", val: 0, max: 10, tag: "ABSENT", color: "#EF4444" },
        { label: "Visibilité Gemini AI", val: 2, max: 10, tag: "FAIBLE", color: "#F59E0B" },
        { label: "Signaux E-E-A-T", val: 3, max: 10, tag: "FAIBLE", color: "#F59E0B" },
        { label: "Données structurées", val: 1, max: 10, tag: "MANQUANT", color: "#EF4444" },
    ];

    const competitors = [
        { name: "Concurrent A", score: "94/100" },
        { name: "Concurrent B", score: "87/100" },
        { name: "Concurrent C", score: "76/100" },
    ];

    const actions = [
        "Implémenter Schema LocalBusiness",
        "Uniformiser NAP sur 12 annuaires",
        "Générer 15 avis certifiés",
        "Créer 3 pages de contenu expert",
    ];

    return (
        <section aria-label="Aperçu du rapport d'audit GEO" style={{ background: C.bg, padding: "120px 0" }}>
            <div className="px-8 md:px-16 max-w-7xl mx-auto">
                <R className="mb-16">
                    <div>
                        <p style={{ fontFamily: C.M, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: C.teal, marginBottom: 14 }}>
                            Ce que vous recevez
                        </p>
                        <SplitText
                            text="Votre rapport d'audit GEO."
                            style={{ fontFamily: C.D, fontSize: "clamp(2.8rem, 7vw, 6rem)", letterSpacing: "0.04em", lineHeight: 0.9, color: C.text }}
                        />
                        <p className="mt-6 max-w-lg" style={{ fontFamily: C.M, fontSize: "14px", lineHeight: 1.8, color: C.muted }}>
                            Un document structuré, lisible en 5 minutes, avec des actions concrètes.
                            Voici un aperçu anonymisé de ce qu&apos;un client reçoit.
                        </p>
                    </div>
                </R>

                <div ref={ref} className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                    {/* Rapport principal */}
                    <R delay={0.1} className="lg:col-span-3">
                        <div style={{ border: `2px solid ${C.text}` }}>
                            {/* Header doc */}
                            <div style={{
                                padding: "20px 24px",
                                borderBottom: `2px solid ${C.text}`,
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                background: C.dark,
                            }}>
                                <div>
                                    <span style={{ fontFamily: C.D, fontSize: "22px", letterSpacing: "0.1em", color: C.white }}>RAPPORT GEO</span>
                                    <p style={{ fontFamily: C.M, fontSize: "10px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", marginTop: 3 }}>
                                        CONFIDENTIEL · VOTRE ENTREPRISE
                                    </p>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontFamily: C.D, fontSize: "42px", letterSpacing: "0.04em", color: "#EF4444", lineHeight: 1 }}>18</div>
                                    <div style={{ fontFamily: C.M, fontSize: "9px", letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)" }}>/100</div>
                                </div>
                            </div>
                            {/* Score rows */}
                            <div style={{ padding: "22px 24px", background: C.white }}>
                                {scores.map((s, i) => (
                                    <div key={i} style={{ marginBottom: i < scores.length - 1 ? 18 : 0 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                                            <span style={{ fontFamily: C.M, fontSize: "12px", color: C.text }}>{s.label}</span>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <span style={{ fontFamily: C.M, fontSize: "10px", letterSpacing: "0.08em", color: s.color }}>{s.tag}</span>
                                                <span style={{ fontFamily: C.D, fontSize: "18px", letterSpacing: "0.06em", color: C.text }}>
                                                    {s.val}<span style={{ fontSize: "11px", color: C.muted }}>/{s.max}</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ height: 3, background: "rgba(0,0,0,0.07)" }}>
                                            <motion.div
                                                style={{ height: "100%", background: s.color, transformOrigin: "left" }}
                                                initial={{ scaleX: 0 }}
                                                animate={inView ? { scaleX: s.val / s.max } : {}}
                                                transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: EX }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </R>

                    {/* Panneaux latéraux */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Concurrents */}
                        <R delay={0.2}>
                            <div style={{ border: `2px solid ${C.text}`, background: C.dark }}>
                                <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                                    <span style={{ fontFamily: C.D, fontSize: "15px", letterSpacing: "0.1em", color: C.white }}>CONCURRENTS DÉTECTÉS</span>
                                </div>
                                <div style={{ padding: "12px 18px" }}>
                                    {competitors.map((c, i) => (
                                        <motion.div key={i}
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={inView ? { opacity: 1, x: 0 } : {}}
                                            transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                                            style={{
                                                padding: "10px 0",
                                                borderBottom: i < competitors.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                            }}
                                        >
                                            <span style={{ fontFamily: UI, fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{c.name}</span>
                                            <span style={{ fontFamily: C.M, fontSize: "11px", color: C.teal }}>{c.score}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </R>

                        {/* Actions */}
                        <R delay={0.3}>
                            <div style={{ border: `2px solid ${C.teal}`, background: `${C.teal}06` }}>
                                <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.teal}25` }}>
                                    <span style={{ fontFamily: C.D, fontSize: "15px", letterSpacing: "0.1em", color: C.teal }}>ACTIONS PRIORITAIRES</span>
                                </div>
                                <div style={{ padding: "12px 18px" }}>
                                    {actions.map((a, i) => (
                                        <div key={i} style={{
                                            display: "flex", gap: 10, padding: "9px 0",
                                            borderBottom: i < actions.length - 1 ? `1px solid ${C.teal}15` : "none",
                                        }}>
                                            <span style={{ fontFamily: C.M, color: C.teal, flexShrink: 0, fontSize: "12px" }}>——</span>
                                            <p style={{ fontFamily: C.M, fontSize: "12px", lineHeight: 1.5, color: C.text }}>{a}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </R>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION — FAQ
   ═══════════════════════════════════════════════════════════════ */
function FAQSection() {
    const [open, setOpen] = useState<number | null>(null);

    const faqs = [
        {
            q: "Je suis déjà bien positionné sur Google. Pourquoi me préoccuper du GEO ?",
            a: "Votre position sur Google ne détermine pas si une IA vous cite. Les algorithmes génératifs analysent des signaux de confiance spécifiques — avis, mentions tierces, données structurées — souvent absents de votre présence en ligne. Être premier sur Google ne garantit pas d'être recommandé par ChatGPT ou Perplexity.",
        },
        {
            q: "Quel délai pour voir des résultats ?",
            a: "Les premiers signaux apparaissent en 4 à 8 semaines. Les améliorations structurelles (Schema.org, cohérence NAP) sont indexées rapidement. La construction d'autorité via les avis et les mentions prend 2 à 3 mois. Nous vous donnons un plan priorisé pour maximiser l'impact à court terme.",
        },
        {
            q: "C'est quoi l'appel de 30 min inclus dans l'audit ?",
            a: "C'est un appel stratégique avec un spécialiste GEO — pas un argumentaire commercial. Nous vous présentons les résultats de votre audit, vos 3 actions prioritaires, et répondons à toutes vos questions. Vous repartez avec un plan d'action concret, que vous travailliez avec nous ou non.",
        },
        {
            q: "Est-ce que ça marche pour mon secteur d'activité ?",
            a: "Le GEO fonctionne pour tout secteur où des clients locaux interrogent une IA pour trouver un prestataire : restaurants, avocats, médecins, artisans, agences, consultants, commerces de proximité. Si des gens recherchent votre type de service en ligne, vous avez besoin de visibilité GEO.",
        },
    ];

    return (
        <section aria-label="Questions fréquentes" style={{ background: C.dark, padding: "120px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="px-8 md:px-16 max-w-4xl mx-auto">
                <R className="mb-16">
                    <SplitText
                        text="Questions fréquentes."
                        style={{ fontFamily: C.D, fontSize: "clamp(2.8rem, 7vw, 6rem)", letterSpacing: "0.04em", lineHeight: 0.9, color: C.white }}
                    />
                </R>

                <div itemScope itemType="https://schema.org/FAQPage">
                    {faqs.map((faq, i) => (
                        <R key={i} delay={i * 0.05}>
                            <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question" style={{ borderTop: `1px solid rgba(255,255,255,${open === i ? "0.14" : "0.07"})`, transition: "border-color 300ms" }}>
                                <button
                                    onClick={() => setOpen(open === i ? null : i)}
                                    className="w-full text-left py-6 flex items-center justify-between gap-6"
                                    style={{ background: "transparent", border: "none", cursor: "pointer" }}
                                >
                                    <h3 itemProp="name" style={{
                                        fontFamily: C.D,
                                        fontSize: "clamp(1.1rem, 2.2vw, 1.7rem)",
                                        letterSpacing: "0.04em",
                                        color: open === i ? C.teal : C.white,
                                        transition: "color 200ms",
                                        textAlign: "left",
                                    }}>
                                        {faq.q}
                                    </h3>
                                    <motion.div
                                        animate={{ rotate: open === i ? 45 : 0 }}
                                        transition={{ duration: 0.25, ease: EX }}
                                        style={{
                                            flexShrink: 0,
                                            width: 26, height: 26,
                                            border: `2px solid ${open === i ? C.teal : "rgba(255,255,255,0.18)"}`,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            transition: "border-color 200ms",
                                        }}
                                    >
                                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                            <line x1="5" y1="0" x2="5" y2="10" stroke={open === i ? C.teal : "rgba(255,255,255,0.4)"} strokeWidth="1.5" />
                                            <line x1="0" y1="5" x2="10" y2="5" stroke={open === i ? C.teal : "rgba(255,255,255,0.4)"} strokeWidth="1.5" />
                                        </svg>
                                    </motion.div>
                                </button>
                                <AnimatePresence initial={false}>
                                    {open === i && (
                                        <motion.div
                                            key="answer"
                                            itemScope={true} itemProp="acceptedAnswer" itemType="https://schema.org/Answer"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.35, ease: EX }}
                                            style={{ overflow: "hidden" }}
                                        >
                                            <p itemProp="text" style={{
                                                fontFamily: C.M, fontSize: "15px", lineHeight: 1.85,
                                                color: "rgba(255,255,255,0.45)",
                                                paddingBottom: 28, maxWidth: "72ch",
                                            }}>
                                                {faq.a}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </R>
                    ))}
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 4 — CTA FINAL
   ═══════════════════════════════════════════════════════════════ */
function FormSection() {
    const [btnHov, setBtnHov] = useState(false);

    const scrollToTop = (e: React.MouseEvent) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section id="form" aria-label="Demander un audit GEO gratuit" style={{ background: C.bg, padding: "120px 0" }}>
            <div className="px-8 md:px-16 max-w-4xl mx-auto text-center">
                <R>
                    <p style={{ fontFamily: C.M, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: C.teal, marginBottom: 14 }}>
                        Passez à l'action
                    </p>
                </R>
                <SplitText
                    text="Prêt à découvrir votre score GEO ?"
                    style={{ fontFamily: C.D, fontSize: "clamp(2.5rem, 5.5vw, 5rem)", letterSpacing: "0.05em", lineHeight: 0.9, color: C.text }}
                />

                <R delay={0.3}>
                    <p style={{ fontFamily: C.M, fontSize: "16px", lineHeight: 1.6, color: C.muted, marginTop: 24, marginBottom: 40, maxWidth: 600, margin: "24px auto 40px" }}>
                        Utilisez notre scanner IA gratuit en haut de page pour découvrir si ChatGPT et Perplexity vous recommandent à vos clients.
                    </p>
                </R>

                <R delay={0.5}>
                    <button onClick={scrollToTop}
                        onMouseEnter={() => setBtnHov(true)}
                        onMouseLeave={() => setBtnHov(false)}
                        className="py-4 px-10 cursor-pointer transition-all duration-300 mx-auto block"
                        style={{
                            fontFamily: C.D,
                            fontSize: "20px",
                            letterSpacing: "0.12em",
                            border: `3px solid ${C.teal}`,
                            background: btnHov ? C.teal : "transparent",
                            color: btnHov ? C.dark : C.teal,
                        }}
                    >
                        LANCER MON SCAN IA MAINTENANT
                    </button>
                    <p style={{ fontFamily: C.M, fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: C.dim, marginTop: 24 }}>
                        Gratuit · Sans engagement · Analyse en temps réel
                    </p>
                </R>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════════
   EXPORT
   ═══════════════════════════════════════════════════════════════ */
export default function PremiumLanding() {
    const splashDone = true;
    const [isTouch, setIsTouch] = useState(true);

    useEffect(() => {
        // Force scroll to top on mount — browser scroll restoration can offset the page
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        setIsTouch(window.matchMedia("(pointer: coarse)").matches);
    }, []);

    return (
        <div style={{ background: C.dark, color: C.text, fontFamily: C.M }}>
            <GrainOverlay />

            <ImmersiveChatHero splashDone={splashDone} />
            <EvidenceSection />
            <GeoSignalsSection />
            <DemoSection />
            <AuditPreviewSection />
            <FAQSection />
            <FormSection />

            <footer className="py-12 text-center" style={{ background: C.dark, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ fontFamily: C.D, fontSize: "20px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.65)", marginBottom: 12 }}>
                    GEO BOOST
                </p>
                <p style={{ fontFamily: C.M, fontSize: "12px", lineHeight: 1.6, color: "rgba(255,255,255,0.6)", maxWidth: 480, margin: "0 auto 16px" }}>
                    Agence spécialisée en Generative Engine Optimization pour les PME en Suisse Romande.
                </p>
                <nav aria-label="Liens du pied de page" style={{ marginBottom: 16 }}>
                    <a href="#form" style={{ fontFamily: C.M, fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: C.teal, textDecoration: "none" }}>
                        Audit GEO Gratuit
                    </a>
                </nav>
                <p style={{ fontFamily: C.M, fontSize: "11px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.55)" }}>
                    © {new Date().getFullYear()} MOSH · GEO Boost · Tous droits réservés
                </p>
            </footer>

            {/* Sticky CTA */}
            <motion.button
                onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="fixed bottom-6 right-6 z-[99] md:bottom-8 md:right-10 px-6 py-3.5 rounded-full text-sm font-semibold tracking-wide backdrop-blur-md flex items-center gap-3 transition-colors"
                style={{
                    background: `${C.teal}20`,
                    border: `1px solid ${C.teal}50`,
                    color: C.teal,
                    boxShadow: `0 8px 32px rgba(0,0,0,0.6), inset 0 0 10px ${C.teal}20`,
                    fontFamily: C.D,
                    letterSpacing: "0.08em"
                }}
                whileHover={{ scale: 1.05, background: `${C.teal}35`, boxShadow: `0 8px 40px ${C.teal}60` }}
                whileTap={{ scale: 0.95 }}
            >
                <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: C.teal }}></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: C.teal }}></span>
                </span>
                LANCER LE SCAN
            </motion.button>
        </div>
    );
}
