import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "English OS · Week 1 SSBE Bootcamp",
  description: "Seven-day Modern Standard Southern British English pronunciation bootcamp.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <Nav />
        <main className="shell">{children}</main>
      </body>
    </html>
  );
}
