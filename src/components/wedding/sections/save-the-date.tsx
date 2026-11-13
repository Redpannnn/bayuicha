"use client";

import * as React from "react";
import { HangingMandala, ScallopedCard } from "../decorations";
import { WeddingMusicPlayer } from "../music-player";

export function SaveTheDateSection() {
  return (
    <section
      id="save-the-date"
      className="relative w-full overflow-hidden bg-cream px-5 py-16"
    >
      {/* hanging ornaments top corners */}
      <div className="pointer-events-none absolute -top-1 left-1 z-10">
        <HangingMandala color="#e88a7d" size={72} />
      </div>
      <div className="pointer-events-none absolute -top-1 right-1 z-10">
        <HangingMandala color="#e3b23c" size={72} />
      </div>

      {/* main scalloped card */}
      <div className="mx-auto mt-6 max-w-md px-4">
        <ScallopedCard className="min-h-[520px]">
          <h2 className="font-hand text-3xl font-bold tracking-[0.15em] text-cream">
            SAVE THE DATE!
          </h2>

          {/* couple illustration (colored, transparent background) */}
          <div className="mx-auto my-3 flex h-44 w-44 items-center justify-center">
            <img
              src="/images/couple-savethedate.png"
              alt="Ilustrasi Bayu dan Icha"
              className="h-full w-full object-contain"
            />
          </div>

          <h3 className="font-hand text-4xl font-bold text-cream">
            Bayu dan Icha
          </h3>

          <p className="mx-auto mt-4 max-w-[260px] text-center font-hand text-lg leading-snug text-cream/95">
            &ldquo;Di antara tanda-tanda (kebesaran)-Nya ialah bahwa Dia
            menciptakan pasangan-pasangan untukmu dari (jenis) dirimu sendiri
            agar kamu merasa tenteram kepadanya. Dia menjadikan di antaramu rasa
            cinta dan kasih sayang. Sesungguhnya pada yang demikian itu
            benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang
            berpikir.&rdquo;
          </p>

          <p className="mt-1.5 font-hand text-base text-cream/80">
            (Surah Ar-Rum:21)
          </p>

          {/* music hint */}
          <p className="mt-5 flex items-center justify-center gap-1 font-hand text-lg text-cream">
            <span>Ketuk tombol</span>
            <span aria-hidden>▶</span>
            <span>untuk memutar musik!</span>
          </p>

          {/* music player */}
          <div className="mt-3">
            <WeddingMusicPlayer />
          </div>
        </ScallopedCard>
      </div>
    </section>
  );
}
