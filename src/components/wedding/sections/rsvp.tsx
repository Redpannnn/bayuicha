"use client";

import * as React from "react";
import { Loader2, MailOpen, Send, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  HangingMandala,
  HangingFlower,
  FlourishDivider,
  FlowerCluster,
} from "../decorations";

type RsvpEntry = {
  id: string;
  name: string;
  attendance: string;
  count: number;
  message: string | null;
  createdAt: string;
};

type Attendance = "hadir" | "tidak" | "ragu";

const ATTENDANCE_LABELS: Record<Attendance, string> = {
  hadir: "Hadir",
  tidak: "Tidak Hadir",
  ragu: "Masih Ragu",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function RsvpSection() {
  const { toast } = useToast();
  const [entries, setEntries] = React.useState<RsvpEntry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const [name, setName] = React.useState("");
  const [nameLocked, setNameLocked] = React.useState(false);
  const [attendance, setAttendance] = React.useState<Attendance>("hadir");
  const [count, setCount] = React.useState("1");
  const [message, setMessage] = React.useState("");

  // Prefill nama tamu dari link personal (?to=<code>) — sama seperti cover.
  React.useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("to") ?? "";
    const decoded = decodeURIComponent(raw.replace(/\+/g, " ")).trim();
    if (!decoded) return;
    let cancelled = false;
    fetch(`/api/guests/lookup?code=${encodeURIComponent(decoded)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const resolved = data?.name ?? decoded;
        setName(resolved);
        setNameLocked(Boolean(data?.name));
      })
      .catch(() => {
        if (!cancelled) setName(decoded);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const loadEntries = React.useCallback(async () => {
    try {
      const res = await fetch("/api/rsvp", { cache: "no-store" });
      if (!res.ok) throw new Error("gagal memuat");
      const data = await res.json();
      setEntries(data.rows ?? []);
    } catch {
      // keep list silent-empty on failure
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: "Nama belum diisi",
        description: "Mohon isi nama Anda terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          attendance,
          count: Number(count),
          message: message.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "Gagal mengirim.");
      }

      toast({
        title: "Terima kasih!",
        description: "Konfirmasi kehadiran Anda sudah kami terima.",
      });
      setMessage("");
      setSubmitted(true);
      await loadEntries();
    } catch (err) {
      toast({
        title: "Gagal mengirim",
        description:
          err instanceof Error ? err.message : "Silakan coba lagi nanti.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="rsvp"
      className="relative w-full overflow-hidden bg-cream px-5 py-16"
    >
      {/* hanging ornaments */}
      <div className="pointer-events-none absolute -top-1 left-1 z-10">
        <HangingMandala color="#e3b23c" size={60} />
      </div>
      <div className="pointer-events-none absolute -top-1 right-1 z-10">
        <HangingFlower size={56} />
      </div>
      {/* corner flowers */}
      <div className="pointer-events-none absolute right-2 top-24 z-10 opacity-80">
        <FlowerCluster size={32} />
      </div>

      <div className="relative z-10 mx-auto max-w-md text-center">
        <h2 className="font-hand text-7xl font-bold text-maroon">RSVP</h2>
        <p className="mt-4 font-hand text-lg leading-snug text-navy">
          Mohon konfirmasi kehadiran dan kirimkan ucapan serta doa Anda
          untuk kedua mempelai.
        </p>

        {/* form card */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-3xl border-2 border-dusty-pink bg-white/70 p-5 text-left shadow-md"
        >
          {/* name */}
          <label
            htmlFor="rsvp-name"
            className="font-hand text-xl font-bold text-maroon"
          >
            Nama
          </label>
          <input
            id="rsvp-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            readOnly={nameLocked}
            placeholder="Masukkan nama Anda"
            maxLength={100}
            className="mt-1.5 w-full rounded-xl border border-border bg-cream/70 px-4 py-2.5 font-hand text-lg text-navy placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-maroon/50 read-only:opacity-90"
          />
          {nameLocked && (
            <p className="mt-1 font-hand text-sm text-olive">
              Nama terisi otomatis dari link undangan Anda.
            </p>
          )}

          {/* attendance */}
          <p className="mt-4 font-hand text-xl font-bold text-maroon">
            Kehadiran
          </p>
          <div
            className="mt-1.5 grid grid-cols-3 gap-2"
            role="radiogroup"
            aria-label="Konfirmasi kehadiran"
          >
            {(
              [
                { value: "hadir", activeClass: "border-olive bg-olive" },
                { value: "tidak", activeClass: "border-coral bg-coral" },
                { value: "ragu", activeClass: "border-mustard bg-mustard" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={attendance === opt.value}
                onClick={() => setAttendance(opt.value)}
                className={`rounded-xl border-2 px-2 py-2.5 font-hand text-lg transition active:scale-95 ${
                  attendance === opt.value
                    ? `${opt.activeClass} text-cream shadow-sm`
                    : "border-dusty-pink bg-cream/60 text-navy hover:border-maroon"
                }`}
              >
                {ATTENDANCE_LABELS[opt.value]}
              </button>
            ))}
          </div>

          {/* guests (only when attending) */}
          {attendance === "hadir" && (
            <div className="mt-4">
              <label
                htmlFor="rsvp-count"
                className="flex items-center gap-1.5 font-hand text-xl font-bold text-maroon"
              >
                <Users className="h-5 w-5" aria-hidden="true" />
                Jumlah Tamu
              </label>
              <select
                id="rsvp-count"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-cream/70 px-4 py-2.5 font-hand text-lg text-navy focus:outline-none focus:ring-2 focus:ring-maroon/50"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>
                    {n} orang
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* message */}
          <label
            htmlFor="rsvp-message"
            className="mt-4 block font-hand text-xl font-bold text-maroon"
          >
            Ucapan &amp; Doa
          </label>
          <textarea
            id="rsvp-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tuliskan ucapan dan doa terbaik Anda..."
            rows={3}
            maxLength={500}
            className="mt-1.5 w-full resize-none rounded-xl border border-border bg-cream/70 px-4 py-2.5 font-hand text-lg text-navy placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-maroon/50"
          />

          {/* submit */}
          <button
            type="submit"
            disabled={submitting}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-maroon px-6 py-3 font-hand text-xl text-cream shadow-md transition hover:bg-maroon-deep active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                Mengirim...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" aria-hidden="true" />
                Kirim Konfirmasi
              </>
            )}
          </button>

          {submitted && (
            <p className="mt-3 text-center font-hand text-base text-olive">
              Terima kasih, konfirmasi Anda telah terkirim!
            </p>
          )}
        </form>

        {/* guestbook */}
        <div className="mt-10">
          <p className="flex items-center justify-center gap-2 font-hand text-3xl font-bold text-maroon">
            <MailOpen className="h-6 w-6" aria-hidden="true" />
            Ucapan &amp; Doa
          </p>

          {loading ? (
            <div className="mt-5 flex justify-center">
              <Loader2
                className="h-6 w-6 animate-spin text-maroon"
                aria-label="Memuat ucapan"
              />
            </div>
          ) : entries.length === 0 ? (
            <p className="mt-5 font-hand text-lg text-navy/70">
              Belum ada ucapan. Jadilah yang pertama!
            </p>
          ) : (
            <ul className="wedding-scrollbar mt-5 max-h-96 space-y-3 overflow-y-auto pr-2 text-left">
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  className="rounded-2xl border border-border bg-white/70 px-4 py-3 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-hand text-xl font-bold text-navy">
                      {entry.name}
                    </p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-hand text-sm ${
                        entry.attendance === "hadir"
                          ? "bg-olive/15 text-olive"
                          : entry.attendance === "tidak"
                            ? "bg-coral/15 text-coral"
                            : "bg-mustard/20 text-[#8a6a14]"
                      }`}
                    >
                      {entry.attendance === "hadir"
                        ? `Hadir${entry.count > 0 ? ` (${entry.count} tamu)` : ""}`
                        : ATTENDANCE_LABELS[
                            (entry.attendance as Attendance) ?? "ragu"
                          ]}
                    </span>
                  </div>
                  {entry.message && (
                    <p className="mt-1 font-hand text-lg leading-snug text-maroon">
                      &ldquo;{entry.message}&rdquo;
                    </p>
                  )}
                  <p className="mt-1 font-hand text-sm text-navy/50">
                    {formatDate(entry.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* divider */}
        <div className="mt-8">
          <FlourishDivider className="h-10 w-full" />
        </div>
      </div>
    </section>
  );
}
