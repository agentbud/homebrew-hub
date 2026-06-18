"use client";

import { useState } from "react";
import Link from "next/link";

type Grain = {
  name: string;
  weight: number; // lb
  ppg: number;
  color: number; // SRM
};

export default function GrainBillBuilder() {
  const [batchVolume, setBatchVolume] = useState("5");
  const [efficiency, setEfficiency] = useState("75");

  const [grainName, setGrainName] = useState("");
  const [grainWeight, setGrainWeight] = useState("");
  const [grainPPG, setGrainPPG] = useState("36");
  const [grainColor, setGrainColor] = useState("5");

  const [grains, setGrains] = useState<Grain[]>([]);

  const addGrain = () => {
    const w = parseFloat(grainWeight);
    const p = parseFloat(grainPPG);
    const c = parseFloat(grainColor);

    if (!grainName || isNaN(w) || isNaN(p) || isNaN(c)) return;

    setGrains((prev) => [
      ...prev,
      { name: grainName, weight: w, ppg: p, color: c },
    ]);

    setGrainName("");
    setGrainWeight("");
    setGrainPPG("36");
    setGrainColor("5");
  };

  const removeGrain = (index: number) => {
    setGrains((prev) => prev.filter((_, i) => i !== index));
  };

  const summary = () => {
    const V = parseFloat(batchVolume);
    const E = parseFloat(efficiency) / 100;

    if (isNaN(V) || isNaN(E) || V <= 0 || E <= 0) {
      return { og: null, srm: null };
    }

    const totalPoints = grains.reduce(
      (sum, g) => sum + g.weight * g.ppg,
      0
    );
    const pointsIntoWort = totalPoints * E;
    const og = 1 + pointsIntoWort / (1000 * V);

    const mcu = grains.reduce(
      (sum, g) => sum + (g.color * g.weight) / V,
      0
    );
    const srm = 1.4922 * Math.pow(mcu, 0.6859);

    return {
      og: parseFloat(og.toFixed(3)),
      srm: parseFloat(srm.toFixed(1)),
    };
  };

  const s = summary();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Link
        href="/tools"
        className="text-sm text-amber hover:underline dark:text-amber-light"
      >
        ← Back to Tools
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-malt-dark dark:text-foreground">
        Grain Bill Builder
      </h1>

      <p className="mt-2 text-malt/80 dark:text-zinc-400">
        Build a grain bill and see its impact on gravity and color.
      </p>

      {/* Batch settings */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">Batch Volume (gal)</label>
          <input
            type="number"
            value={batchVolume}
            onChange={(e) => setBatchVolume(e.target.value)}
            className="mt-1 w-full rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Brewhouse Efficiency (%)</label>
          <input
            type="number"
            value={efficiency}
            onChange={(e) => setEfficiency(e.target.value)}
            className="mt-1 w-full rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          />
        </div>
      </div>

      {/* Add grain */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-malt-dark dark:text-foreground">
          Add Grain
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <input
            placeholder="Name"
            value={grainName}
            onChange={(e) => setGrainName(e.target.value)}
            className="rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          />
          <input
            type="number"
            placeholder="Weight (lb)"
            value={grainWeight}
            onChange={(e) => setGrainWeight(e.target.value)}
            className="rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          />
          <input
            type="number"
            placeholder="PPG"
            value={grainPPG}
            onChange={(e) => setGrainPPG(e.target.value)}
            className="rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          />
          <input
            type="number"
            placeholder="Color (SRM)"
            value={grainColor}
            onChange={(e) => setGrainColor(e.target.value)}
            className="rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          />
        </div>

        <button
          onClick={addGrain}
          className="mt-3 rounded bg-amber px-4 py-2 text-sm font-semibold text-white hover:bg-amber-dark"
        >
          Add Grain
        </button>

        {grains.length > 0 && (
          <ul className="mt-4 space-y-2">
            {grains.map((g, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded border border-malt/10 bg-white px-3 py-2 text-sm dark:bg-zinc-900"
              >
                <span>
                  {g.name} — {g.weight} lb, {g.ppg} PPG, {g.color} SRM
                </span>
                <button
                  onClick={() => removeGrain(i)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Summary */}
      <div className="mt-10 rounded border border-malt/20 bg-white p-4 dark:bg-zinc-900">
        <h2 className="text-xl font-semibold text-malt-dark dark:text-foreground">
          Grain Bill Summary
        </h2>
        <div className="mt-3 space-y-1 text-sm">
          <p>Estimated OG: {s.og ?? "—"}</p>
          <p>Estimated Color (SRM): {s.srm ?? "—"}</p>
        </div>
      </div>
    </div>
  );
}
