"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || seconds <= 0) return;

    const interval = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [running, seconds]);

  useEffect(() => {
    if (seconds === 0 && running) {
      setRunning(false);
      if (typeof window !== "undefined") {
        const audio = new Audio(
          "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA="
        );
        audio.play();
      }
    }
  }, [seconds, running]);

  function start() {
    if (seconds > 0) setRunning(true);
  }

  function pause() {
    setRunning(false);
  }

  function reset(initial: number) {
    setRunning(false);
    setSeconds(initial);
  }

  return { seconds, running, start, pause, reset };
}

function TimerCard({
  title,
  initialMinutes,
}: {
  title: string;
  initialMinutes: number;
}) {
  const initialSeconds = initialMinutes * 60;
  const timer = useCountdown(initialSeconds);

  const mins = Math.floor(timer.seconds / 60);
  const secs = timer.seconds % 60;

  return (
    <div className="rounded-lg border border-malt/20 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900">
      <h2 className="text-xl font-semibold text-malt-dark dark:text-foreground mb-2">
        {title}
      </h2>

      <p className="text-3xl font-mono text-malt-dark dark:text-foreground mb-4">
        {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </p>

      <div className="flex gap-2">
        <button
          onClick={timer.start}
          className="px-3 py-1 rounded-md bg-amber text-white font-medium hover:bg-malt-dark"
        >
          Start
        </button>
        <button
          onClick={timer.pause}
          className="px-3 py-1 rounded-md bg-malt/40 text-malt-dark font-medium hover:bg-malt/60 dark:bg-zinc-700 dark:text-zinc-200"
        >
          Pause
        </button>
        <button
          onClick={() => timer.reset(initialSeconds)}
          className="px-3 py-1 rounded-md bg-red-600 text-white font-medium hover:bg-red-700"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default function BrewDayTimer() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 space-y-6">
      {/* RETURN LINK */}
      <Link
        href="/tools"
        className="text-sm text-amber hover:underline dark:text-amber-light"
      >
        ← Back to Tools
      </Link>

      <h1 className="text-3xl font-bold text-malt-dark dark:text-foreground">
        Brew Day Timer
      </h1>

      <p className="mt-2 text-malt/80 dark:text-zinc-400">
        Independent timers for each stage of your brew day. Each timer runs
        separately and alerts when finished.
      </p>

      {/* MAIN TIMERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TimerCard title="Mash Timer (60 min)" initialMinutes={60} />
        <TimerCard title="Boil Timer (60 min)" initialMinutes={60} />
        <TimerCard title="Whirlpool Timer (20 min)" initialMinutes={20} />
        <TimerCard title="Chill Timer (15 min)" initialMinutes={15} />
      </div>

      <h2 className="text-2xl font-bold text-malt-dark dark:text-foreground mt-8">
        Hop Additions
      </h2>

      <p className="mt-2 text-malt/80 dark:text-zinc-400">
        Common hop addition timers. Adjust as needed.
      </p>

      {/* HOP TIMERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TimerCard title="60 min Addition" initialMinutes={60} />
        <TimerCard title="30 min Addition" initialMinutes={30} />
        <TimerCard title="10 min Addition" initialMinutes={10} />
      </div>
    </div>
  );
}
