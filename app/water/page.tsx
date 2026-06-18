"use client";

import Link from "next/link";

export default function WaterToolsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">

      {/* RETURN LINK */}
      <Link
        href="/"
        className="text-sm text-amber hover:underline dark:text-amber-light"
      >
        ← Back to Home
      </Link>

      {/* TITLE */}
      <h1 className="mt-6 text-3xl font-bold text-malt-dark dark:text-foreground">
        Water Tools
      </h1>

      {/* DESCRIPTION */}
      <p className="mt-2 text-malt-dark dark:text-zinc-300">
        Build water profiles, calculate salt additions, and dial in your brewing water with precision.
      </p>

      {/* GRID OF TOOLS */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">

        {/* WATER PROFILE BUILDER */}
        <Link
          href="/water/profile-builder"
          className="block rounded-lg border border-malt/20 bg-white p-6 shadow-sm hover:shadow-md transition dark:border-white/10 dark:bg-zinc-900"
        >
          <h2 className="text-xl font-semibold text-malt-dark dark:text-foreground">
            Water Profile Builder
          </h2>
          <p className="mt-2 text-sm text-malt-dark dark:text-zinc-300">
            Build custom water profiles or choose from classic brewing regions.
          </p>
        </Link>

        {/* SALT ADDITIONS CALCULATOR */}
        <Link
          href="/water/salt-additions"
          className="block rounded-lg border border-malt/20 bg-white p-6 shadow-sm hover:shadow-md transition dark:border-white/10 dark:bg-zinc-900"
        >
          <h2 className="text-xl font-semibold text-malt-dark dark:text-foreground">
            Salt Additions Calculator
          </h2>
          <p className="mt-2 text-sm text-malt-dark dark:text-zinc-300">
            Calculate mash and sparge salt additions based on your target profile.
          </p>
        </Link>

      </div>
    </div>
  );
}
