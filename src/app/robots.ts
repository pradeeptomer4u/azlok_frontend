import { MetadataRoute } from 'next';

const disallow = [
  '/admin/',
  '/login/',
  '/register/',
  '/cart/',
  '/checkout/',
  '/api/',
  '/private/',
  '/account/',
  '/seller/',
];

// AI / answer-engine crawlers — explicitly allowed so Azlok can be cited
// in AI Overviews (Google), ChatGPT, Perplexity, Claude, Gemini, etc.
const aiBots = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-Web',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
  'CCBot',
  'Amazonbot',
  'DuckAssistBot',
  'Meta-ExternalAgent',
  'YouBot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      ...aiBots.map((userAgent) => ({ userAgent, allow: '/', disallow })),
    ],
    sitemap: 'https://www.azlok.com/sitemap.xml',
    host: 'https://www.azlok.com',
  };
}
