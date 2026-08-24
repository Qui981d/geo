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
      return Response.json({ query: '' });
    }
    // Le contenu réel du site (crawl) : sans lui, le modèle prenait le thème du
    // titre pour l'activité — "sorties nocturnes" pour un site qui VEND un
    // abonnement à des offres dans les bars.
    const pageText = typeof contenu === 'string' ? contenu.slice(0, 2500) : '';

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      max_tokens: 30,
      messages: [
        {
          role: 'system',
          content: `On te donne la description d'une entreprise locale (et, si disponible, le contenu réel de son site). Ta mission en deux temps :
1. Comprends ce que l'entreprise VEND concrètement — son offre commerciale, ce que le client paie. Ne confonds jamais le thème du site avec l'activité : un site qui parle de "sorties nocturnes" mais vend un abonnement donnant des avantages dans des bars est un vendeur de pass, pas un organisateur de sorties.
2. Renvoie LA catégorie que taperait un prospect qui cherche cette offre dans une IA, dans la phrase "recommande-moi le meilleur ___ à [ville]". Mets-toi dans la peau d'un client potentiel.

Règles :
- Renvoie UNIQUEMENT la catégorie, au singulier, sans la ville, sans verbe, sans phrase, sans guillemets.
- La catégorie désigne une entreprise ou un service qu'on recommande — jamais une activité de loisir ("sorties nocturnes", "bien-être") ni un concept.
- Si la description est déjà une catégorie propre, renvoie-la telle quelle.
- Maximum 6 mots.

Exemples :
"je vends un membership de salle de sport" -> salle de sport
"je fais des ongles à domicile" -> prothésiste ongulaire
"réparation et entretien de vélos" -> réparateur de vélos
"Sorties & Vie Nocturne | Offres Exclusives" + un site qui vend un pass donnant un verre offert dans des bars partenaires -> pass bons plans sorties
"je vends des paniers bio en circuit court" -> producteur de paniers bio
"conciergerie airbnb" -> conciergerie de location courte durée
"cabinet d'avocats en droit des affaires" -> avocat en droit des affaires`,
        },
        {
          role: 'user',
          content: `Activité déclarée : "${activite}"${ville ? ` (à ${ville})` : ''}.${pageText ? `\n\nContenu du site (extrait) :\n"""\n${pageText}\n"""` : ''}`,
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
