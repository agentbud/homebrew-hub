"use client";

import { useState } from "react";
import Link from "next/link";

export default function YeastViabilityCalculator() {
  const [manufactureDate, setManufactureDate] = useState("");
  const [generations, setGenerations] = useState(0);
  const [storageTemp, setStorageTemp] = useState(40);
  const [viability, setViability] = useState<number | null>(null);

  function calculate() {
    if (!manufactureDate) return;

    const today = new Date();
    const mfg = new Date(manufactureDate);
    const days = (today.getTime() - mfg.getTime()) / (1000 * 60 * 60 * 24);

    // ORIGINAL WHITE LABS DECAY MODEL YOU PROVIDED
    let baseViability = Math.max(0, 100 - days * 0.7);

    // Temperature penalty
    if (storageTemp > 45) baseViability *= 0.85;
    if (storageTemp > 55) baseViability *= 0.75;

    // Generational penalty
    const genPenalty = Math.max(0, 1 - generations * 0.12);

    const final = Math.max(0, Math.round(baseViability * genPenalty));
    setViability(final);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* RETURN LINK */}
      <Link
        href="/calculators"
        className="text-sm text-amber hover:underline dark:text-amber-light"
      >
        ← Back to Calculators
      </Link>

      {/* TITLE */}
      <h1 className="mt-6 text-3xl font-bold text-malt-dark dark:text-foreground">
        Yeast Viability Calculator
      </h1>

      <p className="mt-2 text-malt/80 dark:text-zinc-400">
        Estimate yeast viability using the White Labs decay model with temperature
        and generational penalties.
      </p>

      {/* INPUT CARD */}
      <div className="mt-10 rounded-lg border border-malt/20 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900 space-y-4">
        <div>
          <label className="block text-sm font-medium text-malt-dark dark:text-foreground">
            Manufacture Date
          </label>
          <input
            type="date"
            value={manufactureDate}
            onChange={(e) => setManufactureDate(e.target.value)}
            className="mt-1 w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:border-white/20 dark:bg-zinc-800 dark:text-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-malt-dark dark:text-foreground">
            Generations Used
          </label>
          <input
            type="number"
            min={0}
            value={generations}
            onChange={(e) => setGenerations(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:border-white/20 dark:bg-zinc-800 dark:text-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-malt-dark dark:text-foreground">
            Storage Temperature (°F)
          </label>
          <input
            type="number"
            value={storageTemp}
            onChange={(e) => setStorageTemp(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:border-white/20 dark:bg-zinc-800 dark:text-foreground"
          />
        </div>

        <button
          onClick={calculate}
          className="w-full rounded-md bg-amber px-4 py-2 text-sm font-semibold text-white hover:bg-malt-dark"
        >
          Calculate Viability
        </button>
      </div>

      {/* RESULT CARD */}
      {viability !== null && (
        <div className="mt-6 rounded-lg border border-malt/20 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold text-malt-dark dark:text-foreground">
            Estimated Viability
          </h2>

          <p className="mt-2 text-3xl font-bold text-amber">
            {viability}%
          </p>

          <p className="mt-2 text-sm text-malt/70 dark:text-zinc-400">
            Includes age decay, temperature penalty, and generational penalty.
          </p>
        </div>
      )}
    </div>
  );
}
