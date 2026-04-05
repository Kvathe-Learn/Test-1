"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { RiLoader4Line, RiArrowRightLine } from "react-icons/ri";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }

      // Auto-login after registration
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        toast.error("Registered but login failed. Please login manually.");
        router.push("/login");
      } else {
        toast.success("Account created");
        router.push("/studio");
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-forge-black flex">
      {/* Left - visual panel (desktop only) */}
      <div className="hidden lg:flex flex-1 bg-forge-dark border-r border-forge-steel/30 items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: "radial-gradient(circle 500px at 40% 60%, rgba(255,77,0,0.2), transparent)",
          }}
        />
        <div className="relative z-10 text-center">
          <motion.h2
            className="font-display text-display-lg text-forge-white"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            START
            <br />
            <span className="text-stroke text-forge-accent">CREATING</span>
            <br />
            TODAY
          </motion.h2>
        </div>
      </div>

      {/* Right - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link href="/" className="font-display text-2xl tracking-[0.2em] text-forge-white mb-2 block">
            CONTENT<span className="text-forge-accent">FORGE</span>
          </Link>
          <p className="font-mono text-xs tracking-[0.3em] text-forge-smoke uppercase mb-12">
            CREATE YOUR ACCOUNT
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="label-forge">NAME</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input-forge"
                placeholder="YOUR NAME"
              />
            </div>

            <div>
              <label className="label-forge">EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-forge"
                placeholder="YOUR@EMAIL.COM"
              />
            </div>

            <div>
              <label className="label-forge">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="input-forge"
                placeholder="MIN 6 CHARACTERS"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-forge w-full !py-4"
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? (
                  <RiLoader4Line className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    CREATE ACCOUNT
                    <RiArrowRightLine className="w-4 h-4" />
                  </>
                )}
              </span>
            </button>
          </form>

          <p className="mt-8 text-center">
            <span className="font-mono text-xs text-forge-smoke">HAVE AN ACCOUNT? </span>
            <Link
              href="/login"
              className="font-display text-xs tracking-[0.2em] text-forge-accent hover:text-forge-accent-hover transition-colors"
            >
              LOGIN
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
