"use client";

/**
 * Logo de la marque (Figma : logo_light, logo_dark, logo_mosh_footer).
 *
 * Réutilise les SVG déjà présents dans /public :
 *  - variant "light"  → logo-haut.svg  (logo "ge…sh" sombre, pour fond clair)
 *  - variant "footer" → logo-bas.svg   (logo "mosh" du pied de page)
 *  - variant "dark"   → logo-haut.svg inversé (pour fond sombre)
 *
 * `height` pilote la taille (largeur auto). Accepte une valeur CSS
 * (ex: number en px, ou "clamp(40px, 6vw, 60px)").
 */
type LogoProps = {
  variant?: "light" | "dark" | "footer";
  height?: number | string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
};

const SRC = {
  light: "/logo-haut.svg",
  dark: "/logo-haut.svg",
  footer: "/logo-bas.svg",
} as const;

const ALT = {
  light: "geosh — le GEO en plus mosh",
  dark: "geosh — le GEO en plus mosh",
  footer: "mosh",
} as const;

export default function Logo({
  variant = "light",
  height = "clamp(40px, 6vw, 60px)",
  alt,
  className,
  style,
}: LogoProps) {
  return (
    <img
      src={SRC[variant]}
      alt={alt ?? ALT[variant]}
      className={className}
      style={{
        height: typeof height === "number" ? `${height}px` : height,
        width: "auto",
        // Variante sombre : inversion best-effort pour un fond foncé.
        filter: variant === "dark" ? "invert(1)" : undefined,
        ...style,
      }}
    />
  );
}
