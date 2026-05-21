import { MetadataRoute } from 'next';
import { SITE_URL } from '../lib/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ─── All crawlers: allow everything ───
      {
        userAgent: '*',
        allow: '/',
      },
      // ─── Google ───
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
      // ─── OpenAI (ChatGPT) ───
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      // ─── Anthropic (Claude) ───
      {
        userAgent: 'ClaudeBot',
        allow: '/',
      },
      // ─── Anthropic (Claude Web) ───
      {
        userAgent: 'anthropic-ai',
        allow: '/',
      },
      // ─── Perplexity ───
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      // ─── Google Gemini / AI training ───
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
      // ─── ChatGPT user browsing ───
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      // ─── Bing / Microsoft Copilot ───
      {
        userAgent: 'Bingbot',
        allow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
