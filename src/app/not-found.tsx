"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let W = 0, H = 0;
    let animId = 0;
    let frame = 0;
    const mouse = { x: -9999, y: -9999 };

    // resize
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onTouchMove = (e: TouchEvent) => {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true } as EventListenerOptions);

    // particles
    const PCOUNT = 280;
    const particles = Array.from({ length: PCOUNT }, () => ({
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      size: Math.random() * 2.5 + 0.5,
    }));

    // glitch rects pool
    interface GRect { x: number; y: number; w: number; h: number; life: number; max: number; filled: boolean }
    const grects: GRect[] = [];
    let glitchTimer = 0;

    const spawnGlitch = (ox: number, oy: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const w = Math.random() * 220 + 20;
        const h = Math.random() * 18 + 2;
        grects.push({
          x: ox + (Math.random() - 0.5) * 400,
          y: oy + (Math.random() - 0.5) * 300,
          w, h, life: 0,
          max: Math.random() * 18 + 6,
          filled: Math.random() > 0.4,
        });
      }
    };

    // artifact chars
    const CHARS = "▓░▒█▐▌▄▀■□▪▫◆◇●○×+─│┼╬╔╗╚╝";
    interface ArtChar { x: number; y: number; ch: string; life: number; max: number }
    const artChars: ArtChar[] = [];
    let artTimer = 0;

    const spawnChars = (ox: number, oy: number) => {
      for (let i = 0; i < 14; i++) {
        artChars.push({
          x: ox + (Math.random() - 0.5) * 500,
          y: oy + (Math.random() - 0.5) * 400,
          ch: CHARS[Math.floor(Math.random() * CHARS.length)],
          life: 0,
          max: Math.random() * 30 + 14,
        });
      }
    };

    // persistent noise columns
    const NCOLS = 40;
    const noise = Array.from({ length: NCOLS }, () => ({
      x: Math.random(),
      y: Math.random(),
      h: Math.random() * 0.3 + 0.05,
      alpha: Math.random() * 0.15 + 0.04,
      phase: Math.random() * 300,
    }));

    // main loop
    const draw = () => {
      frame++;
      animId = requestAnimationFrame(draw);

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);

      // noise columns
      for (const n of noise) {
        if (Math.sin((frame + n.phase) * 0.07) <= 0.3) continue;
        ctx.fillStyle = `rgba(255,255,255,${n.alpha})`;
        ctx.fillRect(n.x * W, n.y * H, 1, n.h * H);
      }

      // horizontal scan glitch
      for (let i = 0; i < Math.floor(Math.random() * 3); i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.07 + 0.02})`;
        ctx.fillRect(0, Math.random() * H, W, Math.random() * 2 + 0.5);
      }

      // spawn on mouse
      if (++glitchTimer % 4 === 0 && mouse.x > 0) spawnGlitch(mouse.x, mouse.y, Math.floor(Math.random() * 5) + 2);
      if (++artTimer % 8 === 0 && mouse.x > 0) spawnChars(mouse.x, mouse.y);

      // glitch rects
      for (let i = grects.length - 1; i >= 0; i--) {
        const g = grects[i];
        g.life++;
        const p = g.life / g.max;
        const a = (1 - p) * 0.7;
        if (g.filled) {
          ctx.fillStyle = `rgba(255,255,255,${a})`;
          ctx.fillRect(g.x, g.y, g.w * (1 - p * 0.5), g.h);
        } else {
          ctx.strokeStyle = `rgba(255,255,255,${a})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(g.x, g.y, g.w, g.h);
        }
        if (g.life >= g.max) grects.splice(i, 1);
      }

      // artifact chars
      ctx.font = "13px monospace";
      for (let i = artChars.length - 1; i >= 0; i--) {
        const a = artChars[i];
        a.life++;
        const alpha = (1 - a.life / a.max) * 0.85;
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fillText(a.ch, a.x, a.y);
        if (a.life >= a.max) artChars.splice(i, 1);
      }

      // particles with mouse repulsion
      for (const p of particles) {
        p.x = ((p.x + W) % W);
        p.y = ((p.y + H) % H);
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist2 = dx * dx + dy * dy;
        const dist = Math.sqrt(dist2) + 0.001;
        if (dist2 < 28000) {
          const force = (1 - dist / Math.sqrt(28000)) * 9;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
        p.vx *= 0.88;
        p.vy *= 0.88;
        p.x += p.vx;
        p.y += p.vy;
        const proximity = Math.max(0, 1 - dist / 280);
        const alpha = 0.25 + proximity * 0.75;
        const size = p.size + proximity * 3;
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
      }

      // 404 text with mouse-driven distortion
      const cx = W / 2;
      const cy = H / 2;
      const mdx = cx - mouse.x;
      const mdy = cy - mouse.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      const pull = Math.max(0, 1 - mdist / 600);
      const shiftX = -mdx * pull * 0.12;
      const shiftY = -mdy * pull * 0.08;
      const fontSize = Math.min(W * 0.32, H * 0.55, 340);
      ctx.font = `900 ${fontSize}px Inter, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // chromatic aberration
      const split = pull * 14 + (Math.random() > 0.93 ? Math.random() * 10 : 0);
      if (split > 0.5) {
        ctx.fillStyle = `rgba(255,255,255,0.22)`;
        ctx.fillText("404", cx + shiftX + split, cy + shiftY);
        ctx.fillStyle = `rgba(255,255,255,0.22)`;
        ctx.fillText("404", cx + shiftX - split, cy + shiftY);
      }

      ctx.fillStyle = "#ffffff";
      ctx.fillText("404", cx + shiftX, cy + shiftY);

      // glitch slice
      if (pull > 0.15 || Math.random() > 0.97) {
        const sliceY = cy + shiftY + (Math.random() - 0.5) * fontSize * 0.8;
        const sliceH = Math.random() * 18 + 4;
        const sliceShift = (Math.random() - 0.5) * pull * 80 + 12;
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, sliceY - sliceH / 2, W, sliceH);
        ctx.clip();
        ctx.fillStyle = "#fff";
        ctx.fillText("404", cx + shiftX + sliceShift, cy + shiftY);
        ctx.restore();
      }

      // sub-label
      const labelSize = Math.max(13, W * 0.013);
      ctx.font = `500 ${labelSize}px Inter, system-ui, monospace`;
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.fillText("PAGE NOT FOUND", cx + shiftX * 0.3, cy + fontSize * 0.56 + shiftY * 0.3);

      // cursor reticle
      if (mouse.x > 0) {
        const bSize = 36 + pull * 28;
        ctx.strokeStyle = `rgba(255,255,255,${0.2 + pull * 0.5})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(mouse.x - bSize / 2, mouse.y - bSize / 2, bSize, bSize);
        ctx.beginPath();
        ctx.moveTo(mouse.x - bSize * 0.7, mouse.y);
        ctx.lineTo(mouse.x + bSize * 0.7, mouse.y);
        ctx.moveTo(mouse.x, mouse.y - bSize * 0.7);
        ctx.lineTo(mouse.x, mouse.y + bSize * 0.7);
        ctx.stroke();
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden cursor-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <Link
          href="/"
          className="inline-block px-8 py-3 border border-white text-white text-[13px] font-semibold tracking-[0.18em] uppercase font-mono hover:bg-white hover:text-black transition-colors duration-150"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
