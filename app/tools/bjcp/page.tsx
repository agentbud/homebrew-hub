"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import bjcp from "@/app/data/bjcp2021.json";

export default function BJCPBrowser() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");

  const categories = bjcp.categories;
  const styles = bjcp.styles;

  const filteredStyles = useMemo(() => {
    return styles.filter((style: any) => {
      const matchesCategory =
        selectedCategory === "all" || style.category === selectedCategory;

      const q = query.toLowerCase();
      const matchesQuery =
        style.name.toLowerCase().includes(q) ||
        style.id.toLowerCase().includes(q) ||
        categories
          .find((c: any) => c.id === style.category)
          ?.name.toLowerCase()
          .includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [query, selectedCategory, categories, styles]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <Link
        href="/tools"
        className="text-sm text-amber hover:underline dark:text-amber-light"
      >
        ← Back to Tools
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-malt-dark dark:text-foreground">
        BJCP 2021 Style Browser
      </h1>

      <p className="mt-2 text-malt/80 dark:text-zinc-400">
        Browse all BJCP 2021 beer styles with stats and original summaries.
      </p>

      {/* Search + Category Filter */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <input
          placeholder="Search by name, ID, or category..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
        />

        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(
              e.target.value === "all" ? "all" : Number(e.target.value)
            )
          }
          className="w-full rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
        >
          <option value="all">All Categories</option>
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>
              {cat.id}. {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      <div className="mt-10 space-y-6">
        {filteredStyles.map((style: any) => {
          const category = categories.find((c: any) => c.id === style.category);

          return (
            <div
              key={style.id}
              className="rounded border border-malt/20 bg-white p-5 dark:bg-zinc-900"
            >
              <h2 className="text-xl font-semibold text-malt-dark dark:text-foreground">
                {style.id} — {style.name}
              </h2>

              <p className="text-sm text-malt/70 dark:text-zinc-400">
                {category?.id}. {category?.name}
              </p>

              <p className="mt-3 text-sm">{style.summary}</p>

              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <p>
                  <strong>OG:</strong> {style.og}
                </p>
                <p>
                  <strong>FG:</strong> {style.fg}
                </p>
                <p>
                  <strong>IBU:</strong> {style.ibu}
                </p>
                <p>
                  <strong>SRM:</strong> {style.srm}
                </p>
                <p>
                  <strong>ABV:</strong> {style.abv}
                </p>
              </div>
            </div>
          );
        })}

        {filteredStyles.length === 0 && (
          <p className="text-malt/70 dark:text-zinc-400">No styles found.</p>
        )}
      </div>
    </div>
  );
}
