import type { Category, LanguageCode, Platform, ProcessedPost, SentimentLabel } from '@/lib/types';

export interface PostFilterParams {
  q?: string;
  platform?: Platform | 'all';
  category?: Category | 'all';
  language?: LanguageCode | 'all';
  sentiment?: SentimentLabel | 'all';
  region?: string;
  creator?: string;
  sort?: 'recent' | 'engagement' | 'views' | 'sentiment';
  direction?: 'asc' | 'desc';
}

function includesText(source: string, value: string): boolean {
  return source.toLowerCase().includes(value.toLowerCase());
}

export function filterPosts(posts: ProcessedPost[], params: PostFilterParams): ProcessedPost[] {
  const query = params.q?.trim().toLowerCase();

  return posts.filter((post) => {
    if (params.platform && params.platform !== 'all' && post.platform !== params.platform) return false;
    if (params.category && params.category !== 'all' && post.category !== params.category) return false;
    if (params.language && params.language !== 'all' && post.language !== params.language) return false;
    if (params.sentiment && params.sentiment !== 'all' && post.sentiment !== params.sentiment) return false;
    if (params.region && !includesText(post.region, params.region)) return false;
    if (params.creator && !includesText(post.creator, params.creator) && !includesText(post.handle, params.creator)) return false;

    if (!query) return true;

    const haystacks = [post.content, post.summary, ...Object.values(post.translations), post.creator, post.handle, post.region, post.country, post.category, post.platform];
    return haystacks.some((value) => includesText(value, query));
  });
}

export function sortPosts(posts: ProcessedPost[], sort: PostFilterParams['sort'] = 'recent', direction: PostFilterParams['direction'] = 'desc'): ProcessedPost[] {
  const sorted = [...posts].sort((left, right) => {
    switch (sort) {
      case 'engagement':
        return scoreEngagement(left) - scoreEngagement(right);
      case 'views':
        return left.engagement.views - right.engagement.views;
      case 'sentiment':
        return sentimentScore(left.sentiment) - sentimentScore(right.sentiment);
      case 'recent':
      default:
        return +new Date(left.publishedAt) - +new Date(right.publishedAt);
    }
  });

  return direction === 'desc' ? sorted.reverse() : sorted;
}

function scoreEngagement(post: ProcessedPost): number {
  return post.engagement.likes + post.engagement.comments * 2 + post.engagement.shares * 3 + post.engagement.views / 100;
}

function sentimentScore(sentiment: SentimentLabel): number {
  if (sentiment === 'positive') return 2;
  if (sentiment === 'neutral') return 1;
  return 0;
}
