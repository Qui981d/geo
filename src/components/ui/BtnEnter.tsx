"use client";
import { useState } from "react";
import { MOSH } from "./tokens";

/**
 * Bouton d'envoi circulaire (Figma : btn_enter).
 * 3 états :
 *  - Default  : cercle blanc, flèche noire
 *  - Hover    : cercle blanc plein (légèrement plus grand)
 *  - Disabled : cercle gris (#8c8c8c), flèche atténuée, non cliquable
 */
type BtnEnterProps = {
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
};

function ArrowUp({ color }: { color: string }) {
  // Flèche "vers le haut" ~12×13 (d'après le vecteur Figma).
  return (
    <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M6 12.5V1.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M1 6L6 1L11 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BtnEnter({
  onClick,
  disabled = false,
  type = "button",
  ariaLabel = "Envoyer",
  className,
  style,
}: BtnEnterProps) {
  const [hover, setHover] = useState(false);

  const bg = disabled ? MOSH.gris3 : MOSH.blanc;
  const arrowColor = disabled ? "rgba(255,255,255,0.85)" : MOSH.noir;
  // Hover : le cercle occupe tout le gabarit (inset 0) ; sinon léger retrait (inset 5%).
  const inset = disabled ? "5%" : hover ? "0" : "5%";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={className}
      style={{
        position: "relative",
        width: 40,
        height: 40,
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        flexShrink: 0,
        ...style,
      }}
    >
      <span
        style={{
          position: "absolute",
          inset,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: bg,
          borderRadius: 40,
          boxShadow: disabled ? "none" : "0 1px 4px rgba(0,0,0,0.12)",
          transition: "inset 0.18s ease, background 0.2s",
        }}
      >
        <ArrowUp color={arrowColor} />
      </span>
    </button>
  );
}
