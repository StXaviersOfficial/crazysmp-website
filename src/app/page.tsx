"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, X } from "lucide-react";
import { DiscordFab } from "@/components/discord-fab";

const LOGO = "/store-logo-new.webp";
const BG = "/crazysmp-bg-new.webp";
const LOGIN_BG = "/login-bg.png";
const DISCORD_URL = "https://discord.gg/GFzAeUj7TJ";

// Minecraft font family — applied to every text element on the page.
// Falls back to Inter / monospace if the web font fails to load.
const MC = "'Minecraft', 'Inter', monospace";

const PACKAGES = [
  // Ranks: bonus is now a tier image index (1-6) + a diamond badge.
  // Keys: bonus is a rarity word (COMMON/RARE/EPIC) — no tier badge.
  { id: "vip",       name: "VIP Rank",       tier: 1, price: "₹199",   tone: "cyan",    img: "/pkg-vip.png",        isKey: false },
  { id: "legend",    name: "LEGEND Rank",    tier: 2, price: "₹399",   tone: "gold",    img: "/pkg-legend.png",     isKey: false },
  { id: "immortal",  name: "IMMORTAL Rank",  tier: 3, price: "₹699",   tone: "indigo",  img: "/pkg-immortal.png",   isKey: false },
  { id: "titan",     name: "TITAN Rank",     tier: 4, price: "₹999",   tone: "fire",    img: "/pkg-titan.png",      isKey: false },
  { id: "techno",   name: "TECHNO Rank",    tier: 5, price: "₹1499",  tone: "green",   img: "/pkg-techno.png",     isKey: false },
  { id: "crazy",     name: "CRAZY Rank",     tier: 6, price: "₹2499",  tone: "magenta", img: "/pkg-crazy.png",      isKey: false },
  // 3-way rotation: Spawner←Crazy, Crazy←Mega, Mega←Spawner (img + tone only)
  { id: "spawner-key", name: "Spawner Key", bonus: "COMMON", price: "₹99",  tone: "green",   img: "/pkg-crazy-key.png",   isKey: true },
  { id: "mega-key",    name: "Mega Key",    bonus: "RARE",   price: "₹299", tone: "cyan",    img: "/pkg-spawner-key.png", isKey: true },
  { id: "crazy-key",   name: "Crazy Key",   bonus: "EPIC",   price: "₹499", tone: "magenta", img: "/pkg-mega-key.png",    isKey: true },
];

const TONES = {
  cyan:    { border: "#22D3EE", bg: "linear-gradient(180deg, rgba(34,211,238,0.18), rgba(14,28,40,0.7))", text: "#67E8F9" },
  gold:    { border: "#E9C93F", bg: "linear-gradient(180deg, rgba(233,201,63,0.18), rgba(40,34,12,0.7))", text: "#FFD700" },
  indigo:  { border: "#6366F1", bg: "linear-gradient(180deg, rgba(99,102,241,0.22), rgba(18,18,40,0.7))", text: "#A5B4FC" },
  fire:    { border: "#F97316", bg: "linear-gradient(180deg, rgba(249,115,22,0.22), rgba(40,18,14,0.7))", text: "#FB923C" },
  green:   { border: "#22C55E", bg: "linear-gradient(180deg, rgba(34,197,94,0.22), rgba(18,28,20,0.7))", text: "#4ADE80" },
  magenta: { border: "#C026D3", bg: "linear-gradient(180deg, rgba(192,38,211,0.22), rgba(32,16,38,0.7))", text: "#E879F9" },
};

function FullScreenLogin({ open, onClose, onLogin }) {
  const [username, setUsername] = useState("");
  if (!open) return null;

  // Coordinates measured directly from login-bg.png (450x800) via pixel
  // color sampling. Each box includes the glowing crystal border so the
  // whole visual box is clickable.
  const BOX1 = { left: 14.67, top: 54.375, width: 72,    height: 8.5 };    // username
  const BOX3 = { left: 13.78, top: 72.375, width: 72.9, height: 7.875 }; // continue
  // Bedrock toggle (BOX2) has been REMOVED entirely per user request.

  // Only letters, digits, and underscore are valid Minecraft username chars.
  const sanitize = (raw) => {
    return raw.replace(/[^A-Za-z0-9_]/g, "").slice(0, 16);
  };

  const handleSubmit = () => {
    const clean = username.trim();
    if (!clean) return;
    onLogin(clean);
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0F0F13", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.cdnfonts.com/css/minecraft-4');
      `}</style>

      <button onClick={onClose} style={{ position: "fixed", top: 20, right: 20, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 50, width: 40, height: 40, color: "rgba(255,255,255,0.6)", cursor: "pointer", zIndex: 101, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <X size={20} />
      </button>

      {/* Login page image with overlays — fits viewport exactly, no scrolling */}
      <div style={{ position: "relative", height: "min(100dvh, 177.78vw)", aspectRatio: "450 / 800", maxWidth: "100%", maxHeight: "100dvh" }}>
        <img src={LOGIN_BG} alt="Login" style={{ width: "100%", height: "100%", display: "block", objectFit: "contain" }} />

        {/* Box 1: Username — entire box clickable, input sits right of the head icon */}
        <div
          style={{ position: "absolute", left: `${BOX1.left}%`, top: `${BOX1.top}%`, width: `${BOX1.width}%`, height: `${BOX1.height}%`, display: "flex", alignItems: "center", cursor: "text" }}
          onClick={(e) => { const input = e.currentTarget.querySelector("input"); if (input) input.focus(); }}
        >
          <input
            value={username}
            onChange={(e) => setUsername(sanitize(e.target.value))}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Username"
            maxLength={16}
            style={{
              width: "100%",
              height: "70%",
              marginLeft: "19%",
              paddingRight: "6%",
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontFamily: MC,
              fontWeight: 400,
              fontSize: 16,
              letterSpacing: 0.5,
              caretColor: "#a855f7",
              transform: "translateY(5px)",
            }}
          />
        </div>

        {/* Box 2 (bedrock toggle) — REMOVED entirely */}

        {/* Box 3: Continue — whole box clickable, glowing text, shifted 2px UP */}
        <button
          onClick={handleSubmit}
          disabled={!username.trim()}
          style={{
            position: "absolute",
            left: `${BOX3.left}%`,
            top: `${BOX3.top}%`,
            width: `${BOX3.width}%`,
            height: `${BOX3.height}%`,
            background: "transparent",
            border: "none",
            cursor: username.trim() ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: MC,
              fontSize: 22,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: 3,
              textShadow: "0 0 6px #fff, 0 0 16px #e879f9, 0 0 28px #c026d3, 0 0 42px #a21caf",
              opacity: username.trim() ? 1 : 0.55,
              // 2px UP from current position (was translateY(5px), now translateY(3px))
              transform: "translateY(3px)",
              display: "inline-block",
            }}
          >
            CONTINUE
          </span>
        </button>
      </div>
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
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <img src={pkg.img} alt={pkg.name} style={{ width: 64, height: 64, borderRadius: 14, objectFit: "cover" }} />
          <div>
            <h3 style={{ fontFamily: MC, fontSize: 22, fontWeight: 700, color: t.text, margin: 0 }}>{pkg.name}</h3>
            <p style={{ fontFamily: MC, color: "rgba(255,255,255,0.5)", fontSize: 14, margin: "2px 0 0" }}>
              {pkg.isKey ? pkg.bonus : `Tier ${pkg.tier}`} · {pkg.price}
            </p>
          </div>
        </div>
        {username ? (
          <>
            <p style={{ fontFamily: MC, color: "rgba(255,255,255,0.7)", fontSize: 15, textAlign: "center", marginBottom: 20 }}>
              Purchasing for: <strong style={{ color: t.text }}>{username}</strong>
            </p>
            <button style={{ width: "100%", background: t.border, border: "none", borderRadius: 12, padding: "16px", color: "#0e0a15", fontFamily: MC, fontWeight: 700, fontSize: 18, cursor: "pointer" }} onClick={() => { window.open(DISCORD_URL, "_blank"); onClose(); }}>
              PROCEED TO PAYMENT · {pkg.price}
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
  const [modalPkg, setModalPkg] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [skinHead, setSkinHead] = useState("/steve-face.png");

  useEffect(() => {
    if (username) {
      const cleanName = username.replace(/^\./, "");
      setSkinHead(`https://minotar.net/avatar/${cleanName}/128`);
    } else {
      setSkinHead("/steve-face.png");
    }
  }, [username]);

  // Preload all images on mount so menu navigation is instant
  useEffect(() => {
    const imagesToPreload = [
      LOGO, BG, LOGIN_BG, "/steve-face.png",
      "/tiers/tier-1.png", "/tiers/tier-2.png", "/tiers/tier-3.png",
      "/tiers/tier-4.png", "/tiers/tier-5.png", "/tiers/tier-6.png",
      "/tiers/diamond.png",
      ...PACKAGES.map((p) => p.img),
    ];
    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <div style={{ fontFamily: MC, background: "#141019", color: "#fff", minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.cdnfonts.com/css/minecraft-4');
        * { box-sizing: border-box; }
        @keyframes portalGlow {
          0%, 100% { filter: drop-shadow(0 0 18px rgba(34,211,238,0.5)) drop-shadow(0 0 40px rgba(34,211,238,0.3)); }
          50% { filter: drop-shadow(0 0 28px rgba(34,211,238,0.8)) drop-shadow(0 0 60px rgba(34,211,238,0.5)); }
        }
        .csmp-pkg-card:active { transform: scale(0.98); }
        .csmp-btn:active { transform: scale(0.97); }
        /* Minecraft font smoothing — pixel fonts look best without antialiasing */
        body { -webkit-font-smoothing: none; font-smooth: never; }
      `}</style>

      {/* HERO */}
      <div style={{ position: "relative", backgroundImage: `linear-gradient(180deg, rgba(15,10,22,0.2) 0%, rgba(15,10,22,0.35) 30%, rgba(15,10,22,0.6) 60%, rgba(20,16,25,0.9) 85%, #141019 100%), url(${BG})`, backgroundSize: "cover", backgroundPosition: "center", paddingBottom: 60 }}>
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10, padding: "20px 20px 0" }}>
          <div style={{ textAlign: "right", cursor: "pointer" }} onClick={() => setShowLogin(true)}>
            <div style={{ fontFamily: MC, fontSize: 16, fontWeight: 700, color: "#fff" }}>{username || "Guest"}</div>
            <div style={{ fontFamily: MC, fontSize: 12, color: "#22D3EE", letterSpacing: 0.5 }}>{username ? "TAP TO EDIT" : "CLICK TO LOGIN"}</div>
          </div>
          <img src={skinHead} alt="Head" style={{ width: 40, height: 40, borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer" }} onClick={() => setShowLogin(true)} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", padding: "24px 0 30px" }}>
          <img src={LOGO} alt="CrazySMP logo" style={{ width: "78%", maxWidth: 300, animation: "portalGlow 3.2s ease-in-out infinite" }} />
        </div>
      </div>

      {/* FEATURED PACKAGES */}
      <div style={{ padding: "50px 20px 8px" }}>
        <h2 style={{ fontFamily: MC, fontSize: 26, fontWeight: 700, color: "#22D3EE", margin: "0 0 18px", letterSpacing: 0.5 }}>Featured Packages</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {PACKAGES.map((pkg) => {
            const t = TONES[pkg.tone] || TONES.cyan;
            // Shift 3 key cards 5px to the left
            const keyShift = pkg.isKey ? { marginLeft: -5 } : {};
            return (
              <button
                key={pkg.id}
                className="csmp-pkg-card"
                onClick={() => setModalPkg(pkg)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  textAlign: "left",
                  background: t.bg,
                  border: `1.5px solid ${t.border}`,
                  borderRadius: 14,
                  padding: 16,
                  cursor: "pointer",
                  color: "inherit",
                  font: "inherit",
                  ...keyShift,
                }}
              >
                <img src={pkg.img} alt={pkg.name} style={{ width: 72, height: 72, borderRadius: 14, flexShrink: 0, objectFit: "cover" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: MC, fontSize: 18, fontWeight: 700, color: t.text, lineHeight: 1.25, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    {pkg.name}
                    {/* Tier badge: roman numeral image + diamond badge (ranks only) */}
                    {pkg.isKey ? (
                      <span style={{ fontWeight: 700, fontSize: 13, opacity: 0.8, color: t.text }}>({pkg.bonus})</span>
                    ) : (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <img src={`/tiers/tier-${pkg.tier}.png`} alt={`Tier ${pkg.tier}`} style={{ height: 22, width: "auto", verticalAlign: "middle" }} />
                        <img src="/tiers/diamond.png" alt="Diamond" style={{ height: 18, width: 18, verticalAlign: "middle" }} />
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: MC, fontSize: 16, fontWeight: 700, color: "#fff", marginTop: 4 }}>{pkg.price}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* FOOTER — store-only page, just credits + text-only Terms/Privacy links */}
      <div style={{ padding: "24px 20px 34px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
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

      <FullScreenLogin open={showLogin} onClose={() => setShowLogin(false)} onLogin={(name) => setUsername(name)} />
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
