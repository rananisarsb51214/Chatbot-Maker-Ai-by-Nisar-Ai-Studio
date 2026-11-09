import { KnowledgeChunk, db } from './db.js';

export interface RetrievedChunk {
  chunk: KnowledgeChunk;
  score: number;
  sourceName: string;
}

/**
 * Validates that a URL does NOT target internal/private networks or cloud metadata.
 * Blocks SSRF (Server-Side Request Forgery) attacks.
 */
export function isSafePublicUrl(inputUrl: string): { safe: boolean; reason?: string; url?: URL } {
  try {
    const parsed = new URL(inputUrl);

    // Only allow http and https
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { safe: false, reason: 'Only HTTP and HTTPS protocols are allowed.' };
    }

    const hostname = parsed.hostname.toLowerCase();

    // Check against localhost and internal naming
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.internal') ||
      hostname.endsWith('.local')
    ) {
      return { safe: false, reason: 'Access to localhost and internal hostnames is prohibited.' };
    }

    // IP address checks
    // IPv4 patterns: 127.*, 10.*, 192.168.*, 172.16-31.*, 169.254.* (AWS/GCP metadata)
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const ipMatch = hostname.match(ipv4Regex);
    if (ipMatch) {
      const octet1 = parseInt(ipMatch[1], 10);
      const octet2 = parseInt(ipMatch[2], 10);

      // Loopback
      if (octet1 === 127) {
        return { safe: false, reason: 'Loopback IP addresses are blocked.' };
      }
      // Zero network
      if (octet1 === 0) {
        return { safe: false, reason: 'Invalid address 0.0.0.0.' };
      }
      // 10.0.0.0/8
      if (octet1 === 10) {
        return { safe: false, reason: 'Private network (10.0.0.0/8) is blocked.' };
      }
      // 192.168.0.0/16
      if (octet1 === 192 && octet2 === 168) {
        return { safe: false, reason: 'Private network (192.168.0.0/16) is blocked.' };
      }
      // 172.16.0.0/12
      if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) {
        return { safe: false, reason: 'Private network (172.16.0.0/12) is blocked.' };
      }
      // 169.254.0.0/16 (Link-local & cloud metadata like AWS/GCP 169.254.169.254)
      if (octet1 === 169 && octet2 === 254) {
        return { safe: false, reason: 'Link-local & Cloud metadata endpoints are blocked.' };
      }
    }

    // IPv6 loopback / unique local
    if (hostname === '::1' || hostname === '[::1]' || hostname.startsWith('fe80:') || hostname.startsWith('fc00:')) {
      return { safe: false, reason: 'Private IPv6 addresses are blocked.' };
    }

    return { safe: true, url: parsed };
  } catch {
    return { safe: false, reason: 'Invalid URL format.' };
  }
}

/**
 * Fetch and extract text from a safe public URL
 */
export async function fetchUrlContent(targetUrl: string): Promise<string> {
  const check = isSafePublicUrl(targetUrl);
  if (!check.safe) {
    throw new Error(check.reason || 'Unsafe URL requested.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ChatbotMakerAI-Bot/1.0; +https://nisaraistudio.com)'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    return cleanHtmlToText(html);
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Connection timed out while fetching URL.');
    }
    throw err;
  }
}

/**
 * Strips script tags, style tags, navigations, and HTML markup into clean readable text
 */
export function cleanHtmlToText(html: string): string {
  // Remove script and style elements
  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
  text = text.replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, ' ');
  text = text.replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, ' ');
  text = text.replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, ' ');

  // Replace block elements with linebreaks
  text = text.replace(/<\/(p|div|h1|h2|h3|h4|h5|h6|li|tr|section|article)>/gi, '\n');
  text = text.replace(/<br\s*[\/]?>/gi, '\n');

  // Strip remaining tags
  text = text.replace(/<[^>]+>/g, ' ');

  // Decode common HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Collapse excessive whitespace
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
}

/**
 * Splits document text into overlapping chunks optimal for LLM context retrieval
 */
export function chunkDocument(
  text: string,
  sourceId: string,
  chatbotId: string,
  chunkSize = 600,
  overlap = 100
): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];
  const clean = text.trim();
  if (!clean) return [];

  let start = 0;
  let chunkIdx = 0;

  while (start < clean.length) {
    let end = start + chunkSize;

    // Try not to cut in the middle of a sentence or paragraph
    if (end < clean.length) {
      const nextNewline = clean.indexOf('\n', end - 50);
      if (nextNewline !== -1 && nextNewline < end + 100) {
        end = nextNewline + 1;
      } else {
        const nextPeriod = clean.indexOf('. ', end - 50);
        if (nextPeriod !== -1 && nextPeriod < end + 80) {
          end = nextPeriod + 2;
        }
      }
    }

    const chunkContent = clean.slice(start, end).trim();
    if (chunkContent.length > 20) {
      chunks.push({
        id: `chk_${sourceId}_${chunkIdx++}`,
        sourceId,
        chatbotId,
        content: chunkContent
      });
    }

    start = end - overlap;
    if (start >= clean.length) break;
  }

  return chunks;
}

/**
 * Tokenize and normalize query or chunk text for keyword/BM25 similarity
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);
}

/**
 * Retrieve top relevant chunks for a given user query using BM25-style keyword matching
 */
export function retrieveContext(chatbotId: string, query: string, topK = 3): RetrievedChunk[] {
  const allChunks = db.getKnowledgeChunks(chatbotId);
  if (allChunks.length === 0) return [];

  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const results: RetrievedChunk[] = [];

  for (const chunk of allChunks) {
    const chunkTokens = tokenize(chunk.content);
    if (chunkTokens.length === 0) continue;

    // Calculate term overlap and term frequency
    let matches = 0;
    const tokenSet = new Set(chunkTokens);

    for (const qToken of queryTokens) {
      if (tokenSet.has(qToken)) {
        matches++;
      } else {
        // Partial substring match for technical queries
        if (chunk.content.toLowerCase().includes(qToken)) {
          matches += 0.5;
        }
      }
    }

    if (matches > 0) {
      const score = matches / Math.sqrt(chunkTokens.length + 5);
      const source = db.getKnowledgeSourceById(chunk.sourceId);
      results.push({
        chunk,
        score,
        sourceName: source?.name || 'Knowledge Source'
      });
    }
  }

  // Sort by highest score descending
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, topK);
}
