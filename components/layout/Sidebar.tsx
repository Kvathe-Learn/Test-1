"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineSparkles,
  HiOutlinePhoto,
  HiOutlineArchiveBox,
  HiOutlineRectangleStack,
  HiOutlineSwatchIcon,
  HiOutlineArrowRightOnRectangle,
  HiOutlineBars3,
  HiOutlineXMark,
} from "react-icons/hi2";
import {
  RiSparklingLine,
  RiImageLine,
  RiArchiveLine,
  RiLayoutGridLine,
  RiPaletteLine,
  RiLogoutBoxLine,
  RiMenuLine,
  RiCloseLine,
} from "react-icons/ri";

const NAV_ITEMS = [
  { href: "/studio", label: "STUDIO", icon: RiSparklingLine, accent: true },
  { href: "/images", label: "IMAGES", icon: RiImageLine },
  { href: "/library", label: "LIBRARY", icon: RiArchiveLine },
  { href: "/templates", label: "TEMPLATES", icon: RiLayoutGridLine },
  { href: "/brand-kit", label: "BRAND KIT", icon: RiPaletteLine },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userInitial = session?.user?.name?.[0]?.toUpperCase() || "?";

  return (
    <>
      {/* ── MOBILE TOGGLE ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-5 left-5 z-50 md:hidden w-10 h-10 flex items-center justify-center bg-forge-carbon border border-forge-steel"
        aria-label="Open navigation"
      >
        <RiMenuLine className="w-5 h-5 text-forge-white" />
      </button>

      {/* ── MOBILE OVERLAY ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-forge-black/80 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ── */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50
          w-[240px] bg-forge-black border-r border-forge-steel/30
          flex flex-col
          transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          md:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo area */}
        <div className="px-6 py-7 border-b border-forge-steel/30 flex items-center justify-between">
          <Link href="/studio" className="font-display text-lg tracking-[0.15em] text-forge-white">
            CONTENT
            <span className="text-forge-accent">FORGE</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden w-8 h-8 flex items-center justify-center text-forge-smoke hover:text-forge-white"
          >
            <RiCloseLine className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    group relative flex items-center gap-3 px-4 py-3
                    font-display text-xs tracking-[0.25em] uppercase
                    transition-all duration-300
                    ${
                      isActive
                        ? "text-forge-accent"
                        : "text-forge-smoke hover:text-forge-white"
                    }
                  `}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-forge-accent"
                      layoutId="sidebar-indicator"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}

                  <Icon
                    className={`w-4 h-4 transition-colors duration-300 ${
                      isActive ? "text-forge-accent" : "text-forge-smoke group-hover:text-forge-white"
                    }`}
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User section */}
        <div className="border-t border-forge-steel/30 px-4 py-4">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 bg-forge-accent flex items-center justify-center font-display text-sm text-forge-black">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body text-xs text-forge-white truncate">
                {session?.user?.name || "User"}
              </p>
              <p className="font-mono text-[10px] text-forge-smoke truncate">
                {session?.user?.email || ""}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 w-full px-4 py-2 font-display text-xs tracking-[0.25em] uppercase text-forge-smoke hover:text-forge-accent transition-colors duration-300"
          >
            <RiLogoutBoxLine className="w-4 h-4" />
            LOGOUT
          </button>
        </div>
      </aside>
    </>
  );
}
