"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  RiImageLine,
  RiLoader4Line,
  RiDownloadLine,
  RiSaveLine,
  RiFullscreenLine,
} from "react-icons/ri";

const STYLES = ["Photographic", "Digital Art", "Illustration", "3D Render", "Minimal", "Abstract", "Cinematic", "Watercolor"];
const SIZES = ["1024x1024", "1536x1024", "1024x1536"];
const SIZE_LABELS: Record<string, string> = {
  "1024x1024": "1:1 SQUARE",
  "1536x1024": "3:2 LANDSCAPE",
  "1024x1536": "2:3 PORTRAIT",
};

export default function ImagesPage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Photographic");
  const [size, setSize] = useState("1024x1024");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Enter a prompt");
      return;
    }

    setLoading(true);
    setImageUrl(null);

    try {
      const res = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style, size }),
      });

      if (!res.ok) throw new Error("Image generation failed");

      const data = await res.json();
      setImageUrl(data.imageUrl);
      toast.success("Image forged");
    } catch (err) {
      toast.error("Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!imageUrl) return;
    try {
      await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: prompt.slice(0, 100),
          imageUrl,
          type: "Image",
          prompt,
        }),
      });
      toast.success("Saved to library");
    } catch {
      toast.error("Failed to save");
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10">
      {/* Header */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-mono text-[10px] tracking-[0.5em] text-forge-accent uppercase mb-3">
          IMAGE GENERATION
        </p>
        <h1 className="font-display text-display-md text-forge-white">
          IMAGE FORGE
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1400px]">
        {/* ── INPUT ── */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div>
            <label className="label-forge">DESCRIBE YOUR IMAGE</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic cityscape at golden hour..."
              rows={4}
              className="textarea-forge"
            />
          </div>

          <div>
            <label className="label-forge">STYLE</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`tag-forge ${style === s ? "active" : ""}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label-forge">ASPECT RATIO</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`tag-forge ${size === s ? "active" : ""}`}
                >
                  {SIZE_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className={`btn-forge w-full !py-5 ${loading ? "opacity-70 cursor-wait" : ""} ${!prompt.trim() ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            <span className="flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <RiLoader4Line className="w-5 h-5 animate-spin" />
                  GENERATING...
                </>
              ) : (
                <>
                  <RiImageLine className="w-5 h-5" />
                  FORGE IMAGE
                </>
              )}
            </span>
          </button>
        </motion.div>

        {/* ── OUTPUT ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                className="aspect-square border border-forge-steel/30 flex flex-col items-center justify-center gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="w-16 h-16 border-2 border-forge-steel border-t-forge-accent animate-spin" />
                <p className="font-display text-sm tracking-[0.3em] text-forge-smoke uppercase">
                  FORGING IMAGE
                </p>
              </motion.div>
            ) : imageUrl ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <p className="font-display text-xs tracking-[0.3em] text-forge-accent uppercase">
                    OUTPUT
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFullscreen(true)}
                      className="tag-forge flex items-center gap-2"
                    >
                      <RiFullscreenLine className="w-3.5 h-3.5" />
                      VIEW
                    </button>
                    <button
                      onClick={handleSave}
                      className="tag-forge flex items-center gap-2"
                    >
                      <RiSaveLine className="w-3.5 h-3.5" />
                      SAVE
                    </button>
                  </div>
                </div>
                <div className="relative border border-forge-steel/30 overflow-hidden group cursor-pointer" onClick={() => setFullscreen(true)}>
                  <img src={imageUrl} alt="Generated" className="w-full h-auto" />
                  <div className="absolute inset-0 bg-forge-black/0 group-hover:bg-forge-black/30 transition-colors duration-300 flex items-center justify-center">
                    <RiFullscreenLine className="w-8 h-8 text-forge-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                className="aspect-square border border-dashed border-forge-steel/30 flex flex-col items-center justify-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-16 h-16 border border-forge-steel/50 flex items-center justify-center">
                  <RiImageLine className="w-6 h-6 text-forge-steel" />
                </div>
                <p className="font-display text-sm tracking-[0.2em] text-forge-smoke uppercase">
                  YOUR IMAGE APPEARS HERE
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {fullscreen && imageUrl && (
          <motion.div
            className="fixed inset-0 z-[100] bg-forge-black/95 flex items-center justify-center p-8 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFullscreen(false)}
          >
            <motion.img
              src={imageUrl}
              alt="Fullscreen"
              className="max-w-full max-h-full object-contain"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
