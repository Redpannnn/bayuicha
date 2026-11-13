"use client";

import * as React from "react";
import {
  HangingMandala,
  FlourishDivider,
  FlowerBorder,
  FlowerCluster,
} from "../decorations";

const WA_NUMBER = "085183256967";
const IG_URL = "https://www.instagram.com/memoraainvitation/";
const TIKTOK_URL = "https://www.tiktok.com/@memoraainvtitation._.";

/** Link WhatsApp langsung ke nomor (format internasional tanpa +). */
const WA_LINK = `https://wa.me/62${WA_NUMBER.replace(/^0/, "")}`;

type SocialLink = {
  href: string;
  icon: string;
  alt: string;
  label: string;
  /** ukuran tampilan ikon (h & w dalam px) */
  size: number;
};

const SOCIALS: SocialLink[] = [
  { href: WA_LINK, icon: "/images/socmed-wa.png", alt: "WhatsApp MemoraA", label: "WhatsApp", size: 52 },
  { href: IG_URL, icon: "/images/socmed-ig.png", alt: "Instagram MemoraA", label: "Instagram", size: 40 },
  { href: TIKTOK_URL, icon: "/images/socmed-tiktok.png", alt: "TikTok MemoraA", label: "TikTok", size: 34 },
];

export function ClosingSection() {
  return (
    <section
      id="penutup"
      className="relative w-full overflow-hidden bg-cream px-5 py-16"
    >
      {/* hanging ornaments */}
      <div className="pointer-events-none absolute -top-1 left-3 z-10">
        <HangingMandala color="#e88a7d" size={64} />
      </div>
      <div className="pointer-events-none absolute -top-1 right-3 z-10">
        <HangingMandala color="#e3b23c" size={64} />
      </div>

      {/* corner flowers */}
      <div className="pointer-events-none absolute left-2 top-24 z-10 opacity-80">
        <FlowerCluster size={32} />
      </div>

      <div className="relative z-10 mx-auto max-w-md text-center">
        {/* thank you message */}
        <p className="font-hand text-2xl leading-snug text-maroon">
          Terima kasih atas kehadiran dan doa restu Anda.
        </p>
        <p className="mt-4 font-hand text-lg leading-snug text-navy">
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i
          berkenan hadir untuk memberikan doa restu kepada kedua mempelai.
        </p>

        <p className="mt-6 font-hand text-lg italic text-navy">
          Wassalamu&rsquo;alaikum Warahmatullahi Wabarakatuh
        </p>

        {/* closing divider */}
        <div className="my-8">
          <FlourishDivider className="h-10 w-full" />
        </div>

        {/* who invites */}
        <p className="font-hand text-xl text-navy">Kami yang berbahagia,</p>
        <p className="mt-3 font-display text-4xl text-maroon">
          Bayu <span className="text-navy">&amp;</span> Icha
        </p>
        <p className="mt-2 font-hand text-lg text-navy">
          Beserta kedua keluarga
        </p>

        {/* footer credit */}
        <p className="mt-10 font-hand text-sm text-navy/60">
          Undangan Pernikahan Digital
        </p>
      </div>

      {/* flower border at bottom */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-16">
        <FlowerBorder className="h-full w-full" />
      </div>
    </section>
  );
}
