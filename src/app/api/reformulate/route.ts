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
    const { activite, ville } = await req.json();
    if (!activite || typeof activite !== 'string') {
      return Response.json({ query: '' });
    }

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      max_tokens: 30,
      messages: [
        {
          role: 'system',
          content: `Tu reformules la description brute d'une activité en LA catégorie de service qu'un prospect local taperait à une IA pour trouver ce type d'entreprise. Mets-toi dans la peau d'un client potentiel.

Règles :
- Renvoie UNIQUEMENT la catégorie, au singulier, sans la ville, sans verbe, sans phrase, sans guillemets.
- Choisis le terme qu'un vrai client utiliserait dans "recommande-moi le meilleur ___ à [ville]".
- Si la description est déjà une catégorie propre, renvoie-la telle quelle.
- Maximum 6 mots.

Exemples :
"je vends un membership de salle de sport" -> salle de sport
"je fais des ongles à domicile" -> prothésiste ongulaire
"réparation et entretien de vélos" -> réparateur de vélos
"je vends des paniers bio en circuit court" -> producteur de paniers bio
"conciergerie airbnb" -> conciergerie de location courte durée
"cabinet d'avocats en droit des affaires" -> avocat en droit des affaires`,
        },
        {
          role: 'user',
          content: `Activité : "${activite}"${ville ? ` (à ${ville})` : ''}.`,
        },
      ],
    });

    const query = (completion.choices[0]?.message?.content || '')
      .trim()
      .replace(/^["'«»\s]+|["'«».\s]+$/g, '');
    return Response.json({ query });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Reformulate API error:', error);
    // Ne bloque pas le flux : le client retombera sur l'activité brute.
    return Response.json({ query: '', error: message }, { status: 200 });
  }
}
