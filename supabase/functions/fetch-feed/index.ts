import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FeedItem {
  title: string;
  url: string | null;
  guid: string | null;
  author: string | null;
  published_at: string | null;
  thumbnail_url: string | null;
  summary: string | null;
  content: string | null;
}

// Extract text content between XML tags
function getTagContent(xml: string, tag: string): string | null {
  const cdataPattern = new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`, 'i');
  const cdataMatch = xml.match(cdataPattern);
  if (cdataMatch) return cdataMatch[1].trim();

  const pattern = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
  const match = xml.match(pattern);
  if (match) return match[1].trim();

  return null;
}

// Extract attribute value from a tag
function getAttr(xml: string, tag: string, attr: string): string | null {
  const pattern = new RegExp(`<${tag}[^>]*?${attr}=["']([^"']*?)["']`, 'i');
  const match = xml.match(pattern);
  return match ? match[1] : null;
}

// Extract href from Atom link element
function getAtomLink(entryXml: string, rel?: string): string | null {
  const relAttr = rel ? `rel=["']${rel}["']` : '';
  const pattern = new RegExp(`<link[^>]*${relAttr}[^>]*href=["']([^"']*?)["']`, 'i');
  const match = entryXml.match(pattern);
  if (match) return match[1];
  if (rel) return getAtomLink(entryXml);
  return null;
}

// Extract first image URL from HTML content
function extractImageFromHtml(html: string): string | null {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

// Extract thumbnail from various RSS media extensions
function extractThumbnail(itemXml: string): string | null {
  let thumb = getAttr(itemXml, 'media:thumbnail', 'url');
  if (thumb) return thumb;

  const mediaContentMatch = itemXml.match(/<media:content[^>]*medium=["']image["'][^>]*url=["']([^"']*?)["']/i);
  if (mediaContentMatch) return mediaContentMatch[1];

  const mediaTypeMatch = itemXml.match(/<media:content[^>]*type=["']image[^"']*["'][^>]*url=["']([^"']*?)["']/i);
  if (mediaTypeMatch) return mediaTypeMatch[1];

  thumb = getAttr(itemXml, 'media:content', 'url');
  if (thumb) return thumb;

  const enclosureMatch = itemXml.match(/<enclosure[^>]*type=["']image[^"']*["'][^>]*url=["']([^"']*?)["']/i);
  if (enclosureMatch) return enclosureMatch[1];

  const enclosureUrl = getAttr(itemXml, 'enclosure', 'url');
  if (enclosureUrl && /\.(jpg|jpeg|png|gif|webp)/i.test(enclosureUrl)) return enclosureUrl;

  return null;
}

// Check if text is not a useful description (bare URL, URL-heavy, or too short)
function isUrlOnly(text: string | null): boolean {
  if (!text) return true;
  const stripped = text.replace(/<[^>]*>/g, '').trim();
  if (!stripped || stripped.length < 10) return true;
  // Bare URL check
  try {
    const u = new URL(stripped);
    if (u.protocol === 'http:' || u.protocol === 'https:') return true;
  } catch { /* not a bare URL */ }
  // URL-heavy text (e.g. HN "Article URL: https://... Comments URL: https://...")
  const urls = stripped.match(/https?:\/\/\S+/g) || [];
  const urlChars = urls.join('').length;
  if (urlChars > stripped.length * 0.5) return true;
  return false;
}

// Fetch Open Graph metadata from an article's web page
interface OgMetadata {
  ogImage: string | null;
  ogDescription: string | null;
}

async function fetchOgMetadata(articleUrl: string, timeoutMs = 4000): Promise<OgMetadata> {
  const result: OgMetadata = { ogImage: null, ogDescription: null };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const resp = await fetch(articleUrl, {
      headers: {
        'User-Agent': 'Grimoire RSS Reader/1.0',
        'Accept': 'text/html',
      },
      signal: controller.signal,
      redirect: 'follow',
    });

    clearTimeout(timer);
    if (!resp.ok) return result;

    // Stream-read only the first ~50KB (meta tags live in <head>)
    const reader = resp.body?.getReader();
    if (!reader) return result;

    let html = '';
    const decoder = new TextDecoder();
    const maxBytes = 50_000;

    while (html.length < maxBytes) {
      const { done, value } = await reader.read();
      if (done) break;
      html += decoder.decode(value, { stream: true });
    }
    reader.cancel();

    // Extract og:image (try both attribute orderings)
    const ogImg =
      html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ??
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    if (ogImg) {
      result.ogImage = ogImg[1];
    } else {
      const twImg =
        html.match(/<meta[^>]*(?:name|property)=["']twitter:image["'][^>]*content=["']([^"']+)["']/i) ??
        html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*(?:name|property)=["']twitter:image["']/i);
      if (twImg) result.ogImage = twImg[1];
    }

    // Extract og:description
    const ogDesc =
      html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ??
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i);
    if (ogDesc) {
      result.ogDescription = ogDesc[1];
    } else {
      const metaDesc =
        html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ??
        html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
      if (metaDesc) result.ogDescription = metaDesc[1];
    }
  } catch {
    // Timeout, network error, or abort — return whatever we have
  }

  return result;
}

// Enrich articles missing thumbnails or with URL-only summaries using OG data
async function enrichArticlesWithOgData(articles: FeedItem[]): Promise<FeedItem[]> {
  const MAX_CONCURRENT = 5;

  const needsEnrichment = articles
    .map((article, index) => ({
      index,
      article,
      needsThumbnail: !article.thumbnail_url,
      needsSummary: isUrlOnly(article.summary),
      needs: !article.thumbnail_url || isUrlOnly(article.summary),
    }))
    .filter(item => item.needs && item.article.url);

  if (needsEnrichment.length === 0) return articles;

  const enriched = [...articles];

  for (let i = 0; i < needsEnrichment.length; i += MAX_CONCURRENT) {
    const batch = needsEnrichment.slice(i, i + MAX_CONCURRENT);
    const results = await Promise.allSettled(
      batch.map(item => fetchOgMetadata(item.article.url!))
    );

    results.forEach((result, batchIndex) => {
      if (result.status !== 'fulfilled') return;
      const og = result.value;
      const { index, needsThumbnail, needsSummary } = batch[batchIndex];

      if (needsThumbnail && og.ogImage) {
        enriched[index] = { ...enriched[index], thumbnail_url: og.ogImage };
      }
      if (needsSummary && og.ogDescription) {
        enriched[index] = { ...enriched[index], summary: og.ogDescription };
      }
    });
  }

  return enriched;
}

// Split XML into items/entries using matchAll
function splitItems(xml: string, tag: string): string[] {
  const pattern = new RegExp(`<${tag}[\\s>][\\s\\S]*?</${tag}>`, 'gi');
  return [...xml.matchAll(pattern)].map(m => m[0]);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid "url" parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch(url, {
      headers: { 'User-Agent': 'Grimoire RSS Reader/1.0' },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Failed to fetch feed: ${response.status} ${response.statusText}` }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const xml = await response.text();

    const isAtom = xml.includes('<feed') && xml.includes('xmlns="http://www.w3.org/2005/Atom"');
    const isRss = xml.includes('<rss') || (xml.includes('<channel') && !isAtom);

    if (!isAtom && !isRss) {
      return new Response(
        JSON.stringify({ error: 'The URL does not appear to be a valid RSS or Atom feed.' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let feedTitle = '';
    let feedDescription = '';
    const articles: FeedItem[] = [];

    if (isAtom) {
      feedTitle = getTagContent(xml, 'title') ?? 'Untitled Feed';
      feedDescription = getTagContent(xml, 'subtitle') ?? '';

      const entries = splitItems(xml, 'entry');
      for (const entry of entries) {
        const contentText = getTagContent(entry, 'content');
        const summaryText = getTagContent(entry, 'summary');
        const entryUrl = getAtomLink(entry, 'alternate') ?? getAtomLink(entry);

        let thumbnail = extractThumbnail(entry);
        if (!thumbnail && contentText) {
          thumbnail = extractImageFromHtml(contentText);
        }
        if (!thumbnail && summaryText) {
          thumbnail = extractImageFromHtml(summaryText);
        }

        articles.push({
          title: getTagContent(entry, 'title') ?? 'Untitled',
          url: entryUrl,
          guid: getTagContent(entry, 'id') ?? entryUrl,
          author: getTagContent(entry, 'name'),
          published_at: getTagContent(entry, 'published') ?? getTagContent(entry, 'updated'),
          thumbnail_url: thumbnail,
          summary: summaryText,
          content: contentText ?? summaryText,
        });
      }
    } else {
      feedTitle = getTagContent(xml, 'title') ?? 'Untitled Feed';
      feedDescription = getTagContent(xml, 'description') ?? '';

      const items = splitItems(xml, 'item');
      for (const item of items) {
        const descriptionText = getTagContent(item, 'description');
        const contentEncoded = getTagContent(item, 'content:encoded');

        let thumbnail = extractThumbnail(item);
        if (!thumbnail && contentEncoded) {
          thumbnail = extractImageFromHtml(contentEncoded);
        }
        if (!thumbnail && descriptionText) {
          thumbnail = extractImageFromHtml(descriptionText);
        }

        articles.push({
          title: getTagContent(item, 'title') ?? 'Untitled',
          url: getTagContent(item, 'link'),
          guid: getTagContent(item, 'guid') ?? getTagContent(item, 'link'),
          author: getTagContent(item, 'dc:creator') ?? getTagContent(item, 'author'),
          published_at: getTagContent(item, 'pubDate') ?? getTagContent(item, 'dc:date'),
          thumbnail_url: thumbnail,
          summary: descriptionText,
          content: contentEncoded ?? descriptionText,
        });
      }
    }

    // Enrich articles missing thumbnails or with URL-only summaries
    const enrichedArticles = await enrichArticlesWithOgData(articles);

    const feedUrl = new URL(url);
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${feedUrl.hostname}&sz=32`;

    return new Response(
      JSON.stringify({
        feed: {
          title: feedTitle,
          description: feedDescription,
          favicon_url: faviconUrl,
        },
        articles: enrichedArticles,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
