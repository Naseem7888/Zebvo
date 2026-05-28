'use client';

import { useEffect, useState, useTransition } from 'react';
import { ArrowDownAZ, Download, Globe2, Search, SlidersHorizontal } from 'lucide-react';
import { LANGUAGE_LABELS } from '@/lib/nlp';
import type { Category, LanguageCode, PostCluster, ProcessedPost, SentimentLabel, Platform } from '@/lib/types';
import { PostCard } from '@/components/post-card';

type SortKey = 'recent' | 'engagement' | 'views' | 'sentiment';

interface DashboardPayload {
  generatedAt: string;
  stats: {
    totalRaw: number;
    totalMeaningful: number;
    removedGibberish: number;
    clusterCount: number;
  };
  posts: ProcessedPost[];
  clusters: PostCluster[];
}

interface QueryState {
  q: string;
  platform: 'all' | Platform;
  category: 'all' | Category;
  language: 'all' | LanguageCode;
  sentiment: 'all' | SentimentLabel;
  region: string;
  creator: string;
  sort: SortKey;
  direction: 'asc' | 'desc';
}

const initialQuery: QueryState = {
  q: '',
  platform: 'all',
  category: 'all',
  language: 'all',
  sentiment: 'all',
  region: '',
  creator: '',
  sort: 'recent',
  direction: 'desc'
};

export function Dashboard() {
  const [query, setQuery] = useState<QueryState>(initialQuery);
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [translations, setTranslations] = useState<Record<string, LanguageCode>>({});
  const [, startTransition] = useTransition();

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      setLoading(true);
      const params = new URLSearchParams();
      if (query.q) params.set('q', query.q);
      if (query.platform !== 'all') params.set('platform', query.platform);
      if (query.category !== 'all') params.set('category', query.category);
      if (query.language !== 'all') params.set('language', query.language);
      if (query.sentiment !== 'all') params.set('sentiment', query.sentiment);
      if (query.region) params.set('region', query.region);
      if (query.creator) params.set('creator', query.creator);
      params.set('sort', query.sort);
      params.set('direction', query.direction);

      fetch(`/api/posts?${params.toString()}`, { signal: controller.signal })
        .then(async (response) => {
          if (!response.ok) throw new Error(`Request failed: ${response.status}`);
          return (await response.json()) as DashboardPayload;
        })
        .then((payload) => {
          setData(payload);
          setError(null);
          setLoading(false);
          setTranslations((current) => {
            const next = { ...current };
            for (const post of payload.posts) {
              next[post.id] = next[post.id] ?? 'en';
            }
            return next;
          });
        })
        .catch((fetchError: Error) => {
          if (fetchError.name === 'AbortError') return;
          setError(fetchError.message);
          setLoading(false);
        });
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query]);

  const updateQuery = (key: keyof QueryState, value: string) => {
    startTransition(() => {
      setQuery((current) => ({ ...current, [key]: value } as QueryState));
    });
  };

  const handleTranslation = async (postId: string, language: LanguageCode) => {
    setTranslations((current) => ({ ...current, [postId]: language }));
    await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, language })
    });
  };

  const exportHref = (type: 'csv' | 'pdf') => {
    const params = new URLSearchParams();
    if (query.q) params.set('q', query.q);
    if (query.platform !== 'all') params.set('platform', query.platform);
    if (query.category !== 'all') params.set('category', query.category);
    if (query.language !== 'all') params.set('language', query.language);
    if (query.sentiment !== 'all') params.set('sentiment', query.sentiment);
    if (query.region) params.set('region', query.region);
    if (query.creator) params.set('creator', query.creator);
    params.set('sort', query.sort);
    params.set('direction', query.direction);
    return `/api/export/${type}?${params.toString()}`;
  };

  const categories = data?.posts.map((post) => post.category) ?? [];
  const categoriesLabel = new Set(categories);
  const platforms = data?.posts.map((post) => post.platform) ?? [];
  const clusterCount = data?.clusters.length ?? 0;

  return (
    <main className="dashboard-shell">
      <section className="hero-panel">
        <div className="hero-panel__copy">
          <p className="eyebrow">Zebvo Newswire Private Limited</p>
          <h1>Social Media Scraper Dashboard</h1>
          <p className="hero-description">
            Passport-related content from the last 24 hours, cleaned for gibberish, grouped into clusters, translated in one click, and ready for CSV or PDF export.
          </p>
        </div>
        <div className="hero-panel__actions">
          <a className="action-button action-button--primary" href={exportHref('csv')}>
            <Download size={16} /> Export CSV
          </a>
          <a className="action-button" href={exportHref('pdf')}>
            <Download size={16} /> Export PDF
          </a>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard label="Raw posts" value={data?.stats.totalRaw ?? 0} note="Seeded across major platforms" />
        <StatCard label="Meaningful posts" value={data?.stats.totalMeaningful ?? 0} note="After gibberish filtering" />
        <StatCard label="Clusters" value={clusterCount} note="Similar posts merged together" />
        <StatCard label="Filtered out" value={data?.stats.removedGibberish ?? 0} note="Spam and bot-like items" />
      </section>

      <section className="toolbar">
        <label className="search-box">
          <Search size={16} />
          <input value={query.q} onChange={(event) => updateQuery('q', event.target.value)} placeholder="Search original and translated content" />
        </label>

        <div className="toolbar__filters">
          <select value={query.platform} onChange={(event) => updateQuery('platform', event.target.value)}>
            <option value="all">All platforms</option>
            <option value="x">X</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="youtube">YouTube</option>
            <option value="reddit">Reddit</option>
            <option value="tiktok">TikTok</option>
            <option value="threads">Threads</option>
          </select>
          <select value={query.category} onChange={(event) => updateQuery('category', event.target.value)}>
            <option value="all">All categories</option>
            <option value="Application">Application</option>
            <option value="Renewal">Renewal</option>
            <option value="Appointments">Appointments</option>
            <option value="Tatkal">Tatkal</option>
            <option value="Visa & Travel Issues">Visa & Travel Issues</option>
            <option value="Government Announcements">Government Announcements</option>
            <option value="Scams/Fraud">Scams/Fraud</option>
            <option value="News">News</option>
            <option value="Personal Experiences">Personal Experiences</option>
          </select>
          <select value={query.language} onChange={(event) => updateQuery('language', event.target.value)}>
            <option value="all">All languages</option>
            {LANGUAGE_LABELS.map((language) => (
              <option key={language.code} value={language.code}>
                {language.label}
              </option>
            ))}
          </select>
          <select value={query.sentiment} onChange={(event) => updateQuery('sentiment', event.target.value)}>
            <option value="all">All sentiment</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
          <input value={query.region} onChange={(event) => updateQuery('region', event.target.value)} placeholder="Region or country" />
          <input value={query.creator} onChange={(event) => updateQuery('creator', event.target.value)} placeholder="Creator or handle" />
          <select value={query.sort} onChange={(event) => updateQuery('sort', event.target.value)}>
            <option value="recent">Most recent</option>
            <option value="engagement">Engagement</option>
            <option value="views">Views</option>
            <option value="sentiment">Sentiment</option>
          </select>
          <select value={query.direction} onChange={(event) => updateQuery('direction', event.target.value)}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </section>

      <section className="insight-strip">
        <span><SlidersHorizontal size={14} /> {categoriesLabel.size} categories</span>
        <span><Globe2 size={14} /> {new Set(platforms).size} platforms</span>
        <span><ArrowDownAZ size={14} /> Live sorted results</span>
        <span>Generated {data ? new Date(data.generatedAt).toLocaleTimeString() : '...'}</span>
      </section>

      {error ? <div className="error-banner">{error}</div> : null}

      <section className="clusters-grid">
        {(data?.clusters ?? []).map((cluster) => (
          <article className="cluster-card" key={cluster.id}>
            <div className="cluster-card__head">
              <div>
                <p className="eyebrow">Cluster</p>
                <h2>{cluster.label}</h2>
              </div>
              <span className="tag tag--category">{cluster.posts.length} posts</span>
            </div>
            <p className="muted">{cluster.summary}</p>
            <div className="cluster-card__meta">
              <span>{cluster.category}</span>
              <span>Score {cluster.score}</span>
            </div>
          </article>
        ))}
      </section>

      {loading ? <div className="loading-state">Refreshing dashboard...</div> : null}

      <section className="posts-grid">
        {(data?.posts ?? []).map((post) => (
          <PostCard
            key={post.id}
            post={post}
            language={translations[post.id] ?? 'en'}
            onLanguageChange={(postId, language) => setTranslations((current) => ({ ...current, [postId]: language }))}
            onTranslate={handleTranslation}
          />
        ))}
      </section>
    </main>
  );
}

function StatCard({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <article className="stat-card">
      <p className="eyebrow">{label}</p>
      <strong>{value}</strong>
      <span>{note}</span>
    </article>
  );
}
