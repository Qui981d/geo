"use client";
import { useState } from "react";
import { MOSH, FONT_DEGULAR, u } from "./tokens";

/**
 * Logo de la marque "ge( )sh".
 *
 * Le "o" de "geosh" est remplacé par une paire de parenthèses — exactement
 * comme le titre du hero ("tr( … )uve"). Au survol, les parenthèses s'ouvrent
 * et logent la signature « le GEO en plus mosh » entre elles.
 *
 * Géométrie Figma (logo_dark / logo_light) :
 *  - le ")sh" est à la MÊME position dans les deux états (s≈x281, h≈x308) :
 *    il reste fixe. Seul "ge(" glisse vers la gauche et la signature apparaît.
 *  - le logo header est ancré en haut à DROITE → il s'ouvre vers la gauche.
 *  - boîte du sigle ~51.78 de haut (échelle 1440), signature ~167 de large.
 *
 *  - variant "light" → encre #1A1A1A (fond clair)
 *  - variant "dark"  → encre blanche (fond #1A1A1A)
 *  - variant "footer" → image "m( )sh" (80×21), inchangé
 */
type LogoProps = {
  variant?: "light" | "dark" | "footer";
  height?: number | string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
};

const ALT = "geosh — le GEO en plus mosh";

export default function Logo({
  variant = "light",
  height,
  alt,
  className,
  style,
}: LogoProps) {
  const [hover, setHover] = useState(false);

  // Footer : asset image inchangé.
  if (variant === "footer") {
    const h = height ?? u(21);
    return (
      <img
        src="/logo-bas.svg"
        alt={alt ?? "mosh"}
        className={className}
        style={{ height: typeof h === "number" ? `${h}px` : h, width: "auto", ...style }}
      />
    );
  }

  const ink = variant === "dark" ? MOSH.blanc : MOSH.noir;

  return (
    <div
      className={className}
      aria-label={alt ?? ALT}
      role="img"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "flex-end",
        height: typeof height === "number" ? `${height}px` : height ?? u(51.78),
        color: ink,
        fontFamily: FONT_DEGULAR,
        fontWeight: 400,
        lineHeight: 1,
        whiteSpace: "nowrap",
        cursor: "default",
        userSelect: "none",
        ...style,
      }}
    >
      <span aria-hidden style={{ fontSize: u(50) }}>ge(</span>

      {/* Signature révélée au survol entre les parenthèses */}
      <span
        aria-hidden
        style={{
          display: "inline-block",
          overflow: "hidden",
          // Au repos : écart ~33u entre "(" et ")" (cf. export Figma, "(" à
          // x228 et ")" à x270). Au survol : place pour la signature (~170u).
          maxWidth: hover ? u(170) : u(33),
          opacity: hover ? 1 : 0,
          marginLeft: hover ? u(7) : 0,
          marginRight: hover ? u(7) : 0,
          fontSize: u(17),
          transition: "max-width 0.4s ease, opacity 0.3s ease, margin 0.4s ease",
          transform: "translateY(-0.06em)",
        }}
      >
        le GEO en plus mosh
      </span>

      <span aria-hidden style={{ fontSize: u(50) }}>)sh</span>
    </div>
  );
}
