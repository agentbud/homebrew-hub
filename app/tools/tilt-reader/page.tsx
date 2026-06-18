"use client";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  CategoryScale
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  CategoryScale
);

import { useState } from "react";
import Link from "next/link";

type BeerEntry = {
  name: string;
  color?: string;
  url: string;
};

type Reading = {
  time: string;
  gravity: string;
  temperature: string;
  color?: string;
  beer?: string;
  comment?: string;
};

export default function TiltReaderPage() {
  const [masterUrl, setMasterUrl] = useState("");
  const [directUrl, setDirectUrl] = useState("");
  const [beers, setBeers] = useState<BeerEntry[]>([]);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [selectedBeerName, setSelectedBeerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadMaster() {
    setLoading(true);
    setError("");
    setBeers([]);
    setReadings([]);
    setSelectedBeerName("");

    try {
      const res = await fetch(`/api/tilt/master?url=${encodeURIComponent(masterUrl)}`);
      if (!res.ok) throw new Error("Master sheet fetch failed");
      const json = await res.json();
      setBeers(json.beers || []);
      if (!json.beers || json.beers.length === 0) {
        setError("No beers found in master sheet.");
      }
    } catch (e) {
      setError("Unable to load master sheet. Check the URL and sharing settings.");
    } finally {
      setLoading(false);
    }
  }

  async function loadReadingsFromUrl(url: string, beerName?: string) {
    setLoading(true);
    setError("");
    setReadings([]);

    try {
      const res = await fetch(`/api/tilt/log?url=${encodeURIComponent(url)}`);
      if (!res.ok) throw new Error("Log fetch failed");
      const json = await res.json();

      setReadings(json.readings || []);

      if (beerName) {
        setSelectedBeerName(beerName);
      } else {
        const raw = json.readings?.[0]?.beer;
        const fallback =
          typeof raw === "string" && raw.trim().length > 0
            ? raw.trim()
            : "Individual Log";
        setSelectedBeerName(fallback);
      }

      if (!json.readings || json.readings.length === 0) {
        setError("No readings found for this source.");
      }
    } catch (e) {
      setError("Unable to load readings. Check the URL and sharing settings.");
    } finally {
      setLoading(false);
    }
  }

  async function loadDirect() {
    if (!directUrl) return;
    await loadReadingsFromUrl(directUrl, undefined);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <Link
        href="/tools"
        className="text-sm text-amber hover:underline dark:text-amber-light"
      >
        ← Tools
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-malt-dark dark:text-foreground">
        Tilt Hydrometer Reader
      </h1>

      <p className="mt-2 text-malt/80 dark:text-zinc-400">
        Load Tilt readings from either your master beer list sheet or a direct Tilt/Sheets URL.
      </p>

      {/* SIDE-BY-SIDE INPUTS */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Master Beer List */}
        <div className="rounded-lg border border-malt/20 p-4 dark:border-white/10">
          <h2 className="text-lg font-semibold text-malt-dark dark:text-foreground">
            Master Beer List (Google Sheets)
          </h2>
          <p className="mt-1 text-sm text-malt/70 dark:text-zinc-400">
            Paste the URL of your Tilt “Beers” sheet (the master list).
          </p>

          <div className="mt-3 flex gap-3">
            <input
              type="text"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={masterUrl}
              onChange={(e) => setMasterUrl(e.target.value)}
              className="flex-1 rounded-lg border border-malt/30 bg-white p-3 text-sm dark:bg-zinc-900"
            />
            <button
              onClick={loadMaster}
              className="rounded-lg bg-amber px-4 py-2 text-sm font-semibold text-white hover:bg-amber-dark"
            >
              Load Beers
            </button>
          </div>

          {beers.length > 0 && (
            <div className="mt-6">
              <h3 className="text-md font-semibold text-malt-dark dark:text-foreground">
                Select a Beer
              </h3>

              <select
                className="mt-2 w-full rounded-lg border border-malt/30 bg-white p-3 text-sm dark:bg-zinc-900"
                onChange={(e) => {
                  const selected = beers.find((b) => b.url === e.target.value);
                  if (selected) loadReadingsFromUrl(selected.url, selected.name);
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  Choose a beer…
                </option>

                {beers.map((beer) => (
                  <option key={beer.url} value={beer.url}>
                    {beer.name}
                    {beer.color ? ` (${beer.color})` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Direct URL */}
        <div className="rounded-lg border border-malt/20 p-4 dark:border-white/10">
          <h2 className="text-lg font-semibold text-malt-dark dark:text-foreground">
            Direct Tilt / Log URL
          </h2>
          <p className="mt-1 text-sm text-malt/70 dark:text-zinc-400">
            Paste a Tilt JSON URL or an individual beer log sheet URL.
          </p>

          <div className="mt-3 flex gap-3">
            <input
              type="text"
              placeholder="Tilt JSON or individual log sheet URL"
              value={directUrl}
              onChange={(e) => setDirectUrl(e.target.value)}
              className="flex-1 rounded-lg border border-malt/30 bg-white p-3 text-sm dark:bg-zinc-900"
            />
            <button
              onClick={loadDirect}
              className="rounded-lg bg-amber px-4 py-2 text-sm font-semibold text-white hover:bg-amber-dark"
            >
              Load Readings
            </button>
          </div>
        </div>

      </div>

      {selectedBeerName && (
        <div className="mt-10 rounded-lg border border-malt/20 bg-malt/5 p-4 dark:border-white/10 dark:bg-zinc-900/40">
          <h3 className="text-lg font-semibold text-malt-dark dark:text-foreground">
            Displaying Readings For:
          </h3>
          <p className="mt-1 text-malt-dark dark:text-zinc-300 text-xl font-bold">
            {selectedBeerName}
          </p>
        </div>
      )}

      {loading && (
        <p className="mt-6 text-malt/70 dark:text-zinc-400">Loading…</p>
      )}

      {error && (
        <p className="mt-6 text-sm font-semibold text-red-500">{error}</p>
      )}

      {readings.length > 0 && (
        <div className="mt-10 space-y-16">

          {/* Gravity Chart */}
          <div className="pb-6">
            <h2 className="text-lg font-semibold text-malt-dark dark:text-foreground mb-4">
              Gravity Over Time
            </h2>

            <Line
              data={{
                labels: readings.map((r) => r.time),
                datasets: [
                  {
                    label: "Specific Gravity",
                    data: readings.map((r) => parseFloat(r.gravity)),
                    borderColor: "#d97706",
                    backgroundColor: "rgba(217, 119, 6, 0.3)",
                    tension: 0.3,
                    pointRadius: 2
                  }
                ]
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: true } },
                scales: {
                  x: { ticks: { maxRotation: 45, minRotation: 45 } },
                  y: { beginAtZero: false }
                }
              }}
            />
          </div>

          {/* Temperature Chart */}
          <div className="pb-6">
            <h2 className="text-lg font-semibold text-malt-dark dark:text-foreground mb-4">
              Temperature Over Time
            </h2>

            <Line
              data={{
                labels: readings.map((r) => r.time),
                datasets: [
                  {
                    label: "Temperature (°F)",
                    data: readings.map((r) => parseFloat(r.temperature)),
                    borderColor: "#2563eb",
                    backgroundColor: "rgba(37, 99, 235, 0.3)",
                    tension: 0.3,
                    pointRadius: 2
                  }
                ]
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: true } },
                scales: {
                  x: { ticks: { maxRotation: 45, minRotation: 45 } },
                  y: { beginAtZero: false }
                }
              }}
            />
          </div>

        </div>
      )}

      {readings.length > 0 && (
        <div className="mt-16 overflow-x-auto rounded-lg border border-malt/20 dark:border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-malt/10 dark:bg-zinc-800">
              <tr>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">SG</th>
                <th className="px-4 py-2">Temp (°F)</th>
                <th className="px-4 py-2">Color</th>
                <th className="px-4 py-2">Beer</th>
                <th className="px-4 py-2">Comment</th>
              </tr>
            </thead>
            <tbody>
              {readings.map((r, i) => (
                <tr
                  key={i}
                  className="border-t border-malt/10 dark:border-white/10"
                >
                  <td className="px-4 py-2">{r.time}</td>
                  <td className="px-4 py-2">{r.gravity}</td>
                  <td className="px-4 py-2">{r.temperature}</td>
                  <td className="px-4 py-2">{r.color || ""}</td>
                  <td className="px-4 py-2">{r.beer || ""}</td>
                  <td className="px-4 py-2">{r.comment || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
