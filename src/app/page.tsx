"use client";

import React, { useState } from "react";
import { Menu, Gem, MessageCircle, Mail, ShieldCheck, Gift, ImageOff, X, ChevronDown } from "lucide-react";
const LOGO = "/crazysmp-logo.webp";
const BG = "/crazysmp-bg.webp";

const PACKAGES = [
  {
    id: "obsidian",
    name: "OBSIDIAN Rank",
    bonus: "+3600 Shards",
    price: "27.00 USD",
    tone: "green",
  },
  {
    id: "gems-end",
    name: "15,600 Shards",
    bonus: "END REALM",
    price: "12.20 USD",
    tone: "gold",
  },
  {
    id: "wither",
    name: "WITHER Rank",
    bonus: "+1000 Shards",
    price: "6.70 USD",
    tone: "plain",
  },
  {
    id: "ender",
    name: "ENDER Rank",
    bonus: "+3200 Shards",
    price: "22.00 USD",
    tone: "purple",
  },
  {
    id: "gems-classic",
    name: "15,600 Shards",
    bonus: "CLASSIC",
    price: "12.20 USD",
    tone: "gold",
  },
];

const TONES = {
  green: {
    border: "#3fae4a",
    bg: "linear-gradient(180deg, rgba(63,174,74,0.22), rgba(20,26,18,0.7))",
    text: "#6bdc76",
  },
  gold: {
    border: "#b99a1f",
    bg: "linear-gradient(180deg, rgba(185,154,31,0.24), rgba(28,24,12,0.7))",
    text: "#e9c93f",
  },
  plain: {
    border: "rgba(255,255,255,0.12)",
    bg: "rgba(255,255,255,0.03)",
    text: "#d9d3e6",
  },
  purple: {
    border: "#9b4de0",
    bg: "linear-gradient(180deg, rgba(155,77,224,0.26), rgba(24,16,32,0.7))",
    text: "#c98bff",
  },
};

function PackageIconPlaceholder({ tone }) {
  const t = TONES[tone];
  return (
    <div
      style={{
        width: 72,
        height: 72,
        borderRadius: 14,
        flexShrink: 0,
        background: "rgba(255,255,255,0.05)",
        border: `1px dashed ${t.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(255,255,255,0.35)",
      }}
    >
      <ImageOff size={26} strokeWidth={1.5} />
    </div>
  );
}

function UsernameModal({ open, onClose, pkg }) {
  const [username, setUsername] = useState("");
  const [bedrock, setBedrock] = useState(false);
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(8,6,14,0.72)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#1c1726",
          borderTop: "1px solid rgba(155,77,224,0.35)",
          borderRadius: "20px 20px 0 0",
          padding: "28px 22px 26px",
          boxShadow: "0 -10px 40px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
              padding: 4,
            }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <h3
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontSize: 22,
            color: "#fff",
            textAlign: "center",
            margin: "0 0 8px",
          }}
        >
          Enter your username to continue
        </h3>
        <p
          style={{
            fontFamily: "'Nunito', sans-serif",
            color: "rgba(255,255,255,0.55)",
            textAlign: "center",
            fontSize: 14,
            lineHeight: 1.5,
            margin: "0 0 20px",
          }}
        >
          Usernames can't contain spaces. Any letters and numbers are allowed, and they are case sensitive.
        </p>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your Minecraft username"
          style={{
            width: "100%",
            boxSizing: "border-box",
            background: "#141019",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 10,
            padding: "14px 16px",
            color: "#fff",
            fontFamily: "'Nunito', sans-serif",
            fontSize: 15,
            marginBottom: 16,
            outline: "none",
          }}
        />
        <button
          style={{
            width: "100%",
            background: pkg ? TONES[pkg.tone].border : "#9b4de0",
            border: "none",
            borderRadius: 10,
            padding: "14px 16px",
            color: "#0e0a15",
            fontFamily: "'Baloo 2', sans-serif",
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: 0.4,
            cursor: "pointer",
            marginBottom: 16,
          }}
          onClick={onClose}
        >
          CONTINUE
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            fontFamily: "'Nunito', sans-serif",
            color: "rgba(255,255,255,0.6)",
            fontSize: 14,
          }}
        >
          Bedrock user?
          <button
            onClick={() => setBedrock(!bedrock)}
            style={{
              background: bedrock ? "#9b4de0" : "rgba(233,80,90,0.85)",
              border: "none",
              borderRadius: 6,
              padding: "5px 14px",
              color: "#fff",
              fontFamily: "'Baloo 2', sans-serif",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {bedrock ? "Yes" : "No"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CrazySMPStore() {
  const [modalPkg, setModalPkg] = useState(null);

  return (
    <div
      style={{
        fontFamily: "'Nunito', sans-serif",
        background: "#141019",
        color: "#fff",
        minHeight: "100vh",
        maxWidth: 480,
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes portalGlow {
          0%, 100% { filter: drop-shadow(0 0 18px rgba(190,110,255,0.55)) drop-shadow(0 0 40px rgba(120,50,200,0.35)); }
          50% { filter: drop-shadow(0 0 28px rgba(210,140,255,0.8)) drop-shadow(0 0 60px rgba(140,60,220,0.5)); }
        }
        .csmp-pkg-card:active { transform: scale(0.98); }
        .csmp-btn:active { transform: scale(0.97); }
      `}</style>

      {/* HERO */}
      <div
        style={{
          position: "relative",
          backgroundImage: `linear-gradient(180deg, rgba(15,10,22,0.35) 0%, rgba(15,10,22,0.55) 55%, #141019 100%), url(${BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "20px 20px 26px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 16, color: "#fff" }}>
              Guest
            </div>
            <div
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontSize: 12,
                color: "#c98bff",
                letterSpacing: 0.3,
              }}
            >
              CLICK TO LOGIN
            </div>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: "linear-gradient(135deg, #3a2a4a, #1c1626)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "18px 0 10px",
          }}
        >
          <img
            src={LOGO}
            alt="CrazySMP logo"
            style={{
              width: "78%",
              maxWidth: 300,
              animation: "portalGlow 3.2s ease-in-out infinite",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 36,
            padding: "6px 0 20px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                background: "rgba(155,77,224,0.18)",
                border: "1px solid rgba(155,77,224,0.5)",
                color: "#e2c9ff",
                fontFamily: "'Baloo 2', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                borderRadius: 20,
                padding: "6px 18px",
                marginBottom: 8,
              }}
            >
              2,580
            </div>
            <MessageCircle size={26} color="#c98bff" style={{ margin: "0 auto" }} />
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                background: "rgba(155,77,224,0.18)",
                border: "1px solid rgba(155,77,224,0.5)",
                color: "#e2c9ff",
                fontFamily: "'Baloo 2', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                borderRadius: 20,
                padding: "6px 18px",
                marginBottom: 8,
              }}
            >
              472
            </div>
            <Gem size={26} color="#c98bff" style={{ margin: "0 auto" }} />
          </div>
        </div>

        <button
          className="csmp-btn"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "rgba(20,14,28,0.75)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: "14px 16px",
            color: "#e2c9ff",
            fontFamily: "'Baloo 2', sans-serif",
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: 0.3,
            cursor: "pointer",
          }}
        >
          <Menu size={20} />
          SELECT A CATEGORY
          <ChevronDown size={18} style={{ marginLeft: "auto" }} />
        </button>
      </div>

      {/* FEATURED PACKAGES */}
      <div style={{ padding: "26px 20px 8px" }}>
        <h2
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontSize: 26,
            color: "#c98bff",
            margin: "0 0 18px",
            letterSpacing: 0.3,
          }}
        >
          Featured Packages
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {PACKAGES.map((pkg) => {
            const t = TONES[pkg.tone];
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
                }}
              >
                <PackageIconPlaceholder tone={pkg.tone} />
                <div>
                  <div
                    style={{
                      fontFamily: "'Baloo 2', sans-serif",
                      fontSize: 18,
                      fontWeight: 700,
                      color: t.text,
                      lineHeight: 1.25,
                    }}
                  >
                    {pkg.name} <span style={{ fontWeight: 600 }}>({pkg.bonus})</span>
                  </div>
                  <div
                    style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontSize: 15,
                      fontWeight: 800,
                      color: "#fff",
                      marginTop: 4,
                    }}
                  >
                    {pkg.price}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* WELCOME */}
      <div style={{ padding: "34px 20px 8px" }}>
        <div
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontSize: 13,
            color: "#c98bff",
            letterSpacing: 1,
            marginBottom: 6,
          }}
        >
          Welcome to the official
        </div>
        <h2
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontSize: 30,
            color: "#c98bff",
            margin: "0 0 16px",
          }}
        >
          CrazySMP Store
        </h2>
        <p
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 15,
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.75)",
            margin: 0,
          }}
        >
          CrazySMP is a free-to-play public Minecraft server. Items purchased here support
          the server and grant special perks in-game.
        </p>
        <p
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 15,
            fontWeight: 700,
            color: "#fff",
            marginTop: 16,
          }}
        >
          To begin, select a category from the menu above.
        </p>
      </div>

      {/* SUPPORT */}
      <div style={{ padding: "30px 20px 8px" }}>
        <h3
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontSize: 22,
            color: "#c98bff",
            margin: "0 0 14px",
          }}
        >
          Support
        </h3>
        <p
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 15,
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.75)",
            margin: "0 0 18px",
          }}
        >
          Need help before checkout, or waited more than 20 minutes without your package
          arriving? Ask the community or staff on Discord, or open a support ticket for
          payment issues. You can also reach us at{" "}
          <a href="mailto:contact@crazysmp.bond" style={{ color: "#c98bff" }}>
            contact@crazysmp.bond
          </a>
          .
        </p>
        <button
          className="csmp-btn"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#9b4de0",
            border: "none",
            borderRadius: 10,
            padding: "14px 20px",
            color: "#fff",
            fontFamily: "'Baloo 2', sans-serif",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          <MessageCircle size={18} />
          Discord Server
        </button>
      </div>

      {/* REFUND POLICY */}
      <div style={{ padding: "30px 20px 8px" }}>
        <h3
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontSize: 22,
            color: "#e0596a",
            margin: "0 0 14px",
          }}
        >
          Refund Policy
        </h3>
        <p
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 15,
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.75)",
            margin: "0 0 14px",
          }}
        >
          All payments are final and non-refundable. Attempting a chargeback or opening a
          dispute will result in a <strong style={{ color: "#fff" }}>permanent ban</strong>{" "}
          from CrazySMP and connected stores.
        </p>
        <p
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 15,
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.75)",
            margin: 0,
          }}
        >
          Purchases are usually credited within 1–20 minutes. If yours hasn't arrived after
          that, open a support ticket with proof of purchase.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
          <button
            className="csmp-btn"
            style={{
              background: "rgba(224,89,106,0.15)",
              border: "1px solid rgba(224,89,106,0.6)",
              borderRadius: 10,
              padding: "13px 16px",
              color: "#f2a2ac",
              fontFamily: "'Baloo 2', sans-serif",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Terms and Conditions
          </button>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="csmp-btn"
              style={{
                flex: 1,
                background: "rgba(224,89,106,0.15)",
                border: "1px solid rgba(224,89,106,0.6)",
                borderRadius: 10,
                padding: "13px 10px",
                color: "#f2a2ac",
                fontFamily: "'Baloo 2', sans-serif",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Impressum
            </button>
            <button
              className="csmp-btn"
              style={{
                flex: 1,
                background: "rgba(224,89,106,0.15)",
                border: "1px solid rgba(224,89,106,0.6)",
                borderRadius: 10,
                padding: "13px 10px",
                color: "#f2a2ac",
                fontFamily: "'Baloo 2', sans-serif",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>

      {/* GIFTCARD */}
      <div style={{ padding: "26px 20px" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 14,
            padding: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <Gift size={20} color="#c98bff" />
            <span
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontSize: 16,
                color: "#c98bff",
                letterSpacing: 0.3,
              }}
            >
              Giftcard Balance
            </span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              placeholder="Card Number"
              style={{
                flex: 1,
                minWidth: 0,
                background: "#141019",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                padding: "12px 14px",
                color: "#fff",
                fontFamily: "'Nunito', sans-serif",
                fontSize: 14,
                outline: "none",
              }}
            />
            <button
              className="csmp-btn"
              style={{
                background: "#3fae4a",
                border: "none",
                borderRadius: 10,
                padding: "0 20px",
                color: "#0e150f",
                fontFamily: "'Baloo 2', sans-serif",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Check
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div
        style={{
          padding: "10px 20px 34px",
          textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontSize: 14,
            color: "rgba(255,255,255,0.6)",
            marginTop: 16,
          }}
        >
          Copyright &copy; CrazySMP 2026. All Rights Reserved.
        </div>
        <div
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 12,
            color: "rgba(255,255,255,0.35)",
            marginTop: 4,
          }}
        >
          We are not affiliated with Mojang AB.
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            marginTop: 14,
            color: "rgba(255,255,255,0.3)",
            fontSize: 12,
          }}
        >
          <ShieldCheck size={14} />
          Checkout secured by a trusted payment processor
        </div>
      </div>

      <UsernameModal open={!!modalPkg} onClose={() => setModalPkg(null)} pkg={modalPkg} />
    </div>
  );
}
