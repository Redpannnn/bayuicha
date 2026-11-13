"use client";

import * as React from "react";
import {
  HangingMandala,
  OrnateFrame,
  WatercolorFloral,
} from "../decorations";

export function InvitationSection() {
  return (
    <section
      id="invitation"
      className="relative w-full overflow-hidden bg-cream px-5 py-16"
    >
      {/* side watercolor florals */}
      <div className="pointer-events-none absolute left-0 top-1/4 z-0 w-32 opacity-90">
        <WatercolorFloral variant="left" className="h-auto w-full" />
      </div>
      <div className="pointer-events-none absolute right-0 top-1/3 z-0 w-32 opacity-90">
        <WatercolorFloral variant="right" className="h-auto w-full" />
      </div>

      {/* top hanging ornament (left only) */}
      <div className="pointer-events-none absolute -top-1 left-2 z-10">
        <HangingMandala color="#e88a7d" size={60} />
      </div>

      <div className="relative z-10 mx-auto max-w-md">
        {/* intro line */}
        <p className="mb-8 text-center font-hand text-xl leading-snug text-maroon">
          Kami mengundang kamu untuk datang dalam acara pernikahan kami.
        </p>

        {/* couple frames */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center">
            <OrnateFrame className="h-[230px] w-full">
              { }
              <img
                src="/images/groom.png"
                alt="Bayu"
                className="h-full w-full object-cover"
              />
            </OrnateFrame>
            <h3 className="mt-3 font-hand text-3xl font-bold text-maroon">Bayu</h3>
            <p className="mt-1 text-center font-hand text-base leading-tight text-navy">
              <span className="font-bold">Bayu Pamungkas, S.HUT</span>
              <br />
              <br />
              Putra dari
              <br />
              <span className="whitespace-nowrap text-[clamp(11px,3.6vw,16px)]">
                bapak Warsito dan ibu Ginah
              </span>
            </p>
          </div>

          <div className="flex flex-col items-center">
            <OrnateFrame className="h-[230px] w-full" color="#c7a3c4">
              { }
              <img
                src="/images/bride.png"
                alt="Icha"
                className="h-full w-full object-cover"
              />
            </OrnateFrame>
            <h3 className="mt-3 font-hand text-3xl font-bold text-maroon">Icha</h3>
            <p className="mt-1 text-center font-hand text-base leading-tight text-navy">
              <span className="font-bold">Aisyah Putri, S.HUT</span>
              <br />
              <br />
              Putri dari
              <br />
              <span className="whitespace-nowrap text-[clamp(11px,3.6vw,16px)]">
                bapak Kasaruddin dan ibu Sattia
              </span>
            </p>
          </div>
        </div>

        {/* ampersand between names (decorative) */}
        <div className="pointer-events-none -mt-1 mb-2 text-center font-display text-4xl text-maroon">
          &amp;
        </div>
      </div>
    </section>
  );
}
