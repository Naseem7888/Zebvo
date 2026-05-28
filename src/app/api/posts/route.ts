import { NextRequest, NextResponse } from 'next/server';
import { getSeedPosts } from '@/lib/data';
import { filterPosts, sortPosts } from '@/lib/filters';
import { processPosts } from '@/lib/nlp';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const raw = getSeedPosts();
  const processed = processPosts(raw);

  const filters = {
    q: searchParams.get('q') ?? undefined,
    platform: (searchParams.get('platform') as 'all' | undefined) ?? 'all',
    category: (searchParams.get('category') as 'all' | undefined) ?? 'all',
    language: (searchParams.get('language') as 'all' | undefined) ?? 'all',
    sentiment: (searchParams.get('sentiment') as 'all' | undefined) ?? 'all',
    region: searchParams.get('region') ?? undefined,
    creator: searchParams.get('creator') ?? undefined,
    sort: (searchParams.get('sort') as 'recent' | 'engagement' | 'views' | 'sentiment' | null) ?? 'recent',
    direction: (searchParams.get('direction') as 'asc' | 'desc' | null) ?? 'desc'
  };

  const filtered = sortPosts(filterPosts(processed.posts, filters), filters.sort, filters.direction);
  const filteredClusters = processed.clusters
    .map((cluster) => ({ ...cluster, posts: cluster.posts.filter((post) => filtered.some((candidate) => candidate.id === post.id)) }))
    .filter((cluster) => cluster.posts.length > 0);

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    stats: {
      totalRaw: raw.length,
      totalMeaningful: processed.posts.length,
      removedGibberish: processed.removed,
      clusterCount: filteredClusters.length
    },
    posts: filtered,
    clusters: filteredClusters
  });
}
