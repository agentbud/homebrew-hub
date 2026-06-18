"use client";

import { useState } from "react";
import Link from "next/link";

export default function IBUCalculator() {
  const [alpha, setAlpha] = useState("");
  const [weight, setWeight] = useState("");
  const [time, setTime] = useState("");
  const [gravity, setGravity] = useState("");
  const [volume, setVolume] = useState("");
  const [ibu, setIbu] = useState<number | null>(null);

  const calculate = () => {
    const A = parseFloat(alpha) / 100;
    const W = parseFloat(weight);
    const T = parseFloat(time);
    const G = parseFloat(gravity);
    const V = parseFloat(volume);

    if ([A, W, T, G, V].some((n) => isNaN(n))) {
      setIbu(null);
      return;
    }

    const utilization =
      (1.65 * Math.pow(0.000125, G - 1)) *
      ((1 - Math.exp(-0.04 * T)) / 4.15);

    const ibuValue = (A * W * 7490 * utilization) / V;

    setIbu(parseFloat(ibuValue.toFixed(1)));
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/calculators" className="text-sm text-amber hover:underline">
        ← Back to Calculators
      </Link>

      <h1 className="mt-6 text-3xl font-bold">IBU Calculator</h1>

      <p className="mt-2 text-malt/80">
        Tinseth formula for bitterness estimation.
      </p>

      <div className="mt-10 space-y-4">
        <div>
          <label className="block text-sm font-medium">Alpha Acid %</label>
          <input
            type="number"
            step="0.1"
            value={alpha}
            onChange={(e) => setAlpha(e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Hop Weight (oz)</label>
          <input
            type="number"
            step="0.01"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Boil Time (min)</label>
          <input
            type="number"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Boil Gravity</label>
          <input
            type="number"
            step="0.001"
            value={gravity}
            onChange={(e) => setGravity(e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Batch Volume (gal)</label>
          <input
            type="number"
            step="0.1"
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

        {ibu !== null && (
          <p className="mt-4 text-lg font-semibold">IBU: {ibu}</p>
        )}
      </div>
    </div>
  );
}
