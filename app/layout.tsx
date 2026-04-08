import type { Metadata } from "next";
import { Playfair_Display, VT323 } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const vt323 = VT323({
  weight: "400",
  variable: "--font-retro-fallback",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Happy Birthday Ka Sharon!",
  description: "A birthday surprise from your favorite people",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${vt323.variable} h-full`}
    >
      <body className="h-full overflow-hidden bg-black">{children}</body>
    </html>
  );
}
