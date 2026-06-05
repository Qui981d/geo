"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BtnFaq } from "@/components/ui";

/**
 * Bloc 7 — Réassurance secondaire, en accordéon.
 * Chaque question est une pilule Figma `btn_faq` :
 *  - fermée → état Default/Hover
 *  - ouverte → état "Clic" (fond blanc) + réponse révélée.
 */
const ITEMS = [
  {
    q: "Qu'est-ce que le Generative Engine Optimization (GEO) ?",
    a: "Le GEO est la discipline qui consiste à optimiser votre marque, vos contenus et vos entités nommées pour être explicitement recommandé par les IA génératives (ChatGPT, Claude, Google Gemini, Perplexity) lorsqu'un utilisateur pose une question transactionnelle ou locale.",
  },
  {
    q: "Comment les intelligences artificielles choisissent-elles qui recommander ?",
    a: "Les modèles (LLMs) sélectionnent les entreprises en fonction de la densité sémantique (la richesse des informations publiques), les avis structurés, et la cohérence de vos entités nommées (NAP : Nom, Adresse, Téléphone).",
  },
  {
    q: "L'audit est-il vraiment gratuit ?",
    a: "Oui, le rapport initial est gratuit et sans engagement. Il comprend : l'analyse de votre présence IA, un score de visibilité, l'identification des concurrents qui vous supplantent, et les actions immédiates à mettre en place.",
  },
];

export default function FaqReassurance() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      className="py-20 px-6 max-w-4xl mx-auto"
      style={{ background: "#FFFFFF", color: "#555555" }}
    >
      <h2
        className="text-3xl font-bold mb-10 text-center"
        style={{ color: "#111111" }}
      >
        Ce que les IA regardent avant de vous citer
      </h2>

      <div className="space-y-4">
        {ITEMS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={i}>
              <BtnFaq
                active={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                style={{ width: "100%", justifyContent: "space-between", textAlign: "left", whiteSpace: "normal" }}
              >
                {item.q}
              </BtnFaq>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: "hidden" }}
                  >
                    <p style={{ padding: "16px 24px 4px", lineHeight: 1.6 }}>{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
