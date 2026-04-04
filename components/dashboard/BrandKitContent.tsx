'use client';

import { useState } from 'react';
import { Palette, Save, Loader2, CheckCircle2, Plus, X } from 'lucide-react';

interface BrandKit {
  brandName?: string;
  tagline?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  toneOfVoice?: string;
  targetAudience?: string;
  contentPillars: string[];
  visualStyle?: string;
  fontPreference?: string;
}

export function BrandKitContent({ brandKit }: { brandKit: BrandKit | null }) {
  const [form, setForm] = useState<BrandKit>({
    brandName: brandKit?.brandName || '',
    tagline: brandKit?.tagline || '',
    primaryColor: brandKit?.primaryColor || '#4c6ef5',
    secondaryColor: brandKit?.secondaryColor || '#748ffc',
    accentColor: brandKit?.accentColor || '#ff6b6b',
    backgroundColor: brandKit?.backgroundColor || '#0f0f1a',
    textColor: brandKit?.textColor || '#ffffff',
    toneOfVoice: brandKit?.toneOfVoice || '',
    targetAudience: brandKit?.targetAudience || '',
    contentPillars: brandKit?.contentPillars || [],
    visualStyle: brandKit?.visualStyle || '',
    fontPreference: brandKit?.fontPreference || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newPillar, setNewPillar] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    try {
      const res = await fetch('/api/content/brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) setSaved(true);
    } catch {
      // silent
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const addPillar = () => {
    if (newPillar.trim() && !form.contentPillars.includes(newPillar.trim())) {
      setForm({ ...form, contentPillars: [...form.contentPillars, newPillar.trim()] });
      setNewPillar('');
    }
  };

  const removePillar = (pillar: string) => {
    setForm({
      ...form,
      contentPillars: form.contentPillars.filter((p) => p !== pillar),
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Palette className="w-6 h-6 text-brand-400" />
            Brand Kit
          </h1>
          <p className="text-surface-400 mt-1">
            Define your brand identity for consistent AI-generated content
          </p>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="btn-primary">
          {saved ? (
            <><CheckCircle2 className="w-4 h-4" /> Saved!</>
          ) : isSaving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
          ) : (
            <><Save className="w-4 h-4" /> Save Changes</>
          )}
        </button>
      </div>

      {/* Brand Identity */}
      <div className="card space-y-4">
        <h2 className="section-title">Brand Identity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-surface-400">Brand Name</label>
            <input
              value={form.brandName}
              onChange={(e) => setForm({ ...form, brandName: e.target.value })}
              className="input-field mt-1"
              placeholder="Your brand name"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-surface-400">Tagline</label>
            <input
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="input-field mt-1"
              placeholder="Your brand tagline"
            />
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="card space-y-4">
        <h2 className="section-title">Brand Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { key: 'primaryColor', label: 'Primary' },
            { key: 'secondaryColor', label: 'Secondary' },
            { key: 'accentColor', label: 'Accent' },
            { key: 'backgroundColor', label: 'Background' },
            { key: 'textColor', label: 'Text' },
          ].map((color) => (
            <div key={color.key}>
              <label className="text-xs font-medium text-surface-400">{color.label}</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="color"
                  value={form[color.key as keyof BrandKit] as string}
                  onChange={(e) => setForm({ ...form, [color.key]: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                />
                <input
                  value={form[color.key as keyof BrandKit] as string}
                  onChange={(e) => setForm({ ...form, [color.key]: e.target.value })}
                  className="input-field text-xs font-mono flex-1"
                />
              </div>
            </div>
          ))}
        </div>
        {/* Color Preview */}
        <div className="flex gap-2 mt-2">
          {['primaryColor', 'secondaryColor', 'accentColor'].map((key) => (
            <div
              key={key}
              className="h-8 flex-1 rounded-lg"
              style={{ backgroundColor: form[key as keyof BrandKit] as string }}
            />
          ))}
        </div>
      </div>

      {/* Voice & Audience */}
      <div className="card space-y-4">
        <h2 className="section-title">Voice & Audience</h2>
        <div>
          <label className="text-xs font-medium text-surface-400">Tone of Voice</label>
          <textarea
            value={form.toneOfVoice}
            onChange={(e) => setForm({ ...form, toneOfVoice: e.target.value })}
            className="textarea-field mt-1 h-20"
            placeholder="e.g., Professional but approachable, knowledgeable, slightly provocative..."
          />
        </div>
        <div>
          <label className="text-xs font-medium text-surface-400">Target Audience</label>
          <textarea
            value={form.targetAudience}
            onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
            className="textarea-field mt-1 h-20"
            placeholder="e.g., Tech enthusiasts, developers, AI practitioners, startup founders (25-40 years old)"
          />
        </div>
      </div>

      {/* Content Pillars */}
      <div className="card space-y-4">
        <h2 className="section-title">Content Pillars</h2>
        <p className="text-xs text-surface-500">
          The main themes your content revolves around
        </p>
        <div className="flex flex-wrap gap-2">
          {form.contentPillars.map((pillar) => (
            <span
              key={pillar}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-500/20 text-brand-300 text-sm"
            >
              {pillar}
              <button onClick={() => removePillar(pillar)} className="hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newPillar}
            onChange={(e) => setNewPillar(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addPillar()}
            className="input-field flex-1"
            placeholder="Add a content pillar..."
          />
          <button onClick={addPillar} className="btn-secondary">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visual Style */}
      <div className="card space-y-4">
        <h2 className="section-title">Visual Preferences</h2>
        <div>
          <label className="text-xs font-medium text-surface-400">Visual Style</label>
          <textarea
            value={form.visualStyle}
            onChange={(e) => setForm({ ...form, visualStyle: e.target.value })}
            className="textarea-field mt-1 h-20"
            placeholder="e.g., Modern minimalist, dark backgrounds with vibrant accent colors, clean typography..."
          />
        </div>
        <div>
          <label className="text-xs font-medium text-surface-400">Font Preference</label>
          <input
            value={form.fontPreference}
            onChange={(e) => setForm({ ...form, fontPreference: e.target.value })}
            className="input-field mt-1"
            placeholder="e.g., Modern sans-serif (Inter, Satoshi)"
          />
        </div>
      </div>
    </div>
  );
}
