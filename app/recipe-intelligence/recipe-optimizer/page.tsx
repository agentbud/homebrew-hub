"use client";

import { useState } from "react";
import Link from "next/link";

export default function RecipeOptimizer() {
  const [og, setOg] = useState("");
  const [fg, setFg] = useState("");
  const [ibu, setIbu] = useState("");
  const [srm, setSrm] = useState("");
  const [yeast, setYeast] = useState("");
  const [mashTemp, setMashTemp] = useState("");

  const [result, setResult] = useState<any>(null);

  function optimize() {
    if (!og || !fg || !ibu || !srm || !yeast || !mashTemp) return;

    const ogVal = parseFloat(og);
    const fgVal = parseFloat(fg);
    const ibuVal = parseFloat(ibu);
    const srmVal = parseFloat(srm);
    const mashVal = parseFloat(mashTemp);

    // Attenuation
    const attenuation = ((ogVal - fgVal) / (ogVal - 1)) * 100;

    // Mash temp suggestions
    let mashSuggestion = "";
    if (mashVal < 149) mashSuggestion = "Mash temp is very low — expect a dry, highly fermentable beer.";
    else if (mashVal <= 152) mashSuggestion = "Mash temp is balanced — good attenuation and body.";
    else if (mashVal <= 156) mashSuggestion = "Mash temp is high — expect more body and sweetness.";
    else mashSuggestion = "Mash temp is very high — beer may finish overly sweet.";

    // Hop balance suggestions
    let hopSuggestion = "";
    const buGu = ibuVal / (ogVal - 1);
    if (buGu < 0.5) hopSuggestion = "Low bitterness relative to gravity — beer may taste sweet.";
    else if (buGu <= 0.8) hopSuggestion = "Balanced bitterness for most styles.";
    else hopSuggestion = "High bitterness — suitable for IPAs or bitter-forward styles.";

    // Yeast suggestions
    let yeastSuggestion = "";
    const y = yeast.toLowerCase();
    if (y.includes("us-05") || y.includes("001"))
      yeastSuggestion = "Clean American yeast — great for hop-forward or neutral beers.";
    else if (y.includes("530") || y.includes("3787"))
      yeastSuggestion = "Belgian yeast — expect esters and phenolics.";
    else if (y.includes("34/70") || y.includes("2124"))
      yeastSuggestion = "Lager yeast — ensure proper fermentation temps.";
    else yeastSuggestion = "Yeast strain not recognized — ensure attenuation matches recipe goals.";

    // Water profile suggestions
    let waterSuggestion = "";
    if (srmVal <= 5)
      waterSuggestion = "Light beer — consider soft water with low alkalinity.";
    else if (srmVal <= 15)
      waterSuggestion = "Amber beer — balanced sulfate/chloride ratio works well.";
    else
      waterSuggestion = "Dark beer — consider adding bicarbonate to buffer acidity.";

    setResult({
      attenuation: attenuation.toFixed(1),
      mashSuggestion,
      hopSuggestion,
      yeastSuggestion,
      waterSuggestion,
    });
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* RETURN LINK */}
      <Link
        href="/recipe-intelligence"
        className="text-sm text-amber hover:underline dark:text-amber-light"
      >
        ← Back to Recipe Intelligence
      </Link>

      {/* TITLE */}
      <h1 className="mt-6 text-3xl font-bold text-malt-dark dark:text-foreground">
        Recipe Optimizer
      </h1>

      <p className="mt-2 text-malt/80 dark:text-zinc-400">
        Enter your recipe stats to get targeted optimization suggestions.
      </p>

      {/* INPUT GRID */}
      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-malt-dark dark:text-foreground">
            OG
          </label>
          <input
            type="number"
            step="0.001"
            value={og}
            onChange={(e) => setOg(e.target.value)}
            className="mt-1 w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:border-white/20 dark:bg-zinc-800 dark:text-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-malt-dark dark:text-foreground">
            FG
          </label>
          <input
            type="number"
            step="0.001"
            value={fg}
            onChange={(e) => setFg(e.target.value)}
            className="mt-1 w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:border-white/20 dark:bg-zinc-800 dark:text-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-malt-dark dark:text-foreground">
            IBU
          </label>
          <input
            type="number"
            value={ibu}
            onChange={(e) => setIbu(e.target.value)}
            className="mt-1 w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:border-white/20 dark:bg-zinc-800 dark:text-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-malt-dark dark:text-foreground">
            SRM
          </label>
          <input
            type="number"
            value={srm}
            onChange={(e) => setSrm(e.target.value)}
            className="mt-1 w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:border-white/20 dark:bg-zinc-800 dark:text-foreground"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-malt-dark dark:text-foreground">
            Yeast Strain
          </label>
          <input
            type="text"
            placeholder="e.g., US-05, WLP001, W34/70, WLP530"
            value={yeast}
            onChange={(e) => setYeast(e.target.value)}
            className="mt-1 w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:border-white/20 dark:bg-zinc-800 dark:text-foreground"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-malt-dark dark:text-foreground">
            Mash Temperature (°F)
          </label>
          <input
            type="number"
            value={mashTemp}
            onChange={(e) => setMashTemp(e.target.value)}
            className="mt-1 w-full rounded-md border border-malt/30 bg-white p-2 text-sm dark:border-white/20 dark:bg-zinc-800 dark:text-foreground"
          />
        </div>
      </div>

      {/* OPTIMIZE BUTTON */}
      <button
        onClick={optimize}
        className="mt-6 w-full rounded-md bg-amber px-4 py-2 text-sm font-semibold text-white hover:bg-malt-dark"
      >
        Optimize Recipe
      </button>

      {/* RESULTS */}
      {result && (
        <div className="mt-8 rounded-lg border border-malt/20 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900 space-y-4">
          <h2 className="text-2xl font-semibold text-malt-dark dark:text-foreground">
            Optimization Results
          </h2>

          <p className="text-malt-dark dark:text-zinc-300">
            <strong>Estimated Attenuation:</strong>{" "}
            <span className="text-amber font-semibold">{result.attenuation}%</span>
          </p>

          <div>
            <strong className="text-malt-dark dark:text-foreground">Mash Temperature:</strong>
            <p className="text-malt/80 dark:text-zinc-400">{result.mashSuggestion}</p>
          </div>

          <div>
            <strong className="text-malt-dark dark:text-foreground">Hop Balance:</strong>
            <p className="text-malt/80 dark:text-zinc-400">{result.hopSuggestion}</p>
          </div>

          <div>
            <strong className="text-malt-dark dark:text-foreground">Yeast Selection:</strong>
            <p className="text-malt/80 dark:text-zinc-400">{result.yeastSuggestion}</p>
          </div>

          <div>
            <strong className="text-malt-dark dark:text-foreground">Water Profile:</strong>
            <p className="text-malt/80 dark:text-zinc-400">{result.waterSuggestion}</p>
          </div>
        </div>
      )}
    </div>
  );
}
