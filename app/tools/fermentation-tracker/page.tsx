"use client";

import { useState, useRef } from "react";
import Link from "next/link";

type Reading = {
  day: number;
  gravity: number;
  temp: number;
  notes: string;
};

export default function FermentationTracker() {
  const [beerName, setBeerName] = useState("");
  const [og, setOg] = useState("");
  const [readingDay, setReadingDay] = useState("");
  const [readingGravity, setReadingGravity] = useState("");
  const [readingTemp, setReadingTemp] = useState("");
  const [readingNotes, setReadingNotes] = useState("");

  const [readings, setReadings] = useState<Reading[]>([]);

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const addReading = () => {
    const d = parseFloat(readingDay);
    const g = parseFloat(readingGravity);
    const t = parseFloat(readingTemp);

    if (isNaN(d) || isNaN(g) || isNaN(t)) return;

    setReadings((prev) => [
      ...prev,
      { day: d, gravity: g, temp: t, notes: readingNotes },
    ]);

    setReadingDay("");
    setReadingGravity("");
    setReadingTemp("");
    setReadingNotes("");
  };

  const removeReading = (index: number) => {
    setReadings((prev) => prev.filter((_, i) => i !== index));
  };

  const calculateABV = () => {
    if (!og || readings.length === 0) return null;

    const OG = parseFloat(og);
    const FG = readings[readings.length - 1].gravity;

    if (isNaN(OG) || isNaN(FG)) return null;

    const abv = (OG - FG) * 131.25;
    return abv.toFixed(2);
  };

  const abv = calculateABV();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Link
        href="/tools"
        className="text-sm text-amber hover:underline dark:text-amber-light print:hidden"
      >
        ← Back to Tools
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-malt-dark dark:text-foreground print:text-black">
        Fermentation Tracker
      </h1>

      <p className="mt-2 text-malt/80 dark:text-zinc-400 print:hidden">
        Log gravity, temperature, and notes throughout fermentation.
      </p>

      {/* Beer Name */}
      <div className="mt-8 print:hidden">
        <label className="block text-sm font-medium">Beer Name</label>
        <input
          type="text"
          value={beerName}
          onChange={(e) => setBeerName(e.target.value)}
          className="mt-1 w-full rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          placeholder="e.g., Belgian Quad, Hazy IPA, etc."
        />
      </div>

      {/* OG Input */}
      <div className="mt-6 print:hidden">
        <label className="block text-sm font-medium">Original Gravity (OG)</label>
        <input
          type="number"
          step="0.001"
          value={og}
          onChange={(e) => setOg(e.target.value)}
          className="mt-1 w-full rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
        />
      </div>

      {/* Add Reading */}
      <div className="mt-10 print:hidden">
        <h2 className="text-xl font-semibold text-malt-dark dark:text-foreground">
          Add Fermentation Reading
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <input
            type="number"
            placeholder="Day"
            value={readingDay}
            onChange={(e) => setReadingDay(e.target.value)}
            className="rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          />
          <input
            type="number"
            step="0.001"
            placeholder="Gravity"
            value={readingGravity}
            onChange={(e) => setReadingGravity(e.target.value)}
            className="rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          />
          <input
            type="number"
            placeholder="Temp (°F)"
            value={readingTemp}
            onChange={(e) => setReadingTemp(e.target.value)}
            className="rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          />
          <input
            placeholder="Notes"
            value={readingNotes}
            onChange={(e) => setReadingNotes(e.target.value)}
            className="rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          />
        </div>

        <button
          onClick={addReading}
          className="mt-3 rounded bg-amber px-4 py-2 text-sm font-semibold text-white hover:bg-amber-dark"
        >
          Add Reading
        </button>
      </div>

      {/* Readings Table */}
      {readings.length > 0 && (
        <div
          ref={printRef}
          className="mt-10 rounded border border-malt/20 bg-white p-4 dark:bg-zinc-900 print:bg-white print:text-black"
        >
          {/* Beer Name in Print */}
          <h2 className="text-2xl font-bold text-malt-dark dark:text-foreground mb-4 print:text-black">
            {beerName || "Untitled Beer"}
          </h2>

          <h3 className="text-xl font-semibold text-malt-dark dark:text-foreground print:text-black">
            Fermentation Log
          </h3>

          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-malt/20">
                <th className="py-2 text-left">Day</th>
                <th className="py-2 text-left">Gravity</th>
                <th className="py-2 text-left">Temp (°F)</th>
                <th className="py-2 text-left">Notes</th>
                <th className="print:hidden"></th>
              </tr>
            </thead>
            <tbody>
              {readings.map((r, i) => (
                <tr key={i} className="border-b border-malt/10">
                  <td className="py-2">{r.day}</td>
                  <td className="py-2">{r.gravity}</td>
                  <td className="py-2">{r.temp}</td>
                  <td className="py-2">{r.notes}</td>
                  <td className="py-2 print:hidden">
                    <button
                      onClick={() => removeReading(i)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary */}
          <div className="mt-6 text-sm">
            <p>Original Gravity: {og || "—"}</p>
            <p>Final Gravity: {readings[readings.length - 1].gravity}</p>
            <p>Estimated ABV: {abv ?? "—"}%</p>
          </div>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="mt-4 rounded bg-amber px-4 py-2 text-sm font-semibold text-white hover:bg-amber-dark print:hidden"
          >
            Print Results
          </button>
        </div>
      )}
    </div>
  );
}
