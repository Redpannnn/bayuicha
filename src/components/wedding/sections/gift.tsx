"use client";

import * as React from "react";
import { SeabankLogo } from "../decorations";

function useCopy() {
  const [copied, setCopied] = React.useState<string | null>(null);
  const copy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
  };
  return { copied, copy };
}

export function GiftSection() {
  const { copied, copy } = useCopy();

  const account = { id: "icha", name: "Icha", number: "901087216732" };

  return (
    <section
      id="gift"
      className="relative w-full overflow-hidden bg-cream px-5 py-16"
    >
      <div className="relative z-10 mx-auto mt-2 max-w-md text-center">
        <h2 className="text-center font-hand text-7xl font-bold text-maroon">Gift!</h2>

        <p className="mt-5 text-center font-hand text-lg leading-snug text-maroon">
          Kehadiran dan doa restu Anda merupakan hadiah terindah bagi kami.
          Namun, apabila Anda berkenan memberikan tanda kasih, dapat
          disampaikan melalui rekening yang telah kami sediakan.
        </p>

        {/* ornamental frame background with centered bank account */}
        <div className="relative mx-auto mt-8 w-full max-w-sm">
          {/* ornamental frame image as background */}
          <img
            src="/images/gift-border.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 h-full w-full object-contain"
          />
          {/* centered bank account content */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-3 px-6 py-14">
            <SeabankLogo className="h-9 w-28 flex-shrink-0" />
            <p className="font-hand text-3xl font-bold tracking-wider text-maroon">
              {account.number}
            </p>
            <p className="font-hand text-lg text-navy">
              a.n {account.name}
            </p>
            <button
              onClick={() => copy(account.number, account.id)}
              className="mt-1 rounded-full border-2 border-maroon bg-cream/80 px-5 py-1 font-hand text-base text-maroon transition hover:bg-maroon hover:text-cream active:scale-95"
            >
              {copied === account.id ? "Tersalin ✓" : "Salin nomor"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
