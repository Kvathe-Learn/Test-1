"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  RiArchiveLine,
  RiGridLine,
  RiListUnordered,
  RiSearchLine,
  RiDeleteBinLine,
  RiFileCopyLine,
  RiImageLine,
  RiText,
  RiLoader4Line,
  RiCloseLine,
  RiFullscreenLine,
} from "react-icons/ri";

interface ContentItem {
  id: string;
  title: string;
  body: string | null;
  imageUrl: string | null;
  type: string;
  tone: string | null;
  prompt: string | null;
  createdAt: string;
}

const FILTERS = ["All", "Blog Post", "Social Media", "Email", "Ad Copy", "Product Description", "Image", "Press Release"];

export default function LibraryPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== "All") params.set("type", filter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/content?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems(data);
    } catch {
      toast.error("Failed to load library");
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/content?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
          SAVED CONTENT
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h1 className="font-display text-display-md text-forge-white">
            CONTENT VAULT
          </h1>
          <span className="font-mono text-xs text-forge-smoke">
            {items.length} ITEM{items.length !== 1 ? "S" : ""}
          </span>
        </div>
      </motion.div>

      {/* Controls bar */}
      <motion.div
        className="flex flex-col md:flex-row gap-4 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <RiSearchLine className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-forge-smoke" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SEARCH CONTENT..."
            className="input-forge !pl-7 text-sm"
          />
        </div>

        {/* View toggle */}
        <div className="flex gap-1 border border-forge-steel/50 self-start">
          <button
            onClick={() => setView("grid")}
            className={`p-2.5 transition-colors ${view === "grid" ? "bg-forge-accent text-forge-black" : "text-forge-smoke hover:text-forge-white"}`}
          >
            <RiGridLine className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2.5 transition-colors ${view === "list" ? "bg-forge-accent text-forge-black" : "text-forge-smoke hover:text-forge-white"}`}
          >
            <RiListUnordered className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="flex flex-wrap gap-2 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`tag-forge ${filter === f ? "active" : ""}`}
          >
            {f}
          </button>
        ))}
      </motion.div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-12 h-12 border-2 border-forge-steel border-t-forge-accent animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center py-24 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 border border-forge-steel/50 flex items-center justify-center">
            <RiArchiveLine className="w-6 h-6 text-forge-steel" />
          </div>
          <p className="font-display text-sm tracking-[0.2em] text-forge-smoke uppercase">
            NO CONTENT YET
          </p>
          <p className="font-mono text-xs text-forge-smoke/50">
            Generate content in the Studio to see it here
          </p>
        </motion.div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              className="card-forge cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onClick={() => setSelectedItem(item)}
            >
              {item.imageUrl && (
                <div className="relative -mx-6 -mt-6 mb-4 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}
              <div className="flex items-center gap-2 mb-3">
                <span className="tag-forge !px-2 !py-0.5 text-[10px]">{item.type}</span>
                {item.tone && (
                  <span className="font-mono text-[10px] text-forge-smoke">{item.tone}</span>
                )}
              </div>
              <h3 className="font-display text-sm tracking-wider text-forge-white uppercase line-clamp-2 mb-2">
                {item.title}
              </h3>
              {item.body && (
                <p className="text-forge-smoke text-xs leading-relaxed line-clamp-3">
                  {item.body}
                </p>
              )}
              <p className="font-mono text-[10px] text-forge-smoke/50 mt-3">
                {formatDate(item.createdAt)}
              </p>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              className="flex items-center gap-4 p-4 border border-forge-steel/30 hover:border-forge-accent/30 cursor-pointer transition-colors duration-300 group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              onClick={() => setSelectedItem(item)}
            >
              {item.imageUrl ? (
                <div className="w-12 h-12 flex-shrink-0 overflow-hidden">
                  <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 flex-shrink-0 border border-forge-steel/50 flex items-center justify-center">
                  <RiText className="w-4 h-4 text-forge-smoke" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-xs tracking-wider text-forge-white uppercase truncate">
                  {item.title}
                </h3>
                {item.body && (
                  <p className="text-forge-smoke text-xs truncate mt-0.5">{item.body}</p>
                )}
              </div>
              <span className="tag-forge !px-2 !py-0.5 text-[10px] flex-shrink-0">{item.type}</span>
              <span className="font-mono text-[10px] text-forge-smoke/50 flex-shrink-0 hidden sm:block">
                {formatDate(item.createdAt)}
              </span>
              <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.body && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleCopy(item.body!); }}
                    className="p-1.5 text-forge-smoke hover:text-forge-accent transition-colors"
                  >
                    <RiFileCopyLine className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                  className="p-1.5 text-forge-smoke hover:text-red-500 transition-colors"
                >
                  <RiDeleteBinLine className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 z-[100] bg-forge-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              className="bg-forge-dark border border-forge-steel/50 max-w-2xl w-full max-h-[85vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between p-6 border-b border-forge-steel/30">
                <div className="flex items-center gap-3">
                  <span className="tag-forge active !text-[10px]">{selectedItem.type}</span>
                  {selectedItem.tone && (
                    <span className="font-mono text-[10px] text-forge-smoke">{selectedItem.tone}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {selectedItem.body && (
                    <button
                      onClick={() => handleCopy(selectedItem.body!)}
                      className="p-2 text-forge-smoke hover:text-forge-accent transition-colors"
                    >
                      <RiFileCopyLine className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => { handleDelete(selectedItem.id); }}
                    className="p-2 text-forge-smoke hover:text-red-500 transition-colors"
                  >
                    <RiDeleteBinLine className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-2 text-forge-smoke hover:text-forge-white transition-colors"
                  >
                    <RiCloseLine className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal content */}
              <div className="p-6">
                <h2 className="font-display text-display-sm text-forge-white uppercase mb-4">
                  {selectedItem.title}
                </h2>

                {selectedItem.imageUrl && (
                  <div className="mb-6 border border-forge-steel/30 overflow-hidden">
                    <img src={selectedItem.imageUrl} alt="" className="w-full h-auto" />
                  </div>
                )}

                {selectedItem.body && (
                  <div className="bg-forge-carbon border border-forge-steel/30 p-5">
                    <div className="font-body text-sm text-forge-light leading-relaxed whitespace-pre-wrap">
                      {selectedItem.body}
                    </div>
                  </div>
                )}

                {selectedItem.prompt && (
                  <div className="mt-4 pt-4 border-t border-forge-steel/30">
                    <p className="label-forge mb-1">ORIGINAL PROMPT</p>
                    <p className="font-mono text-xs text-forge-smoke">{selectedItem.prompt}</p>
                  </div>
                )}

                <p className="font-mono text-[10px] text-forge-smoke/50 mt-4">
                  Created {formatDate(selectedItem.createdAt)}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
