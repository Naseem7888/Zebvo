import { ExternalLink, Languages, MessageSquare, Repeat, ShieldAlert, ThumbsUp } from 'lucide-react';
import type { LanguageCode, ProcessedPost } from '@/lib/types';

interface PostCardProps {
  post: ProcessedPost;
  language: LanguageCode;
  onLanguageChange: (postId: string, language: LanguageCode) => void;
  onTranslate: (postId: string, language: LanguageCode) => void;
}

export function PostCard({ post, language, onLanguageChange, onTranslate }: PostCardProps) {
  const translation = post.translations[language] ?? post.content;

  return (
    <article className="post-card">
      <div className="post-card__top">
        <div>
          <p className="eyebrow">{post.platform.toUpperCase()} • {post.region}</p>
          <h3>{post.creator}</h3>
          <p className="muted">{post.handle} • {new Date(post.publishedAt).toLocaleString()}</p>
        </div>
        <a className="source-link" href={post.sourceUrl} target="_blank" rel="noreferrer">
          <ExternalLink size={14} /> Source
        </a>
      </div>

      <div className="tag-row">
        <span className="tag tag--category">{post.category}</span>
        <span className={`tag tag--sentiment tag--${post.sentiment}`}>{post.sentiment}</span>
        {post.gibberish ? <span className="tag tag--warning"><ShieldAlert size={12} /> filtered</span> : null}
      </div>

      <p className="summary">{post.summary}</p>

      <div className="content-box">
        <p className="content-box__label">Original</p>
        <p>{post.content}</p>
      </div>

      <div className="content-box content-box--translation">
        <div className="translation-toolbar">
          <div className="translation-toolbar__label">
            <Languages size={14} /> Translation
          </div>
          <select value={language} onChange={(event) => onLanguageChange(post.id, event.target.value as LanguageCode)}>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="pa">Punjabi</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="ar">Arabic</option>
            <option value="zh">Chinese</option>
            <option value="ru">Russian</option>
            <option value="ja">Japanese</option>
          </select>
          <button className="secondary-button" type="button" onClick={() => onTranslate(post.id, language)}>
            <Repeat size={14} /> Translate
          </button>
        </div>
        <p className="translation-text">{translation}</p>
      </div>

      <div className="post-card__metrics">
        <span><ThumbsUp size={14} /> {post.engagement.likes}</span>
        <span><MessageSquare size={14} /> {post.engagement.comments}</span>
        <span><Repeat size={14} /> {post.engagement.shares}</span>
        <span><ExternalLink size={14} /> {post.engagement.views}</span>
      </div>
    </article>
  );
}
