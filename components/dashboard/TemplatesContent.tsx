'use client';

import { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Sparkles,
  ImageIcon,
  Layers,
  Film,
  X,
  Save,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Template {
  id: string;
  name: string;
  description?: string;
  type: string;
  platform: string;
  promptTemplate: string;
  styleGuide?: string;
  defaultHashtags: string[];
  usageCount: number;
  createdAt: string;
}

const typeIcons: Record<string, React.ElementType> = {
  IMAGE_POST: ImageIcon,
  CAROUSEL: Layers,
  STORY: Film,
  REEL: Film,
  TIKTOK: Film,
};

const defaultTemplates = [
  {
    name: 'AI Tool Review',
    description: 'Review and showcase a new AI tool',
    type: 'CAROUSEL',
    platform: 'BOTH',
    promptTemplate: 'Create a comprehensive review of [TOOL NAME]. Cover: what it does, key features, pros & cons, pricing, and who it\'s best for. Make it engaging and informative.',
    defaultHashtags: ['AItools', 'techreview', 'AI', 'productivity'],
  },
  {
    name: 'Tech News Update',
    description: 'Breaking tech/AI news post',
    type: 'IMAGE_POST',
    platform: 'BOTH',
    promptTemplate: 'Create a post about this breaking news in tech/AI: [NEWS TOPIC]. Explain why it matters, who it affects, and what comes next.',
    defaultHashtags: ['technews', 'AI', 'breakingnews', 'tech2026'],
  },
  {
    name: 'Quick AI Tips',
    description: '3-5 actionable tips in carousel format',
    type: 'CAROUSEL',
    platform: 'INSTAGRAM',
    promptTemplate: 'Create 5 actionable tips about: [TOPIC]. Each tip should be practical, immediately applicable, and backed by real use cases.',
    defaultHashtags: ['techtips', 'AIhacks', 'productivity', 'learnAI'],
  },
  {
    name: 'Viral Reel Hook',
    description: 'Attention-grabbing short video script',
    type: 'REEL',
    platform: 'BOTH',
    promptTemplate: 'Create a viral-worthy short video script about: [TOPIC]. Start with a shocking statement or question. Make it fast-paced and end with a strong CTA.',
    defaultHashtags: ['viral', 'techtok', 'AI', 'fyp'],
  },
];

export function TemplatesContent({ templates: initialTemplates }: { templates: Template[] }) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [showCreate, setShowCreate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    type: 'IMAGE_POST',
    platform: 'BOTH',
    promptTemplate: '',
    styleGuide: '',
    defaultHashtags: '',
  });

  const handleCreate = async () => {
    if (!form.name || !form.promptTemplate) return;
    setIsCreating(true);

    try {
      const res = await fetch('/api/content/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          defaultHashtags: form.defaultHashtags
            .split(',')
            .map((h) => h.trim())
            .filter(Boolean),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTemplates([data.data, ...templates]);
        setShowCreate(false);
        setForm({
          name: '',
          description: '',
          type: 'IMAGE_POST',
          platform: 'BOTH',
          promptTemplate: '',
          styleGuide: '',
          defaultHashtags: '',
        });
      }
    } catch {
      // silent
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this template?')) return;
    try {
      await fetch(`/api/content/templates?id=${id}`, { method: 'DELETE' });
      setTemplates(templates.filter((t) => t.id !== id));
    } catch {
      // silent
    }
  };

  const handleUseDefault = async (template: typeof defaultTemplates[0]) => {
    setIsCreating(true);
    try {
      const res = await fetch('/api/content/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template),
      });
      const data = await res.json();
      if (data.success) {
        setTemplates([data.data, ...templates]);
      }
    } catch {
      // silent
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileText className="w-6 h-6 text-brand-400" />
            Templates
          </h1>
          <p className="text-surface-400 mt-1">
            Reusable prompt templates for consistent content
          </p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> New Template
        </button>
      </div>

      {/* Suggested Templates */}
      {templates.length === 0 && (
        <div className="card">
          <h3 className="text-sm font-medium text-surface-300 mb-3">
            Quick Start — Add a template:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {defaultTemplates.map((dt, idx) => (
              <button
                key={idx}
                onClick={() => handleUseDefault(dt)}
                disabled={isCreating}
                className="p-4 rounded-xl bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-all"
              >
                <p className="text-sm font-medium text-white">{dt.name}</p>
                <p className="text-xs text-surface-500 mt-1">{dt.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="badge-blue text-[10px]">{dt.type.replace('_', ' ')}</span>
                  <span className="badge-purple text-[10px]">{dt.platform}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Template List */}
      {templates.length > 0 && (
        <div className="space-y-3">
          {templates.map((template) => {
            const Icon = typeIcons[template.type] || FileText;
            return (
              <div key={template.id} className="card">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-surface-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-white">{template.name}</h3>
                      <span className="badge-blue text-[10px]">
                        {template.type.replace('_', ' ')}
                      </span>
                      <span className="badge-purple text-[10px]">{template.platform}</span>
                    </div>
                    {template.description && (
                      <p className="text-xs text-surface-500 mt-1">{template.description}</p>
                    )}
                    <p className="text-xs text-surface-600 mt-2 font-mono bg-white/5 p-2 rounded-lg">
                      {template.promptTemplate.slice(0, 120)}...
                    </p>
                    {template.defaultHashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {template.defaultHashtags.map((h, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400"
                          >
                            #{h}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="p-2 text-surface-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">New Template</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 text-surface-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-surface-400">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field mt-1"
                  placeholder="e.g., Weekly AI Roundup"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-surface-400">Description</label>
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input-field mt-1"
                  placeholder="What is this template for?"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-surface-400">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="input-field mt-1"
                  >
                    <option value="IMAGE_POST">Image Post</option>
                    <option value="CAROUSEL">Carousel</option>
                    <option value="REEL">Reel</option>
                    <option value="TIKTOK">TikTok</option>
                    <option value="STORY">Story</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-surface-400">Platform</label>
                  <select
                    value={form.platform}
                    onChange={(e) => setForm({ ...form, platform: e.target.value })}
                    className="input-field mt-1"
                  >
                    <option value="BOTH">Both</option>
                    <option value="INSTAGRAM">Instagram</option>
                    <option value="TIKTOK">TikTok</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-surface-400">Prompt Template</label>
                <textarea
                  value={form.promptTemplate}
                  onChange={(e) => setForm({ ...form, promptTemplate: e.target.value })}
                  className="textarea-field mt-1 h-24"
                  placeholder="Write your prompt template. Use [BRACKETS] for variables."
                />
              </div>
              <div>
                <label className="text-xs font-medium text-surface-400">Default Hashtags (comma-separated)</label>
                <input
                  value={form.defaultHashtags}
                  onChange={(e) => setForm({ ...form, defaultHashtags: e.target.value })}
                  className="input-field mt-1"
                  placeholder="AI, tech, coding, tips"
                />
              </div>
              <button
                onClick={handleCreate}
                disabled={!form.name || !form.promptTemplate || isCreating}
                className="btn-primary w-full"
              >
                {isCreating ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
                ) : (
                  <><Save className="w-4 h-4" /> Create Template</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
