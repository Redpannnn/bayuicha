"use client";

import * as React from "react";
import { CalendarDays, Clock3, MapPin } from "lucide-react";
import {
  HangingMandala,
  HangingFlower,
  WeddingRings,
} from "../decorations";

type EventDetail = {
  name: string;
  dayDate: string;
  time: string;
  location: string;
};

const EVENTS: EventDetail[] = [
  {
    name: "Akad",
    dayDate: "Senin, 7 Desember 2026",
    time: "Pukul 10.00 - Selesai",
    location: "DEPT. TEKNIK PT. LTT",
  },
  {
    name: "Resepsi",
    dayDate: "Senin, 7 Desember 2026",
    time: "Pukul 19.00 - Selesai",
    location: "DEPT. TEKNIK PT. LTT",
  },
];

function EventCard({ event }: { event: EventDetail }) {
  return (
    <div className="relative rounded-3xl border-2 border-dusty-pink bg-white/70 px-5 py-6 shadow-md">
      {/* card top accent */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-0 h-1.5 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-maroon"
      />
      <h3 className="font-hand text-4xl font-bold text-maroon">
        {event.name}
      </h3>

      <div className="mt-4 flex flex-col items-center gap-2.5 text-navy">
        <p className="flex items-center gap-2 font-hand text-xl leading-tight">
          <CalendarDays className="h-5 w-5 flex-shrink-0 text-coral" aria-hidden="true" />
          <span>{event.dayDate}</span>
        </p>
        <p className="flex items-center gap-2 font-hand text-xl leading-tight">
          <Clock3 className="h-5 w-5 flex-shrink-0 text-coral" aria-hidden="true" />
          <span>{event.time}</span>
        </p>
        <p className="mt-1 flex flex-col items-center gap-1">
          <span className="flex items-center gap-2 font-hand text-xl leading-tight">
            <MapPin className="h-5 w-5 flex-shrink-0 text-coral" aria-hidden="true" />
            <span>Lokasi:</span>
          </span>
          <span className="font-hand text-2xl font-bold leading-snug text-maroon">
            {event.location}
          </span>
          <a
            href="https://maps.app.goo.gl/CyYcCDJZAek4gEQbA"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-maroon px-6 py-2.5 font-hand text-xl font-semibold text-cream shadow-md transition-all hover:bg-maroon-deep hover:shadow-lg active:scale-95"
          >
            <MapPin className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <span>Buka Lokasi</span>
          </a>
        </p>
      </div>
    </div>
  );
}

export function EventDetailsSection() {
  return (
    <section
      id="detail-acara"
      className="relative w-full overflow-hidden bg-cream px-5 py-16"
    >
      {/* hanging ornaments top corners */}
      <div className="pointer-events-none absolute -top-1 left-1 z-10">
        <HangingMandala color="#e3b23c" size={60} />
      </div>
      <div className="pointer-events-none absolute -top-1 right-1 z-10">
        <HangingFlower size={56} />
      </div>

      <div className="relative z-10 mx-auto max-w-md text-center">
        <p className="font-hand text-xl text-navy">
          Dengan memohon rahmat dan ridha Allah SWT
        </p>
        <h2 className="mt-1 font-hand text-5xl font-bold text-maroon">
          Detail Acara
        </h2>

        {/* rings ornament */}
        <div className="mt-5 flex justify-center">
          <WeddingRings className="h-14 w-20" />
        </div>

        {/* akad & resepsi cards */}
        <div className="mt-6 flex flex-col items-stretch gap-6">
          {EVENTS.map((event) => (
            <EventCard key={event.name} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
