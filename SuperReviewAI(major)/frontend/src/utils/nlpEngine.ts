import { AspectExtraction, DataQualityReport, Review, SentimentType } from '../types';

// Predefined stop words list
export const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can\'t', 'cannot', 'could',
  'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for',
  'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s',
  'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m',
  'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t',
  'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours',
  'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t',
  'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there',
  'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t',
  'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s',
  'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
]);

// Known aspect keywords mapped to canonical aspect names
export const ASPECT_TAXONOMY: Record<string, string[]> = {
  battery: ['battery', 'charge', 'charging', 'battery life', 'drain', 'charger', 'mah', 'power bank', 'standby', 'power'],
  camera: ['camera', 'photo', 'picture', 'lens', 'video', 'sensor', 'low light', 'zoom', 'megapixel', 'portrait', 'selfie'],
  display: ['display', 'screen', 'oled', 'amoled', 'brightness', 'refresh rate', 'resolution', 'glare', 'viewing angle', 'panel', 'colors'],
  price: ['price', 'cost', 'expensive', 'cheap', 'value', 'worth', 'overpriced', 'affordable', 'budget', 'bargain', 'deal', 'money'],
  delivery: ['delivery', 'shipping', 'arrived', 'courier', 'late', 'fast', 'package', 'delivered', 'ontime', 'delay', 'transit'],
  packaging: ['packaging', 'box', 'wrapped', 'sealed', 'damaged box', 'unboxing', 'bubble wrap', 'dented'],
  quality: ['quality', 'build', 'durability', 'material', 'sturdy', 'flimsy', 'plastic', 'premium', 'defect', 'broke', 'broken', 'hardware'],
  performance: ['performance', 'speed', 'fast', 'slow', 'lag', 'smooth', 'snappy', 'freezing', 'crash', 'processor', 'ram', 'benchmark'],
  'customer support': ['support', 'customer service', 'representative', 'refund', 'replacement', 'warranty', 'return', 'rma', 'helpdesk', 'agent'],
  usability: ['usability', 'easy to use', 'interface', 'setup', 'ui', 'app', 'controls', 'intuitive', 'confusing', 'ergonomics', 'software'],
  service: ['service', 'staff', 'server', 'host', 'hospitality', 'friendly', 'rude', 'attentive'],
  cleanliness: ['clean', 'cleanliness', 'dirty', 'hygiene', 'sanitized', 'tidy'],
  ambience: ['ambience', 'atmosphere', 'decor', 'quiet', 'noisy', 'vibe'],
  food: ['food', 'meal', 'coffee', 'breakfast', 'dinner', 'taste', 'menu', 'dish'],
  room: ['room', 'bed', 'shower', 'bathroom', 'mattress', 'suite'],
  location: ['location', 'nearby', 'central', 'neighborhood', 'walkable'],
  parking: ['parking', 'garage', 'car park', 'valet'],
  'wait time': ['wait', 'waiting', 'queue', 'reservation', 'check-in', 'checkout']
};

// Positive & negative lexicons
const POSITIVE_WORDS = new Set([
  'great', 'excellent', 'amazing', 'perfect', 'love', 'best', 'good', 'superb', 'fast', 'fantastic',
  'stellar', 'crisp', 'bright', 'reliable', 'smooth', 'impressive', 'solid', 'recommend', 'flawless',
  'easy', 'pleased', 'worth', 'durable', 'snappy', 'clear', 'happy', 'sturdy', 'exceptional', 'outstanding'
]);

const NEGATIVE_WORDS = new Set([
  'terrible', 'horrible', 'awful', 'bad', 'poor', 'slow', 'hate', 'worst', 'broken', 'broke', 'lag',
  'laggy', 'drain', 'drains', 'draining', 'overpriced', 'defect', 'defective', 'flimsy', 'crash',
  'crashes', 'crashing', 'delay', 'delayed', 'late', 'useless', 'garbage', 'disappointed', 'disappointing',
  'fail', 'failed', 'fails', 'unresponsive', 'annoying', 'scratch', 'hot', 'overheating', 'regret'
]);

const NEGATION_WORDS = new Set(['not', 'no', 'never', 'hardly', 'barely', 'scarcely', 'cannot', 'cant', 'without', 'neither']);

/**
 * Clean and normalize raw review text
 */
export function preprocessText(raw: string): { cleaned: string; tokens: string[] } {
  if (!raw) return { cleaned: '', tokens: [] };

  // 1. Remove HTML tags
  let text = raw.replace(/<[^>]*>/g, ' ');

  // 2. Remove URLs
  text = text.replace(/https?:\/\/\S+|www\.\S+/gi, ' ');

  // 3. Normalize whitespace & unicode
  text = text.replace(/\s+/g, ' ').trim();

  // 4. Tokenization (lowercase, strip non-alphanumeric except apostrophes)
  const rawTokens = text.toLowerCase().match(/\b[a-z0-9']+\b/g) || [];

  // 5. ML Tokens (minus common stopwords)
  const tokens = rawTokens.filter(t => !STOP_WORDS.has(t));

  return {
    cleaned: text,
    tokens
  };
}

/** Mask common personal and payment identifiers before review text is stored or analyzed. */
export function abstractConfidentialContent(text: string): string {
  return text
    .replace(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/gi, '[REDACTED_EMAIL]')
    .replace(/(?:\+?\d[\d\s().-]{7,}\d)/g, '[REDACTED_PHONE]')
    .replace(/\b(?:\d[ -]*?){13,19}\b/g, '[REDACTED_PAYMENT]');
}

/**
 * Compute sentiment of a text or snippet
 */
export function analyzeSentiment(text: string): { sentiment: SentimentType; confidence: number } {
  const tokens = (text.toLowerCase().match(/\b[a-z0-9']+\b/g) || []);
  let score = 0;
  let matches = 0;

  for (let i = 0; i < tokens.length; i++) {
    const word = tokens[i];
    const prevWord = i > 0 ? tokens[i - 1] : '';
    const isNegated = NEGATION_WORDS.has(prevWord);

    if (POSITIVE_WORDS.has(word)) {
      score += isNegated ? -1.5 : 1.0;
      matches++;
    } else if (NEGATIVE_WORDS.has(word)) {
      score += isNegated ? 0.8 : -1.2;
      matches++;
    }
  }

  if (matches === 0) {
    return { sentiment: 'neutral', confidence: 0.65 };
  }

  const confidence = Math.min(0.98, Math.max(0.70, 0.65 + (Math.abs(score) / (matches + 2)) * 0.35));

  if (score > 0.4) {
    return { sentiment: 'positive', confidence: Number(confidence.toFixed(2)) };
  } else if (score < -0.4) {
    return { sentiment: 'negative', confidence: Number(confidence.toFixed(2)) };
  } else {
    return { sentiment: 'neutral', confidence: Number(confidence.toFixed(2)) };
  }
}

/**
 * Extract aspects, sentiment, and evidence spans from review text
 */
export function extractAspects(text: string): AspectExtraction[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  const sentences = text.split(/(?<=[.!?])\s+/);
  const extractions: AspectExtraction[] = [];
  const seenAspects = new Set<string>();

  for (const [aspectName, keywords] of Object.entries(ASPECT_TAXONOMY)) {
    for (const keyword of keywords) {
      const idx = lower.indexOf(keyword);
      if (idx !== -1 && !seenAspects.has(aspectName)) {
        // Find enclosing sentence for evidence
        const sentence = sentences.find(s => s.toLowerCase().includes(keyword)) || text.substring(Math.max(0, idx - 30), Math.min(text.length, idx + keyword.length + 40));
        const { sentiment, confidence } = analyzeSentiment(sentence);

        // Find character span
        const start = text.indexOf(sentence);
        const end = start >= 0 ? start + sentence.length : idx + keyword.length;

        extractions.push({
          aspect: aspectName,
          sentiment,
          confidence,
          evidence: sentence.trim(),
          span: [Math.max(0, start), Math.min(text.length, end)]
        });

        seenAspects.add(aspectName);
        break; // matched this aspect category
      }
    }
  }

  return extractions;
}

/**
 * Generate a pseudo-dense semantic embedding (128-dim) for cosine similarity retrieval
 */
export function generateDenseEmbedding(text: string): number[] {
  const dim = 128;
  const embedding = new Array(dim).fill(0);
  const lower = text.toLowerCase();
  const tokens = lower.match(/\b[a-z0-9]+\b/g) || [];

  if (tokens.length === 0) return embedding;

  for (const token of tokens) {
    // Hash token to dimensions with subword n-grams
    let hash = 0;
    for (let i = 0; i < token.length; i++) {
      hash = (hash << 5) - hash + token.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % dim;
    const weight = STOP_WORDS.has(token) ? 0.2 : 1.0;
    embedding[idx] += weight;

    // Second projection
    const idx2 = (Math.abs(hash >> 3) + 7) % dim;
    embedding[idx2] += weight * 0.5;
  }

  // L2 Normalize
  const norm = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0)) || 1;
  return embedding.map(v => Number((v / norm).toFixed(4)));
}

/**
 * Cosine similarity between two vector embeddings
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return Math.max(0, Math.min(1, dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))));
}

/**
 * Validate incoming raw records and generate a quality report
 */
export function validateAndNormalizeDataset(rawRecords: any[]): { reviews: Review[]; report: DataQualityReport } {
  const reviews: Review[] = [];
  const logs: string[] = [];
  let malformedCount = 0;
  let missingFieldsCount = 0;
  let invalidRatingsCount = 0;
  const seenHashes = new Set<string>();
  let duplicatesDetected = 0;
  let totalChars = 0;
  const languagesDetected: Record<string, number> = { en: 0 };
  const sourceDistribution: Record<string, number> = {};

  rawRecords.forEach((record, index) => {
    // 1. Text check
    const rawText = abstractConfidentialContent(String(record.review_text || record.text || record.content || record.review || ''));
    if (!rawText || typeof rawText !== 'string' || rawText.trim().length < 5) {
      malformedCount++;
      logs.push(`Row #${index + 1}: Skipped due to missing/empty review_text`);
      return;
    }

    // 2. Duplicate detection
    const textHash = rawText.trim().toLowerCase();
    if (seenHashes.has(textHash)) {
      duplicatesDetected++;
      logs.push(`Row #${index + 1}: Duplicate review text detected`);
      // We can still process or flag duplicate
    }
    seenHashes.add(textHash);

    // 3. Rating validation
    let rating = Number(record.rating ?? record.stars ?? record.score ?? 4);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      invalidRatingsCount++;
      rating = Math.max(1, Math.min(5, Math.round(rating) || 3));
      logs.push(`Row #${index + 1}: Invalid rating corrected to ${rating}`);
    }

    // 4. Missing fields
    if (!record.product_name && !record.product_id) {
      missingFieldsCount++;
    }

    const { cleaned, tokens } = preprocessText(rawText);
    const aspects = extractAspects(rawText);
    const { sentiment, confidence } = analyzeSentiment(rawText);
    const embedding = generateDenseEmbedding(rawText);

    const source = (record.source || 'Direct Store') as Review['source'];
    sourceDistribution[source] = (sourceDistribution[source] || 0) + 1;
    languagesDetected['en'] = (languagesDetected['en'] || 0) + 1;
    totalChars += rawText.length;

    // Derived topic tagging based on aspects
    const topics: string[] = [];
    aspects.forEach(a => {
      if (a.aspect === 'battery') topics.push('Topic 1: Battery Performance & Charging');
      if (a.aspect === 'delivery' || a.aspect === 'shipping' || a.aspect === 'packaging') topics.push('Topic 2: Logistics & Packaging Integrity');
      if (a.aspect === 'performance' || a.aspect === 'usability') topics.push('Topic 3: Software Stability & User Experience');
      if (a.aspect === 'quality' || a.aspect === 'camera' || a.aspect === 'display') topics.push('Topic 4: Hardware & Build Quality');
      if (a.aspect === 'customer support' || a.aspect === 'price') topics.push('Topic 5: Value & Support RMA Experience');
    });
    if (topics.length === 0) topics.push('Topic 6: General Customer Impressions');

    const review: Review = {
      review_id: record.review_id || `REV-${(index + 1001).toString()}`,
      product_id: record.product_id || `PROD-${(index % 6) + 1}`,
      product_name: record.product_name || record.business_name || record.venue || 'Unspecified Business',
      user_id: record.user_id || `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      review_text: rawText,
      raw_text: rawText,
      cleaned_text: cleaned,
      tokens,
      rating,
      review_title: record.review_title || record.title || 'Customer Review',
      review_date: record.review_date || record.date || new Date(Date.now() - (index * 86400000 * 2)).toISOString().split('T')[0],
      category: record.category || record.business_type || 'General Customer Feedback',
      verified_purchase: record.verified_purchase !== undefined ? Boolean(record.verified_purchase) : true,
      helpful_votes: Number(record.helpful_votes || record.helpful || Math.floor(Math.random() * 12)),
      source: source,
      sentiment,
      sentiment_confidence: confidence,
      aspects,
      topics: Array.from(new Set(topics)),
      embedding,
      language: 'en',
      word_count: tokens.length
    };

    reviews.push(review);
  });

  const total = rawRecords.length || 1;
  const qualityScore = Math.max(0, Math.min(100, Math.round(
    100 - (malformedCount * 30 + duplicatesDetected * 10 + missingFieldsCount * 5 + invalidRatingsCount * 5) / total * 100
  )));

  const report: DataQualityReport = {
    total_records: rawRecords.length,
    valid_records: reviews.length,
    malformed_count: malformedCount,
    missing_fields_count: missingFieldsCount,
    duplicates_detected: duplicatesDetected,
    invalid_ratings_count: invalidRatingsCount,
    avg_character_length: Math.round(totalChars / (reviews.length || 1)),
    quality_score: qualityScore,
    languages_detected: languagesDetected,
    source_distribution: sourceDistribution,
    validation_logs: logs.slice(0, 50)
  };

  return { reviews, report };
}
