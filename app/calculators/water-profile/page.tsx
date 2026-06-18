"use client";

import { useState } from "react";
import Link from "next/link";

export default function WaterProfileBuilder() {
  const [targetCa, setTargetCa] = useState("");
  const [targetMg, setTargetMg] = useState("");
  const [targetSo4, setTargetSo4] = useState("");
  const [targetCl, setTargetCl] = useState("");
  const [volume, setVolume] = useState("");
  const [gypsum, setGypsum] = useState<number | null>(null);
  const [cacl2, setCacl2] = useState<number | null>(null);

  const calculate = () => {
    const Ca = parseFloat(targetCa);
    const Mg = parseFloat(targetMg);
    const SO4 = parseFloat(targetSo4);
    const Cl = parseFloat(targetCl);
    const V = parseFloat(volume);

    if ([Ca, Mg, SO4, Cl, V].some((n) => isNaN(n))) {
      setGypsum(null);
      setCacl2(null);
      return;
    }

    // Very simplified additions:
    const gypsumNeeded = (SO4 / 61.5) * V; // grams
    const cacl2Needed = (Cl / 127) * V; // grams

    setGypsum(parseFloat(gypsumNeeded.toFixed(1)));
    setCacl2(parseFloat(cacl2Needed.toFixed(1)));
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/calculators" className="text-sm text-amber hover:underline">
        ← Back to Calculators
      </Link>

      <h1 className="mt-6 text-3xl font-bold">Water Profile Builder</h1>

      <p className="mt-2 text-malt/80">
        Estimate salt additions to reach a target water profile.
      </p>

      <div className="mt-10 space-y-4">
        <div>
          <label className="block text-sm font-medium">Target Ca (ppm)</label>
          <input
            type="number"
            value={targetCa}
            onChange={(e) => setTargetCa(e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Target Mg (ppm)</label>
          <input
            type="number"
            value={targetMg}
            onChange={(e) => setTargetMg(e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Target SO₄ (ppm)</label>
          <input
            type="number"
            value={targetSo4}
            onChange={(e) => setTargetSo4(e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Target Cl (ppm)</label>
          <input
            type="number"
            value={targetCl}
            onChange={(e) => setTargetCl(e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Batch Volume (gal)</label>
          <input
            type="number"
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

        {(gypsum !== null || cacl2 !== null) && (
          <div className="mt-6 space-y-2">
            {gypsum !== null && (
              <p className="text-lg font-semibold">Gypsum Needed: {gypsum} g</p>
            )}
            {cacl2 !== null && (
              <p className="text-lg font-semibold">Calcium Chloride Needed: {cacl2} g</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
