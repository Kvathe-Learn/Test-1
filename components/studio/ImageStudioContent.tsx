'use client';

import { useState } from 'react';
import {
  ImageIcon,
  Sparkles,
  Loader2,
  Download,
  RefreshCw,
  Save,
  CheckCircle2,
  Maximize2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sizes = [
  { value: '1024x1024', label: '1:1 Square', desc: 'Instagram Post' },
  { value: '1024x1536', label: '2:3 Portrait', desc: 'Story / Reel Cover' },
  { value: '1536x1024', label: '3:2 Landscape', desc: 'Banner / Cover' },
];

const qualities = [
  { value: 'low', label: 'Draft', desc: 'Fast, ~$0.01' },
  { value: 'medium', label: 'Standard', desc: 'Balanced, ~$0.03' },
  { value: 'high', label: 'Premium', desc: 'Best quality, ~$0.13' },
];

const stylePresets = [
  'Minimalist tech aesthetic, dark background, neon accents',
  'Clean editorial photography style, soft natural lighting',
  'Futuristic 3D render, holographic elements, cyberpunk vibes',
  'Flat illustration, bold colors, modern geometric shapes',
  'Photorealistic product shot, studio lighting, depth of field',
  'Abstract data visualization art, flowing particles, gradient mesh',
];

export function ImageStudioContent() {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState('1024x1024');
  const [quality, setQuality] = useState('medium');
  const [style, setStyle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<{ url: string; revisedPrompt?: string }[]>([]);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError('');
    setImages([]);

    try {
      const res = await fetch('/api/generate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: style ? `${prompt}. Style: ${style}` : prompt,
          size,
          quality,
          n: 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Image generation failed');
      setImages(data.data.images);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async (url: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `contentforge-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <ImageIcon className="w-6 h-6 text-brand-400" />
          Image Studio
        </h1>
        <p className="text-surface-400 mt-1">
          Generate professional images with GPT Image 1.5
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Controls */}
        <div className="lg:col-span-2 space-y-5">
          {/* Prompt */}
          <div className="card space-y-3">
            <label className="text-sm font-medium text-surface-300">
              Describe your image
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A robot hand reaching out to a human hand, holographic interface between them, dark studio background..."
              className="textarea-field h-32"
            />
          </div>

          {/* Style Presets */}
          <div className="card space-y-3">
            <label className="text-sm font-medium text-surface-300">Style Preset</label>
            <div className="grid grid-cols-1 gap-2">
              {stylePresets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setStyle(style === preset ? '' : preset)}
                  className={cn(
                    'text-left px-3 py-2 rounded-lg text-xs transition-all',
                    style === preset
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                      : 'bg-white/5 text-surface-400 hover:bg-white/10 border border-transparent'
                  )}
                >
                  {preset}
                </button>
              ))}
            </div>
            {style && (
              <input
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="input-field text-sm"
                placeholder="Custom style..."
              />
            )}
          </div>

          {/* Size */}
          <div className="card space-y-3">
            <label className="text-sm font-medium text-surface-300">Size</label>
            <div className="space-y-2">
              {sizes.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSize(s.value)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all',
                    size === s.value
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                      : 'bg-white/5 text-surface-400 hover:bg-white/10 border border-transparent'
                  )}
                >
                  <span className="font-medium">{s.label}</span>
                  <span className="text-xs text-surface-500">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quality */}
          <div className="card space-y-3">
            <label className="text-sm font-medium text-surface-300">Quality</label>
            <div className="flex gap-2">
              {qualities.map((q) => (
                <button
                  key={q.value}
                  onClick={() => setQuality(q.value)}
                  className={cn(
                    'flex-1 py-2.5 rounded-xl text-center transition-all',
                    quality === q.value
                      ? 'bg-brand-600 text-white'
                      : 'bg-white/5 text-surface-400 hover:bg-white/10'
                  )}
                >
                  <p className="text-xs font-medium">{q.label}</p>
                  <p className="text-[10px] text-surface-500 mt-0.5">{q.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Generate */}
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="btn-primary w-full py-3.5 text-base"
          >
            {isGenerating ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Generating Image...</>
            ) : (
              <><Sparkles className="w-5 h-5" /> Generate Image</>
            )}
          </button>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Right: Preview */}
        <div className="lg:col-span-3">
          {!images.length && !isGenerating && (
            <div className="card flex flex-col items-center justify-center py-32 text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <ImageIcon className="w-10 h-10 text-surface-600" />
              </div>
              <h3 className="text-lg font-medium text-surface-400">
                Your images will appear here
              </h3>
              <p className="text-sm text-surface-600 mt-1">
                Describe what you want and hit Generate
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="card flex flex-col items-center justify-center py-32">
              <Loader2 className="w-12 h-12 text-brand-400 animate-spin mb-4" />
              <p className="text-surface-400">Creating your image...</p>
              <p className="text-xs text-surface-600 mt-1">
                This usually takes 10-30 seconds
              </p>
            </div>
          )}

          {images.length > 0 && (
            <div className="space-y-4">
              {/* Action Bar */}
              <div className="flex items-center gap-2">
                <button onClick={handleGenerate} className="btn-secondary text-sm">
                  <RefreshCw className="w-4 h-4" /> New Variation
                </button>
                <button
                  onClick={() => images[0]?.url && downloadImage(images[0].url)}
                  className="btn-primary text-sm"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>

              {/* Image Grid */}
              {images.map((img, idx) => (
                <div key={idx} className="card p-2">
                  <div className="relative group rounded-xl overflow-hidden">
                    <img
                      src={img.url}
                      alt={`Generated image ${idx + 1}`}
                      className="w-full rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => downloadImage(img.url)}
                        className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      >
                        <Download className="w-5 h-5 text-white" />
                      </button>
                      <button
                        onClick={() => setSelectedImage(img.url)}
                        className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      >
                        <Maximize2 className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Full Screen Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-8 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full preview"
            className="max-w-full max-h-full object-contain rounded-xl"
          />
        </div>
      )}
    </div>
  );
}
