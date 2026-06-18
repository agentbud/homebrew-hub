"use client";

import { useState } from "react";
import Link from "next/link";

export default function WaterChemistry() {
  const [ca, setCa] = useState("");
  const [mg, setMg] = useState("");
  const [hco3, setHco3] = useState("");
  const [ra, setRa] = useState<number | null>(null);
  const [ph, setPh] = useState<number | null>(null);

  const calculate = () => {
    const Ca = parseFloat(ca);
    const Mg = parseFloat(mg);
    const H = parseFloat(hco3);

    if ([Ca, Mg, H].some((n) => isNaN(n))) {
      setRa(null);
      setPh(null);
      return;
    }

    // Residual Alkalinity (ppm as CaCO3)
    const residual = H - (Ca / 3.5 + Mg / 7);

    // Very rough mash pH estimate (base malt only)
    const estimatedPh = 5.7 + residual * 0.001;

    setRa(parseFloat(residual.toFixed(1)));
    setPh(parseFloat(estimatedPh.toFixed(2)));
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
        Water Chemistry
      </h1>

      <p className="mt-2 text-malt/80 dark:text-zinc-400">
        Calculate Residual Alkalinity (RA) and a rough mash pH estimate based on
        calcium, magnesium, and bicarbonate levels.
      </p>

      <div className="mt-10 space-y-4">
        <div>
          <label className="block text-sm font-medium">Calcium (ppm)</label>
          <input
            type="number"
            value={ca}
            onChange={(e) => setCa(e.target.value)}
            className="mt-1 w-full rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Magnesium (ppm)</label>
          <input
            type="number"
            value={mg}
            onChange={(e) => setMg(e.target.value)}
            className="mt-1 w-full rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Bicarbonate (ppm)</label>
          <input
            type="number"
            value={hco3}
            onChange={(e) => setHco3(e.target.value)}
            className="mt-1 w-full rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          />
        </div>

        <button
          onClick={calculate}
          className="mt-4 rounded bg-amber px-4 py-2 font-semibold text-white hover:bg-amber-dark"
        >
          Calculate
        </button>

        {(ra !== null || ph !== null) && (
          <div className="mt-6 space-y-2">
            {ra !== null && (
              <p className="text-lg font-semibold">
                Residual Alkalinity: {ra} ppm as CaCO₃
              </p>
            )}
            {ph !== null && (
              <p className="text-malt/80 dark:text-zinc-400">
                Estimated Mash pH: {ph}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
