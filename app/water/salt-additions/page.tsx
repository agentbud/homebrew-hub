"use client";

import { useState } from "react";
import Link from "next/link";

// Salt contribution constants (ppm per gram per gallon)
const SALTS = {
  gypsum: { ca: 61.5, so4: 147.4 },
  cacl2: { ca: 72, cl: 127 },
  epsom: { mg: 26, so4: 103 },
  bakingSoda: { na: 72, hco3: 191 },
  chalk: { ca: 105, hco3: 158 },
  picklingLime: { ca: 81, hco3: 0 },
};

// SAME PROFILES AS PROFILE-BUILDER
const BASIC_PROFILES = [
  { name: "Pilsner", ca: 7, mg: 2, na: 2, so4: 5, cl: 5, hco3: 15 },
  { name: "Burton-on-Trent", ca: 275, mg: 40, na: 25, so4: 450, cl: 35, hco3: 260 },
  { name: "Dublin", ca: 110, mg: 4, na: 12, so4: 55, cl: 19, hco3: 280 },
  { name: "Westvleteren / Trappist", ca: 35, mg: 8, na: 15, so4: 25, cl: 40, hco3: 120 },
  { name: "NEIPA", ca: 100, mg: 10, na: 25, so4: 75, cl: 200, hco3: 50 },
  { name: "West Coast IPA", ca: 140, mg: 20, na: 25, so4: 250, cl: 50, hco3: 75 },
];

const ADVANCED_PROFILES = [
  { name: "Munich", ca: 75, mg: 18, na: 2, so4: 10, cl: 2, hco3: 180 },
  { name: "Vienna", ca: 95, mg: 12, na: 8, so4: 55, cl: 40, hco3: 125 },
  { name: "Dortmund", ca: 225, mg: 40, na: 60, so4: 120, cl: 60, hco3: 180 },
  { name: "Edinburgh", ca: 120, mg: 18, na: 55, so4: 140, cl: 65, hco3: 225 },
  { name: "London", ca: 90, mg: 5, na: 15, so4: 50, cl: 35, hco3: 125 },
  { name: "Prague", ca: 35, mg: 8, na: 4, so4: 5, cl: 5, hco3: 15 },
  { name: "Antwerp", ca: 90, mg: 12, na: 20, so4: 45, cl: 40, hco3: 110 },
  { name: "Cologne (Kölsch)", ca: 55, mg: 12, na: 6, so4: 45, cl: 35, hco3: 55 },
  { name: "American Lager", ca: 25, mg: 5, na: 5, so4: 25, cl: 25, hco3: 40 },
  { name: "Czech Pils", ca: 30, mg: 10, na: 5, so4: 5, cl: 5, hco3: 20 },
  { name: "Schwarzbier", ca: 60, mg: 10, na: 15, so4: 40, cl: 40, hco3: 120 },
  { name: "Saison", ca: 90, mg: 10, na: 15, so4: 110, cl: 60, hco3: 40 },
  { name: "English Bitter", ca: 140, mg: 20, na: 30, so4: 275, cl: 50, hco3: 110 },
  { name: "Barleywine", ca: 150, mg: 20, na: 30, so4: 150, cl: 100, hco3: 150 },
  { name: "Rauchbier", ca: 80, mg: 15, na: 10, so4: 40, cl: 40, hco3: 120 },
  { name: "RO Water (Blank Canvas)", ca: 0, mg: 0, na: 0, so4: 0, cl: 0, hco3: 0 },
  { name: "Balanced Profile", ca: 75, mg: 10, na: 15, so4: 75, cl: 75, hco3: 50 },
  { name: "Malty Profile", ca: 50, mg: 10, na: 15, so4: 50, cl: 100, hco3: 75 },
  { name: "Hoppy Profile", ca: 100, mg: 10, na: 15, so4: 200, cl: 50, hco3: 50 },
];

export default function SaltAdditions() {
  const [mode, setMode] = useState<"basic" | "advanced">("basic");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");

  const [current, setCurrent] = useState({
    ca: "", mg: "", na: "", so4: "", cl: "", hco3: "",
  });

  const [batchSize, setBatchSize] = useState("5");
  const [sparge, setSparge] = useState<"yes" | "no">("no");
  const [mashVol, setMashVol] = useState("3");
  const [spargeVol, setSpargeVol] = useState("2");

  const [results, setResults] = useState<any>(null);

  const profiles = mode === "basic" ? BASIC_PROFILES : ADVANCED_PROFILES;

  const filtered = profiles.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const target = filtered.find((p) => p.name === selected);

  function updateField(field: string, value: string) {
    setCurrent((prev) => ({ ...prev, [field]: value }));
  }
  function calculate() {
    if (!target) return;

    const cur = {
      ca: parseFloat(current.ca || "0"),
      mg: parseFloat(current.mg || "0"),
      na: parseFloat(current.na || "0"),
      so4: parseFloat(current.so4 || "0"),
      cl: parseFloat(current.cl || "0"),
      hco3: parseFloat(current.hco3 || "0"),
    };

    const needed = {
      ca: target.ca - cur.ca,
      mg: target.mg - cur.mg,
      na: target.na - cur.na,
      so4: target.so4 - cur.so4,
      cl: target.cl - cur.cl,
      hco3: target.hco3 - cur.hco3,
    };

    function gpg(need: number, contrib: number) {
      return need > 0 ? need / contrib : 0;
    }

    const perGal = {
      gypsum: Math.max(gpg(needed.ca, SALTS.gypsum.ca), gpg(needed.so4, SALTS.gypsum.so4)),
      cacl2: Math.max(gpg(needed.ca, SALTS.cacl2.ca), gpg(needed.cl, SALTS.cacl2.cl)),
      epsom: Math.max(gpg(needed.mg, SALTS.epsom.mg), gpg(needed.so4, SALTS.epsom.so4)),
      bakingSoda: gpg(needed.na, SALTS.bakingSoda.na),
      chalk: gpg(needed.ca, SALTS.chalk.ca),
      picklingLime: gpg(needed.ca, SALTS.picklingLime.ca),
    };

    const mash = parseFloat(mashVol);
    const spargeV = parseFloat(spargeVol);

    const mashAdds = {
      gypsum: perGal.gypsum * mash,
      cacl2: perGal.cacl2 * mash,
      epsom: perGal.epsom * mash,
      bakingSoda: perGal.bakingSoda * mash,
      chalk: perGal.chalk * mash,
      picklingLime: perGal.picklingLime * mash,
    };

    const spargeAdds =
      sparge === "yes"
        ? {
            gypsum: perGal.gypsum * spargeV,
            cacl2: perGal.cacl2 * spargeV,
            epsom: perGal.epsom * spargeV,
            bakingSoda: 0,
            chalk: 0,
            picklingLime: 0,
          }
        : {
            gypsum: 0,
            cacl2: 0,
            epsom: 0,
            bakingSoda: 0,
            chalk: 0,
            picklingLime: 0,
          };

    const total = {
      gypsum: mashAdds.gypsum + spargeAdds.gypsum,
      cacl2: mashAdds.cacl2 + spargeAdds.cacl2,
      epsom: mashAdds.epsom + spargeAdds.epsom,
      bakingSoda: mashAdds.bakingSoda,
      chalk: mashAdds.chalk,
      picklingLime: mashAdds.picklingLime,
    };

    setResults({
      perGal,
      mashAdds,
      spargeAdds,
      total,
      target,
      current: cur,
      mash,
      spargeV,
    });
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable, #printable * { visibility: visible; }
          #printable { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>

      <Link href="/water" className="text-sm text-amber hover:underline dark:text-amber-light">
        ← Back to Water Tools
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-malt-dark dark:text-foreground">
        Salt Additions Calculator
      </h1>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => { setMode("basic"); setSelected(""); }}
          className={`px-4 py-2 rounded-md text-sm font-semibold ${
            mode === "basic" ? "bg-amber text-white" : "bg-malt/20 dark:bg-zinc-700 dark:text-zinc-200"
          }`}
        >
          Basic Profiles
        </button>

        <button
          onClick={() => { setMode("advanced"); setSelected(""); }}
          className={`px-4 py-2 rounded-md text-sm font-semibold ${
            mode === "advanced" ? "bg-amber text-white" : "bg-malt/20 dark:bg-zinc-700 dark:text-zinc-200"
          }`}
        >
          Advanced Profiles
        </button>
      </div>

      <div className="mt-6">
        <input
          type="text"
          placeholder="Search profiles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:bg-zinc-800 dark:text-foreground"
        />
      </div>

      <div className="mt-4">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:bg-zinc-800 dark:text-foreground"
        >
          <option value="">Select a profile</option>
          {filtered.map((p) => (
            <option key={p.name} value={p.name}>{p.name}</option>
          ))}
        </select>
      </div>

      <p className="mt-4 text-sm text-malt-dark dark:text-zinc-300 italic">
        Leave all salts at zero if starting with RO water.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-6">
        {["ca", "mg", "na", "so4", "cl", "hco3"].map((ion) => (
          <div key={ion}>
            <label className="block text-sm font-medium text-malt-dark dark:text-foreground">
              {ion.toUpperCase()} (ppm)
            </label>

            <input
              type="number"
              value={current[ion as keyof typeof current]}
              onChange={(e) => updateField(ion, e.target.value)}
              className="mt-1 w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:bg-zinc-800 dark:text-foreground"
            />

            <input
              type="range"
              min="0"
              max="400"
              value={current[ion as keyof typeof current] || 0}
              onChange={(e) => updateField(ion, e.target.value)}
              className="mt-2 w-full accent-amber"
            />
          </div>
        ))}
      </div>

      <div className="mt-8">
        <label className="block text-sm font-medium text-malt-dark dark:text-foreground">
          Will you sparge?
        </label>

        <div className="flex gap-4 mt-2">
          <button
            onClick={() => setSparge("no")}
            className={`px-4 py-2 rounded-md text-sm font-semibold ${
              sparge === "no" ? "bg-amber text-white" : "bg-malt/20 dark:bg-zinc-700 dark:text-zinc-200"
            }`}
          >
            No
          </button>

          <button
            onClick={() => setSparge("yes")}
            className={`px-4 py-2 rounded-md text-sm font-semibold ${
              sparge === "yes" ? "bg-amber text-white" : "bg-malt/20 dark:bg-zinc-700 dark:text-zinc-200"
            }`}
          >
            Yes
          </button>
        </div>
      </div>

      {sparge === "yes" && (
        <div className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-malt-dark dark:text-foreground">
              Mash Water (gal)
            </label>
            <input
              type="number"
              value={mashVol}
              onChange={(e) => setMashVol(e.target.value)}
              className="mt-1 w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:bg-zinc-800 dark:text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-malt-dark dark:text-foreground">
              Sparge Water (gal)
            </label>
            <input
              type="number"
              value={spargeVol}
              onChange={(e) => setSpargeVol(e.target.value)}
              className="mt-1 w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:bg-zinc-800 dark:text-foreground"
            />
          </div>
        </div>
      )}

      <div className="mt-6">
        <label className="block text-sm font-medium text-malt-dark dark:text-foreground">
          Batch Size (gallons)
        </label>
        <input
          type="number"
          value={batchSize}
          onChange={(e) => setBatchSize(e.target.value)}
          className="mt-1 w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:bg-zinc-800 dark:text-foreground"
        />
      </div>

      <button
        onClick={calculate}
        className="mt-6 w-full rounded-md bg-amber px-4 py-2 text-sm font-semibold text-white hover:bg-malt-dark"
      >
        Calculate Salt Additions
      </button>
      {results && (
        <>
          {/* RESULTS CARD */}
          <div className="mt-10 rounded-lg border border-malt/20 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">

            <h2 className="text-2xl font-semibold text-malt-dark dark:text-foreground mb-4">
              Salt Additions Table
            </h2>

            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-malt/30 dark:border-white/10">
                  <th className="py-2 font-semibold">Salt</th>
                  <th className="py-2 font-semibold">Mash (g)</th>
                  <th className="py-2 font-semibold">Sparge (g)</th>
                  <th className="py-2 font-semibold">Total (g)</th>
                </tr>
              </thead>

              <tbody>
                {Object.keys(results.total).map((salt) => (
                  <tr
                    key={salt}
                    className="border-b border-malt/20 dark:border-white/10"
                  >
                    <td className="py-2 capitalize">{salt}</td>
                    <td className="py-2">{results.mashAdds[salt].toFixed(2)}</td>
                    <td className="py-2">{results.spargeAdds[salt].toFixed(2)}</td>
                    <td className="py-2">{results.total[salt].toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PRINT BUTTON */}
            <button
              onClick={() => window.print()}
              className="mt-6 w-full rounded-md bg-malt-dark px-4 py-2 text-sm font-semibold text-white hover:bg-amber"
            >
              Print Summary
            </button>
          </div>

          {/* PRINTABLE SUMMARY */}
          <div id="printable" className="hidden print:block mt-10">
            <h1 className="text-3xl font-bold mb-4">Salt Additions Summary</h1>

            <h2 className="text-xl font-semibold mb-2">Target Profile</h2>
            <pre className="text-sm bg-gray-100 p-2 rounded">
{JSON.stringify(results.target, null, 2)}
            </pre>

            <h2 className="text-xl font-semibold mt-4 mb-2">Current Water</h2>
            <pre className="text-sm bg-gray-100 p-2 rounded">
{JSON.stringify(results.current, null, 2)}
            </pre>

            <h2 className="text-xl font-semibold mt-4 mb-2">Mash Additions (g)</h2>
            <pre className="text-sm bg-gray-100 p-2 rounded">
{JSON.stringify(results.mashAdds, null, 2)}
            </pre>

            <h2 className="text-xl font-semibold mt-4 mb-2">Sparge Additions (g)</h2>
            <pre className="text-sm bg-gray-100 p-2 rounded">
{JSON.stringify(results.spargeAdds, null, 2)}
            </pre>

            <h2 className="text-xl font-semibold mt-4 mb-2">Total Additions (g)</h2>
            <pre className="text-sm bg-gray-100 p-2 rounded">
{JSON.stringify(results.total, null, 2)}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}
