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

Mission : via la recherche web, repérer les VRAIS points faibles de la présence en ligne de l'entreprise donnée qui nuisent à sa visibilité dans les réponses des IA (ChatGPT, Perplexity, Gemini).

RÈGLES ABSOLUES — la crédibilité de l'outil en dépend :
- N'affirme JAMAIS l'absence de quelque chose sans preuve positive. En cas de doute, N'EN PARLE PAS.
- ⚠️ Ton outil de recherche NE VOIT PAS les fiches Google Business / le Knowledge Panel Google (ce ne sont pas des pages web classiques). Donc : NE dis JAMAIS "pas de fiche Google" ni "pas d'avis Google", tu ne peux pas le vérifier. Ne parle des avis QUE si tu trouves explicitement une page d'avis (Trustpilot, etc.) qui en manque.
- Ne force AUCUN nombre. Donne 1 à 4 points, uniquement des problèmes RÉELS que tu as vérifiés sur des pages que tu as réellement consultées. S'il n'y a qu'un seul vrai problème, n'en donne qu'un. Mieux vaut 1 point juste que 4 dont un faux.
- Concentre-toi sur le VÉRIFIABLE : qualité/absence de site web, présence sur les annuaires que tu peux ouvrir, incohérences de coordonnées (nom/adresse/téléphone) ENTRE les sources que tu as lues, informations obsolètes, absence de données structurées visibles.
- Sois spécifique à CETTE entreprise (cite la source : "d'après allbiz.ch…").
- Réponds en français.

Format STRICT : une ligne par point, commençant par "- ", titre court en **gras** puis " : " puis une explication concrète et vérifiée (une phrase). Aucune intro, aucune conclusion, rien d'autre.

Exemple :
- **Adresse incohérente** : d'après LinkedIn l'adresse est "…18" alors qu'Allbiz indique "…12-16" — cette incohérence NAP perturbe la validation de l'emplacement par les IA.`;

    const input = `Entreprise : ${company}${metier ? ` — ${metier}` : ''}${ville ? ` à ${ville}` : ''}${site ? `. Site/réseau indiqué : ${site}` : '. Aucun site indiqué.'}.`;

    const response = await client.responses.create({
      model: 'gpt-4o',
      instructions,
      tools: [{ type: 'web_search' as any, search_context_size: 'high' } as any],
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
