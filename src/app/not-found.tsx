"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

function Scanlines() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-20"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 3px)",
        backgroundSize: "100% 3px",
      }}
    />
  );
}

function NoiseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const w = 256;
    const h = 256;
    canvas.width = w;
    canvas.height = h;

    function renderNoise() {
      const imageData = ctx!.createImageData(w, h);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 12;
      }
      ctx!.putImageData(imageData, 0, 0);
      animId = requestAnimationFrame(renderNoise);
    }

    renderNoise();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-10 opacity-30"
      style={{ imageRendering: "pixelated" }}
    />
  );
}

const glitchKeyframes = `
@keyframes glitch-1 {
  0%, 100% { clip-path: inset(40% 0 50% 0); transform: translate(-3px, 2px); }
  20% { clip-path: inset(10% 0 75% 0); transform: translate(3px, -1px); }
  40% { clip-path: inset(60% 0 10% 0); transform: translate(-2px, 3px); }
  60% { clip-path: inset(30% 0 40% 0); transform: translate(4px, -2px); }
  80% { clip-path: inset(80% 0 5% 0); transform: translate(-1px, 1px); }
}
@keyframes glitch-2 {
  0%, 100% { clip-path: inset(25% 0 60% 0); transform: translate(3px, -1px); }
  20% { clip-path: inset(70% 0 5% 0); transform: translate(-4px, 2px); }
  40% { clip-path: inset(5% 0 80% 0); transform: translate(2px, -3px); }
  60% { clip-path: inset(50% 0 20% 0); transform: translate(-3px, 1px); }
  80% { clip-path: inset(15% 0 55% 0); transform: translate(1px, 3px); }
}
@keyframes flicker {
  0%, 100% { opacity: 1; }
  3% { opacity: 0.4; }
  6% { opacity: 1; }
  7% { opacity: 0.6; }
  9% { opacity: 1; }
  50% { opacity: 1; }
  52% { opacity: 0.3; }
  53% { opacity: 1; }
}
`;

export default function NotFound() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: glitchKeyframes }} />
      <Scanlines />
      <NoiseCanvas />

      <div className="fixed inset-0 bg-black flex items-center justify-center z-30">
        <div
          className="text-center"
          style={{ animation: "flicker 4s infinite" }}
        >
          {/* Glitch 404 */}
          <div className="relative mb-8 select-none">
            <motion.h1
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-[clamp(120px,25vw,280px)] font-extrabold tracking-[-0.06em] leading-none text-white"
            >
              404
            </motion.h1>

            {/* Glitch layers */}
            <span
              className="absolute inset-0 text-[clamp(120px,25vw,280px)] font-extrabold tracking-[-0.06em] leading-none text-white opacity-70"
              style={{
                animation: "glitch-1 2.5s infinite linear",
                textShadow: "2px 0 rgba(255,255,255,0.3)",
              }}
              aria-hidden="true"
            >
              404
            </span>
            <span
              className="absolute inset-0 text-[clamp(120px,25vw,280px)] font-extrabold tracking-[-0.06em] leading-none text-white opacity-70"
              style={{
                animation: "glitch-2 3s infinite linear",
                textShadow: "-2px 0 rgba(255,255,255,0.3)",
              }}
              aria-hidden="true"
            >
              404
            </span>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-[clamp(16px,2.5vw,22px)] text-[#A1A1AA] font-mono mb-12 px-6"
          >
            You went beyond the context window.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-white/90 rounded-none h-12 px-8 text-[15px] font-semibold cursor-pointer"
            >
              <Link href="/">Return Home</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </>
  );
}
