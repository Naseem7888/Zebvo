import { NextRequest } from 'next/server';
import { getSeedPosts } from '@/lib/data';
import { buildPdf } from '@/lib/export';
import { filterPosts, sortPosts } from '@/lib/filters';
import { processPosts } from '@/lib/nlp';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const processed = processPosts(getSeedPosts());
  const filtered = sortPosts(
    filterPosts(processed.posts, {
      q: searchParams.get('q') ?? undefined,
      platform: (searchParams.get('platform') as 'all' | undefined) ?? 'all',
      category: (searchParams.get('category') as 'all' | undefined) ?? 'all',
      language: (searchParams.get('language') as 'all' | undefined) ?? 'all',
      sentiment: (searchParams.get('sentiment') as 'all' | undefined) ?? 'all',
      region: searchParams.get('region') ?? undefined,
      creator: searchParams.get('creator') ?? undefined,
      sort: (searchParams.get('sort') as 'recent' | 'engagement' | 'views' | 'sentiment' | null) ?? 'recent',
      direction: (searchParams.get('direction') as 'asc' | 'desc' | null) ?? 'desc'
    }),
    (searchParams.get('sort') as 'recent' | 'engagement' | 'views' | 'sentiment' | null) ?? 'recent',
    (searchParams.get('direction') as 'asc' | 'desc' | null) ?? 'desc'
  );

  const pdf = await buildPdf(filtered);
  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="zebvo-passport-posts.pdf"'
    }
  });
}
