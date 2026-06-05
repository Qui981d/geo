"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MOSH, FONT_DEGULAR } from "./tokens";

/**
 * Bouton "test" (Figma : btn_test_1 / btn_test_2).
 *
 * Comportement fidèle à la maquette : au survol, le bouton change de texte
 * ET d'apparence — fond noir → fond blanc bordé, et le libellé devient
 * "mais j'ai peur".
 *
 *  - variant "1" → "Dans le doute je fais le test"
 *  - variant "2" → "J'ai compris, je fais le test"
 */
type BtnTestProps = {
  variant?: "1" | "2";
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  style?: React.CSSProperties;
};

const LABELS: Record<"1" | "2", string> = {
  "1": "Dans le doute je fais le test",
  "2": "J’ai compris, je fais le test",
};

export default function BtnTest({
  variant = "1",
  onClick,
  type = "button",
  className,
  style,
}: BtnTestProps) {
  const [hover, setHover] = useState(false);

  return (
    <motion.button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      whileTap={{ scale: 0.97 }}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 24,
        paddingBottom: 24,
        paddingLeft: hover ? 56 : 40,
        paddingRight: hover ? 56 : 40,
        borderRadius: 4,
        background: hover ? MOSH.blanc : MOSH.noir,
        border: hover ? `2px solid ${MOSH.noir}` : "2px solid transparent",
        color: hover ? MOSH.noir : MOSH.blanc,
        fontFamily: FONT_DEGULAR,
        fontSize: 20,
        lineHeight: 1.1,
        fontWeight: 400,
        textAlign: "center",
        whiteSpace: "nowrap",
        cursor: "pointer",
        transition: "background 0.2s, color 0.2s, padding 0.2s, border-color 0.2s",
        ...style,
      }}
    >
      {hover ? "mais j’ai peur" : LABELS[variant]}
    </motion.button>
  );
}
