"use client";

import React, { useState } from "react";
import { MessageCircle, ShieldCheck, X, ChevronDown } from "lucide-react";
const LOGO = "/crazysmp-logo.webp";
const BG = "/crazysmp-bg.webp";
const STEVE = "/steve-face.png";
const DISCORD_URL = "https://discord.gg/GFzAeUj7TJ";

const PACKAGES = [
  { id: "vip", name: "VIP Rank", bonus: "Tier I · NEW", price: "5.00 USD", tone: "cyan", img: "/pkg-vip.png" },
  { id: "legend", name: "LEGEND Rank", bonus: "Tier II · STARTER", price: "10.00 USD", tone: "cyan", img: "/pkg-legend.png" },
  { id: "immortal", name: "IMMORTAL Rank", bonus: "Tier III · EXPERT", price: "15.00 USD", tone: "blue", img: "/pkg-immortal.png" },
  { id: "titan", name: "TITAN Rank", bonus: "Tier IV · MASTER", price: "25.00 USD", tone: "blue", img: "/pkg-titan.png" },
  { id: "techno", name: "TECHNO Rank", bonus: "Tier V · ELITE", price: "35.00 USD", tone: "purple", img: "/pkg-techno.png" },
  { id: "crazy", name: "CRAZY Rank", bonus: "Tier VI · MAX", price: "50.00 USD", tone: "purple", img: "/pkg-crazy.png" },
  { id: "spawner-key", name: "Spawner Key", bonus: "COMMON", price: "3.00 USD", tone: "green", img: "/pkg-spawner-key.png" },
  { id: "mega-key", name: "Mega Key", bonus: "RARE", price: "7.00 USD", tone: "gold", img: "/pkg-mega-key.png" },
  { id: "crazy-key", name: "Crazy Key", bonus: "EPIC", price: "12.00 USD", tone: "purple", img: "/pkg-crazy-key.png" },
];

const TONES = {
  cyan: { border: "#22D3EE", bg: "linear-gradient(180deg, rgba(34,211,238,0.18), rgba(14,28,40,0.7))", text: "#67E8F9" },
  blue: { border: "#3B82F6", bg: "linear-gradient(180deg, rgba(59,130,246,0.22), rgba(14,18,40,0.7))", text: "#93C5FD" },
  purple: { border: "#9b4de0", bg: "linear-gradient(180deg, rgba(155,77,224,0.22), rgba(24,16,32,0.7))", text: "#c98bff" },
  green: { border: "#3fae4a", bg: "linear-gradient(180deg, rgba(63,174,74,0.22), rgba(20,26,18,0.7))", text: "#6bdc76" },
  gold: { border: "#b99a1f", bg: "linear-gradient(180deg, rgba(185,154,31,0.24), rgba(28,24,12,0.7))", text: "#e9c93f" },
};

function UsernameModal({ open, onClose, pkg }) {
  const [username, setUsername] = useState("");
  const [bedrock, setBedrock] = useState(false);
  if (!open || !pkg) return null;
  const t = TONES[pkg.tone] || TONES.purple;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(8,6,14,0.72)", backdropFilter: "blur(6px)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 50 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 480, background: "#1c1726", borderTop: `1px solid ${t.border}`, borderRadius: "20px 20px 0 0", padding: "28px 22px 26px", boxShadow: "0 -10px 40px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", padding: 4 }} aria-label="Close"><X size={20} /></button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <img src={pkg.img} alt={pkg.name} style={{ width: 56, height: 56, borderRadius: 12, border: `1px solid ${t.border}` }} />
          <div>
            <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 22, color: t.text, margin: 0 }}>{pkg.name}</h3>
            <p style={{ fontFamily: "'Nunito', sans-serif", color: "rgba(255,255,255,0.5)", fontSize: 14, margin: "2px 0 0" }}>{pkg.price}</p>
          </div>
        </div>
        <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 18, color: "#fff", textAlign: "center", margin: "0 0 8px" }}>Enter your username to continue</h3>
        <p style={{ fontFamily: "'Nunito', sans-serif", color: "rgba(255,255,255,0.55)", textAlign: "center", fontSize: 14, lineHeight: 1.5, margin: "0 0 20px" }}>Usernames can't contain spaces. Any letters and numbers are allowed, and they are case sensitive.</p>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your Minecraft username" style={{ width: "100%", boxSizing: "border-box", background: "#141019", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "14px 16px", color: "#fff", fontFamily: "'Nunito', sans-serif", fontSize: 15, marginBottom: 16, outline: "none" }} />
        <button style={{ width: "100%", background: t.border, border: "none", borderRadius: 10, padding: "14px 16px", color: "#0e0a15", fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: 0.4, cursor: "pointer", marginBottom: 16 }} onClick={() => { const name = bedrock ? `.${username}` : username; if (username.trim()) { window.open(`${DISCORD_URL}`, "_blank"); } onClose(); }}>CONTINUE</button>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: "'Nunito', sans-serif", color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
          Bedrock user?
          <button onClick={() => setBedrock(!bedrock)} style={{ background: bedrock ? t.border : "rgba(233,80,90,0.85)", border: "none", borderRadius: 6, padding: "5px 14px", color: "#fff", fontFamily: "'Baloo 2', sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>{bedrock ? "Yes (. added)" : "No"}</button>
        </div>
      </div>
    </div>
  );
}

export default function CrazySMPStore() {
  const [modalPkg, setModalPkg] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginBedrock, setLoginBedrock] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: "#141019", color: "#fff", minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative", overflow: "hidden" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;600;700;800&display=swap'); * { box-sizing: border-box; } @keyframes portalGlow { 0%, 100% { filter: drop-shadow(0 0 18px rgba(34,211,238,0.5)) drop-shadow(0 0 40px rgba(34,211,238,0.3)); } 50% { filter: drop-shadow(0 0 28px rgba(34,211,238,0.8)) drop-shadow(0 0 60px rgba(34,211,238,0.5)); } } .csmp-pkg-card:active { transform: scale(0.98); } .csmp-btn:active { transform: scale(0.97); }`}</style>

      {/* HERO — extended background */}
      <div style={{ position: "relative", backgroundImage: `linear-gradient(180deg, rgba(15,10,22,0.3) 0%, rgba(15,10,22,0.5) 40%, rgba(20,16,25,0.9) 80%, #141019 100%), url(${BG})`, backgroundSize: "cover", backgroundPosition: "center", padding: "20px 20px 26px" }}>
        {/* Login button — Steve face */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10 }}>
          <div style={{ textAlign: "right", cursor: "pointer" }} onClick={() => setShowLogin(!showLogin)}>
            <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 16, color: "#fff" }}>{loggedIn ? (loginBedrock ? `.${loginUser}` : loginUser) : "Guest"}</div>
            <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 12, color: "#22D3EE", letterSpacing: 0.3 }}>{loggedIn ? "LOGGED IN" : "CLICK TO LOGIN"}</div>
          </div>
          <img src={STEVE} alt="Steve" style={{ width: 40, height: 40, borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer" }} onClick={() => setShowLogin(!showLogin)} />
        </div>

        {/* Login dropdown */}
        {showLogin && !loggedIn && (
          <div style={{ position: "absolute", top: 60, right: 20, width: 260, padding: 16, background: "#1c1726", borderRadius: 12, border: "1px solid rgba(34,211,238,0.3)", zIndex: 100 }}>
            <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 16, color: "#22D3EE", marginBottom: 12 }}>Minecraft Login</h3>
            <input value={loginUser} onChange={(e) => setLoginUser(e.target.value)} placeholder="Username" style={{ width: "100%", marginBottom: 8, padding: "10px 12px", background: "#141019", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#fff", fontFamily: "'Nunito', sans-serif", fontSize: 14 }} />
            <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
              <input type="checkbox" checked={loginBedrock} onChange={(e) => setLoginBedrock(e.target.checked)} style={{ accentColor: "#22D3EE" }} /> Bedrock player (adds . prefix)
            </label>
            <button className="csmp-btn" onClick={() => { if (loginUser.trim()) { setLoggedIn(true); setShowLogin(false); } }} style={{ width: "100%", background: "#22D3EE", border: "none", borderRadius: 8, padding: "10px", color: "#0F0F13", fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>LOGIN</button>
          </div>
        )}

        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", padding: "18px 0 20px" }}>
          <img src={LOGO} alt="CrazySMP logo" style={{ width: "78%", maxWidth: 300, animation: "portalGlow 3.2s ease-in-out infinite" }} />
        </div>
      </div>

      {/* FEATURED PACKAGES */}
      <div style={{ padding: "20px 20px 8px" }}>
        <h2 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 26, color: "#22D3EE", margin: "0 0 18px", letterSpacing: 0.3 }}>Featured Packages</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {PACKAGES.map((pkg) => {
            const t = TONES[pkg.tone] || TONES.cyan;
            return (
              <button key={pkg.id} className="csmp-pkg-card" onClick={() => setModalPkg(pkg)} style={{ display: "flex", alignItems: "center", gap: 16, textAlign: "left", background: t.bg, border: `1.5px solid ${t.border}`, borderRadius: 14, padding: 16, cursor: "pointer", color: "inherit", font: "inherit" }}>
                <img src={pkg.img} alt={pkg.name} style={{ width: 72, height: 72, borderRadius: 14, flexShrink: 0, border: `1px solid ${t.border}` }} />
                <div>
                  <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 18, fontWeight: 700, color: t.text, lineHeight: 1.25 }}>{pkg.name} <span style={{ fontWeight: 600, fontSize: 14, opacity: 0.7 }}>({pkg.bonus})</span></div>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, fontWeight: 800, color: "#fff", marginTop: 4 }}>{pkg.price}</div>
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

      {/* SUPPORT */}
      <div style={{ padding: "30px 20px 8px" }}>
        <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 22, color: "#22D3EE", margin: "0 0 14px" }}>Support</h3>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.75)", margin: "0 0 18px" }}>Need help before checkout, or waited more than 20 minutes without your package arriving? Ask the community or staff on Discord, or open a support ticket for payment issues. You can also reach us at <a href="mailto:contact@crazysmp.bond" style={{ color: "#22D3EE" }}>contact@crazysmp.bond</a>.</p>
        <a href={DISCORD_URL} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#22D3EE", border: "none", borderRadius: 10, padding: "14px 20px", color: "#0F0F13", fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer", textDecoration: "none" }}>
          <MessageCircle size={18} /> Discord Server
        </a>
      </div>

      {/* REFUND POLICY */}
      <div style={{ padding: "30px 20px 8px" }}>
        <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 22, color: "#e0596a", margin: "0 0 14px" }}>Refund Policy</h3>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.75)", margin: "0 0 14px" }}>All payments are final and non-refundable. Attempting a chargeback or opening a dispute will result in a <strong style={{ color: "#fff" }}>permanent ban</strong> from CrazySMP and connected stores.</p>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.75)", margin: 0 }}>Purchases are usually credited within 1–20 minutes. If yours hasn't arrived after that, open a support ticket with proof of purchase.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
          <button className="csmp-btn" onClick={() => setShowTerms(true)} style={{ background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.4)", borderRadius: 10, padding: "13px 16px", color: "#67E8F9", fontFamily: "'Baloo 2', sans-serif", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Terms and Conditions</button>
          <button className="csmp-btn" onClick={() => setShowPrivacy(true)} style={{ background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.4)", borderRadius: 10, padding: "13px 16px", color: "#67E8F9", fontFamily: "'Baloo 2', sans-serif", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Privacy Policy</button>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ padding: "10px 20px 34px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 16 }}>Copyright &copy; CrazySMP 2026. All Rights Reserved.</div>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>We are not affiliated with Mojang AB.</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 14, color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
          <ShieldCheck size={14} /> Checkout secured by a trusted payment processor
        </div>
      </div>

      <UsernameModal open={!!modalPkg} onClose={() => setModalPkg(null)} pkg={modalPkg} />

      {/* Terms modal */}
      {showTerms && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(8,6,14,0.8)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 20 }} onClick={() => setShowTerms(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480, maxHeight: "80vh", overflowY: "auto", background: "#1c1726", borderRadius: 16, padding: 24, border: "1px solid rgba(34,211,238,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 22, color: "#22D3EE", margin: 0 }}>Terms & Conditions</h3>
              <button onClick={() => setShowTerms(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.7)" }}>
              <p><strong>1. Acceptance of Terms</strong></p><p>By purchasing any product from CrazySMP Store, you agree to these terms and conditions.</p>
              <p><strong>2. Digital Goods</strong></p><p>All purchases are for digital goods within the CrazySMP Minecraft server. No physical items will be shipped.</p>
              <p><strong>3. No Refunds</strong></p><p>All payments are final and non-refundable. Chargebacks will result in a permanent ban.</p>
              <p><strong>4. Delivery</strong></p><p>Purchases are credited in-game within 1-20 minutes. Contact Discord support if delayed.</p>
              <p><strong>5. Account Responsibility</strong></p><p>You are responsible for your Minecraft account. Purchases are tied to the username provided at checkout.</p>
              <p><strong>6. Changes to Service</strong></p><p>CrazySMP reserves the right to modify, suspend, or discontinue any product at any time.</p>
              <p><strong>7. Not Affiliated with Mojang</strong></p><p>CrazySMP is not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.</p>
            </div>
          </div>
        </div>
      )}

      {/* Privacy modal */}
      {showPrivacy && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(8,6,14,0.8)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 20 }} onClick={() => setShowPrivacy(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480, maxHeight: "80vh", overflowY: "auto", background: "#1c1726", borderRadius: 16, padding: 24, border: "1px solid rgba(34,211,238,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 22, color: "#22D3EE", margin: 0 }}>Privacy Policy</h3>
              <button onClick={() => setShowPrivacy(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.7)" }}>
              <p><strong>1. Information We Collect</strong></p><p>When you make a purchase, we collect your Minecraft username and payment confirmation. We do not store payment details.</p>
              <p><strong>2. How We Use Information</strong></p><p>Your username is used to credit in-game purchases. Your Discord ID may be used for support ticket tracking.</p>
              <p><strong>3. Data Storage</strong></p><p>Purchase records are stored securely and only accessible to authorized CrazySMP staff.</p>
              <p><strong>4. Third-Party Services</strong></p><p>Payments are processed by trusted payment processors. We do not share your data with third parties.</p>
              <p><strong>5. Data Deletion</strong></p><p>To request deletion of your purchase data, open a ticket on our Discord server.</p>
              <p><strong>6. Cookies</strong></p><p>This website does not use tracking cookies. Session data is temporary and cleared on browser close.</p>
              <p><strong>7. Contact</strong></p><p>For privacy concerns, contact us at <a href="mailto:contact@crazysmp.bond" style={{ color: "#22D3EE" }}>contact@crazysmp.bond</a>.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
