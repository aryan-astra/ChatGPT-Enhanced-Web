"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[rgba(255,255,255,0.08)] bg-black/80 backdrop-blur-md">
      <div className="mx-auto max-w-[1100px] px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-[15px] font-extrabold tracking-[-0.5px] text-white"
        >
          ChatGPT++
        </Link>
        <nav className="flex items-center gap-8">
          {[
            { label: "Features", href: "/#features" },
            { label: "Architecture", href: "/#architecture" },
            { label: "Privacy", href: "/#privacy" },
            { label: "Docs", href: "/docs" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-[#A1A1AA] hover:text-white transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
