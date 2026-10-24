"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/bootcamp", label: "7-Day Bootcamp" },
  { href: "/lab", label: "Pronunciation Lab" },
  { href: "/coach", label: "AI Coach" },
  { href: "/progress", label: "Progress" },
];

export function Nav() {
  const path = usePathname();
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="brand">
          English <span>OS</span>
        </Link>
        <nav className="nav">
          {LINKS.map((l) => {
            const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} className={active ? "active" : ""}>
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
