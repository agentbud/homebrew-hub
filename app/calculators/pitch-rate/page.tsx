"use client";

import { useState } from "react";
import Link from "next/link";

export default function PitchRateCalculator() {
  const [volume, setVolume] = useState("");
  const [gravity, setGravity] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const V = parseFloat(volume);
    const G = parseFloat(gravity);

    if (isNaN(V) || isNaN(G)) {
      setResult(null);
      return;
    }

    const millionCells = (G * 1000 - 1000) * 0.75 * V;
    setResult(parseFloat(millionCells.toFixed(0)));
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/calculators" className="text-sm text-amber hover:underline">
        ← Back to Calculators
      </Link>

      <h1 className="mt-6 text-3xl font-bold">Yeast Pitch Rate</h1>

      <p className="mt-2 text-malt/80">
        Standard ale pitch rate: 0.75 million cells per mL per °P.
      </p>

      <div className="mt-10 space-y-4">
        <div>
          <label className="block text-sm font-medium">Batch Volume (L)</label>
          <input
            type="number"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Original Gravity (SG)</label>
          <input
            type="number"
            step="0.001"
            value={gravity}
            onChange={(e) => setGravity(e.target.value)}
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
            Required Cells: {result} million
          </p>
        )}
      </div>
    </div>
  );
}
