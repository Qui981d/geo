"use client";
import { MOSH, FONT_DEGULAR, u } from "./tokens";

/**
 * Case à cocher Oui / Non (Figma : check_box_oui_1/2, check_box_non_1/2).
 *
 * Mesures exactes de la maquette (frame 1440) :
 *  - case 46×46, radius 3, bordure 2, fond blanc
 *  - libellé ~57px (cap height 41.3), gap case→libellé 27
 *  - barré : trait de 3.2 d'épaisseur qui déborde de ~4.5 de chaque côté
 *  - smiley centré dans la case (34 de large)
 *
 *  - `checked` : la case est sélectionnée → le smiley apparaît dans la case
 *  - `struck`  : le libellé est barré (cas où l'AUTRE option est choisie)
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
        gap: u(27),
        cursor: "pointer",
        userSelect: "none",
        ...style,
      }}
    >
      {/* La case */}
      <span
        aria-hidden
        style={{
          width: u(46),
          height: u(46),
          background: MOSH.blanc,
          border: `${u(2)} solid ${MOSH.noir}`,
          borderRadius: u(3),
          boxSizing: "border-box",
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
            style={{ width: u(34), height: "auto" }}
          />
        )}
      </span>

      {/* Le libellé */}
      <span
        style={{
          position: "relative",
          fontFamily: FONT_DEGULAR,
          fontSize: u(57.3),
          lineHeight: 1,
          fontWeight: 450,
          color: MOSH.noir,
          whiteSpace: "nowrap",
        }}
      >
        {LABELS[type]}
        {struck && (
          <span
            aria-hidden
            style={{
              position: "absolute",
              left: u(-4.5),
              right: u(-4),
              top: "54%",
              height: u(3.2),
              background: MOSH.noir,
            }}
          />
        )}
      </span>
    </div>
  );
}
