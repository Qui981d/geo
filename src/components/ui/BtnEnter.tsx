"use client";
import { useState } from "react";
import { MOSH, u } from "./tokens";

/**
 * Bouton d'envoi circulaire (Figma : btn_enter).
 * Mesures exactes : cercle 36 (hover 40), flèche 12×13.
 * 3 états :
 *  - Default  : cercle blanc, flèche noire (#1A1A1A)
 *  - Hover    : même chose, cercle 40
 *  - Disabled : cercle gris (#8C8C8C), flèche gris foncé (#3A3A3A)
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
  // Flèche exacte de la maquette (12×13, pleine).
  return (
    <svg
      viewBox="0 0 12 13"
      style={{ width: u(12), height: u(13) }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M5 13V3.8L1.4 7.4L0 6L6 0L12 6L10.6 7.4L7 3.8V13H5Z" fill={color} />
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
  const arrowColor = disabled ? MOSH.gris1 : MOSH.noir;
  // Hover : le cercle passe de 36 à 40 (gabarit constant de 40).
  const inset = !disabled && hover ? "0" : "5%";

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
        width: u(40),
        height: u(40),
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
          borderRadius: "50%",
          transition: "inset 0.18s ease, background 0.2s",
        }}
      >
        <ArrowUp color={arrowColor} />
      </span>
    </button>
  );
}
