"use client";

import { useState } from "react";
import Link from "next/link";

// Sample recipe database (you can expand this later)
const RECIPES = [
  {
    name: "American Pale Ale",
    grains: ["2-Row", "Crystal 40"],
    hops: ["Cascade", "Centennial"],
    yeast: ["US-05", "WLP001"],
  },
  {
    name: "German Pils",
    grains: ["Pilsner Malt"],
    hops: ["Hallertau", "Tettnang"],
    yeast: ["W34/70", "2124"],
  },
  {
    name: "Belgian Dubbel",
    grains: ["Pilsner Malt", "Munich", "Special B"],
    hops: ["Styrian Goldings"],
    yeast: ["WLP530", "WY1762"],
  },
];

export default function BrewToday() {
  const [grainInput, setGrainInput] = useState("");
  const [hopInput, setHopInput] = useState("");
  const [yeastInput, setYeastInput] = useState("");

  const [results, setResults] = useState<any[]>([]);

  function analyze() {
    const grains = grainInput
      .split(",")
      .map((g) => g.trim().toLowerCase())
      .filter(Boolean);

    const hops = hopInput
      .split(",")
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean);

    const yeast = yeastInput
      .split(",")
      .map((y) => y.trim().toLowerCase())
      .filter(Boolean);

    const matches = RECIPES.filter((recipe) => {
      const hasGrains = recipe.grains.every((g) =>
        grains.includes(g.toLowerCase())
      );
      const hasHops = recipe.hops.every((h) =>
        hops.includes(h.toLowerCase())
      );
      const hasYeast = recipe.yeast.some((y) =>
        yeast.includes(y.toLowerCase())
      );

      return hasGrains && hasHops && hasYeast;
    });

    setResults(matches);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* RETURN LINK */}
      <Link
        href="/recipe-intelligence"
        className="text-sm text-amber hover:underline dark:text-amber-light"
      >
        ← Back to Recipe Intelligence
      </Link>

      {/* TITLE */}
      <h1 className="mt-6 text-3xl font-bold text-malt-dark dark:text-foreground">
        What Can I Brew Today?
      </h1>

      <p className="mt-2 text-malt/80 dark:text-zinc-400">
        Enter your current inventory to see which recipes you can brew right now.
      </p>

      {/* INPUTS */}
      <div className="mt-10 space-y-4 mb-6 rounded-lg border border-malt/20 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <div>
          <label className="block text-sm font-medium text-malt-dark dark:text-foreground">
            Your Grains
          </label>
          <input
            type="text"
            placeholder="e.g., 2-Row, Crystal 40, Munich"
            value={grainInput}
            onChange={(e) => setGrainInput(e.target.value)}
            className="mt-1 w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:border-white/20 dark:bg-zinc-800 dark:text-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-malt-dark dark:text-foreground">
            Your Hops
          </label>
          <input
            type="text"
            placeholder="e.g., Cascade, Centennial, Hallertau"
            value={hopInput}
            onChange={(e) => setHopInput(e.target.value)}
            className="mt-1 w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:border-white/20 dark:bg-zinc-800 dark:text-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-malt-dark dark:text-foreground">
            Your Yeast
          </label>
          <input
            type="text"
            placeholder="e.g., US-05, WLP001, W34/70"
            value={yeastInput}
            onChange={(e) => setYeastInput(e.target.value)}
            className="mt-1 w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:border-white/20 dark:bg-zinc-800 dark:text-foreground"
          />
        </div>

        <button
          onClick={analyze}
          className="w-full rounded-md bg-amber px-4 py-2 text-sm font-semibold text-white hover:bg-malt-dark"
        >
          Analyze Inventory
        </button>
      </div>

      {/* RESULTS */}
      {results.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-malt-dark dark:text-foreground">
            You Can Brew:
          </h2>

          {results.map((r) => (
            <div
              key={r.name}
              className="rounded-lg border border-malt/20 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900"
            >
              <h3 className="text-xl font-bold text-malt-dark dark:text-foreground">
                {r.name}
              </h3>

              <p className="mt-2 text-malt/80 dark:text-zinc-400">
                <strong>Grains:</strong> {r.grains.join(", ")}
              </p>
              <p className="text-malt/80 dark:text-zinc-400">
                <strong>Hops:</strong> {r.hops.join(", ")}
              </p>
              <p className="text-malt/80 dark:text-zinc-400">
                <strong>Yeast:</strong> {r.yeast.join(", ")}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-malt/70 dark:text-zinc-500">
          No matching recipes yet — try adding more ingredients.
        </p>
      )}
    </div>
  );
}
