"use client";
import { useState } from "react";
import { MOSH, FONT_DEGULAR } from "./tokens";

/**
 * Bouton FAQ pilule (Figma : btn_faq).
 * 3 états :
 *  - Default : fond gris clair (#8c8c8c), texte noir
 *  - Hover   : fond gris moyen (#6c6c6c), texte blanc
 *  - Clic / actif : fond blanc, texte noir
 *
 * `active` force l'état "Clic" (utile pour un accordéon ouvert).
 */
type BtnFaqProps = {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export default function BtnFaq({
  children,
  onClick,
  active = false,
  className,
  style,
}: BtnFaqProps) {
  const [hover, setHover] = useState(false);

  const bg = active ? MOSH.blanc : hover ? MOSH.gris2 : MOSH.gris3;
  const color = hover && !active ? MOSH.blanc : MOSH.noir;

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 12,
        paddingBottom: 12,
        borderRadius: 20,
        background: bg,
        color,
        border: "none",
        fontFamily: FONT_DEGULAR,
        fontSize: 16,
        lineHeight: 1.3,
        fontWeight: 400,
        whiteSpace: "nowrap",
        cursor: "pointer",
        transition: "background 0.2s, color 0.2s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
