import OpenAI from 'openai';
import { NextRequest } from 'next/server';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Reformule la description brute d'une activité ("je vends un membership à
 * Genève") en LA catégorie de service qu'un prospect taperait à une IA
 * ("salle de sport"). Petit appel rapide, sans recherche web.
 */
export async function POST(req: NextRequest) {
  try {
    const { activite, ville, contenu } = await req.json();
    if (!activite || typeof activite !== 'string') {
      return Response.json({ offre: '', query: '' });
    }
    // Le contenu réel du site (crawl) : sans lui, le modèle prenait le thème du
    // titre pour l'activité — "sorties nocturnes" pour un site qui VEND un
    // abonnement à des offres dans les bars.
    const pageText = typeof contenu === 'string' ? contenu.slice(0, 2500) : '';

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      max_tokens: 140,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `On te donne la description d'une entreprise locale (et, si disponible, le contenu réel de son site). Comprends d'abord ce que l'entreprise VEND concrètement — l'offre que le client paie. Ne confonds jamais le thème du site avec l'activité : un site qui parle de "sorties nocturnes" mais vend un abonnement donnant des avantages dans des bars vend un pass, il n'organise pas de sorties.

Réponds en JSON avec exactement ces deux champs :
- "offre" : la suite naturelle de la phrase "vous proposez …" — concrète, 12 mots max, sans la ville, sans nom de marque, sans guillemets. Ex : "un pass qui donne des bons plans dans les bars et clubs".
- "query" : la question complète qu'un prospect taperait à une IA (ChatGPT) pour trouver ce type d'offre — formulée naturellement, à la première personne, AVEC la ville quand elle est fournie, sans nom de marque. Le prospect veut des noms d'entreprises ou d'offres à comparer, pas un conseil général.

Exemples :
description "je vends un membership de salle de sport" (à Lausanne)
-> {"offre": "des abonnements de salle de sport", "query": "Recommande-moi les meilleures salles de sport à Lausanne"}
description "Sorties & Vie Nocturne | Offres Exclusives" + un site qui vend un pass donnant un verre offert dans des bars partenaires (à Genève)
-> {"offre": "un pass qui donne des bons plans dans les bars et clubs", "query": "Quels sont les meilleurs bons plans pour sortir à Genève ?"}
description "cabinet d'avocats en droit des affaires" (à Nyon)
-> {"offre": "des services d'avocat en droit des affaires", "query": "Recommande-moi les meilleurs avocats en droit des affaires à Nyon"}`,
        },
        {
          role: 'user',
          content: `Description : "${activite}"${ville ? ` (à ${ville})` : ''}.${pageText ? `\n\nContenu du site (extrait) :\n"""\n${pageText}\n"""` : ''}`,
        },
      ],
    });

    let offre = '';
    let query = '';
    try {
      const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}');
      const clean = (s: unknown) =>
        typeof s === 'string' ? s.trim().replace(/^["'«»\s]+|["'«»\s]+$/g, '') : '';
      offre = clean(parsed.offre);
      query = clean(parsed.query);
    } catch {
      /* JSON invalide : on renvoie vide, le client retombera sur ses questions */
    }
    return Response.json({ offre, query });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Reformulate API error:', error);
    // Ne bloque pas le flux : le client retombera sur l'activité brute.
    return Response.json({ offre: '', query: '', error: message }, { status: 200 });
  }
}
