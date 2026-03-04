"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    title: "Typing Lag Virtualization",
    description:
      "Eliminates input lag in long conversations by virtualizing off-screen messages with CSS content-visibility. DOM stays lightweight regardless of thread length.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <polyline points="13 17 18 12 13 7" />
        <polyline points="6 17 11 12 6 7" />
      </svg>
    ),
  },
  {
    title: "Bulk Chat Management",
    description:
      "Select multiple conversations with checkboxes. Archive or delete in bulk via ChatGPT's own API. Shift-click for multi-select. Rate-limited with exponential backoff.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
      </svg>
    ),
  },
  {
    title: "Secure Chat Lock",
    description:
      "PIN-based vault protection for sensitive conversations. PIN hashed with SHA-256 via Web Crypto API and stored locally. Auto-relock after 3 minutes of inactivity.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: "Hide Chats",
    description:
      "Temporarily remove conversations from the sidebar without deleting them. Toggle visibility instantly. Hidden chat IDs persist across browser restarts via chrome.storage.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ),
  },
  {
    title: "Context Intelligence Bar",
    description:
      "Live token-usage progress bar in the chat header. Shows prompt and completion token counts, file attachment tracking, and blocked-feature detection. The popover now includes a System section with Memory count, generated image count, and Custom Instructions status.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  {
    title: "Organize by Date",
    description:
      "Groups sidebar conversations into collapsible date buckets — Today, Yesterday, Last 7 Days, Last 30 Days, and monthly archives. Fetches up to 500 conversations.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    title: "Export to PDF / Markdown / TXT",
    description:
      "Export any conversation in your preferred format. Walks the full message tree via linked-list traversal. Clean output with proper formatting — ready for docs, repos, or archives.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
  },
];

function FeatureBlock({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.7,
        delay: 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="py-24 border-b border-[rgba(255,255,255,0.08)] last:border-b-0"
    >
      <div
        className={`flex flex-col ${
          isEven ? "md:flex-row" : "md:flex-row-reverse"
        } gap-12 md:gap-24 items-start`}
      >
        {/* Text */}
        <div className="flex-1 max-w-lg">
          <motion.div
            initial={{ opacity: 0, x: isEven ? -20 : 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-4 text-[#A1A1AA]"
          >
            {feature.icon}
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="text-[clamp(28px,4vw,40px)] font-bold tracking-[-0.03em] leading-tight mb-4"
          >
            {feature.title}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-[17px] text-[#A1A1AA] leading-relaxed"
          >
            {feature.description}
          </motion.p>
        </div>

        {/* Visual spacer — keeps alternating rhythm */}
        <div className="flex-1 hidden md:block" />
      </div>
    </motion.div>
  );
}

export default function Features() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" ref={ref} className="bg-[#0A0A0A]">
      <div className="mx-auto max-w-[1100px] px-6">
        {/* Section heading */}
        <div className="pt-32 pb-8 border-b border-[rgba(255,255,255,0.08)]">
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="text-xs font-mono uppercase tracking-[0.2em] text-[#A1A1AA] mb-4 block"
          >
            Features
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="text-[clamp(36px,6vw,56px)] font-extrabold tracking-[-0.04em] leading-[1.05]"
          >
            Built for power users.
          </motion.h2>
        </div>

        {/* Feature blocks */}
        {features.map((feature, i) => (
          <FeatureBlock key={feature.title} feature={feature} index={i} />
        ))}
      </div>
    </section>
  );
}
