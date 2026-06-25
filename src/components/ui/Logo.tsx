"use client";
import { useState } from "react";
import { u } from "./tokens";

/**
 * Logo de la marque "ge( )sh".
 *
 * Le "o" de "geosh" est une paire de parenthèses. Au survol, elles s'ouvrent
 * et logent la signature « le GEO en plus mosh » — comme le titre du hero.
 *
 * IMPORTANT : on utilise les VRAIS vecteurs de l'export Figma (police Degular),
 * pas du texte vivant (la police n'est pas installée → les glyphes seraient
 * faux). Deux assets découpés depuis logo_light/logo_dark :
 *  - logo-rest-*  → "ge( )sh" resserré (la signature est masquée dans l'export)
 *  - logo-hover-* → "ge( le GEO en plus mosh )sh" déployé
 * Le ")sh" est au même endroit (même bord droit de viewBox) dans les deux états,
 * donc en alignant les deux assets à DROITE, seul "ge(" + la signature changent.
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

// Hauteur (échelle 1440) et largeur du sigle au repos (ratio viewBox 161.515/51.78).
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

  const rest = `/logo-rest-${variant}.svg`;
  const hovered = `/logo-hover-${variant}.svg`;
  const boxH = typeof height === "number" ? `${height}px` : height ?? u(REST_H);

  const imgBase: React.CSSProperties = {
    position: "absolute",
    top: 0,
    right: 0,
    height: "100%",
    width: "auto",
    transition: "opacity 0.3s ease",
  };

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
        ...style,
      }}
    >
      <img src={rest} alt="" aria-hidden style={{ ...imgBase, opacity: hover ? 0 : 1 }} />
      <img src={hovered} alt="" aria-hidden style={{ ...imgBase, opacity: hover ? 1 : 0 }} />
    </div>
  );
}
