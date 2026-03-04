"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const lines = [
  "Manifest V3",
  "Client-side only",
  "No external servers",
  "No analytics",
  "No tracking",
  "No data leaves chatgpt.com",
];

export default function Architecture() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section id="architecture" ref={ref} className="bg-black py-32">
      <div className="mx-auto max-w-[1100px] px-6">
        {/* Section label */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-xs font-mono uppercase tracking-[0.2em] text-[#A1A1AA] mb-4 block"
        >
          Architecture
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="text-[clamp(36px,6vw,56px)] font-extrabold tracking-[-0.04em] leading-[1.05] mb-16"
        >
          Zero trust required.
        </motion.h2>

        {/* Code block */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.7 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative"
        >
          {/* Glow border effect on hover */}
          <div
            className="absolute -inset-px transition-opacity duration-500"
            style={{
              opacity: isHovered ? 1 : 0,
              boxShadow: "0 0 30px rgba(255,255,255,0.06), 0 0 60px rgba(255,255,255,0.03)",
            }}
          />

          <div className="relative border border-[rgba(255,255,255,0.08)] bg-[#0A0A0A] p-10 md:p-14">
            <pre className="font-mono text-[15px] md:text-[17px] leading-[2.2]">
              {lines.map((line, i) => (
                <motion.div
                  key={line}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
                >
                  <span className="text-[#A1A1AA] mr-4 select-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-white">{line}</span>
                </motion.div>
              ))}
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
