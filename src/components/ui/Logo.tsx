"use client";
import { useState } from "react";
import { MOSH, u } from "./tokens";
import {
  LOGO_VIEWBOX,
  GE_SHIFT,
  PATH_CLOSE,
  PATH_S,
  PATH_H,
  PATH_TAGLINE,
  PATH_G,
  PATH_E,
  PATH_OPEN,
} from "./logoPaths";

/**
 * Logo de la marque "ge( )sh".
 *
 * Le "o" de "geosh" est une paire de parenthèses. Au survol, elles s'OUVRENT
 * (le "ge(" glisse vers la gauche, le ")sh" reste fixe) et la signature
 * « le GEO en plus mosh » apparaît entre elles — comme le titre du hero.
 *
 * On dessine UN seul SVG avec les tracés EXACTS de l'export Figma (police
 * Degular, qu'on ne peut pas reproduire en texte). Trois groupes :
 *  - ")sh"   : fixe (bord droit).
 *  - signature : opacité 0 → 1.
 *  - "ge("   : translaté de +153u au repos (resserré) → 0 au survol (ouvert).
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

// Échelle 1440 : hauteur du sigle et largeur visible au repos ("ge( )sh").
const REST_H = 51.78;
const REST_W = 161.515;

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
  const boxH = typeof height === "number" ? `${height}px` : height ?? u(REST_H);

  return (
    <div
      className={className}
      role="img"
      aria-label={alt ?? ALT}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "absolute",
        height: boxH,
        width: u(REST_W),
        overflow: "visible",
        color: ink,
        cursor: "default",
        ...style,
      }}
    >
      <svg
        viewBox={LOGO_VIEWBOX}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          height: "100%",
          width: "auto",
          overflow: "visible",
        }}
      >
        {/* ")sh" — fixe */}
        <path d={PATH_CLOSE} />
        <path d={PATH_S} />
        <path d={PATH_H} />

        {/* Signature — apparaît au survol */}
        <g style={{ opacity: hover ? 1 : 0, transition: "opacity 0.3s ease" }}>
          <path d={PATH_TAGLINE} />
        </g>

        {/* "ge(" — glisse vers la gauche au survol (parenthèse qui s'ouvre) */}
        <g
          style={{
            transform: hover ? "translateX(0px)" : `translateX(${GE_SHIFT}px)`,
            transition: "transform 0.4s ease",
          }}
        >
          <path d={PATH_G} />
          <path d={PATH_E} />
          <path d={PATH_OPEN} />
        </g>
      </svg>
    </div>
  );
}
