"use client";

import { useState } from "react";
import Link from "next/link";

export default function MashPhCalculator() {
  const [color, setColor] = useState("");
  const [ra, setRa] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const C = parseFloat(color);
    const R = parseFloat(ra);

    if (isNaN(C) || isNaN(R)) {
      setResult(null);
      return;
    }

    // Color-based mash pH shift (empirical)
    const colorShift = -0.03 * Math.log10(C + 1);

    // RA-based shift
    const raShift = R * 0.001;

    const ph = 5.7 + raShift + colorShift;

    setResult(parseFloat(ph.toFixed(2)));
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/calculators" className="text-sm text-amber hover:underline">
        ← Back to Calculators
      </Link>

      <h1 className="mt-6 text-3xl font-bold">Mash pH Prediction</h1>

      <p className="mt-2 text-malt/80">
        Estimate mash pH using grain bill color (SRM) and residual alkalinity.
      </p>

      <div className="mt-10 space-y-4">
        <div>
          <label className="block text-sm font-medium">Beer Color (SRM)</label>
          <input
            type="number"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Residual Alkalinity (ppm as CaCO₃)</label>
          <input
            type="number"
            value={ra}
            onChange={(e) => setRa(e.target.value)}
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
          <p className="mt-4 text-lg font-semibold">Estimated Mash pH: {result}</p>
        )}
      </div>
    </div>
  );
}
