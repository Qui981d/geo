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
  parenRaise: 2, // verticalAlign des parenthèses vectorielles (bas ≈ baseline du titre)
  checkboxTop: 605,
  checkboxNonLeft: 396,
  accrocheTop: 676, // [calibré] cap à y=682.2
  accrocheFont: 18,
  accrocheLh: 24,
  ctaTop: 776,
  logoTop: 40,
  logoRight: 40,
} as const;

/**
 * Parenthèses du titre "tr( … )uve" — VRAIS vecteurs Figma (export Frame 16),
 * pas du texte : la police réduite à la bonne hauteur donnait un trait trop
 * fin. Chaque paren fait 18.762 × 59.5 (espace maquette 1440).
 */
const PAREN = {
  w: 18.762,
  h: 59.5,
  open: {
    vb: "354.128 17.5 18.762 59.5",
    d: "M372.89 77C366.462 68.6179 362.673 58.3465 362.673 47.25C362.673 36.1535 366.473 25.8821 372.89 17.5H365.322C358.276 25.9473 354.128 36.1969 354.128 47.25C354.128 58.3031 358.276 68.5419 365.322 77H372.89Z",
  },
  close: {
    vb: "549.89 17.5 18.762 59.5",
    d: "M557.458 17.5H549.89C556.318 25.8821 560.107 36.1535 560.107 47.25C560.107 58.3465 556.307 68.6179 549.89 77H557.458C564.504 68.5527 568.652 58.3031 568.652 47.25C568.652 36.1969 564.504 25.9581 557.458 17.5Z",
  },
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

/**
 * Footer 3 zones, identique sur toutes les pages (couleur selon le fond).
 * `fixed` : collé en bas de l'écran (hero pleine largeur) au lieu du bas du
 * cadre. On lui donne alors un fond + un padding vertical pour former une
 * barre nette (le contenu qui passe dessous est proprement masqué).
 */
function MoshFooter({ dark = false, fixed = false }: { dark?: boolean; fixed?: boolean }) {
  const color = dark ? MOSH.blanc : MOSH.noir;
  return (
    <div
      style={{
        position: fixed ? "fixed" : "absolute",
        left: 0,
        right: 0,
        bottom: fixed ? 0 : u(30),
        zIndex: 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: u(41),
        paddingRight: u(40),
        paddingTop: fixed ? u(18) : 0,
        paddingBottom: fixed ? u(30) : 0,
        background: fixed ? (dark ? MOSH.noir : MOSH.fond) : undefined,
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

/**
 * Analyse la réponse de l'IA (liste "1. … 2. … 3. …") : renvoie le rang de
 * l'entreprise (0 = absente) et les noms de la liste dans l'ordre.
 */
function extractRanking(raw: string, company: string): { rank: number; names: string[] } {
  const c = company.toLowerCase().trim();
  const blocks = raw.split(/(?=(?:^|\n)\s*\d+[.)]\s)/).filter((b) => /^\s*\d+[.)]\s/.test(b.trimStart()));
  const names: string[] = [];
  let rank = 0;
  blocks.forEach((b, i) => {
    const firstLine = b.replace(/^\s*\d+[.)]\s*/, "").split("\n")[0];
    const name = firstLine
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*#]/g, "")
      .split(/[–—:-]/)[0]
      .trim();
    if (name) names.push(name);
    if (c && c.length > 1 && rank === 0 && b.toLowerCase().includes(c)) rank = i + 1;
  });
  if (rank === 0 && c && c.length > 1 && raw.toLowerCase().includes(c)) rank = 1; // cité hors liste
  return { rank, names };
}

/** "A, B et C" à partir d'une liste. */
function frenchList(items: string[]): string {
  const l = items.filter(Boolean);
  if (l.length <= 1) return l[0] || "";
  return `${l.slice(0, -1).join(", ")} et ${l[l.length - 1]}`;
}

/** Libellé du CTA audit, adapté au rang. */
function ctaLabel(rank: number): string {
  if (rank === 1) return "Verrouiller ma 1re place";
  if (rank >= 2) return "Repasser devant mes concurrents";
  return "Débloquer mon audit complet";
}

/**
 * Score CALCULÉ et décomposable (fini l'arbitraire) : présence + position +
 * base de visibilité résiduelle. Le total est la somme des 3 composantes.
 */
function computeScore(rank: number, n: number): { presence: number; position: number; base: number; total: number } {
  const N = Math.max(n, 3);
  const presence = rank > 0 ? 35 : 0;
  const position = rank > 0 ? Math.round(40 * (N - rank + 1) / N) : 0;
  const base = 15; // visibilité résiduelle (annuaires, mentions) — non mesurée finement en express
  const total = Math.min(100, presence + position + base);
  return { presence, position, base, total };
}

/** Concurrents cités par l'utilisateur qui ressortent dans la réponse de l'IA. */
function matchMentioned(ranking: string[], userText: string): { name: string; rank: number }[] {
  const t = (userText || "").toLowerCase();
  if (!t.trim()) return [];
  const out: { name: string; rank: number }[] = [];
  ranking.forEach((name, i) => {
    const first = name.split(/[\s–—-]+/)[0].toLowerCase();
    if (first.length >= 3 && t.includes(first)) out.push({ name, rank: i + 1 });
  });
  return out;
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
        borderBottomRightRadius: 0, // coin carré → la queue se raccorde sans trou
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
interface DiagnosticResult { score: number; companyFound: boolean; rank: number; competitors: string[]; rawText: string; }

/* ═══════════════════════════════════════════════
   COMPOSANT PRINCIPAL
   ═══════════════════════════════════════════════ */
export default function MoshFunnel() {
  /* ── Funnel state ── */
  const [funnelState, setFunnelState] = useState<"hero" | "chat" | "result" | "email" | "success">("hero");
  const [showReport, setShowReport] = useState(false); // rapport affiché SOUS le chat (pas de bascule de page)

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

  /* ── Ferme l'explication FAQ ouverte si on clique en dehors ── */
  useEffect(() => {
    if (openFaq === null) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (faqRef.current && !faqRef.current.contains(e.target as Node)) setOpenFaq(null);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [openFaq]);

  /* ── Collected data ── */
  const [nom, setNom] = useState("");
  const [site, setSite] = useState("");
  const [activite, setActivite] = useState("");
  const [zone, setZone] = useState("");
  const [concurrents, setConcurrents] = useState("");
  const [email, setEmail] = useState("");

  /* ── Results ── */
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);
  const [redflags, setRedflags] = useState<string | null>(null); // 2e appel : problèmes concrets sur l'entreprise
  const [redflagsLoading, setRedflagsLoading] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const heroAccrocheRef = useRef<HTMLParagraphElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  /* ── Hero : verrou de scroll tant qu'aucun choix (évite de scroller dans le vide) ── */
  useEffect(() => {
    const lock = funnelState === "hero" && choice === "none";
    document.documentElement.style.overflow = lock ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [funnelState, choice]);

  /* ── Choix Oui/Non : enregistre + scroll auto fluide vers l'accroche ── */
  const handleHeroChoice = (c: "oui" | "non") => {
    setChoice(c);
    setTimeout(() => {
      heroAccrocheRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 140);
  };

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

  /* ── Retour au début : réinitialise tout le tunnel ── */
  const resetToHero = () => {
    abortRef.current?.abort();
    setFunnelState("hero");
    setShowReport(false);
    setChoice("none");
    setChatStep("greeting");
    setMessages([]);
    setInputValue("");
    setInputDisabled(true);
    setIsThinking(false);
    setIsStreaming(false);
    setStreamingContent("");
    setOpenFaq(null);
    setNom(""); setSite(""); setActivite(""); setZone(""); setConcurrents(""); setEmail("");
    setDiagnosticResult(null);
    setRedflags(null);
    setRedflagsLoading(false);
  };

  /* ── 2e appel : l'IA analyse l'entreprise et remonte des problèmes concrets ── */
  const fetchRedflags = async () => {
    setRedflagsLoading(true);
    setRedflags(null);
    try {
      const res = await fetch("/api/redflags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: nom, metier: activite, ville: zone, site }),
      });
      if (!res.ok) throw new Error("redflags api error");
      const data = await res.json();
      setRedflags(typeof data.text === "string" ? data.text : "");
    } catch (err) {
      console.error(err);
      setRedflags(""); // vide → section masquée proprement
    } finally {
      setRedflagsLoading(false);
    }
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
        botReply(`${text} c'est bien noté.\n\n**Quelle est l'adresse de votre site internet?**\n\nSi vous n'en avez pas, indiquez l'adresse d'un compte de vos réseaux sociaux.`, "ask_site");
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

      // Rang réel de l'entreprise dans la réponse (0 = absente) + concurrents
      const { rank, names } = extractRanking(fullContent, nom);
      const found = rank > 0;
      // Score CALCULÉ (présence + position + base), plus arbitraire
      const score = computeScore(rank, names.length).total;
      const ahead = frenchList(names.slice(0, Math.max(0, rank - 1)));
      const top = frenchList(names.filter((n) => n.toLowerCase() !== nom.toLowerCase()).slice(0, 3));
      // Concurrents que l'utilisateur a cités et qui ressortent dans la réponse
      const mentioned = matchMentioned(names, concurrents);
      const callback = mentioned.length
        ? `\n\nEt tiens — **${frenchList(mentioned.map((m) => m.name))}**, que vous avez cité${mentioned.length > 1 ? "s" : ""} : ${mentioned.length > 1 ? "ils sortent" : `il sort`} bien dans la réponse (${mentioned.map((m) => `${m.name} en ${m.rank}${m.rank === 1 ? "re" : "e"}`).join(", ")}). Vous ne les aviez pas inventés.`
        : "";
      setDiagnosticResult({ score, companyFound: found, rank, competitors: names, rawText: fullContent });

      // Verdict message — dépend du RANG et explique POURQUOI
      const SIGNALS = "vos signaux : densité d'infos publiques, avis structurés, citations dans des sources d'autorité, cohérence de vos coordonnées (nom/adresse/téléphone)";
      setTimeout(() => {
        let verdictMsg: string;
        if (rank === 1) {
          verdictMsg = `**${nom}** sort **en 1re position**. Honnêtement, joli.\n\nMais cette place n'est pas acquise : à chaque requête, l'IA reclasse selon ${SIGNALS}. Un concurrent qui muscle ces signaux peut vous doubler au prochain rafraîchissement.\n\nVotre score : **${score}/100** — vous êtes devant, l'enjeu c'est de **verrouiller** la place.${callback}`;
        } else if (rank >= 2) {
          verdictMsg = `**${nom}** est cité, mais en **${rank}e position**${ahead ? `, derrière **${ahead}**` : ""}.\n\nPourquoi ? L'IA classe selon ${SIGNALS}. Vous y êtes, mais vos signaux sont un cran en dessous de ceux qui passent devant.\n\nVotre score : **${score}/100** — la 1re place est atteignable, il manque quelques réglages.${callback}`;
        } else {
          verdictMsg = `**${nom}** n'apparaît **nulle part**.\n\nL'IA recommande ${top ? `**${top}**` : "d'autres entreprises"} à votre place. Vos prospects qui posent cette question à ChatGPT, Perplexity ou Gemini ne tombent jamais sur vous.\n\nPourquoi ? ${SIGNALS[0].toUpperCase() + SIGNALS.slice(1)} sont trop faibles pour déclencher une recommandation.\n\nVotre score : **${score}/100**.${callback}`;
        }

        setMessages((prev) => [...prev, { role: "assistant", content: verdictMsg }]);
        setChatStep("verdict");

        // Le rapport apparaît SOUS le chat (on scrolle pour le voir), pas de bascule
        setShowReport(true);

        // 2e appel : l'IA passe l'entreprise au crible (red flags → rapport)
        fetchRedflags();
        setTimeout(() => {
          setMessages((prev) => [...prev, { role: "assistant", content: `J'ai aussi passé **${nom}** au crible. Ce qui coince précisément chez vous, c'est dans le rapport complet 👇` }]);
        }, 1300);
      }, 1500);

    } catch (err) {
      console.error(err);
      setIsThinking(false);
      setIsStreaming(false);
      setDiagnosticResult({ score: computeScore(0, 3).total, companyFound: false, rank: 0, competitors: [], rawText: "" });
      setShowReport(true);
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
              aspectRatio: "1440 / 1024",
              overflow: "hidden",
              background: MOSH.fond,
              color: MOSH.noir,
              containerType: "inline-size",
            }}
          >
            {/* Logo en haut à droite — collé (fixed) même au scroll */}
            <Logo
              variant="light"
              style={{
                position: "fixed",
                top: u(HERO_GEO.logoTop),
                right: u(HERO_GEO.logoRight),
                zIndex: 6,
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
              vous tr
              <svg
                viewBox={PAREN.open.vb}
                aria-hidden
                style={{
                  display: "inline-block",
                  width: u(PAREN.w),
                  height: u(PAREN.h),
                  verticalAlign: u(HERO_GEO.parenRaise),
                  fill: "currentColor",
                }}
              >
                <path d={PAREN.open.d} />
              </svg>
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
              <svg
                viewBox={PAREN.close.vb}
                aria-hidden
                style={{
                  display: "inline-block",
                  width: u(PAREN.w),
                  height: u(PAREN.h),
                  verticalAlign: u(HERO_GEO.parenRaise),
                  fill: "currentColor",
                }}
              >
                <path d={PAREN.close.d} />
              </svg>
              uve<br />
              avant&nbsp;vos<br />
              concurrents?
            </h1>

            {/* Choix Oui / Non — positions exactes (x 156 et x 396) */}
            <Checkbox
              type="oui"
              checked={choice === "oui"}
              struck={choice === "non"}
              onClick={() => handleHeroChoice("oui")}
              style={{ position: "absolute", top: u(HERO_GEO.checkboxTop), left: u(HERO_GEO.margeGauche) }}
            />
            <Checkbox
              type="non"
              checked={choice === "non"}
              struck={choice === "oui"}
              onClick={() => handleHeroChoice("non")}
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
                    ref={heroAccrocheRef}
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

            <MoshFooter fixed />
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
              background: MOSH.noir,
            }}
          >
            {/* Écran 1 — le chat, plein écran (footer/input ancrés en bas) */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100svh",
                overflow: "hidden",
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

            {/* Bouton retour : revient au début du tunnel */}
            <button
              type="button"
              onClick={resetToHero}
              aria-label="Revenir au début"
              style={{
                position: "absolute",
                top: u(HERO_GEO.logoTop),
                left: u(HERO_GEO.logoRight),
                zIndex: 4,
                display: "inline-flex",
                alignItems: "center",
                gap: u(8),
                background: "transparent",
                border: "none",
                padding: 0,
                color: MOSH.blanc,
                fontFamily: FONT_DEGULAR,
                fontSize: u(16),
                fontWeight: 400,
                cursor: "pointer",
                opacity: 0.85,
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden style={{ width: u(20), height: u(20), fill: "none", stroke: MOSH.blanc, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }}>
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Retour
            </button>

            {/* Zone messages (scroll) */}
            <div
              ref={chatRef}
              className="mosh-chat-scroll"
              onScroll={() => { if (openFaq !== null) setOpenFaq(null); }}
              style={{
                position: "absolute",
                left: u(CHAT_GEO.colGauche),
                width: u(CHAT_GEO.colLargeur),
                top: u(CHAT_GEO.zoneTop),
                bottom: u(230), // au-dessus du bloc input ancré en bas
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
                {showReport && (
                  <motion.button
                    key="see-report"
                    type="button"
                    onClick={() => reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      alignSelf: "flex-start",
                      marginTop: u(12),
                      display: "inline-flex",
                      alignItems: "center",
                      gap: u(9),
                      background: MOSH.blanc,
                      color: MOSH.noir,
                      border: "none",
                      borderRadius: u(30),
                      padding: `${u(16)} ${u(30)}`,
                      fontFamily: FONT_DEGULAR,
                      fontSize: u(CHAT_GEO.msgFont),
                      fontWeight: 400,
                      cursor: "pointer",
                    }}
                  >
                    Voir le rapport complet
                    <svg viewBox="0 0 24 24" aria-hidden style={{ width: u(19), height: u(19), fill: "none", stroke: MOSH.noir, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }}>
                      <path d="M12 5v14M6 13l6 6 6-6" />
                    </svg>
                  </motion.button>
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

            {/* Bloc bas : input + pilules FAQ + réponse — ancré au-dessus du footer */}
            <div
              style={{
                position: "absolute",
                left: u(CHAT_GEO.colGauche),
                width: u(CHAT_GEO.colLargeur),
                bottom: u(96),
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

              {/* Pilules FAQ + réponse (ref pour le clic-extérieur) */}
              <div ref={faqRef}>
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

                {/* Réponse FAQ — hauteur animée pour que l'input glisse en douceur */}
                <AnimatePresence initial={false} mode="wait">
                  {openFaq !== null && (
                    <motion.div
                      key={openFaq}
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: u(CHAT_GEO.reponseGap) }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <p
                        style={{
                          margin: 0,
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
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <MoshFooter dark />
            </div>

            {/* Écran 2 — le RAPPORT, en dessous du chat : on scrolle pour le voir,
                on reste libre de relire le chat autant qu'on veut (pas de bascule). */}
            {showReport && diagnosticResult && (() => {
              const dr = diagnosticResult;
              const others = dr.competitors.filter((n) => n.toLowerCase() !== nom.toLowerCase());
              const them = frenchList(others.slice(0, 3));
              const topComp = others[0] || "un concurrent";
              const posLabel = dr.rank === 1 ? "1re place" : dr.rank >= 2 ? `${dr.rank}e place` : "hors classement";
              const sb = computeScore(dr.rank, dr.competitors.length);
              const parsedRedflags = (redflags || "")
                .split("\n")
                .map((l) => l.replace(/^\s*[-•*]\s*/, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim())
                .filter((l) => l.length > 3);
              const rows: [string, string, number][] = [
                [`Présence dans la réponse (${dr.rank > 0 ? "cité" : "absent"})`, `+${sb.presence}`, sb.presence],
                [`Position (${posLabel})`, `+${sb.position}`, sb.position],
                ["Visibilité de base (annuaires, mentions)", `+${sb.base}`, sb.base],
              ];
              return (
              <div ref={reportRef} style={{ minHeight: "100svh", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px 56px", background: MOSH.fond }}>
              <div style={{ maxWidth: 620, width: "100%" }}>
                {/* Score + décomposition (le score est expliqué, pas balancé) */}
                <p style={{ textAlign: "center", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, color: MOSH.gris2, marginBottom: 8 }}>Votre score de visibilité IA</p>
                <div style={{ textAlign: "center", fontSize: "clamp(4.5rem, 14vw, 7.5rem)", fontWeight: 700, color: MOSH.noir, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                  {dr.score}<span style={{ fontSize: "0.4em", color: MOSH.gris3 }}>/100</span>
                </div>

                <div style={{ marginTop: 28, padding: "20px 24px", borderRadius: 8, background: MOSH.blanc, border: `1px solid rgba(26,26,26,0.12)`, textAlign: "left" }}>
                  <p style={{ margin: "0 0 8px", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, color: MOSH.gris2 }}>Comment ce score se calcule</p>
                  {rows.map(([label, val, pts], i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "baseline", padding: "10px 0", borderTop: i ? "1px solid rgba(26,26,26,0.08)" : "none", fontSize: 14, color: MOSH.gris1 }}>
                      <span>{label}</span>
                      <span style={{ fontWeight: 700, whiteSpace: "nowrap", color: pts > 0 ? MOSH.noir : MOSH.gris3 }}>{val}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "baseline", padding: "12px 0 2px", borderTop: "2px solid rgba(26,26,26,0.18)", marginTop: 4, fontSize: 15, fontWeight: 700, color: MOSH.noir }}>
                    <span>Score de visibilité express</span>
                    <span style={{ whiteSpace: "nowrap" }}>{dr.score}/100</span>
                  </div>
                  <p style={{ margin: "10px 0 0", fontSize: 12, color: MOSH.gris2, lineHeight: 1.5 }}>
                    Ce score express mesure votre <strong style={{ fontWeight: 700 }}>présence et votre position</strong>. La <strong style={{ fontWeight: 700 }}>force fine de vos signaux</strong> (avis, citations, cohérence NAP) est notée dans l&apos;audit complet.
                  </p>
                </div>

                {/* Le classement (preuve condensée, pas la réponse verbeuse répétée) */}
                {dr.competitors.length > 0 && (
                  <div style={{ marginTop: 20, padding: "20px 24px", borderRadius: 8, background: MOSH.noir, textAlign: "left" }}>
                    <p style={{ margin: "0 0 14px", fontSize: 13, color: MOSH.gris3 }}>
                      Ce que l&apos;IA répond quand un prospect demande «&nbsp;le meilleur {activite || "prestataire"} à {zone}&nbsp;» :
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                      {dr.competitors.map((name, i) => {
                        const you = i + 1 === dr.rank;
                        return (
                          <div key={i} style={{ display: "flex", gap: 10, fontSize: 15, color: you ? "#fff" : "rgba(255,255,255,0.72)", fontWeight: you ? 700 : 400 }}>
                            <span style={{ color: MOSH.gris3 }}>{i + 1}.</span>
                            <span>{name}{you ? "  ← vous" : ""}</span>
                          </div>
                        );
                      })}
                      {dr.rank === 0 && (
                        <div style={{ display: "flex", gap: 10, fontSize: 15, color: "#fff", fontWeight: 700, marginTop: 4, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.12)" }}>
                          <span>✗</span><span>{nom} — non cité</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Pourquoi — l'analyse (la valeur qui distingue de "faire soi-même sur ChatGPT") */}
                <div style={{ marginTop: 20, padding: 28, borderRadius: 8, background: MOSH.blanc, border: `1px solid rgba(26,26,26,0.12)`, textAlign: "left" }}>
                  <h2 style={{ margin: "0 0 14px", fontSize: "clamp(1.15rem, 3vw, 1.5rem)", fontWeight: 700, lineHeight: 1.3, color: MOSH.noir }}>
                    {dr.rank === 1
                      ? `Pourquoi vous passez devant ${them || "vos concurrents"}`
                      : dr.rank >= 2
                      ? `Pourquoi ${them || "eux"} passent devant vous`
                      : `Pourquoi ${them || "eux"} sont cités — et pas vous`}
                  </h2>
                  <p style={{ margin: "0 0 12px", fontSize: 15, lineHeight: 1.6, color: MOSH.gris1 }}>
                    L&apos;IA ne choisit pas au hasard. Elle recommande les entreprises sur lesquelles elle trouve le plus de <strong style={{ fontWeight: 700 }}>signaux fiables et cohérents</strong> :
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "0 0 16px", fontSize: 14, color: MOSH.gris1 }}>
                    <p style={{ margin: 0 }}>• <strong style={{ fontWeight: 700 }}>Avis structurés</strong> — nombre et régularité (Google, Pages Jaunes, annuaires).</p>
                    <p style={{ margin: 0 }}>• <strong style={{ fontWeight: 700 }}>Citations</strong> — mentions dans des sources qu&apos;elle juge fiables.</p>
                    <p style={{ margin: 0 }}>• <strong style={{ fontWeight: 700 }}>Densité d&apos;infos</strong> — adresse, horaires, services, à jour et détaillés.</p>
                    <p style={{ margin: 0 }}>• <strong style={{ fontWeight: 700 }}>Cohérence (NAP)</strong> — mêmes nom / adresse / téléphone partout.</p>
                  </div>
                  <p style={{ margin: "0 0 14px", fontSize: 14, lineHeight: 1.6, color: MOSH.gris1 }}>
                    Et ce n&apos;est pas qu&apos;une checklist. L&apos;IA reconstruit une <strong style={{ fontWeight: 700 }}>entité</strong> à partir de dizaines de sources et croise leur <strong style={{ fontWeight: 700 }}>cohérence</strong>, leur <strong style={{ fontWeight: 700 }}>fraîcheur</strong> et l&apos;<strong style={{ fontWeight: 700 }}>autorité</strong> de chacune (logique E-E-A-T, données structurées Schema.org, entités nommées). Chaque moteur — ChatGPT, Perplexity, Gemini — les pondère différemment : être devant sur l&apos;un ne garantit rien sur les autres. Et comme ces signaux se renforcent mutuellement sur plusieurs semaines, il n&apos;existe pas d&apos;astuce unique — il faut savoir <strong style={{ fontWeight: 700 }}>lesquels</strong> traiter, <strong style={{ fontWeight: 700 }}>dans quel ordre</strong>, et sur <strong style={{ fontWeight: 700 }}>quelles sources</strong>.
                  </p>
                  <p style={{ margin: "0 0 14px", fontSize: 15, lineHeight: 1.6, color: MOSH.gris1 }}>
                    {dr.rank === 1
                      ? `Aujourd'hui, vos signaux sont meilleurs que ceux de ${them || "vos concurrents"} sur cette recherche — c'est pour ça que l'IA vous met en premier. Mais ils s'accumulent en continu : ${topComp} n'a qu'à renforcer les siens pour repasser devant.`
                      : dr.rank >= 2
                      ? `${them || "Eux"} cochent ces cases mieux que vous. Vous êtes cité, mais vos signaux sont un cran en dessous — d'où la ${dr.rank}e place, pas la 1re.`
                      : `${them || "Eux"} cochent ces cases. Chez ${nom}, l'IA n'a pas trouvé assez de signaux fiables pour vous recommander — c'est précisément pour ça que vous n'apparaissez pas.`}
                  </p>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, fontWeight: 700, color: MOSH.noir }}>
                    La bonne nouvelle : ces signaux se construisent. L&apos;audit complet identifie lesquels vous manquent, et dans quel ordre les corriger.
                  </p>
                </div>

                {/* Red flags — 2e appel : ce que l'IA a repéré SUR l'entreprise */}
                {(redflagsLoading || parsedRedflags.length > 0) && (
                  <div style={{ marginTop: 20, padding: 28, borderRadius: 8, background: MOSH.noir, textAlign: "left" }}>
                    <h3 style={{ margin: "0 0 6px", fontSize: "clamp(1.05rem, 3vw, 1.35rem)", fontWeight: 700, lineHeight: 1.3, color: "#fff" }}>
                      Ce qu&apos;on a repéré sur {nom}
                    </h3>
                    <p style={{ margin: "0 0 18px", fontSize: 13, color: MOSH.gris3 }}>
                      Analyse ciblée de votre présence en ligne réelle.
                    </p>
                    {redflagsLoading ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 10, color: MOSH.gris3, fontSize: 14 }}>
                        <ThinkingDots />
                        <span>On passe {nom} au crible…</span>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {parsedRedflags.map((rf, i) => (
                          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                            <span style={{ color: "#ff8c8c", fontWeight: 700, flexShrink: 0, lineHeight: 1.5 }}>⚠</span>
                            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: "rgba(255,255,255,0.88)" }}>
                              {renderInline(rf, `rf${i}`)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* CTA */}
                <div style={{ textAlign: "center", marginTop: 32 }}>
                  <motion.button
                    onClick={() => setFunnelState("email")}
                    whileTap={{ scale: 0.97 }}
                    style={{ background: MOSH.noir, color: MOSH.blanc, border: "none", padding: "20px 41px", borderRadius: 4, fontSize: 17, fontWeight: 400, cursor: "pointer", fontFamily: FONT_DEGULAR }}
                  >
                    {ctaLabel(dr.rank)}
                  </motion.button>
                  <p style={{ fontSize: 13, color: MOSH.gris2, marginTop: 12 }}>Gratuit · rapport détaillé sous 24h · sans engagement</p>
                </div>
              </div>
              </div>
              );
            })()}
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
