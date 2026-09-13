"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, X } from "lucide-react";
const LOGO = "/store-logo-new.webp";
const BG = "/crazysmp-bg-new.webp";
const LOGIN_BG = "/login-bg.png";
const DISCORD_URL = "https://discord.gg/GFzAeUj7TJ";

const PACKAGES = [
  { id: "vip", name: "VIP Rank", bonus: "Tier I · NEW", price: "₹199", tone: "cyan", img: "/pkg-vip.png" },
  { id: "legend", name: "LEGEND Rank", bonus: "Tier II · STARTER", price: "₹399", tone: "gold", img: "/pkg-legend.png" },
  { id: "immortal", name: "IMMORTAL Rank", bonus: "Tier III · EXPERT", price: "₹699", tone: "indigo", img: "/pkg-immortal.png" },
  { id: "titan", name: "TITAN Rank", bonus: "Tier IV · MASTER", price: "₹999", tone: "fire", img: "/pkg-titan.png" },
  { id: "techno", name: "TECHNO Rank", bonus: "Tier V · ELITE", price: "₹1499", tone: "green", img: "/pkg-techno.png" },
  { id: "crazy", name: "CRAZY Rank", bonus: "Tier VI · MAX", price: "₹2499", tone: "magenta", img: "/pkg-crazy.png" },
  { id: "spawner-key", name: "Spawner Key", bonus: "COMMON", price: "₹99", tone: "cyan", img: "/pkg-spawner-key.png" },
  { id: "mega-key", name: "Mega Key", bonus: "RARE", price: "₹299", tone: "magenta", img: "/pkg-mega-key.png" },
  { id: "crazy-key", name: "Crazy Key", bonus: "EPIC", price: "₹499", tone: "green", img: "/pkg-crazy-key.png" },
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
  const [bedrock, setBedrock] = useState(false);
  if (!open) return null;

  // Login page image is 450x800. We display it centered and overlay interactive elements.
  // Coordinates from VLM analysis:
  // Section 1 (username box): x=65, y=568, w=320, h=75
  //   Steve icon: x=185, y=597, w=45, h=50 → input goes right of it: x=245, y=585, w=130, h=40
  // Section 2 (bedrock toggle): x=115, y=660, w=220, h=55
  // Section 3 (continue button): x=65, y=740, w=320, h=80

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0F0F13", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", overflow: "auto" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700;800&family=Orbitron:wght@600;700;800;900&display=swap');`}</style>
      
      <button onClick={onClose} style={{ position: "fixed", top: 20, right: 20, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 50, width: 40, height: 40, color: "rgba(255,255,255,0.6)", cursor: "pointer", zIndex: 101, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <X size={20} />
      </button>

      {/* Login page image with overlays */}
      <div style={{ position: "relative", width: 450, maxWidth: "100%" }}>
        <img src={LOGIN_BG} alt="Login" style={{ width: "100%", height: "auto", display: "block" }} useMap="#loginmap" />
        
        {/* Section 1: Username input — overlay on the box */}
        <div style={{ position: "absolute", left: "14.4%", top: "71%", width: "71.1%", height: "9.4%", display: "flex", alignItems: "center", cursor: "text" }}
             onClick={(e) => { const input = e.currentTarget.querySelector('input'); if (input) input.focus(); }}>
          {/* Input field — positioned to the right of the Steve icon */}
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && bedrock !== null && handleSubmit()}
            placeholder=""
            style={{
              position: "absolute",
              left: "40%",
              top: "20%",
              width: "55%",
              height: "60%",
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontFamily: "'Inter', sans-serif",
              fontSize: 16,
              caretColor: "#22D3EE",
            }}
          />
        </div>

        {/* Section 2: Bedrock toggle */}
        <button
          onClick={() => setBedrock(!bedrock)}
          style={{
            position: "absolute",
            left: "25.6%",
            top: "82.5%",
            width: "48.9%",
            height: "6.9%",
            background: bedrock ? "rgba(34,197,94,0.3)" : "transparent",
            border: "none",
            cursor: "pointer",
            borderRadius: 8,
          }}
        >
          {bedrock && (
            <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#4ADE80", fontSize: 18, fontFamily: "'Baloo 2', sans-serif", fontWeight: 700 }}>✓</span>
          )}
        </button>

        {/* Section 3: Continue button */}
        <button
          onClick={() => { if (username.trim()) { const name = bedrock ? `.${username.trim()}` : username.trim(); onLogin(name); onClose(); } }}
          disabled={!username.trim()}
          style={{
            position: "absolute",
            left: "14.4%",
            top: "92.5%",
            width: "71.1%",
            height: "10%",
            background: username.trim() ? "rgba(192,38,211,0.3)" : "transparent",
            border: "none",
            cursor: username.trim() ? "pointer" : "default",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {username.trim() && (
            <span style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 20,
              fontWeight: 800,
              color: "#fff",
              textShadow: "0 0 10px rgba(192,38,211,0.8), 0 0 20px rgba(192,38,211,0.5)",
              letterSpacing: 2,
            }}>
              CONTINUE
            </span>
          )}
        </button>

        {/* Bedrock username preview */}
        {bedrock && username.trim() && (
          <div style={{
            position: "absolute",
            left: "14.4%",
            top: "90%",
            width: "71.1%",
            textAlign: "center",
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
            color: "rgba(74,222,128,0.7)",
          }}>
            .{username.trim()}
          </div>
        )}
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
            <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 22, color: t.text, margin: 0 }}>{pkg.name}</h3>
            <p style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.5)", fontSize: 14, margin: "2px 0 0" }}>{pkg.bonus} · {pkg.price}</p>
          </div>
        </div>
        {username ? (
          <>
            <p style={{ fontFamily: "'Nunito', sans-serif", color: "rgba(255,255,255,0.7)", fontSize: 15, textAlign: "center", marginBottom: 20 }}>
              Purchasing for: <strong style={{ color: t.text }}>{username}</strong>
            </p>
            <button style={{ width: "100%", background: t.border, border: "none", borderRadius: 12, padding: "16px", color: "#0e0a15", fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 18, cursor: "pointer" }} onClick={() => { window.open(DISCORD_URL, "_blank"); onClose(); }}>
              PROCEED TO PAYMENT · {pkg.price}
            </button>
          </>
        ) : (
          <button style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "16px", color: "rgba(255,255,255,0.4)", fontFamily: "'Baloo 2', sans-serif", fontWeight: 600, fontSize: 16, cursor: "not-allowed" }}>
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

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: "#141019", color: "#fff", minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative", overflow: "hidden" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700;800&family=Orbitron:wght@600;700;800;900&display=swap'); * { box-sizing: border-box; } @keyframes portalGlow { 0%, 100% { filter: drop-shadow(0 0 18px rgba(34,211,238,0.5)) drop-shadow(0 0 40px rgba(34,211,238,0.3)); } 50% { filter: drop-shadow(0 0 28px rgba(34,211,238,0.8)) drop-shadow(0 0 60px rgba(34,211,238,0.5)); } } .csmp-pkg-card:active { transform: scale(0.98); } .csmp-btn:active { transform: scale(0.97); }`}</style>

      {/* HERO */}
      <div style={{ position: "relative", backgroundImage: `linear-gradient(180deg, rgba(15,10,22,0.2) 0%, rgba(15,10,22,0.35) 30%, rgba(15,10,22,0.6) 60%, rgba(20,16,25,0.9) 85%, #141019 100%), url(${BG})`, backgroundSize: "cover", backgroundPosition: "center", paddingBottom: 60 }}>
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10, padding: "20px 20px 0" }}>
          <div style={{ textAlign: "right", cursor: "pointer" }} onClick={() => setShowLogin(true)}>
            <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 16, color: "#fff" }}>{username || "Guest"}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#22D3EE", letterSpacing: 0.3 }}>{username ? "TAP TO EDIT" : "CLICK TO LOGIN"}</div>
          </div>
          <img src={skinHead} alt="Head" style={{ width: 40, height: 40, borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer" }} onClick={() => setShowLogin(true)} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", padding: "24px 0 30px" }}>
          <img src={LOGO} alt="CrazySMP logo" style={{ width: "78%", maxWidth: 300, animation: "portalGlow 3.2s ease-in-out infinite" }} />
        </div>
      </div>

      {/* FEATURED PACKAGES */}
      <div style={{ padding: "50px 20px 8px" }}>
        <h2 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 26, color: "#22D3EE", margin: "0 0 18px", letterSpacing: 0.3 }}>Featured Packages</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {PACKAGES.map((pkg) => {
            const t = TONES[pkg.tone] || TONES.cyan;
            return (
              <button key={pkg.id} className="csmp-pkg-card" onClick={() => setModalPkg(pkg)} style={{ display: "flex", alignItems: "center", gap: 16, textAlign: "left", background: t.bg, border: `1.5px solid ${t.border}`, borderRadius: 14, padding: 16, cursor: "pointer", color: "inherit", font: "inherit" }}>
                <img src={pkg.img} alt={pkg.name} style={{ width: 72, height: 72, borderRadius: 14, flexShrink: 0, objectFit: "cover" }} />
                <div>
                  <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 18, fontWeight: 700, color: t.text, lineHeight: 1.25 }}>{pkg.name} <span style={{ fontWeight: 600, fontSize: 14, opacity: 0.7 }}>({pkg.bonus})</span></div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 700, color: "#fff", marginTop: 4 }}>{pkg.price}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* WELCOME */}
      <div style={{ padding: "34px 20px 8px" }}>
        <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 13, color: "#22D3EE", letterSpacing: 1, marginBottom: 6 }}>Welcome to the official</div>
        <h2 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 30, color: "#22D3EE", margin: "0 0 16px" }}>CrazySMP Store</h2>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.75)", margin: 0 }}>CrazySMP is a free-to-play public Minecraft server. Items purchased here support the server and grant special perks in-game.</p>
      </div>

      {/* SUPPORT — Discord logo + text */}
      <div style={{ padding: "30px 20px 8px" }}>
        <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 22, color: "#22D3EE", margin: "0 0 14px" }}>Support</h3>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.75)", margin: "0 0 18px" }}>Need help? Open a support ticket on Discord, or email <a href="mailto:contact@crazysmp.bond" style={{ color: "#22D3EE" }}>contact@crazysmp.bond</a></p>
        <a href={DISCORD_URL} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#5865F2", border: "none", borderRadius: 10, padding: "14px 24px", color: "#fff", fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer", textDecoration: "none" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
          Discord
        </a>
      </div>

      {/* REFUND POLICY */}
      <div style={{ padding: "30px 20px 8px" }}>
        <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 22, color: "#e0596a", margin: "0 0 14px" }}>Refund Policy</h3>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.75)", margin: "0 0 14px" }}>All payments are final and non-refundable. Chargebacks = <strong style={{ color: "#fff" }}>permanent ban</strong>.</p>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.75)", margin: 0 }}>Purchases credited within 1–20 minutes. Open a ticket if delayed.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
          <button className="csmp-btn" onClick={() => setShowTerms(true)} style={{ background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.4)", borderRadius: 10, padding: "13px 16px", color: "#67E8F9", fontFamily: "'Baloo 2', sans-serif", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Terms and Conditions</button>
          <button className="csmp-btn" onClick={() => setShowPrivacy(true)} style={{ background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.4)", borderRadius: 10, padding: "13px 16px", color: "#67E8F9", fontFamily: "'Baloo 2', sans-serif", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Privacy Policy</button>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ padding: "10px 20px 34px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 16 }}>Copyright &copy; CrazySMP 2026. All Rights Reserved.</div>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>We are not affiliated with Mojang AB.</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 14, color: "rgba(255,255,255,0.3)", fontSize: 12, fontFamily: "'Inter', sans-serif" }}>
          <ShieldCheck size={14} /> Checkout secured by a trusted payment processor
        </div>
      </div>

      <FullScreenLogin open={showLogin} onClose={() => setShowLogin(false)} onLogin={(name) => setUsername(name)} />
      <PackageModal open={!!modalPkg} onClose={() => setModalPkg(null)} pkg={modalPkg} username={username} />

      {/* Terms & Privacy modals */}
      {showTerms && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(8,6,14,0.8)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 20 }} onClick={() => setShowTerms(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480, maxHeight: "80vh", overflowY: "auto", background: "#1c1726", borderRadius: 16, padding: 24, border: "1px solid rgba(34,211,238,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 22, color: "#22D3EE", margin: 0 }}>Terms & Conditions</h3>
              <button onClick={() => setShowTerms(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.7)" }}>
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
              <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 22, color: "#22D3EE", margin: 0 }}>Privacy Policy</h3>
              <button onClick={() => setShowPrivacy(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.7)" }}>
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
