"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Step = {
  name: string;
  duration: number; // minutes
  remaining: number; // seconds
  running: boolean;
};

export default function BrewDayTimer() {
  const [stepName, setStepName] = useState("");
  const [stepDuration, setStepDuration] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);

  // Tick every second for running timers
  useEffect(() => {
    const interval = setInterval(() => {
      setSteps((prev) =>
        prev.map((s) => {
          if (!s.running || s.remaining <= 0) return s;
          return { ...s, remaining: s.remaining - 1 };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const addStep = () => {
    const d = parseFloat(stepDuration);
    if (!stepName || isNaN(d) || d <= 0) return;

    setSteps((prev) => [
      ...prev,
      {
        name: stepName,
        duration: d,
        remaining: d * 60,
        running: false,
      },
    ]);

    setStepName("");
    setStepDuration("");
  };

  const startStep = (index: number) => {
    setSteps((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, running: true } : s
      )
    );
  };

  const pauseStep = (index: number) => {
    setSteps((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, running: false } : s
      )
    );
  };

  const resetStep = (index: number) => {
    setSteps((prev) =>
      prev.map((s, i) =>
        i === index
          ? { ...s, running: false, remaining: s.duration * 60 }
          : s
      )
    );
  };

  const removeStep = (index: number) => {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Link
        href="/tools"
        className="text-sm text-amber hover:underline dark:text-amber-light"
      >
        ← Back to Tools
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-malt-dark dark:text-foreground">
        Brew Day Timer
      </h1>

      <p className="mt-2 text-malt/80 dark:text-zinc-400">
        Create mash steps, boil steps, hop additions, and run timers for each.
      </p>

      {/* Add Step */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-malt-dark dark:text-foreground">
          Add Step
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <input
            placeholder="Step Name (e.g., Mash @ 152°F)"
            value={stepName}
            onChange={(e) => setStepName(e.target.value)}
            className="rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          />
          <input
            type="number"
            placeholder="Duration (min)"
            value={stepDuration}
            onChange={(e) => setStepDuration(e.target.value)}
            className="rounded border border-malt/20 bg-white p-2 dark:bg-zinc-900"
          />
        </div>

        <button
          onClick={addStep}
          className="mt-3 rounded bg-amber px-4 py-2 text-sm font-semibold text-white hover:bg-amber-dark"
        >
          Add Step
        </button>
      </div>

      {/* Steps List */}
      {steps.length > 0 && (
        <div className="mt-10 space-y-4">
          {steps.map((s, i) => (
            <div
              key={i}
              className="rounded border border-malt/20 bg-white p-4 dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">{s.name}</p>
                  <p className="text-sm text-malt/70 dark:text-zinc-400">
                    Duration: {s.duration} min
                  </p>
                  <p className="text-sm text-malt/70 dark:text-zinc-400">
                    Remaining: {formatTime(s.remaining)}
                  </p>
                </div>

                <div className="flex gap-2">
                  {!s.running && s.remaining > 0 && (
                    <button
                      onClick={() => startStep(i)}
                      className="rounded bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700"
                    >
                      Start
                    </button>
                  )}

                  {s.running && (
                    <button
                      onClick={() => pauseStep(i)}
                      className="rounded bg-yellow-500 px-3 py-1 text-xs font-semibold text-white hover:bg-yellow-600"
                    >
                      Pause
                    </button>
                  )}

                  <button
                    onClick={() => resetStep(i)}
                    className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Reset
                  </button>

                  <button
                    onClick={() => removeStep(i)}
                    className="rounded bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
