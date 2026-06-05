"use client";
import { MOSH, FONT_DEGULAR } from "./tokens";

/**
 * Case à cocher Oui / Non (Figma : check_box_oui_1/2, check_box_non_1/2).
 *
 * Un seul composant couvre les 4 frames de la maquette via 2 props :
 *  - `checked` : la case est sélectionnée → le smiley apparaît dans la case
 *                (sourire pour "oui", grimace pour "non").
 *  - `struck`  : le libellé est barré (cas où l'AUTRE option est choisie).
 *
 * Smileys réutilisés depuis /public : smiley-oui.svg & smiley-non.svg.
 */
type CheckboxProps = {
  type: "oui" | "non";
  checked?: boolean;
  struck?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
};

const LABELS = { oui: "Oui", non: "Non" } as const;
const SMILEYS = { oui: "/smiley-oui.svg", non: "/smiley-non.svg" } as const;

export default function Checkbox({
  type,
  checked = false,
  struck = false,
  onClick,
  className,
  style,
}: CheckboxProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
      aria-pressed={checked}
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "clamp(14px, 2vw, 24px)",
        cursor: "pointer",
        userSelect: "none",
        ...style,
      }}
    >
      {/* La case */}
      <span
        aria-hidden
        style={{
          width: "clamp(46px, 7vw, 64px)",
          height: "clamp(46px, 7vw, 64px)",
          border: `2.5px solid ${MOSH.noir}`,
          borderRadius: 8,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {checked && (
          <img
            src={SMILEYS[type]}
            alt=""
            style={{ width: "56%", height: "auto" }}
          />
        )}
      </span>

      {/* Le libellé */}
      <span
        style={{
          fontFamily: FONT_DEGULAR,
          fontSize: "clamp(2rem, 6vw, 3.4rem)",
          fontWeight: 500,
          color: MOSH.noir,
          textDecoration: struck ? "line-through" : "none",
          textDecorationThickness: "0.06em",
        }}
      >
        {LABELS[type]}
      </span>
    </div>
  );
}
