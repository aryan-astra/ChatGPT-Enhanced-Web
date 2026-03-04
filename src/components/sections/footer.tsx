import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.08)] bg-black py-12">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <span className="text-sm font-semibold tracking-[-0.3px] text-white">
            ChatGPT++ v3.4.3
          </span>
          <nav className="flex gap-8" aria-label="Footer navigation">
            <Link
              href="/privacy"
              className="text-sm text-[#A1A1AA] hover:text-white transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              href="/docs"
              className="text-sm text-[#A1A1AA] hover:text-white transition-colors duration-200"
            >
              Docs
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#A1A1AA] hover:text-white transition-colors duration-200"
            >
              GitHub
            </a>
            <a
              href="https://chromewebstore.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#A1A1AA] hover:text-white transition-colors duration-200"
            >
              Chrome Web Store
            </a>
          </nav>
        </div>
        <p className="text-xs text-[#666666] leading-relaxed max-w-[600px]">
          ChatGPT is a trademark of OpenAI. This extension is not affiliated
          with, endorsed by, or sponsored by OpenAI.
        </p>
      </div>
    </footer>
  );
}
