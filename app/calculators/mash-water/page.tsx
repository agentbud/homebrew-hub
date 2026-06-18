"use client";

import { useState } from "react";
import Link from "next/link";

export default function MashWaterCalculator() {
  const [grain, setGrain] = useState("");
  const [ratio, setRatio] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const G = parseFloat(grain);
    const R = parseFloat(ratio);

    if (isNaN(G) || isNaN(R)) {
      setResult(null);
      return;
    }

    const quarts = G * R;
    const gallons = quarts / 4;

    setResult(parseFloat(gallons.toFixed(2)));
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/calculators" className="text-sm text-amber hover:underline">
        ← Back to Calculators
      </Link>

      <h1 className="mt-6 text-3xl font-bold">Mash Water Volume</h1>

      <p className="mt-2 text-malt/80">
        Calculate mash water based on grain weight and mash thickness.
      </p>

      <div className="mt-10 space-y-4">
        <div>
          <label className="block text-sm font-medium">Grain Weight (lb)</label>
          <input
            type="number"
            value={grain}
            onChange={(e) => setGrain(e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Mash Thickness (qt/lb)</label>
          <input
            type="number"
            step="0.1"
            value={ratio}
            onChange={(e) => setRatio(e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        <button
          onClick={calculate}
          className="mt-4 rounded bg-amber px-4 py-2 font-semibold text-white"
        >
          Calculate
        </button>

        {result !== null && (
          <p className="mt-4 text-lg font-semibold">
            Mash Water Needed: {result} gallons
          </p>
        )}
      </div>
    </div>
  );
}
