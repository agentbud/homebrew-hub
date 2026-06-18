"use client";

import { useState } from "react";
import Link from "next/link";

export default function HydrometerCorrection() {
  const [reading, setReading] = useState("");
  const [temp, setTemp] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const R = parseFloat(reading);
    const T = parseFloat(temp);

    if (isNaN(R) || isNaN(T)) {
      setResult(null);
      return;
    }

    const corrected =
      R *
      ((1.00130346 -
        0.000134722124 * T +
        0.00000204052596 * T * T -
        0.00000000232820948 * T * T * T) /
        (1.00130346 -
          0.000134722124 * 60 +
          0.00000204052596 * 60 * 60 -
          0.00000000232820948 * 60 * 60 * 60));

    setResult(parseFloat(corrected.toFixed(3)));
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/calculators" className="text-sm text-amber hover:underline">
        ← Back to Calculators
      </Link>

      <h1 className="mt-6 text-3xl font-bold">Hydrometer Temperature Correction</h1>

      <p className="mt-2 text-malt/80">
        Correct SG readings for temperatures other than 60°F.
      </p>

      <div className="mt-10 space-y-4">
        <div>
          <label className="block text-sm font-medium">SG Reading</label>
          <input
            type="number"
            step="0.001"
            value={reading}
            onChange={(e) => setReading(e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Sample Temperature (°F)</label>
          <input
            type="number"
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
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
            Corrected SG: {result}
          </p>
        )}
      </div>
    </div>
  );
}
