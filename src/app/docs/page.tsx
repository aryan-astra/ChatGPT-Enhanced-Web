"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";

/* ─── Animation helpers ─── */
function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Data ─── */
const features = [
  {
    name: "Typing Lag Fix",
    description: "Eliminates input lag in long conversations.",
    how: "Uses CSS content-visibility: auto to virtualize off-screen messages. An IntersectionObserver batches hide/show operations across separate read and write frames to avoid layout thrash.",
    storage: "No data stored.",
  },
  {
    name: "Compact Sidebar",
    description: "Collapses native sidebar navigation into a compact icon strip.",
    how: "Discovers sidebar links via href attributes and TreeWalker text-node search. Clones each link's SVG icon into a horizontal flex grid with hover tooltips.",
    storage: "No data stored.",
  },
  {
    name: "Bulk Archive / Delete",
    description: "Select multiple conversations and archive or delete them at once.",
    how: "Injects checkboxes into sidebar links. Uses ChatGPT's own REST API (PATCH /backend-api/conversation/{id}) with captured auth headers. Rate-limited with 200ms delays and exponential backoff on 429.",
    storage: "No data stored.",
  },
  {
    name: "Organize by Date",
    description: "Groups sidebar conversations into collapsible date buckets.",
    how: "Fetches up to 500 conversations (paginated) from the backend API, maps each to a time bucket (Today, Yesterday, Last 7 Days, etc.), and injects collapsible heading buttons.",
    storage: "No data stored.",
  },
  {
    name: "Model Badge",
    description: "Shows the active AI model name in the chat header.",
    how: 'MutationObserver on the model button\'s aria-label attribute. Detects mid-session model downgrades using a rank table and shows a warning badge.',
    storage: "No data stored.",
  },
  {
    name: "Context % Bar",
    description: "Live token-usage progress bar in the chat header, with blocked-feature detection and extended system data.",
    how: "Reads token counts from SSE stream metadata and falls back to fetching full conversation JSON. Throttled to 1 update/500ms during streaming. Detects blocked_features from /conversation/init (distinct from quota limits). Extended system data (Memory count, generated image count, Custom Instructions status) fetched in parallel from three endpoints and shown in a SYSTEM section inside the context popover. Debounced to once per 5 minutes.",
    storage: "No data stored.",
  },
  {
    name: "Context Limit Warning",
    description: "Warns when the model hits the context window limit.",
    how: 'Detects finish_details.type === "max_tokens" in the SSE stream and surfaces a dismissible toast with a "Start a new chat" link.',
    storage: "No data stored.",
  },
  {
    name: "Secure Chat Lock",
    description: "Protects conversations behind a 4-digit PIN.",
    how: "PIN is hashed using SHA-256 via the Web Crypto API before storage. Locked chats are hidden from the sidebar. Auto-relocks after 3 minutes of inactivity.",
    storage: "PIN hash stored in chrome.storage.local. Locked chat IDs stored in chrome.storage.local.",
  },
  {
    name: "Hide Chats",
    description: "Temporarily hide conversations without deleting them.",
    how: "Toggles display:none on sidebar links. Hidden chat IDs persist across sessions.",
    storage: "Hidden chat IDs stored in chrome.storage.local.",
  },
  {
    name: "Export to PDF / Markdown / TXT",
    description: "Export any conversation in your preferred format.",
    how: "Walks the full message tree via linked-list traversal of the conversation API response. All rendering is client-side — no external servers.",
    storage: "No data stored. Files download directly to your device.",
  },
  {
    name: "Alpha Mode",
    description: "Enables experimental and unreleased features.",
    how: "Controlled via the extension popup toggle. Gates features behind the alphaMode flag in chrome.storage.sync.",
    storage: "Boolean flag in chrome.storage.sync.",
  },
];

const permissions = [
  {
    name: "activeTab",
    reason: "Interact with the ChatGPT interface on the currently active tab. Required for injecting UI enhancements.",
  },
  {
    name: "scripting",
    reason: "Inject the content script into ChatGPT pages. This is how all features are delivered to the page.",
  },
  {
    name: "webRequest",
    reason: "Capture outgoing Authorization and API headers from ChatGPT's own network requests. The content script needs these to make authenticated API calls (bulk actions, date groups, export, context bar) back to chatgpt.com.",
  },
  {
    name: "storage",
    reason: "Persist user preferences (feature toggles) across sessions via chrome.storage.sync, and store local data (vault PIN hash, locked chat IDs, captured headers) via chrome.storage.local.",
  },
  {
    name: "tabs",
    reason: "Scope the extension icon to ChatGPT tabs only. The popup is disabled and greyed out on all non-ChatGPT pages.",
  },
];

const faqs = [
  {
    q: "Does it send data to any server?",
    a: "No. The extension runs entirely in your browser. All API calls go directly to chatgpt.com using your existing session. No data is sent to any external server, analytics service, or third party.",
  },
  {
    q: "Does it break ChatGPT?",
    a: "No. The extension only enhances the interface layer and does not modify ChatGPT's core functionality. It adds UI elements on top of the existing page without interfering with ChatGPT's own scripts or state.",
  },
  {
    q: "Is it open source?",
    a: "Yes. The full source code is publicly available for audit on GitHub. You can review every line of code before installing.",
  },
  {
    q: "Why does it need the webRequest permission?",
    a: "Content scripts can't read HTTP headers from the page's own fetch requests. The webRequest permission lets the background service worker capture ChatGPT's Authorization header so the extension can make authenticated API calls (for bulk actions, date groups, export, and context bar) back to chatgpt.com — and nowhere else.",
  },
  {
    q: "Will it work if OpenAI updates the ChatGPT UI?",
    a: "The extension relies on interface selectors. If OpenAI significantly changes the UI structure, some features may temporarily stop working. Updates are monitored and patches are released when necessary.",
  },
  {
    q: "Is the vault encryption secure?",
    a: "The PIN is hashed with SHA-256 and never stored in plaintext. The optional Base64 encryption channel is designed for incidental privacy (e.g. screen sharing) rather than adversarial security. It is not cryptographic encryption.",
  },
];

const changelog = [
  {
    version: "3.5.0",
    changes: [
      "Blocked feature detection — parses blocked_features from /conversation/init, distinct from quota limits",
      "Extended system data in Context Intelligence popover — Memory count, generated image count, Custom Instructions",
      "New API endpoints: /memories, /images/bootstrap, /user_system_messages",
      "Pill color fix — blocked status no longer affects color; red = 0 remaining, orange = ≤2",
    ],
  },
  {
    version: "3.4.3",
    changes: [
      "Extension icon disabled on non-ChatGPT sites",
      "Real product logo wired into manifest and popup",
      "Popup icon updated from SVG placeholder to actual logo",
    ],
  },
  {
    version: "3.4.2",
    changes: [
      "Fixed export template literal syntax errors in Chrome strict mode",
      "All export builders rewritten with zero template literals",
      "Regex patterns use String.fromCharCode to avoid backtick issues",
    ],
  },
  {
    version: "3.4.1",
    changes: [
      "Alpha Mode toggle added",
      "Watchdog timer for model badge and context bar self-healing",
      "Full black/white theme — all green/amber accents removed",
      "Compact popup redesign",
    ],
  },
  {
    version: "3.4.0",
    changes: [
      "Context bar insertion fix (overflow clipping resolved)",
      "Content parts API format change handled (object + string)",
      "Stale auth cache fix on 401 responses",
      "Boot retry logic for context bar and compact sidebar",
      "Coming soon section removed from popup",
      "Global scope leaks cleaned up",
    ],
  },
  {
    version: "3.3.0",
    changes: [
      "Date Groups feature added",
      "Export system (PDF, Markdown, TXT) added",
      "Vault encryption (Base64 channel) added",
      "Context popover with detailed stats",
      "Action bar redesigned with two-row layout",
    ],
  },
];

/* ─── Page ─── */
export default function DocsPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-[900px] px-6">
          {/* Page title */}
          <FadeIn>
            <a
              href="/"
              className="text-sm text-[#A1A1AA] hover:text-white transition-colors duration-200 mb-12 inline-block"
            >
              &larr; Back to Home
            </a>
            <h1 className="text-[clamp(36px,5vw,56px)] font-extrabold tracking-[-0.04em] leading-[1.05] mb-4">
              Documentation
            </h1>
            <p className="text-[17px] text-[#A1A1AA] leading-relaxed mb-20 max-w-lg">
              Everything you need to know about ChatGPT++ — features, architecture, permissions, and changelog.
            </p>
          </FadeIn>

          {/* ─── 1. Overview ─── */}
          <Section id="overview" label="01" title="Overview">
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="flex-1">
                <p className="text-[16px] text-[#A1A1AA] leading-[1.75] mb-6">
                  ChatGPT++ is a Chrome extension (Manifest V3) that enhances the ChatGPT interface with:
                </p>
                <ul className="space-y-3">
                  {[
                    "Performance optimization — eliminates typing lag in long conversations",
                    "Bulk sidebar management — select, archive, or delete multiple chats at once",
                    "Chat vault — hide and PIN-lock sensitive conversations",
                    "Context intelligence — real-time token usage tracking",
                    "Export system — download conversations as PDF, Markdown, or plain text",
                    "Zero data collection — no analytics, no tracking, no external servers",
                  ].map((item) => (
                    <li
                      key={item}
                      className="text-[15px] text-[#A1A1AA] leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-white"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full md:w-[240px] shrink-0">
                <div className="border border-[rgba(255,255,255,0.08)] overflow-hidden">
                  <Image
                    src="/popup-screenshot.png"
                    alt="ChatGPT++ extension popup menu showing all feature toggles"
                    width={240}
                    height={480}
                    className="w-full h-auto"
                    priority
                  />
                </div>
                <p className="text-xs text-[#666666] mt-3 text-center">
                  Extension popup — v3.5.0
                </p>
              </div>
            </div>
          </Section>

          {/* ─── 2. Feature Breakdown ─── */}
          <Section id="features" label="02" title="Feature Breakdown">
            <div className="space-y-8">
              {features.map((f, i) => (
                <FadeIn key={f.name} delay={i * 0.03}>
                  <div className="border-b border-[rgba(255,255,255,0.08)] pb-8">
                    <h3 className="text-[17px] font-bold mb-2">{f.name}</h3>
                    <p className="text-[15px] text-[#A1A1AA] leading-relaxed mb-3">
                      {f.description}
                    </p>
                    <div className="font-mono text-[13px] text-[#666666] leading-relaxed space-y-1">
                      <p>
                        <span className="text-[#A1A1AA]">How:</span> {f.how}
                      </p>
                      <p>
                        <span className="text-[#A1A1AA]">Storage:</span>{" "}
                        {f.storage}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </Section>

          {/* ─── 3. Export System ─── */}
          <Section id="export" label="03" title="Export System">
            <div className="space-y-6">
              {[
                {
                  format: "PDF",
                  detail:
                    "Generated entirely client-side. Opens a new browser window with A4-formatted print HTML and triggers window.print(). Black-and-white styling with system fonts. No external font CDN. No rendering server.",
                },
                {
                  format: "Markdown",
                  detail:
                    "Structured DOM parsing via the conversation API's linked-list message tree. Outputs level-1 title, metadata block, and ## USER / ## ASSISTANT sections. Pure string concatenation — zero template literals.",
                },
                {
                  format: "Plain Text",
                  detail:
                    "Plain text fallback with [USER] / [ASSISTANT] transcript labels. 80-character readable format with metadata header. Same message tree walk as Markdown.",
                },
              ].map((item) => (
                <FadeIn key={item.format}>
                  <div className="border border-[rgba(255,255,255,0.08)] p-6">
                    <h3 className="text-[16px] font-bold mb-2 font-mono">
                      .{item.format.toLowerCase()}
                    </h3>
                    <p className="text-[15px] text-[#A1A1AA] leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </FadeIn>
              ))}
              <p className="text-[13px] text-[#666666] font-mono">
                All exports are downloaded directly to your device. No data leaves your browser.
              </p>
            </div>
          </Section>

          {/* ─── 4. Permissions Explained ─── */}
          <Section id="permissions" label="04" title="Permissions Explained">
            <div className="space-y-6">
              {permissions.map((p, i) => (
                <FadeIn key={p.name} delay={i * 0.05}>
                  <div className="flex gap-4 items-start">
                    <code className="text-[14px] font-mono text-white bg-[rgba(255,255,255,0.05)] px-2 py-1 shrink-0">
                      {p.name}
                    </code>
                    <p className="text-[15px] text-[#A1A1AA] leading-relaxed">
                      {p.reason}
                    </p>
                  </div>
                </FadeIn>
              ))}
              <p className="text-[13px] text-[#666666] font-mono mt-8">
                Host permissions are scoped to chatgpt.com and *.chatgpt.com only.
              </p>
            </div>
          </Section>

          {/* ─── 5. FAQ ─── */}
          <Section id="faq" label="05" title="FAQ">
            <div className="space-y-8">
              {faqs.map((faq, i) => (
                <FadeIn key={faq.q} delay={i * 0.04}>
                  <div className="border-b border-[rgba(255,255,255,0.08)] pb-8">
                    <h3 className="text-[16px] font-bold mb-3">{faq.q}</h3>
                    <p className="text-[15px] text-[#A1A1AA] leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </Section>

          {/* ─── 6. Changelog ─── */}
          <Section id="changelog" label="06" title="Changelog">
            <div className="space-y-10">
              {changelog.map((release, i) => (
                <FadeIn key={release.version} delay={i * 0.05}>
                  <div>
                    <h3 className="text-[18px] font-bold font-mono mb-4">
                      v{release.version}
                    </h3>
                    <ul className="space-y-2">
                      {release.changes.map((change) => (
                        <li
                          key={change}
                          className="text-[15px] text-[#A1A1AA] leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-[#666666]"
                        >
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeIn>
              ))}
            </div>
          </Section>

          {/* Trademark */}
          <div className="mt-20 pt-8 border-t border-[rgba(255,255,255,0.08)]">
            <p className="text-xs text-[#666666] leading-relaxed">
              ChatGPT is a trademark of OpenAI, Inc. This extension is not
              created by, affiliated with, endorsed by, or sponsored by OpenAI.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

/* ─── Reusable section wrapper ─── */
function Section({
  id,
  label,
  title,
  children,
}: {
  id: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id={id} ref={ref} className="mb-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
        className="border-b border-[rgba(255,255,255,0.08)] pb-6 mb-10"
      >
        <span className="text-xs font-mono text-[#666666] tracking-[0.2em] uppercase block mb-2">
          {label}
        </span>
        <h2 className="text-[clamp(28px,4vw,40px)] font-extrabold tracking-[-0.03em] leading-tight">
          {title}
        </h2>
      </motion.div>
      {children}
    </section>
  );
}
