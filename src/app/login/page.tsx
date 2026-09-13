"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

const LOGIN_BG = "/login-bg.png";
const LOGO = "/store-logo-new.webp";
const MC = "'Minecraft', 'Inter', monospace";

// Only letters, digits, and underscore are valid Minecraft username chars.
const sanitize = (raw: string) => raw.replace(/[^A-Za-z0-9_]/g, "").slice(0, 16);

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  // If the person already has a saved username, prefill it so this reads
  // as "edit" rather than a blank login.
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("crazysmp_username") : null;
    if (saved) setUsername(saved.replace(/^\./, ""));
  }, []);

  const goBack = () => router.push("/");

  const handleSubmit = () => {
    const clean = username.trim();
    if (!clean) return;
    localStorage.setItem("crazysmp_username", clean);
    router.push("/");
  };

  // Coordinates measured directly from login-bg.png (450x800) via pixel
  // color sampling — the whole crystal-bordered box is clickable, not
  // just the inner input strip.
  const BOX1 = { left: 14.67, top: 54.375, width: 72, height: 8.5 }; // username
  const BOX3 = { left: 13.78, top: 72.375, width: 72.9, height: 7.875 }; // continue

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#0a0612" }}>
      <style>{`
        @import url('https://fonts.cdnfonts.com/css/minecraft-4');
        html, body { overflow: hidden !important; height: 100%; overscroll-behavior: none; }
        .csmp-login-mobile { display: flex; }
        .csmp-login-desktop { display: none; }
        @media (min-width: 900px) {
          .csmp-login-mobile { display: none; }
          .csmp-login-desktop { display: flex; }
        }
        .csmp-login-input::placeholder { color: rgba(255,255,255,0.35); }
        .csmp-login-continue:active { transform: scale(0.97); }
      `}</style>

      <button
        onClick={goBack}
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 50,
          width: 40,
          height: 40,
          color: "rgba(255,255,255,0.6)",
          cursor: "pointer",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Close"
      >
        <X size={20} />
      </button>

      {/* ============ MOBILE: exact pixel-overlay design on login-bg.png ============ */}
      <div className="csmp-login-mobile" style={{ position: "absolute", inset: 0, alignItems: "center", justifyContent: "center" }}>
        {/* Blurred backdrop fills any letterbox gaps left by object-fit:contain
            instead of showing flat black bars when the viewport ratio doesn't
            match the artwork's 450:800 ratio. */}
        <div
          style={{
            position: "absolute",
            inset: -30,
            backgroundImage: `url(${LOGIN_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(38px) brightness(0.5) saturate(1.25)",
            transform: "scale(1.15)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(5,3,10,0.32)" }} />

        <div style={{ position: "relative", height: "min(100dvh, 177.78vw)", aspectRatio: "450 / 800", maxWidth: "100%", maxHeight: "100dvh" }}>
          <img src={LOGIN_BG} alt="Login" style={{ width: "100%", height: "100%", display: "block", objectFit: "contain" }} />

          {/* Top blur fade — heavy at very top, decreasing quickly to transparent (~12% of viewport) */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "12%",
              background: "linear-gradient(180deg, rgba(10,6,18,0.92) 0%, rgba(10,6,18,0.5) 35%, rgba(10,6,18,0) 100%)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
          {/* Bottom blur fade — heavy at very bottom, decreasing quickly to transparent (~14% of viewport, slightly taller because the CONTINUE box sits there) */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "14%",
              background: "linear-gradient(0deg, rgba(10,6,18,0.92) 0%, rgba(10,6,18,0.5) 35%, rgba(10,6,18,0) 100%)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />

          {/* Username box — entire box clickable */}
          <div
            style={{ position: "absolute", left: `${BOX1.left}%`, top: `${BOX1.top}%`, width: `${BOX1.width}%`, height: `${BOX1.height}%`, display: "flex", alignItems: "center", cursor: "text", zIndex: 3 }}
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

          {/* Continue box — entire box clickable */}
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
              zIndex: 3,
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
                transform: "translateY(3px)",
                display: "inline-block",
              }}
            >
              CONTINUE
            </span>
          </button>
        </div>
      </div>

      {/* ============ DESKTOP: no phone-ratio background yet, so a hand-made ============ */}
      {/* ============ purple/blue gradient + a proper redesigned card ============ */}
      <div
        className="csmp-login-desktop"
        style={{
          position: "absolute",
          inset: 0,
          alignItems: "center",
          justifyContent: "center",
          backgroundImage:
            "radial-gradient(circle at 22% 18%, rgba(124,58,237,0.38), transparent 55%), radial-gradient(circle at 82% 78%, rgba(37,99,235,0.32), transparent 55%), linear-gradient(160deg, #1a1025 0%, #150d24 45%, #0a0812 100%)",
        }}
      >
        <div
          style={{
            width: 420,
            maxWidth: "90vw",
            background: "rgba(20,14,28,0.75)",
            border: "1px solid rgba(168,85,247,0.35)",
            borderRadius: 24,
            padding: "40px 36px",
            boxShadow: "0 0 60px -10px rgba(147,51,234,0.45), 0 20px 60px rgba(0,0,0,0.5)",
            backdropFilter: "blur(10px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img src={LOGO} alt="CrazySMP" style={{ width: "70%", maxWidth: 220, marginBottom: 8 }} />
          <h1
            style={{
              fontFamily: MC,
              fontSize: 28,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: 4,
              margin: "8px 0 28px",
              textShadow: "0 0 8px #fff, 0 0 20px #e879f9, 0 0 36px #a21caf",
            }}
          >
            LOGIN
          </h1>

          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(10,8,16,0.6)",
              border: "1.5px solid rgba(168,85,247,0.5)",
              borderRadius: 12,
              padding: "4px 16px",
              marginBottom: 20,
              boxShadow: "0 0 16px rgba(168,85,247,0.15) inset",
            }}
          >
            <img src="/steve-face.png" alt="" style={{ width: 30, height: 30, borderRadius: 6, flexShrink: 0 }} />
            <input
              className="csmp-login-input"
              value={username}
              onChange={(e) => setUsername(sanitize(e.target.value))}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Username"
              maxLength={16}
              style={{
                flex: 1,
                minWidth: 0,
                height: 52,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#fff",
                fontFamily: MC,
                fontSize: 16,
                letterSpacing: 0.5,
                caretColor: "#a855f7",
              }}
            />
          </div>

          <button
            className="csmp-login-continue"
            onClick={handleSubmit}
            disabled={!username.trim()}
            style={{
              width: "100%",
              background: username.trim() ? "linear-gradient(135deg,#a855f7,#c026d3)" : "rgba(255,255,255,0.08)",
              border: "none",
              borderRadius: 12,
              padding: "16px",
              cursor: username.trim() ? "pointer" : "default",
              boxShadow: username.trim() ? "0 0 24px rgba(192,38,211,0.5)" : "none",
              transition: "transform 0.15s ease",
            }}
          >
            <span
              style={{
                fontFamily: MC,
                fontSize: 18,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: 3,
                opacity: username.trim() ? 1 : 0.45,
              }}
            >
              CONTINUE
            </span>
          </button>

          <p style={{ fontFamily: MC, fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 18, textAlign: "center", lineHeight: 1.6 }}>
            Desktop background art is on the way — using a placeholder gradient for now.
          </p>
        </div>
      </div>
    </div>
  );
}
