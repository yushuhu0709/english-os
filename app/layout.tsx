import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { AutoBackup } from "@/components/AutoBackup";

export const metadata: Metadata = {
  title: "English OS · SSBE Pronunciation Bootcamp",
  description: "Two-week Modern Standard Southern British English pronunciation bootcamp.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <Nav />
        <AutoBackup />
        <main className="shell">{children}</main>
      </body>
    </html>
  );
}
