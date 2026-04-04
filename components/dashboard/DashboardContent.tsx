'use client';

import Link from 'next/link';
import {
  Sparkles,
  FileText,
  ImageIcon,
  Film,
  Layers,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Edit3,
} from 'lucide-react';
import { cn, formatRelativeTime } from '@/lib/utils';

interface DashboardStats {
  totalContent: number;
  drafts: number;
  ready: number;
  posted: number;
  thisWeek: number;
}

interface ContentItem {
  id: string;
  title: string;
  type: string;
  status: string;
  platform: string;
  createdAt: string;
  caption?: string;
  thumbnailUrl?: string;
  mediaUrls: string[];
}

interface DashboardContentProps {
  stats: DashboardStats;
  recentContent: ContentItem[];
  userName: string;
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

const statusBadge: Record<string, string> = {
  DRAFT: 'badge-amber',
  READY: 'badge-green',
  POSTED: 'badge-blue',
  ARCHIVED: 'badge-red',
};

export function DashboardContent({ stats, recentContent, userName }: DashboardContentProps) {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {greeting()}, {userName} ✨
          </h1>
          <p className="text-surface-400 mt-1">
            Here&apos;s your content overview
          </p>
        </div>
        <Link href="/studio" className="btn-primary">
          <Sparkles className="w-4 h-4" />
          Create Content
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-2 text-surface-400">
            <FileText className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Total</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalContent}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 text-amber-400">
            <Edit3 className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Drafts</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.drafts}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Ready</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.ready}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 text-brand-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">This Week</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.thisWeek}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="section-title mb-4">Quick Create</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { type: 'IMAGE_POST', label: 'Image Post', icon: ImageIcon, color: 'from-blue-500 to-cyan-500' },
            { type: 'CAROUSEL', label: 'Carousel', icon: Layers, color: 'from-purple-500 to-pink-500' },
            { type: 'REEL', label: 'Reel', icon: Film, color: 'from-orange-500 to-red-500' },
            { type: 'TIKTOK', label: 'TikTok', icon: Film, color: 'from-emerald-500 to-teal-500' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.type}
                href={`/studio?type=${item.type}`}
                className="card-hover group"
              >
                <div className={cn(
                  'w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3',
                  item.color
                )}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-medium text-white group-hover:text-brand-300 transition-colors">
                  {item.label}
                </p>
                <p className="text-xs text-surface-500 mt-1">Generate with AI</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Content */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Recent Content</h2>
          <Link href="/library" className="btn-ghost text-sm">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentContent.length === 0 ? (
          <div className="card text-center py-12">
            <Sparkles className="w-12 h-12 text-surface-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No content yet</h3>
            <p className="text-surface-400 mb-6">
              Start creating amazing content with AI
            </p>
            <Link href="/studio" className="btn-primary inline-flex">
              <Sparkles className="w-4 h-4" />
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentContent.map((item) => {
              const Icon = typeIcons[item.type] || FileText;
              return (
                <div key={item.id} className="card-hover flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl bg-white/5 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {item.thumbnailUrl || item.mediaUrls?.[0] ? (
                      <img
                        src={item.thumbnailUrl || item.mediaUrls[0]}
                        alt=""
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <Icon className="w-6 h-6 text-surface-500" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-medium text-white truncate">
                        {item.title}
                      </h3>
                      <span className={statusBadge[item.status]}>
                        {item.status.toLowerCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-surface-500">
                        {typeLabels[item.type]}
                      </span>
                      <span className="text-xs text-surface-600">•</span>
                      <span className="flex items-center gap-1 text-xs text-surface-500">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(item.createdAt)}
                      </span>
                    </div>
                    {item.caption && (
                      <p className="text-xs text-surface-500 mt-1.5 line-clamp-1">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
