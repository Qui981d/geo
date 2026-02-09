"use client";

import { useState, useRef, useCallback, FormEvent, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";

/* ── Card Data ────────────────────────────────────── */
interface GmbCard {
    id: string;
    icon: string;
    title: string;
    status: string;
    stat: string;
    source: string;
    backDetail: string;
}

const GMB_CARDS: GmbCard[] = [
    {
        id: "avis",
        icon: "⭐",
        title: "Avis clients",
        status: "3 avis — insuffisant",
        stat: "Les commerces notés 4.5+ génèrent 35% de revenus en plus",
        source: "Source : Google Business Profile",
        backDetail: "Collecte & réponse aux avis",
    },
    {
        id: "photos",
        icon: "📸",
        title: "Photos",
        status: "2 photos — manquant",
        stat: "Les fiches avec +100 photos reçoivent 520% plus d'appels",
        source: "Source : Google",
        backDetail: "Galerie optimisée & géotaggée",
    },
    {
        id: "horaires",
        icon: "🕐",
        title: "Horaires",
        status: "Non renseigné",
        stat: "Les fiches sans horaires perdent 50% de visites potentielles",
        source: "Source : Google Business Insights",
        backDetail: "Horaires réguliers & exceptionnels",
    },
    {
        id: "contact",
        icon: "📞",
        title: "Contact",
        status: "Numéro manquant",
        stat: "76% des recherches locales aboutissent à un appel dans les 24h",
        source: "Source : Google / Ipsos",
        backDetail: "Téléphone, site web & liens",
    },
    {
        id: "description",
        icon: "📝",
        title: "Description",
        status: "Vide",
        stat: "Une description optimisée augmente les clics de 45%",
        source: "Source : BrightLocal 2024",
        backDetail: "Texte SEO optimisé 750 caractères",
    },
    {
        id: "adresse",
        icon: "📍",
        title: "Adresse",
        status: "Incomplète",
        stat: "\"Près de moi\" a augmenté de 900% en 2 ans sur Google",
        source: "Source : Think with Google",
        backDetail: "Localisation vérifiée & zone desservie",
    },
    {
        id: "messages",
        icon: "💬",
        title: "Messages",
        status: "Désactivé",
        stat: "Les fiches avec messagerie reçoivent 70% plus d'interactions",
        source: "Source : Google Business",
        backDetail: "Messagerie instantanée activée",
    },
    {
        id: "categories",
        icon: "🏷️",
        title: "Catégories",
        status: "1 seule — insuffisant",
        stat: "Les fiches avec catégories secondaires apparaissent dans 5x plus de recherches",
        source: "Source : Sterling Sky / Local SEO",
        backDetail: "Catégorie principale + secondaires",
    },
];

/* chaos positions — randomized around the viewport */
const CHAOS_POSITIONS = [
    { x: -35, y: -25, rotate: -18 },
    { x: 30, y: -30, rotate: 12 },
    { x: -40, y: 5, rotate: -8 },
    { x: 35, y: 10, rotate: 22 },
    { x: -25, y: 30, rotate: 15 },
    { x: 28, y: 25, rotate: -20 },
    { x: -10, y: -35, rotate: 6 },
    { x: 15, y: 35, rotate: -14 },
];

/* ── Easing ────────────────────────────────────────── */
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/* ================================================================
   ACT 1 — THE DOOR
   ================================================================ */
function ActDoor({ onOpen }: { onOpen: () => void }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isOpening, setIsOpening] = useState(false);

    const handleClick = () => {
        if (isOpening) return;
        setIsOpening(true);
        setTimeout(onOpen, 1000);
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: "#FAFAF8" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
        >
            {/* Ambient glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 60% 40% at 50% 55%, rgba(200,148,74,0.08) 0%, transparent 70%)",
                }}
            />

            {/* Title */}
            <motion.h1
                className="font-editorial text-center mb-12 relative z-10"
                style={{
                    fontSize: "clamp(28px, 6vw, 56px)",
                    color: "#1A1A1A",
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: EASE_OUT_EXPO }}
            >
                Votre commerce
                <br />
                <span style={{ color: "#C8944A" }}>est-il prêt ?</span>
            </motion.h1>

            {/* Door container with perspective */}
            <motion.div
                className="relative cursor-pointer"
                style={{ perspective: "1200px" }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: EASE_OUT_EXPO }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleClick}
            >
                {/* Door SVG */}
                <motion.div
                    style={{
                        transformOrigin: "left center",
                        transformStyle: "preserve-3d",
                    }}
                    animate={
                        isOpening
                            ? { rotateY: -110, opacity: 0 }
                            : isHovered
                                ? { rotateY: -6 }
                                : { rotateY: 0 }
                    }
                    transition={
                        isOpening
                            ? { duration: 0.9, ease: [0.4, 0, 0.2, 1] }
                            : { duration: 0.4, ease: "easeOut" }
                    }
                >
                    <svg
                        width="220"
                        height="340"
                        viewBox="0 0 220 340"
                        fill="none"
                        className="drop-shadow-2xl"
                    >
                        {/* Door frame */}
                        <rect
                            x="10"
                            y="10"
                            width="200"
                            height="320"
                            rx="8"
                            fill="#1A1A1A"
                            stroke="#C8944A"
                            strokeWidth="2"
                        />

                        {/* Inner panel top */}
                        <rect
                            x="35"
                            y="35"
                            width="150"
                            height="120"
                            rx="4"
                            fill="none"
                            stroke="#3a3a3a"
                            strokeWidth="1.5"
                        />

                        {/* Inner panel bottom */}
                        <rect
                            x="35"
                            y="175"
                            width="150"
                            height="120"
                            rx="4"
                            fill="none"
                            stroke="#3a3a3a"
                            strokeWidth="1.5"
                        />

                        {/* Door handle */}
                        <motion.g
                            animate={isHovered ? { rotate: 15 } : { rotate: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ originX: "170px", originY: "175px" }}
                        >
                            <circle
                                cx="170"
                                cy="175"
                                r="8"
                                fill="#C8944A"
                                opacity={isHovered ? 1 : 0.7}
                            />
                            <rect
                                x="166"
                                y="180"
                                width="8"
                                height="16"
                                rx="2"
                                fill="#C8944A"
                                opacity={isHovered ? 1 : 0.7}
                            />
                        </motion.g>

                        {/* Glass window effect at top */}
                        <rect
                            x="55"
                            y="50"
                            width="110"
                            height="90"
                            rx="2"
                            fill="rgba(200,148,74,0.04)"
                        />

                        {/* Warm glow on hover */}
                        {isHovered && (
                            <motion.rect
                                x="10"
                                y="10"
                                width="200"
                                height="320"
                                rx="8"
                                fill="rgba(200,148,74,0.06)"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            />
                        )}

                        {/* Google "G" on the door */}
                        <text
                            x="110"
                            y="105"
                            textAnchor="middle"
                            fontSize="36"
                            fontWeight="700"
                            fill="#C8944A"
                            opacity={0.3}
                            fontFamily="sans-serif"
                        >
                            G
                        </text>
                    </svg>
                </motion.div>

                {/* Glow behind door on hover */}
                <motion.div
                    className="absolute inset-0 -z-10 rounded-2xl"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(200,148,74,0.15) 0%, transparent 70%)",
                        scale: 1.3,
                    }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                />
            </motion.div>

            {/* Hint text */}
            <motion.p
                className="mt-8 font-mono text-xs tracking-widest uppercase"
                style={{ color: "#8A8A82" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
            >
                {isOpening ? "Entrez…" : "Cliquez pour entrer"}
            </motion.p>
        </motion.div>
    );
}

/* ================================================================
   ACT 2 — THE CHAOS
   ================================================================ */
function ActChaos({ onProceed }: { onProceed: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onProceed, 3500);
        return () => clearTimeout(timer);
    }, [onProceed]);

    return (
        <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden cursor-pointer"
            style={{ background: "#0d0d0d" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onProceed}
        >
            {/* Title */}
            <motion.div
                className="absolute top-12 left-0 right-0 text-center z-10 px-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
            >
                <h2
                    className="font-editorial text-2xl md:text-4xl mb-3"
                    style={{ color: "#FAFAF8" }}
                >
                    Voici l&apos;état de votre fiche Google.
                </h2>
                <p className="text-lg" style={{ color: "rgba(255,255,255,0.4)" }}>
                    C&apos;est le bazar, non ?
                </p>
            </motion.div>

            {/* Scattered cards */}
            {GMB_CARDS.map((card, i) => (
                <motion.div
                    key={card.id}
                    className="absolute rounded-xl px-5 py-4 flex items-center gap-3"
                    style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px dashed rgba(255,255,255,0.1)",
                        left: `calc(50% + ${CHAOS_POSITIONS[i].x}%)`,
                        top: `calc(50% + ${CHAOS_POSITIONS[i].y}%)`,
                        transform: `translate(-50%, -50%)`,
                    }}
                    initial={{ opacity: 0, scale: 0.5, rotate: CHAOS_POSITIONS[i].rotate * 2 }}
                    animate={{
                        opacity: [0, 0.7, 0.5],
                        scale: [0.5, 1.05, 1],
                        rotate: CHAOS_POSITIONS[i].rotate,
                        y: [0, -6, 0],
                    }}
                    transition={{
                        delay: 0.2 + i * 0.1,
                        duration: 1.2,
                        y: {
                            delay: 1.5 + i * 0.15,
                            duration: 2.5,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                        },
                    }}
                >
                    <span className="text-2xl opacity-50">{card.icon}</span>
                    <div>
                        <p
                            className="text-sm font-medium"
                            style={{ color: "rgba(255,255,255,0.5)" }}
                        >
                            {card.title}
                        </p>
                        <p
                            className="text-xs"
                            style={{ color: "rgba(255,59,48,0.7)" }}
                        >
                            {card.status}
                        </p>
                    </div>
                </motion.div>
            ))}

            {/* Click hint */}
            <motion.p
                className="absolute bottom-10 font-mono text-xs tracking-widest"
                style={{ color: "rgba(255,255,255,0.2)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
            >
                CLIQUEZ POUR CONTINUER
            </motion.p>
        </motion.div>
    );
}

/* ================================================================
   FLIP CARD (for Act 3)
   ================================================================ */
function FlipCard({
    card,
    isPlaced,
    onDragToFrame,
    frameRef,
}: {
    card: GmbCard;
    isPlaced: boolean;
    onDragToFrame: (id: string) => void;
    frameRef: React.RefObject<HTMLDivElement | null>;
}) {
    const [flipped, setFlipped] = useState(false);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const handleDragEnd = () => {
        if (!frameRef.current) return;
        const rect = frameRef.current.getBoundingClientRect();
        const cardX = x.get();
        const cardY = y.get();

        // Get the card element's current position
        const el = document.getElementById(`card-${card.id}`);
        if (!el) return;
        const cardRect = el.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;

        // Check if card center is within the frame
        if (
            cardCenterX > rect.left - 40 &&
            cardCenterX < rect.right + 40 &&
            cardCenterY > rect.top - 40 &&
            cardCenterY < rect.bottom + 40
        ) {
            onDragToFrame(card.id);
        } else {
            // Spring back
            x.set(0);
            y.set(0);
        }
    };

    if (isPlaced) return null;

    return (
        <motion.div
            id={`card-${card.id}`}
            className="relative cursor-grab active:cursor-grabbing"
            style={{ perspective: "600px", x, y }}
            drag
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            whileDrag={{ scale: 1.08, zIndex: 50 }}
            layout
        >
            <motion.div
                className="relative w-44 h-52 md:w-48 md:h-56"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                onClick={(e) => {
                    e.stopPropagation();
                    setFlipped(!flipped);
                }}
            >
                {/* FRONT */}
                <div
                    className="absolute inset-0 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 backface-hidden"
                    style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        backfaceVisibility: "hidden",
                    }}
                >
                    <span className="text-4xl">{card.icon}</span>
                    <p className="text-sm font-semibold text-center" style={{ color: "#FAFAF8" }}>
                        {card.title}
                    </p>
                    <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                            background: "rgba(255,59,48,0.1)",
                            color: "rgba(255,100,80,0.9)",
                            border: "1px solid rgba(255,59,48,0.2)",
                        }}
                    >
                        {card.status}
                    </span>
                    <p
                        className="text-[10px] mt-1 font-mono tracking-wider"
                        style={{ color: "rgba(255,255,255,0.2)" }}
                    >
                        GLISSER OU CLIQUER
                    </p>
                </div>

                {/* BACK */}
                <div
                    className="absolute inset-0 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 backface-hidden"
                    style={{
                        background: "rgba(200,148,74,0.06)",
                        border: "1px solid rgba(200,148,74,0.2)",
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                    }}
                >
                    <span className="text-3xl mb-1">{card.icon}</span>
                    <p
                        className="text-xs text-center leading-relaxed font-medium"
                        style={{ color: "#C8944A" }}
                    >
                        {card.backDetail}
                    </p>
                    <p
                        className="text-[10px] mt-1 font-mono"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                        GLISSER VERS LE CADRE
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ================================================================
   STAT TOAST (shows when a card is placed)
   ================================================================ */
function StatToast({ card, onDone }: { card: GmbCard; onDone: () => void }) {
    useEffect(() => {
        const t = setTimeout(onDone, 3500);
        return () => clearTimeout(t);
    }, [onDone]);

    return (
        <motion.div
            className="fixed bottom-8 left-1/2 z-50 max-w-lg w-[90%] px-6 py-4 rounded-2xl"
            style={{
                background: "rgba(20,20,20,0.95)",
                border: "1px solid rgba(200,148,74,0.3)",
                backdropFilter: "blur(20px)",
                x: "-50%",
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        >
            <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0 mt-0.5">{card.icon}</span>
                <div>
                    <p className="text-sm font-medium" style={{ color: "#FAFAF8" }}>
                        {card.stat}
                    </p>
                    <p
                        className="text-[10px] mt-1 font-mono tracking-wider"
                        style={{ color: "rgba(200,148,74,0.7)" }}
                    >
                        {card.source}
                    </p>
                </div>
                <motion.span
                    className="text-green-400 text-lg flex-shrink-0"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                >
                    ✓
                </motion.span>
            </div>
        </motion.div>
    );
}

/* ================================================================
   ACT 3 — THE INTERACTION
   ================================================================ */
function ActInteraction({
    onComplete,
}: {
    onComplete: () => void;
}) {
    const [placedCards, setPlacedCards] = useState<string[]>([]);
    const [activeToast, setActiveToast] = useState<GmbCard | null>(null);
    const frameRef = useRef<HTMLDivElement>(null);

    const progress = placedCards.length / GMB_CARDS.length;
    const allPlaced = placedCards.length === GMB_CARDS.length;

    const handlePlace = useCallback(
        (id: string) => {
            if (placedCards.includes(id)) return;
            const card = GMB_CARDS.find((c) => c.id === id);
            if (!card) return;
            setPlacedCards((prev) => [...prev, id]);
            setActiveToast(card);
        },
        [placedCards]
    );

    const handleAutoAssemble = () => {
        const remaining = GMB_CARDS.filter((c) => !placedCards.includes(c.id));
        let delay = 0;
        remaining.forEach((card) => {
            setTimeout(() => {
                handlePlace(card.id);
            }, delay);
            delay += 400;
        });
    };

    useEffect(() => {
        if (allPlaced) {
            const t = setTimeout(onComplete, 2000);
            return () => clearTimeout(t);
        }
    }, [allPlaced, onComplete]);

    return (
        <motion.div
            className="min-h-screen relative"
            style={{ background: "#0d0d0d" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="text-center pt-10 pb-6 px-6">
                <motion.h2
                    className="font-editorial text-2xl md:text-3xl mb-2"
                    style={{ color: "#FAFAF8" }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Assemblez votre fiche Google
                </motion.h2>
                <motion.p
                    className="text-sm mb-6"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Glissez les éléments dans le cadre — ou cliquez sur &quot;Tout assembler&quot;
                </motion.p>

                {/* Progress bar */}
                <div className="max-w-xs mx-auto mb-4">
                    <div
                        className="h-1 rounded-full overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.06)" }}
                    >
                        <motion.div
                            className="h-full rounded-full"
                            style={{ background: "#C8944A" }}
                            animate={{ width: `${progress * 100}%` }}
                            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                        />
                    </div>
                    <p
                        className="text-[10px] mt-2 font-mono tracking-wider"
                        style={{ color: "rgba(255,255,255,0.25)" }}
                    >
                        {placedCards.length} / {GMB_CARDS.length} ÉLÉMENTS
                    </p>
                </div>

                {/* Auto assemble button */}
                {!allPlaced && (
                    <motion.button
                        onClick={handleAutoAssemble}
                        className="px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all"
                        style={{
                            background: "rgba(200,148,74,0.1)",
                            color: "#C8944A",
                            border: "1px solid rgba(200,148,74,0.25)",
                        }}
                        whileHover={{
                            background: "rgba(200,148,74,0.2)",
                            scale: 1.03,
                        }}
                        whileTap={{ scale: 0.97 }}
                    >
                        ✨ Tout assembler
                    </motion.button>
                )}
            </div>

            {/* Main area */}
            <div className="relative max-w-6xl mx-auto px-4 pb-20">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
                    {/* Cards grid */}
                    <div className="flex-1 w-full">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                            {GMB_CARDS.map((card) => (
                                <FlipCard
                                    key={card.id}
                                    card={card}
                                    isPlaced={placedCards.includes(card.id)}
                                    onDragToFrame={handlePlace}
                                    frameRef={frameRef}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Drop frame — Google Business Card */}
                    <div className="lg:sticky lg:top-8 flex-shrink-0">
                        <div
                            ref={frameRef}
                            className="relative w-72 md:w-80 rounded-2xl overflow-hidden transition-all duration-500"
                            style={{
                                minHeight: "420px",
                                background: allPlaced
                                    ? "rgba(200,148,74,0.08)"
                                    : "rgba(255,255,255,0.02)",
                                border: allPlaced
                                    ? "2px solid rgba(200,148,74,0.4)"
                                    : "2px dashed rgba(255,255,255,0.1)",
                                boxShadow: allPlaced
                                    ? "0 0 60px rgba(200,148,74,0.15)"
                                    : "none",
                            }}
                        >
                            {/* Frame header */}
                            <div
                                className="p-5 flex items-center gap-3"
                                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                            >
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                                    style={{
                                        background: allPlaced
                                            ? "rgba(200,148,74,0.15)"
                                            : "rgba(255,255,255,0.05)",
                                    }}
                                >
                                    🏪
                                </div>
                                <div>
                                    <p
                                        className="text-sm font-semibold"
                                        style={{
                                            fontFamily: "var(--font-playfair)",
                                            color: allPlaced ? "#FAFAF8" : "rgba(255,255,255,0.3)",
                                        }}
                                    >
                                        Votre Commerce
                                    </p>
                                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
                                        Fiche Google Business
                                    </p>
                                </div>
                            </div>

                            {/* Placed items */}
                            <div className="p-3 space-y-1.5">
                                <AnimatePresence>
                                    {placedCards.map((id) => {
                                        const card = GMB_CARDS.find((c) => c.id === id)!;
                                        return (
                                            <motion.div
                                                key={id}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                                                style={{ background: "rgba(255,255,255,0.04)" }}
                                                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                                transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                                            >
                                                <span className="text-lg">{card.icon}</span>
                                                <p className="text-xs font-medium flex-1" style={{ color: "#FAFAF8" }}>
                                                    {card.title}
                                                </p>
                                                <motion.span
                                                    className="text-green-400 text-xs"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 0.2, type: "spring" }}
                                                >
                                                    ✓
                                                </motion.span>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>

                                {/* Empty slots */}
                                {Array.from({
                                    length: GMB_CARDS.length - placedCards.length,
                                }).map((_, i) => (
                                    <div
                                        key={`empty-${i}`}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                                        style={{
                                            background: "rgba(255,255,255,0.015)",
                                            border: "1px dashed rgba(255,255,255,0.05)",
                                        }}
                                    >
                                        <div
                                            className="w-5 h-5 rounded"
                                            style={{ background: "rgba(255,255,255,0.03)" }}
                                        />
                                        <div
                                            className="h-2.5 rounded flex-1"
                                            style={{
                                                background: "rgba(255,255,255,0.03)",
                                                maxWidth: `${50 + i * 8}%`,
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Frame bottom progress */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                                <p
                                    className="text-[10px] font-mono tracking-wider"
                                    style={{
                                        color: allPlaced
                                            ? "#C8944A"
                                            : "rgba(255,255,255,0.15)",
                                    }}
                                >
                                    {allPlaced ? "✨ FICHE COMPLÈTE" : "DÉPOSEZ LES ÉLÉMENTS ICI"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stat toast */}
            <AnimatePresence>
                {activeToast && (
                    <StatToast
                        key={activeToast.id}
                        card={activeToast}
                        onDone={() => setActiveToast(null)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* ================================================================
   ACT 4 — THE REVEAL
   ================================================================ */
function ActReveal({ onContinue }: { onContinue: () => void }) {
    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center px-6 relative"
            style={{ background: "#0d0d0d" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            {/* Glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 50% 40% at 50% 45%, rgba(200,148,74,0.1) 0%, transparent 70%)",
                }}
            />

            {/* Assembled card */}
            <motion.div
                className="relative w-80 md:w-96 rounded-2xl overflow-hidden mb-12"
                style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "2px solid rgba(200,148,74,0.4)",
                    boxShadow: "0 0 80px rgba(200,148,74,0.2), 0 20px 60px rgba(0,0,0,0.5)",
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
            >
                {/* Header */}
                <div
                    className="p-6 flex items-center gap-4"
                    style={{ borderBottom: "1px solid rgba(200,148,74,0.15)" }}
                >
                    <motion.div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                        style={{ background: "rgba(200,148,74,0.15)" }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    >
                        🏪
                    </motion.div>
                    <div>
                        <h3
                            className="font-semibold text-lg"
                            style={{
                                color: "#FAFAF8",
                                fontFamily: "var(--font-playfair)",
                            }}
                        >
                            Votre Commerce
                        </h3>
                        <p className="text-sm" style={{ color: "rgba(200,148,74,0.8)" }}>
                            ⭐ 4.8 — 127 avis · Commerce vérifié ✓
                        </p>
                    </div>
                </div>

                {/* Completed elements */}
                <div className="p-4 space-y-1">
                    {GMB_CARDS.map((card, i) => (
                        <motion.div
                            key={card.id}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                            style={{ background: "rgba(255,255,255,0.04)" }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + i * 0.08 }}
                        >
                            <span className="text-lg">{card.icon}</span>
                            <p
                                className="text-xs font-medium flex-1"
                                style={{ color: "#FAFAF8" }}
                            >
                                {card.title}
                            </p>
                            <span className="text-green-400 text-xs">✓</span>
                        </motion.div>
                    ))}
                </div>

                {/* Mini-map */}
                <div
                    className="mx-4 mb-4 rounded-xl overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.03)", height: 60 }}
                >
                    <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 400 60"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <pattern
                                id="revealGrid"
                                width="20"
                                height="20"
                                patternUnits="userSpaceOnUse"
                            >
                                <path
                                    d="M 20 0 L 0 0 0 20"
                                    fill="none"
                                    stroke="rgba(200,148,74,0.06)"
                                    strokeWidth="0.5"
                                />
                            </pattern>
                        </defs>
                        <rect width="400" height="60" fill="url(#revealGrid)" />
                        <circle
                            cx="200"
                            cy="30"
                            r="5"
                            fill="none"
                            stroke="#C8944A"
                            strokeWidth="1"
                            opacity="0.5"
                        />
                        <circle cx="200" cy="30" r="2" fill="#C8944A" />
                    </svg>
                </div>
            </motion.div>

            {/* Text */}
            <motion.h2
                className="font-editorial text-2xl md:text-4xl text-center mb-4"
                style={{ color: "#FAFAF8" }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
            >
                C&apos;est exactement ce qu&apos;on fait{" "}
                <span style={{ color: "#C8944A" }}>pour vous.</span>
            </motion.h2>

            <motion.p
                className="text-center text-sm md:text-base max-w-lg mb-10"
                style={{ color: "rgba(255,255,255,0.4)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
            >
                En réalité, <strong style={{ color: "#C8944A" }}>83% des commerces</strong> ont une
                fiche incomplète.
                <br />
                La vôtre aussi probablement.
            </motion.p>

            <motion.button
                onClick={onContinue}
                className="px-8 py-4 rounded-xl text-sm font-semibold tracking-wide uppercase"
                style={{
                    background: "#C8944A",
                    color: "#0d0d0d",
                    boxShadow: "0 4px 30px rgba(200,148,74,0.35)",
                    fontFamily: "var(--font-playfair)",
                }}
                whileHover={{ scale: 1.03, boxShadow: "0 6px 40px rgba(200,148,74,0.5)" }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
            >
                Obtenir mon diagnostic gratuit →
            </motion.button>
        </motion.div>
    );
}

/* ================================================================
   ACT 5 — THE FORM
   ================================================================ */
function ActForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [business, setBusiness] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!name || !email || !business) return;
        setSubmitted(true);
    };

    return (
        <motion.div
            className="min-h-screen flex items-center justify-center px-6 py-20"
            style={{ background: "#0d0d0d" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <div className="max-w-4xl w-full mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left — Copy */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
                    >
                        <h2
                            className="font-editorial text-3xl md:text-5xl mb-6"
                            style={{ color: "#FAFAF8" }}
                        >
                            Recevez votre
                            <br />
                            <span style={{ color: "#C8944A" }}>diagnostic gratuit</span>
                            <br />
                            en 48h
                        </h2>

                        <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>
                            Notre équipe analyse votre fiche Google et vous envoie un rapport complet avec des
                            recommandations personnalisées.
                        </p>

                        {/* Trust signals */}
                        <div className="space-y-3">
                            {[
                                "Analyse complète de 8 critères",
                                "Rapport de positionnement local",
                                "Recommandations personnalisées",
                                "Sans engagement — 100% gratuit",
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    className="flex items-center gap-3"
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                >
                                    <span style={{ color: "#C8944A" }} className="text-xs">
                                        ✓
                                    </span>
                                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                                        {item}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Social proof */}
                        <motion.div
                            className="mt-8 flex items-center gap-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            <div className="flex -space-x-2">
                                {["#C8944A", "#8A8A82", "#0F2B46", "#C8944A"].map((color, i) => (
                                    <div
                                        key={i}
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                                        style={{
                                            background: color,
                                            border: "2px solid #0d0d0d",
                                            color: "white",
                                        }}
                                    >
                                        {["JD", "ML", "AS", "PB"][i]}
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                                +240 commerces diagnostiqués
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Right — Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8, ease: EASE_OUT_EXPO }}
                    >
                        <AnimatePresence mode="wait">
                            {!submitted ? (
                                <motion.form
                                    key="form"
                                    onSubmit={handleSubmit}
                                    className="rounded-2xl p-8 space-y-5"
                                    style={{
                                        background: "rgba(255,255,255,0.03)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                    }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    {[
                                        {
                                            label: "Nom",
                                            value: name,
                                            set: setName,
                                            placeholder: "Votre nom",
                                            type: "text",
                                        },
                                        {
                                            label: "Email",
                                            value: email,
                                            set: setEmail,
                                            placeholder: "votre@email.com",
                                            type: "email",
                                        },
                                        {
                                            label: "Commerce",
                                            value: business,
                                            set: setBusiness,
                                            placeholder: "Nom de votre commerce",
                                            type: "text",
                                        },
                                    ].map((field) => (
                                        <div key={field.label}>
                                            <label
                                                className="block text-[10px] font-mono uppercase tracking-wider mb-2"
                                                style={{ color: "rgba(255,255,255,0.3)" }}
                                            >
                                                {field.label}
                                            </label>
                                            <input
                                                type={field.type}
                                                value={field.value}
                                                onChange={(e) => field.set(e.target.value)}
                                                placeholder={field.placeholder}
                                                required
                                                className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                                                style={{
                                                    background: "rgba(255,255,255,0.04)",
                                                    border: "1px solid rgba(255,255,255,0.08)",
                                                    color: "#FAFAF8",
                                                }}
                                            />
                                        </div>
                                    ))}

                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-4 rounded-xl text-sm font-semibold tracking-wide uppercase"
                                        style={{
                                            background: "#C8944A",
                                            color: "#0d0d0d",
                                            boxShadow: "0 4px 24px rgba(200,148,74,0.3)",
                                            fontFamily: "var(--font-playfair)",
                                        }}
                                    >
                                        Recevoir mon diagnostic gratuit
                                    </motion.button>

                                    <p
                                        className="text-center text-[10px] font-mono tracking-wider"
                                        style={{ color: "rgba(255,255,255,0.25)" }}
                                    >
                                        Aucun engagement · Résultat en 48h
                                    </p>
                                </motion.form>
                            ) : (
                                <motion.div
                                    key="success"
                                    className="rounded-2xl p-12 text-center"
                                    style={{
                                        background: "rgba(255,255,255,0.03)",
                                        border: "1px solid rgba(200,148,74,0.25)",
                                    }}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {/* Gold check */}
                                    <motion.div
                                        className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                                        style={{
                                            background: "rgba(200,148,74,0.1)",
                                            border: "2px solid #C8944A",
                                        }}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                    >
                                        <svg
                                            width="32"
                                            height="32"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#C8944A"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <motion.path
                                                d="M5 13l4 4L19 7"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ delay: 0.5, duration: 0.4 }}
                                            />
                                        </svg>
                                    </motion.div>

                                    <h3
                                        className="font-editorial text-2xl mb-2"
                                        style={{ color: "#C8944A" }}
                                    >
                                        C&apos;est envoyé !
                                    </h3>
                                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                                        Notre équipe analyse {business} et vous enverra votre diagnostic à{" "}
                                        {email} sous 48h.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

/* ================================================================
   MAIN ORCHESTRATOR
   ================================================================ */
export default function GmbInteractive() {
    const [act, setAct] = useState<1 | 2 | 3 | 4 | 5>(1);

    const goToAct2 = useCallback(() => setAct(2), []);
    const goToAct3 = useCallback(() => setAct(3), []);
    const goToAct4 = useCallback(() => setAct(4), []);
    const goToAct5 = useCallback(() => setAct(5), []);

    return (
        <div className="relative" style={{ background: "#0d0d0d" }}>
            <AnimatePresence mode="wait">
                {act === 1 && <ActDoor key="door" onOpen={goToAct2} />}
                {act === 2 && <ActChaos key="chaos" onProceed={goToAct3} />}
            </AnimatePresence>

            {act >= 3 && (
                <AnimatePresence mode="wait">
                    {act === 3 && <ActInteraction key="interaction" onComplete={goToAct4} />}
                    {act === 4 && <ActReveal key="reveal" onContinue={goToAct5} />}
                    {act === 5 && <ActForm key="form" />}
                </AnimatePresence>
            )}

            {/* Footer */}
            {act === 5 && (
                <motion.footer
                    className="relative py-12 text-center"
                    style={{
                        background: "#0d0d0d",
                        borderTop: "1px solid rgba(255,255,255,0.05)",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    <p
                        className="font-mono text-xs tracking-wider"
                        style={{ color: "rgba(255,255,255,0.2)" }}
                    >
                        © {new Date().getFullYear()} Local Boost
                    </p>
                    <p
                        className="font-mono text-[10px] mt-2 tracking-wider"
                        style={{ color: "rgba(255,255,255,0.08)" }}
                    >
                        Dominez Google Maps dans votre ville.
                    </p>
                </motion.footer>
            )}
        </div>
    );
}
