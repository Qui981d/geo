"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuditForm() {
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
        <section className="relative py-32 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Section label */}
                <motion.div
                    className="flex items-center gap-4 mb-16"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <span className="text-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: "var(--color-gold)" }}>
                        06
                    </span>
                    <div className="h-px flex-1" style={{ background: "var(--color-white-10)" }} />
                    <span className="text-mono text-[11px] tracking-[0.15em] uppercase" style={{ color: "var(--color-white-30)" }}>
                        Votre audit gratuit
                    </span>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-16 items-start">
                    {/* Title side */}
                    <div>
                        <motion.h2
                            className="text-display mb-6"
                            style={{ fontSize: "clamp(36px, 7vw, 80px)" }}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            Prêt à
                            <br />
                            <span className="glow-gold" style={{ color: "var(--color-gold)" }}>
                                dominer ?
                            </span>
                        </motion.h2>

                        <motion.p
                            className="text-lg mb-8"
                            style={{ color: "var(--color-white-30)" }}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            Recevez un audit complet de votre présence locale en 48h. Gratuit, sans engagement.
                        </motion.p>

                        {/* Trust signals */}
                        <div className="space-y-3">
                            {["Analyse complète de votre fiche", "Rapport de positionnement", "Recommandations personnalisées"].map(
                                (item, i) => (
                                    <motion.div
                                        key={i}
                                        className="flex items-center gap-3"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 + i * 0.1 }}
                                    >
                                        <span className="text-mono text-[10px]" style={{ color: "var(--color-gold)" }}>✓</span>
                                        <span className="text-sm" style={{ color: "var(--color-white-60)" }}>{item}</span>
                                    </motion.div>
                                )
                            )}
                        </div>
                    </div>

                    {/* Form */}
                    <AnimatePresence mode="wait">
                        {!submitted ? (
                            <motion.form
                                key="form"
                                onSubmit={handleSubmit}
                                className="glass-dark p-8 rounded-2xl space-y-5"
                                style={{ border: "1px solid var(--color-white-10)" }}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                {/* Inputs */}
                                {[
                                    { label: "Nom", value: name, set: setName, placeholder: "Votre nom", type: "text" },
                                    { label: "Email", value: email, set: setEmail, placeholder: "votre@email.com", type: "email" },
                                    { label: "Commerce", value: business, set: setBusiness, placeholder: "Nom de votre commerce", type: "text" },
                                ].map((field) => (
                                    <div key={field.label}>
                                        <label className="block text-mono text-[10px] uppercase tracking-wider mb-2" style={{ color: "var(--color-white-30)" }}>
                                            {field.label}
                                        </label>
                                        <input
                                            type={field.type}
                                            value={field.value}
                                            onChange={(e) => field.set(e.target.value)}
                                            placeholder={field.placeholder}
                                            required
                                            className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all focus:border-[var(--color-gold)]"
                                            style={{
                                                background: "var(--color-white-05)",
                                                border: "1px solid var(--color-white-10)",
                                                color: "white",
                                                fontFamily: "var(--font-body)",
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
                                        background: "var(--color-gold)",
                                        color: "var(--color-bg)",
                                        fontFamily: "var(--font-display)",
                                        boxShadow: "0 4px 24px rgba(212,168,85,0.3)",
                                    }}
                                >
                                    Recevoir mon audit gratuit
                                </motion.button>

                                <p className="text-center text-mono text-[10px]" style={{ color: "var(--color-white-30)" }}>
                                    Aucun engagement · Résultat en 48h
                                </p>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="success"
                                className="glass-dark p-12 rounded-2xl text-center"
                                style={{ border: "1px solid rgba(212,168,85,0.2)" }}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {/* Gold check */}
                                <motion.div
                                    className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                                    style={{ background: "var(--color-gold-dim)", border: "2px solid var(--color-gold)" }}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                >
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <motion.path
                                            d="M5 13l4 4L19 7"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ delay: 0.5, duration: 0.4 }}
                                        />
                                    </svg>
                                </motion.div>

                                <h3 className="text-display text-2xl mb-2" style={{ color: "var(--color-gold)" }}>
                                    C&apos;est envoyé.
                                </h3>
                                <p className="text-sm" style={{ color: "var(--color-white-30)" }}>
                                    Notre équipe analyse votre commerce {business} et vous enverra votre audit à {email} sous 48h.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
