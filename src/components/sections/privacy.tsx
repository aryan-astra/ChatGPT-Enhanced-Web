"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const points = [
  "Runs entirely in your browser",
  "No external API calls",
  "No third-party tracking",
  "Storage limited to Chrome local/sync",
  "Vault PIN hashed with SHA-256",
];

export default function Privacy() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="privacy" ref={ref} className="bg-[#0A0A0A] py-32">
      <div className="mx-auto max-w-[1100px] px-6">
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-xs font-mono uppercase tracking-[0.2em] text-[#A1A1AA] mb-4 block"
        >
          Security
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="text-[clamp(36px,6vw,56px)] font-extrabold tracking-[-0.04em] leading-[1.05] mb-16"
        >
          Privacy by Design.
        </motion.h2>

        <div className="max-w-lg">
          <ul className="space-y-6 mb-12">
            {points.map((point, i) => (
              <motion.li
                key={point}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  delay: 0.3 + i * 0.1,
                  duration: 0.5,
                  ease: "easeOut",
                }}
                className="flex items-start gap-4 text-[17px] text-[#A1A1AA] leading-relaxed"
              >
                <span className="text-white mt-0.5 font-mono text-sm select-none">
                  —
                </span>
                <span>{point}</span>
              </motion.li>
            ))}
          </ul>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-white/90 rounded-none h-12 px-8 text-[15px] font-semibold cursor-pointer"
            >
              <Link href="/privacy">Read Full Privacy Policy</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
