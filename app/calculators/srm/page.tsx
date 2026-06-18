"use client";

import { useState } from "react";
import Link from "next/link";

export default function SRMCalculator() {
  const [mcus, setMcus] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const M = parseFloat(mcus);
    if (isNaN(M)) {
      setResult(null);
      return;
    }

    const srm = 1.4922 * Math.pow(M, 0.6859);
    setResult(parseFloat(srm.toFixed(1)));
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/calculators" className="text-sm text-amber hover:underline">
        ← Back to Calculators
      </Link>

      <h1 className="mt-6 text-3xl font-bold">SRM Color Calculator</h1>

      <p className="mt-2 text-malt/80">
        Convert MCU to SRM using the Morey equation.
      </p>

      <div className="mt-10 space-y-4">
        <div>
          <label className="block text-sm font-medium">MCU</label>
          <input
            type="number"
            step="0.1"
            value={mcus}
            onChange={(e) => setMcus(e.target.value)}
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
          <p className="mt-4 text-lg font-semibold">SRM: {result}</p>
        )}
      </div>
    </div>
  );
}
