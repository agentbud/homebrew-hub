"use client";

import { useState } from "react";
import Link from "next/link";
import bjcpData from "@/app/data/bjcp2021.json";

type Style = {
  id: string;
  category: number;
  name: string;
  og: string;
  fg: string;
  ibu: string;
  srm: string;
  abv: string;
  summary: string;
};

export default function BjcpCompare() {
  const styles: Style[] = bjcpData.styles;

  // Sort by category then ID (1A, 1B, 2A, etc.)
  const sortedStyles = [...styles].sort((a, b) => {
    if (a.category !== b.category) return a.category - b.category;
    return a.id.localeCompare(b.id);
  });

  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");

  const leftStyle = sortedStyles.find((s) => s.id === left);
  const rightStyle = sortedStyles.find((s) => s.id === right);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* RETURN LINK */}
      <Link
        href="/tools"
        className="text-sm text-amber hover:underline dark:text-amber-light"
      >
        ← Back to Tools
      </Link>

      {/* TITLE */}
      <h1 className="mt-6 text-3xl font-bold text-malt-dark dark:text-foreground">
        BJCP Style Comparison
      </h1>

      <p className="mt-2 text-malt/80 dark:text-zinc-400">
        Select two BJCP styles to compare their stats and summaries side by side.
      </p>

      {/* DROPDOWNS */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-malt-dark dark:text-foreground mb-1">
            Left Style
          </label>
          <select
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            className="w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:border-white/20 dark:bg-zinc-800 dark:text-foreground"
          >
            <option value="">Select a style</option>
            {sortedStyles.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id} — {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-malt-dark dark:text-foreground mb-1">
            Right Style
          </label>
          <select
            value={right}
            onChange={(e) => setRight(e.target.value)}
            className="w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:border-white/20 dark:bg-zinc-800 dark:text-foreground"
          >
            <option value="">Select a style</option>
            {sortedStyles.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id} — {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* COMPARISON CARDS */}
      {leftStyle && rightStyle && (
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* LEFT CARD */}
          <div className="rounded-lg border border-malt/20 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <h2 className="text-xl font-semibold text-malt-dark dark:text-foreground mb-2">
              {leftStyle.id} — {leftStyle.name}
            </h2>

            <ul className="space-y-1 text-malt-dark dark:text-zinc-300">
              <li><strong>OG:</strong> {leftStyle.og}</li>
              <li><strong>FG:</strong> {leftStyle.fg}</li>
              <li><strong>ABV:</strong> {leftStyle.abv}</li>
              <li><strong>IBU:</strong> {leftStyle.ibu}</li>
              <li><strong>SRM:</strong> {leftStyle.srm}</li>
            </ul>

            <p className="mt-3 text-malt/80 dark:text-zinc-400">
              {leftStyle.summary}
            </p>
          </div>

          {/* RIGHT CARD */}
          <div className="rounded-lg border border-malt/20 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <h2 className="text-xl font-semibold text-malt-dark dark:text-foreground mb-2">
              {rightStyle.id} — {rightStyle.name}
            </h2>

            <ul className="space-y-1 text-malt-dark dark:text-zinc-300">
              <li><strong>OG:</strong> {rightStyle.og}</li>
              <li><strong>FG:</strong> {rightStyle.fg}</li>
              <li><strong>ABV:</strong> {rightStyle.abv}</li>
              <li><strong>IBU:</strong> {rightStyle.ibu}</li>
              <li><strong>SRM:</strong> {rightStyle.srm}</li>
            </ul>

            <p className="mt-3 text-malt/80 dark:text-zinc-400">
              {rightStyle.summary}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
