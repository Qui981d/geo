"use client";
import { useState } from "react";
import { MOSH, FONT_DEGULAR, u } from "./tokens";

/**
 * Bouton FAQ pilule (Figma : btn_faq + pages test_*_faq).
 * Mesures exactes : hauteur 34, radius 17, padding horizontal 24.5, texte ~14.
 * 3 états :
 *  - Default : fond gris clair (#8C8C8C), texte noir
 *  - Hover   : fond gris moyen (#6C6C6C), texte blanc
 *  - Actif   : fond blanc, texte noir
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
        height: u(34),
        paddingLeft: u(24.5),
        paddingRight: u(24.5),
        borderRadius: u(17),
        background: bg,
        color,
        border: "none",
        fontFamily: FONT_DEGULAR,
        fontSize: u(14),
        lineHeight: 1,
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
