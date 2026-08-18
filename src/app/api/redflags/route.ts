import OpenAI from 'openai';
import { NextRequest } from 'next/server';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { company, metier, ville, site } = await req.json();

    if (!company) {
      return Response.json({ error: 'Nom d\'entreprise requis' }, { status: 400 });
    }

    const instructions = `Tu es un auditeur GEO (visibilité dans les moteurs d'IA) pour MOSH. Ton : direct, factuel, jamais corporate.

Utilise la recherche web pour analyser la présence en ligne RÉELLE de l'entreprise donnée. Identifie 2 à 4 PROBLÈMES CONCRETS et VÉRIFIABLES qui nuisent à sa visibilité dans les réponses des IA (ChatGPT, Perplexity, Gemini). Exemples de problèmes : pas de fiche Google Business Profile, peu ou pas d'avis clients, incohérence NAP (nom/adresse/téléphone différents selon les sources), pas de site web ou site pauvre, absence des annuaires clés (Pages Jaunes, etc.), informations obsolètes, aucune donnée structurée.

Règles :
- Base-toi sur ce que tu trouves réellement. Si une info est introuvable, dis-le franchement ("aucune fiche Google trouvée") plutôt que d'inventer.
- Sois spécifique à CETTE entreprise, pas générique.
- Réponds en français.

Format STRICT : une ligne par problème, commençant par "- ", avec un titre court en **gras** suivi de " : " et d'une explication concrète (une phrase). Maximum 4 lignes. Aucune intro, aucune conclusion, rien d'autre.

Exemple de format :
- **Pas de fiche Google Business** : aucune fiche trouvée, l'IA n'a aucune donnée locale fiable sur vous.
- **Trop peu d'avis** : moins de 10 avis, insuffisant pour que l'IA vous considère crédible face aux concurrents.`;

    const input = `Entreprise : ${company}${metier ? ` — ${metier}` : ''}${ville ? ` à ${ville}` : ''}${site ? `. Site/réseau indiqué : ${site}` : '. Aucun site indiqué.'}.`;

    const response = await client.responses.create({
      model: 'gpt-4o',
      instructions,
      tools: [{ type: 'web_search' as any, search_context_size: 'medium' } as any],
      input,
      stream: false,
    } as any);

    const text = (response as any).output_text || '';
    return Response.json({ text });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Redflags API error:', error);
    return Response.json({ error: message }, { status: 500 });
  }
}
