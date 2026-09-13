"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Check } from "lucide-react";
import { ExperimentalMode, ExperimentalToolbar } from "@/components/experimental-mode";

const LOGIN_BG = "/login-bg.png";
const LOGO = "/store-logo-new.webp";
const MC = "'Minecraft', 'Inter', monospace";

// Only letters, digits, and underscore are valid Minecraft username chars.
// A leading dot (added by the Bedrock toggle, for GeyserMC) is preserved.
const sanitize = (raw: string, keepDot: boolean) => {
  const hasDot = keepDot && raw.startsWith(".");
  const rest = raw.replace(/^\./, "").replace(/[^A-Za-z0-9_]/g, "").slice(0, 16);
  return (hasDot ? "." : "") + rest;
};

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [bedrock, setBedrock] = useState(false);

  // If the person already has a saved username, prefill it so this reads
  // as "edit" rather than a blank login.
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("crazysmp_username") : null;
    if (saved) {
      if (saved.startsWith(".")) {
        setBedrock(true);
        setUsername(saved.replace(/^\./, ""));
      } else {
        setUsername(saved);
      }
    }
  }, []);

  const goBack = () => router.push("/store");

  const toggleBedrock = () => {
    setBedrock((prev) => {
      const next = !prev;
      setUsername((u) => {
        const bare = u.replace(/^\./, "");
        if (!next) return bare;
        return u.startsWith(".") ? u : `.${bare}`;
      });
      return next;
    });
  };

  const handleSubmit = () => {
    const clean = username.trim();
    if (!clean || clean === ".") return;
    localStorage.setItem("crazysmp_username", clean);
    router.push("/store");
  };

  // Coordinates measured directly from login-bg.png (450x800) via pixel
  // color sampling — the whole crystal-bordered box is clickable, not
  // just the inner input strip.
  const BOX1 = { left: 14.67, top: 54.375, width: 72, height: 8.5 }; // username
  const BOX2 = { left: 14.67, top: 63.375, width: 72, height: 7.5 }; // bedrock toggle
  const BOX3 = { left: 13.78, top: 72.375, width: 72.9, height: 7.875 }; // continue

  return (
    <ExperimentalMode>
      <div className="csmp-root" style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#000000" }}>
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

        {/* Experimental toolbar (top-left, so it doesn't overlap the close button) */}
        <div style={{ position: "fixed", top: 20, left: 20, zIndex: 11 }}>
          <ExperimentalToolbar />
        </div>

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
            — increased blur for a softer, more atmospheric fill. */}
        <div
          style={{
            position: "absolute",
            inset: -40,
            backgroundImage: `url(${LOGIN_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(48px) brightness(0.45) saturate(1.3)",
            transform: "scale(1.2)",
          }}
        />
        {/* Solid black overlay so the letterbox areas are pure black */}
        <div style={{ position: "absolute", inset: 0, background: "#000000" }} />

        <div style={{ position: "relative", height: "min(100dvh, 177.78vw)", aspectRatio: "450 / 800", maxWidth: "100%", maxHeight: "100dvh" }}>
          <img src={LOGIN_BG} alt="Login" style={{ width: "100%", height: "100%", display: "block", objectFit: "contain" }} />

          {/* Circular vignette overlay — symmetrical darkening at ALL edges (top, bottom, left, right)
              fading to transparent in the center. Replaces the thin rectangular strips. */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 75%, rgba(0,0,0,0.85) 100%)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
          {/* Top blur strip — thicker (8%), fades from solid black to transparent */}
          <div
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0, height: "8%",
              background: "linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
          {/* Bottom blur strip — thicker (8%), fades from solid black to transparent */}
          <div
            style={{
              position: "absolute",
              bottom: 0, left: 0, right: 0, height: "8%",
              background: "linear-gradient(0deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
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
              onChange={(e) => setUsername(sanitize(e.target.value, bedrock))}
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

          {/* Bedrock toggle box — square red/green toggle, X when off, checkmark when on */}
          <div
            style={{ position: "absolute", left: `${BOX2.left}%`, top: `${BOX2.top}%`, width: `${BOX2.width}%`, height: `${BOX2.height}%`, display: "flex", alignItems: "center", cursor: "pointer", zIndex: 3 }}
            onClick={toggleBedrock}
          >
            <div
              style={{
                margin: "0 auto",
                height: "70%",
                aspectRatio: "1.6 / 1",
                borderRadius: 8,
                background: bedrock ? "#22c55e" : "#dc2626",
                border: `2px solid ${bedrock ? "#16a34a" : "#991b1b"}`,
                boxShadow: bedrock ? "0 0 12px rgba(34,197,94,0.6)" : "0 0 8px rgba(220,38,38,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                transform: "translate(30px, 5px)",
              }}
            >
              {bedrock ? (
                <Check size={20} color="#fff" strokeWidth={3} />
              ) : (
                <X size={20} color="#fff" strokeWidth={3} />
              )}
            </div>
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
              onChange={(e) => setUsername(sanitize(e.target.value, bedrock))}
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
    </ExperimentalMode>
  );
}
