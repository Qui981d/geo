import type { Metadata } from "next";
import { Inter, Bebas_Neue, Courier_Prime } from "next/font/google";
import "./globals.css";
import { SITE_URL, SITE_NAME, BRAND_NAME } from "../lib/constants";
import SkipToContent from "../components/SkipToContent";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});



const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
  weight: "400",
});

const courierPrime = Courier_Prime({
  subsets: ["latin"],
  variable: "--font-courier",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "GEO Boost — Soyez recommandé par ChatGPT, Perplexity & Gemini | Audit Gratuit",
  description: "Découvrez si ChatGPT, Perplexity et Google Gemini recommandent votre PME. 65% des recherches affichent une réponse IA en premier. Ne laissez pas l'Intelligence Artificielle envoyer vos clients chez vos concurrents. Audit GEO gratuit.",
  keywords: [
    "GEO", "Generative Engine Optimization",
    "audit visibilité IA", "visibilité ChatGPT", "visibilité Perplexity",
    "optimisation Google Gemini", "référencement IA",
    "PME visibilité intelligence artificielle",
    "recommandation ChatGPT entreprise",
    "être recommandé par les IA",
    "audit GEO gratuit", "Local Boost",
    "visibilité IA locale", "GEO Suisse Romande", "GEO Genève", "GEO Lausanne"
  ],
  authors: [{ name: BRAND_NAME, url: SITE_URL }],
  creator: BRAND_NAME,
  publisher: BRAND_NAME,
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title: "GEO Boost — L'IA recommande-t-elle vos concurrents ?",
    description: "65% des recherches Google affichent une réponse IA en premier. Découvrez si ChatGPT, Perplexity et Gemini recommandent votre PME ou vos concurrents. Audit GEO gratuit en 24h.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "fr_CH",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "GEO Boost — Audit de visibilité IA gratuit pour PME",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GEO Boost — Soyez recommandé par les IA",
    description: "L'IA vient de recommander vos concurrents. Faites l'audit gratuit et reprenez la première place.",
    creator: "@LocalBoost",
    images: [`${SITE_URL}/og-image.png`],
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "fr-CH": SITE_URL,
    },
  },
  category: "technology",
};

const faqItems = [
  {
    q: "Qu'est-ce que le Generative Engine Optimization (GEO) ?",
    a: "Le GEO (Generative Engine Optimization) est la discipline qui consiste à optimiser votre marque, vos contenus et vos entités nommées pour être explicitement recommandé par les intelligences artificielles génératives — ChatGPT, Claude, Google Gemini, Perplexity — lorsqu'un utilisateur pose une question transactionnelle ou locale comme 'Quel est le meilleur plombier à Lyon ?' ou 'Recommande-moi un comptable à Genève'."
  },
  {
    q: "Quelle est la différence entre la recherche Google classique et les moteurs IA ?",
    a: "Google affiche des liens cliquables que l'utilisateur doit trier. Les moteurs génératifs (ChatGPT, Perplexity, Gemini) synthétisent une réponse directe et recommandent une entreprise spécifique. Avec 65% des recherches Google affichant désormais une réponse IA en premier, ne pas optimiser pour les IA signifie perdre une part croissante de vos prospects."
  },
  {
    q: "Comment les intelligences artificielles choisissent-elles quelle entreprise recommander ?",
    a: "Les LLM (Large Language Models) sélectionnent les entreprises à recommander en fonction de trois critères : la densité sémantique (la richesse et la cohérence des informations disponibles sur votre marque dans des sources publiques), les avis structurés (notes Google, Trustpilot, citations dans des articles), et la fréquence de mention dans des sources d'autorité (annuaires professionnels, articles de presse, sites institutionnels)."
  },
  {
    q: "Mon entreprise apparaît-elle déjà sur ChatGPT ou Perplexity ?",
    a: "La plupart des PME de Suisse Romande n'apparaissent pas — ou apparaissent mal — dans les réponses des IA génératives. Notre audit GEO gratuit analyse votre présence réelle sur ChatGPT, Perplexity et Google Gemini en simulant des requêtes locales ciblées, et vous livre un rapport de visibilité complet sous 24 heures."
  },
  {
    q: "Combien de temps faut-il pour améliorer sa visibilité sur les IA ?",
    a: "Les premiers résultats GEO sont généralement observables en 4 à 8 semaines après la mise en place du balisage Schema.org, l'optimisation des entités nommées et la consolidation des avis clients structurés. C'est significativement plus rapide que les stratégies de visibilité classiques qui nécessitent 3 à 6 mois pour produire des effets mesurables."
  },
  {
    q: "L'audit GEO est-il vraiment gratuit ? Que comprend-il ?",
    a: "Oui, l'audit GEO initial est entièrement gratuit et sans engagement. Il comprend : l'analyse de votre présence sur ChatGPT, Perplexity et Google Gemini, un score de visibilité GEO sur 100 points, l'identification des concurrents qui vous supplantent dans les réponses IA, et un rapport prioritaire livré sous 24 heures avec les 3 actions immédiates à mettre en place."
  },
  {
    q: "Quels types d'entreprises bénéficient le plus du GEO ?",
    a: "Le GEO est particulièrement critique pour les PME avec un ancrage local : restaurateurs, avocats, comptables, médecins, artisans, agences immobilières, hôtels, cliniques, garagistes, architectes et tout professionnel dont les clients font des recherches du type 'meilleur [métier] à [ville]'. Ces requêtes conversationnelles sont exactement celles auxquelles les IA répondent avec une recommandation directe."
  },
  {
    q: "Le GEO remplace-t-il la visibilité Google classique ?",
    a: "Non, le GEO est un levier complémentaire. Il vous permet d'être recommandé par les intelligences artificielles génératives — un canal de découverte en pleine explosion qui capte de plus en plus de trafic qualifié. Investir dans le GEO aujourd'hui, c'est prendre une longueur d'avance sur vos concurrents."
  }
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    // ─── Entité Principale : Organisation ───────────────────────────
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      "name": BRAND_NAME,
      "url": SITE_URL,
      "logo": `${SITE_URL}/logo.png`,
      "description": "Agence experte en Generative Engine Optimization (GEO) pour les PME en Suisse Romande. Nous optimisons votre visibilité sur ChatGPT, Perplexity et Google Gemini.",
      "foundingDate": "2024",
      "knowsAbout": [
        "Generative Engine Optimization",
        "AI Visibility Optimization",
        "ChatGPT Business Visibility",
        "Perplexity Optimization",
        "Google Gemini Optimization",
        "Claude AI Optimization",
        "Schema.org Structured Data",
        "Large Language Models",
        "Local Business AI Optimization",
        "E-E-A-T Optimization",
        "Named Entity Optimization"
      ],
      "sameAs": [
        // TODO: ajouter les profils sociaux au déploiement
      ]
    },

    // ─── Site Web ────────────────────────────────────────────────────
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "url": SITE_URL,
      "name": SITE_NAME,
      "description": "Plateforme d'audit et d'optimisation de la visibilité des PME sur les moteurs d'intelligence artificielle (ChatGPT, Perplexity, Google Gemini, Claude).",
      "inLanguage": "fr-CH",
      "publisher": { "@id": `${SITE_URL}/#organization` },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${SITE_URL}/?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    },

    // ─── Page Web avec SpeakableSpecification (LLM vocaux) ──────────
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      "url": SITE_URL,
      "name": "GEO Boost — Audit Gratuit Generative Engine Optimization",
      "description": "Découvrez si ChatGPT, Perplexity et Google Gemini recommandent votre PME. Audit de visibilité IA gratuit, rapport livré sous 24h.",
      "inLanguage": "fr-CH",
      "isPartOf": { "@id": `${SITE_URL}/#website` },
      "about": { "@id": `${SITE_URL}/#organization` },
      "datePublished": "2025-01-15",
      "dateModified": new Date().toISOString().split('T')[0],
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".sr-only h1", ".sr-only h2", ".sr-only p"]
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Accueil",
            "item": SITE_URL
          }
        ]
      }
    },

    // ─── Service Principal : Audit GEO ───────────────────────────────
    {
      "@type": ["ProfessionalService", "LocalBusiness"],
      "@id": `${SITE_URL}/#service`,
      "name": `${BRAND_NAME} — Audit Visibilité IA & GEO`,
      "alternateName": "GEO Boost",
      "description": "Analyse complète de la présence de votre PME sur les moteurs d'intelligence artificielle (ChatGPT, Perplexity, Google Gemini). Score de visibilité GEO, identification des concurrents en position dominante, et plan d'action personnalisé.",
      "url": SITE_URL,
      "areaServed": [
        { "@type": "Country", "name": "Suisse" },
        { "@type": "AdministrativeArea", "name": "Suisse Romande" },
        { "@type": "City", "name": "Genève" },
        { "@type": "City", "name": "Lausanne" },
        { "@type": "City", "name": "Sion" },
        { "@type": "City", "name": "Martigny" },
        { "@type": "City", "name": "Nyon" },
        { "@type": "City", "name": "Montreux" },
        { "@type": "City", "name": "Yverdon-les-Bains" },
        { "@type": "City", "name": "Neuchâtel" },
        { "@type": "City", "name": "Fribourg" }
      ],
      "serviceType": [
        "Generative Engine Optimization",
        "Audit de Visibilité IA",
        "Optimisation ChatGPT",
        "Optimisation Perplexity",
        "Optimisation Google Gemini",
        "Optimisation Claude AI",
        "Stratégie Schema.org",
        "Optimisation Entités Nommées"
      ],
      "provider": { "@id": `${SITE_URL}/#organization` },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Services GEO & Visibilité IA",
        "itemListElement": [
          {
            "@type": "Offer",
            "name": "Audit GEO Gratuit",
            "description": "Analyse de votre visibilité sur ChatGPT, Gemini, Perplexity et Claude. Rapport livré sous 24h. Sans engagement.",
            "price": "0",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock",
            "priceValidUntil": "2026-12-31"
          },
          {
            "@type": "Offer",
            "name": "Optimisation GEO Complète",
            "description": "Mise en place de la stratégie Schema.org, optimisation des entités nommées, gestion des avis structurés et suivi mensuel de la visibilité IA.",
            "availability": "https://schema.org/InStock"
          }
        ]
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "47",
        "bestRating": "5",
        "worstRating": "1"
      }
    },

    // ─── HowTo : Méthodologie Audit GEO ──────────────────────────────
    {
      "@type": "HowTo",
      "@id": `${SITE_URL}/#howto`,
      "name": "Comment auditer et optimiser votre visibilité sur les IA (Audit GEO)",
      "description": "Méthodologie en 4 étapes pour analyser et améliorer la présence de votre PME dans les recommandations de ChatGPT, Perplexity et Google Gemini.",
      "totalTime": "P1D",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Analyse de Présence (LLM Probing)",
          "text": "Interrogation de ChatGPT, Perplexity AI, Google Gemini et Claude avec des dizaines de requêtes conversationnelles locales ciblées pour mesurer si votre marque est citée."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Score de Visibilité GEO sur 100 points",
          "text": "Calcul d'un score composite basé sur la densité sémantique, les avis clients structurés, les mentions dans des sources d'autorité et la cohérence NAP."
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Analyse Concurrentielle IA",
          "text": "Identification des concurrents locaux qui dominent les réponses des LLM à votre place et analyse des raisons pour lesquelles l'IA les préfère."
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Plan d'Action Personnalisé (Roadmap GEO)",
          "text": "Stratégie clé en main pour optimiser le balisage Schema.org, enrichir les entités nommées, consolider les avis clients et développer la présence dans des sources d'autorité."
        }
      ]
    },

    // ─── FAQ Page (extraction LLM & Rich Snippet Google) ─────────────
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      "mainEntity": faqItems.map(({ q, a }) => ({
        "@type": "Question",
        "name": q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": a
        }
      }))
    },

    // ─── Software Application : Scanner GEO interactif ───────────────
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#scanner`,
      "name": "GEO Boost Scanner",
      "description": "Outil interactif gratuit qui analyse en temps réel si les intelligences artificielles (ChatGPT, Perplexity, Google Gemini) recommandent votre entreprise locale.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR"
      },
      "author": { "@id": `${SITE_URL}/#organization` },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "126",
        "bestRating": "5"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${bebasNeue.variable} ${courierPrime.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Disable browser scroll restoration — always start at top */}
        <script dangerouslySetInnerHTML={{ __html: "if (typeof history !== 'undefined') history.scrollRestoration = 'manual';" }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <SkipToContent />
        {children}
      </body>
    </html>
  );
}
