"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const MARQUEE_WORDS = [
  "CONTENT",
  "•",
  "IMAGES",
  "•",
  "BRANDING",
  "•",
  "AI-POWERED",
  "•",
  "TEMPLATES",
  "•",
  "COPY",
  "•",
  "VISUALS",
  "•",
  "FORGE",
  "•",
];

const FEATURES = [
  {
    number: "01",
    title: "CONTENT\nSTUDIO",
    desc: "Generate text and images in one shot. GPT-4.1 for copy, GPT Image for visuals. One click, total output.",
  },
  {
    number: "02",
    title: "IMAGE\nFORGE",
    desc: "Standalone image generation with full creative control. Style presets, aspect ratios, brand alignment.",
  },
  {
    number: "03",
    title: "CONTENT\nVAULT",
    desc: "Every piece you create, saved and organized. Filter by type, search by keyword, never lose work.",
  },
  {
    number: "04",
    title: "BRAND\nKIT",
    desc: "Define your voice, tone, and visual identity. Every generation respects your brand DNA.",
  },
];

export default function LandingClient() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-forge-black overflow-hidden">
      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
        <div className="flex items-center justify-between px-6 md:px-12 py-6">
          <Link href="/" className="font-display text-2xl tracking-[0.2em] text-white">
            CONTENTFORGE
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="font-display text-sm tracking-[0.3em] text-white hover:text-forge-accent transition-colors duration-300"
            >
              LOGIN
            </Link>
            <Link href="/register" className="btn-forge text-sm !py-2 !px-6">
              <span>START FORGING</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12">
        {/* Radial gradient that follows cursor */}
        <div
          className="absolute inset-0 opacity-30 transition-all duration-1000 ease-out pointer-events-none"
          style={{
            background: `radial-gradient(circle 600px at ${mousePos.x}% ${mousePos.y}%, rgba(255,77,0,0.12), transparent)`,
          }}
        />

        {/* Grid lines background */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-[1400px]">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-mono text-xs tracking-[0.5em] text-forge-accent uppercase mb-6">
              AI-POWERED CONTENT CREATION
            </p>
          </motion.div>

          <motion.h1
            className="font-display text-display-xl text-forge-white leading-[0.85]"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            FORGE
            <br />
            <span className="text-stroke text-forge-accent">BOLD</span>
            <br />
            CONTENT
          </motion.h1>

          <motion.div
            className="mt-12 flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/register" className="btn-forge">
              <span>START FREE</span>
            </Link>
            <Link href="/login" className="btn-ghost">
              <span>ENTER STUDIO</span>
            </Link>
          </motion.div>

          <motion.p
            className="mt-8 max-w-md text-forge-smoke text-sm leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Text generation. Image creation. Brand consistency.
            <br />
            All in one brutally efficient workspace.
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <span className="font-mono text-[10px] tracking-[0.5em] text-forge-smoke uppercase">
            Scroll
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-forge-smoke to-transparent" />
        </motion.div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <section className="border-y border-forge-steel/50 py-5 overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-track">
            {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((word, i) => (
              <span
                key={i}
                className={`font-display text-3xl md:text-5xl mx-4 md:mx-8 ${
                  word === "•"
                    ? "text-forge-accent"
                    : i % 4 === 0
                    ? "text-forge-white"
                    : "text-stroke text-forge-smoke"
                }`}
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 md:py-40 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <p className="font-mono text-xs tracking-[0.5em] text-forge-accent uppercase mb-4">
              CAPABILITIES
            </p>
            <h2 className="font-display text-display-lg text-forge-white">
              WHAT YOU
              <br />
              CAN FORGE
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.number}
                className="group border-t border-forge-steel/50 py-12 md:py-16 md:pr-16 cursor-default"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="flex items-start gap-6">
                  <span className="font-mono text-xs text-forge-smoke mt-1">
                    {feature.number}
                  </span>
                  <div>
                    <h3 className="font-display text-display-sm text-forge-white group-hover:text-forge-accent transition-colors duration-500 whitespace-pre-line">
                      {feature.title}
                    </h3>
                    <p className="mt-4 text-forge-smoke text-sm leading-relaxed max-w-sm">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVERSE MARQUEE ── */}
      <section className="border-y border-forge-steel/50 py-4 overflow-hidden bg-forge-accent">
        <div className="marquee-container">
          <div className="marquee-track-reverse">
            {Array(8)
              .fill(null)
              .map((_, i) => (
                <span
                  key={i}
                  className="font-display text-4xl md:text-6xl mx-8 text-forge-black"
                >
                  START FORGING TODAY
                  <span className="mx-8">✦</span>
                </span>
              ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 md:py-48 px-6 md:px-12 relative">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle 800px at 50% 50%, rgba(255,77,0,0.15), transparent)",
          }}
        />
        <div className="max-w-[1400px] mx-auto text-center relative z-10">
          <motion.h2
            className="font-display text-display-xl text-forge-white"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            READY TO
            <br />
            <span className="text-forge-accent">FORGE?</span>
          </motion.h2>
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/register" className="btn-forge text-xl !py-5 !px-12">
              <span>CREATE ACCOUNT</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-forge-steel/50 py-8 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display text-sm tracking-[0.2em] text-forge-smoke">
            CONTENTFORGE © {new Date().getFullYear()}
          </span>
          <span className="font-mono text-xs text-forge-smoke/50">
            POWERED BY GPT-4.1 + GPT IMAGE 1
          </span>
        </div>
      </footer>
    </div>
  );
}
