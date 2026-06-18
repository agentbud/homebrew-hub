"use client";

import { useState } from "react";
import Link from "next/link";

const BASIC_PROFILES = [
  {
    name: "Pilsner",
    ca: 7, mg: 2, na: 2, so4: 5, cl: 5, hco3: 15,
    notes: "Extremely soft water ideal for pale lagers and delicate beers.",
  },
  {
    name: "Burton-on-Trent",
    ca: 275, mg: 40, na: 25, so4: 450, cl: 35, hco3: 260,
    notes: "High sulfate water ideal for hop-forward ales and IPAs.",
  },
  {
    name: "Dublin",
    ca: 110, mg: 4, na: 12, so4: 55, cl: 19, hco3: 280,
    notes: "High alkalinity water suited for stouts and dark ales.",
  },
  {
    name: "Westvleteren / Trappist",
    ca: 35, mg: 8, na: 15, so4: 25, cl: 40, hco3: 120,
    notes: "Balanced profile ideal for Belgian dubbels, tripels, and quads.",
  },
  {
    name: "NEIPA",
    ca: 100, mg: 10, na: 25, so4: 75, cl: 200, hco3: 50,
    notes: "High chloride for soft mouthfeel and juicy hop expression.",
  },
  {
    name: "West Coast IPA",
    ca: 140, mg: 20, na: 25, so4: 250, cl: 50, hco3: 75,
    notes: "High sulfate for crisp, dry, hop-forward bitterness.",
  },
];

const ADVANCED_PROFILES = [
  { name: "Munich", ca: 75, mg: 18, na: 2, so4: 10, cl: 2, hco3: 180,
    notes: "Great for malty lagers like Dunkel and Bock." },
  { name: "Vienna", ca: 95, mg: 12, na: 8, so4: 55, cl: 40, hco3: 125,
    notes: "Balanced profile for Vienna Lager and Märzen." },
  { name: "Dortmund", ca: 225, mg: 40, na: 60, so4: 120, cl: 60, hco3: 180,
    notes: "Mineral-rich water for Export lagers." },
  { name: "Edinburgh", ca: 120, mg: 18, na: 55, so4: 140, cl: 65, hco3: 225,
    notes: "Perfect for Scottish ales and malt-forward beers." },
  { name: "London", ca: 90, mg: 5, na: 15, so4: 50, cl: 35, hco3: 125,
    notes: "Classic porter and brown ale water." },
  { name: "Prague", ca: 35, mg: 8, na: 4, so4: 5, cl: 5, hco3: 15,
    notes: "Soft water ideal for Czech Pilsner." },
  { name: "Antwerp", ca: 90, mg: 12, na: 20, so4: 45, cl: 40, hco3: 110,
    notes: "Great for Belgian pale ales and blondes." },
  { name: "Cologne (Kölsch)", ca: 55, mg: 12, na: 6, so4: 45, cl: 35, hco3: 55,
    notes: "Balanced water for Kölsch and light ales." },

  { name: "American Lager", ca: 25, mg: 5, na: 5, so4: 25, cl: 25, hco3: 40,
    notes: "Clean, low-mineral water for crisp lagers." },
  { name: "Czech Pils", ca: 30, mg: 10, na: 5, so4: 5, cl: 5, hco3: 20,
    notes: "Soft water for Saaz-forward lagers." },
  { name: "Schwarzbier", ca: 60, mg: 10, na: 15, so4: 40, cl: 40, hco3: 120,
    notes: "Balanced dark lager water." },
  { name: "Saison", ca: 90, mg: 10, na: 15, so4: 110, cl: 60, hco3: 40,
    notes: "Dry, mineral-rich water for expressive farmhouse ales." },
  { name: "English Bitter", ca: 140, mg: 20, na: 30, so4: 275, cl: 50, hco3: 110,
    notes: "High sulfate for crisp, bitter English ales." },
  { name: "Barleywine", ca: 150, mg: 20, na: 30, so4: 150, cl: 100, hco3: 150,
    notes: "Strong malt-forward beers benefit from this profile." },
  { name: "Rauchbier", ca: 80, mg: 15, na: 10, so4: 40, cl: 40, hco3: 120,
    notes: "Balanced profile for smoked lagers." },

  { name: "RO Water (Blank Canvas)", ca: 0, mg: 0, na: 0, so4: 0, cl: 0, hco3: 0,
    notes: "Start from scratch and build your own profile." },
  { name: "Balanced Profile", ca: 75, mg: 10, na: 15, so4: 75, cl: 75, hco3: 50,
    notes: "Good all-purpose brewing water." },
  { name: "Malty Profile", ca: 50, mg: 10, na: 15, so4: 50, cl: 100, hco3: 75,
    notes: "Chloride-forward for malt sweetness." },
  { name: "Hoppy Profile", ca: 100, mg: 10, na: 15, so4: 200, cl: 50, hco3: 50,
    notes: "Sulfate-forward for hop crispness." },
];

export default function WaterProfileBuilder() {
  const [mode, setMode] = useState<"basic" | "advanced">("basic");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");

  const profiles = mode === "basic" ? BASIC_PROFILES : ADVANCED_PROFILES;

  const filtered = profiles.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const profile = filtered.find((p) => p.name === selected);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* RETURN LINK */}
      <Link
        href="/water"
        className="text-sm text-amber hover:underline dark:text-amber-light"
      >
        ← Back to Water Tools
      </Link>

      {/* TITLE */}
      <h1 className="mt-6 text-3xl font-bold text-malt-dark dark:text-foreground">
        Water Profile Builder
      </h1>

      {/* TOGGLE */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => { setMode("basic"); setSelected(""); }}
          className={`px-4 py-2 rounded-md text-sm font-semibold ${
            mode === "basic"
              ? "bg-amber text-white hover:bg-malt-dark"
              : "bg-malt/20 text-malt-dark dark:bg-zinc-700 dark:text-zinc-200"
          }`}
        >
          Basic Profiles
        </button>

        <button
          onClick={() => { setMode("advanced"); setSelected(""); }}
          className={`px-4 py-2 rounded-md text-sm font-semibold ${
            mode === "advanced"
              ? "bg-amber text-white hover:bg-malt-dark"
              : "bg-malt/20 text-malt-dark dark:bg-zinc-700 dark:text-zinc-200"
          }`}
        >
          Advanced Profiles
        </button>
      </div>

      {/* SEARCH */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Search profiles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:border-white/20 dark:bg-zinc-800 dark:text-foreground"
        />
      </div>

      {/* DROPDOWN */}
      <div className="mt-4">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:border-white/20 dark:bg-zinc-800 dark:text-foreground"
        >
          <option value="">Select a profile</option>
          {filtered.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* DISPLAY */}
      {profile && (
        <div className="mt-8 rounded-lg border border-malt/20 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900 space-y-3">
          <h2 className="text-2xl font-semibold text-malt-dark dark:text-foreground">
            {profile.name}
          </h2>

          <ul className="space-y-1 text-malt-dark dark:text-zinc-300">
            <li><strong>Calcium (Ca):</strong> {profile.ca} ppm</li>
            <li><strong>Magnesium (Mg):</strong> {profile.mg} ppm</li>
            <li><strong>Sodium (Na):</strong> {profile.na} ppm</li>
            <li><strong>Sulfate (SO₄):</strong> {profile.so4} ppm</li>
            <li><strong>Chloride (Cl):</strong> {profile.cl} ppm</li>
            <li><strong>Bicarbonate (HCO₃):</strong> {profile.hco3} ppm</li>
          </ul>

          <p className="text-malt/80 dark:text-zinc-400">{profile.notes}</p>
        </div>
      )}
    </div>
  );
}
