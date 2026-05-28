import type { Category, LanguageCode, PostCluster, ProcessedPost, SentimentLabel, SocialPost } from '@/lib/types';

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'been',
  'but',
  'by',
  'for',
  'from',
  'have',
  'has',
  'he',
  'her',
  'his',
  'i',
  'if',
  'in',
  'is',
  'it',
  'my',
  'of',
  'on',
  'or',
  'our',
  'rt',
  'so',
  'that',
  'the',
  'their',
  'to',
  'was',
  'we',
  'with',
  'you',
  'your',
  'this',
  'today',
  'will'
]);

const POSITIVE_WORDS = ['good', 'smooth', 'clear', 'helpful', 'fast', 'quick', 'priority', 'better', 'accurate', 'clean', 'efficient'];
const NEGATIVE_WORDS = ['delay', 'delayed', 'scam', 'fraud', 'fake', 'problem', 'issue', 'reject', 'rejected', 'slow', 'urgent', 'warning'];

const CATEGORY_RULES: Array<{ category: Category; keywords: string[] }> = [
  { category: 'Application', keywords: ['application', 'apply', 'fresh passport', 'new passport', 'documents', 'form'] },
  { category: 'Renewal', keywords: ['renewal', 'renew', 'expired', 'expiring', 'booklet', 'reissue'] },
  { category: 'Appointments', keywords: ['appointment', 'slot', 'slots', 'psk', 'psb', 'service centre', 'service center'] },
  { category: 'Tatkal', keywords: ['tatkal', 'urgent', 'express'] },
  { category: 'Visa & Travel Issues', keywords: ['visa', 'travel', 'airport', 'immigration', 'flight', 'boarding'] },
  { category: 'Government Announcements', keywords: ['government', 'official', 'announcement', 'ministry', 'passport seva', 'counters'] },
  { category: 'Scams/Fraud', keywords: ['scam', 'fraud', 'fake', 'phishing', 'agent', 'otp'] },
  { category: 'News', keywords: ['news', 'breaking', 'report', 'update', 'headline'] },
  { category: 'Personal Experiences', keywords: ['i got', 'my passport', 'we got', 'personal experience', 'my renewal'] }
];

const LANGUAGE_TOKENS: Record<LanguageCode, Record<string, string>> = {
  en: {
    passport: 'passport',
    renewal: 'renewal',
    application: 'application',
    appointment: 'appointment',
    slot: 'slot',
    visa: 'visa',
    travel: 'travel',
    scam: 'scam',
    fraud: 'fraud',
    urgent: 'urgent'
  },
  hi: {
    passport: 'पासपोर्ट',
    renewal: 'नवीनीकरण',
    application: 'आवेदन',
    appointment: 'अपॉइंटमेंट',
    slot: 'स्लॉट',
    visa: 'वीज़ा',
    travel: 'यात्रा',
    scam: 'धोखाधड़ी',
    fraud: 'फर्जीवाड़ा',
    urgent: 'तत्काल'
  },
  pa: {
    passport: 'ਪਾਸਪੋਰਟ',
    renewal: 'ਨਵੀਨੀਕਰਨ',
    application: 'ਅਰਜ਼ੀ',
    appointment: 'ਮੁਲਾਕਾਤ',
    slot: 'ਸਲਾਟ',
    visa: 'ਵੀਜ਼ਾ',
    travel: 'ਯਾਤਰਾ',
    scam: 'ਧੋਖਾਧੜੀ',
    fraud: 'ਫਰਾਡ',
    urgent: 'ਤੁਰੰਤ'
  },
  es: {
    passport: 'pasaporte',
    renewal: 'renovación',
    application: 'solicitud',
    appointment: 'cita',
    slot: 'turno',
    visa: 'visa',
    travel: 'viaje',
    scam: 'estafa',
    fraud: 'fraude',
    urgent: 'urgente'
  },
  fr: {
    passport: 'passeport',
    renewal: 'renouvellement',
    application: 'demande',
    appointment: 'rendez-vous',
    slot: 'créneau',
    visa: 'visa',
    travel: 'voyage',
    scam: 'arnaque',
    fraud: 'fraude',
    urgent: 'urgent'
  },
  de: {
    passport: 'Reisepass',
    renewal: 'Verlängerung',
    application: 'Antrag',
    appointment: 'Termin',
    slot: 'Slot',
    visa: 'Visum',
    travel: 'Reise',
    scam: 'Betrug',
    fraud: 'Betrug',
    urgent: 'dringend'
  },
  ar: {
    passport: 'جواز السفر',
    renewal: 'تجديد',
    application: 'طلب',
    appointment: 'موعد',
    slot: 'خانة',
    visa: 'تأشيرة',
    travel: 'سفر',
    scam: 'احتيال',
    fraud: 'تزوير',
    urgent: 'عاجل'
  },
  zh: {
    passport: '护照',
    renewal: '续签',
    application: '申请',
    appointment: '预约',
    slot: '名额',
    visa: '签证',
    travel: '旅行',
    scam: '骗局',
    fraud: '欺诈',
    urgent: '紧急'
  },
  ru: {
    passport: 'паспорт',
    renewal: 'продление',
    application: 'заявление',
    appointment: 'запись',
    slot: 'слот',
    visa: 'виза',
    travel: 'поездка',
    scam: 'мошенничество',
    fraud: 'обман',
    urgent: 'срочно'
  },
  ja: {
    passport: 'パスポート',
    renewal: '更新',
    application: '申請',
    appointment: '予約',
    slot: '枠',
    visa: 'ビザ',
    travel: '旅行',
    scam: '詐欺',
    fraud: '不正',
    urgent: '緊急'
  }
};

const LANGUAGE_NAMES: Record<LanguageCode, string> = {
  en: 'English',
  hi: 'Hindi',
  pa: 'Punjabi',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  ar: 'Arabic',
  zh: 'Chinese',
  ru: 'Russian',
  ja: 'Japanese'
};

export const LANGUAGE_ORDER: LanguageCode[] = ['en', 'hi', 'pa', 'es', 'fr', 'de', 'ar', 'zh', 'ru', 'ja'];

export const LANGUAGE_LABELS = LANGUAGE_ORDER.map((code) => ({ code, label: LANGUAGE_NAMES[code] }));

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[@#][\w-]+/g, ' ')
    .replace(/[^\p{L}\p{N}\s]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(value: string): string[] {
  return normalizeText(value)
    .split(' ')
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word));
}

function countMatches(text: string, keywords: string[]): number {
  const normalized = normalizeText(text);
  return keywords.reduce((score, keyword) => score + (normalized.includes(normalizeText(keyword)) ? 1 : 0), 0);
}

export function detectCategory(post: SocialPost): Category {
  const text = `${post.content} ${post.creator} ${post.handle}`;
  const scores = CATEGORY_RULES.map((rule) => ({ category: rule.category, score: countMatches(text, rule.keywords) }));
  const top = scores.sort((left, right) => right.score - left.score)[0];
  return top && top.score > 0 ? top.category : 'General';
}

export function detectSentiment(post: SocialPost): SentimentLabel {
  const text = normalizeText(post.content);
  let score = 0;

  for (const word of POSITIVE_WORDS) {
    if (text.includes(word)) score += 1;
  }

  for (const word of NEGATIVE_WORDS) {
    if (text.includes(word)) score -= 1;
  }

  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return 'neutral';
}

export function detectGibberish(post: SocialPost): boolean {
  const text = post.content.trim();
  const normalized = normalizeText(text);
  const letters = (text.match(/\p{L}/gu) ?? []).length;
  const digits = (text.match(/\p{N}/gu) ?? []).length;
  const symbols = (text.match(/[^\p{L}\p{N}\s]/gu) ?? []).length;
  const words = tokenize(text);

  if (text.length < 12) return true;
  if (/https?:\/\//.test(text) && words.length <= 3) return true;
  if (/([a-z])\1{3,}/i.test(text)) return true;
  if (letters === 0) return true;
  if (normalized.split(' ').filter(Boolean).length <= 2 && digits > 2) return true;
  if (symbols > letters && letters < 20) return true;
  if (words.length < 4 && /\b(free|click|urgent|slot)\b/i.test(text)) return true;
  return false;
}

function extractKeywords(post: SocialPost): string[] {
  const tokens = tokenize(`${post.content} ${post.creator} ${post.region}`);
  const counts = new Map<string, number>();

  for (const token of tokens) {
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 5)
    .map(([word]) => word);
}

function summarize(post: SocialPost, category: Category, keywords: string[]): string {
  const sentences = post.content
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  const lead = sentences[0] ?? post.content;
  const prefix = category === 'General' ? 'Passport post' : `${category} update`;
  const keywordTail = keywords.length ? ` Keywords: ${keywords.slice(0, 3).join(', ')}.` : '.';
  const summary = `${prefix}: ${lead}`.replace(/\s+/g, ' ').trim();
  return truncate(summary + keywordTail, 30);
}

function truncate(value: string, words: number): string {
  const parts = value.split(/\s+/).filter(Boolean);
  if (parts.length <= words) return value;
  return `${parts.slice(0, words).join(' ')}...`;
}

function translateText(text: string, language: LanguageCode): string {
  if (language === 'en') return text;
  const dictionary = LANGUAGE_TOKENS[language];
  const replacements = new Map(Object.entries(dictionary).map(([key, value]) => [key, value]));

  return text.replace(/\b[a-z]+\b/gi, (match) => {
    const replacement = replacements.get(match.toLowerCase());
    return replacement ?? match;
  });
}

function jaccard(left: string[], right: string[]): number {
  const setLeft = new Set(left);
  const setRight = new Set(right);
  const intersection = [...setLeft].filter((token) => setRight.has(token)).length;
  const union = new Set([...setLeft, ...setRight]).size;
  return union === 0 ? 0 : intersection / union;
}

function groupLabel(post: ProcessedPost): string {
  return `${post.category}: ${post.keywords.slice(0, 2).join(' ') || post.creator}`.trim();
}

export function processPost(post: SocialPost): ProcessedPost {
  const category = detectCategory(post);
  const keywords = extractKeywords(post);
  const gibberish = detectGibberish(post);
  const sentiment = detectSentiment(post);

  return {
    ...post,
    gibberish,
    category,
    sentiment,
    summary: summarize(post, category, keywords),
    keywords,
    translations: Object.fromEntries(LANGUAGE_ORDER.map((language) => [language, translateText(post.content, language)])) as Record<LanguageCode, string>,
    clusterId: post.clusterHint
  };
}

export function clusterPosts(posts: ProcessedPost[]): PostCluster[] {
  const clusterMap = new Map<string, ProcessedPost[]>();

  for (const post of posts) {
    const hint = post.clusterId || post.category;
    const bucket = clusterMap.get(hint) ?? [];
    bucket.push(post);
    clusterMap.set(hint, bucket);
  }

  const clusters: PostCluster[] = [];

  for (const [hint, bucket] of clusterMap.entries()) {
    const topicVectors = bucket.map((post) => tokenize(`${post.content} ${post.summary} ${post.category}`));
    const representative = bucket[0];
    const score = bucket.length > 1 ? topicVectors.slice(1).reduce((total, vector) => total + jaccard(topicVectors[0], vector), 0) / (bucket.length - 1) : 1;

    clusters.push({
      id: hint,
      label: groupLabel(representative),
      category: representative.category,
      summary: representative.summary,
      score: Number(score.toFixed(2)),
      posts: bucket.sort((left, right) => +new Date(right.publishedAt) - +new Date(left.publishedAt))
    });
  }

  return clusters.sort((left, right) => right.posts.length - left.posts.length || right.score - left.score);
}

export function processPosts(posts: SocialPost[]): { posts: ProcessedPost[]; clusters: PostCluster[]; removed: number } {
  const processed = posts.map(processPost).sort((left, right) => +new Date(right.publishedAt) - +new Date(left.publishedAt));
  const filtered = processed.filter((post) => !post.gibberish);
  const clusters = clusterPosts(filtered);

  return {
    posts: filtered,
    clusters,
    removed: processed.length - filtered.length
  };
}

export function previewTranslation(post: ProcessedPost, language: LanguageCode): string {
  return post.translations[language] ?? post.content;
}
