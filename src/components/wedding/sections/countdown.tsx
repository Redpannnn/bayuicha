"use client";

import * as React from "react";
import {
  HangingMandala,
  HangingFlower,
  FlourishDivider,
} from "../decorations";

function useCountdown(target: number) {
  const [now, setNow] = React.useState<number>(() => Date.now());
  React.useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

export function CountdownSection() {
  // Resepsi: 7 Desember 2026, 10.00 WIB (Asia/Jakarta = UTC+7)
  const target = React.useMemo(
    () => new Date("2026-12-07T10:00:00+07:00").getTime(),
    []
  );
  const { days, hours, minutes, seconds } = useCountdown(target);

  const units = [
    { label: "Hari", value: days },
    { label: "Jam", value: hours },
    { label: "Menit", value: minutes },
    { label: "Detik", value: seconds },
  ];

  return (
    <section
      id="countdown"
      className="relative w-full overflow-hidden bg-cream px-5 py-16"
    >
      {/* hanging ornaments */}
      <div className="pointer-events-none absolute -top-1 left-3 z-10">
        <HangingMandala color="#e88a7d" size={64} />
      </div>
      <div className="pointer-events-none absolute -top-1 right-3 z-10">
        <HangingFlower size={56} />
      </div>

      <div className="relative z-10 mx-auto max-w-md text-center">
        {/* countdown heading */}
        <p className="font-hand text-xl text-navy">Menuju hari bahagia</p>
        <h2 className="mt-1 font-hand text-3xl font-bold text-maroon">
          Counting the days
        </h2>
        <p className="mt-2 font-hand text-lg text-navy/90">
          Resepsi — Senin, 7 Desember 2026
        </p>

        {/* countdown timer */}
        <div className="mx-auto mt-6 grid max-w-sm grid-cols-4 gap-2">
          {units.map((u) => (
            <div
              key={u.label}
              className="flex flex-col items-center justify-center rounded-2xl bg-maroon py-3 text-cream shadow-md"
            >
              <span className="font-hand text-3xl font-bold leading-none">
                {String(u.value).padStart(2, "0")}
              </span>
              <span className="mt-1 font-hand text-sm text-cream/90">
                {u.label}
              </span>
            </div>
          ))}
        </div>

        {/* divider */}
        <div className="mt-8">
          <FlourishDivider className="h-10 w-full" />
        </div>
      </div>
    </section>
  );
}
