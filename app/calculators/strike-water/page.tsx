"use client";

import { useState } from "react";
import Link from "next/link";

export default function StrikeWaterCalculator() {
  const [grainTemp, setGrainTemp] = useState("");
  const [mashTemp, setMashTemp] = useState("");
  const [ratio, setRatio] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const G = parseFloat(grainTemp);
    const T = parseFloat(mashTemp);
    const R = parseFloat(ratio);

    if (isNaN(G) || isNaN(T) || isNaN(R) || R <= 0) {
      setResult(null);
      return;
    }

    // Standard strike water formula
    const strikeTemp = (0.2 / R) * (T - G) + T;
    setResult(parseFloat(strikeTemp.toFixed(2)));
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
        Strike Water Temperature
      </h1>

      <p className="mt-2 text-malt/80 dark:text-zinc-400">
        Calculate the correct strike temperature based on grain temperature,
        target mash temperature, and mash thickness.
      </p>

      <div className="mt-10 space-y-4">
        <div>
          <label className="block text-sm font-medium">Grain Temperature (°F)</label>
          <input
            type="number"
            value={grainTemp}
            onChange={(e) => setGrainTemp(e.target.value)}
            className="mt-1 w-full rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Target Mash Temperature (°F)</label>
          <input
            type="number"
            value={mashTemp}
            onChange={(e) => setMashTemp(e.target.value)}
            className="mt-1 w-full rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Mash Thickness (qt/lb)</label>
          <input
            type="number"
            value={ratio}
            onChange={(e) => setRatio(e.target.value)}
            className="mt-1 w-full rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          />
        </div>

        <button
          onClick={calculate}
          className="mt-4 rounded bg-amber px-4 py-2 font-semibold text-white hover:bg-amber-dark"
        >
          Calculate
        </button>

        {result !== null && (
          <p className="mt-4 text-lg font-semibold">
            Strike Water Temperature: {result} °F
          </p>
        )}
      </div>
    </div>
  );
}
