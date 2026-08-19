import OpenAI from 'openai';
import { NextRequest } from 'next/server';
import { auditSite, type AuditCheck } from '@/lib/siteAudit';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * Red flags = UNIQUEMENT ce qu'on a réellement constaté en ouvrant le site.
 *
 * Le crawl (src/lib/siteAudit.ts) produit des constats vérifiables ; le modèle
 * ne fait que les reformuler. Il n'a AUCUN outil de recherche et aucune
 * latitude pour ajouter un point : impossible d'inventer une absence d'avis ou
 * de balisage. En cas de doute sur la sortie du modèle, on retombe sur le
 * texte déterministe.
 */

/** Rendu déterministe, garanti fidèle au crawl. */
function deterministicText(flags: AuditCheck[]): string {
  return flags.map((c) => `- **${c.label}** : ${c.flag}`).join('\n');
}

export async function POST(req: NextRequest) {
  try {
    const { site } = await req.json();

    const audit = await auditSite(typeof site === 'string' ? site : '');

    const flags = audit.checks
      .filter((c) => c.status === 'fail' && c.flag)
      .sort((a, b) => b.max - a.max)
      .slice(0, 5);

    const payload = {
      audit: {
        url: audit.url,
        kind: audit.kind,
        httpStatus: audit.httpStatus,
        jsRendered: audit.jsRendered,
        pagesFetched: audit.pagesFetched,
        checks: audit.checks,
        tech: audit.tech,
      },
    };

    if (flags.length === 0) {
      // Rien de faux à dire : on ne remplit pas le vide avec des suppositions.
      return Response.json({ text: '', ...payload });
    }

    const fallback = deterministicText(flags);

    const instructions = `Tu es l'auditeur GEO de MOSH. Ton : direct, factuel, jamais corporate.

On vient d'ouvrir RÉELLEMENT le site de l'entreprise et de lire son HTML. On te donne la liste EXACTE des problèmes constatés, avec la preuve technique de chacun.

TA SEULE MISSION : reformuler chaque point dans un français clair et direct, compréhensible par un artisan ou un commerçant.

RÈGLES ABSOLUES — la crédibilité de l'outil en dépend :
- Tu renvoies EXACTEMENT ${flags.length} point(s), un par problème fourni, dans le même ordre.
- Tu n'AJOUTES aucun problème. Tu n'inventes aucun chiffre, aucune source, aucun constat.
- Tu ne parles QUE de ce qui est dans la liste. Tout le reste n'a pas été vérifié.
- INTERDIT ABSOLU : dire que l'entreprise n'a pas d'avis clients, pas de fiche Google, pas de présence sur un annuaire. Nous ne pouvons pas le vérifier.
- Si un point concerne les avis, il porte UNIQUEMENT sur leur balisage technique sur le site — jamais sur leur existence ou leur nombre.
- Garde la preuve concrète (ce qu'on a vu, l'URL, le code) dans la formulation : c'est ce qui rend le constat vérifiable par le lecteur.

Format STRICT : une ligne par point, commençant par "- ", un titre court en **gras**, puis " : ", puis une phrase (deux maximum) qui dit le constat et pourquoi ça bloque les IA. Aucune intro, aucune conclusion, rien d'autre.`;

    const input = [
      `Site analysé : ${audit.url || audit.input || 'aucun'}`,
      `Pages réellement lues : ${audit.pagesFetched.length ? audit.pagesFetched.join(', ') : 'aucune'}`,
      '',
      'PROBLÈMES CONSTATÉS (à reformuler, un point chacun, même ordre) :',
      ...flags.map(
        (c, i) =>
          `${i + 1}. [${c.label}] Constat : ${c.flag}\n   Preuve technique relevée : ${c.evidence}${c.why ? `\n   Enjeu : ${c.why}` : ''}`,
      ),
    ].join('\n');

    let text = fallback;
    try {
      const completion = await client.chat.completions.create({
        model: 'gpt-4o',
        temperature: 0.3,
        messages: [
          { role: 'system', content: instructions },
          { role: 'user', content: input },
        ],
      });
      const raw = (completion.choices[0]?.message?.content || '').trim();
      const lines = raw.split('\n').map((l) => l.trim()).filter((l) => l.startsWith('- '));
      // Garde-fou : si le modèle a ajouté ou supprimé des points, on garde le texte déterministe.
      if (lines.length === flags.length) text = lines.join('\n');
    } catch (llmError) {
      console.error('Redflags rewrite error (fallback déterministe utilisé):', llmError);
    }

    return Response.json({ text, ...payload });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Redflags API error:', error);
    return Response.json({ error: message }, { status: 500 });
  }
}
