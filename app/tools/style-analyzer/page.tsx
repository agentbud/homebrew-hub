"use client";

import { useState } from "react";
import Link from "next/link";
import bjcpDataRaw from "@/app/data/bjcp2021.json";

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

/* -------------------------------------------------------
   RANGE NORMALIZER — handles all formats
-------------------------------------------------------- */
function normalizeRange(input: string): [number, number] | null {
  if (!input) return null;

  let s = input
    .replace(/[^\d.<>\-–—to ]/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  s = s.replace(/–|—/g, "-");
  s = s.replace(/ to /g, "-");

  if (s.startsWith("<")) {
    const v = parseFloat(s.slice(1));
    return isNaN(v) ? null : [0, v];
  }

  if (s.startsWith(">")) {
    const v = parseFloat(s.slice(1));
    return isNaN(v) ? null : [v, v * 2];
  }

  if (!s.includes("-")) {
    const v = parseFloat(s);
    return isNaN(v) ? null : [v, v];
  }

  const [a, b] = s.split("-");
  const min = parseFloat(a);
  const max = parseFloat(b);

  if (isNaN(min) || isNaN(max)) return null;

  return [min, max];
}

/* -------------------------------------------------------
   SMOOTH SCORING FUNCTION
-------------------------------------------------------- */
function scoreValue(value: number, min: number, max: number): number {
  if (value >= min && value <= max) return 1;
  const dist = value < min ? (min - value) / min : (value - max) / max;
  return Math.max(0, 1 - dist * 1.5);
}

/* -------------------------------------------------------
   CLEAN BJCP DATASET ONCE
-------------------------------------------------------- */
const bjcpStyles = bjcpDataRaw.styles.map((s: Style) => ({
  ...s,
  ogRange: normalizeRange(s.og),
  fgRange: normalizeRange(s.fg),
  ibuRange: normalizeRange(s.ibu),
  srmRange: normalizeRange(s.srm),
  abvRange: normalizeRange(s.abv),
}));

export default function StyleAnalyzer() {
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

    const scored: any[] = [];

    for (const style of bjcpStyles) {
      const { ogRange, fgRange, ibuRange, srmRange, abvRange } = style;

      if (!ogRange || !fgRange || !ibuRange || !srmRange || !abvRange) continue;

      const [ogMin, ogMax] = ogRange;
      const [fgMin, fgMax] = fgRange;
      const [ibuMin, ibuMax] = ibuRange;
      const [srmMin, srmMax] = srmRange;
      const [abvMin, abvMax] = abvRange;

      const scoreOg = scoreValue(beer.og, ogMin, ogMax);
      const scoreFg = scoreValue(beer.fg, fgMin, fgMax);
      const scoreIbu = scoreValue(beer.ibu, ibuMin, ibuMax);
      const scoreSrm = scoreValue(beer.srm, srmMin, srmMax);
      const scoreAbv = scoreValue(beer.abv, abvMin, abvMax);

      const total =
        scoreOg * 0.25 +
        scoreFg * 0.15 +
        scoreIbu * 0.25 +
        scoreSrm * 0.15 +
        scoreAbv * 0.20;

      scored.push({
        style,
        total,
        breakdown: {
          og: Math.round(scoreOg * 100),
          fg: Math.round(scoreFg * 100),
          ibu: Math.round(scoreIbu * 100),
          srm: Math.round(scoreSrm * 100),
          abv: Math.round(scoreAbv * 100),
        },
      });
    }

    scored.sort((a, b) => b.total - a.total);

    setResult({
      scoredCount: scored.length,
      top: scored.slice(0, 5),
    });
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <Link
        href="/tools"
        className="text-sm text-amber hover:underline dark:text-amber-light"
      >
        ← Back to Tools
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-malt-dark dark:text-foreground">
        Style Analyzer
      </h1>

      <p className="mt-2 text-malt/80 dark:text-zinc-400">
        Enter your beer’s stats to find the closest BJCP style match.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input label="OG" value={og} setValue={setOg} step="0.001" />
        <Input label="FG" value={fg} setValue={setFg} step="0.001" />
        <Input label="IBU" value={ibu} setValue={setIbu} />
        <Input label="SRM" value={srm} setValue={setSrm} />
        <Input label="ABV (%)" value={abv} setValue={setAbv} step="0.1" />
      </div>

      <button
        onClick={analyze}
        className="mt-6 w-full rounded-md bg-amber px-4 py-2 text-sm font-semibold text-white hover:bg-malt-dark"
      >
        Analyze Style
      </button>

      {result && <ResultCard result={result} />}
    </div>
  );
}

function Input({ label, value, setValue, step }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-malt-dark dark:text-foreground">
        {label}
      </label>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="mt-1 w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:border-white/20 dark:bg-zinc-800 dark:text-foreground"
      />
    </div>
  );
}

function ResultCard({ result }: any) {
  if (!result.top || result.top.length === 0) {
    return (
      <div className="mt-8 rounded-lg border border-red-300 bg-white p-6 shadow-sm dark:border-red-800 dark:bg-zinc-900">
        <p className="text-red-500 font-semibold mb-2">
          No BJCP styles could be analyzed.
        </p>
        <p className="text-malt/80 dark:text-zinc-400">
          Your BJCP dataset likely contains very few styles with numeric OG/FG/IBU/SRM/ABV ranges.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-lg border border-malt/20 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
      <p className="text-sm text-malt/70 dark:text-zinc-400 mb-4">
        Scored styles: {result.scoredCount}
      </p>

      {result.top.map((entry: any, idx: number) => (
        <div
          key={entry.style.id}
          className="mb-6 border-t border-malt/20 pt-4 first:border-t-0 first:pt-0"
        >
          <h2 className="text-lg font-bold text-malt-dark dark:text-foreground">
            #{idx + 1}: {entry.style.id} — {entry.style.name}
          </h2>

          <p className="text-malt/80 dark:text-zinc-400 mb-2">
            {entry.style.summary}
          </p>

          <p className="font-semibold text-malt-dark dark:text-foreground mb-2">
            Score: <span className="text-amber">{Math.round(entry.total * 100)}%</span>
          </p>

          <ul className="space-y-1 text-malt-dark dark:text-zinc-300 text-sm">
            <li><strong>OG:</strong> {entry.breakdown.og}%</li>
            <li><strong>FG:</strong> {entry.breakdown.fg}%</li>
            <li><strong>IBU:</strong> {entry.breakdown.ibu}%</li>
            <li><strong>SRM:</strong> {entry.breakdown.srm}%</li>
            <li><strong>ABV:</strong> {entry.breakdown.abv}%</li>
          </ul>
        </div>
      ))}
    </div>
  );
}
