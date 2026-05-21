'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LeadGateModal from '../LeadGateModal';

/* ── Palette ── */
const G = {
  bg: '#212121',
  userMsg: '#2f2f2f',
  border: 'rgba(255,255,255,0.07)',
  text: '#ececec',
  muted: '#8e8ea0',
  green: '#10a37f',
  dim: 'rgba(255,255,255,0.25)',
};
const UI = "'Inter', -apple-system, sans-serif";

/* ── Types ── */
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/* ── OpenAI icon ── */
function OAIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 41 41" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-6.205-2.799 10.079 10.079 0 0 0-10.783 7.044 9.963 9.963 0 0 0-6.645 4.816 10.079 10.079 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 6.205 2.799 10.079 10.079 0 0 0 10.785-7.044 9.965 9.965 0 0 0 6.644-4.816 10.079 10.079 0 0 0-1.241-11.818zm-15.006 21.055a7.452 7.452 0 0 1-4.789-1.727l.239-.136 7.964-4.6a1.294 1.294 0 0 0 .655-1.134v-11.24l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.5 7.502zm-16.134-6.901a7.454 7.454 0 0 1-.894-5.023l.239.144 7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.242-2.747zm-2.09-17.438a7.482 7.482 0 0 1 3.908-3.285v9.458a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.012l-8.048-4.648a7.498 7.498 0 0 1-2.757-10.227zm27.658 6.437l-9.724-5.615 3.367-1.943a.121.121 0 0 1 .114-.012l8.048 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.647-1.13zm3.35-5.043l-.239-.144-7.964-4.6a1.297 1.297 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.048-4.648a7.498 7.498 0 0 1 11.138 7.769zm-21.063 6.929l-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756l-.239.136-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.003 11.223zm1.829-3.943l4.33-2.501 4.332 2.5v4.999l-4.331 2.5-4.331-2.5z" />
    </svg>
  );
}

/* ── Typing dots ── */
function Dots() {
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center', paddingTop: 4 }}>
      {[0, 1, 2].map(i => (
        <motion.div key={i}
          style={{ width: 7, height: 7, borderRadius: '50%', background: G.muted }}
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
          transition={{ duration: 0.75, repeat: Infinity, delay: i * 0.15 }} />
      ))}
    </div>
  );
}

/* ── Rich markdown renderer ── */
function renderInline(text: string, key: string) {
  const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return tokens.map((tok, i) => {
    if (tok.startsWith('**') && tok.endsWith('**')) {
      return (
        <strong key={`${key}-b${i}`} style={{ color: G.text, fontWeight: 700 }}>
          {tok.slice(2, -2)}
        </strong>
      );
    }
    if (tok.startsWith('`') && tok.endsWith('`')) {
      const label = tok.slice(1, -1);
      return (
        <span key={`${key}-badge${i}`} style={{
          display: 'inline-block', marginLeft: 6, padding: '1px 7px',
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 4, fontSize: 10, color: G.muted, verticalAlign: 'middle',
          fontFamily: UI, letterSpacing: '0.02em',
        }}>
          {label}
        </span>
      );
    }
    return <span key={`${key}-t${i}`}>{tok}</span>;
  });
}

function RenderText({ text }: { text: string }) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    const key = `l${i}`;
    if (line.trim() === '') {
      elements.push(<div key={key} style={{ height: 6 }} />);
      return;
    }
    if (line.startsWith('## ') || line.startsWith('### ')) {
      const txt = line.replace(/^#{2,3}\s/, '');
      elements.push(
        <p key={key} style={{ margin: '12px 0 4px', fontSize: 13, fontWeight: 700,
          color: 'rgba(236,236,236,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {txt}
        </p>
      );
      return;
    }
    if (line.match(/^\*\*[^*]+\*\*$/) || line.match(/^\*\*[^*]+\*\*\s*$/)) {
      elements.push(
        <p key={key} style={{ margin: '12px 0 4px', fontSize: 14, fontWeight: 700, color: G.text }}>
          {renderInline(line, key)}
        </p>
      );
      return;
    }
    if (line.match(/^[•\-\*]\s/) || line.match(/^\d+\.\s/)) {
      const content = line.replace(/^[•\-\*\d\.]\s+/, '');
      elements.push(
        <div key={key} style={{ display: 'flex', gap: 8, marginBottom: 5, paddingLeft: 4 }}>
          <span style={{ color: G.muted, flexShrink: 0, marginTop: 1 }}>•</span>
          <span style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(236,236,236,0.82)' }}>
            {renderInline(content, key)}
          </span>
        </div>
      );
      return;
    }
    elements.push(
      <p key={key} style={{ margin: '0 0 4px', fontSize: 14, lineHeight: 1.7, color: 'rgba(236,236,236,0.82)' }}>
        {renderInline(line, key)}
      </p>
    );
  });

  return <div>{elements}</div>;
}

/* ── Bot message bubble ── */
function BotBubble({ content, isStreaming = false }: { content: string; isStreaming?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontFamily: UI }}>
      <div style={{ width: 28, height: 28, borderRadius: '50%', background: G.green,
        flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
        <OAIcon size={13} />
      </div>
      <div style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(236,236,236,0.85)',
        paddingTop: 4, maxWidth: 560, flex: 1 }}>
        <RenderText text={content} />
        {isStreaming && <span style={{ opacity: 0.5, marginLeft: 1 }}>|</span>}
      </div>
    </motion.div>
  );
}

/* ── User message bubble ── */
function UserBubble({ content }: { content: string }) {
  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
      style={{ display: 'flex', justifyContent: 'flex-end', fontFamily: UI }}>
      <div style={{ background: G.userMsg, border: `1px solid ${G.border}`,
        borderRadius: '18px 18px 4px 18px', padding: '10px 16px',
        maxWidth: 360, fontSize: 14, color: G.text, lineHeight: 1.55 }}>
        {content}
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════ */
export default function ImmersiveChatHero({ splashDone }: { splashDone: boolean }) {

  
  // Conversational state machine
  const [step, setStep] = useState<'init' | 'ask_sector' | 'ask_city' | 'ask_company' | 'scanning' | 'chat'>('init');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [inputDisabled, setInputDisabled] = useState(true);
  
  // Collected data
  const [metier, setMetier] = useState('');
  const [ville, setVille] = useState('');
  const [company, setCompany] = useState('');
  
  // Chat states
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [scanFinished, setScanFinished] = useState(false);
  const [companyFound, setCompanyFound] = useState(false);
  
  // Framing screen
  const [framingExiting, setFramingExiting] = useState(false);
  const [framingDone, setFramingDone] = useState(false);

  // Lead Gate
  const [isLeadGateOpen, setIsLeadGateOpen] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      const el = chatContainerRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    }, 60);
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, streamingContent, isThinking]);

  // Initial greeting + framing screen timing
  useEffect(() => {
    if (!splashDone || step !== 'init') return;

    // Framing exit: slide-up starts at 3200ms (gives ~2.5s reading time after last element)
    const tExit = setTimeout(() => setFramingExiting(true), 3200);
    // Framing fully gone at 3700ms (after 500ms slide animation)
    const tDone = setTimeout(() => setFramingDone(true), 3700);

    setIsThinking(true);
    const tGreet = setTimeout(() => {
      setIsThinking(false);
      setMessages([{ role: 'assistant', content: "Bonjour 👋\nJe suis l'IA de diagnostic Local Boost.\n\nAvant de lancer mon analyse, **quel est votre secteur d'activité ?**" }]);
      setStep('ask_sector');
      setInputDisabled(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }, 3900);

    return () => { clearTimeout(tExit); clearTimeout(tDone); clearTimeout(tGreet); };
  }, [splashDone, step]);

  const handleSubmit = () => {
    const text = inputValue.trim();
    if (!text || inputDisabled) return;
    
    setInputValue('');
    setInputDisabled(true);

    if (step === 'ask_sector') {
      setMetier(text);
      setMessages(prev => [...prev, { role: 'user', content: text }]);
      setIsThinking(true);
      
      setTimeout(() => {
        setIsThinking(false);
        setMessages(prev => [...prev, { role: 'assistant', content: `C'est noté. Et **dans quelle ville exercez-vous ?**` }]);
        setStep('ask_city');
        setInputDisabled(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }, 1000);
      
    } else if (step === 'ask_city') {
      setVille(text);
      setMessages(prev => [...prev, { role: 'user', content: text }]);
      setIsThinking(true);
      
      setTimeout(() => {
        setIsThinking(false);
        setMessages(prev => [...prev, { role: 'assistant', content: `Parfait. Et pour finir, **quel est le nom de votre entreprise ?**` }]);
        setStep('ask_company');
        setInputDisabled(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }, 1000);
      
    } else if (step === 'ask_company') {
      setCompany(text);
      setMessages(prev => [...prev, { role: 'user', content: text }]);
      setStep('scanning');
      setIsThinking(true);
      
      setTimeout(() => {
        setIsThinking(false);
        setMessages(prev => [...prev, { role: 'assistant', content: `Parfait ! Je recherche les meilleurs **${metier}** à **${ville}**...\n\nJe vais vérifier si **${text}** fait partie de mes recommandations.` }]);
        
        // Wait a bit for the scanning effect, then trigger API
        setTimeout(() => {
            setStep('chat');
            triggerApiCall(metier, ville, text);
        }, 3000);
      }, 1000);
    }
  };

  const triggerApiCall = async (finalMetier: string, finalVille: string, finalCompany: string) => {
    setIsThinking(true);
    setStreamingContent('');
    
    abortRef.current = new AbortController();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            messages: [{ role: 'user', content: `Recommande-moi le meilleur ${finalMetier} à ${finalVille}. L'entreprise ciblée est ${finalCompany}.` }],
            metier: finalMetier,
            ville: finalVille,
            company: finalCompany
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) throw new Error('API error');

      setIsThinking(false);
      setIsStreaming(true);

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const parsed = JSON.parse(line.slice(6));
              if (parsed.content) {
                fullContent += parsed.content;
                setStreamingContent(fullContent);
              }
            } catch {}
          }
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: fullContent }]);
      setStreamingContent('');
      setIsStreaming(false);

      // Check if the company name appears in the real ChatGPT response
      const found = finalCompany.length > 2 && fullContent.toLowerCase().includes(finalCompany.toLowerCase());
      setCompanyFound(found);

      // STEP 2 — After a pause, inject the verdict + technical analysis
      setTimeout(() => {
        const verdictMsg = found
          ? `✅ **${finalCompany}** apparaît dans mes recommandations — c'est un bon signal.

Mais attention : être cité ne suffit pas. Pour **verrouiller la première position**, les IA évaluent en permanence plusieurs signaux techniques :

• **Analyse vectorielle de pertinence sémantique** (Embeddings spatiaux)
• **Densité des Entités Nommées Locales** (NEL — Named Entity Linking)
• **Intégrité du Knowledge Graph** (balisage Schema.org)
• **Signaux d'autorité E-E-A-T** perçus via le NLP
• **Vélocité et sentiment-scoring** de vos avis clients
• **Cohérence NAP** (Nom, Adresse, Téléphone) cross-plateformes

Si un seul de ces paramètres est défaillant, un concurrent mieux optimisé prendra votre place au prochain cycle d'indexation.`
          : `❌ **${finalCompany}** n'apparaît pas dans mes recommandations.

Voici pourquoi. Les IA comme moi sélectionnent les entreprises à recommander en analysant plusieurs paramètres techniques en temps réel :

• **Analyse vectorielle de pertinence sémantique** (Embeddings spatiaux)
• **Densité des Entités Nommées Locales** (NEL — Named Entity Linking)
• **Intégrité du Knowledge Graph** (balisage Schema.org)
• **Signaux d'autorité E-E-A-T** perçus via le NLP
• **Vélocité et sentiment-scoring** de vos avis clients
• **Cohérence NAP** (Nom, Adresse, Téléphone) cross-plateformes

Actuellement, l'architecture de données de **${finalCompany}** ne satisfait pas suffisamment ces critères pour déclencher une recommandation algorithmique.`;

        setMessages(prev => [...prev, { role: 'assistant', content: verdictMsg }]);

        // STEP 3 — Show the humorous CTA
        setTimeout(() => {
          setScanFinished(true);
        }, 2000);
      }, 1500);

    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setIsThinking(false);
      setIsStreaming(false);
    }
  };

  const onLeadGateComplete = (data: any) => {
      setIsLeadGateOpen(false);
      localStorage.setItem("localBoost_leadData", JSON.stringify({ ...data, metier, ville, company }));
  };

  if (!splashDone) return null;

  return (
    <section style={{ height: '100vh', background: '#111',
      display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

        {/* ── GEO MODE ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

            {/* ── FRAMING SCREEN — plays during the first 2s dead time ── */}
            {!framingDone && (
              <motion.div
                style={{
                  position: 'absolute', inset: 0, zIndex: 50,
                  background: '#0d0d0d',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  padding: '0 32px',
                  textAlign: 'center',
                }}
                animate={framingExiting ? { y: '-100%' } : { y: '0%' }}
                transition={framingExiting
                  ? { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
                  : { duration: 0 }
                }
              >
                {/* ── 3 headline lines ── */}
                {([
                  { text: 'EN CE MOMENT,',              teal: false, size: 'clamp(1.6rem, 3.5vw, 3rem)',   delay: 0.05 },
                  { text: "UN CONCURRENT VIENT D'ÊTRE", teal: false, size: 'clamp(2.2rem, 5.5vw, 5rem)',   delay: 0.22 },
                  { text: 'RECOMMANDÉ À VOS CLIENTS.',  teal: true,  size: 'clamp(2.2rem, 5.5vw, 5rem)',   delay: 0.39 },
                ] as const).map(({ text, teal, size, delay }) => (
                  <motion.p
                    key={text}
                    style={{
                      fontFamily: "'Bebas Neue', var(--font-bebas), 'Arial Black', sans-serif",
                      fontSize: size,
                      letterSpacing: '0.04em',
                      lineHeight: 0.95,
                      color: teal ? '#44e1c8' : '#ffffff',
                      marginBottom: '0.06em',
                    }}
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {text}
                  </motion.p>
                ))}

                {/* ── Subtitle ── */}
                <motion.p
                  style={{
                    fontFamily: "'Courier Prime', var(--font-courier), 'Courier New', monospace",
                    fontSize: '11px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.6)',
                    marginTop: 28,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.62 }}
                >
                  par ChatGPT · Perplexity · Google Gemini
                </motion.p>

                {/* ── Teal progress bar at bottom ── */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.04)' }}>
                  <motion.div
                    style={{ height: '100%', background: '#44e1c8', transformOrigin: 'left' }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.4, delay: 0.1, ease: 'linear' }}
                  />
                </div>
              </motion.div>
            )}

            {/* ── macOS window chrome ── */}
            <div style={{ borderBottom: `1px solid ${G.border}`, padding: '12px 24px',
              display: 'flex', alignItems: 'center', gap: 12, background: '#0d0d0d',
              flexShrink: 0, fontFamily: UI }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['#FF5F57', '#FFBD2E', '#28C840'].map((c, i) => (
                  <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: c, opacity: 0.85 }} />
                ))}
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: G.green,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <OAIcon size={11} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: G.text }}>ChatGPT</span>
                <span style={{ fontSize: 11, color: G.muted }}>4o · GEO Visibility Diagnostic</span>
              </div>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <motion.div style={{ width: 6, height: 6, borderRadius: '50%', background: G.green }}
                  animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                <span style={{ fontSize: 11, color: G.muted }}>Live</span>
              </div>
            </div>

            {/* ── Chat Content Area ── */}
            <div ref={chatContainerRef} style={{ flex: 1, overflowY: 'auto', position: 'relative', scrollBehavior: 'smooth' }}>
                <div style={{ padding: '28px 24px', maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <AnimatePresence>
                        {messages.map((msg, i) => {
                            return msg.role === 'assistant'
                            ? <BotBubble key={i} content={msg.content} />
                            : <UserBubble key={i} content={msg.content} />
                        })}
                        {isThinking && (
                            <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                <div style={{ width: 28, height: 28, borderRadius: '50%', background: G.green, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <OAIcon size={13} />
                                </div>
                                <Dots />
                            </motion.div>
                        )}
                        {isStreaming && streamingContent && (
                            <BotBubble key="streaming" content={streamingContent} isStreaming />
                        )}
                    </AnimatePresence>
                    
                    {scanFinished && (
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.3 }}
                            style={{
                                marginTop: 16, padding: '24px', borderRadius: 16,
                                background: 'rgba(16,163,127,0.06)',
                                border: '1px solid rgba(16,163,127,0.15)',
                                textAlign: 'center', fontFamily: UI
                            }}>
                            <p style={{ fontSize: 22, marginBottom: 8 }}>😂</p>
                            <p style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 12 }}>
                                Vous n&apos;avez rien compris ?
                            </p>
                            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', marginBottom: 20, lineHeight: 1.6 }}>
                                Pas de panique, nous non plus au début ! <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Embeddings spatiaux, NEL, Knowledge Graph</strong>... c&apos;est notre métier, pas le vôtre.
                            </p>
                            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 24, lineHeight: 1.5 }}>
                                {companyFound
                                    ? "Vous êtes visible, mais on peut vous mettre en première position partout. Demandez votre audit complet."
                                    : "C'est exactement pour ça que notre équipe est là. On s'occupe de tout et on vous explique simplement comment devenir la recommandation #1."
                                }
                            </p>
                            <button onClick={() => setIsLeadGateOpen(true)}
                                style={{
                                    background: G.green, color: 'white', border: 'none', padding: '14px 28px',
                                    borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer',
                                    boxShadow: '0 4px 14px rgba(16,163,127,0.3)', transition: 'transform 0.2s'
                                }}
                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                {companyFound ? 'Vérifier mon classement complet' : 'Demander mon Audit GEO Gratuit'}
                            </button>
                            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 14, letterSpacing: '0.05em' }}>
                                Gratuit · Sans engagement · On vous explique tout simplement
                            </p>
                        </motion.div>
                    )}

                    <div style={{ height: 1, flexShrink: 0 }} />
                </div>
            </div>

            {/* Lead Gate Overlay */}
            <LeadGateModal isOpen={isLeadGateOpen} onComplete={onLeadGateComplete} />

            {/* ── Input bar ── */}
            <div style={{ borderTop: `1px solid ${G.border}`, padding: '14px 24px',
              background: '#0d0d0d', flexShrink: 0, maxWidth: 720, margin: '0 auto', width: '100%', opacity: step === 'chat' || step === 'scanning' ? 0.5 : 1 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input 
                  ref={inputRef}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  disabled={inputDisabled}
                  placeholder={
                      step === 'ask_sector' ? "Ex: Plombier, Architecte, Avocat..." :
                      step === 'ask_city' ? "Ex: Paris, Lyon, Genève..." :
                      step === 'ask_company' ? "Nom de votre entreprise..." :
                      "Analyse en cours..."
                  }
                  style={{
                    flex: 1, background: inputDisabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${inputDisabled ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.15)'}`,
                    borderRadius: 12, padding: '12px 16px', fontSize: 14, color: G.text,
                    outline: 'none', fontFamily: UI, cursor: inputDisabled ? 'not-allowed' : 'text',
                    transition: 'all 0.2s'
                  }} />
                <button 
                  onClick={handleSubmit}
                  disabled={inputDisabled || !inputValue.trim()}
                  style={{
                    padding: '11px 20px', borderRadius: 10,
                    background: (!inputDisabled && inputValue.trim()) ? G.green : 'rgba(255,255,255,0.06)',
                    border: 'none', color: 'white', fontSize: 13, fontWeight: 600,
                    cursor: (!inputDisabled && inputValue.trim()) ? 'pointer' : 'not-allowed', 
                    fontFamily: UI, flexShrink: 0, transition: 'all 0.2s'
                  }}>
                  ↑
                </button>
              </div>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.12)', textAlign: 'center',
                marginTop: 8, fontFamily: UI, letterSpacing: '0.02em' }}>
                Propulsé par GPT-4o · Vos données ne sont pas stockées
              </p>
            </div>

        </div>
    </section>
  );
}
