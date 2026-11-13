"use client";

import * as React from "react";
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle } from "lucide-react";

/** gentle melody: pairs of [freq, beats] — a calm Cmaj arpeggio waltz */
const MELODY: number[][] = [
  [523.25, 1], [659.25, 1], [783.99, 1],
  [659.25, 1], [523.25, 1], [440.0, 2],
  [493.88, 1], [587.33, 1], [659.25, 1],
  [587.33, 1], [493.88, 1], [392.0, 2],
  [523.25, 1], [659.25, 1], [783.99, 1],
  [880.0, 1], [783.99, 1], [659.25, 1],
  [587.33, 1], [523.25, 1], [493.88, 1],
  [440.0, 1], [392.0, 1], [523.25, 2],
];
const TEMPO = 84; // BPM
const BEAT_LEN = 60 / TEMPO;
const TOTAL_BEATS = MELODY.reduce((sum, n) => sum + n[1], 0);

/**
 * WeddingMusicPlayer
 * Uses the Web Audio API to synthesize a soft, looping ambient melody
 * so the player works fully offline without any external audio file.
 * Provides play/pause, seek bar, skip (restart), loop, and shuffle.
 */
export function WeddingMusicPlayer() {
  const audioRef = React.useRef<AudioContext | null>(null);
  const masterGainRef = React.useRef<GainNode | null>(null);
  const schedTimerRef = React.useRef<number | null>(null);
  const nextNoteTimeRef = React.useRef<number>(0);
  const stepRef = React.useRef<number>(0);
  const startTimeRef = React.useRef<number>(0);
  const pausedAtRef = React.useRef<number>(0);

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0); // 0..1
  const [loop, setLoop] = React.useState(true);
  const [shuffle, setShuffle] = React.useState(false);
  const [duration, setDuration] = React.useState(48); // seconds, one loop length

  // gentle melody: pairs of [freq, beats] — a calm Cmaj arpeggio waltz
  // (defined at module level: MELODY, TEMPO, BEAT_LEN, TOTAL_BEATS)

  const tempo = TEMPO; // BPM
  const beatLen = BEAT_LEN;
  const totalBeats = TOTAL_BEATS;

  // ensure audio context exists
  const ensureCtx = () => {
    if (!audioRef.current) {
      const Ctx =
        (window as unknown as { AudioContext: typeof AudioContext; webkitAudioContext?: typeof AudioContext })
          .AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      audioRef.current = ctx;
      const gain = ctx.createGain();
      gain.gain.value = 0.18;
      gain.connect(ctx.destination);
      masterGainRef.current = gain;
    }
    return audioRef.current;
  };

  // keep shuffle in a ref so scheduler reads latest value without re-subscribing
  const shuffleRef = React.useRef(shuffle);
  React.useEffect(() => {
    shuffleRef.current = shuffle;
  }, [shuffle]);

  const playNote = (ctx: AudioContext, freq: number, time: number, dur: number) => {
    const gain = masterGainRef.current!;
    // soft triangle pad + sine bell
    const osc1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    osc1.type = "triangle";
    osc1.frequency.value = freq;
    g1.gain.setValueAtTime(0, time);
    g1.gain.linearRampToValueAtTime(0.5, time + 0.02);
    g1.gain.exponentialRampToValueAtTime(0.001, time + dur * 0.95);
    osc1.connect(g1).connect(gain);
    osc1.start(time);
    osc1.stop(time + dur);

    const osc2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.value = freq * 2;
    g2.gain.setValueAtTime(0, time);
    g2.gain.linearRampToValueAtTime(0.12, time + 0.01);
    g2.gain.exponentialRampToValueAtTime(0.001, time + dur * 0.8);
    osc2.connect(g2).connect(gain);
    osc2.start(time);
    osc2.stop(time + dur);
  };

  const runScheduler = React.useCallback(() => {
    const ctx = audioRef.current;
    const gain = masterGainRef.current;
    if (!ctx || !gain) return;
    const lookahead = 0.2; // schedule 200ms ahead
    while (nextNoteTimeRef.current < ctx.currentTime + lookahead) {
      const m = MELODY;
      let idx = stepRef.current % m.length;
      if (shuffleRef.current && Math.random() > 0.6) {
        idx = Math.floor(Math.random() * m.length);
      }
      const [freq, beats] = m[idx];
      playNote(ctx, freq, nextNoteTimeRef.current, beats * beatLen);
      nextNoteTimeRef.current += beats * beatLen;
      stepRef.current += 1;
    }
  }, [beatLen]);

  const startPlayback = React.useCallback(() => {
    const ctx = ensureCtx();
    if (ctx.state === "suspended") void ctx.resume();
    startTimeRef.current = ctx.currentTime - pausedAtRef.current;
    nextNoteTimeRef.current = ctx.currentTime + 0.05;
    runScheduler();
    schedTimerRef.current = window.setInterval(runScheduler, 60);
    setIsPlaying(true);
  }, [runScheduler]);

  const stopPlayback = () => {
    if (schedTimerRef.current) {
      clearInterval(schedTimerRef.current);
      schedTimerRef.current = null;
    }
    const ctx = audioRef.current;
    if (ctx) pausedAtRef.current = ctx.currentTime - startTimeRef.current;
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) stopPlayback();
    else startPlayback();
  };

  const restart = () => {
    pausedAtRef.current = 0;
    stepRef.current = 0;
    if (isPlaying) {
      stopPlayback();
      setTimeout(startPlayback, 30);
    } else {
      setProgress(0);
    }
  };

  // progress ticker
  React.useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => {
      const ctx = audioRef.current;
      if (!ctx) return;
      const elapsed = ctx.currentTime - startTimeRef.current;
      const total = totalBeats * beatLen;
      const p = (elapsed % total) / total;
      setProgress(p);
      if (!loop && elapsed > total) {
        stopPlayback();
        setProgress(1);
      }
    }, 200);
    return () => clearInterval(id);
     
  }, [isPlaying, loop, totalBeats, beatLen]);

  React.useEffect(() => {
    return () => {
      if (schedTimerRef.current) clearInterval(schedTimerRef.current);
      if (audioRef.current) void audioRef.current.close();
    };
  }, []);

  const fmt = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const total = totalBeats * beatLen;
  const current = progress * total;

  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl bg-[#2f3465] p-3 text-cream shadow-lg">
      <div className="flex items-center gap-3">
        {/* album art */}
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-[#3a4170] ring-2 ring-cream/40">
          <img
            src="/images/couple-savethedate.png"
            alt="Album art"
            className="h-full w-full object-cover"
          />
        </div>
        {/* track info + seek */}
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs font-hand">
            <span className="text-cream/90">Our Wedding Song</span>
            <span className="text-cream/70">
              {fmt(current)} / {fmt(total)}
            </span>
          </div>
          <div className="mt-2">
            <input
              type="range"
              className="wedding-range"
              min={0}
              max={1}
              step={0.001}
              value={progress}
              onChange={(e) => {
                const v = Number(e.target.value);
                setProgress(v);
                pausedAtRef.current = v * total;
                if (isPlaying) {
                  stopPlayback();
                  setTimeout(startPlayback, 30);
                }
              }}
              aria-label="Seek"
              style={{
                background: `linear-gradient(to right, #a04050 ${progress * 100}%, rgba(253,248,240,0.25) ${progress * 100}%)`,
                borderRadius: 999,
                height: 4,
              }}
            />
          </div>
        </div>
      </div>
      {/* controls */}
      <div className="mt-2.5 flex items-center justify-center gap-4 text-cream">
        <button
          onClick={() => setLoop((v) => !v)}
          aria-label="Loop"
          className={`transition hover:text-mustard ${loop ? "text-mustard" : "text-cream/60"}`}
        >
          <Repeat className="h-3.5 w-3.5" />
        </button>
        <button onClick={restart} aria-label="Previous" className="transition hover:text-mustard">
          <SkipBack className="h-4 w-4" />
        </button>
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-[#2f3465] shadow-md transition hover:scale-105"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
        </button>
        <button onClick={restart} aria-label="Next" className="transition hover:text-mustard">
          <SkipForward className="h-4 w-4" />
        </button>
        <button
          onClick={() => setShuffle((v) => !v)}
          aria-label="Shuffle"
          className={`transition hover:text-mustard ${shuffle ? "text-mustard" : "text-cream/60"}`}
        >
          <Shuffle className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
