"use client";
import { u } from "./tokens";

/**
 * Logo de la marque (Figma : logo_light, logo_dark, logo_mosh_footer).
 *
 * Assets exacts extraits des exports Figma :
 *  - variant "light"  → /logo-geosh-light.svg (encre #1A1A1A, fond clair)
 *  - variant "dark"   → /logo-geosh-dark.svg  (encre blanche, fond #1A1A1A)
 *  - variant "footer" → /logo-bas.svg         (logo "m( )sh", 80×21)
 *
 * Dimensions maquette : header 241×51.78 (le contenu visible "ge( )sh"
 * occupe la partie droite), footer 80×21. Par défaut, `height` reprend
 * ces valeurs via u() (échelle 1440).
 */
type LogoProps = {
  variant?: "light" | "dark" | "footer";
  height?: number | string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
};

const SRC = {
  light: "/logo-geosh-light.svg",
  dark: "/logo-geosh-dark.svg",
  footer: "/logo-bas.svg",
} as const;

const ALT = {
  light: "geosh — le GEO en plus mosh",
  dark: "geosh — le GEO en plus mosh",
  footer: "mosh",
} as const;

const DEFAULT_HEIGHT = {
  light: u(51.78),
  dark: u(51.78),
  footer: u(21),
} as const;

export default function Logo({
  variant = "light",
  height,
  alt,
  className,
  style,
}: LogoProps) {
  const h = height ?? DEFAULT_HEIGHT[variant];
  return (
    <img
      src={SRC[variant]}
      alt={alt ?? ALT[variant]}
      className={className}
      style={{
        height: typeof h === "number" ? `${h}px` : h,
        width: "auto",
        ...style,
      }}
    />
  );
}
