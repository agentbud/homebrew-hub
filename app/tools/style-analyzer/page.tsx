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

function parseRange(range: string): [number, number] {
  const parts = range.replace("%", "").split("–");
  return [parseFloat(parts[0]), parseFloat(parts[1])];
}

export default function StyleAnalyzer() {
  const styles: Style[] = bjcpData.styles;

  const [og, setOg] = useState("");
  const [fg, setFg] = useState("");
  const [ibu, setIbu] = useState("");
  const [srm, setSrm] = useState("");
  const [abv, setAbv] = useState("");

  const [result, setResult] = useState<any>(null);

  function analyze() {
    if (!og || !fg || !ibu || !srm || !abv) return;

    const beer = {
      og: parseFloat(og),
      fg: parseFloat(fg),
      ibu: parseFloat(ibu),
      srm: parseFloat(srm),
      abv: parseFloat(abv),
    };

    let best = null;
    let bestScore = -Infinity;

    for (const style of styles) {
      const [ogMin, ogMax] = parseRange(style.og);
      const [fgMin, fgMax] = parseRange(style.fg);
      const [ibuMin, ibuMax] = parseRange(style.ibu);
      const [srmMin, srmMax] = parseRange(style.srm);
      const [abvMin, abvMax] = parseRange(style.abv);

      function score(value: number, min: number, max: number) {
        if (value < min) return value / min;
        if (value > max) return max / value;
        return 1;
      }

      const scoreOg = score(beer.og, ogMin, ogMax);
      const scoreFg = score(beer.fg, fgMin, fgMax);
      const scoreIbu = score(beer.ibu, ibuMin, ibuMax);
      const scoreSrm = score(beer.srm, srmMin, srmMax);
      const scoreAbv = score(beer.abv, abvMin, abvMax);

      const total =
        scoreOg * 0.25 +
        scoreFg * 0.15 +
        scoreIbu * 0.25 +
        scoreSrm * 0.15 +
        scoreAbv * 0.20;

      if (total > bestScore) {
        bestScore = total;
        best = {
          style,
          score: Math.round(total * 100),
          breakdown: {
            og: Math.round(scoreOg * 100),
            fg: Math.round(scoreFg * 100),
            ibu: Math.round(scoreIbu * 100),
            srm: Math.round(scoreSrm * 100),
            abv: Math.round(scoreAbv * 100),
          },
        };
      }
    }

    setResult(best);
  }

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
        Style Analyzer
      </h1>

      <p className="mt-2 text-malt/80 dark:text-zinc-400">
        Enter your beer’s stats to find the closest BJCP style match.
      </p>

      {/* INPUT GRID */}
      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-malt-dark dark:text-foreground">
            OG
          </label>
          <input
            type="number"
            step="0.001"
            value={og}
            onChange={(e) => setOg(e.target.value)}
            className="mt-1 w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:border-white/20 dark:bg-zinc-800 dark:text-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-malt-dark dark:text-foreground">
            FG
          </label>
          <input
            type="number"
            step="0.001"
            value={fg}
            onChange={(e) => setFg(e.target.value)}
            className="mt-1 w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:border-white/20 dark:bg-zinc-800 dark:text-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-malt-dark dark:text-foreground">
            IBU
          </label>
          <input
            type="number"
            value={ibu}
            onChange={(e) => setIbu(e.target.value)}
            className="mt-1 w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:border-white/20 dark:bg-zinc-800 dark:text-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-malt-dark dark:text-foreground">
            SRM
          </label>
          <input
            type="number"
            value={srm}
            onChange={(e) => setSrm(e.target.value)}
            className="mt-1 w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:border-white/20 dark:bg-zinc-800 dark:text-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-malt-dark dark:text-foreground">
            ABV (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={abv}
            onChange={(e) => setAbv(e.target.value)}
            className="mt-1 w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:border-white/20 dark:bg-zinc-800 dark:text-foreground"
          />
        </div>
      </div>

      {/* ANALYZE BUTTON */}
      <button
        onClick={analyze}
        className="mt-6 w-full rounded-md bg-amber px-4 py-2 text-sm font-semibold text-white hover:bg-malt-dark"
      >
        Analyze Style
      </button>

      {/* RESULTS */}
      {result && (
        <div className="mt-8 rounded-lg border border-malt/20 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <h2 className="text-2xl font-bold text-malt-dark dark:text-foreground mb-2">
            Closest Match: {result.style.id} — {result.style.name}
          </h2>

          <p className="text-malt/80 dark:text-zinc-400 mb-4">
            {result.style.summary}
          </p>

          <p className="text-xl font-semibold text-malt-dark dark:text-foreground mb-4">
            Confidence Score:{" "}
            <span className="text-amber">{result.score}%</span>
          </p>

          <h3 className="text-lg font-semibold text-malt-dark dark:text-foreground mb-2">
            Parameter Breakdown
          </h3>

          <ul className="space-y-1 text-malt-dark dark:text-zinc-300">
            <li><strong>OG:</strong> {result.breakdown.og}%</li>
            <li><strong>FG:</strong> {result.breakdown.fg}%</li>
            <li><strong>IBU:</strong> {result.breakdown.ibu}%</li>
            <li><strong>SRM:</strong> {result.breakdown.srm}%</li>
            <li><strong>ABV:</strong> {result.breakdown.abv}%</li>
          </ul>
        </div>
      )}
    </div>
  );
}
