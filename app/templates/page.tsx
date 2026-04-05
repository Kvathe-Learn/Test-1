"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  RiLayoutGridLine,
  RiArrowRightLine,
  RiLoader4Line,
  RiSparklingLine,
} from "react-icons/ri";

interface Template {
  id: string;
  name: string;
  description: string | null;
  category: string;
  promptTemplate: string;
  tone: string | null;
  contentType: string;
}

const CATEGORIES = ["All", "Marketing", "Social Media", "Email", "SEO", "E-commerce", "Brand"];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const router = useRouter();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/templates");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTemplates(data);
    } catch {
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  const filtered = category === "All"
    ? templates
    : templates.filter((t) => t.category === category);

  const handleUse = (template: Template) => {
    // Store template in sessionStorage and navigate to studio
    sessionStorage.setItem("forge_template", JSON.stringify(template));
    router.push("/studio");
  };

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
          QUICK START
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h1 className="font-display text-display-md text-forge-white">
            TEMPLATES
          </h1>
          <span className="font-mono text-xs text-forge-smoke">
            {filtered.length} TEMPLATE{filtered.length !== 1 ? "S" : ""}
          </span>
        </div>
      </motion.div>

      {/* Category filters */}
      <motion.div
        className="flex flex-wrap gap-2 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`tag-forge ${category === cat ? "active" : ""}`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Templates grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-12 h-12 border-2 border-forge-steel border-t-forge-accent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 border border-forge-steel/50 flex items-center justify-center">
            <RiLayoutGridLine className="w-6 h-6 text-forge-steel" />
          </div>
          <p className="font-display text-sm tracking-[0.2em] text-forge-smoke uppercase">
            NO TEMPLATES IN THIS CATEGORY
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((template, i) => (
            <motion.div
              key={template.id}
              className="card-forge group cursor-pointer relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onClick={() => handleUse(template)}
            >
              {/* Category + type tags */}
              <div className="flex items-center gap-2 mb-4">
                <span className="tag-forge active !px-2 !py-0.5 text-[10px]">
                  {template.category}
                </span>
                <span className="font-mono text-[10px] text-forge-smoke">
                  {template.contentType}
                </span>
              </div>

              {/* Template name */}
              <h3 className="font-display text-display-sm text-forge-white uppercase mb-3 group-hover:text-forge-accent transition-colors duration-500">
                {template.name}
              </h3>

              {/* Description */}
              {template.description && (
                <p className="text-forge-smoke text-xs leading-relaxed mb-6 line-clamp-3">
                  {template.description}
                </p>
              )}

              {/* Use button */}
              <div className="flex items-center gap-2 font-display text-xs tracking-[0.2em] text-forge-accent uppercase">
                <RiSparklingLine className="w-3.5 h-3.5" />
                USE TEMPLATE
                <RiArrowRightLine className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>

              {/* Hover accent line at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-forge-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
