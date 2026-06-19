"use client";

import Link from "next/link";

export default function RecipeIntelligencePage() {
  const tools = [
    {
      name: "What Can I Brew Today?",
      href: "/recipe-intelligence/brew-today",
      description: "Match your grain, hops, and yeast inventory to brewable recipes.",
    },
    {
      name: "Recipe Optimizer",
      href: "/recipe-intelligence/recipe-optimizer",
      description: "Improve mash temp, hop balance, yeast choice, and water profile.",
    }
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* RETURN LINK */}
      <Link
        href="/"
        className="text-sm text-amber hover:underline dark:text-amber-light"
      >
        ← Home
      </Link>

      {/* PAGE TITLE */}
      <h1 className="mt-6 text-3xl font-bold text-malt-dark dark:text-foreground">
        Recipe Intelligence
      </h1>

      <p className="mt-2 text-malt/80 dark:text-zinc-400">
        Smart tools to help you design, refine, and evaluate your beer recipes.
      </p>

      {/* GRID */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="rounded-lg border border-malt/20 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-zinc-900"
          >
            <h2 className="text-lg font-semibold text-malt-dark dark:text-foreground">
              {tool.name}
            </h2>
            <p className="mt-1 text-sm text-malt/70 dark:text-zinc-400">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
