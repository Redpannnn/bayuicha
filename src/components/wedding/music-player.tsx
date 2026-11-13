"use client";

import * as React from "react";
import { Play, Pause, SkipBack, SkipForward, Repeat, Volume2, VolumeX } from "lucide-react";

/** Lagu background — file statis di public/music. */
const TRACK_SRC = "/music/the-way-you-look-at-me.mp3";
const TRACK_TITLE = "The Way You Look At Me";
const TRACK_ARTIST = "Nyoman Paul, Andi Rianto";

/**
 * WeddingMusicPlayer
 * Memutar lagu pernikahan (MP3) pakai HTML5 <audio>.
 * UI sama seperti sebelumnya: album art, judul, seek bar,
 * loop, restart, play/pause, dan mute.
 */
export function WeddingMusicPlayer() {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0); // 0..1
  const [loop, setLoop] = React.useState(true);
  const [muted, setMuted] = React.useState(false);
  const [duration, setDuration] = React.useState(0); // detik, dari metadata

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  };

  const restart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setProgress(0);
  };

  const seek = (v: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    audio.currentTime = v * duration;
    setProgress(v);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  const fmt = (sec: number) => {
    if (!Number.isFinite(sec) || sec <= 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const current = progress * duration;

  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl bg-[#2f3465] p-3 text-cream shadow-lg">
      <audio
        ref={audioRef}
        src={TRACK_SRC}
        preload="metadata"
        loop={loop}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          setProgress(0);
        }}
        onTimeUpdate={(e) => {
          const a = e.currentTarget;
          if (a.duration > 0) setProgress(a.currentTime / a.duration);
        }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
      />
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
          <div className="flex items-center justify-between gap-2 text-xs font-hand">
            <span className="truncate text-cream/90" title={TRACK_ARTIST}>
              {TRACK_TITLE}{" "}
              <span className="text-cream/60">— {TRACK_ARTIST}</span>
            </span>
            <span className="flex-shrink-0 text-cream/70">
              {fmt(current)} / {fmt(duration)}
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
              onChange={(e) => seek(Number(e.target.value))}
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
          aria-pressed={loop}
          className={`transition hover:text-mustard ${loop ? "text-mustard" : "text-cream/60"}`}
        >
          <Repeat className="h-3.5 w-3.5" />
        </button>
        <button onClick={restart} aria-label="Ulangi dari awal" className="transition hover:text-mustard">
          <SkipBack className="h-4 w-4" />
        </button>
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-[#2f3465] shadow-md transition hover:scale-105"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
        </button>
        <button onClick={restart} aria-label="Ulangi dari awal" className="transition hover:text-mustard">
          <SkipForward className="h-4 w-4" />
        </button>
        <button
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          aria-pressed={muted}
          className={`transition hover:text-mustard ${muted ? "text-cream/60" : "text-mustard"}`}
        >
          {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}
