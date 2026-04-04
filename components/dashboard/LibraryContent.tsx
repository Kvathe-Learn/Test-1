'use client';

import { useState } from 'react';
import {
  FolderOpen,
  ImageIcon,
  Layers,
  Film,
  FileText,
  Search,
  Filter,
  Copy,
  Trash2,
  Clock,
  Hash,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import { cn, formatRelativeTime } from '@/lib/utils';

interface Slide {
  id: string;
  order: number;
  text?: string;
  imageUrl?: string;
}

interface ContentItem {
  id: string;
  title: string;
  type: string;
  status: string;
  platform: string;
  caption?: string;
  hashtags: string[];
  hookText?: string;
  script?: string;
  mediaUrls: string[];
  thumbnailUrl?: string;
  topic?: string;
  createdAt: string;
  slides: Slide[];
}

const typeIcons: Record<string, React.ElementType> = {
  IMAGE_POST: ImageIcon,
  CAROUSEL: Layers,
  STORY: Film,
  REEL: Film,
  TIKTOK: Film,
};

const typeLabels: Record<string, string> = {
  IMAGE_POST: 'Image Post',
  CAROUSEL: 'Carousel',
  STORY: 'Story',
  REEL: 'Reel',
  TIKTOK: 'TikTok',
};

const statusColors: Record<string, string> = {
  DRAFT: 'badge-amber',
  READY: 'badge-green',
  POSTED: 'badge-blue',
  ARCHIVED: 'badge-red',
};

export function LibraryContent({ contents }: { contents: ContentItem[] }) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [items, setItems] = useState(contents);

  const filtered = items.filter((item) => {
    const matchSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.caption?.toLowerCase().includes(search.toLowerCase()) ||
      item.topic?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'ALL' || item.type === filterType;
    const matchStatus = filterStatus === 'ALL' || item.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this content?')) return;
    try {
      await fetch(`/api/content?id=${id}`, { method: 'DELETE' });
      setItems(items.filter((i) => i.id !== id));
    } catch {
      // silent
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await fetch('/api/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      setItems(items.map((i) => (i.id === id ? { ...i, status } : i)));
    } catch {
      // silent
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <FolderOpen className="w-6 h-6 text-brand-400" />
          Content Library
        </h1>
        <p className="text-surface-400 mt-1">
          {items.length} pieces of content
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search content..."
            className="input-field pl-10"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="input-field w-auto min-w-[140px]"
        >
          <option value="ALL">All Types</option>
          <option value="IMAGE_POST">Image Post</option>
          <option value="CAROUSEL">Carousel</option>
          <option value="REEL">Reel</option>
          <option value="TIKTOK">TikTok</option>
          <option value="STORY">Story</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input-field w-auto min-w-[130px]"
        >
          <option value="ALL">All Status</option>
          <option value="DRAFT">Drafts</option>
          <option value="READY">Ready</option>
          <option value="POSTED">Posted</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {/* Content List */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <FileText className="w-12 h-12 text-surface-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-400">No content found</h3>
          <p className="text-sm text-surface-600 mt-1">
            {items.length === 0
              ? 'Generate some content in the Studio to get started'
              : 'Try adjusting your filters'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const Icon = typeIcons[item.type] || FileText;
            const isExpanded = expandedId === item.id;

            return (
              <div key={item.id} className="card">
                {/* Header Row */}
                <div
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex-shrink-0 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-surface-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white truncate">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-surface-500">
                        {typeLabels[item.type]}
                      </span>
                      <span className="text-surface-700">•</span>
                      <span className="text-xs text-surface-500">
                        {item.platform}
                      </span>
                      <span className="text-surface-700">•</span>
                      <span className="flex items-center gap-1 text-xs text-surface-500">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(item.createdAt)}
                      </span>
                    </div>
                  </div>
                  <span className={statusColors[item.status]}>
                    {item.status.toLowerCase()}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-surface-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-surface-500" />
                  )}
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
                    {/* Caption */}
                    {item.caption && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-surface-500 uppercase">
                            Caption
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(item.caption!);
                            }}
                            className="btn-ghost p-1"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-sm text-surface-300 whitespace-pre-wrap">
                          {item.caption}
                        </p>
                      </div>
                    )}

                    {/* Slides */}
                    {item.slides.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-surface-500 uppercase">
                          Slides ({item.slides.length})
                        </span>
                        <div className="mt-2 space-y-2">
                          {item.slides.map((slide) => (
                            <div
                              key={slide.id}
                              className="p-3 rounded-lg bg-white/5 flex items-start gap-3"
                            >
                              <span className="w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                                {slide.order}
                              </span>
                              <p className="text-xs text-surface-300 whitespace-pre-wrap">
                                {slide.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Script */}
                    {item.script && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-surface-500 uppercase">
                            Script
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(item.script!);
                            }}
                            className="btn-ghost p-1"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-sm text-surface-300 whitespace-pre-wrap">
                          {item.script}
                        </p>
                      </div>
                    )}

                    {/* Hashtags */}
                    {item.hashtags.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-surface-500 uppercase flex items-center gap-1">
                            <Hash className="w-3 h-3" /> Hashtags
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(
                                item.hashtags
                                  .map((h) => (h.startsWith('#') ? h : `#${h}`))
                                  .join(' ')
                              );
                            }}
                            className="btn-ghost p-1"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.hashtags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[11px]"
                            >
                              #{tag.replace(/^#/, '')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <select
                        value={item.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusChange(item.id, e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="input-field w-auto text-sm py-1.5"
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="READY">Ready</option>
                        <option value="POSTED">Posted</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                      <div className="flex-1" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="btn-danger text-xs px-3 py-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
