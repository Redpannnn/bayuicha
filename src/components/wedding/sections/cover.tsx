"use client";

import * as React from "react";

export function CoverSection({ onOpen }: { onOpen: () => void }) {
  // Guest name — di-resolve dari URL ?to=<code|name> (link personal tamu).
  //   • ?to=budi      → lookup ke DB /api/guests/lookup → "Budi Santoso" (jika terdaftar)
  //   • ?to=Tamu+Undangan → tampil literal
  //   • tanpa param   → "Tamu Undangan"
  const [guestName, setGuestName] = React.useState("Tamu Undangan");

  React.useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("to") ?? "";
    const decoded = decodeURIComponent(raw.replace(/\+/g, " ")).trim();
    if (!decoded) return;
    let cancelled = false;
    fetch(`/api/guests/lookup?code=${encodeURIComponent(decoded)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setGuestName(data?.name ?? decoded);
      })
      .catch(() => {
        if (!cancelled) setGuestName(decoded);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="cover"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-5 py-8"
      style={{
        backgroundImage: "url('/images/cover-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* main content */}
      <div className="z-10 flex w-full max-w-md flex-col items-center justify-center">
        {/* guest greeting */}
        <p className="z-10 font-hand text-lg text-navy">
          Kepada Yth. Bapak/Ibu/Saudara/i
        </p>
        <p className="z-10 mb-4 font-hand text-2xl font-bold text-maroon">
          {guestName}
        </p>

        {/* framed couple — ornate frame on top of couple photo (frame ~30% bigger) */}
        <div className="relative mx-auto mb-5 h-[468px] w-[312px] animate-fade-in">
          {/* soft cream oval backdrop so the couple sits nicely in the opening */}
          <div
            className="absolute z-0 rounded-[48%] bg-cream/40"
            style={{ inset: "13% 11% 18% 11%" }}
          />
          {/* couple photo — cropped to character, contained & centered (15% smaller) */}
          <div
            className="absolute z-10 flex items-center justify-center overflow-hidden rounded-[48%]"
            style={{ inset: "13% 11% 18% 11%" }}
          >
            <img
              src="/images/cover-couple-cropped.png"
              alt="Potret Bayu & Icha"
              className="h-[85%] w-[85%] object-contain"
            />
          </div>
          {/* ornate pink oval frame on top */}
          <img
            src="/images/cover-frame.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 h-full w-full object-contain"
          />
        </div>

        {/* names */}
        <h1 className="text-center font-display text-5xl leading-none text-maroon drop-shadow-sm sm:text-6xl">
          Bayu <span className="text-navy">&amp;</span> Icha
        </h1>

        {/* date */}
        <p className="mt-2 text-center font-hand text-2xl tracking-[0.2em] text-maroon">
          07.12.2026
        </p>

        {/* open button */}
        <button
          onClick={onOpen}
          className="mt-5 rounded-full bg-navy px-8 py-3 font-hand text-xl text-cream shadow-md transition hover:scale-105 hover:bg-[#262b52] active:scale-95"
        >
          Buka undangan
        </button>
      </div>
    </section>
  );
}
