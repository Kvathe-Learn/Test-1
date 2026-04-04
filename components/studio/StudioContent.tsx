'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Sparkles,
  ImageIcon,
  Layers,
  Film,
  Send,
  Copy,
  Download,
  Save,
  Loader2,
  CheckCircle2,
  Hash,
  Type,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrandKit {
  brandName?: string;
  toneOfVoice?: string;
  targetAudience?: string;
  contentPillars: string[];
  visualStyle?: string;
}

interface Template {
  id: string;
  name: string;
  type: string;
  promptTemplate: string;
}

interface StudioContentProps {
  brandKit: BrandKit | null;
  templates: Template[];
}

const contentTypes = [
  { value: 'IMAGE_POST', label: 'Image Post', icon: ImageIcon, desc: 'Single image with caption' },
  { value: 'CAROUSEL', label: 'Carousel', icon: Layers, desc: 'Multi-slide swipe post' },
  { value: 'REEL', label: 'Reel', icon: Film, desc: 'Short video for IG' },
  { value: 'TIKTOK', label: 'TikTok', icon: Film, desc: 'Short video for TikTok' },
];

const platforms = [
  { value: 'INSTAGRAM', label: 'Instagram' },
  { value: 'TIKTOK', label: 'TikTok' },
  { value: 'BOTH', label: 'Both' },
];

export function StudioContent({ brandKit, templates }: StudioContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialType = searchParams.get('type') || 'IMAGE_POST';

  const [contentType, setContentType] = useState(initialType);
  const [platform, setPlatform] = useState('BOTH');
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setError('');
    setResult(null);
    setSaved(false);

    try {
      const res = await fetch('/api/generate/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          contentType,
          platform,
          tone: brandKit?.toneOfVoice,
          targetAudience: brandKit?.targetAudience,
          contentPillars: brandKit?.contentPillars,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setResult(data.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setIsSaving(true);

    try {
      const caption = (result.caption as string) || '';
      const hashtags = (result.hashtags as string[]) || [];
      const hookText = (result.hookText as string) || '';
      const script = (result.fullScript as string) || (result.script as string) || '';
      const slides = (result.slides as Array<Record<string, unknown>>) || [];

      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: topic.slice(0, 80),
          type: contentType,
          platform,
          caption,
          hashtags,
          hookText,
          script: typeof script === 'string' ? script : JSON.stringify(script),
          topic,
          aiModel: 'gpt-4.1',
          status: 'DRAFT',
          slides: slides.map((s, i) => ({
            order: (s.order as number) || i + 1,
            text: `${s.headline || ''}\n\n${s.body || ''}`.trim(),
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSaved(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-brand-400" />
          Content Studio
        </h1>
        <p className="text-surface-400 mt-1">Generate professional content with AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Input Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Content Type */}
          <div className="card space-y-3">
            <label className="text-sm font-medium text-surface-300">Content Type</label>
            <div className="grid grid-cols-2 gap-2">
              {contentTypes.map((ct) => {
                const Icon = ct.icon;
                return (
                  <button
                    key={ct.value}
                    onClick={() => setContentType(ct.value)}
                    className={cn(
                      'p-3 rounded-xl border text-left transition-all',
                      contentType === ct.value
                        ? 'border-brand-500/50 bg-brand-500/10 text-brand-300'
                        : 'border-white/10 bg-white/5 text-surface-400 hover:bg-white/10'
                    )}
                  >
                    <Icon className="w-4 h-4 mb-1.5" />
                    <p className="text-xs font-medium">{ct.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Platform */}
          <div className="card space-y-3">
            <label className="text-sm font-medium text-surface-300">Platform</label>
            <div className="flex gap-2">
              {platforms.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPlatform(p.value)}
                  className={cn(
                    'flex-1 py-2.5 rounded-xl text-sm font-medium transition-all',
                    platform === p.value
                      ? 'bg-brand-600 text-white'
                      : 'bg-white/5 text-surface-400 hover:bg-white/10'
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Topic Input */}
          <div className="card space-y-3">
            <label className="text-sm font-medium text-surface-300">Topic / Idea</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., 5 AI tools that will replace traditional software in 2026..."
              className="textarea-field h-28"
            />

            {/* Template Quick Select */}
            {templates.length > 0 && (
              <div>
                <p className="text-xs text-surface-500 mb-2">Or use a template:</p>
                <div className="flex flex-wrap gap-2">
                  {templates.slice(0, 4).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTopic(t.promptTemplate);
                        setContentType(t.type);
                      }}
                      className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-surface-400 hover:bg-white/10 hover:text-white transition-all"
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!topic.trim() || isGenerating}
            className="btn-primary w-full py-3.5 text-base"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Content
              </>
            )}
          </button>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Right: Output Panel */}
        <div className="lg:col-span-3 space-y-4">
          {!result && !isGenerating && (
            <div className="card flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-surface-600" />
              </div>
              <h3 className="text-lg font-medium text-surface-400">
                Your content will appear here
              </h3>
              <p className="text-sm text-surface-600 mt-1 max-w-sm">
                Enter a topic and click Generate to create AI-powered content
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="card flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-brand-400 animate-spin mb-4" />
              <p className="text-surface-400">Crafting your content...</p>
              <p className="text-xs text-surface-600 mt-1">This takes 10-20 seconds</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Action Bar */}
              <div className="flex items-center gap-2">
                <button onClick={handleGenerate} className="btn-secondary text-sm">
                  <RefreshCw className="w-4 h-4" /> Regenerate
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || saved}
                  className="btn-primary text-sm"
                >
                  {saved ? (
                    <><CheckCircle2 className="w-4 h-4" /> Saved!</>
                  ) : isSaving ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="w-4 h-4" /> Save to Library</>
                  )}
                </button>
              </div>

              {/* Hook */}
              {result.hookText && (
                <div className="card">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-amber-400">
                      <Type className="w-4 h-4" />
                      <span className="text-sm font-medium">Hook</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(result.hookText as string)}
                      className="btn-ghost p-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-white font-medium">{result.hookText as string}</p>
                </div>
              )}

              {/* Caption */}
              {result.caption && (
                <div className="card">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-brand-400">
                      <Send className="w-4 h-4" />
                      <span className="text-sm font-medium">Caption</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(result.caption as string)}
                      className="btn-ghost p-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-surface-300 whitespace-pre-wrap text-sm leading-relaxed">
                    {result.caption as string}
                  </p>
                </div>
              )}

              {/* Carousel Slides */}
              {(result.slides as Array<Record<string, string>>)?.length > 0 && (
                <div className="card">
                  <h3 className="text-sm font-medium text-purple-400 mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4" /> Carousel Slides
                  </h3>
                  <div className="space-y-3">
                    {(result.slides as Array<Record<string, string>>).map(
                      (slide, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-white/5 border border-white/5"
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold">
                              {(slide.order as unknown as number) || idx + 1}
                            </span>
                            <h4 className="text-sm font-semibold text-white">
                              {slide.headline}
                            </h4>
                          </div>
                          <p className="text-xs text-surface-400 ml-8">{slide.body}</p>
                          {slide.visualSuggestion && (
                            <p className="text-xs text-surface-600 mt-1.5 ml-8 italic">
                              Visual: {slide.visualSuggestion}
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Script */}
              {(result.script || result.fullScript) && (
                <div className="card">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Film className="w-4 h-4" />
                      <span className="text-sm font-medium">Video Script</span>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          (result.fullScript as string) ||
                            (typeof result.script === 'string'
                              ? result.script
                              : JSON.stringify(result.script, null, 2))
                        )
                      }
                      className="btn-ghost p-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {typeof result.script === 'object' && result.script ? (
                    <div className="space-y-3">
                      {Object.entries(result.script as Record<string, string>).map(
                        ([section, text]) => (
                          <div key={section}>
                            <span className="text-xs font-medium text-surface-500 uppercase">
                              {section}
                            </span>
                            <p className="text-sm text-surface-300 mt-0.5">{text}</p>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-surface-300 whitespace-pre-wrap">
                      {(result.fullScript as string) || (result.script as string)}
                    </p>
                  )}
                </div>
              )}

              {/* Hashtags */}
              {(result.hashtags as string[])?.length > 0 && (
                <div className="card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <Hash className="w-4 h-4" />
                      <span className="text-sm font-medium">Hashtags</span>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          (result.hashtags as string[])
                            .map((h: string) => (h.startsWith('#') ? h : `#${h}`))
                            .join(' ')
                        )
                      }
                      className="btn-ghost p-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(result.hashtags as string[]).map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs"
                      >
                        #{tag.replace(/^#/, '')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {(result.suggestions as string[])?.length > 0 && (
                <div className="card">
                  <h3 className="text-sm font-medium text-surface-400 mb-2">
                    💡 AI Suggestions
                  </h3>
                  <ul className="space-y-1.5">
                    {(result.suggestions as string[]).map((s: string, i: number) => (
                      <li key={i} className="text-xs text-surface-500">
                        • {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
