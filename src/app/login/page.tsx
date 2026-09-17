"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

const LOGIN_BG = "/login-bg.webp";
const LOGIN_BG_DESKTOP = "/login-bg-desktop.webp";
const LOGO = "/store-logo-new.webp";
const MC = "'Minecraft', 'Inter', monospace";
// Pixel font with LOWERCASE support (Minecraft font is uppercase-only,
// but usernames need exact case preservation)
const USERNAME_FONT = "'Pixelify Sans', 'Minecraft', monospace";

// Intrinsic size of login-bg.webp — used to compute exact cover-fill math
// below (not just for display, so don't change without re-measuring).
const NATURAL_W = 941;
const NATURAL_H = 1672;

// Intrinsic size of login-bg-desktop.webp (the wide desktop-ratio version)
// — used for the desktop contain-fit math below.
const NATURAL_W_DESK = 1717;
const NATURAL_H_DESK = 916;

// Box coordinates measured directly from login-bg.webp via pixel color
// sampling (percentage of the ORIGINAL image, not of any container) —
// these get mapped into actual on-screen pixels by the cover-fit math.
const BOX1 = { left: 15.73, top: 55.32, width: 69.08, height: 7.0 }; // username
const BOX2 = { left: 15.73, top: 64.95, width: 69.08, height: 5.74 }; // bedrock toggle
const BOX3 = { left: 15.73, top: 72.49, width: 69.08, height: 7.36 }; // continue

// Same idea, measured against login-bg-desktop.webp (a completely
// different composition/ratio, so completely different numbers).
const BOX1_DESK = { left: 31.57, top: 59.83, width: 26.97, height: 8.08 };
const BOX2_DESK = { left: 31.57, top: 69.87, width: 26.97, height: 8.52 };
const BOX3_DESK = { left: 31.57, top: 78.82, width: 26.97, height: 9.61 };

// Only letters, digits, and underscore are valid Minecraft username chars.
// A leading dot (added by the Bedrock toggle, for GeyserMC) is preserved.
const sanitize = (raw: string, keepDot: boolean) => {
  const hasDot = keepDot && raw.startsWith(".");
  const rest = raw.replace(/^\./, "").replace(/[^A-Za-z0-9_]/g, "").slice(0, 16);
  return (hasDot ? "." : "") + rest;
};

// Maps a box given in ORIGINAL-IMAGE percentages into actual on-screen
// pixels, given how the image is currently being cover-cropped to fill
// the viewport. This is what makes the overlays land exactly on the
// artwork's boxes regardless of device aspect ratio, with the background
// fully covering the screen (crop instead of letterbox/blur).
function mapBox(box: { left: number; top: number; width: number; height: number }, fit: { renderedW: number; renderedH: number; offsetX: number; offsetY: number }) {
  return {
    left: fit.offsetX + (box.left / 100) * fit.renderedW,
    top: fit.offsetY + (box.top / 100) * fit.renderedH,
    width: (box.width / 100) * fit.renderedW,
    height: (box.height / 100) * fit.renderedH,
  };
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [bedrock, setBedrock] = useState(false);
  // Smart aspect-ratio matching: compare viewport ratio to mobile (0.5628)
  // and desktop (1.874) target ratios, pick whichever is closer. Replaces
  // the flat 900px width breakpoint so a tall/narrow desktop window
  // correctly shows the mobile layered layout.
  const [useMobileLayout, setUseMobileLayout] = useState<boolean | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ renderedW: number; renderedH: number; offsetX: number; offsetY: number } | null>(null);
  const deskContainerRef = useRef<HTMLDivElement>(null);
  const [deskFit, setDeskFit] = useState<{ renderedW: number; renderedH: number; offsetX: number; offsetY: number } | null>(null);

  useEffect(() => {
    const MOBILE_RATIO = 0.5628;  // login-sky-mobile.webp (941/1672)
    const DESKTOP_RATIO = 1.874;  // login-bg-desktop.webp (1717/916)

    const compute = () => {
      if (typeof window === "undefined") return;
      const ratio = window.innerWidth / window.innerHeight;
      const distToMobile = Math.abs(ratio - MOBILE_RATIO);
      const distToDesktop = Math.abs(ratio - DESKTOP_RATIO);
      setUseMobileLayout(distToMobile <= distToDesktop);
    };

    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  // Desktop: CONTAIN-fit (never crops — shrinks/grows the whole image to
  // fit inside the available frame instead), unlike the mobile cover-fit
  // above. A decorative border is drawn around the contained image so the
  // letterboxed edges read as an intentional frame rather than a cut-off.
  useEffect(() => {
    const compute = () => {
      const el = deskContainerRef.current;
      if (!el) return;
      const cw = el.clientWidth;
      const ch = el.clientHeight;
      const scale = Math.min(cw / NATURAL_W_DESK, ch / NATURAL_H_DESK);
      const renderedW = NATURAL_W_DESK * scale;
      const renderedH = NATURAL_H_DESK * scale;
      setDeskFit({
        renderedW,
        renderedH,
        offsetX: (cw - renderedW) / 2,
        offsetY: (ch - renderedH) / 2,
      });
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  // Recompute the cover-fit (crop-to-fill) transform whenever the viewport
  // size changes, so the background always fully covers the screen — no
  // letterbox gaps, no blur fill needed — and the interactive boxes track
  // exactly with wherever the artwork ends up.
  useEffect(() => {
    const compute = () => {
      const el = containerRef.current;
      if (!el) return;
      const cw = el.clientWidth;
      const ch = el.clientHeight;
      const scale = Math.max(cw / NATURAL_W, ch / NATURAL_H);
      const renderedW = NATURAL_W * scale;
      const renderedH = NATURAL_H * scale;
      setFit({
        renderedW,
        renderedH,
        offsetX: (cw - renderedW) / 2,
        offsetY: (ch - renderedH) / 2,
      });
    };
    compute();
    window.addEventListener("resize", compute);
    window.visualViewport?.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("resize", compute);
      window.visualViewport?.removeEventListener("resize", compute);
    };
  }, []);

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

  const box1 = fit ? mapBox(BOX1, fit) : null;
  const box2 = fit ? mapBox(BOX2, fit) : null;
  const box3 = fit ? mapBox(BOX3, fit) : null;

  const dBox1 = deskFit ? mapBox(BOX1_DESK, deskFit) : null;
  const dBox2 = deskFit ? mapBox(BOX2_DESK, deskFit) : null;
  const dBox3 = deskFit ? mapBox(BOX3_DESK, deskFit) : null;

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#0a0612" }}>
      <style>{`
        @import url('https://fonts.cdnfonts.com/css/minecraft-4');
        html, body { overflow: hidden !important; height: 100%; overscroll-behavior: none; }
        .csmp-login-mobile { display: block; }
        .csmp-login-desktop { display: none; }
        @media (min-width: 900px) {
          .csmp-login-mobile { display: none; }
          .csmp-login-desktop { display: flex; }
        }
        .csmp-login-input::placeholder { color: rgba(255,255,255,0.35); }
        .csmp-login-continue:active { transform: scale(0.97); }
        .csmp-toggle-track { transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease; }
        .csmp-toggle-knob { transition: transform 0.2s ease; }

        /* Pulsing glow on username box — draws attention to where to click */
        @keyframes csmp-glow-username {
          0%, 100% { box-shadow: 0 0 8px rgba(168,85,247,0.25), inset 0 0 6px rgba(168,85,247,0.08); }
          50% { box-shadow: 0 0 22px rgba(168,85,247,0.55), inset 0 0 12px rgba(168,85,247,0.15); }
        }
        .csmp-glow-username-box {
          animation: csmp-glow-username 2.8s ease-in-out infinite;
          border-radius: 12px;
          background: rgba(168,85,247,0.04);
        }

        /* Pulsing glow on CONTINUE box — calls user to action */
        @keyframes csmp-glow-continue {
          0%, 100% { box-shadow: 0 0 8px rgba(192,38,211,0.2); }
          50% { box-shadow: 0 0 22px rgba(192,38,211,0.5); }
        }
        .csmp-glow-continue-box {
          animation: csmp-glow-continue 2.2s ease-in-out infinite;
          border-radius: 12px;
          background: rgba(192,38,211,0.04);
        }

        /* Pulsing text glow on CONTINUE text */
        @keyframes csmp-glow-continue-text {
          0%, 100% { text-shadow: 0 0 6px #fff, 0 0 16px #e879f9, 0 0 28px #c026d3; }
          50% { text-shadow: 0 0 8px #fff, 0 0 24px #e879f9, 0 0 40px #c026d3, 0 0 60px #a21caf; }
        }
        .csmp-glow-continue-text {
          animation: csmp-glow-continue-text 2.2s ease-in-out infinite;
        }
      `}</style>

      <button
        onClick={goBack}
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: 50,
          width: 40,
          height: 40,
          color: "rgba(255,255,255,0.75)",
          cursor: "pointer",
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Close"
      >
        <X size={20} />
      </button>

      {/* ============ MOBILE: layered composition — sky background,   ============ */}
      {/* ============ floating island, and 3 separate bar overlays,   ============ */}
      {/* ============ instead of one flat baked-in image. Each layer  ============ */}
      {/* ============ sizes itself independently, so there's no       ============ */}
      {/* ============ cover-fit math needed at all.                   ============ */}
      {useMobileLayout !== false && (
      <div className="csmp-login-mobile" style={{ position: "absolute", inset: 0, overflow: "hidden", display: useMobileLayout === true ? "block" : undefined }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url(/login-sky-mobile.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <img src="/login-island.webp" alt="" style={{ width: "70%", maxWidth: 340, marginBottom: "-4%", pointerEvents: "none" }} />

          <div style={{ width: "88%", maxWidth: 380, display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Username bar */}
            <div
              className="csmp-glow-username-box"
              style={{ position: "relative", cursor: "text" }}
              onClick={(e) => { const input = e.currentTarget.querySelector("input"); if (input) input.focus(); }}
            >
              <img src="/bar-username.webp" alt="" style={{ width: "100%", display: "block", pointerEvents: "none" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
                <input
                  value={username}
                  onChange={(e) => setUsername(sanitize(e.target.value, bedrock))}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Username"
                  maxLength={16}
                  autoFocus
                  style={{
                    width: "100%",
                    height: "70%",
                    marginLeft: "19%",
                    paddingRight: "6%",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#fff",
                    fontFamily: USERNAME_FONT,
                    fontWeight: 600,
                    fontSize: 16,
                    letterSpacing: 0.5,
                    caretColor: "#a855f7",
                  }}
                />
              </div>
            </div>

            {/* Bedrock toggle bar */}
            <div style={{ position: "relative", cursor: "pointer" }} onClick={toggleBedrock}>
              <img src="/bar-bedrock.webp" alt="" style={{ width: "100%", display: "block", pointerEvents: "none" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
                <div
                  className="csmp-toggle-track"
                  style={{
                    marginLeft: "80%",
                    width: "15%",
                    aspectRatio: "2 / 1",
                    borderRadius: 999,
                    background: bedrock ? "linear-gradient(90deg,#0f9b6a,#34d399)" : "rgba(255,255,255,0.15)",
                    border: bedrock ? "1px solid rgba(74,222,128,0.85)" : "1px solid rgba(255,255,255,0.35)",
                    boxShadow: bedrock ? "0 0 10px rgba(52,211,153,0.7)" : "none",
                    position: "relative",
                    flexShrink: 0,
                  }}
                >
                  <div
                    className="csmp-toggle-knob"
                    style={{
                      position: "absolute",
                      top: "10%",
                      left: "8%",
                      height: "80%",
                      aspectRatio: "1 / 1",
                      borderRadius: "50%",
                      background: "#fff",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
                      transform: bedrock ? "translateX(95%)" : "translateX(0%)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Continue bar */}
            <button
              onClick={handleSubmit}
              disabled={!username.trim()}
              className="csmp-glow-continue-box"
              style={{ position: "relative", background: "none", border: "none", padding: 0, cursor: username.trim() ? "pointer" : "default" }}
            >
              <img src="/bar-continue.webp" alt="" style={{ width: "100%", display: "block", pointerEvents: "none" }} />
              <span
                className="csmp-glow-continue-text"
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: MC,
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: 3,
                  textShadow: "0 0 6px #fff, 0 0 16px #e879f9, 0 0 28px #c026d3, 0 0 42px #a21caf",
                  opacity: username.trim() ? 1 : 0.55,
                }}
              >
                CONTINUE
              </span>
            </button>
          </div>
        </div>
      </div>
      )}

      {/* ============ DESKTOP: real background art (login-bg-desktop.webp), ============ */}
      {/* ============ CONTAIN-fit (never crops) with a decorative border    ============ */}
      {/* ============ frame around the letterboxed edges.                   ============ */}
      {useMobileLayout !== true && (
      <div
        className="csmp-login-desktop"
        ref={deskContainerRef}
        style={{ position: "absolute", inset: 0, alignItems: "center", justifyContent: "center", background: "#05030a", display: useMobileLayout === false ? "flex" : undefined }}
      >
        {deskFit && (
          <div
            style={{
              position: "absolute",
              left: deskFit.offsetX - 10,
              top: deskFit.offsetY - 10,
              width: deskFit.renderedW + 20,
              height: deskFit.renderedH + 20,
              border: "1px solid rgba(168,85,247,0.4)",
              borderRadius: 14,
              boxShadow: "0 0 50px -6px rgba(147,51,234,0.4), inset 0 0 40px -10px rgba(147,51,234,0.25)",
              pointerEvents: "none",
            }}
          />
        )}

        {deskFit && (
          <img
            src={LOGIN_BG_DESKTOP}
            alt="Login"
            style={{
              position: "absolute",
              left: deskFit.offsetX,
              top: deskFit.offsetY,
              width: deskFit.renderedW,
              height: deskFit.renderedH,
              maxWidth: "none",
              maxHeight: "none",
              display: "block",
              borderRadius: 8,
            }}
          />
        )}

        {/* Username box — entire box clickable */}
        {dBox1 && (
          <div
            className="csmp-glow-username-box"
            style={{ position: "absolute", left: dBox1.left, top: dBox1.top, width: dBox1.width, height: dBox1.height, display: "flex", alignItems: "center", cursor: "text", zIndex: 3 }}
            onClick={(e) => { const input = e.currentTarget.querySelector("input"); if (input) input.focus(); }}
          >
            <input
              className="csmp-login-input"
              value={username}
              onChange={(e) => setUsername(sanitize(e.target.value, bedrock))}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Username"
              maxLength={16}
              autoFocus
              style={{
                flex: 1,
                minWidth: 0,
                height: "70%",
                marginLeft: "17%",
                paddingRight: "4%",
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#fff",
                fontFamily: USERNAME_FONT,
                fontSize: 17,
                letterSpacing: 0.5,
                caretColor: "#a855f7",
              }}
            />
          </div>
        )}

        {/* Bedrock toggle — whole bar toggles it, plus a pill switch on the right */}
        {dBox2 && (
          <div
            style={{ position: "absolute", left: dBox2.left, top: dBox2.top, width: dBox2.width, height: dBox2.height, display: "flex", alignItems: "center", cursor: "pointer", zIndex: 3 }}
            onClick={toggleBedrock}
          >
            <div
              className="csmp-toggle-track"
              style={{
                marginLeft: "80%",
                width: "15%",
                aspectRatio: "2 / 1",
                borderRadius: 999,
                background: bedrock ? "linear-gradient(90deg,#0f9b6a,#34d399)" : "rgba(255,255,255,0.15)",
                border: bedrock ? "1px solid rgba(74,222,128,0.85)" : "1px solid rgba(255,255,255,0.35)",
                boxShadow: bedrock ? "0 0 10px rgba(52,211,153,0.7)" : "none",
                position: "relative",
                flexShrink: 0,
              }}
            >
              <div
                className="csmp-toggle-knob"
                style={{
                  position: "absolute",
                  top: "10%",
                  left: "8%",
                  height: "80%",
                  aspectRatio: "1 / 1",
                  borderRadius: "50%",
                  background: "#fff",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
                  transform: bedrock ? "translateX(95%)" : "translateX(0%)",
                }}
              />
            </div>
          </div>
        )}

        {/* Continue box — entire box clickable */}
        {dBox3 && (
          <button
            onClick={handleSubmit}
            disabled={!username.trim()}
            className="csmp-glow-continue-box"
            style={{
              position: "absolute",
              left: dBox3.left,
              top: dBox3.top,
              width: dBox3.width,
              height: dBox3.height,
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
              className="csmp-glow-continue-text"
              style={{
                fontFamily: MC,
                fontSize: 20,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: 3,
                opacity: username.trim() ? 1 : 0.55,
                display: "inline-block",
              }}
            >
              CONTINUE
            </span>
          </button>
        )}
      </div>
      )}
    </div>
  );
}
