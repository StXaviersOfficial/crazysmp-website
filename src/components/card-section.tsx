"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * CrazySMP card system — adapted from QuackForge's pricing cards.
 *
 * Each card uses a Frame image (provided by user) as the visual texture.
 * The card overlay shows name + price + a "Choose" button on top of the image.
 *
 * Layout:
 *   - Desktop (>= 900px): responsive grid of cards
 *   - Mobile: playing-card stack with tilted peeking cards + nav arrows + dots
 *
 * Two sections rendered: Ranks (6 cards) and Keys (3 cards).
 *
 * Props:
 *   - packages: array of { id, name, price, tone, img, frame, isKey, blurb }
 *   - onChoose: callback when "Choose" button is clicked (opens modal)
 */

const MC = "'Minecraft', 'Inter', monospace";
const NORMAL = "'Inter', system-ui, -apple-system, sans-serif";

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
  subtitle,
  packages,
  onChoose,
}: {
  title: string;
  subtitle: string;
  packages: CardPkg[];
  onChoose: (pkg: CardPkg) => void;
}) {
  return (
    <div style={{ padding: "50px 20px 8px" }}>
      <style>{`
        @import url('https://fonts.cdnfonts.com/css/minecraft-4');
        .csmp-card-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: 1fr;
        }
        @media (min-width: 600px) {
          .csmp-card-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 900px) {
          .csmp-card-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; }
        }
        @media (min-width: 1200px) {
          .csmp-card-grid { grid-template-columns: repeat(${Math.min(packages.length, 6)}, 1fr); }
        }

        .csmp-card-stack {
          position: relative;
          height: 480px;
          perspective: 1200px;
        }
        .csmp-playing-card {
          position: absolute;
          top: 0;
          left: 50%;
          width: 280px;
          height: 440px;
          margin-left: -140px;
          border-radius: 18px;
          overflow: hidden;
          cursor: pointer;
          will-change: transform, opacity;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .csmp-card-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }
        .csmp-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.95) 100%);
          z-index: 1;
          pointer-events: none;
        }
        .csmp-card-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 18px;
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
        <div style={{ fontFamily: MC, fontSize: 13, color: "#22D3EE", letterSpacing: 1, marginBottom: 6 }}>
          {subtitle}
        </div>
        <h2 style={{ fontFamily: MC, fontSize: 30, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: 0.5 }}>
          {title}
        </h2>
      </motion.div>

      {/* Desktop: responsive grid */}
      <div className="csmp-card-grid">
        {packages.map((pkg, i) => (
          <DesktopCard key={pkg.id} pkg={pkg} index={i} onChoose={() => onChoose(pkg)} />
        ))}
      </div>

      {/* Mobile: playing-card stack with tilted peeking cards */}
      <MobileCardStack packages={packages} onChoose={onChoose} />
    </div>
  );
}

function DesktopCard({ pkg, index, onChoose }: { pkg: CardPkg; index: number; onChoose: () => void }) {
  const t = TONES[pkg.tone] || TONES.cyan;
  return (
    <motion.button
      type="button"
      onClick={onChoose}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        position: "relative",
        display: "block",
        padding: 0,
        border: `1.5px solid ${t.border}`,
        borderRadius: 18,
        overflow: "hidden",
        cursor: "pointer",
        background: "transparent",
        boxShadow: `0 10px 40px -10px rgba(0,0,0,0.6), 0 0 0 1px ${t.glow}`,
        aspectRatio: "3 / 4",
        minHeight: 280,
        width: "100%",
        textAlign: "left",
        font: "inherit",
        color: "inherit",
      }}
    >
      <img
        src={pkg.frame}
        alt={pkg.name}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
        draggable={false}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.95) 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 18,
          zIndex: 2,
        }}
      >
        <div style={{ fontFamily: MC, fontSize: 18, fontWeight: 700, color: t.text, lineHeight: 1.2, marginBottom: 4 }}>
          {pkg.name}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontFamily: NORMAL, fontSize: 22, fontWeight: 700, color: "#fff" }}>{pkg.price}</span>
          <span
            style={{
              fontFamily: MC,
              fontSize: 11,
              color: t.text,
              letterSpacing: 0.5,
              border: `1px solid ${t.border}`,
              borderRadius: 6,
              padding: "4px 10px",
              background: "rgba(0,0,0,0.4)",
            }}
          >
            CHOOSE →
          </span>
        </div>
      </div>
    </motion.button>
  );
}

function MobileCardStack({
  packages,
  onChoose,
}: {
  packages: CardPkg[];
  onChoose: (pkg: CardPkg) => void;
}) {
  const [activeMobile, setActiveMobile] = React.useState(0);
  const touchStartX = React.useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) setActiveMobile((v) => Math.min(packages.length - 1, v + 1));
      else setActiveMobile((v) => Math.max(0, v - 1));
    }
    touchStartX.current = null;
  };
  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) < 20 && Math.abs(e.deltaX) < 20) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (delta > 30) setActiveMobile((v) => Math.min(packages.length - 1, v + 1));
    else if (delta < -30) setActiveMobile((v) => Math.max(0, v - 1));
  };

  return (
    <div
      className="csmp-mobile-stack"
      style={{ display: "none" }}
    >
      {/* Hidden by default; made visible via media query below */}
      <style>{`
        @media (max-width: 599px) {
          .csmp-card-grid { display: none !important; }
          .csmp-mobile-stack { display: block !important; }
        }
      `}</style>

      <div
        className="csmp-card-stack"
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {packages.map((pkg, i) => {
          const t = TONES[pkg.tone] || TONES.cyan;
          const diff = i - activeMobile;
          let transform: string;
          let opacity = 0;
          let zIndex = 0;
          let boxShadow = `0 10px 40px -10px rgba(0,0,0,0.8), 0 0 0 1px ${t.glow}`;

          if (diff === 0) {
            transform = "translateX(0px) translateZ(40px) rotateY(0deg) scale(1)";
            opacity = 1;
            zIndex = 10;
            boxShadow = `0 20px 60px -10px rgba(0,0,0,0.9), 0 0 0 1px ${t.border}, 0 0 60px -8px ${t.glow}`;
          } else if (diff === -1) {
            transform = "translateX(-110px) translateZ(-30px) rotateY(18deg) scale(0.92)";
            opacity = 0.7;
            zIndex = 5;
          } else if (diff === 1) {
            transform = "translateX(110px) translateZ(-30px) rotateY(-18deg) scale(0.92)";
            opacity = 0.7;
            zIndex = 5;
          } else if (diff < -1) {
            transform = "translateX(-180px) translateZ(-60px) rotateY(28deg) scale(0.82)";
            opacity = 0.35;
            zIndex = 1;
          } else {
            transform = "translateX(180px) translateZ(-60px) rotateY(-28deg) scale(0.82)";
            opacity = 0.35;
            zIndex = 1;
          }

          return (
            <motion.div
              key={pkg.id}
              className="csmp-playing-card"
              style={{ zIndex, border: `1px solid ${t.border}`, boxShadow }}
              animate={{ transform, opacity }}
              transition={{ type: "spring", stiffness: 280, damping: 28, mass: 1.0 }}
              onClick={() => setActiveMobile(i)}
            >
              <img src={pkg.frame} alt={pkg.name} className="csmp-card-img" draggable={false} />
              <div className="csmp-card-overlay" />
              <div className="csmp-card-content">
                <div style={{ fontFamily: MC, fontSize: 20, fontWeight: 700, color: t.text, marginBottom: 4 }}>
                  {pkg.name}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontFamily: NORMAL, fontSize: 24, fontWeight: 700, color: "#fff" }}>{pkg.price}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onChoose(pkg);
                  }}
                  style={{
                    fontFamily: MC,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#0a0812",
                    background: t.border,
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 16px",
                    cursor: "pointer",
                    letterSpacing: 0.5,
                    boxShadow: `0 4px 16px ${t.glow}`,
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
        <button
          onClick={() => setActiveMobile((v) => Math.max(0, v - 1))}
          disabled={activeMobile === 0}
          style={{
            display: "inline-flex",
            height: 40,
            width: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            border: `1px solid ${TONES.cyan.border}`,
            background: "rgba(0,0,0,0.4)",
            color: TONES.cyan.text,
            cursor: activeMobile === 0 ? "not-allowed" : "pointer",
            opacity: activeMobile === 0 ? 0.3 : 1,
          }}
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
        <div style={{ display: "flex", gap: 6 }}>
          {packages.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveMobile(i)}
              aria-label={`Go to ${i + 1}`}
              style={{
                height: 6,
                width: i === activeMobile ? 24 : 6,
                borderRadius: 999,
                background: i === activeMobile ? TONES.cyan.border : "rgba(255,255,255,0.3)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            />
          ))}
        </div>
        <button
          onClick={() => setActiveMobile((v) => Math.min(packages.length - 1, v + 1))}
          disabled={activeMobile === packages.length - 1}
          style={{
            display: "inline-flex",
            height: 40,
            width: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            border: `1px solid ${TONES.cyan.border}`,
            background: "rgba(0,0,0,0.4)",
            color: TONES.cyan.text,
            cursor: activeMobile === packages.length - 1 ? "not-allowed" : "pointer",
            opacity: activeMobile === packages.length - 1 ? 0.3 : 1,
          }}
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <p style={{ textAlign: "center", fontFamily: MC, fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>
        Swipe left/right or use arrows · {activeMobile + 1} of {packages.length}
      </p>
    </div>
  );
}
