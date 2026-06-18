"use client";

import { useState } from "react";
import Link from "next/link";

function calculatePressure(tempF: number, volumes: number) {
  // Standard carbonation formula (PSI)
  return (
    -16.6999 -
    0.0101059 * tempF +
    0.00116512 * tempF * tempF +
    0.173354 * tempF * volumes
  );
}

export default function CarbonationCalculator() {
  const [temp, setTemp] = useState("");
  const [volumes, setVolumes] = useState("");
  const [burstHours, setBurstHours] = useState("24");
  const [result, setResult] = useState<any>(null);

  function calculate() {
    if (!temp || !volumes) return;

    const t = parseFloat(temp);
    const v = parseFloat(volumes);

    const psi = calculatePressure(t, v);

    // Burst carbonation estimate
    const burstPsi = psi + 10;
    const burstTime = parseInt(burstHours);

    setResult({
      psi: psi.toFixed(1),
      burstPsi: burstPsi.toFixed(1),
      burstTime,
    });
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* RETURN LINK */}
      <Link
        href="/tools"
        className="text-sm text-amber hover:underline dark:text-amber-light"
      >
        ← Back to Tools
      </Link>

      {/* TITLE */}
      <h1 className="mt-6 text-3xl font-bold text-malt-dark dark:text-foreground">
        Carbonation Calculator
      </h1>

      <p className="mt-2 text-malt/80 dark:text-zinc-400">
        Calculate serving pressure for set‑and‑forget carbonation, plus burst
        carbonation estimates.
      </p>

      {/* INPUT CARD */}
      <div className="mt-10 space-y-4 rounded-lg border border-malt/20 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <div>
          <label className="block text-sm font-medium text-malt-dark dark:text-foreground">
            Beer Temperature (°F)
          </label>
          <input
            type="number"
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            className="mt-1 w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:border-white/20 dark:bg-zinc-800 dark:text-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-malt-dark dark:text-foreground">
            Target CO₂ Volumes
          </label>
          <input
            type="number"
            step="0.1"
            value={volumes}
            onChange={(e) => setVolumes(e.target.value)}
            className="mt-1 w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:border-white/20 dark:bg-zinc-800 dark:text-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-malt-dark dark:text-foreground">
            Burst Carb Duration (hours)
          </label>
          <input
            type="number"
            value={burstHours}
            onChange={(e) => setBurstHours(e.target.value)}
            className="mt-1 w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:border-white/20 dark:bg-zinc-800 dark:text-foreground"
          />
        </div>

        <button
          onClick={calculate}
          className="w-full rounded-md bg-amber px-4 py-2 text-sm font-semibold text-white hover:bg-malt-dark"
        >
          Calculate
        </button>
      </div>

      {/* RESULTS CARD */}
      {result && (
        <div className="mt-6 rounded-lg border border-malt/20 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold text-malt-dark dark:text-foreground mb-3">
            Results
          </h2>

          <p className="mb-2 text-malt-dark dark:text-zinc-300">
            <strong>Set‑and‑Forget Pressure:</strong>{" "}
            <span className="text-amber font-semibold">{result.psi} PSI</span>
          </p>

          <p className="mb-2 text-malt-dark dark:text-zinc-300">
            <strong>Burst Carb Pressure:</strong>{" "}
            <span className="text-amber font-semibold">{result.burstPsi} PSI</span>
          </p>

          <p className="text-malt-dark dark:text-zinc-300">
            <strong>Burst Duration:</strong>{" "}
            <span className="text-amber font-semibold">{result.burstTime} hours</span>
          </p>
        </div>
      )}
    </div>
  );
}
