/**
 * Audit technique RÉEL du site fourni par l'utilisateur.
 *
 * Règle d'or : on n'affirme QUE ce qu'on a effectivement lu dans le HTML servi.
 * Tout ce qu'on ne peut pas vérifier (fiche Google Business, avis Google,
 * page rendue en JS…) sort en `unknown` et ne devient JAMAIS un reproche.
 */

export type CheckStatus = 'ok' | 'fail' | 'unknown';

export interface AuditCheck {
  id: string;
  label: string;      // ce qu'on a vérifié
  status: CheckStatus;
  points: number;     // points obtenus
  max: number;
  evidence: string;   // ce qu'on a RÉELLEMENT vu — doit rester vérifiable par l'utilisateur
  flag?: string;      // formulation du problème (uniquement si status === 'fail')
  why?: string;       // pourquoi ça compte pour les IA
}

export interface SiteAudit {
  input: string;
  url: string | null;             // URL finale, après redirections
  kind: 'site' | 'social' | 'none' | 'unreachable';
  httpStatus: number | null;
  error: string | null;
  jsRendered: boolean;
  pagesFetched: string[];
  /** Ce que le site dit de l'entreprise — sert à proposer la requête à tester. */
  profile: {
    name: string;
    title: string;
    description: string;
    city: string;
    types: string[];
    services: string[];
    /** Extrait du contenu réel de la page (titres + texte visible) : c'est lui
        qui dit ce que l'entreprise VEND — le titre seul ne suffit pas. */
    pageText: string;
  };
  checks: AuditCheck[];
  tech: { earned: number; max: number; measured: boolean };
  facts: string[];                // résumé factuel, seule matière autorisée pour le LLM
}

const TECH_MAX = 25;
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36';

const SOCIAL_HOSTS = [
  'instagram.com', 'facebook.com', 'fb.com', 'linkedin.com', 'tiktok.com',
  'x.com', 'twitter.com', 'youtube.com', 'pinterest.com', 'threads.net',
];

/** Mots qui suivent souvent "à" sans être une ville ("livraison à domicile"). */
const NON_CITY_WORDS = new Set([
  'domicile', 'distance', 'emporter', 'volonte', 'prix', 'partir', 'propos',
  'toute', 'tous', 'tout', 'chaque', 'votre', 'notre', 'vos', 'nos', 'vous',
  'nous', 'partout', 'proximite', 'demande', 'louer', 'vendre', 'venir',
  'suivre', 'decouvrir', 'reserver', 'domicile', 'ligne', 'jour', 'jours',
  'semaine', 'heure', 'heures', 'minutes', 'partager', 'savoir', 'travers',
]);

const AI_BOTS = [
  'gptbot', 'oai-searchbot', 'chatgpt-user', 'perplexitybot', 'perplexity-user',
  'claudebot', 'claude-web', 'anthropic-ai', 'google-extended', 'ccbot',
  'applebot-extended', 'bytespider', 'meta-externalagent',
];

/* ────────────────────────────────────────────────
   Fetch helpers
   ──────────────────────────────────────────────── */

export function normalizeUrl(raw: string): string | null {
  const s = (raw || '').trim().replace(/^[<(]|[>)]$/g, '');
  if (!s) return null;
  if (/^(non|aucun|pas de site|n\/a|-)$/i.test(s)) return null;
  const withProto = /^https?:\/\//i.test(s) ? s : `https://${s.replace(/^\/+/, '')}`;
  try {
    const u = new URL(withProto);
    if (!u.hostname.includes('.')) return null;
    return u.toString();
  } catch {
    return null;
  }
}

/** Traduit une erreur réseau Node en cause lisible — jamais un vague "fetch failed". */
function networkReason(e: unknown): string {
  const cause = (e as { cause?: { code?: string } } | undefined)?.cause;
  const code = cause?.code || (e as { code?: string } | undefined)?.code;
  const name = e instanceof Error ? e.name : '';
  if (name === 'TimeoutError' || code === 'UND_ERR_HEADERS_TIMEOUT' || code === 'UND_ERR_CONNECT_TIMEOUT')
    return 'délai dépassé : le serveur n\'a pas répondu à temps';
  switch (code) {
    case 'ENOTFOUND':
    case 'EAI_AGAIN':
      return 'nom de domaine introuvable (le DNS ne résout pas)';
    case 'ECONNREFUSED':
      return 'connexion refusée par le serveur';
    case 'ECONNRESET':
      return 'connexion coupée par le serveur';
    case 'CERT_HAS_EXPIRED':
      return 'certificat HTTPS expiré';
    case 'DEPTH_ZERO_SELF_SIGNED_CERT':
    case 'UNABLE_TO_VERIFY_LEAF_SIGNATURE':
      return 'certificat HTTPS invalide';
    default:
      return e instanceof Error && e.message !== 'fetch failed' ? e.message : 'serveur injoignable';
  }
}

async function get(
  url: string,
  timeoutMs = 9000,
  ua: string = UA,
): Promise<{ ok: boolean; status: number | null; body: string; finalUrl: string; error: string | null }> {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        'User-Agent': ua,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
      },
    });
    const body = res.ok ? (await res.text()).slice(0, 900_000) : '';
    return { ok: res.ok, status: res.status, body, finalUrl: res.url || url, error: null };
  } catch (e) {
    return { ok: false, status: null, body: '', finalUrl: url, error: networkReason(e) };
  }
}

/* ────────────────────────────────────────────────
   Parsing HTML (sans dépendance)
   ──────────────────────────────────────────────── */

/** Décode les entités HTML courantes — les constats sont montrés à l'utilisateur. */
function decodeEntities(s: string): string {
  return s
    .replace(/&(?:nbsp|#160);/gi, ' ')
    .replace(/&(?:amp|#38);/gi, '&')
    .replace(/&(?:lt|#60);/gi, '<')
    .replace(/&(?:gt|#62);/gi, '>')
    .replace(/&(?:quot|#34);/gi, '"')
    .replace(/&(?:apos|#39|#x27);/gi, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

function stripTags(html: string): string {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim();
}

function meta(html: string, name: string): string {
  const patterns = [
    new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:name|property)=["']${name}["']`, 'i'),
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return decodeEntities(m[1]).trim();
  }
  return '';
}

function pageTitle(html: string): string {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? stripTags(m[1]) : '';
}

/** Extrait tous les blocs JSON-LD parsables. */
function jsonLdBlocks(html: string): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const raw = m[1].replace(/^\s*<!\[CDATA\[/, '').replace(/\]\]>\s*$/, '').trim();
    if (!raw) continue;
    try {
      out.push(JSON.parse(raw));
    } catch {
      // JSON-LD cassé : on le signale comme tel plutôt que de l'ignorer
      out.push({ __parseError: true, __raw: raw.slice(0, 200) });
    }
  }
  return out;
}

type Node = Record<string, unknown>;

/** Aplatit @graph / tableaux imbriqués en une liste de nœuds. */
function flattenNodes(input: unknown, acc: Node[] = []): Node[] {
  if (!input || typeof input !== 'object') return acc;
  if (Array.isArray(input)) {
    input.forEach((v) => flattenNodes(v, acc));
    return acc;
  }
  acc.push(input as Node);
  for (const v of Object.values(input as Node)) {
    if (v && typeof v === 'object') flattenNodes(v, acc);
  }
  return acc;
}

function typesOf(nodes: Node[]): string[] {
  const set = new Set<string>();
  nodes.forEach((n) => {
    const t = n['@type'];
    if (typeof t === 'string') set.add(t);
    else if (Array.isArray(t)) t.forEach((x) => typeof x === 'string' && set.add(x));
  });
  return [...set];
}

function findNode(nodes: Node[], pred: (n: Node) => boolean): Node | null {
  return nodes.find(pred) || null;
}

const LOCAL_TYPES =
  /^(LocalBusiness|Organization|Corporation|Store|Restaurant|ProfessionalService|HomeAndConstructionBusiness|MedicalBusiness|HealthAndBeautyBusiness|FoodEstablishment|AutomotiveBusiness|LegalService|FinancialService|LodgingBusiness|SportsActivityLocation|EntertainmentBusiness|EmergencyService|TravelAgency|RealEstateAgent|Dentist|Physician|Attorney|Plumber|Electrician|HairSalon|BeautySalon|NailSalon|Bakery|CafeOrCoffeeShop|BarOrPub|GeneralContractor|RoofingContractor|MovingCompany|ChildCare|School|Museum|Hotel|SelfStorage|Locksmith|HousePainter|Notary|InsuranceAgency|AccountingService|ComputerStore|BikeStore|ClothingStore|GroceryStore|PetStore|Pharmacy|Optician|VeterinaryCare|SportsClub|ExerciseGym|HealthClub|DaySpa|Winery|Brewery|Distillery)$/i;

/* ────────────────────────────────────────────────
   Détection NAP / avis dans le texte
   ──────────────────────────────────────────────── */

function findTelLink(html: string): string {
  const m = html.match(/href=["']tel:([^"']+)["']/i);
  return m ? m[1].trim() : '';
}

function findPhone(text: string): string {
  const patterns = [
    /\+\d{1,3}[\s.\-/(]{0,2}\d{1,3}[\s.\-/)]{0,2}\d{2,3}[\s.\-/]?\d{2,3}[\s.\-/]?\d{2,3}/, // international
    /\b0\d{1,2}[\s.\-/]?\d{3}[\s.\-/]?\d{2}[\s.\-/]?\d{2}\b/, // CH / FR national
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[0].trim();
  }
  return '';
}

/**
 * Adresse postale lisible dans le texte.
 * On exige un marqueur de voie (rue, chemin, strasse…) OU un code postal qui ne
 * risque pas d'être une année : sans ça, un simple « © 2024 Machin » passait
 * pour une adresse, et on affichait une preuve ridicule.
 */
function findPostalAddress(text: string): string {
  const street = text.match(
    /\b(?:rue|avenue|av\.|chemin|ch\.|route|rte\.|place|boulevard|bd\.|impasse|quai|allée|sentier|square|voie|strasse|straße|weg|gasse|platz|via|piazza)\s+[\wÀ-ÿ'’-]+(?:[\s,]+[\wÀ-ÿ'’-]+){0,3}[\s,]*\d{1,4}[a-z]?\b/i,
  ) || text.match(
    /\b\d{1,4}[a-z]?,?\s+(?:rue|avenue|av\.|chemin|route|place|boulevard|impasse|quai|allée)\s+[\wÀ-ÿ'’-]+(?:[\s-][\wÀ-ÿ'’-]+){0,3}/i,
  );
  const cityMatch = [...text.matchAll(/\b(?:CH-|FR-)?(\d{4,5})\s+([A-ZÀ-Ü][\wÀ-ÿ'’-]{2,}(?:[\s-][A-ZÀ-Ü]?[\wÀ-ÿ'’-]+)?)/g)];
  const city = cityMatch.find((m) => {
    // Une raison sociale n'est pas une ville : "© 2025 Machin SNC" ne doit
    // jamais passer pour le code postal 2025 de la ville "Machin SNC".
    if (/\b(snc|sa|sarl|s[àa]rl|sas|sasu|eurl|gmbh|ag|ltd|llc|inc|srl|spa|group|groupe|company|cie)\b/i.test(m[2])) {
      return false;
    }
    const n = Number(m[1]);
    const looksLikeYear = m[1].length === 4 && n >= 1900 && n <= 2035;
    if (!looksLikeYear) return true;
    // Un code qui ressemble à une année n'est retenu que s'il est COLLÉ à la
    // voie. Exiger seulement qu'une voie existe quelque part sur le site ne
    // suffit pas : celle des mentions légales validait le copyright du pied
    // de page, à l'autre bout de la page.
    if (!street || street.index === undefined || m.index === undefined) return false;
    return Math.abs(m.index - (street.index + street[0].length)) <= 40;
  });
  let streetStr = street?.[0].trim() || '';
  const cityStr = city?.[0].trim() || '';
  const cp = city?.[1];
  // La regex de voie avale parfois le code postal comme numéro de rue :
  // "Route de Champ-Colin 18, 1260" + "1260 Nyon" affichait le code deux fois.
  if (cp && streetStr.endsWith(cp)) streetStr = streetStr.replace(/[\s,]*\d{4,5}$/, '');
  return [streetStr, cityStr].filter(Boolean).join(', ');
}

/** Comparaison laxiste de deux libellés (accents, casse, ponctuation). */
function normalizeForCompare(s: string): string {
  return (s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function findEmail(html: string): string {
  const m = html.match(/href=["']mailto:([^"'?]+)["']/i);
  return m ? m[1].trim() : '';
}

function socialLinks(html: string): string[] {
  const out = new Set<string>();
  const re =
    /href=["'](https?:\/\/(?:www\.)?(?:instagram|facebook|linkedin|tiktok|x|twitter|youtube|pinterest)\.com\/[^"']+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) out.add(m[1]);
  return [...out].slice(0, 8);
}

function reviewPlatformLinks(html: string): string[] {
  const out = new Set<string>();
  const re =
    /href=["'](https?:\/\/[^"']*(?:google\.[a-z.]+\/maps|g\.page|goo\.gl\/maps|trustpilot\.|tripadvisor\.|yelp\.|local\.ch|search\.ch|pagesjaunes\.|avis-verifies|trustedshops)[^"']*)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) out.add(m[1]);
  return [...out].slice(0, 6);
}

function internalLinks(html: string, base: string): string[] {
  const out = new Set<string>();
  const host = new URL(base).hostname;
  const re = /href=["']([^"'#]+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    try {
      const u = new URL(m[1], base);
      if (u.hostname === host) out.add(u.origin + u.pathname);
    } catch {
      /* href non parsable */
    }
  }
  return [...out];
}

/* ────────────────────────────────────────────────
   Audit principal
   ──────────────────────────────────────────────── */

export async function auditSite(rawSite: string): Promise<SiteAudit> {
  const checks: AuditCheck[] = [];
  const facts: string[] = [];
  const pagesFetched: string[] = [];
  const url = normalizeUrl(rawSite);

  const audit: SiteAudit = {
    input: rawSite || '',
    url,
    kind: 'none',
    httpStatus: null,
    error: null,
    jsRendered: false,
    pagesFetched,
    profile: { name: '', title: '', description: '', city: '', types: [], services: [], pageText: '' },
    checks,
    tech: { earned: 0, max: TECH_MAX, measured: false },
    facts,
  };

  /* ── Aucun site fourni ── */
  if (!url) {
    audit.kind = 'none';
    facts.push("Aucune adresse de site web exploitable n'a été fournie par l'utilisateur.");
    checks.push({
      id: 'site',
      label: 'Site web',
      status: 'fail',
      points: 0,
      max: TECH_MAX,
      evidence: `Aucune URL exploitable fournie ("${rawSite || 'vide'}").`,
      flag: "Aucun site web : les IA n'ont aucune source que vous contrôlez pour décrire votre activité.",
      why: 'Sans site, votre entité dépend entièrement de sources tierces que vous ne maîtrisez pas.',
    });
    audit.tech = { earned: 0, max: TECH_MAX, measured: true };
    return audit;
  }

  const host = new URL(url).hostname.replace(/^www\./, '');

  /* ── Réseau social au lieu d'un site ── */
  if (SOCIAL_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) {
    audit.kind = 'social';
    facts.push(`L'utilisateur a indiqué une page de réseau social (${host}) et non un site web : ${url}`);
    checks.push({
      id: 'site',
      label: 'Site web propre',
      status: 'fail',
      points: 0,
      max: TECH_MAX,
      evidence: `L'adresse fournie est une page ${host}, pas un site web.`,
      flag: `Pas de site à vous : votre présence repose sur une page ${host}, que les IA lisent mal et que vous ne contrôlez pas.`,
      why:
        "Les réseaux sociaux sont peu crawlables : adresse, horaires, services et balisage y sont largement invisibles pour les moteurs d'IA.",
    });
    audit.tech = { earned: 0, max: TECH_MAX, measured: true };
    return audit;
  }

  /* ── Récupération de la page d'accueil ── */
  audit.kind = 'site';
  let home = await get(url);
  // Un 403/429 vient souvent d'un pare-feu qui filtre l'agent : on retente une
  // fois en agent neutre avant de conclure quoi que ce soit.
  if (!home.ok && (home.status === 403 || home.status === 429)) {
    const retry = await get(url, 9000, 'Mozilla/5.0 (compatible; MoshGeoAudit/1.0)');
    if (retry.ok) home = retry;
  }
  audit.httpStatus = home.status;

  if (!home.ok) {
    audit.kind = 'unreachable';
    const reason = home.status ? `code HTTP ${home.status}` : home.error;
    audit.error = reason;
    facts.push(
      `IMPOSSIBLE d'ouvrir ${url} depuis notre serveur (${reason}). ` +
        `Aucun contenu du site n'a pu être lu : aucune conclusion ne peut être tirée sur son contenu, son balisage ou ses avis.`,
    );
    checks.push({
      id: 'reachable',
      label: 'Page accessible à un robot',
      status: 'fail',
      points: 0,
      max: 3,
      evidence: `Requête sur ${url} → ${reason}.`,
      flag:
        home.status === 403 || home.status === 429
          ? `Votre serveur a refusé notre requête (${reason}) : un filtrage de ce type peut aussi bloquer les crawlers d'IA — à vérifier dans votre pare-feu ou CDN.`
          : `Notre robot n'a pas pu ouvrir ${url} (${reason}) : une page qu'un robot ne charge pas ne peut pas être citée.`,
      why: "Une page qu'un robot ne peut pas charger ne peut pas être citée par une IA.",
    });
    checks.push({
      id: 'content',
      label: 'Contenu du site (balisage, coordonnées, avis)',
      status: 'unknown',
      points: 0,
      max: 0,
      evidence: 'Page inaccessible : contenu non analysé, aucune affirmation possible.',
    });
    audit.tech = { earned: 0, max: 3, measured: true };
    return audit;
  }

  pagesFetched.push(home.finalUrl);
  const finalUrl = home.finalUrl;
  audit.url = finalUrl;
  let html = home.body;
  let text = stripTags(html);

  /* ── Pages secondaires utiles (contact / mentions légales / avis) ── */
  const extraPages = internalLinks(html, finalUrl)
    .filter((l) => /(contact|impressum|kontakt|mentions|legal|a-propos|about|nous-|equipe|avis|temoignages)/i.test(l))
    .filter((l) => l !== finalUrl)
    .slice(0, 2);

  for (const p of extraPages) {
    const r = await get(p, 7000);
    if (r.ok && r.body) {
      pagesFetched.push(r.finalUrl);
      html += '\n' + r.body;
      text += ' ' + stripTags(r.body);
    }
  }

  /* ── Page rendue côté client ? ── */
  const homeText = stripTags(home.body);
  audit.jsRendered = homeText.length < 500 && /<script/i.test(home.body);

  /* ── 1. Accessibilité + HTTPS ── */
  const isHttps = finalUrl.startsWith('https://');
  checks.push({
    id: 'reachable',
    label: 'Page accessible aux robots + HTTPS',
    status: isHttps ? 'ok' : 'fail',
    points: isHttps ? 3 : 0,
    max: 3,
    evidence: isHttps
      ? `${finalUrl} répond en HTTP ${home.status}, en HTTPS.`
      : `${finalUrl} répond en HTTP ${home.status} mais sans HTTPS.`,
    flag: isHttps
      ? undefined
      : "Le site n'est pas servi en HTTPS — signal de fiabilité négatif pour les moteurs comme pour les IA.",
    why: 'Une page inaccessible ou non sécurisée est écartée des sources jugées fiables.',
  });
  facts.push(
    `Page d'accueil ouverte : ${finalUrl} (HTTP ${home.status}, ${isHttps ? 'HTTPS' : 'HTTP non sécurisé'}). ${homeText.length} caractères de texte lus.`,
  );
  if (pagesFetched.length > 1) facts.push(`Pages supplémentaires lues : ${pagesFetched.slice(1).join(', ')}.`);
  if (audit.jsRendered) {
    facts.push(
      `ATTENTION : la page d'accueil ne contient que ${homeText.length} caractères de texte dans le HTML servi — le contenu est probablement injecté en JavaScript. Les vérifications de contenu ci-dessous sont donc NON CONCLUANTES.`,
    );
  }

  /* ── 2. Titre + description ── */
  const t = pageTitle(html);
  const desc = meta(html, 'description');
  const titleOk = t.length >= 10;
  const descOk = desc.length >= 50;
  checks.push({
    id: 'meta',
    label: 'Titre et meta description',
    status: titleOk && descOk ? 'ok' : 'fail',
    points: titleOk && descOk ? 3 : titleOk || descOk ? 1 : 0,
    max: 3,
    evidence: [
      t ? `<title> : « ${t.slice(0, 90)} »` : '<title> absent ou vide',
      desc ? `meta description (${desc.length} car.) : « ${desc.slice(0, 110)} »` : 'meta description absente',
    ].join(' — '),
    flag:
      titleOk && descOk
        ? undefined
        : !t
          ? "La page n'a pas de balise <title> exploitable : rien ne résume votre activité pour un moteur."
          : !descOk
            ? `La meta description est ${desc ? `trop courte (${desc.length} caractères)` : 'absente'} — c'est souvent le seul résumé de vous qu'une IA reprend.`
            : 'Le titre de page est trop court pour décrire votre activité.',
    why: "Titre et description sont les deux premières phrases qu'une IA lit sur vous.",
  });
  facts.push(
    `Balise <title> : ${t ? `« ${t} »` : 'ABSENTE'}. Meta description : ${desc ? `« ${desc} » (${desc.length} car.)` : 'ABSENTE'}.`,
  );

  /* ── 3. Données structurées Schema.org ── */
  const blocks = jsonLdBlocks(html);
  const broken = blocks.filter((b) => b.__parseError);
  const nodes = flattenNodes(blocks.filter((b) => !b.__parseError));
  const microdata = [...html.matchAll(/itemtype=["']https?:\/\/schema\.org\/([A-Za-z]+)["']/gi)].map((m) => m[1]);
  const schemaTypes = [...new Set([...typesOf(nodes), ...microdata])];
  const localTypes = schemaTypes.filter((x) => LOCAL_TYPES.test(x));
  const hasSchema = schemaTypes.length > 0;
  const hasLocal = localTypes.length > 0;

  if (audit.jsRendered && !hasSchema) {
    checks.push({
      id: 'schema',
      label: 'Balisage Schema.org (données structurées)',
      status: 'unknown',
      points: 0,
      max: 0,
      evidence:
        'Page rendue en JavaScript : le HTML servi ne contient pas de balisage, mais il peut être injecté côté client. Non concluant.',
    });
    facts.push("Schema.org : NON VÉRIFIABLE (page rendue en JS). Interdiction absolue d'affirmer qu'il est absent.");
  } else {
    checks.push({
      id: 'schema',
      label: 'Balisage Schema.org (données structurées)',
      status: hasLocal ? 'ok' : 'fail',
      points: hasLocal ? 5 : hasSchema ? 2 : 0,
      max: 5,
      evidence: hasSchema
        ? `Types détectés dans le HTML : ${schemaTypes.join(', ')}${broken.length ? ` — ${broken.length} bloc(s) JSON-LD non parsable(s)` : ''}.`
        : `Aucun script application/ld+json ni attribut itemtype schema.org dans le HTML de ${pagesFetched.join(' et ')}.`,
      flag: hasLocal
        ? undefined
        : hasSchema
          ? `Balisage présent (${schemaTypes.join(', ')}) mais aucun type d'entreprise locale (LocalBusiness / Organization) : l'IA ne sait pas que vous êtes une entreprise identifiable.`
          : "Aucune donnée structurée Schema.org dans le HTML : rien ne dit formellement à une IA qui vous êtes, où vous êtes et ce que vous vendez.",
      why: 'Le balisage Schema.org transforme une page en entité exploitable dans un Knowledge Graph.',
    });
    facts.push(
      hasSchema
        ? `Schema.org PRÉSENT. Types trouvés : ${schemaTypes.join(', ')}.${broken.length ? ` ${broken.length} bloc JSON-LD invalide.` : ''}`
        : `Schema.org ABSENT du HTML servi (vérifié sur ${pagesFetched.length} page(s)).`,
    );
  }

  /* ── 4. NAP structuré dans le balisage ── */
  const addrNode = findNode(nodes, (n) => n['@type'] === 'PostalAddress' || Boolean(n.address));
  const telNode = findNode(nodes, (n) => typeof n.telephone === 'string' && (n.telephone as string).length > 4);
  const napSchemaOk = Boolean(addrNode && telNode);
  if (hasSchema || !audit.jsRendered) {
    checks.push({
      id: 'nap-schema',
      label: 'Adresse + téléphone balisés (NAP structuré)',
      status: napSchemaOk ? 'ok' : 'fail',
      points: napSchemaOk ? 3 : 0,
      max: 3,
      evidence: napSchemaOk
        ? `PostalAddress et telephone présents dans le balisage (tél. balisé : ${String(telNode?.telephone).slice(0, 30)}).`
        : `Dans le balisage lu : ${addrNode ? 'adresse présente' : 'pas de PostalAddress'}, ${telNode ? 'téléphone présent' : 'pas de champ telephone'}.`,
      flag: napSchemaOk
        ? undefined
        : "Vos coordonnées ne sont pas balisées (PostalAddress / telephone) : une IA doit les deviner dans le texte au lieu de les lire.",
      why: "Le NAP structuré est le point d'ancrage qui relie votre site à votre fiche locale.",
    });
  }

  /* ── 5. Avis balisés ── */
  const ratingHolder = findNode(nodes, (n) => n['@type'] === 'AggregateRating' || Boolean(n.aggregateRating));
  const ratingObj = (ratingHolder &&
    (ratingHolder['@type'] === 'AggregateRating' ? ratingHolder : (ratingHolder.aggregateRating as Node))) as Node | null;
  const ratingCount = ratingObj ? (ratingObj.reviewCount ?? ratingObj.ratingCount) : undefined;
  const hasRating = Boolean(ratingObj && (ratingObj.ratingValue || ratingCount));
  const reviewLinks = reviewPlatformLinks(html);
  // Une note balisée n'est un bon signal que si quelque chose la justifie sur
  // la page. Une note écrite en dur sans aucun avis derrière est une note
  // auto-déclarée : Google la sanctionne et une IA ne peut pas la recouper.
  // On ne la valide donc JAMAIS d'un ✓ — on ne fait que rapporter ce que le
  // site affirme.
  const reviewNodes = nodes.filter((n) => {
    const t = n['@type'];
    return t === 'Review' || (Array.isArray(t) && t.includes('Review'));
  });
  const backed = reviewNodes.length > 0 || reviewLinks.length > 0;
  const declared = `${ratingObj?.ratingValue ?? '?'} sur ${ratingCount ?? '?'} avis`;
  checks.push({
    id: 'reviews',
    label: 'Avis balisés sur le site (AggregateRating)',
    status: hasRating && backed ? 'ok' : audit.jsRendered && !hasRating ? 'unknown' : 'fail',
    points: hasRating && backed ? 3 : hasRating ? 1 : 0,
    max: audit.jsRendered && !hasRating ? 0 : 3,
    evidence: hasRating
      ? backed
        ? `Le balisage déclare ${declared}, appuyé par ${reviewNodes.length ? `${reviewNodes.length} avis balisé(s) sur la page` : `un lien vers ${reviewLinks.join(', ')}`}.`
        : `Le balisage de la page déclare ${declared}, mais la page ne contient aucun avis balisé (0 nœud Review) ni aucun lien vers une plateforme d'avis. Nous ne validons pas ce chiffre : nous rapportons ce que votre site affirme.`
      : audit.jsRendered
        ? 'Page rendue en JS : balisage des avis non vérifiable.'
        : `Aucun AggregateRating dans le HTML. Liens vers des plateformes d'avis trouvés : ${reviewLinks.length ? reviewLinks.join(', ') : 'aucun'}.`,
    flag:
      hasRating && backed
        ? undefined
        : hasRating
          ? `Votre site déclare une note de ${declared} dans son balisage, sans qu'aucun avis ne l'appuie sur la page. Une note auto-déclarée non justifiée expose à une pénalité Google pour balisage trompeur, et aucune IA ne peut la recouper : à corriger ou à retirer.`
          : audit.jsRendered
            ? undefined
            : "Vos avis ne sont balisés nulle part sur votre site (AggregateRating absent) : même excellents et nombreux, ils ne sont pas rattachables à votre entité par une IA.",
    why: 'Un avis non balisé reste lisible par un humain, mais invisible comme signal structuré. Un avis balisé sans preuve est un risque.',
  });
  facts.push(
    hasRating
      ? `Le balisage du site DÉCLARE ${declared} — ${backed ? `appuyé par ${reviewNodes.length} avis balisé(s) / ${reviewLinks.length} lien(s) plateforme.` : "SANS aucun avis balisé ni lien vers une plateforme sur la page : chiffre invérifiable, ne jamais le reprendre à notre compte."}`
      : `Aucun AggregateRating dans le HTML lu. ${reviewLinks.length ? `Liens vers plateformes d'avis : ${reviewLinks.join(', ')}.` : "Aucun lien vers une plateforme d'avis sur les pages lues."}`,
  );
  facts.push(
    "RAPPEL : nous ne pouvons PAS voir la fiche Google Business ni les avis Google. Ne jamais dire que l'entreprise n'a pas d'avis, ni qu'elle n'a pas de fiche Google.",
  );

  /* ── 6. NAP visible en clair ── */
  const tel = findTelLink(html) || findPhone(text);
  const addr = findPostalAddress(text);
  const email = findEmail(html);
  const napVisible = Boolean(tel && addr);
  if (!audit.jsRendered) {
    checks.push({
      id: 'nap-visible',
      label: 'Téléphone et adresse visibles sur le site',
      status: napVisible ? 'ok' : 'fail',
      points: napVisible ? 3 : tel || addr ? 1 : 0,
      max: 3,
      evidence: `Téléphone : ${tel || 'introuvable'} — Adresse postale : ${addr || 'introuvable'} — Email : ${email || 'introuvable'} (sur ${pagesFetched.length} page(s) lue(s)).`,
      flag: napVisible
        ? undefined
        : `${!tel && !addr ? 'Ni téléphone ni adresse postale' : !tel ? 'Aucun numéro de téléphone' : 'Aucune adresse postale'} lisible sur les pages analysées : l'IA ne peut pas ancrer votre entreprise à un lieu joignable.`,
      why: "La cohérence Nom / Adresse / Téléphone est le premier critère de validation d'une entreprise locale.",
    });
    facts.push(`NAP en clair — téléphone : ${tel || 'ABSENT'} ; adresse : ${addr || 'ABSENTE'} ; email : ${email || 'ABSENT'}.`);
  }

  /* ── 7. robots.txt et crawlers IA ── */
  const origin = new URL(finalUrl).origin;
  const robots = await get(`${origin}/robots.txt`, 6000);
  let robotsStatus: CheckStatus = 'unknown';
  let robotsEvidence = `robots.txt non récupérable (${robots.status ?? robots.error}) — non concluant.`;
  let robotsFlag: string | undefined;
  let robotsPoints = 0;
  let robotsMax = 0;

  // Un sitemap peut être déclaré dans robots.txt à une autre adresse que
  // /sitemap.xml : on le récupère avant de conclure quoi que ce soit.
  const declaredSitemaps: string[] = robots.ok
    ? [...robots.body.matchAll(/^\s*sitemap:\s*(\S+)/gim)].map((m) => m[1].trim()).slice(0, 2)
    : [];

  if (robots.ok && robots.body) {
    const body = robots.body.toLowerCase();
    const blocked = new Set<string>();
    for (const group of body.split(/\n(?=user-agent:)/i)) {
      if (!/disallow:\s*\/\s*(\n|$)/i.test(group)) continue;
      for (const m of group.matchAll(/user-agent:\s*([^\n\r]+)/gi)) {
        const a = m[1].trim();
        if (AI_BOTS.includes(a)) blocked.add(a);
        if (a === '*') blocked.add('* (tous les robots)');
      }
    }
    robotsMax = 3;
    robotsStatus = blocked.size ? 'fail' : 'ok';
    robotsPoints = blocked.size ? 0 : 3;
    robotsEvidence = blocked.size
      ? `${origin}/robots.txt bloque : ${[...blocked].join(', ')}.`
      : `${origin}/robots.txt lu : aucun blocage des crawlers d'IA (GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot…).`;
    robotsFlag = blocked.size
      ? `Votre robots.txt interdit l'accès à ${[...blocked].join(', ')} — vous fermez littéralement la porte aux moteurs d'IA.`
      : undefined;
    facts.push(robotsEvidence);
  } else {
    facts.push(
      `robots.txt : ${robots.status === 404 ? 'absent (404)' : `non récupérable (${robots.status ?? robots.error})`} — non concluant, ne rien en conclure.`,
    );
  }
  checks.push({
    id: 'robots',
    label: "Accès des crawlers d'IA (robots.txt)",
    status: robotsStatus,
    points: robotsPoints,
    max: robotsMax,
    evidence: robotsEvidence,
    flag: robotsFlag,
    why: 'Si GPTBot ou PerplexityBot sont bloqués, aucune optimisation ne peut compenser.',
  });

  /* ── 8. sitemap : celui déclaré dans robots.txt, sinon /sitemap.xml ── */
  const sitemapCandidates = [...declaredSitemaps, `${origin}/sitemap.xml`];
  let sitemapUrl = '';
  let lastSitemap: Awaited<ReturnType<typeof get>> | null = null;
  for (const candidate of sitemapCandidates) {
    const r = await get(candidate, 6000);
    lastSitemap = r;
    if (r.ok && /<(urlset|sitemapindex)/i.test(r.body)) {
      sitemapUrl = r.finalUrl;
      break;
    }
  }
  const sitemapOk = Boolean(sitemapUrl);
  const sitemapKnown = sitemapOk || lastSitemap?.status === 404;
  checks.push({
    id: 'sitemap',
    label: 'sitemap.xml',
    status: sitemapOk ? 'ok' : sitemapKnown ? 'fail' : 'unknown',
    points: sitemapOk ? 2 : 0,
    max: sitemapKnown ? 2 : 0,
    evidence: sitemapOk
      ? `${sitemapUrl} présent et valide${declaredSitemaps.length ? ' (déclaré dans robots.txt)' : ''}.`
      : sitemapKnown
        ? `Aucun sitemap valide sur ${sitemapCandidates.join(' ni ')} (404).`
        : `Sitemap non récupérable (${lastSitemap?.status ?? lastSitemap?.error}) — non concluant.`,
    flag:
      sitemapOk || !sitemapKnown
        ? undefined
        : "Pas de sitemap.xml : les robots doivent deviner la structure de votre site au lieu qu'on la leur donne.",
    why: 'Un sitemap accélère et fiabilise la découverte de vos pages.',
  });
  if (sitemapKnown) facts.push(sitemapOk ? `sitemap présent : ${sitemapUrl}.` : `Aucun sitemap trouvé (${sitemapCandidates.join(', ')}).`);

  /* ── Réseaux sociaux liés (information, pas un reproche) ── */
  const socials = socialLinks(html);
  if (socials.length) facts.push(`Réseaux sociaux liés depuis le site : ${socials.join(', ')}.`);

  /* ── Profil : ce que le site dit de l'entreprise ──
     Sert à proposer la requête à tester au lieu de la demander. Rien n'est
     déduit dans le dos de l'utilisateur : la proposition lui est soumise. */
  const namedNode = findNode(
    nodes,
    (n) => typeof n.name === 'string' && typesOf([n]).some((x) => LOCAL_TYPES.test(x)),
  );
  const localityNode = findNode(nodes, (n) => typeof n.addressLocality === 'string');
  // La ville ne se déduit QUE d'une adresse déjà validée par findPostalAddress
  // (qui écarte les années : "© 2025 Machin SNC" se lisait sinon comme le code
  // postal 2025 de la ville "Machin SNC").
  const cityFromText = addr.match(/\b(?:CH-|FR-)?\d{4,5}\s+([A-ZÀ-Ü][\wÀ-ÿ'’-]+(?:[- ][A-ZÀ-Ü][\wÀ-ÿ'’-]+){0,2})/);
  const businessName = (namedNode?.name as string) || meta(html, 'og:site_name') || '';
  // La ville annoncée dans le titre ou la description ("… à Genève") : c'est
  // le marché que le site revendique auprès des prospects. C'est une hypothèse,
  // jamais un constat : elle ne sert qu'à proposer une requête que
  // l'utilisateur valide.
  const cityFromHeadline = (() => {
    const m = `${t}. ${desc}`.match(
      /(?:^|[\s,])(?:à|a|sur|en|proche de|près de)\s+([A-ZÀ-Ü][\wÀ-ÿ'’-]{2,}(?:[-\s][A-ZÀ-Ü][\wÀ-ÿ'’-]+){0,2})/,
    );
    if (!m) return '';
    const first = normalizeForCompare(m[1]).split(' ')[0];
    return NON_CITY_WORDS.has(first) ? '' : m[1].trim();
  })();
  // La ville revendiquée en titre prime sur l'adresse administrative : un site
  // qui titre "Sorties à Genève" avec un siège à Nyon vise des prospects
  // genevois — proposer "… à Nyon" serait aussi faux que la raison sociale.
  const cityCandidate = (
    cityFromHeadline ||
    (localityNode?.addressLocality as string) ||
    cityFromText?.[1] ||
    ''
  ).trim();
  // Dernier filet : une raison sociale n'est pas une ville.
  const cityLooksLikeCompany =
    /\b(snc|sa|sarl|s[àa]rl|sas|sasu|eurl|gmbh|ag|ltd|llc|inc|srl|spa|group|groupe|company|cie|store|shop)\b/i.test(cityCandidate) ||
    (Boolean(businessName) && normalizeForCompare(cityCandidate) === normalizeForCompare(businessName));
  const services = nodes
    .filter((n) => {
      const ts = typesOf([n]);
      return ts.includes('Service') || ts.includes('Offer');
    })
    .map((n) => (typeof n.name === 'string' ? n.name.trim() : ''))
    .filter(Boolean)
    .slice(0, 8);
  // Le contenu réel de la page d'accueil (titres + texte visible), tronqué :
  // il sert de contexte au LLM de reformulation pour comprendre ce que
  // l'entreprise VEND. Un titre du genre "Sorties & Vie Nocturne à Genève"
  // faisait sinon croire que l'activité était "sorties nocturnes" alors que le
  // site vend un abonnement à des offres dans les bars.
  const headings = [...home.body.matchAll(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/gi)]
    .map((m) => stripTags(m[1]))
    .filter(Boolean)
    .slice(0, 12);
  const pageText = [headings.join(' · '), homeText].filter(Boolean).join(' — ').slice(0, 2200);
  audit.profile = {
    name: businessName,
    title: t,
    description: desc,
    city: cityLooksLikeCompany ? '' : cityCandidate,
    types: localTypes.length ? localTypes : schemaTypes,
    services: [...new Set(services)],
    pageText,
  };

  /* ── Score technique, normalisé sur les seuls contrôles concluants ── */
  const earned = checks.reduce((s, c) => s + c.points, 0);
  const max = checks.reduce((s, c) => s + c.max, 0);
  audit.tech = {
    earned: max > 0 ? Math.round((earned / max) * TECH_MAX) : 0,
    max: TECH_MAX,
    measured: max > 0,
  };

  return audit;
}
