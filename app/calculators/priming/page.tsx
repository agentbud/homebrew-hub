"use client";

import { useState } from "react";
import Link from "next/link";

export default function PrimingSugarCalculator() {
  const [volume, setVolume] = useState("");
  const [temp, setTemp] = useState("");
  const [co2, setCo2] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const V = parseFloat(volume);
    const T = parseFloat(temp);
    const C = parseFloat(co2);

    if (isNaN(V) || isNaN(T) || isNaN(C)) {
      setResult(null);
      return;
    }

    const residual = 3.0378 - 0.050062 * T + 0.00026555 * T * T;
    const grams = (C - residual) * 4.01 * V;

    setResult(parseFloat(grams.toFixed(1)));
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/calculators" className="text-sm text-amber hover:underline">
        ← Back to Calculators
      </Link>

      <h1 className="mt-6 text-3xl font-bold">Priming Sugar Calculator</h1>

      <p className="mt-2 text-malt/80">
        Calculate corn sugar needed for bottle conditioning.
      </p>

      <div className="mt-10 space-y-4">
        <div>
          <label className="block text-sm font-medium">Batch Size (gallons)</label>
          <input
            type="number"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Beer Temperature (°F)</label>
          <input
            type="number"
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Target CO₂ Volumes</label>
          <input
            type="number"
            step="0.1"
            value={co2}
            onChange={(e) => setCo2(e.target.value)}
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
            Corn Sugar Needed: {result} g
          </p>
        )}
      </div>
    </div>
  );
}
