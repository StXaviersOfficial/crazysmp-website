"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollProgress, CustomCursor } from "@/components/motion-primitives";
import { NoiseOverlay } from "@/components/noise-overlay";

const SERVER_IP = "crazysmp.bond";
const DISCORD_URL = "https://discord.gg/GFzAeUj7TJ";

const CATEGORIES = [
  { name: "Ranks", icon: "👑", active: true },
  { name: "Keys", icon: "🔑" },
  { name: "Coins", icon: "💰" },
  { name: "Bundles", icon: "📦" },
];

const PACKAGES = [
  { name: "VIP Rank", price: "5.00", color: "#22D3EE", img: "/rank-icon.webp" },
  { name: "Legend Rank", price: "10.00", color: "#06B6D4", img: "/rank-icon.webp" },
  { name: "Immortal Rank", price: "15.00", color: "#0EA5E9", img: "/rank-icon.webp" },
  { name: "Titan Rank", price: "25.00", color: "#3B82F6", img: "/rank-icon.webp" },
  { name: "Techno Rank", price: "35.00", color: "#6366F1", img: "/rank-icon.webp" },
  { name: "Crazy Rank", price: "50.00", color: "#8B5CF6", img: "/rank-icon.webp" },
  { name: "Spawner Key", price: "3.00", color: "#22C55E", img: "/rank-icon.webp" },
  { name: "Mega Key", price: "7.00", color: "#3B82F6", img: "/rank-icon.webp" },
  { name: "Crazy Key", price: "12.00", color: "#A855F7", img: "/rank-icon.webp" },
];

export default function Home() {
  const [playerCount, setPlayerCount] = useState(0);
  const [serverOnline, setServerOnline] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [mcUsername, setMcUsername] = useState("");
  const [isBedrock, setIsBedrock] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Ranks");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`https://api.mcsrvstat.us/3/${SERVER_IP}`);
        const data = await res.json();
        setServerOnline(data.online || false);
        setPlayerCount(data.players?.online || 0);
      } catch {}
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const copyIP = () => { navigator.clipboard.writeText(SERVER_IP); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <CustomCursor />
      <NoiseOverlay />

      {/* Header splash background */}
      <div className="header-splash">
        <img src="/mc-bg.png" alt="" />
        <div className="splash-gradient" />
      </div>

      {/* Header — FireMC style */}
      <header className="store-header">
        <div className="store-wrapper">
          <div className="top-bar">
            {/* Profile/Login */}
            <div className="profile-avatar" onClick={() => setShowLogin(!showLogin)}>
              <div className="profile-head">
                <img src="https://minotar.net/avatar/MHF_Question/32" alt="Guest" />
              </div>
              <div>
                <p className="profile-title">{showLogin ? "Login" : "Guest"}</p>
                <p className="profile-description-text">Click to login</p>
              </div>
            </div>

            {/* Center logo */}
            <div className="header-logo">
              <img src="/store-logo.png" alt="CrazySMP" style={{ maxHeight: "60px" }} />
            </div>

            {/* Widgets */}
            <div className="store-widgets">
              <div className="store-widget">
                <div className="widget-icon">
                  <span className="player-count">{serverOnline ? playerCount : "..."}</span>
                  <span style={{ fontSize: "20px" }}>🔥</span>
                </div>
                <div>
                  <p className="widget-title">{SERVER_IP}</p>
                  <p className="widget-description">{copied ? "Copied!" : "click to copy"}</p>
                </div>
              </div>
              <a className="store-widget" href={DISCORD_URL} target="_blank" rel="noreferrer" style={{ cursor: "pointer" }} onClick={(e) => { e.preventDefault(); copyIP(); }}>
                <div>
                  <p className="widget-title">Discord Server</p>
                  <p className="widget-description">click to join</p>
                </div>
                <div className="widget-icon">
                  <span>💬</span>
                </div>
              </a>
            </div>
          </div>

          {/* Login dropdown */}
          {showLogin && (
            <div style={{ position: "absolute", top: "60px", left: "10px", width: "280px", padding: "16px", background: "var(--second-background)", borderRadius: "8px", border: "1px solid var(--border)", zIndex: 100 }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "12px", color: "var(--primary)" }}>Minecraft Login</h3>
              <input type="text" placeholder="Username" value={mcUsername} onChange={(e) => setMcUsername(e.target.value)} style={{ width: "100%", marginBottom: "8px", padding: "8px 12px", background: "var(--background)", border: "1px solid var(--border)", borderRadius: "4px", color: "var(--foreground)", fontSize: "14px" }} />
              <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", fontSize: "12px", color: "var(--secondary-text-color)" }}>
                <input type="checkbox" checked={isBedrock} onChange={(e) => setIsBedrock(e.target.checked)} style={{ accentColor: "var(--primary)" }} />
                Bedrock player (adds . prefix)
              </label>
              <Button onClick={() => window.open(DISCORD_URL, "_blank")} size="sm" style={{ width: "100%", background: "var(--primary)", color: "var(--primary-foreground)", fontSize: "14px" }}>
                {isBedrock && mcUsername ? `.${mcUsername}` : mcUsername || "Enter username"} → Discord
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Body — sidebar + main content */}
      <div className="store-wrapper">
        <div className="store-body">
          {/* Sidebar */}
          <aside className="store-sidebar">
            <div className="sidebar-header">Select a category</div>
            <nav className="sidebar-nav">
              <ul>
                {CATEGORIES.map((cat) => (
                  <li key={cat.name}>
                    <a
                      href="#"
                      className={activeCategory === cat.name ? "active" : ""}
                      onClick={(e) => { e.preventDefault(); setActiveCategory(cat.name); }}
                      style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: activeCategory === cat.name ? "var(--primary)" : "var(--second-background)", borderRadius: "5px", color: activeCategory === cat.name ? "var(--primary-foreground)" : "var(--secondary-text-color)", textDecoration: "none", fontSize: "14px", transition: "all 0.2s" }}
                    >
                      <span style={{ fontSize: "18px" }}>{cat.icon}</span>
                      {cat.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main content */}
          <main className="store-main">
            {/* Featured packages */}
            <p className="featured-title">Featured Packages</p>
            <div className="featured-packages">
              {PACKAGES.map((pkg, i) => (
                <div
                  key={i}
                  className="featured-package"
                  style={{ background: `${pkg.color}15`, borderColor: `${pkg.color}40` }}
                  onClick={() => window.open(DISCORD_URL, "_blank")}
                >
                  <div className="featured-package-circle">
                    <img src={pkg.img} alt={pkg.name} style={{ border: `2px solid ${pkg.color}` }} />
                  </div>
                  <p className="featured-package-title" style={{ color: pkg.color }}>{pkg.name}</p>
                  <p className="featured-package-price">
                    <span>{pkg.price}</span> USD
                  </p>
                </div>
              ))}
            </div>

            {/* Welcome section */}
            <div className="welcome-section">
              <h1>Welcome to the official CrazySMP Store</h1>
              <p>CrazySMP is a free-to-play Minecraft SMP. Items can be purchased here to enhance gameplay and grant the player various special perks.</p>
              <p>To begin, please select a category from the sidebar.</p>
            </div>

            {/* Support */}
            <div className="support-box">
              <p className="support-title">Support</p>
              <p style={{ color: "var(--secondary-text-color)", fontSize: "14px", lineHeight: 1.6 }}>
                Need any questions answered before checkout? Waited more than 20 minutes but your package still has not arrived?
                Ask the community/staff on Discord, or for payment support, submit a support ticket.
              </p>
              <a className="support-button" href={DISCORD_URL} target="_blank" rel="noreferrer">Discord Server</a>
            </div>

            {/* Refund policy */}
            <div className="support-box">
              <p className="support-title">Refund policy</p>
              <p style={{ color: "var(--secondary-text-color)", fontSize: "14px", lineHeight: 1.6 }}>
                All payments are final and non-refundable. Attempting a chargeback or opening a PayPal dispute will result in
                permanent and irreversible banishment from all of our servers. Payments are secured by our payment processor.
                It could take between 1-20 minutes for your purchase to be credited in-game. If you are still not credited
                after this time period, please open a support ticket on Discord with proof of purchase.
              </p>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer-copyright">
        <p>Copyright © CrazySMP 2026. All Rights Reserved.</p>
        <p>We are not affiliated with Mojang AB.</p>
      </footer>
    </div>
  );
}
