"use client";

import { useState } from "react";
import Link from "next/link";

type HopAddition = {
  name: string;
  weight: number; // oz
  alpha: number; // %
  time: number; // min
  ibu: number;
};

export default function HopScheduleBuilder() {
  const [batchVolume, setBatchVolume] = useState("5");
  const [boilGravity, setBoilGravity] = useState("1.050");

  const [hopName, setHopName] = useState("");
  const [hopWeight, setHopWeight] = useState("");
  const [hopAlpha, setHopAlpha] = useState("");
  const [hopTime, setHopTime] = useState("");

  const [hops, setHops] = useState<HopAddition[]>([]);

  const calculateIBU = (weight: number, alpha: number, time: number) => {
    const V = parseFloat(batchVolume);
    const G = parseFloat(boilGravity);

    const A = alpha / 100;
    const W = weight;
    const T = time;

    const utilization =
      (1.65 * Math.pow(0.000125, G - 1)) *
      ((1 - Math.exp(-0.04 * T)) / 4.15);

    const ibuValue = (A * W * 7490 * utilization) / V;

    return parseFloat(ibuValue.toFixed(1));
  };

  const addHop = () => {
    const w = parseFloat(hopWeight);
    const a = parseFloat(hopAlpha);
    const t = parseFloat(hopTime);

    if (!hopName || isNaN(w) || isNaN(a) || isNaN(t)) return;

    const ibu = calculateIBU(w, a, t);

    setHops((prev) => [
      ...prev,
      { name: hopName, weight: w, alpha: a, time: t, ibu },
    ]);

    setHopName("");
    setHopWeight("");
    setHopAlpha("");
    setHopTime("");
  };

  const removeHop = (index: number) => {
    setHops((prev) => prev.filter((_, i) => i !== index));
  };

  const totalIBU = hops.reduce((sum, h) => sum + h.ibu, 0).toFixed(1);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Link
        href="/tools"
        className="text-sm text-amber hover:underline dark:text-amber-light"
      >
        ← Back to Tools
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-malt-dark dark:text-foreground">
        Hop Schedule Builder
      </h1>

      <p className="mt-2 text-malt/80 dark:text-zinc-400">
        Build a hop schedule with automatic IBU calculation.
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
          <label className="block text-sm font-medium">Boil Gravity (SG)</label>
          <input
            type="number"
            step="0.001"
            value={boilGravity}
            onChange={(e) => setBoilGravity(e.target.value)}
            className="mt-1 w-full rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          />
        </div>
      </div>

      {/* Add hop */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-malt-dark dark:text-foreground">
          Add Hop Addition
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <input
            placeholder="Hop Name"
            value={hopName}
            onChange={(e) => setHopName(e.target.value)}
            className="rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          />
          <input
            type="number"
            placeholder="Weight (oz)"
            value={hopWeight}
            onChange={(e) => setHopWeight(e.target.value)}
            className="rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          />
          <input
            type="number"
            placeholder="Alpha %"
            value={hopAlpha}
            onChange={(e) => setHopAlpha(e.target.value)}
            className="rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          />
          <input
            type="number"
            placeholder="Time (min)"
            value={hopTime}
            onChange={(e) => setHopTime(e.target.value)}
            className="rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          />
        </div>

        <button
          onClick={addHop}
          className="mt-3 rounded bg-amber px-4 py-2 text-sm font-semibold text-white hover:bg-amber-dark"
        >
          Add Hop
        </button>
      </div>

      {/* Hop schedule table */}
      {hops.length > 0 && (
        <div className="mt-10 rounded border border-malt/20 bg-white p-4 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold text-malt-dark dark:text-foreground">
            Hop Schedule
          </h2>

          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-malt/20">
                <th className="py-2 text-left">Hop</th>
                <th className="py-2 text-left">Weight (oz)</th>
                <th className="py-2 text-left">Alpha %</th>
                <th className="py-2 text-left">Time (min)</th>
                <th className="py-2 text-left">IBU</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {hops.map((h, i) => (
                <tr key={i} className="border-b border-malt/10">
                  <td className="py-2">{h.name}</td>
                  <td className="py-2">{h.weight}</td>
                  <td className="py-2">{h.alpha}</td>
                  <td className="py-2">{h.time}</td>
                  <td className="py-2">{h.ibu}</td>
                  <td className="py-2">
                    <button
                      onClick={() => removeHop(i)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-4 text-lg font-semibold">
            Total IBU: {totalIBU}
          </p>
        </div>
      )}
    </div>
  );
}
