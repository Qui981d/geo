"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LeadGateModalProps {
    isOpen: boolean;
    onComplete: (data: any) => void;
}

export default function LeadGateModal({ isOpen, onComplete }: LeadGateModalProps) {
    const [data, setData] = useState({ firstName: "", company: "", email: "", phone: "" });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate saving to DB
        setTimeout(() => {
            setIsLoading(false);
            onComplete(data);
        }, 800);
    };

    const INP: React.CSSProperties = {
        width: "100%",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "10px",
        padding: "13px 16px",
        color: "white",
        fontSize: "14px",
        fontFamily: "'Inter', sans-serif",
        outline: "none",
        transition: "border-color 0.2s, background 0.2s",
    };

    const LABEL: React.CSSProperties = {
        display: "block",
        fontSize: "11px",
        fontWeight: 600,
        color: "rgba(255,255,255,0.4)",
        marginBottom: "6px",
        letterSpacing: "0.03em",
        fontFamily: "'Inter', sans-serif",
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)" }}
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        style={{
                            background: "#111",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "16px",
                            padding: "32px",
                            width: "100%",
                            maxWidth: "440px",
                            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8), 0 0 0 1px rgba(16,163,127,0.1)",
                        }}
                    >
                        {/* Header */}
                        <div style={{ textAlign: "center", marginBottom: "28px" }}>
                            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(16,163,127,0.1)", color: "#10a37f", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <h3 style={{ fontSize: "22px", fontWeight: 700, color: "white", marginBottom: "8px", fontFamily: "'Inter', sans-serif" }}>
                                Obtenez votre Audit GEO
                            </h3>
                            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
                                Remplissez ce formulaire et notre équipe vous contacte sous 24h avec une analyse complète de votre visibilité IA.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                {/* Prénom */}
                                <div>
                                    <label style={LABEL}>Prénom</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Votre prénom"
                                        value={data.firstName}
                                        onChange={e => setData({ ...data, firstName: e.target.value })}
                                        style={INP}
                                        autoFocus
                                        autoComplete="given-name"
                                        onFocus={e => { e.currentTarget.style.borderColor = "rgba(16,163,127,0.4)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                                        onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                                    />
                                </div>

                                {/* Nom de l'entreprise */}
                                <div>
                                    <label style={LABEL}>Nom de l&apos;entreprise</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Ex: Plomberie Dupont SA"
                                        value={data.company}
                                        onChange={e => setData({ ...data, company: e.target.value })}
                                        style={INP}
                                        autoComplete="organization"
                                        onFocus={e => { e.currentTarget.style.borderColor = "rgba(16,163,127,0.4)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                                        onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label style={LABEL}>Email professionnel</label>
                                    <input
                                        required
                                        type="email"
                                        placeholder="vous@entreprise.com"
                                        value={data.email}
                                        onChange={e => setData({ ...data, email: e.target.value })}
                                        style={INP}
                                        autoComplete="email"
                                        onFocus={e => { e.currentTarget.style.borderColor = "rgba(16,163,127,0.4)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                                        onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                                    />
                                </div>

                                {/* Téléphone */}
                                <div>
                                    <label style={LABEL}>Téléphone</label>
                                    <input
                                        required
                                        type="tel"
                                        placeholder="+33 6 12 34 56 78"
                                        value={data.phone}
                                        onChange={e => setData({ ...data, phone: e.target.value })}
                                        style={INP}
                                        autoComplete="tel"
                                        onFocus={e => { e.currentTarget.style.borderColor = "rgba(16,163,127,0.4)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                                        onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                style={{
                                    width: "100%", background: "#10a37f", color: "white", border: "none",
                                    padding: "14px", borderRadius: "10px", fontWeight: 600, fontSize: "15px",
                                    cursor: isLoading ? "not-allowed" : "pointer", marginTop: "24px",
                                    display: "flex", justifyContent: "center", alignItems: "center",
                                    transition: "opacity 0.2s, transform 0.2s",
                                    boxShadow: "0 4px 14px rgba(16,163,127,0.3)",
                                }}
                                onMouseOver={e => { if (!isLoading) { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "scale(1.01)"; } }}
                                onMouseOut={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
                            >
                                {isLoading ? (
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%" }} />
                                ) : "Recevoir mon Audit GEO Gratuit →"}
                            </button>

                            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: "14px", lineHeight: 1.4 }}>
                                🔒 Vos données restent confidentielles. Notre équipe vous contacte sous 24h pour votre appel stratégique offert.
                            </p>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
