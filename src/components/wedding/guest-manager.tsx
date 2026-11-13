"use client";

import * as React from "react";
import {
  Copy,
  Check,
  Loader2,
  Plus,
  Trash2,
  Pencil,
  X,
  MessageCircle,
  Users,
  ArrowLeft,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Guest = {
  id: string;
  code: string;
  name: string;
  createdAt: string;
};

/** Template pesan WhatsApp yang di-copy per tamu. {name} & {link} di-replace. */
function buildWaMessage(name: string, link: string): string {
  return `Assalamualaikum Wr. Wb

Dengan memohon Rahmat dan Ridha Allah SWT, tanpa mengurangi rasa hormat, melalui media sosial ini, kami *Bayu & Icha* mengundang Bapak/Ibu/Saudara/i ${name} untuk berkenan hadir di acara pernikahan kami.

Detail Acara:
${link}

Merupakan suatu kehormatan dan kebahagiaan jika Anda bersedia hadir dan turut memberikan doa restu untuk kami.

Terima kasih kami sampaikan Bapak/Ibu/Saudara/i ${name}.

Wassalamualaikum Wr. Wb`;
}

export default function GuestManager() {
  const { toast } = useToast();
  const [guests, setGuests] = React.useState<Guest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState("");

  const [name, setName] = React.useState("");
  const [code, setCode] = React.useState("");
  const [adding, setAdding] = React.useState(false);

  const [bulkText, setBulkText] = React.useState("");
  const [bulkAdding, setBulkAdding] = React.useState(false);

  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editName, setEditName] = React.useState("");
  const [editSaving, setEditSaving] = React.useState(false);

  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "";

  const fetchGuests = React.useCallback(async () => {
    setFetchError("");
    try {
      const res = await fetch("/api/guests", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (data?.ok && Array.isArray(data.rows)) {
        setGuests(data.rows);
      } else {
        setFetchError(data?.error || "Gagal memuat daftar tamu.");
      }
    } catch {
      setFetchError("Gagal terhubung ke server. Cek koneksi/database.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  const copyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      toast({
        title: "Gagal menyalin",
        description: "Browser mungkin tidak mengizinkan akses clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: "Nama belum diisi",
        description: "Mohon isi nama tamu terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          code: code.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "Gagal menambah tamu.");
      }
      toast({
        title: "Tamu ditambahkan",
        description: `${data.guest.name} (kode: ${data.guest.code})`,
      });
      setName("");
      setCode("");
      await fetchGuests();
    } catch (err) {
      toast({
        title: "Gagal menambah tamu",
        description:
          err instanceof Error ? err.message : "Silakan coba lagi nanti.",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  const handleBulkAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const lines = bulkText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) {
      toast({
        title: "Daftar nama kosong",
        description: "Tulis satu nama tamu per baris.",
        variant: "destructive",
      });
      return;
    }
    setBulkAdding(true);
    try {
      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guests: lines.map((l) => ({ name: l })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "Gagal menambah tamu.");
      }
      toast({
        title: `${data.added} tamu ditambahkan`,
        description:
          data.errors?.length > 0
            ? `${data.errors.length} baris gagal: ${data.errors[0]}`
            : "Semua nama berhasil disimpan.",
      });
      setBulkText("");
      await fetchGuests();
    } catch (err) {
      toast({
        title: "Gagal menambah tamu",
        description:
          err instanceof Error ? err.message : "Silakan coba lagi nanti.",
        variant: "destructive",
      });
    } finally {
      setBulkAdding(false);
    }
  };

  const handleDelete = async (guest: Guest) => {
    if (!window.confirm(`Hapus tamu "${guest.name}"?`)) return;
    setDeletingId(guest.id);
    try {
      const res = await fetch(`/api/guests?id=${encodeURIComponent(guest.id)}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "Gagal menghapus tamu.");
      }
      toast({ title: "Tamu dihapus", description: guest.name });
      await fetchGuests();
    } catch (err) {
      toast({
        title: "Gagal menghapus",
        description:
          err instanceof Error ? err.message : "Silakan coba lagi nanti.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (guest: Guest) => {
    setEditingId(guest.id);
    setEditName(guest.name);
  };

  const saveEdit = async (guest: Guest) => {
    if (!editName.trim()) {
      toast({
        title: "Nama tidak boleh kosong",
        variant: "destructive",
      });
      return;
    }
    setEditSaving(true);
    try {
      const res = await fetch(`/api/guests?id=${encodeURIComponent(guest.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "Gagal menyimpan perubahan.");
      }
      toast({ title: "Perubahan disimpan" });
      setEditingId(null);
      await fetchGuests();
    } catch (err) {
      toast({
        title: "Gagal menyimpan",
        description:
          err instanceof Error ? err.message : "Silakan coba lagi nanti.",
        variant: "destructive",
      });
    } finally {
      setEditSaving(false);
    }
  };

  return (
    <main className="flex min-h-[100svh] w-full flex-col bg-cream">
      <div className="mx-auto w-full max-w-[480px] flex-1 bg-cream px-5 py-12 shadow-sm">
        {/* header */}
        <div className="text-center">
          <p className="flex items-center justify-center gap-2 font-hand text-3xl font-bold text-maroon">
            <Users className="h-7 w-7" aria-hidden="true" />
            Kelola Tamu
          </p>
          <p className="mt-2 font-hand text-lg leading-snug text-navy">
            Tambah tamu undangan, lalu bagikan link personal
            <br />
            atau pesan WhatsApp untuk masing-masing tamu.
          </p>
          <a
            href="/"
            className="mt-3 inline-flex items-center gap-1.5 font-hand text-base text-navy/70 underline-offset-4 hover:text-maroon hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Kembali ke undangan
          </a>
        </div>

        {/* add single */}
        <form
          onSubmit={handleAdd}
          className="mt-8 rounded-3xl border-2 border-dusty-pink bg-white/70 p-5 shadow-md"
        >
          <p className="font-hand text-2xl font-bold text-maroon">
            Tambah Tamu
          </p>
          <label
            htmlFor="guest-name"
            className="mt-3 block font-hand text-lg font-bold text-navy"
          >
            Nama Tamu
          </label>
          <input
            id="guest-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="cth: Budi Santoso"
            maxLength={100}
            className="mt-1 w-full rounded-xl border border-border bg-cream/70 px-4 py-2.5 font-hand text-lg text-navy placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-maroon/50"
          />
          <label
            htmlFor="guest-code"
            className="mt-3 block font-hand text-lg font-bold text-navy"
          >
            Kode (opsional)
          </label>
          <input
            id="guest-code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="kosongkan untuk otomatis"
            maxLength={50}
            className="mt-1 w-full rounded-xl border border-border bg-cream/70 px-4 py-2.5 font-hand text-lg text-navy placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-maroon/50"
          />
          <button
            type="submit"
            disabled={adding}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-maroon px-6 py-2.5 font-hand text-xl text-cream shadow-md transition hover:bg-maroon-deep active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {adding ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                Menyimpan...
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" aria-hidden="true" />
                Tambah Tamu
              </>
            )}
          </button>
        </form>

        {/* bulk add */}
        <form
          onSubmit={handleBulkAdd}
          className="mt-5 rounded-3xl border-2 border-dusty-pink bg-white/70 p-5 shadow-md"
        >
          <p className="font-hand text-2xl font-bold text-maroon">
            Tambah Banyak Sekaligus
          </p>
          <label
            htmlFor="guest-bulk"
            className="mt-2 block font-hand text-base text-navy"
          >
            Satu nama per baris:
          </label>
          <textarea
            id="guest-bulk"
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder={"Budi Santoso\nSiti Aminah\nKeluarga Pak Andi"}
            rows={5}
            className="mt-1 w-full resize-none rounded-xl border border-border bg-cream/70 px-4 py-2.5 font-hand text-lg text-navy placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-maroon/50"
          />
          <button
            type="submit"
            disabled={bulkAdding}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border-2 border-maroon bg-cream/80 px-6 py-2.5 font-hand text-xl text-maroon transition hover:bg-maroon hover:text-cream active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {bulkAdding ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                Menyimpan...
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" aria-hidden="true" />
                Tambah Semua
              </>
            )}
          </button>
        </form>

        {/* guest list */}
        <div className="mt-8">
          <p className="text-center font-hand text-2xl font-bold text-maroon">
            Daftar Tamu ({guests.length})
          </p>

          {loading ? (
            <div className="mt-6 flex justify-center">
              <Loader2
                className="h-6 w-6 animate-spin text-maroon"
                aria-label="Memuat daftar tamu"
              />
            </div>
          ) : fetchError ? (
            <p className="mt-5 rounded-2xl border border-coral/40 bg-coral/10 px-4 py-3 text-center font-hand text-lg text-coral">
              {fetchError}
            </p>
          ) : guests.length === 0 ? (
            <p className="mt-5 text-center font-hand text-lg text-navy/70">
              Belum ada tamu. Tambahkan tamu pertama di atas!
            </p>
          ) : (
            <ul className="wedding-scrollbar mt-5 max-h-[480px] space-y-3 overflow-y-auto pr-1">
              {guests.map((guest) => {
                const link = `${origin}/?to=${guest.code}`;
                const waMessage = buildWaMessage(guest.name, link);
                return (
                  <li
                    key={guest.id}
                    className="rounded-2xl border border-border bg-white/70 px-4 py-3 shadow-sm"
                  >
                    {editingId === guest.id ? (
                      /* inline edit */
                      <div className="flex items-center gap-2">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="min-w-0 flex-1 rounded-xl border border-border bg-cream/70 px-3 py-2 font-hand text-lg text-navy focus:outline-none focus:ring-2 focus:ring-maroon/50"
                          aria-label="Edit nama tamu"
                        />
                        <button
                          onClick={() => saveEdit(guest)}
                          disabled={editSaving}
                          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-olive text-cream transition hover:opacity-90 disabled:opacity-60"
                          aria-label="Simpan nama"
                        >
                          {editSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-coral text-cream transition hover:opacity-90"
                          aria-label="Batalkan edit"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate font-hand text-xl font-bold text-navy">
                              {guest.name}
                            </p>
                            <p className="font-hand text-sm text-navy/60">
                              kode: {guest.code}
                            </p>
                          </div>
                          <div className="flex flex-shrink-0 items-center gap-1.5">
                            <button
                              onClick={() => startEdit(guest)}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-cream/60 text-navy transition hover:border-mustard hover:text-mustard active:scale-90"
                              aria-label={`Edit ${guest.name}`}
                              title="Edit nama"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(guest)}
                              disabled={deletingId === guest.id}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-cream/60 text-navy transition hover:border-coral hover:text-coral active:scale-90 disabled:opacity-60"
                              aria-label={`Hapus ${guest.name}`}
                              title="Hapus tamu"
                            >
                              {deletingId === guest.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* actions: copy link & WA message */}
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          <button
                            onClick={() =>
                              copyText(link, `link-${guest.id}`)
                            }
                            className="flex items-center gap-1.5 rounded-full border-2 border-maroon bg-cream/80 px-3.5 py-1 font-hand text-base text-maroon transition hover:bg-maroon hover:text-cream active:scale-95"
                          >
                            {copiedKey === `link-${guest.id}` ? (
                              <>
                                <Check className="h-4 w-4" />
                                Link tersalin
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4" />
                                Salin link
                              </>
                            )}
                          </button>
                          <button
                            onClick={() =>
                              copyText(waMessage, `wa-${guest.id}`)
                            }
                            className="flex items-center gap-1.5 rounded-full border-2 border-olive bg-cream/80 px-3.5 py-1 font-hand text-base text-olive transition hover:bg-olive hover:text-cream active:scale-95"
                          >
                            {copiedKey === `wa-${guest.id}` ? (
                              <>
                                <Check className="h-4 w-4" />
                                Pesan tersalin
                              </>
                            ) : (
                              <>
                                <MessageCircle className="h-4 w-4" />
                                Pesan WA
                              </>
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
