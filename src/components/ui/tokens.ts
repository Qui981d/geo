/**
 * Design tokens issus de la maquette Figma "Composants" (ge…sh).
 * Source : variables Figma + get_design_context.
 *
 * Police : la maquette utilise "Degular" (police commerciale, non incluse).
 * On retombe sur Hanken Grotesk (déjà chargée dans le projet) qui en est
 * très proche. Pour utiliser la vraie Degular, voir la note en bas de fichier.
 */
export const MOSH = {
  noir: "#1a1a1a", // "mosh le noir"
  blanc: "#ffffff", // "mosh le blanc"
  fond: "#FDFDFD", // fond des pages claires (≠ blanc pur, cf. exports SVG)
  gris1: "#3a3a3a", // "Gris 1"
  gris2: "#6c6c6c", // "Gris 2"
  gris3: "#8c8c8c", // "Gris 3"
} as const;

/**
 * Unité de mise à l'échelle : la maquette est dessinée sur une frame
 * 1440×1024. `u(n)` rend exactement `n` px quand l'écran (container)
 * fait 1440 de large, et met à l'échelle proportionnellement sinon.
 * Nécessite un ancêtre avec `container-type: inline-size`.
 */
export const u = (n: number) => `${Math.round((n / 14.4) * 10000) / 10000}cqw`;

/** Pile de polices pour le texte des composants (fallback Degular → Hanken). */
export const FONT_DEGULAR =
  "'Degular', var(--font-degular), var(--font-hanken), 'Hanken Grotesk', -apple-system, sans-serif";

/*
 * ── Brancher la vraie police Degular (optionnel) ─────────────────────────
 * 1. Déposer les fichiers .woff2 dans  public/fonts/
 * 2. Ajouter dans src/app/globals.css :
 *
 *    @font-face {
 *      font-family: 'Degular';
 *      src: url('/fonts/Degular-Regular.woff2') format('woff2');
 *      font-weight: 400;
 *      font-display: swap;
 *    }
 *
 * La pile ci-dessus prendra automatiquement le relais.
 */
