export type Platform =
  | 'x'
  | 'facebook'
  | 'instagram'
  | 'linkedin'
  | 'youtube'
  | 'reddit'
  | 'tiktok'
  | 'threads';

export type LanguageCode = 'en' | 'hi' | 'pa' | 'es' | 'fr' | 'de' | 'ar' | 'zh' | 'ru' | 'ja';

export type SentimentLabel = 'positive' | 'neutral' | 'negative';

export type Category =
  | 'Application'
  | 'Renewal'
  | 'Appointments'
  | 'Tatkal'
  | 'Visa & Travel Issues'
  | 'Government Announcements'
  | 'Scams/Fraud'
  | 'News'
  | 'Personal Experiences'
  | 'General';

export interface SocialPost {
  id: string;
  platform: Platform;
  creator: string;
  handle: string;
  region: string;
  country: string;
  language: LanguageCode;
  publishedAt: string;
  content: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  sourceUrl: string;
  clusterHint: string;
}

export interface ProcessedPost extends SocialPost {
  gibberish: boolean;
  category: Category;
  sentiment: SentimentLabel;
  summary: string;
  keywords: string[];
  translations: Record<LanguageCode, string>;
  clusterId: string;
}

export interface PostCluster {
  id: string;
  label: string;
  category: Category;
  summary: string;
  score: number;
  posts: ProcessedPost[];
}
