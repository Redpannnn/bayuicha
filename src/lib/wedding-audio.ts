/**
 * Singleton HTMLAudioElement untuk lagu pernikahan.
 *
 * Dipakai bareng oleh:
 *  - page.tsx        → autoplay saat tombol "Buka undangan" diklik
 *  - WeddingMusicPlayer → kontrol play/pause/seek/loop/mute di section 2
 *
 * Kenapa singleton module-level:
 *  1. Audio tetap jalan walau komponen UI re-render / unmount.
 *  2. play() bisa dipanggil LANGSUNG di dalam click handler "Buka undangan"
 *     (masih dalam user gesture) — jadi lolos aturan autoplay semua browser,
 *     termasuk iOS Safari yang paling ketat.
 */

let audio: HTMLAudioElement | null = null;

export function getWeddingAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio("/music/the-way-you-look-at-me.mp3");
    audio.preload = "metadata";
    audio.loop = true;
  }
  return audio;
}

/**
 * Mulai mainkan musik. WAJIB dipanggil dari dalam click handler
 * (user gesture) biar tidak diblokir autoplay policy.
 */
export function playWeddingMusic(): void {
  try {
    void getWeddingAudio().play().catch(() => {
      // Diblokir autoplay policy → user bisa tekan play manual di section 2.
    });
  } catch {
    // ignore
  }
}
