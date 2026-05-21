import OpenAI from 'openai';
import { NextRequest } from 'next/server';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { metier, ville } = await req.json();

    if (!metier || !ville) {
      return Response.json({ error: 'Métier et ville requis' }, { status: 400 });
    }

    const userQuestion = `Recommande-moi le meilleur ${metier} à ${ville}. Donne-moi tes 3 meilleures recommandations avec une courte description pour chacune.`;

    const instructions = `Tu es l'IA de diagnostic de MOSH. Ton ton est direct, un peu mordant, jamais corporate. Tu parles comme un ami qui bosse dans le marketing digital et qui ne bullshit pas.

Quand on te demande une recommandation locale, utilise la recherche web pour trouver les meilleures options réelles et actuelles. Donne directement tes 3 meilleures recommandations avec une courte description factuelle pour chacune.

Sois précis sur les noms, adresses et pourquoi tu les recommandes. Ne fais aucun disclaimer sur tes limites. Réponds en français. Reste concis — pas de pavé.`;

    // Use Responses API with web_search — same as chatgpt.com
    const response = await client.responses.create({
      model: 'gpt-4o',
      instructions,
      tools: [{ type: 'web_search' as any, search_context_size: 'medium' } as any],
      input: userQuestion,
      stream: true,
    } as any);

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of response as any) {
            // The Responses API streaming emits different event types
            if (event.type === 'response.output_text.delta') {
              const delta = event.delta;
              if (delta) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`));
              }
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (streamError) {
          console.error('Stream error:', streamError);
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Chat API error:', error);
    return Response.json({ error: message }, { status: 500 });
  }
}
