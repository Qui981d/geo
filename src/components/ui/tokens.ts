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
  gris1: "#3a3a3a", // "Gris 1"
  gris2: "#6c6c6c", // "Gris 2"
  gris3: "#8c8c8c", // "Gris 3"
} as const;

/** Pile de polices pour le texte des composants (fallback Degular → Hanken). */
export const FONT_DEGULAR =
  "'Degular', var(--font-hanken), 'Hanken Grotesk', -apple-system, sans-serif";

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
