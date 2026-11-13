import type { Metadata } from "next";
import { Caveat, Great_Vibes } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const greatVibes = Great_Vibes({
  variable: "--font-vibes",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Bayu & Icha - The Wedding",
  description: "Undangan Pernikahan Bayu & Icha. 7 Desember 2026.",
  keywords: ["undangan", "pernikahan", "wedding", "Bayu", "Icha"],
  authors: [{ name: "Bayu & Icha" }],
  openGraph: {
    title: "Bayu & Icha - The Wedding",
    description: "Undangan Pernikahan Bayu & Icha. 7 Desember 2026.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${caveat.variable} ${greatVibes.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
