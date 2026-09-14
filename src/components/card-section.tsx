"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * CrazySMP card system — adapted from QuackForge's pricing cards.
 *
 * Each card uses a Frame image (provided by user) as the visual texture.
 * The card overlay shows name + price + a "Choose" button on top of the image.
 *
 * Layout: single playing-card stack (works on BOTH desktop and mobile)
 *   - 1 card front and center, others peeking from behind on both sides
 *   - Tilted + scaled + translated for 3D depth effect
 *   - Nav arrows (left/right) + dot indicator
 *   - Click any card to bring it to front
 *   - Swipe / scroll wheel to navigate
 *
 * Borders/outlines are INVISIBLE (transparent) per user request — only the
 * image art defines the card's visual shape, no manual outline around it.
 *
 * Props:
 *   - packages: array of { id, name, price, tone, img, frame, isKey, blurb }
 *   - onChoose: callback when "Choose" button is clicked (opens modal)
 */

const MC = "'Minecraft', 'Inter', monospace";
// Better font for prices — Space Grotesk is geometric, modern, and renders
// numbers beautifully. Loaded via Google Fonts in layout.tsx.
const PRICE_FONT = "'Space Grotesk', 'Inter', sans-serif";

const TONES: Record<string, { border: string; text: string; glow: string }> = {
  cyan:    { border: "#22D3EE", text: "#67E8F9", glow: "rgba(34,211,238,0.5)" },
  gold:    { border: "#E9C93F", text: "#FFD700", glow: "rgba(233,201,63,0.5)" },
  indigo:  { border: "#6366F1", text: "#A5B4FC", glow: "rgba(99,102,241,0.5)" },
  fire:    { border: "#F97316", text: "#FB923C", glow: "rgba(249,115,22,0.5)" },
  green:   { border: "#22C55E", text: "#4ADE80", glow: "rgba(34,197,94,0.5)" },
  magenta: { border: "#C026D3", text: "#E879F9", glow: "rgba(192,38,211,0.5)" },
};

type CardPkg = {
  id: string;
  name: string;
  price: string;
  tone: string;
  frame: string;
  isKey: boolean;
};

export function CardSection({
  title,
  packages,
  onChoose,
}: {
  title: string;
  packages: CardPkg[];
  onChoose: (pkg: CardPkg) => void;
}) {
  return (
    <div style={{ padding: "50px 20px 8px" }}>
      <style>{`
        @import url('https://fonts.cdnfonts.com/css/minecraft-4');
        .csmp-card-stack {
          position: relative;
          height: 520px;
          perspective: 1400px;
        }
        @media (min-width: 900px) {
          .csmp-card-stack { height: 620px; }
        }
        .csmp-playing-card {
          position: absolute;
          top: 0;
          left: 50%;
          width: 280px;
          height: 460px;
          margin-left: -140px;
          border-radius: 18px;
          overflow: hidden;
          cursor: pointer;
          will-change: transform, opacity;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          /* OUTLINE INVISIBLE — only the image defines the card's shape */
          border: 1px solid transparent;
          background: transparent;
          box-shadow: none;
        }
        @media (min-width: 900px) {
          .csmp-playing-card {
            width: 340px;
            height: 560px;
            margin-left: -170px;
          }
        }
        .csmp-card-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          z-index: 0;
          pointer-events: none;
        }
        .csmp-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 35%, rgba(0,0,0,0.5) 65%, rgba(0,0,0,0.9) 100%);
          z-index: 1;
          pointer-events: none;
        }
        .csmp-card-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 20px;
          z-index: 2;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{ marginBottom: 24 }}
      >
        <h2 style={{ fontFamily: MC, fontSize: 30, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: 0.5 }}>
          {title}
        </h2>
      </motion.div>

      <CardStack packages={packages} onChoose={onChoose} />
    </div>
  );
}

function CardStack({
  packages,
  onChoose,
}: {
  packages: CardPkg[];
  onChoose: (pkg: CardPkg) => void;
}) {
  const [active, setActive] = React.useState(0);
  const touchStartX = React.useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) setActive((v) => Math.min(packages.length - 1, v + 1));
      else setActive((v) => Math.max(0, v - 1));
    }
    touchStartX.current = null;
  };
  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) < 20 && Math.abs(e.deltaX) < 20) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (delta > 30) setActive((v) => Math.min(packages.length - 1, v + 1));
    else if (delta < -30) setActive((v) => Math.max(0, v - 1));
  };

  return (
    <>
      <div
        className="csmp-card-stack"
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {packages.map((pkg, i) => {
          const t = TONES[pkg.tone] || TONES.cyan;
          const diff = i - active;
          let transform: string;
          let opacity = 0;
          let zIndex = 0;
          // OUTLINE INVISIBLE — only glow shadow on the active card, no border
          let boxShadow = "none";

          if (diff === 0) {
            // Active card — front and center
            transform = "translateX(0px) translateZ(40px) rotateY(0deg) scale(1)";
            opacity = 1;
            zIndex = 10;
            boxShadow = `0 30px 80px -10px rgba(0,0,0,0.95), 0 0 80px -8px ${t.glow}`;
          } else if (diff === -1) {
            // One to the left — tilted, slightly back
            transform = "translateX(-140px) translateZ(-30px) rotateY(22deg) scale(0.92)";
            opacity = 0.7;
            zIndex = 5;
          } else if (diff === 1) {
            // One to the right — tilted, slightly back
            transform = "translateX(140px) translateZ(-30px) rotateY(-22deg) scale(0.92)";
            opacity = 0.7;
            zIndex = 5;
          } else if (diff === -2) {
            // Two to the left — further back, more tilted
            transform = "translateX(-240px) translateZ(-70px) rotateY(32deg) scale(0.82)";
            opacity = 0.35;
            zIndex = 1;
          } else if (diff === 2) {
            // Two to the right — further back, more tilted
            transform = "translateX(240px) translateZ(-70px) rotateY(-32deg) scale(0.82)";
            opacity = 0.35;
            zIndex = 1;
          } else if (diff < -2) {
            // Way left — barely visible
            transform = `translateX(${-340 + (diff + 2) * 50}px) translateZ(-100px) rotateY(38deg) scale(0.7)`;
            opacity = 0.15;
            zIndex = 0;
          } else {
            // Way right — barely visible
            transform = `translateX(${340 + (diff - 2) * 50}px) translateZ(-100px) rotateY(-38deg) scale(0.7)`;
            opacity = 0.15;
            zIndex = 0;
          }

          return (
            <motion.div
              key={pkg.id}
              className="csmp-playing-card"
              style={{ zIndex, boxShadow }}
              animate={{ transform, opacity }}
              transition={{ type: "spring", stiffness: 280, damping: 28, mass: 1.0 }}
              onClick={() => setActive(i)}
            >
              <img src={pkg.frame} alt={pkg.name} className="csmp-card-img" draggable={false} />
              <div className="csmp-card-overlay" />
              <div className="csmp-card-content">
                <div style={{ fontFamily: MC, fontSize: 22, fontWeight: 700, color: t.text, marginBottom: 6, letterSpacing: 0.5 }}>
                  {pkg.name}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, marginBottom: 14 }}>
                  <span style={{ fontFamily: PRICE_FONT, fontSize: 26, fontWeight: 700, color: "#fff" }}>{pkg.price}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onChoose(pkg);
                  }}
                  style={{
                    fontFamily: MC,
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#0a0812",
                    background: t.border,
                    border: "none",
                    borderRadius: 8,
                    padding: "12px 18px",
                    cursor: "pointer",
                    letterSpacing: 0.5,
                    boxShadow: `0 4px 20px ${t.glow}`,
                  }}
                >
                  CHOOSE →
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Nav arrows + dots */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20 }}>
        <button
          onClick={() => setActive((v) => Math.max(0, v - 1))}
          disabled={active === 0}
          style={{
            display: "inline-flex",
            height: 44,
            width: 44,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            border: "none",
            background: "rgba(0,0,0,0.4)",
            color: TONES.cyan.text,
            cursor: active === 0 ? "not-allowed" : "pointer",
            opacity: active === 0 ? 0.3 : 1,
            transition: "opacity 0.2s ease",
          }}
          aria-label="Previous"
        >
          <ChevronLeft size={22} />
        </button>
        <div style={{ display: "flex", gap: 6 }}>
          {packages.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to ${i + 1}`}
              style={{
                height: 8,
                width: i === active ? 28 : 8,
                borderRadius: 999,
                background: i === active ? TONES.cyan.border : "rgba(255,255,255,0.25)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            />
          ))}
        </div>
        <button
          onClick={() => setActive((v) => Math.min(packages.length - 1, v + 1))}
          disabled={active === packages.length - 1}
          style={{
            display: "inline-flex",
            height: 44,
            width: 44,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            border: "none",
            background: "rgba(0,0,0,0.4)",
            color: TONES.cyan.text,
            cursor: active === packages.length - 1 ? "not-allowed" : "pointer",
            opacity: active === packages.length - 1 ? 0.3 : 1,
            transition: "opacity 0.2s ease",
          }}
          aria-label="Next"
        >
          <ChevronRight size={22} />
        </button>
      </div>
      <p style={{ textAlign: "center", fontFamily: MC, fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 10 }}>
        Swipe / scroll / arrows · {active + 1} of {packages.length}
      </p>
    </>
  );
}
