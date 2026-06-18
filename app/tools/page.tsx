"use client";

import Link from "next/link";

export default function ToolsPage() {
  const tools = [
    {
      name: "Recipe Designer",
      href: "/tools/recipe-designer",
      description: "Build full recipes with grains, hops, and estimates.",
    },
    {
      name: "Hop Schedule Builder",
      href: "/tools/hop-schedule",
      description: "Design hop additions with timing and IBU estimates.",
    },
    {
      name: "Grain Bill Builder",
      href: "/tools/grain-bill",
      description: "Construct grain bills with color and gravity impact.",
    },
    {
      name: "Fermentation Tracker",
      href: "/tools/fermentation-tracker",
      description: "Track gravity, temperature, and fermentation progress.",
    },
    {
      name: "Brew Day Timer",
      href: "/tools/brew-timer",
      description: "Step-by-step timers for mash, boil, and hop additions.",
    },
    {
      name: "BJCP Style Browser",
      href: "/tools/bjcp",
      description: "Browse beer styles with guidelines and targets.",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold text-malt-dark dark:text-foreground">
        Brewing Tools
      </h1>

      <p className="mt-2 text-malt/80 dark:text-zinc-400">
        Advanced brewing utilities for recipe design, scheduling, and tracking.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="rounded-lg border border-malt/20 bg-white p-5 shadow-sm transition hover:shadow-md dark:bg-zinc-900"
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
