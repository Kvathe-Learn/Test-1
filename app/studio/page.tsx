"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  RiSparklingLine,
  RiImageLine,
  RiText,
  RiSendPlaneLine,
  RiLoader4Line,
  RiFileCopyLine,
  RiSaveLine,
  RiArrowDownSLine,
} from "react-icons/ri";

const TONES = ["Professional", "Casual", "Bold", "Witty", "Formal", "Friendly"];
const CONTENT_TYPES = ["Blog Post", "Social Media", "Email", "Ad Copy", "Product Description", "Press Release"];
const IMAGE_STYLES = ["Photographic", "Digital Art", "Illustration", "3D Render", "Minimal", "Abstract"];

export default function StudioPage() {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("Professional");
  const [contentType, setContentType] = useState("Blog Post");
  const [generateImage, setGenerateImage] = useState(true);
  const [imageStyle, setImageStyle] = useState("Photographic");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text?: string; imageUrl?: string } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Enter a prompt to forge content");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          tone,
          contentType,
          generateImage,
          imageStyle,
        }),
      });

      if (!res.ok) throw new Error("Generation failed");

      const data = await res.json();
      setResult(data);

      // Scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);

      toast.success("Content forged successfully");
    } catch (err) {
      toast.error("Failed to generate content");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;

    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: prompt.slice(0, 100),
          body: result.text,
          imageUrl: result.imageUrl,
          type: contentType,
          tone,
          prompt,
        }),
      });

      if (!res.ok) throw new Error("Save failed");
      toast.success("Saved to library");
    } catch (err) {
      toast.error("Failed to save");
    }
  };

  const handleCopy = () => {
    if (result?.text) {
      navigator.clipboard.writeText(result.text);
      toast.success("Copied to clipboard");
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10">
      {/* Header */}
      <div className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-[10px] tracking-[0.5em] text-forge-accent uppercase mb-3">
            CONTENT GENERATION
          </p>
          <h1 className="font-display text-display-md text-forge-white">
            CONTENT STUDIO
          </h1>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1400px]">
        {/* ── LEFT: INPUT PANEL ── */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Prompt */}
          <div>
            <label className="label-forge">YOUR PROMPT</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to create..."
              rows={5}
              className="textarea-forge"
            />
          </div>

          {/* Content Type */}
          <div>
            <label className="label-forge">CONTENT TYPE</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {CONTENT_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setContentType(type)}
                  className={`tag-forge ${contentType === type ? "active" : ""}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Tone */}
          <div>
            <label className="label-forge">TONE</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`tag-forge ${tone === t ? "active" : ""}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Image toggle */}
          <div className="border border-forge-steel/50 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RiImageLine className="w-5 h-5 text-forge-accent" />
                <div>
                  <p className="font-display text-xs tracking-[0.2em] text-forge-white uppercase">
                    GENERATE IMAGE
                  </p>
                  <p className="text-forge-smoke text-xs mt-0.5">
                    AI-generated visual with your content
                  </p>
                </div>
              </div>
              <button
                onClick={() => setGenerateImage(!generateImage)}
                className={`
                  relative w-12 h-6 rounded-none border transition-colors duration-300
                  ${generateImage ? "bg-forge-accent border-forge-accent" : "bg-forge-carbon border-forge-steel"}
                `}
              >
                <div
                  className={`
                    absolute top-0.5 w-5 h-5 bg-forge-black transition-transform duration-300
                    ${generateImage ? "translate-x-6" : "translate-x-0.5"}
                  `}
                />
              </button>
            </div>

            {/* Image style - shown when toggle is on */}
            <AnimatePresence>
              {generateImage && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 mt-4 border-t border-forge-steel/30">
                    <label className="label-forge">IMAGE STYLE</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {IMAGE_STYLES.map((style) => (
                        <button
                          key={style}
                          onClick={() => setImageStyle(style)}
                          className={`tag-forge ${imageStyle === style ? "active" : ""}`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className={`
              btn-forge w-full !py-5 group
              ${loading ? "opacity-70 cursor-wait" : ""}
              ${!prompt.trim() ? "opacity-40 cursor-not-allowed" : ""}
            `}
          >
            <span className="flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <RiLoader4Line className="w-5 h-5 animate-spin" />
                  FORGING...
                </>
              ) : (
                <>
                  <RiSparklingLine className="w-5 h-5" />
                  FORGE CONTENT
                </>
              )}
            </span>
          </button>
        </motion.div>

        {/* ── RIGHT: RESULT PANEL ── */}
        <motion.div
          ref={resultRef}
          className="min-h-[400px]"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                className="h-full border border-forge-steel/30 flex flex-col items-center justify-center gap-6 p-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="relative">
                  <div className="w-16 h-16 border-2 border-forge-steel border-t-forge-accent animate-spin" />
                  <div className="absolute inset-0 w-16 h-16 border-2 border-transparent border-b-forge-accent/30 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
                </div>
                <div className="text-center">
                  <p className="font-display text-sm tracking-[0.3em] text-forge-white uppercase">
                    FORGING CONTENT
                  </p>
                  <p className="font-mono text-xs text-forge-smoke mt-2">
                    AI is generating your content...
                  </p>
                </div>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Action bar */}
                <div className="flex items-center justify-between">
                  <p className="font-display text-xs tracking-[0.3em] text-forge-accent uppercase">
                    OUTPUT
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="tag-forge flex items-center gap-2 hover:border-forge-accent hover:text-forge-accent"
                    >
                      <RiFileCopyLine className="w-3.5 h-3.5" />
                      COPY
                    </button>
                    <button
                      onClick={handleSave}
                      className="tag-forge flex items-center gap-2 hover:border-forge-accent hover:text-forge-accent"
                    >
                      <RiSaveLine className="w-3.5 h-3.5" />
                      SAVE
                    </button>
                  </div>
                </div>

                {/* Generated image */}
                {result.imageUrl && (
                  <div className="relative overflow-hidden border border-forge-steel/30">
                    <img
                      src={result.imageUrl}
                      alt="Generated content"
                      className="w-full h-auto"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="font-mono text-[10px] tracking-widest uppercase bg-forge-black/80 text-forge-accent px-2 py-1 border border-forge-accent/30">
                        AI GENERATED
                      </span>
                    </div>
                  </div>
                )}

                {/* Generated text */}
                {result.text && (
                  <div className="bg-forge-carbon border border-forge-steel/30 p-6">
                    <div className="prose prose-invert max-w-none">
                      <div className="font-body text-sm text-forge-light leading-relaxed whitespace-pre-wrap">
                        {result.text}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                className="h-full min-h-[400px] border border-dashed border-forge-steel/30 flex flex-col items-center justify-center gap-4 p-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-16 h-16 border border-forge-steel/50 flex items-center justify-center">
                  <RiSparklingLine className="w-6 h-6 text-forge-steel" />
                </div>
                <div className="text-center">
                  <p className="font-display text-sm tracking-[0.2em] text-forge-smoke uppercase">
                    YOUR OUTPUT APPEARS HERE
                  </p>
                  <p className="font-mono text-xs text-forge-smoke/50 mt-2">
                    Enter a prompt and hit forge
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
