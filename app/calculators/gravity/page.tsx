"use client";

import { useState } from "react";
import Link from "next/link";

export default function GravityConverter() {
  const [sg, setSg] = useState("");
  const [plato, setPlato] = useState("");
  const [brix, setBrix] = useState("");

  const convertFromSG = (value: number) => {
    const p = (-616.868) + (1111.14 * value) - (630.272 * value * value) + (135.997 * value * value * value);
    const b = (182.4601 * value - 775.6821) * value + 1262.7794;
    setPlato(p.toFixed(2));
    setBrix(b.toFixed(2));
  };

  const convertFromPlato = (value: number) => {
    const sgValue = 1 + value / (258.6 - (value / 258.2) * 227.1);
    const b = value * 1.04;
    setSg(sgValue.toFixed(3));
    setBrix(b.toFixed(2));
  };

  const convertFromBrix = (value: number) => {
    const sgValue = (value / (258.6 - ((value / 258.2) * 227.1))) + 1;
    const p = value / 1.04;
    setSg(sgValue.toFixed(3));
    setPlato(p.toFixed(2));
  };

  const handleSG = (val: string) => {
    setSg(val);
    const num = parseFloat(val);
    if (!isNaN(num)) convertFromSG(num);
  };

  const handlePlato = (val: string) => {
    setPlato(val);
    const num = parseFloat(val);
    if (!isNaN(num)) convertFromPlato(num);
  };

  const handleBrix = (val: string) => {
    setBrix(val);
    const num = parseFloat(val);
    if (!isNaN(num)) convertFromBrix(num);
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
        OG / FG Gravity Converter
      </h1>

      <p className="mt-2 text-malt/80 dark:text-zinc-400">
        Convert between Specific Gravity (SG), Plato, and Brix. Enter any value and the others update automatically.
      </p>

      <div className="mt-10 space-y-6">
        <div>
          <label className="block text-sm font-medium">Specific Gravity (SG)</label>
          <input
            type="number"
            step="0.001"
            value={sg}
            onChange={(e) => handleSG(e.target.value)}
            className="mt-1 w-full rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Plato (°P)</label>
          <input
            type="number"
            step="0.01"
            value={plato}
            onChange={(e) => handlePlato(e.target.value)}
            className="mt-1 w-full rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Brix (°Bx)</label>
          <input
            type="number"
            step="0.01"
            value={brix}
            onChange={(e) => handleBrix(e.target.value)}
            className="mt-1 w-full rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          />
        </div>
      </div>
    </div>
  );
}
