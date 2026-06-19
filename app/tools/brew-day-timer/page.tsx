"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

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

      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    }
  }, [seconds, running]);

  function start() {
    if (seconds > 0) {
      if (!audioRef.current) {
        const audio = new Audio("/sounds/beer-fridge.mp3");
        audio.loop = true;
        audio.volume = 1.0;
        audioRef.current = audio;
      }
      setRunning(true);
    }
  }

  function pause() {
    setRunning(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  function reset(newInitial: number) {
    setRunning(false);
    setSeconds(newInitial);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  return { seconds, running, start, pause, reset };
}

function TimerCard({
  title,
  defaultMinutes,
  allowName = false,
  compact = false,
}: {
  title: string;
  defaultMinutes: number;
  allowName?: boolean;
  compact?: boolean;
}) {
  const [minutes, setMinutes] = useState(defaultMinutes);
  const [name, setName] = useState("");

  const initialSeconds = minutes * 60;
  const timer = useCountdown(initialSeconds);

  const mins = Math.floor(timer.seconds / 60);
  const secs = timer.seconds % 60;

  return (
    <div className="rounded-lg border border-malt/20 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900 flex flex-col">
      
      {/* FIX: Uniform title height */}
      <h2 className="text-xl font-semibold text-malt-dark dark:text-foreground mb-2 min-h-[48px] flex items-center">
        {title}
      </h2>

      {allowName && (
        <div className="mb-3">
          <label className="text-sm text-malt-dark dark:text-zinc-300">
            Hop Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Citra, Mosaic, Simcoe"
            className="mt-1 w-full rounded border border-malt/20 bg-white p-2 dark:bg-zinc-800"
          />
        </div>
      )}

      <div className="mb-3">
        <label className="text-sm text-malt-dark dark:text-zinc-300">
          Duration (minutes)
        </label>
        <input
          type="number"
          min={1}
          value={minutes}
          onChange={(e) => {
            const newMin = parseInt(e.target.value) || 1;
            setMinutes(newMin);
            timer.reset(newMin * 60);
          }}
          className="mt-1 w-full rounded border border-malt/20 bg-white p-2 dark:bg-zinc-800"
        />
      </div>

      <p className="text-3xl font-mono text-malt-dark dark:text-foreground mb-4">
        {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </p>

      {/* BUTTONS */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={timer.start}
          className={
            compact
              ? "px-2 py-1 rounded bg-amber text-white text-xs font-medium hover:bg-malt-dark"
              : "px-3 py-1 rounded-md bg-amber text-white font-medium hover:bg-malt-dark"
          }
        >
          Start
        </button>

        <button
          onClick={timer.pause}
          className={
            compact
              ? "px-2 py-1 rounded bg-malt/40 text-malt-dark text-xs font-medium hover:bg-malt/60 dark:bg-zinc-700 dark:text-zinc-200"
              : "px-3 py-1 rounded-md bg-malt/40 text-malt-dark font-medium hover:bg-malt/60 dark:bg-zinc-700 dark:text-zinc-200"
          }
        >
          Pause
        </button>

        <button
          onClick={() => timer.reset(minutes * 60)}
          className={
            compact
              ? "px-2 py-1 rounded bg-red-600 text-white text-xs font-medium hover:bg-red-700"
              : "px-3 py-1 rounded-md bg-red-600 text-white font-medium hover:bg-red-700"
          }
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
        Independent timers for each stage of your brew day. Set custom durations
        and run each timer separately.
      </p>

      {/* MAIN TIMERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TimerCard title="Mash Timer" defaultMinutes={60} />
        <TimerCard title="Boil Timer" defaultMinutes={60} />
        <TimerCard title="Whirlpool Timer" defaultMinutes={20} />
        <TimerCard title="Chill Timer" defaultMinutes={15} />
      </div>

      <h2 className="text-2xl font-bold text-malt-dark dark:text-foreground mt-8">
        Hop Additions
      </h2>

      <p className="mt-2 text-malt/80 dark:text-zinc-400">
        Add hop names and set custom durations for each addition.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TimerCard title="Hop Addition A" defaultMinutes={60} allowName />
        <TimerCard title="Hop Addition B" defaultMinutes={30} allowName />
        <TimerCard title="Hop Addition C" defaultMinutes={10} allowName />
      </div>

      <h2 className="text-2xl font-bold text-malt-dark dark:text-foreground mt-10">
        Fun Timers
      </h2>

      <p className="mt-2 text-malt/80 dark:text-zinc-400">
        Because brew day should be fun too.
      </p>

      {/* FUN TIMERS — compact + aligned */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <TimerCard title="Time Till Next Beer" defaultMinutes={15} compact />
        <TimerCard
          title="Time Until You Buy More Beer Gear"
          defaultMinutes={45}
          compact
        />
        <TimerCard
          title="Time Until You Realize You Forgot a Step"
          defaultMinutes={20}
          compact
        />
        <TimerCard
          title="Time to Question Your Life Choices"
          defaultMinutes={5}
          compact
        />
      </div>
    </div>
  );
}
