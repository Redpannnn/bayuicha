"use client";

import * as React from "react";
import { Play, Pause, SkipBack, SkipForward, Repeat, Volume2, VolumeX } from "lucide-react";
import { getWeddingAudio } from "@/lib/wedding-audio";

const TRACK_TITLE = "Kasih Putih";
const TRACK_ARTIST = "Glenn Fredly";

/**
 * WeddingMusicPlayer
 * UI pemutar lagu pernikahan. Audio-nya sendiri adalah singleton dari
 * @/lib/wedding-audio (biar bisa di-autoplay dari tombol "Buka undangan"
 * dan tetap jalan walau UI re-render).
 *
 * Kontrol: loop, restart, play/pause, mute + seek bar.
 */
export function WeddingMusicPlayer() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0); // 0..1
  const [loop, setLoop] = React.useState(true);
  const [muted, setMuted] = React.useState(false);
  const [duration, setDuration] = React.useState(0); // detik, dari metadata

  // Sinkron state awal + pasang listeners ke audio singleton.
  React.useEffect(() => {
    const audio = getWeddingAudio();

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };
    const onTimeUpdate = () => {
      if (audio.duration > 0) setProgress(audio.currentTime / audio.duration);
    };
    const onLoadedMetadata = () =>
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);

    // state awal (audio mungkin sudah diputar dari "Buka undangan")
    setIsPlaying(!audio.paused);
    setLoop(audio.loop);
    setMuted(audio.muted);
    onLoadedMetadata();
    if (audio.duration > 0) setProgress(audio.currentTime / audio.duration);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, []);

  const togglePlay = () => {
    const audio = getWeddingAudio();
    if (audio.paused) {
      void audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  };

  const restart = () => {
    const audio = getWeddingAudio();
    audio.currentTime = 0;
    setProgress(0);
  };

  const seek = (v: number) => {
    const audio = getWeddingAudio();
    if (!duration) return;
    audio.currentTime = v * duration;
    setProgress(v);
  };

  const toggleLoop = () => {
    const audio = getWeddingAudio();
    audio.loop = !audio.loop;
    setLoop(audio.loop);
  };

  const toggleMute = () => {
    const audio = getWeddingAudio();
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
          onClick={toggleLoop}
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
