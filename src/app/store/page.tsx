"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, X } from "lucide-react";
import { DiscordFab } from "@/components/discord-fab";
import { CardSection } from "@/components/card-section";

const LOGO = "/crazysmp-logo.webp";
const BG = "/crazysmp-bg-new.webp";
const LOGIN_BG = "/login-bg.webp";
const DISCORD_URL = "https://discord.gg/GFzAeUj7TJ";

// Minecraft font family — applied to every text element on the page.
// Falls back to Inter / monospace if the web font fails to load.
const MC = "'Minecraft', 'Inter', monospace";
// Normal sans-serif font for prices (per user request — prices stand out
// better when not in the pixelated MC font).
const NORMAL = "'Inter', system-ui, -apple-system, sans-serif";

const PACKAGES = [
  // Ranks (6 tiers)
  { id: "vip",       name: "VIP Rank",       tier: 1, price: "₹29",    tone: "cyan",    img: "/pkg-vip.webp",        frame: "/frames/vip.png",        isKey: false },
  { id: "legend",    name: "LEGEND Rank",    tier: 2, price: "₹69",    tone: "gold",    img: "/pkg-legend.webp",     frame: "/frames/legend.png",     isKey: false },
  { id: "immortal",  name: "IMMORTAL Rank",  tier: 3, price: "₹119",   tone: "indigo",  img: "/pkg-immortal.webp",   frame: "/frames/immortal.png",   isKey: false },
  { id: "titan",     name: "TITAN Rank",     tier: 4, price: "₹179",   tone: "fire",    img: "/pkg-titan.webp",      frame: "/frames/titan.png",      isKey: false },
  { id: "techno",    name: "TECHNO Rank",    tier: 5, price: "₹239",   tone: "green",   img: "/pkg-techno.webp",     frame: "/frames/techno.png",     isKey: false },
  { id: "crazy",     name: "CRAZY Rank",     tier: 6, price: "₹299",   tone: "magenta", img: "/pkg-crazy.webp",      frame: "/frames/crazy.png",      isKey: false },
  // Keys (3 crate keys)
  { id: "spawner-key", name: "Spawner Key", bonus: "COMMON", price: "₹19",  tone: "green",   img: "/pkg-spawner-key.webp", frame: "/frames/spawner-key.png", isKey: true },
  { id: "mega-key",    name: "Mega Key",    bonus: "RARE",   price: "₹39", tone: "cyan",    img: "/pkg-mega-key.webp",    frame: "/frames/mega-key.png",    isKey: true },
  { id: "crazy-key",   name: "Crazy Key",   bonus: "EPIC",   price: "₹69", tone: "magenta", img: "/pkg-crazy-key.webp",   frame: "/frames/crazy-key.png",   isKey: true },
];

// Two sections: ranks (first 6) + keys (last 3)
const RANKS = PACKAGES.filter((p) => !p.isKey);
const KEYS = PACKAGES.filter((p) => p.isKey);

const TONES = {
  cyan:    { border: "#22D3EE", bg: "linear-gradient(180deg, rgba(34,211,238,0.18), rgba(14,28,40,0.7))", text: "#67E8F9" },
  gold:    { border: "#E9C93F", bg: "linear-gradient(180deg, rgba(233,201,63,0.18), rgba(40,34,12,0.7))", text: "#FFD700" },
  indigo:  { border: "#6366F1", bg: "linear-gradient(180deg, rgba(99,102,241,0.22), rgba(18,18,40,0.7))", text: "#A5B4FC" },
  fire:    { border: "#F97316", bg: "linear-gradient(180deg, rgba(249,115,22,0.22), rgba(40,18,14,0.7))", text: "#FB923C" },
  green:   { border: "#22C55E", bg: "linear-gradient(180deg, rgba(34,197,94,0.22), rgba(18,28,20,0.7))", text: "#4ADE80" },
  magenta: { border: "#C026D3", bg: "linear-gradient(180deg, rgba(192,38,211,0.22), rgba(32,16,38,0.7))", text: "#E879F9" },
};

// The new logo art is tightly cropped to its actual crystal-splash silhouette
// (transparent background, no padding) but each rank/key has a different
// width:height ratio. Sizing by a fixed HEIGHT (not a fixed square box) means
// every icon fills the box's full height with zero width cropping, and since
// the art is wider than it is tall, it naturally bleeds a little past the
// nominal footprint — the "crystals sticking out of the box" effect.
function PkgIcon({ pkg, size = 60 }) {
  return (
    <div style={{ width: size, height: size, position: "relative", flexShrink: 0 }}>
      <img
        src={pkg.img}
        alt={pkg.name}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          height: "100%",
          width: "auto",
          maxWidth: "none",
          objectFit: "contain",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

function PackageModal({ open, onClose, pkg, username }) {
  if (!open || !pkg) return null;
  const t = TONES[pkg.tone] || TONES.cyan;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(8,6,14,0.72)", backdropFilter: "blur(6px)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 50 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 480, background: "#1c1726", borderTop: `1px solid ${t.border}`, borderRadius: "20px 20px 0 0", padding: "28px 22px 26px" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", padding: 4 }}><X size={20} /></button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
          <PkgIcon pkg={pkg} size={54} />
          <div>
            <h3 style={{ fontFamily: MC, fontSize: 22, fontWeight: 700, color: t.text, margin: 0 }}>{pkg.name}</h3>
            <p style={{ fontFamily: NORMAL, color: "rgba(255,255,255,0.5)", fontSize: 14, margin: "2px 0 0" }}>
              {pkg.price}
            </p>
          </div>
        </div>
        {username ? (
          <>
            <p style={{ fontFamily: NORMAL, color: "rgba(255,255,255,0.7)", fontSize: 15, textAlign: "center", marginBottom: 20 }}>
              Purchasing for: <strong style={{ color: t.text }}>{username}</strong>
            </p>
            <button style={{ width: "100%", background: t.border, border: "none", borderRadius: 12, padding: "16px", color: "#0e0a15", fontFamily: MC, fontWeight: 700, fontSize: 18, cursor: "pointer" }} onClick={() => { window.open(DISCORD_URL, "_blank"); onClose(); }}>
              PROCEED TO PAYMENT · <span style={{ fontFamily: NORMAL }}>{pkg.price}</span>
            </button>
          </>
        ) : (
          <button style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "16px", color: "rgba(255,255,255,0.4)", fontFamily: MC, fontWeight: 700, fontSize: 16, cursor: "not-allowed" }}>
            LOGIN REQUIRED
          </button>
        )}
      </div>
    </div>
  );
}

export default function CrazySMPStore() {
  const router = useRouter();
  const [modalPkg, setModalPkg] = useState(null);
  const [username, setUsername] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [skinHead, setSkinHead] = useState("/steve-face.png");

  // Login now happens on its own page (/login) instead of a fixed overlay —
  // pick up whatever it saved whenever this page mounts (including when
  // navigating back here after logging in).
  useEffect(() => {
    const saved = localStorage.getItem("crazysmp_username");
    if (saved) setUsername(saved);
  }, []);

  useEffect(() => {
    if (username) {
      const cleanName = username.replace(/^\./, "");
      setSkinHead(`https://minotar.net/avatar/${cleanName}/128`);
    } else {
      setSkinHead("/steve-face.png");
    }
  }, [username]);

  // Preload all images on mount so menu navigation is instant — includes
  // both the old package thumbnails AND the new card-frame images.
  useEffect(() => {
    const imagesToPreload = [
      LOGO, BG, LOGIN_BG, "/steve-face.png",
      ...PACKAGES.map((p) => p.img),
      ...PACKAGES.map((p) => p.frame),
    ];
    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <div className="csmp-root" style={{ fontFamily: MC, background: "#141019", color: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.cdnfonts.com/css/minecraft-4');
        * { box-sizing: border-box; }
        .csmp-root { max-width: 480px; margin: 0 auto; }
        @media (min-width: 900px) {
          .csmp-root { max-width: 1200px; }
        }
        .csmp-hero {
          position: relative;
          background-image: linear-gradient(180deg, rgba(15,10,22,0.2) 0%, rgba(15,10,22,0.35) 30%, rgba(15,10,22,0.6) 60%, rgba(20,16,25,0.9) 85%, #141019 100%), url(${BG});
          background-size: cover;
          background-position: center;
          padding-bottom: 60px;
        }
        @media (min-width: 900px) {
          .csmp-hero {
            background-image: linear-gradient(180deg, rgba(15,10,22,0.1) 0%, rgba(15,10,22,0.45) 55%, #141019 100%),
              radial-gradient(circle at 22% 20%, rgba(124,58,237,0.4), transparent 55%),
              radial-gradient(circle at 82% 80%, rgba(37,99,235,0.32), transparent 55%),
              linear-gradient(160deg, #1a1025 0%, #150d24 45%, #0a0812 100%);
            padding: 30px 20px 80px;
          }
        }
        .csmp-logo-img { width: 78%; max-width: 300px; }
        @media (min-width: 900px) {
          .csmp-logo-img { max-width: 340px; }
        }
        @keyframes portalGlow {
          0%, 100% { filter: drop-shadow(0 0 18px rgba(34,211,238,0.5)) drop-shadow(0 0 40px rgba(34,211,238,0.3)); }
          50% { filter: drop-shadow(0 0 28px rgba(34,211,238,0.8)) drop-shadow(0 0 60px rgba(34,211,238,0.5)); }
        }
        /* Minecraft font smoothing — pixel fonts look best without antialiasing */
        body { -webkit-font-smoothing: none; font-smooth: never; }
      `}</style>

      {/* HERO */}
      <div className="csmp-hero">
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10, padding: "20px 20px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => router.push("/login")}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: MC, fontSize: 16, fontWeight: 700, color: "#fff" }}>{username || "Guest"}</div>
              <div style={{ fontFamily: MC, fontSize: 12, color: "#22D3EE", letterSpacing: 0.5 }}>{username ? "TAP TO EDIT" : "CLICK TO LOGIN"}</div>
            </div>
            <img src={skinHead} alt="Head" style={{ width: 40, height: 40, borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)" }} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", padding: "24px 0 30px" }}>
          <img src={LOGO} alt="CrazySMP logo" className="csmp-logo-img" style={{ animation: "portalGlow 3.2s ease-in-out infinite" }} />
        </div>
      </div>

      {/* RANKS — QuackForge-style card system (replaces old pricing bar) */}
      <div style={{ flex: 1 }}>
        <CardSection
          title="Ranks"
          subtitle="01 · RANKS"
          packages={RANKS}
          onChoose={(pkg) => setModalPkg(pkg)}
        />

        {/* KEYS — second section, same card system */}
        <CardSection
          title="Crate Keys"
          subtitle="02 · KEYS"
          packages={KEYS}
          onChoose={(pkg) => setModalPkg(pkg)}
        />
      </div>

      {/* FOOTER — store-only page, just credits + text-only Terms/Privacy links
          (sits at very bottom of viewport because main wrapper is flex column) */}
      <div style={{ padding: "24px 20px 34px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "auto" }}>
        <div style={{ fontFamily: MC, fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginTop: 16 }}>Copyright © CrazySMP 2026. All Rights Reserved.</div>
        <div style={{ fontFamily: MC, fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>We are not affiliated with Mojang AB.</div>
        <div style={{ fontFamily: MC, fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 10, lineHeight: 1.6 }}>
          By using our store you agree to our{" "}
          <a onClick={() => setShowTerms(true)} style={{ color: "rgba(34,211,238,0.7)", cursor: "pointer", textDecoration: "underline" }}>Terms</a>{" "}
          and{" "}
          <a onClick={() => setShowPrivacy(true)} style={{ color: "rgba(34,211,238,0.7)", cursor: "pointer", textDecoration: "underline" }}>Privacy Policy</a>.
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 14, color: "rgba(255,255,255,0.3)", fontSize: 12, fontFamily: MC }}>
          <ShieldCheck size={14} /> Checkout secured by a trusted payment processor
        </div>
      </div>

      {/* Floating Discord button (circular, blur popup, scroll hide/show) */}
      <DiscordFab />

      <PackageModal open={!!modalPkg} onClose={() => setModalPkg(null)} pkg={modalPkg} username={username} />

      {/* Terms & Privacy modals */}
      {showTerms && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(8,6,14,0.8)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 20 }} onClick={() => setShowTerms(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480, maxHeight: "80vh", overflowY: "auto", background: "#1c1726", borderRadius: 16, padding: 24, border: "1px solid rgba(34,211,238,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: MC, fontSize: 22, fontWeight: 700, color: "#22D3EE", margin: 0 }}>Terms & Conditions</h3>
              <button onClick={() => setShowTerms(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ fontFamily: MC, fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.7)" }}>
              <p><strong>1. Acceptance</strong></p><p>By purchasing, you agree to these terms.</p>
              <p><strong>2. Digital Goods</strong></p><p>All purchases are for digital goods within CrazySMP.</p>
              <p><strong>3. No Refunds</strong></p><p>All payments final. Chargebacks = permanent ban.</p>
              <p><strong>4. Delivery</strong></p><p>Credited within 1-20 minutes.</p>
              <p><strong>5. Account</strong></p><p>Purchases tied to username provided.</p>
              <p><strong>6. Not Mojang</strong></p><p>Not affiliated with Mojang or Microsoft.</p>
            </div>
          </div>
        </div>
      )}
      {showPrivacy && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(8,6,14,0.8)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 20 }} onClick={() => setShowPrivacy(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480, maxHeight: "80vh", overflowY: "auto", background: "#1c1726", borderRadius: 16, padding: 24, border: "1px solid rgba(34,211,238,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: MC, fontSize: 22, fontWeight: 700, color: "#22D3EE", margin: 0 }}>Privacy Policy</h3>
              <button onClick={() => setShowPrivacy(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ fontFamily: MC, fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.7)" }}>
              <p><strong>1. Data</strong></p><p>We collect your MC username and payment confirmation only.</p>
              <p><strong>2. Storage</strong></p><p>Securely stored, accessible only to authorized staff.</p>
              <p><strong>3. Deletion</strong></p><p>Request deletion via Discord ticket.</p>
              <p><strong>4. Contact</strong></p><p>contact@crazysmp.bond</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
