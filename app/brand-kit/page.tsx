"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  RiPaletteLine,
  RiSaveLine,
  RiLoader4Line,
  RiAddLine,
  RiCloseLine,
} from "react-icons/ri";

interface BrandKit {
  id?: string;
  brandName: string;
  brandVoice: string;
  targetAudience: string;
  keywords: string[];
  avoidWords: string[];
  colorPrimary: string;
  colorSecondary: string;
  industry: string;
}

const DEFAULT_KIT: BrandKit = {
  brandName: "",
  brandVoice: "",
  targetAudience: "",
  keywords: [],
  avoidWords: [],
  colorPrimary: "#FF4D00",
  colorSecondary: "#0A0A0A",
  industry: "",
};

export default function BrandKitPage() {
  const [kit, setKit] = useState<BrandKit>(DEFAULT_KIT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const [newAvoidWord, setNewAvoidWord] = useState("");

  useEffect(() => {
    fetchBrandKit();
  }, []);

  const fetchBrandKit = async () => {
    try {
      const res = await fetch("/api/brand-kit");
      if (res.ok) {
        const data = await res.json();
        if (data) setKit(data);
      }
    } catch {
      // Use defaults
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/brand-kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kit),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setKit(data);
      toast.success("Brand Kit saved");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !kit.keywords.includes(newKeyword.trim())) {
      setKit({ ...kit, keywords: [...kit.keywords, newKeyword.trim()] });
      setNewKeyword("");
    }
  };

  const removeKeyword = (kw: string) => {
    setKit({ ...kit, keywords: kit.keywords.filter((k) => k !== kw) });
  };

  const addAvoidWord = () => {
    if (newAvoidWord.trim() && !kit.avoidWords.includes(newAvoidWord.trim())) {
      setKit({ ...kit, avoidWords: [...kit.avoidWords, newAvoidWord.trim()] });
      setNewAvoidWord("");
    }
  };

  const removeAvoidWord = (w: string) => {
    setKit({ ...kit, avoidWords: kit.avoidWords.filter((a) => a !== w) });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-forge-steel border-t-forge-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10">
      {/* Header */}
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-mono text-[10px] tracking-[0.5em] text-forge-accent uppercase mb-3">
          BRAND IDENTITY
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h1 className="font-display text-display-md text-forge-white">
            BRAND KIT
          </h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-forge !py-3 !px-6 self-start"
          >
            <span className="flex items-center gap-2">
              {saving ? (
                <RiLoader4Line className="w-4 h-4 animate-spin" />
              ) : (
                <RiSaveLine className="w-4 h-4" />
              )}
              {saving ? "SAVING..." : "SAVE KIT"}
            </span>
          </button>
        </div>
      </motion.div>

      <div className="max-w-3xl space-y-10">
        {/* Brand basics */}
        <motion.section
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="font-display text-lg tracking-[0.15em] text-forge-white uppercase border-b border-forge-steel/30 pb-3">
            BASICS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-forge">BRAND NAME</label>
              <input
                type="text"
                value={kit.brandName}
                onChange={(e) => setKit({ ...kit, brandName: e.target.value })}
                placeholder="YOUR BRAND"
                className="input-forge"
              />
            </div>
            <div>
              <label className="label-forge">INDUSTRY</label>
              <input
                type="text"
                value={kit.industry}
                onChange={(e) => setKit({ ...kit, industry: e.target.value })}
                placeholder="TECH, FASHION, FOOD..."
                className="input-forge"
              />
            </div>
          </div>

          <div>
            <label className="label-forge">TARGET AUDIENCE</label>
            <input
              type="text"
              value={kit.targetAudience}
              onChange={(e) => setKit({ ...kit, targetAudience: e.target.value })}
              placeholder="MILLENNIALS, PROFESSIONALS, CREATORS..."
              className="input-forge"
            />
          </div>
        </motion.section>

        {/* Brand voice */}
        <motion.section
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="font-display text-lg tracking-[0.15em] text-forge-white uppercase border-b border-forge-steel/30 pb-3">
            VOICE & TONE
          </h2>

          <div>
            <label className="label-forge">BRAND VOICE</label>
            <textarea
              value={kit.brandVoice}
              onChange={(e) => setKit({ ...kit, brandVoice: e.target.value })}
              placeholder="Describe how your brand communicates. Bold and direct? Warm and approachable? Technical and precise?"
              rows={4}
              className="textarea-forge"
            />
          </div>
        </motion.section>

        {/* Keywords */}
        <motion.section
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="font-display text-lg tracking-[0.15em] text-forge-white uppercase border-b border-forge-steel/30 pb-3">
            KEYWORDS
          </h2>

          <div>
            <label className="label-forge">BRAND KEYWORDS</label>
            <div className="flex gap-2 mt-2 mb-3">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addKeyword()}
                placeholder="ADD KEYWORD..."
                className="input-forge flex-1"
              />
              <button
                onClick={addKeyword}
                className="px-4 border border-forge-steel text-forge-smoke hover:border-forge-accent hover:text-forge-accent transition-colors"
              >
                <RiAddLine className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {kit.keywords.map((kw) => (
                <span key={kw} className="tag-forge active flex items-center gap-1.5">
                  {kw}
                  <button onClick={() => removeKeyword(kw)} className="hover:text-forge-black/50">
                    <RiCloseLine className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="label-forge">WORDS TO AVOID</label>
            <div className="flex gap-2 mt-2 mb-3">
              <input
                type="text"
                value={newAvoidWord}
                onChange={(e) => setNewAvoidWord(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addAvoidWord()}
                placeholder="ADD WORD TO AVOID..."
                className="input-forge flex-1"
              />
              <button
                onClick={addAvoidWord}
                className="px-4 border border-forge-steel text-forge-smoke hover:border-forge-accent hover:text-forge-accent transition-colors"
              >
                <RiAddLine className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {kit.avoidWords.map((w) => (
                <span key={w} className="tag-forge flex items-center gap-1.5 !border-red-500/50 !text-red-400">
                  {w}
                  <button onClick={() => removeAvoidWord(w)} className="hover:text-red-300">
                    <RiCloseLine className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Brand colors */}
        <motion.section
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="font-display text-lg tracking-[0.15em] text-forge-white uppercase border-b border-forge-steel/30 pb-3">
            COLORS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-forge">PRIMARY COLOR</label>
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="color"
                  value={kit.colorPrimary}
                  onChange={(e) => setKit({ ...kit, colorPrimary: e.target.value })}
                  className="w-12 h-12 border border-forge-steel cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={kit.colorPrimary}
                  onChange={(e) => setKit({ ...kit, colorPrimary: e.target.value })}
                  className="input-forge font-mono text-sm"
                />
              </div>
            </div>
            <div>
              <label className="label-forge">SECONDARY COLOR</label>
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="color"
                  value={kit.colorSecondary}
                  onChange={(e) => setKit({ ...kit, colorSecondary: e.target.value })}
                  className="w-12 h-12 border border-forge-steel cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={kit.colorSecondary}
                  onChange={(e) => setKit({ ...kit, colorSecondary: e.target.value })}
                  className="input-forge font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Color preview */}
          <div className="flex gap-4 mt-4">
            <div
              className="w-full h-24 border border-forge-steel/30 flex items-end p-3"
              style={{ backgroundColor: kit.colorPrimary }}
            >
              <span className="font-mono text-[10px] text-white mix-blend-difference">PRIMARY</span>
            </div>
            <div
              className="w-full h-24 border border-forge-steel/30 flex items-end p-3"
              style={{ backgroundColor: kit.colorSecondary }}
            >
              <span className="font-mono text-[10px] text-white mix-blend-difference">SECONDARY</span>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
