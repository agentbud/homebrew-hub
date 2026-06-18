"use client";

import { useState } from "react";
import Link from "next/link";

export default function DilutionCalculator() {
  const [startVol, setStartVol] = useState("");
  const [startGrav, setStartGrav] = useState("");
  const [endVol, setEndVol] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const V1 = parseFloat(startVol);
    const G1 = parseFloat(startGrav);
    const V2 = parseFloat(endVol);

    if ([V1, G1, V2].some((n) => isNaN(n))) {
      setResult(null);
      return;
    }

    const points1 = (G1 - 1) * 1000;
    const points2 = (points1 * V1) / V2;
    const G2 = 1 + points2 / 1000;

    setResult(parseFloat(G2.toFixed(3)));
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/calculators" className="text-sm text-amber hover:underline">
        ← Back to Calculators
      </Link>

      <h1 className="mt-6 text-3xl font-bold">Dilution & Boil-Off Calculator</h1>

      <p className="mt-2 text-malt/80">
        Calculate gravity after dilution or boil-off.
      </p>

      <div className="mt-10 space-y-4">
        <div>
          <label className="block text-sm font-medium">Starting Volume (gal)</label>
          <input
            type="number"
            value={startVol}
            onChange={(e) => setStartVol(e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Starting Gravity (SG)</label>
          <input
            type="number"
            step="0.001"
            value={startGrav}
            onChange={(e) => setStartGrav(e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Ending Volume (gal)</label>
          <input
            type="number"
            value={endVol}
            onChange={(e) => setEndVol(e.target.value)}
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
          <p className="mt-4 text-lg font-semibold">New Gravity: {result}</p>
        )}
      </div>
    </div>
  );
}
