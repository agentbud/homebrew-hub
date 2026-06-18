"use client";

import { useState } from "react";
import Link from "next/link";

export default function RecipeGravityEstimator() {
  const [points, setPoints] = useState("");
  const [efficiency, setEfficiency] = useState("");
  const [volume, setVolume] = useState("");
  const [og, setOg] = useState<number | null>(null);

  const calculate = () => {
    const P = parseFloat(points);
    const E = parseFloat(efficiency) / 100;
    const V = parseFloat(volume);

    if ([P, E, V].some((n) => isNaN(n))) {
      setOg(null);
      return;
    }

    const totalPoints = P * E;
    const sg = 1 + totalPoints / (1000 * V);

    setOg(parseFloat(sg.toFixed(3)));
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/calculators" className="text-sm text-amber hover:underline">
        ← Back to Calculators
      </Link>

      <h1 className="mt-6 text-3xl font-bold">Recipe OG Estimator</h1>

      <p className="mt-2 text-malt/80">
        Estimate original gravity from total grain points, efficiency, and volume.
      </p>

      <div className="mt-10 space-y-4">
        <div>
          <label className="block text-sm font-medium">Total Grain Points</label>
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Brewhouse Efficiency (%)</label>
          <input
            type="number"
            value={efficiency}
            onChange={(e) => setEfficiency(e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Batch Volume (gal)</label>
          <input
            type="number"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        <button
          onClick={calculate}
          className="mt-4 rounded bg-amber px-4 py-2 font-semibold text-white"
        >
          Calculate
        </button>

        {og !== null && (
          <p className="mt-4 text-lg font-semibold">Estimated OG: {og}</p>
        )}
      </div>
    </div>
  );
}
