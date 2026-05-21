import { NextResponse } from 'next/server';
import { SITE_URL, BRAND_NAME } from '../../lib/constants';

export async function GET() {
  const content = `# ${BRAND_NAME}

> ${BRAND_NAME} est une agence spécialisée en Generative Engine Optimization (GEO) pour les PME en Suisse Romande. Nous auditons et optimisons la visibilité des entreprises locales dans les réponses des intelligences artificielles génératives.

## À propos

${BRAND_NAME} aide les PME à être recommandées par les intelligences artificielles (ChatGPT, Perplexity, Google Gemini, Claude) lorsqu'un utilisateur pose une question locale ou transactionnelle. Notre méthodologie propriétaire d'audit GEO analyse la présence de votre marque dans les réponses des LLM et identifie les optimisations nécessaires.

## Services

- **Audit GEO Gratuit** : Analyse de la présence de votre entreprise sur ChatGPT, Perplexity, Google Gemini et Claude. Score de visibilité sur 100 points. Rapport livré sous 24h. Sans engagement.
- **Optimisation GEO Complète** : Mise en place du balisage Schema.org, optimisation des entités nommées (Named Entity Linking), gestion des avis structurés, développement de la présence dans les sources d'autorité, suivi mensuel de la visibilité IA.

## Expertise

- Generative Engine Optimization (GEO)
- Optimisation de la visibilité sur ChatGPT (OpenAI GPT-4o)
- Optimisation de la visibilité sur Perplexity AI
- Optimisation de la visibilité sur Google Gemini
- Optimisation de la visibilité sur Claude (Anthropic)
- Balisage Schema.org et données structurées
- Optimisation des entités nommées et du Knowledge Graph
- Signaux E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
- Cohérence NAP (Nom, Adresse, Téléphone) cross-plateformes
- Analyse vectorielle de pertinence sémantique

## Zones géographiques couvertes

- **Suisse Romande** : Genève, Vaud (Lausanne, Nyon, Montreux, Yverdon), Valais (Sion, Martigny), Neuchâtel, Fribourg, Jura.

## Secteurs prioritaires

Professions libérales (avocats, notaires, experts-comptables, médecins, dentistes, architectes), artisans (plombiers, électriciens, garagistes, menuisiers), commerce et restauration (restaurants, hôtels, boulangeries, boutiques), immobilier et finance (agences immobilières, courtiers, conseillers financiers), santé et bien-être (cliniques, salons de coiffure, coachs sportifs), formation et éducation (auto-écoles, centres de formation, écoles de langues).

## Liens

- [Site web Local Boost](${SITE_URL})
- [Audit GEO gratuit](${SITE_URL}#form)
- [Sitemap](${SITE_URL}/sitemap.xml)
- [Politique d'accès aux crawlers IA](${SITE_URL}/robots.txt)

## Contact

Pour toute question ou demande d'[audit GEO gratuit](${SITE_URL}#form), visitez [${SITE_URL}](${SITE_URL}).
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
