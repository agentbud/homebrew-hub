import Link from "next/link";

const calculators = [
  {
    name: "ABV Calculator",
    description: "Estimate alcohol by volume from original and final gravity.",
    href: "/calculators/abv",
  },
  {
    name: "OG / FG Calculator",
    description: "Convert hydrometer readings and track fermentation progress.",
    href: "/calculators/gravity",
  },
  {
    name: "Priming Sugar",
    description: "Calculate sugar needed for bottle conditioning.",
    href: "/calculators/priming",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-cream text-foreground dark:bg-background">
      <header className="border-b border-malt/10 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-background/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Homebrew Hub
          </Link>
          <nav className="flex gap-6 text-sm font-medium">
            <Link
              href="/calculators"
              className="text-malt hover:text-amber dark:text-amber-light"
            >
              Calculators
            </Link>
            <Link
              href="/tools"
              className="text-malt hover:text-amber dark:text-amber-light"
            >
              Tools
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative w-full py-16 sm:py-24 text-center">

{/* FULL-WIDTH BACKGROUND ILLUSTRATION — STYLE 3 */}
<div className="pointer-events-none absolute inset-0 -z-10 opacity-30 dark:opacity-40">
  <svg
    viewBox="0 0 500 300"
    className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2"
    stroke="#7c5a3a"
    fill="none"
    strokeWidth="2"
  >
    <path d="M50 220h400" />
    <rect x="80" y="120" width="120" height="100" rx="6" />
    <rect x="300" y="100" width="120" height="120" rx="6" />
    <path d="M140 120v-40h40v40" />
    <path d="M360 100v-50h40v50" />
    <circle cx="140" cy="170" r="18" />
    <circle cx="360" cy="160" r="22" />
  </svg>
</div>

{/* CONTENT */}
<div className="mx-auto max-w-5xl px-6">
  <p className="mb-4 text-sm font-medium uppercase tracking-widest text-amber">
    Brew smarter, not harder
  </p>

  <h1 className="text-4xl font-bold tracking-tight text-malt-dark sm:text-5xl dark:text-foreground">
    Your Homebrew Companion
  </h1>

  <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-malt/80 dark:text-zinc-400">
    Homebrew Hub gives you simple, accurate brewing calculators and tools
    so you can focus on crafting great beer — from mash to bottle.
  </p>

  <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
    <Link
      href="/calculators"
      className="rounded-full bg-amber px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-malt-dark"
    >
      Browse Calculators
    </Link>

    <Link
      href="/tools"
      className="rounded-full bg-amber px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-malt-dark"
    >
      Browse Tools
    </Link>
  </div>
</div>
</section>


      <section className="border-t border-malt/10 bg-white dark:border-white/10 dark:bg-zinc-950">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold text-malt-dark dark:text-foreground">
            Built for homebrewers
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-malt/80 dark:text-zinc-400">
            Whether you&apos;re dialing in your first pale ale or refining a
            saison recipe, our calculators help with the math behind the mash.
            Track gravity, estimate ABV, and plan carbonation without digging
            through spreadsheets.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-semibold text-malt-dark dark:text-foreground">
            Calculators & Tools
          </h2>
          <Link
            href="/tools"
            className="text-sm font-medium text-amber hover:text-malt-dark dark:text-amber-light"
          >
            View all tools →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {calculators.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="group rounded-2xl border border-malt/10 bg-white p-6 transition-shadow hover:shadow-md dark:border-white/10 dark:bg-zinc-900"
            >
              <h3 className="font-semibold text-malt-dark group-hover:text-amber dark:text-foreground">
                {calc.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-malt/70 dark:text-zinc-400">
                {calc.description}
              </p>
            </Link>
          ))}

          <Link
            href="/tools"
            className="group rounded-2xl border border-malt/10 bg-white p-6 transition-shadow hover:shadow-md dark:border-white/10 dark:bg-zinc-900"
          >
            <h3 className="font-semibold text-malt-dark group-hover:text-amber dark:text-foreground">
              Brewing Tools
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-malt/70 dark:text-zinc-400">
              Hop schedule builder, recipe designer, fermentation tracker, BJCP
              browser, and more.
            </p>
          </Link>
        </div>
      </section>

      <footer className="mt-auto border-t border-malt/10 px-6 py-8 text-center text-sm text-malt/60 dark:border-white/10 dark:text-zinc-500">
        Homebrew Hub — tools for the craft
      </footer>
    </div>
  );
}
