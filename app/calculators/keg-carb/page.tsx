"use client";

import { useState } from "react";
import Link from "next/link";

export default function KegCarbCalculator() {
  const [temp, setTemp] = useState("");
  const [vols, setVols] = useState("");
  const [psi, setPsi] = useState<number | null>(null);

  const calculate = () => {
    const T = parseFloat(temp);
    const V = parseFloat(vols);

    if (isNaN(T) || isNaN(V)) {
      setPsi(null);
      return;
    }

    // Carbonation pressure formula (empirical)
    // PSI = -16.6999 - 0.0101059*T + 0.00116512*T^2 + 0.173354*T*V + 4.24267*V - 0.0684226*V^2
    const pressure =
      -16.6999 -
      0.0101059 * T +
      0.00116512 * T * T +
      0.173354 * T * V +
      4.24267 * V -
      0.0684226 * V * V;

    setPsi(parseFloat(pressure.toFixed(1)));
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
        Keg Carbonation Calculator
      </h1>

      <p className="mt-2 text-malt/80 dark:text-zinc-400">
        Determine the PSI needed to achieve a target carbonation level at a given temperature.
      </p>

      <div className="mt-10 space-y-4">
        <div>
          <label className="block text-sm font-medium">Beer Temperature (°F)</label>
          <input
            type="number"
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            className="mt-1 w-full rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Target CO₂ Volumes</label>
          <input
            type="number"
            step="0.1"
            value={vols}
            onChange={(e) => setVols(e.target.value)}
            className="mt-1 w-full rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          />
        </div>

        <button
          onClick={calculate}
          className="mt-4 rounded bg-amber px-4 py-2 font-semibold text-white hover:bg-amber-dark"
        >
          Calculate
        </button>

        {psi !== null && (
          <p className="mt-4 text-lg font-semibold">
            Required Pressure: {psi} PSI
          </p>
        )}
      </div>
    </div>
  );
}
