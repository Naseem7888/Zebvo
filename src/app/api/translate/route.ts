import { NextRequest, NextResponse } from 'next/server';
import { getSeedPosts } from '@/lib/data';
import { previewTranslation, processPost } from '@/lib/nlp';
import type { LanguageCode } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { text?: string; language?: LanguageCode; postId?: string };
  const language = body.language ?? 'en';
  const post = body.postId ? getSeedPosts().find((candidate) => candidate.id === body.postId) : undefined;

  if (post) {
    const processed = processPost(post);
    return NextResponse.json({ language, translated: previewTranslation(processed, language) });
  }

  if (!body.text) {
    return NextResponse.json({ error: 'Missing text or postId' }, { status: 400 });
  }

  return NextResponse.json({ language, translated: previewTranslation(processPost({
    id: 'manual',
    platform: 'x',
    creator: 'Manual Input',
    handle: '@manual',
    region: 'Unknown',
    country: 'Unknown',
    language: 'en',
    publishedAt: new Date().toISOString(),
    content: body.text,
    engagement: { likes: 0, comments: 0, shares: 0, views: 0 },
    sourceUrl: '',
    clusterHint: 'manual'
  }), language) });
}
