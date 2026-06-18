import Link from "next/link";

const calculators = [
  {
    name: "ABV Calculator",
    href: "/calculators/abv",
    description: "Alcohol by volume from OG and FG.",
  },
  {
    name: "OG / FG Converter",
    href: "/calculators/gravity",
    description: "Convert between SG, Plato, and Brix.",
  },
  {
    name: "Priming Sugar",
    href: "/calculators/priming",
    description: "Corn sugar needed for bottle conditioning.",
  },
  {
    name: "Strike Water Temperature",
    href: "/calculators/strike-water",
    description: "Calculate strike temperature based on grain temp and ratio.",
  },
  {
    name: "Mash Water Volume",
    href: "/calculators/mash-water",
    description: "Mash water needed based on grain weight and thickness.",
  },
  {
    name: "Hydrometer Temperature Correction",
    href: "/calculators/hydrometer",
    description: "Correct SG readings for sample temperature.",
  },
  {
    name: "IBU Calculator",
    href: "/calculators/ibu",
    description: "Tinseth bitterness estimation.",
  },
  {
    name: "SRM Color Calculator",
    href: "/calculators/srm",
    description: "Convert MCU to SRM using the Morey equation.",
  },
  {
    name: "Yeast Pitch Rate",
    href: "/calculators/pitch-rate",
    description: "Calculate required yeast cells for fermentation.",
  },
  {
    name: "Water Chemistry",
    href: "/calculators/water",
    description: "Residual alkalinity and mash pH estimate.",
  },
  {
    name: "Mash pH Prediction",
    href: "/calculators/mash-ph",
    description: "Predict mash pH from SRM and RA.",
  },
  {
    name: "Dilution & Boil-Off",
    href: "/calculators/dilution",
    description: "Calculate gravity after dilution or boil-off.",
  },
  {
    name: "Water Profile Builder",
    href: "/calculators/water-profile",
    description: "Estimate salt additions for target water profile.",
  },
  {
    name: "Recipe OG Estimator",
    href: "/calculators/recipe-gravity",
    description: "Estimate OG from grain points, efficiency, and volume.",
  },
  {
    name: "Hop Stand IBU",
    href: "/calculators/hop-stand",
    description: "IBU estimation for whirlpool additions.",
  },
  {
    name: "Keg Carbonation",
    href: "/calculators/keg-carb",
    description: "Calculate PSI needed for target CO₂ volumes.",
  },
];

export default function CalculatorsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <Link
        href="/"
        className="text-sm text-amber hover:underline dark:text-amber-light"
      >
        ← Home
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-malt-dark dark:text-foreground">
        Calculators
      </h1>

      <p className="mt-2 text-malt/80 dark:text-zinc-400">
        Pick a tool to get started.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {calculators.map((calc) => (
          <Link
            key={calc.href}
            href={calc.href}
            className="rounded-lg border border-malt/20 bg-white p-5 shadow-sm transition hover:shadow-md dark:bg-zinc-900"
          >
            <h2 className="text-lg font-semibold text-malt-dark dark:text-foreground">
              {calc.name}
            </h2>
            <p className="mt-1 text-sm text-malt/70 dark:text-zinc-400">
              {calc.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
