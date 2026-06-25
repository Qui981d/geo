"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BtnTest, BtnEnter, BtnFaq, Checkbox, Logo } from "@/components/ui";
import { MOSH, FONT_DEGULAR, u } from "@/components/ui/tokens";

/* ═══════════════════════════════════════════════
   MISE À L'ÉCHELLE
   Toutes les valeurs viennent des exports SVG Figma
   (frame 1440×1024) via u(n) = n px @1440, proportionnel sinon.
   Les constantes marquées [calibré] sont ajustées par
   comparaison au pixel avec design-refs/pages/*.png.
   ═══════════════════════════════════════════════ */

const HERO_GEO = {
  margeGauche: 156, // bord gauche des cases / accroche / CTA (titre : bearing naturel)
  titreTop: 140, // [calibré] le cap du titre doit tomber à y=166.8
  titreFont: 116, // cap height cible : 83.7
  titreLh: 97, // interligne exact (baselines à 97px d'écart)
  sloganFont: 17,
  sloganLh: 24,
  sloganRaise: 13.8, // baseline du slogan au-dessus de la baseline du titre
  checkboxTop: 605,
  checkboxNonLeft: 396,
  accrocheTop: 676, // [calibré] cap à y=682.2
  accrocheFont: 18,
  accrocheLh: 24,
  ctaTop: 776,
  logoTop: 40,
  logoRight: 40,
} as const;

const CHAT_GEO = {
  colGauche: 387.75,
  colLargeur: 665.5,
  zoneTop: 92, // haut de la zone messages (sous le logo)
  fondu: 36, // hauteur du dégradé qui estompe les messages en haut
  msgFont: 18,
  msgLh: 24.5,
  paraGap: 9,
  blocCentre: 804.4, // centre vertical du bloc input+pilules (constant, FAQ ouverte ou non)
  inputH: 52.5,
  pillGap: 24.75, // input → pilules
  reponseGap: 14.4, // pilules → réponse FAQ
  bulleH: 54,
  bullePadX: 33,
} as const;

/* ── FAQ du chat (pages test_*_faq-1/2/3, textes exacts) ── */
const FAQ_ITEMS = [
  {
    q: "Qu'est-ce que le GEO?",
    lead: "Le GEO (Generative Engine Optimization)",
    body:
      " est la discipline qui consiste à optimiser votre marque, vos contenus et vos entités nommées pour être explicitement recommandé par les IA génératives (ChatGPT, Claude, Google Gemini, Perplexity) lorsqu'un utilisateur pose une question transactionnelle ou locale.",
  },
  {
    q: "Comment l'IA vous choisit?",
    lead: "Les modèles (LLMs) sélectionnent les entreprises",
    body:
      " en fonction de la densité sémantique (la richesse des informations publiques), les avis structurés, et la cohérence de vos entités nommées (NAP : Nom, Adresse, Téléphone).",
  },
  {
    q: "Cet audit est-il gratuit?",
    lead: "Oui, le rapport initial est gratuit et sans engagement.",
    body:
      " Il comprend : l'analyse de votre présence IA, un score de visibilité, l'identification des concurrents qui vous supplantent, et les actions immédiates à mettre en place.",
  },
] as const;

/* ═══════════════════════════════════════════════
   SOUS-COMPOSANTS
   ═══════════════════════════════════════════════ */

/** Footer 3 zones, identique sur toutes les pages (couleur selon le fond). */
function MoshFooter({ dark = false }: { dark?: boolean }) {
  const color = dark ? MOSH.blanc : MOSH.noir;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: u(30),
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: u(41),
        paddingRight: u(40),
        gap: u(16),
        fontFamily: FONT_DEGULAR,
        fontSize: u(14),
        lineHeight: 1.2,
        color,
        fontWeight: 400,
      }}
    >
      <span style={{ flex: "1 1 0", textAlign: "left" }}>
        L&apos;outil pour savoir si les IA vous citent
      </span>
      <Logo
        variant="footer"
        style={{ flexShrink: 0, filter: dark ? "invert(1)" : undefined }}
      />
      <span style={{ flex: "1 1 0", textAlign: "right" }}>
        ou si elles préfèrent vos concurrents
      </span>
    </div>
  );
}

/** Rendu des messages du bot : paragraphes séparés par \n\n, gras via **…**. */
function renderInline(text: string, key: string) {
  const tokens = text.split(/(\*\*[^*]+\*\*)/g);
  return tokens.map((tok, i) =>
    tok.startsWith("**") && tok.endsWith("**") ? (
      <strong key={`${key}-b${i}`} style={{ fontWeight: 700 }}>
        {tok.slice(2, -2)}
      </strong>
    ) : (
      <span key={`${key}-t${i}`}>{tok}</span>
    )
  );
}

function BotText({ content }: { content: string }) {
  const paragraphs = content.split(/\n{2,}/);
  return (
    <div>
      {paragraphs.map((para, i) => (
        <p
          key={i}
          style={{
            margin: 0,
            marginBottom: i < paragraphs.length - 1 ? u(CHAT_GEO.paraGap) : 0,
            fontFamily: FONT_DEGULAR,
            fontSize: u(CHAT_GEO.msgFont),
            lineHeight: `${(CHAT_GEO.msgLh / CHAT_GEO.msgFont).toFixed(4)}em`,
            color: MOSH.blanc,
            fontWeight: 400,
            maxWidth: u(560),
            whiteSpace: "pre-line",
          }}
        >
          {renderInline(para, `p${i}`)}
        </p>
      ))}
    </div>
  );
}

/** Bulle utilisateur : blanche, arrondie 27, queue triangulaire en bas à droite. */
function UserBubble({ content }: { content: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        position: "relative",
        alignSelf: "flex-end",
        background: MOSH.blanc,
        color: MOSH.noir,
        borderRadius: u(27),
        minHeight: u(CHAT_GEO.bulleH),
        display: "flex",
        alignItems: "center",
        paddingLeft: u(CHAT_GEO.bullePadX),
        paddingRight: u(CHAT_GEO.bullePadX),
        paddingTop: u(14),
        paddingBottom: u(14),
        fontFamily: FONT_DEGULAR,
        fontSize: u(CHAT_GEO.msgFont),
        lineHeight: 1.25,
        maxWidth: u(520),
        marginBottom: u(12), // place pour la queue
      }}
    >
      {content}
      {/* Queue (12×12, pointe en bas à droite) */}
      <svg
        viewBox="0 0 12 12"
        aria-hidden
        style={{
          position: "absolute",
          right: 0,
          bottom: u(-11.5),
          width: u(12),
          height: u(12),
        }}
      >
        <path d="M0 0H12V12L0 0Z" fill={MOSH.blanc} />
      </svg>
    </motion.div>
  );
}

function ThinkingDots() {
  return (
    <div style={{ display: "flex", gap: u(5), alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{
            width: u(7),
            height: u(7),
            borderRadius: "50%",
            background: MOSH.gris3,
          }}
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
          transition={{ duration: 0.75, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════ */
interface Message { role: "user" | "assistant"; content: string; }
interface DiagnosticResult { score: number; companyFound: boolean; rawText: string; }

/* ═══════════════════════════════════════════════
   COMPOSANT PRINCIPAL
   ═══════════════════════════════════════════════ */
export default function MoshFunnel() {
  /* ── Funnel state ── */
  const [funnelState, setFunnelState] = useState<"hero" | "chat" | "result" | "email" | "success">("hero");

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

  /* ── FAQ du chat ── */
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  /* ── Collected data ── */
  const [nom, setNom] = useState("");
  const [, setSite] = useState("");
  const [activite, setActivite] = useState("");
  const [zone, setZone] = useState("");
  const [concurrents, setConcurrents] = useState("");
  const [email, setEmail] = useState("");

  /* ── Results ── */
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);

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
      case "ask_zone": return "Ex: Lausanne et ses environs";
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
        content: "Salut poilu.e.\n\nJe vais vérifier si les IA vous trouvent sur internet ou si elles renvoient vos clients vers la concurrence.\n\nC'est gratuit, rapide et sans douleur.\n\n**Comment s'appelle votre entreprise?**"
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
        botReply(`${text} c'est bien noté.\n\n**Quelle est l'adresse de votre site internet?**\n\nSi vous n'en avez pas, indiquez l'adresse d'un compte de vos réseaux sociaux (et par pitié, ne fermez pas cette fenêtre).`, "ask_site");
        break;
      case "ask_site":
        setSite(text);
        botReply("Bien reçu.\n\n**Que faites-vous concrètement?**\n\nPas besoin de la version corporate, seulement la version que vous donnez au voisin.", "ask_activite");
        break;
      case "ask_activite":
        setActivite(text);
        botReply("OK. Et **vous êtes basés où?**", "ask_zone");
        break;
      case "ask_zone":
        setZone(text);
        botReply(`${text} — c'est noté.\n\nDernière chose : **quels concurrents vous agacent le plus?**\n\nCeux qui récupèrent vos clients, qui sont toujours devant, etc.`, "ask_concurrents");
        break;
      case "ask_concurrents":
        setConcurrents(text);
        botReply("Parfait. Et **vous voulez surtout plus de quoi?** Plus d'appels? De devis? De réservations? De trafic?", "ask_objectif");
        break;
      case "ask_objectif":
        setIsThinking(true);
        setTimeout(() => {
          setIsThinking(false);
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: `OK, j'ai tout ce qu'il me faut.\n\nJe vais maintenant poser la question qu'un prospect poserait à une IA :\n\n"Recommande-moi les meilleurs ${activite || text} à ${zone}"\n\nEt on va voir si **${nom}** fait partie de la réponse. Accrochez-vous.` },
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
          ? `**${nom}** apparaît dans la réponse. Bonne nouvelle.\n\nMauvaise nouvelle : être cité ne veut pas dire être recommandé en premier. Et si un concurrent fait mieux sur les signaux techniques, il prendra votre place au prochain rafraîchissement.\n\nVotre score express : **${score}/100**\n\nVous êtes là, mais pas encore au bon endroit. Et ça, ça se corrige.`
          : `**${nom}** n'apparaît nulle part dans la réponse.\n\nL'IA vient de recommander d'autres entreprises à votre place. Vos prospects qui posent cette question à ChatGPT, Perplexity ou Gemini ne tomberont jamais sur vous.\n\nVotre score express : **${score}/100**\n\nAujourd'hui, vos concurrents ont plus de chances d'être cités que vous. Et ça, ça coûte des clients.`;

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
    <div
      style={{
        fontFamily: FONT_DEGULAR,
        color: MOSH.noir,
        minHeight: "100svh",
      }}
    >
      {/* Style du placeholder de l'input chat (couleur maquette #8C8C8C) */}
      <style>{`.mosh-chat-input::placeholder { color: ${MOSH.gris3}; opacity: 1; }
.mosh-chat-scroll { scrollbar-width: none; } .mosh-chat-scroll::-webkit-scrollbar { display: none; }`}</style>

      <AnimatePresence mode="wait">

        {/* ═════════════════════════════════════════
            HERO (pages accueil_desktop / oui / non)
            ═════════════════════════════════════════ */}
        {funnelState === "hero" && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "relative",
              width: "100%",
              minHeight: "100svh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              background: MOSH.fond,
              color: MOSH.noir,
            }}
          >
            {/* Cadre intérieur à l'échelle (ratio maquette), dimensionné pour
                tenir dans la hauteur de l'écran → le footer reste toujours visible. */}
            <div
              style={{
                position: "relative",
                width: "min(100%, calc(100svh * 1440 / 1024))",
                aspectRatio: "1440 / 1024",
                flexShrink: 0,
                containerType: "inline-size",
              }}
            >
            {/* Logo en haut à droite */}
            <Logo
              variant="light"
              style={{
                position: "absolute",
                top: u(HERO_GEO.logoTop),
                right: u(HERO_GEO.logoRight),
              }}
            />

            {/* Titre géant — les parenthèses logent le slogan à la place du "o" */}
            <h1
              style={{
                position: "absolute",
                top: u(HERO_GEO.titreTop),
                left: u(HERO_GEO.margeGauche),
                margin: 0,
                fontSize: u(HERO_GEO.titreFont),
                lineHeight: `${u(HERO_GEO.titreLh)}`,
                fontWeight: 450,
                letterSpacing: "-0.01em",
                color: MOSH.noir,
                whiteSpace: "nowrap",
              }}
            >
              Est-ce que l&apos;IA<br />
              vous tr(
              <span
                style={{
                  display: "inline-block",
                  fontSize: u(HERO_GEO.sloganFont),
                  lineHeight: `${u(HERO_GEO.sloganLh)}`,
                  fontWeight: 400,
                  letterSpacing: "normal",
                  textAlign: "center",
                  verticalAlign: u(HERO_GEO.sloganRaise),
                  margin: `0 ${u(25)}`,
                }}
              >
                sur les moteurs<br />de recherche
              </span>
              )uve<br />
              avant&nbsp;vos<br />
              concurrents?
            </h1>

            {/* Choix Oui / Non — positions exactes (x 156 et x 396) */}
            <Checkbox
              type="oui"
              checked={choice === "oui"}
              struck={choice === "non"}
              onClick={() => setChoice("oui")}
              style={{ position: "absolute", top: u(HERO_GEO.checkboxTop), left: u(HERO_GEO.margeGauche) }}
            />
            <Checkbox
              type="non"
              checked={choice === "non"}
              struck={choice === "oui"}
              onClick={() => setChoice("non")}
              style={{ position: "absolute", top: u(HERO_GEO.checkboxTop), left: u(HERO_GEO.checkboxNonLeft) }}
            />

            {/* Accroche + CTA (après le choix) — textes exacts des pages oui/non */}
            <AnimatePresence>
              {choice !== "none" && (
                <motion.div
                  key={choice}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p
                    style={{
                      position: "absolute",
                      top: u(HERO_GEO.accrocheTop),
                      left: u(HERO_GEO.margeGauche),
                      margin: 0,
                      fontSize: u(HERO_GEO.accrocheFont),
                      lineHeight: `${u(HERO_GEO.accrocheLh)}`,
                      fontWeight: 400,
                      color: MOSH.noir,
                    }}
                  >
                    {choice === "oui" ? (
                      <>
                        Ça fait plaisir… mais vous en êtes sûr.e?<br />
                        L&apos;IA ne répond pas avant que vos prospects aient cliqué sur votre site?<br />
                        L&apos;IA ne renvoie pas vos clients vers la concurrence?
                      </>
                    ) : (
                      <>
                        Ouh la méchante IA qui fait ressortir vos concurrents à votre place.<br />
                        En plus elle répond avant que vos prospects aient cliqué sur votre site.<br />
                        L&apos;IA ne vous aime pas? Non, elle ne vous connait pas.
                      </>
                    )}
                  </p>

                  <BtnTest
                    variant={choice === "oui" ? "1" : "2"}
                    onClick={startChat}
                    style={{ position: "absolute", top: u(HERO_GEO.ctaTop), left: u(155) }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <MoshFooter />
            </div>
          </motion.div>
        )}

        {/* ═════════════════════════════════════════
            CHAT (pages test_1 / test_2 / test_*_faq)
            ═════════════════════════════════════════ */}
        {funnelState === "chat" && (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "relative",
              width: "100%",
              minHeight: "100svh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              background: MOSH.noir,
            }}
          >
            {/* Cadre intérieur à l'échelle (ratio maquette), centré dans le fond noir */}
            <div
              style={{
                position: "relative",
                width: "min(100%, calc(100svh * 1440 / 1024))",
                aspectRatio: "1440 / 1024",
                flexShrink: 0,
                containerType: "inline-size",
              }}
            >
            {/* Logo blanc en haut à droite */}
            <Logo
              variant="dark"
              style={{
                position: "absolute",
                top: u(HERO_GEO.logoTop),
                right: u(HERO_GEO.logoRight),
              }}
            />

            {/* Zone messages (scroll) */}
            <div
              ref={chatRef}
              className="mosh-chat-scroll"
              style={{
                position: "absolute",
                left: u(CHAT_GEO.colGauche),
                width: u(CHAT_GEO.colLargeur),
                top: u(CHAT_GEO.zoneTop),
                bottom: u(1024 - 748.75 + 20),
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: u(32),
                paddingTop: u(CHAT_GEO.fondu),
                paddingBottom: u(8),
              }}
            >
              <AnimatePresence>
                {messages.map((msg, i) =>
                  msg.role === "assistant" ? (
                    <motion.div key={`msg-${i}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <BotText content={msg.content} />
                    </motion.div>
                  ) : (
                    <UserBubble key={`msg-${i}`} content={msg.content} />
                  )
                )}
                {isThinking && (
                  <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <ThinkingDots />
                  </motion.div>
                )}
                {isStreaming && streamingContent && (
                  <motion.div key="streaming" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <BotText content={streamingContent} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Fondu du haut : les messages s'estompent sous le logo */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: u(CHAT_GEO.colGauche),
                width: u(CHAT_GEO.colLargeur),
                top: u(CHAT_GEO.zoneTop),
                height: u(CHAT_GEO.fondu),
                background: `linear-gradient(to bottom, ${MOSH.noir}, rgba(26,26,26,0))`,
                pointerEvents: "none",
                zIndex: 2,
              }}
            />

            {/* Bloc bas : input + pilules FAQ + réponse — centré sur y=804.4 */}
            <div
              style={{
                position: "absolute",
                left: u(CHAT_GEO.colGauche),
                width: u(CHAT_GEO.colLargeur),
                top: u(CHAT_GEO.blocCentre),
                transform: "translateY(-50%)",
                display: "flex",
                flexDirection: "column",
                zIndex: 3,
              }}
            >
              {/* Barre de saisie (pilule #3A3A3A bordée #6C6C6C) */}
              <div style={{ position: "relative" }}>
                <input
                  ref={inputRef}
                  className="mosh-chat-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  disabled={inputDisabled}
                  placeholder={getPlaceholder()}
                  style={{
                    width: "100%",
                    height: u(CHAT_GEO.inputH),
                    boxSizing: "border-box",
                    background: MOSH.gris1,
                    border: `${u(1.5)} solid ${MOSH.gris2}`,
                    borderRadius: u(26.25),
                    paddingLeft: u(32.7),
                    paddingRight: u(60),
                    fontSize: u(CHAT_GEO.msgFont),
                    fontFamily: FONT_DEGULAR,
                    color: MOSH.blanc,
                    outline: "none",
                    cursor: inputDisabled ? "not-allowed" : "text",
                  }}
                />
                <BtnEnter
                  onClick={handleSubmit}
                  disabled={inputDisabled || !inputValue.trim()}
                  style={{
                    position: "absolute",
                    right: u(8.25),
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
              </div>

              {/* Pilules FAQ — centrées sous la barre de saisie */}
              <div style={{ display: "flex", justifyContent: "center", gap: u(20), marginTop: u(CHAT_GEO.pillGap) }}>
                {FAQ_ITEMS.map((item, i) => (
                  <BtnFaq
                    key={i}
                    active={openFaq === i}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    {item.q}
                  </BtnFaq>
                ))}
              </div>

              {/* Réponse FAQ (texte exact des pages test_*_faq) */}
              <AnimatePresence>
                {openFaq !== null && (
                  <motion.p
                    key={openFaq}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      margin: 0,
                      marginTop: u(CHAT_GEO.reponseGap),
                      paddingLeft: u(8),
                      maxWidth: u(650),
                      fontSize: u(14),
                      lineHeight: `${u(18.6)}`,
                      color: MOSH.blanc,
                      fontWeight: 400,
                    }}
                  >
                    <strong style={{ fontWeight: 700 }}>{FAQ_ITEMS[openFaq].lead}</strong>
                    {FAQ_ITEMS[openFaq].body}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <MoshFooter dark />
            </div>
          </motion.div>
        )}

        {/* ═════════════════════════════════════════
            RÉSULTAT EXPRESS (pas de page maquette — habillé aux couleurs mosh)
            ═════════════════════════════════════════ */}
        {funnelState === "result" && diagnosticResult && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{ minHeight: "100svh", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", background: MOSH.fond }}
          >
            <div style={{ maxWidth: 600, width: "100%", textAlign: "center" }}>
              <p style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, color: MOSH.gris2, marginBottom: 8 }}>Votre score express</p>
              <div style={{ fontSize: "clamp(5rem, 15vw, 8rem)", fontWeight: 700, color: MOSH.noir, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                {diagnosticResult.score}<span style={{ fontSize: "0.4em", color: MOSH.gris3 }}>/100</span>
              </div>

              <div style={{ marginTop: 32, padding: 32, borderRadius: 4, background: MOSH.blanc, border: `1px solid rgba(26,26,26,0.12)` }}>
                <h2 style={{ fontSize: "clamp(1.2rem, 3vw, 1.6rem)", fontWeight: 700, marginBottom: 20, lineHeight: 1.3, color: MOSH.noir }}>
                  {diagnosticResult.companyFound
                    ? "Vous êtes là. Mais pas encore au bon endroit."
                    : "Aujourd'hui, vos concurrents ont plus de chances d'être cités que vous."}
                </h2>
                <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 12, color: MOSH.gris1, fontSize: 15 }}>
                  {diagnosticResult.companyFound ? (
                    <>
                      <p style={{ margin: 0, display: "flex", gap: 10 }}><span>✓</span> L&apos;IA vous connaît et peut vous citer.</p>
                      <p style={{ margin: 0, display: "flex", gap: 10 }}><span>×</span> Mais vos signaux ne garantissent pas la première place.</p>
                      <p style={{ margin: 0, display: "flex", gap: 10 }}><span>×</span> Vous perdez encore des leads face à d&apos;autres recommandations.</p>
                    </>
                  ) : (
                    <>
                      <p style={{ margin: 0, display: "flex", gap: 10 }}><span>×</span> L&apos;IA vient de recommander d&apos;autres entreprises à votre place.</p>
                      <p style={{ margin: 0, display: "flex", gap: 10 }}><span>×</span> Vos signaux locaux sont trop faibles pour déclencher une recommandation.</p>
                      <p style={{ margin: 0, display: "flex", gap: 10 }}><span>×</span> Vous êtes totalement invisible sur cette recherche générative.</p>
                    </>
                  )}
                </div>
              </div>

              <p style={{ fontSize: 16, fontWeight: 400, marginTop: 28, marginBottom: 24, color: MOSH.gris1 }}>
                On peut vous montrer où vous disparaissez, qui prend votre place, et ce qu&apos;il faut corriger en premier.
              </p>
              <motion.button
                onClick={() => setFunnelState("email")}
                whileTap={{ scale: 0.97 }}
                style={{ background: MOSH.noir, color: MOSH.blanc, border: "none", padding: "20px 41px", borderRadius: 4, fontSize: 17, fontWeight: 400, cursor: "pointer", fontFamily: FONT_DEGULAR }}
              >
                Débloquer mon audit complet
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ═════════════════════════════════════════
            EMAIL GATE (pas de page maquette — habillé aux couleurs mosh)
            ═════════════════════════════════════════ */}
        {funnelState === "email" && (
          <motion.div
            key="email"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ minHeight: "100svh", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", background: MOSH.fond }}
          >
            <div style={{ maxWidth: 520, width: "100%" }}>
              <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 700, marginBottom: 12, color: MOSH.noir }}>On peut vous envoyer l&apos;audit complet.</h2>
              <p style={{ fontSize: 16, color: MOSH.gris1, marginBottom: 32, lineHeight: 1.6 }}>
                Pas un PDF de 48 pages pour caler une armoire. Juste ce qu&apos;il faut pour comprendre ce qui bloque et quoi corriger.
              </p>

              <div style={{ padding: 20, borderRadius: 4, background: MOSH.blanc, border: `1px solid rgba(26,26,26,0.12)`, marginBottom: 28 }}>
                <p style={{ fontWeight: 700, marginBottom: 12, fontSize: 14, color: MOSH.noir }}>Ce qu&apos;il contient :</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: MOSH.gris1 }}>
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
                  style={{ width: "100%", boxSizing: "border-box", padding: "14px 16px", borderRadius: 4, fontSize: 15, background: MOSH.blanc, border: `1px solid rgba(26,26,26,0.25)`, color: MOSH.noir, outline: "none", fontFamily: FONT_DEGULAR }}
                />
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.98 }}
                  style={{ width: "100%", padding: 18, borderRadius: 4, fontSize: 17, fontWeight: 400, background: MOSH.noir, color: MOSH.blanc, border: "none", cursor: "pointer", fontFamily: FONT_DEGULAR }}
                >
                  Recevoir mon audit complet
                </motion.button>
              </form>
              <p style={{ fontSize: 11, color: MOSH.gris3, textAlign: "center", marginTop: 16 }}>
                Les infos que vous entrez servent à générer votre audit et à vous l&apos;envoyer. On ne va pas en faire un trafic louche.
              </p>
            </div>
          </motion.div>
        )}

        {/* ═════════════════════════════════════════
            SORTIE POST-CONVERSION (pas de page maquette)
            ═════════════════════════════════════════ */}
        {funnelState === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ minHeight: "100svh", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center", background: MOSH.fond }}
          >
            <div style={{ maxWidth: 520, width: "100%" }}>
              <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", fontWeight: 700, marginBottom: 12, color: MOSH.noir }}>Audit envoyé.</h2>
              <p style={{ fontSize: 16, color: MOSH.gris1, marginBottom: 32 }}>
                On vient de vous envoyer le rapport complet. En attendant, voilà déjà ce qu&apos;il faut retenir.
              </p>

              <div style={{ textAlign: "left", padding: 24, borderRadius: 4, background: MOSH.blanc, border: `1px solid rgba(26,26,26,0.12)`, marginBottom: 32 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 15, color: MOSH.gris1 }}>
                  <p style={{ margin: 0, display: "flex", gap: 12 }}><span>→</span> <span>Votre visibilité IA est actuellement <strong style={{ color: MOSH.noir }}>faible</strong>.</span></p>
                  <p style={{ margin: 0, display: "flex", gap: 12 }}><span>→</span> <span>Votre principal point faible : l&apos;incohérence de vos données publiques.</span></p>
                  <p style={{ margin: 0, display: "flex", gap: 12 }}><span>→</span> <span>Le concurrent qui capte vos leads est probablement <strong style={{ color: MOSH.noir }}>{concurrents}</strong>.</span></p>
                </div>
              </div>

              <motion.button
                onClick={() => window.open("https://calendly.com", "_blank")}
                whileTap={{ scale: 0.97 }}
                style={{ background: MOSH.noir, color: MOSH.blanc, border: "none", padding: "20px 41px", borderRadius: 4, fontSize: 17, fontWeight: 400, cursor: "pointer", fontFamily: FONT_DEGULAR }}
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
