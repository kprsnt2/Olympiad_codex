import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Olympi — Tiny wins. Big thinking.",
  description: "A joyful, grade-wise learning space for SOF Olympiad preparation.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
