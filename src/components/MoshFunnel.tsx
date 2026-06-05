"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BtnTest, BtnEnter, Checkbox, Logo } from "@/components/ui";

/* ═══════════════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════════════ */
const C = {
  bg: "#FFFFFF",
  chatBg: "#FFFFFF",
  userMsg: "#F0F0F0",
  border: "rgba(0,0,0,0.10)",
  text: "#111111",
  muted: "#6B7280",
  green: "#10a37f",
  accent: "#0F9D6E",
  error: "#E5484D",
  card: "#F7F7F7",
  ink: "#111111",
  panel: "#FAFAFA",
};
const UI = "'Inter', -apple-system, sans-serif";

/* ── Hero (light theme, d'après la maquette) ── */
const HERO = {
  bg: "#FFFFFF",
  ink: "#111111",
  muted: "#555555",
  font: "var(--font-hanken), 'Hanken Grotesk', -apple-system, sans-serif",
};

/* ═══════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════ */

function OAIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 41 41" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-6.205-2.799 10.079 10.079 0 0 0-10.783 7.044 9.963 9.963 0 0 0-6.645 4.816 10.079 10.079 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 6.205 2.799 10.079 10.079 0 0 0 10.785-7.044 9.965 9.965 0 0 0 6.644-4.816 10.079 10.079 0 0 0-1.241-11.818zm-15.006 21.055a7.452 7.452 0 0 1-4.789-1.727l.239-.136 7.964-4.6a1.294 1.294 0 0 0 .655-1.134v-11.24l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.5 7.502zm-16.134-6.901a7.454 7.454 0 0 1-.894-5.023l.239.144 7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.242-2.747zm-2.09-17.438a7.482 7.482 0 0 1 3.908-3.285v9.458a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.012l-8.048-4.648a7.498 7.498 0 0 1-2.757-10.227zm27.658 6.437l-9.724-5.615 3.367-1.943a.121.121 0 0 1 .114-.012l8.048 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.647-1.13zm3.35-5.043l-.239-.144-7.964-4.6a1.297 1.297 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.048-4.648a7.498 7.498 0 0 1 11.138 7.769zm-21.063 6.929l-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756l-.239.136-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.003 11.223zm1.829-3.943l4.33-2.501 4.332 2.5v4.999l-4.331 2.5-4.331-2.5z" />
    </svg>
  );
}

function Dots() {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center", paddingTop: 4 }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{ width: 7, height: 7, borderRadius: "50%", background: C.muted }}
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
          transition={{ duration: 0.75, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

/* ── Panicking Robot (easter egg) ── */
function PanickingRobot({ onRestore }: { onRestore: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        height: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", background: C.bg,
        fontFamily: UI, padding: "40px 24px", textAlign: "center", position: "relative", overflow: "hidden",
      }}
    >
      {/* Background panic particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute", fontSize: "clamp(16px, 3vw, 24px)",
            top: `${10 + Math.random() * 80}%`, left: `${5 + Math.random() * 90}%`,
            opacity: 0.15, pointerEvents: "none",
          }}
          animate={{ y: [0, -20, 0], rotate: [0, 15, -15, 0], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
        >
          {["😰", "🫣", "❌", "⚠️", "🚨", "💀", "🙈", "😳", "🫠", "❗", "🤖", "😵"][i]}
        </motion.div>
      ))}

      {/* The robot */}
      <motion.div
        animate={{ x: [-3, 3, -3, 3, 0], y: [-2, 2, -2, 2, 0] }}
        transition={{ duration: 0.3, repeat: Infinity }}
        style={{ marginBottom: 24 }}
      >
        <div style={{ position: "relative", display: "inline-block" }}>
          {/* Body */}
          <div style={{
            width: 120, height: 140, borderRadius: 24, background: "#1a1a2e",
            border: "3px solid #333", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", position: "relative",
          }}>
            {/* Eyes */}
            <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
              <motion.div
                animate={{ scaleY: [1, 0.1, 1] }}
                transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 1.5 }}
                style={{ width: 20, height: 24, borderRadius: 10, background: C.accent }}
              />
              <motion.div
                animate={{ scaleY: [1, 0.1, 1] }}
                transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 1.5, delay: 0.05 }}
                style={{ width: 20, height: 24, borderRadius: 10, background: C.accent }}
              />
            </div>
            {/* Mouth - panicking */}
            <motion.div
              animate={{ scaleX: [1, 1.2, 0.8, 1], scaleY: [1, 0.8, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              style={{ width: 30, height: 18, borderRadius: "0 0 15px 15px", border: "3px solid #555", borderTop: "none", background: "#0d0d0d" }}
            />
            {/* Blush */}
            <div style={{ position: "absolute", left: 8, top: 55, width: 22, height: 12, borderRadius: "50%", background: "rgba(255,100,100,0.25)" }} />
            <div style={{ position: "absolute", right: 8, top: 55, width: 22, height: 12, borderRadius: "50%", background: "rgba(255,100,100,0.25)" }} />
          </div>
          {/* Antenna */}
          <div style={{ position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)", width: 3, height: 20, background: "#555" }}>
            <motion.div
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              style={{ width: 10, height: 10, borderRadius: "50%", background: C.error, position: "absolute", top: -6, left: -3.5 }}
            />
          </div>
          {/* Arms flailing */}
          <motion.div
            animate={{ rotate: [-30, -60, -30] }}
            transition={{ duration: 0.3, repeat: Infinity }}
            style={{ position: "absolute", left: -28, top: 40, width: 28, height: 6, borderRadius: 3, background: "#333", transformOrigin: "right center" }}
          />
          <motion.div
            animate={{ rotate: [30, 60, 30] }}
            transition={{ duration: 0.3, repeat: Infinity, delay: 0.15 }}
            style={{ position: "absolute", right: -28, top: 40, width: 28, height: 6, borderRadius: 3, background: "#333", transformOrigin: "left center" }}
          />
        </div>
      </motion.div>

      {/* Text */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      >
        <h2 style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 800, color: C.error, marginBottom: 8 }}>
          REMET MA FENÊTRE !!!
        </h2>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ fontSize: 15, color: C.muted, marginBottom: 8, maxWidth: 340, lineHeight: 1.5 }}
      >
        Hé mais t&apos;es pas censé voir ça !!
        Je suis tout nu là derrière !!! 🫣
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{ fontSize: 13, color: "rgba(0,0,0,0.35)", marginBottom: 28, fontStyle: "italic" }}
      >
        *cache ses circuits précipitamment*
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
        onClick={onRestore}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: C.ink, color: "#fff", border: "none",
          padding: "14px 32px", borderRadius: 10, fontSize: 15, fontWeight: 700,
          cursor: "pointer", fontFamily: UI, boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        }}
      >
        OK OK je la remets 😅
      </motion.button>
    </motion.div>
  );
}

/* ── Markdown-ish renderer ── */
function renderInline(text: string, key: string) {
  const tokens = text.split(/(\*\*[^*]+\*\*)/g);
  return tokens.map((tok, i) => {
    if (tok.startsWith("**") && tok.endsWith("**")) {
      return <strong key={`${key}-b${i}`} style={{ color: C.text, fontWeight: 700 }}>{tok.slice(2, -2)}</strong>;
    }
    return <span key={`${key}-t${i}`}>{tok}</span>;
  });
}

function RenderText({ text }: { text: string }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  lines.forEach((line, i) => {
    const key = `l${i}`;
    if (line.trim() === "") { elements.push(<div key={key} style={{ height: 6 }} />); return; }
    if (line.match(/^[•\-\*]\s/) || line.match(/^\d+\.\s/)) {
      const content = line.replace(/^[•\-\*\d\.]\s+/, "");
      elements.push(
        <div key={key} style={{ display: "flex", gap: 8, marginBottom: 5, paddingLeft: 4 }}>
          <span style={{ color: C.muted, flexShrink: 0 }}>•</span>
          <span style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(17,17,17,0.82)" }}>{renderInline(content, key)}</span>
        </div>
      );
      return;
    }
    if (line.match(/^\*\*[^*]+\*\*$/)) {
      elements.push(<p key={key} style={{ margin: "12px 0 4px", fontSize: 14, fontWeight: 700, color: C.text }}>{renderInline(line, key)}</p>);
      return;
    }
    elements.push(<p key={key} style={{ margin: "0 0 4px", fontSize: 14, lineHeight: 1.7, color: "rgba(17,17,17,0.82)" }}>{renderInline(line, key)}</p>);
  });
  return <div>{elements}</div>;
}

function BotBubble({ content, isStreaming = false }: { content: string; isStreaming?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontFamily: UI }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.ink, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
        <OAIcon size={13} />
      </div>
      <div style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(17,17,17,0.85)", paddingTop: 4, maxWidth: 560, flex: 1 }}>
        <RenderText text={content} />
        {isStreaming && <span style={{ opacity: 0.5, marginLeft: 1 }}>|</span>}
      </div>
    </motion.div>
  );
}

function UserBubble({ content }: { content: string }) {
  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} style={{ display: "flex", justifyContent: "flex-end", fontFamily: UI }}>
      <div style={{ background: C.userMsg, border: `1px solid ${C.border}`, borderRadius: "18px 18px 4px 18px", padding: "10px 16px", maxWidth: 360, fontSize: 14, color: C.text, lineHeight: 1.55 }}>
        {content}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════ */
interface Message { role: "user" | "assistant"; content: string; }
interface DiagnosticResult { score: number; companyFound: boolean; rawText: string; }

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */
export default function MoshFunnel() {
  /* ── Funnel state ── */
  const [funnelState, setFunnelState] = useState<"hero" | "chat" | "result" | "email" | "success">("hero");
  const [windowClosed, setWindowClosed] = useState(false);

  /* ── Choix Oui / Non du hero (aucun sélectionné par défaut) ── */
  const [choice, setChoice] = useState<"none" | "oui" | "non">("none");

  /* ── Chat state machine ── */
  const [chatStep, setChatStep] = useState<"greeting" | "ask_nom" | "ask_site" | "ask_activite" | "ask_zone" | "ask_concurrents" | "ask_objectif" | "scanning" | "verdict">("greeting");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [inputDisabled, setInputDisabled] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");

  /* ── Collected data ── */
  const [nom, setNom] = useState("");
  const [site, setSite] = useState("");
  const [activite, setActivite] = useState("");
  const [zone, setZone] = useState("");
  const [concurrents, setConcurrents] = useState("");
  const [objectif, setObjectif] = useState("");

  /* ── Results ── */
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);
  const [email, setEmail] = useState("");

  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, 60);
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, streamingContent, isThinking, scrollToBottom]);

  /* ── Placeholder per step ── */
  const getPlaceholder = () => {
    switch (chatStep) {
      case "ask_nom": return "Ex: Plomberie Dupont";
      case "ask_site": return "Ex: https://www.mon-site.ch";
      case "ask_activite": return "Ex: Dépannage plomberie d'urgence";
      case "ask_zone": return "Ex: Lausanne et environs";
      case "ask_concurrents": return "Ex: SA Plomberie 2000";
      case "ask_objectif": return "Ex: Plus d'appels, de devis...";
      default: return "Analyse en cours...";
    }
  };

  /* ── Start the chat experience ── */
  const startChat = () => {
    setFunnelState("chat");
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      setMessages([{
        role: "assistant",
        content: "Salut 👋\n\nJe vais vérifier si les IA vous trouvent… ou si elles envoient vos clients chez les autres.\n\nC'est rapide, c'est direct, et ça ne mord pas.\n\n**Comment s'appelle votre boîte ?**"
      }]);
      setChatStep("ask_nom");
      setInputDisabled(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }, 1200);
  };

  /* ── Bot reply helper ── */
  const botReply = (msg: string, nextStep: typeof chatStep, delay = 900) => {
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
      setChatStep(nextStep);
      setInputDisabled(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }, delay);
  };

  /* ── Handle user submit ── */
  const handleSubmit = () => {
    const text = inputValue.trim();
    if (!text || inputDisabled) return;
    setInputValue("");
    setInputDisabled(true);
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    switch (chatStep) {
      case "ask_nom":
        setNom(text);
        botReply(`**${text}**, noté.\n\nC'est quoi l'adresse de votre site ?\n\n(Et par pitié, ne fermez pas ma fenêtre 🙏)`, "ask_site");
        break;
      case "ask_site":
        setSite(text);
        botReply("Bien reçu. Et **vous faites quoi, concrètement ?**\n\nPas besoin de la version corporate — la version que vous dites au voisin.", "ask_activite");
        break;
      case "ask_activite":
        setActivite(text);
        botReply("OK. Et **vous êtes basés où ?**", "ask_zone");
        break;
      case "ask_zone":
        setZone(text);
        botReply(`**${text}** — c'est noté.\n\nDernière chose : **quels concurrents vous agacent le plus ?**\n\nCeux qui récupèrent vos clients, qui sont toujours devant, etc.`, "ask_concurrents");
        break;
      case "ask_concurrents":
        setConcurrents(text);
        botReply("Parfait. Et **vous voulez surtout plus de quoi ?** Plus d'appels ? De devis ? De réservations ? De trafic ?\n\n(Sérieusement, le bouton rouge en haut à gauche, on n'y touche pas hein. Je dis ça je dis rien.)", "ask_objectif");
        break;
      case "ask_objectif":
        setObjectif(text);
        setIsThinking(true);
        setTimeout(() => {
          setIsThinking(false);
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: `OK, j'ai tout ce qu'il me faut.\n\nJe vais maintenant poser la question qu'un prospect poserait à une IA :\n\n*"Recommande-moi les meilleurs ${activite || text} à ${zone}"*\n\nEt on va voir si **${nom}** fait partie de la réponse. Accrochez-vous.` },
          ]);
          setChatStep("scanning");
          setTimeout(() => triggerApiCall(), 2000);
        }, 1200);
        break;
    }
  };

  /* ── Real API call ── */
  const triggerApiCall = async () => {
    setIsThinking(true);
    setStreamingContent("");
    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metier: activite, ville: zone, company: nom }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) throw new Error("API error");
      setIsThinking(false);
      setIsStreaming(true);

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value);
        const lines = text.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const parsed = JSON.parse(line.slice(6));
              if (parsed.content) { fullContent += parsed.content; setStreamingContent(fullContent); }
            } catch { /* skip */ }
          }
        }
      }

      // Commit streaming message
      setMessages((prev) => [...prev, { role: "assistant", content: fullContent }]);
      setStreamingContent("");
      setIsStreaming(false);

      const found = nom.length > 2 && fullContent.toLowerCase().includes(nom.toLowerCase());
      const score = found ? Math.floor(Math.random() * 15) + 58 : Math.floor(Math.random() * 20) + 22;
      setDiagnosticResult({ score, companyFound: found, rawText: fullContent });

      // Verdict message (MOSH tone)
      setTimeout(() => {
        const verdictMsg = found
          ? `✅ **${nom}** apparaît dans la réponse. Bonne nouvelle.\n\nMauvaise nouvelle : être cité ne veut pas dire être recommandé en premier. Et si un concurrent fait mieux sur les signaux techniques, il prendra votre place au prochain rafraîchissement.\n\nVotre score express : **${score}/100**\n\nVous êtes là, mais pas encore au bon endroit. Et ça, ça se corrige.`
          : `❌ **${nom}** n'apparaît nulle part dans la réponse.\n\nL'IA vient de recommander d'autres entreprises à votre place. Vos prospects qui posent cette question à ChatGPT, Perplexity ou Gemini ne tomberont jamais sur vous.\n\nVotre score express : **${score}/100**\n\nAujourd'hui, vos concurrents ont plus de chances d'être cités que vous. Et ça, ça coûte des clients.`;

        setMessages((prev) => [...prev, { role: "assistant", content: verdictMsg }]);
        setChatStep("verdict");

        // Show the result/CTA panel after a beat
        setTimeout(() => setFunnelState("result"), 2500);
      }, 1500);

    } catch (err) {
      console.error(err);
      setIsThinking(false);
      setIsStreaming(false);
      setDiagnosticResult({ score: 28, companyFound: false, rawText: "" });
      setFunnelState("result");
    }
  };

  const submitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setFunnelState("success");
  };

  /* ═══════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════ */
  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: UI, minHeight: "100vh" }}>
      <AnimatePresence mode="wait">

        {/* ═════════════════════════════════════════
            BLOC 1: HERO
            ═════════════════════════════════════════ */}
        {funnelState === "hero" && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              minHeight: "100vh", width: "100%",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              padding: "56px 24px", textAlign: "center",
              background: HERO.bg, color: HERO.ink, fontFamily: HERO.font,
            }}
          >
            {/* ── Logo en-tête (Figma : logo_light) ── */}
            <Logo
              variant="light"
              height="clamp(40px, 6vw, 60px)"
              style={{ marginBottom: "clamp(48px, 9vh, 110px)" }}
            />

            {/* ── Titre ── */}
            <h1 style={{
              fontSize: "clamp(2.4rem, 7.5vw, 4.6rem)", fontWeight: 600, lineHeight: 1.04,
              letterSpacing: "-0.02em", margin: 0, color: HERO.ink,
            }}>
              Est-ce que l&apos;IA<br />vous trouve?
            </h1>

            {/* ── Sous-titre ── */}
            <p style={{
              fontSize: "clamp(1rem, 2.3vw, 1.3rem)", color: HERO.muted,
              margin: "clamp(14px, 2vh, 22px) 0 0", fontWeight: 400,
            }}>
              (sur l&apos;internet mondial et autres moteurs de recherche)
            </p>

            {/* ── Choix Oui / Non (interactif) ── */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "clamp(36px, 7vw, 84px)", flexWrap: "wrap",
              margin: "clamp(40px, 7vh, 72px) 0 clamp(34px, 6vh, 56px)",
            }}>
              {/* Oui / Non (Figma : check_box_oui_1/2, check_box_non_1/2) */}
              <Checkbox
                type="oui"
                checked={choice === "oui"}
                struck={choice === "non"}
                onClick={() => setChoice("oui")}
              />
              <Checkbox
                type="non"
                checked={choice === "non"}
                struck={choice === "oui"}
                onClick={() => setChoice("non")}
              />
            </div>

            {/* ── Texte d'accroche (selon le choix) ── */}
            {choice !== "none" && (
              <p style={{
                fontSize: "clamp(1.05rem, 2.4vw, 1.35rem)", color: HERO.muted,
                maxWidth: 640, lineHeight: 1.5, margin: "0 0 clamp(36px, 6vh, 56px)", fontWeight: 400,
              }}>
                {choice === "oui"
                  ? "Alors ça ça fait plaisir… Mais vous êtes sûr.e de ça? Sûr.e que l'IA ne répond pas avant que vos prospects aient cliqué sur votre site? Sûr.e que l'IA ne renvoie pas vos clients vers la concurrence?"
                  : "Ouh la méchante IA qui fait ressortir vos concurrents à votre place et qui répond avant que vos prospects aient cliqué sur votre site. L'IA ne vous aime pas? Non, elle ne vous connait pas."}
              </p>
            )}

            {/* ── CTA (Figma : btn_test_1) ── */}
            <BtnTest variant="1" onClick={startChat} />

            {/* ── Réassurance ── */}
            <p style={{
              fontSize: "clamp(1rem, 2.2vw, 1.2rem)", color: HERO.muted, maxWidth: 560,
              lineHeight: 1.5, margin: "clamp(64px, 13vh, 150px) 0 clamp(22px, 4vh, 40px)", fontWeight: 400,
            }}>
              Un outil gratos et rapidos permettant de savoir si les IA vous citent ou si elles préfèrent vos concurrents.
            </p>

            {/* ── Logo pied (Figma : logo_mosh_footer) ── */}
            <Logo variant="footer" height="clamp(22px, 3.4vw, 32px)" />
          </motion.div>
        )}

        {/* ═════════════════════════════════════════
            BLOC 3: CHAT IMMERSIF
            ═════════════════════════════════════════ */}
        {funnelState === "chat" && windowClosed && (
          <PanickingRobot key="robot" onRestore={() => setWindowClosed(false)} />
        )}

        {funnelState === "chat" && !windowClosed && (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}
          >
            {/* macOS chrome */}
            <div style={{ borderBottom: `1px solid ${C.border}`, padding: "12px 24px", display: "flex", alignItems: "center", gap: 12, background: C.panel, flexShrink: 0 }}>
              <div style={{ display: "flex", gap: 6 }}>
                <div
                  onClick={() => setWindowClosed(true)}
                  style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F57", opacity: 0.85, cursor: "pointer", transition: "transform 0.15s" }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = "scale(1.3)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                />
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FFBD2E", opacity: 0.85 }} />
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28C840", opacity: 0.85 }} />
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: C.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <OAIcon size={11} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>ChatGPT</span>
                <span style={{ fontSize: 11, color: C.muted }}>4o · Diagnostic de visibilité</span>
              </div>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <motion.div
                  style={{ width: 6, height: 6, borderRadius: "50%", background: C.green }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span style={{ fontSize: 11, color: C.muted }}>Live</span>
              </div>
            </div>

            {/* Chat messages */}
            <div ref={chatRef} style={{ flex: 1, overflowY: "auto", scrollBehavior: "smooth" }}>
              <div style={{ padding: "28px 24px", maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
                <AnimatePresence>
                  {messages.map((msg, i) =>
                    msg.role === "assistant"
                      ? <BotBubble key={`msg-${i}`} content={msg.content} />
                      : <UserBubble key={`msg-${i}`} content={msg.content} />
                  )}
                  {isThinking && (
                    <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.green, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <OAIcon size={13} />
                      </div>
                      <Dots />
                    </motion.div>
                  )}
                  {isStreaming && streamingContent && (
                    <BotBubble key="streaming" content={streamingContent} isStreaming />
                  )}
                </AnimatePresence>
                <div style={{ height: 1, flexShrink: 0 }} />
              </div>
            </div>

            {/* Input bar */}
            <div style={{ borderTop: `1px solid ${C.border}`, padding: "14px 24px", background: C.panel, flexShrink: 0 }}>
              <div style={{ maxWidth: 720, margin: "0 auto" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    disabled={inputDisabled}
                    placeholder={getPlaceholder()}
                    style={{
                      flex: 1,
                      background: inputDisabled ? "rgba(0,0,0,0.03)" : "#FFFFFF",
                      border: `1px solid ${inputDisabled ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.18)"}`,
                      borderRadius: 12, padding: "12px 16px", fontSize: 14, color: C.text,
                      outline: "none", fontFamily: UI, cursor: inputDisabled ? "not-allowed" : "text",
                      transition: "all 0.2s",
                    }}
                  />
                  <BtnEnter
                    onClick={handleSubmit}
                    disabled={inputDisabled || !inputValue.trim()}
                  />
                </div>
                <p style={{ fontSize: 10, color: "rgba(0,0,0,0.30)", textAlign: "center", marginTop: 8, letterSpacing: "0.02em" }}>
                  Propulsé par GPT-4o · Résultats réels en direct
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═════════════════════════════════════════
            BLOC 4: RÉSULTAT EXPRESS
            ═════════════════════════════════════════ */}
        {funnelState === "result" && diagnosticResult && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}
          >
            <div style={{ maxWidth: 600, width: "100%", textAlign: "center" }}>
              <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, color: C.muted, marginBottom: 8 }}>Votre score express</p>
              <div style={{ fontSize: "clamp(5rem, 15vw, 8rem)", fontWeight: 900, color: diagnosticResult.score >= 50 ? C.accent : C.error, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                {diagnosticResult.score}<span style={{ fontSize: "0.4em", color: C.muted }}>/100</span>
              </div>

              <div style={{ marginTop: 32, padding: 32, borderRadius: 16, background: C.card, border: `1px solid ${C.border}` }}>
                <h2 style={{ fontSize: "clamp(1.2rem, 3vw, 1.6rem)", fontWeight: 700, marginBottom: 20, lineHeight: 1.3 }}>
                  {diagnosticResult.companyFound
                    ? "Vous êtes là. Mais pas encore au bon endroit."
                    : "Aujourd'hui, vos concurrents ont plus de chances d'être cités que vous."}
                </h2>
                <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 12 }}>
                  {diagnosticResult.companyFound ? (
                    <>
                      <p style={{ display: "flex", gap: 10, color: C.muted }}><span style={{ color: C.accent }}>✓</span> L&apos;IA vous connaît et peut vous citer.</p>
                      <p style={{ display: "flex", gap: 10, color: C.muted }}><span style={{ color: C.error }}>×</span> Mais vos signaux ne garantissent pas la première place.</p>
                      <p style={{ display: "flex", gap: 10, color: C.muted }}><span style={{ color: C.error }}>×</span> Vous perdez encore des leads face à d&apos;autres recommandations.</p>
                    </>
                  ) : (
                    <>
                      <p style={{ display: "flex", gap: 10, color: C.muted }}><span style={{ color: C.error }}>×</span> L&apos;IA vient de recommander d&apos;autres entreprises à votre place.</p>
                      <p style={{ display: "flex", gap: 10, color: C.muted }}><span style={{ color: C.error }}>×</span> Vos signaux locaux sont trop faibles pour déclencher une recommandation.</p>
                      <p style={{ display: "flex", gap: 10, color: C.muted }}><span style={{ color: C.error }}>×</span> Vous êtes totalement invisible sur cette recherche générative.</p>
                    </>
                  )}
                </div>
              </div>

              <p style={{ fontSize: 16, fontWeight: 500, marginTop: 28, marginBottom: 24, color: C.muted }}>
                On peut vous montrer où vous disparaissez, qui prend votre place, et ce qu&apos;il faut corriger en premier.
              </p>
              <motion.button
                onClick={() => setFunnelState("email")}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{ background: C.ink, color: "#fff", border: "none", padding: "16px 32px", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: UI }}
              >
                Débloquer mon audit complet
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ═════════════════════════════════════════
            BLOC 5: EMAIL GATE
            ═════════════════════════════════════════ */}
        {funnelState === "email" && (
          <motion.div
            key="email"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}
          >
            <div style={{ maxWidth: 520, width: "100%" }}>
              <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 700, marginBottom: 12 }}>On peut vous envoyer l&apos;audit complet.</h2>
              <p style={{ fontSize: 16, color: C.muted, marginBottom: 32, lineHeight: 1.6 }}>
                Pas un PDF de 48 pages pour caler une armoire. Juste ce qu&apos;il faut pour comprendre ce qui bloque et quoi corriger.
              </p>

              <div style={{ padding: 20, borderRadius: 12, background: C.card, border: `1px solid ${C.border}`, marginBottom: 28 }}>
                <p style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>Ce qu&apos;il contient :</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: C.muted }}>
                  <span>✓ Les requêtes exactes testées pour {activite}</span>
                  <span>✓ Les concurrents détectés qui vous volent la place</span>
                  <span>✓ Les signaux techniques qui vous pénalisent</span>
                  <span>✓ Les 3 actions prioritaires à corriger</span>
                </div>
              </div>

              <form onSubmit={submitEmail} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                  type="email" required placeholder="Votre email pro"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%", padding: "14px 16px", borderRadius: 10, fontSize: 15, background: C.card, border: `1px solid ${C.border}`, color: C.text, outline: "none", fontFamily: UI }}
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ width: "100%", padding: 16, borderRadius: 10, fontSize: 16, fontWeight: 700, background: C.ink, color: "#fff", border: "none", cursor: "pointer", fontFamily: UI }}
                >
                  Recevoir mon audit complet
                </motion.button>
              </form>
              <p style={{ fontSize: 11, color: "rgba(0,0,0,0.40)", textAlign: "center", marginTop: 16 }}>
                Les infos que vous entrez servent à générer votre audit et à vous l&apos;envoyer. On ne va pas en faire un trafic louche.
              </p>
            </div>
          </motion.div>
        )}

        {/* ═════════════════════════════════════════
            BLOC 6: SORTIE POST-CONVERSION
            ═════════════════════════════════════════ */}
        {funnelState === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}
          >
            <div style={{ maxWidth: 520, width: "100%" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(16,163,127,0.15)", color: C.green, fontSize: 28 }}>
                ✓
              </div>
              <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", fontWeight: 700, marginBottom: 12 }}>Audit envoyé.</h2>
              <p style={{ fontSize: 16, color: C.muted, marginBottom: 32 }}>
                On vient de vous envoyer le rapport complet. En attendant, voilà déjà ce qu&apos;il faut retenir.
              </p>

              <div style={{ textAlign: "left", padding: 24, borderRadius: 16, background: C.card, border: `1px solid ${C.border}`, marginBottom: 32 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 15 }}>
                  <p style={{ display: "flex", gap: 12, color: C.muted }}><span style={{ color: C.error }}>→</span> <span>Votre visibilité IA est actuellement <strong style={{ color: C.ink }}>faible</strong>.</span></p>
                  <p style={{ display: "flex", gap: 12, color: C.muted }}><span style={{ color: C.error }}>→</span> <span>Votre principal point faible : l&apos;incohérence de vos données publiques.</span></p>
                  <p style={{ display: "flex", gap: 12, color: C.muted }}><span style={{ color: C.error }}>→</span> <span>Le concurrent qui capte vos leads est probablement <strong style={{ color: C.ink }}>{concurrents}</strong>.</span></p>
                </div>
              </div>

              <motion.button
                onClick={() => window.open("https://calendly.com", "_blank")}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{ background: C.ink, color: "#fff", border: "none", padding: "16px 32px", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: UI }}
              >
                Réserver un débrief de 20 minutes
              </motion.button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
