"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";

const letterVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const titleBase = "ChatGPT";
const PIXEL_SIZE = 2;
const RADIUS = 28;

/* ─── Pixel-art "++" with white/black hover shimmer ─── */
function PixelPlusPlus() {
  const containerRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({
    mask: [] as boolean[],
    textIndices: [] as number[],
    lum: new Float32Array(0),
    cols: 0,
    rows: 0,
    mx: -999,
    my: -999,
    hovering: false,
    raf: 0,
  });

  const setup = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const s = state.current;
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    if (w === 0 || h === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Get exact font metrics from the hidden sizing span
    const measureSpan = container.querySelector("span")!;
    const cs = window.getComputedStyle(measureSpan);
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";

    ctx.clearRect(0, 0, w, h);
    ctx.fillText("++", w / 2, h / 2);

    // Sample pixel mask from the rendered text
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const px = imgData.data;
    const cols = Math.ceil(w / PIXEL_SIZE);
    const rows = Math.ceil(h / PIXEL_SIZE);
    s.cols = cols;
    s.rows = rows;

    const total = cols * rows;
    const mask: boolean[] = [];
    const textIndices: number[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const sx = Math.min(
          Math.round((col * PIXEL_SIZE + PIXEL_SIZE / 2) * dpr),
          canvas.width - 1
        );
        const sy = Math.min(
          Math.round((row * PIXEL_SIZE + PIXEL_SIZE / 2) * dpr),
          canvas.height - 1
        );
        const idx = (sy * canvas.width + sx) * 4;
        const isText = px[idx + 3] > 80;
        mask.push(isText);
        if (isText) textIndices.push(row * cols + col);
      }
    }

    s.mask = mask;
    s.textIndices = textIndices;
    s.lum = new Float32Array(total).fill(1);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    document.fonts.ready.then(setup);

    const animate = () => {
      const s = state.current;
      const { cols, rows, mask, lum, textIndices } = s;
      if (cols === 0) {
        s.raf = requestAnimationFrame(animate);
        return;
      }

      const dpr = window.devicePixelRatio || 1;
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Idle sparkle: random pixels flicker to dark
      if (!s.hovering && textIndices.length > 0 && Math.random() < 0.12) {
        const ti = textIndices[Math.floor(Math.random() * textIndices.length)];
        lum[ti] = Math.random() < 0.5 ? 0 : Math.random() * 0.4;
      }

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const i = row * cols + col;
          if (!mask[i]) continue;

          const px = col * PIXEL_SIZE;
          const py = row * PIXEL_SIZE;

          if (s.hovering) {
            const cx = px + PIXEL_SIZE / 2;
            const cy = py + PIXEL_SIZE / 2;
            const dist = Math.hypot(cx - s.mx, cy - s.my);

            if (dist < RADIUS) {
              const intensity = 1 - dist / RADIUS;
              if (Math.random() < intensity * 0.7 + 0.15) {
                // Snap to either very dark or very bright
                lum[i] = Math.random() < 0.5 ? Math.random() * 0.15 : 0.85 + Math.random() * 0.15;
              }
            } else {
              lum[i] += (1 - lum[i]) * 0.08;
            }
          } else {
            lum[i] += (1 - lum[i]) * 0.04;
          }

          const v = (lum[i] * 255) | 0;
          ctx.fillStyle = `rgb(${v},${v},${v})`;
          ctx.fillRect(px, py, PIXEL_SIZE, PIXEL_SIZE);
        }
      }

      s.raf = requestAnimationFrame(animate);
    };

    state.current.raf = requestAnimationFrame(animate);

    const onResize = () => document.fonts.ready.then(setup);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(state.current.raf);
      window.removeEventListener("resize", onResize);
    };
  }, [setup]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    state.current.mx = e.clientX - rect.left;
    state.current.my = e.clientY - rect.top;
    state.current.hovering = true;
  }, []);

  const onMouseLeave = useCallback(() => {
    state.current.hovering = false;
  }, []);

  return (
    <span ref={containerRef} className="relative inline-block leading-none">
      {/* Hidden text for sizing — matches the letter spans exactly */}
      <span className="invisible text-[clamp(56px,12vw,120px)] font-extrabold tracking-[-0.04em] leading-[0.95] block">
        ++
      </span>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      />
    </span>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden grid-bg"
    >
      {/* Parallax grid layer */}
      <motion.div
        className="absolute inset-0 grid-bg pointer-events-none"
        style={{ y, opacity }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1100px] px-6 py-32">
        {/* Headline: letter-by-letter reveal + pixel ++ */}
        <h1 className="mb-6">
          <span className="sr-only">ChatGPT++</span>
          <span aria-hidden="true" className="flex items-end">
            {titleBase.split("").map((char, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                className="text-[clamp(56px,12vw,120px)] font-extrabold tracking-[-0.04em] leading-[0.95] text-white"
              >
                {char}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: titleBase.length * 0.04, duration: 0.5 }}
            >
              <PixelPlusPlus />
            </motion.span>
          </span>
        </h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
          className="text-[clamp(18px,2.5vw,24px)] text-[#A1A1AA] max-w-[560px] leading-relaxed mb-12"
        >
          Performance-first enhancement layer for serious ChatGPT users.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
          className="flex gap-4 flex-wrap"
        >
          <Button
            size="lg"
            className="bg-white text-black hover:bg-white/90 rounded-none h-12 px-8 text-[15px] font-semibold cursor-pointer"
          >
            Install Extension
          </Button>
          <Button
            variant="ghost"
            size="lg"
            asChild
            className="border border-[rgba(255,255,255,0.08)] text-white hover:bg-white/5 rounded-none h-12 px-8 text-[15px] font-semibold cursor-pointer"
          >
            <a href="/docs">Documentation</a>
          </Button>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
}
