"use client";

import { useState } from "react";
import Link from "next/link";

export default function ABVCalculator() {
  const [og, setOg] = useState("");
  const [fg, setFg] = useState("");
  const [abv, setAbv] = useState<number | null>(null);
  const [attenuation, setAttenuation] = useState<number | null>(null);

  const calculate = () => {
    const OG = parseFloat(og);
    const FG = parseFloat(fg);

    if (isNaN(OG) || isNaN(FG) || OG <= 1 || FG <= 0) {
      setAbv(null);
      setAttenuation(null);
      return;
    }

    // Standard ABV formula
    const abvValue = (OG - FG) * 131.25;

    // Apparent attenuation
    const attenuationValue = ((OG - FG) / (OG - 1)) * 100;

    setAbv(parseFloat(abvValue.toFixed(2)));
    setAttenuation(parseFloat(attenuationValue.toFixed(1)));
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/calculators"
        className="text-sm text-amber hover:underline dark:text-amber-light"
      >
        ← Back to Calculators
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-malt-dark dark:text-foreground">
        ABV Calculator
      </h1>

      <p className="mt-2 text-malt/80 dark:text-zinc-400">
        Calculate alcohol by volume (ABV) using original gravity (OG) and final gravity (FG).
      </p>

      <div className="mt-10 space-y-4">
        <div>
          <label className="block text-sm font-medium">Original Gravity (OG)</label>
          <input
            type="number"
            step="0.001"
            value={og}
            onChange={(e) => setOg(e.target.value)}
            className="mt-1 w-full rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Final Gravity (FG)</label>
          <input
            type="number"
            step="0.001"
            value={fg}
            onChange={(e) => setFg(e.target.value)}
            className="mt-1 w-full rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          />
        </div>

        <button
          onClick={calculate}
          className="mt-4 rounded bg-amber px-4 py-2 font-semibold text-white hover:bg-amber-dark"
        >
          Calculate
        </button>

        {abv !== null && (
          <div className="mt-6 space-y-2">
            <p className="text-lg font-semibold">ABV: {abv}%</p>
            <p className="text-malt/80 dark:text-zinc-400">
              Apparent Attenuation: {attenuation}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
