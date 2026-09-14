"use client";

import * as React from "react";

/**
 * ServerStats — two info buttons below the logo, like FireMC.
 *
 * No box/border around the logos — just the logo + count, floating.
 *
 * Layout (vertical per button):
 *   [LOGO]    ← 54px (1.5x the old 36px), pulsing scale + glow
 *   [COUNT]   ← green for online, white for total, Space Grotesk font
 *
 * Below both buttons: server IP in bold normal font. Clicking the IP
 * (or the MC button) copies the IP to clipboard.
 *
 * Polls /api/discord-stats (60s cache) and /api/server-status (15s cache)
 * every 30 seconds from the client.
 */

const MC_FONT = "'Minecraft', 'Inter', monospace";
const PRICE_FONT = "'Space Grotesk', 'Inter', sans-serif";
const DISCORD_URL = "https://discord.gg/GFzAeUj7TJ";
const SERVER_IP = "crazynetwork.mc-connect.xyz";
const SERVER_PORT = 25569;

/** Official Discord "Clyde" logo (from simpleicons.org) */
function DiscordLogo({ size = 54 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: size, height: size }} aria-hidden>
      <path d="M20.317 4.369C18.777 3.699 17.135 3.213 15.429 2.948C15.213 3.341 14.961 3.87 14.789 4.285C12.988 4.04 11.211 4.04 9.443 4.285C9.271 3.87 9.013 3.341 8.797 2.948C7.09 3.213 5.447 3.7 3.908 4.371C0.926 8.812 0.139 13.139 0.532 17.41C2.584 18.918 4.572 19.831 6.525 20.428C7.022 19.752 7.464 19.034 7.843 18.276C7.117 18.006 6.423 17.675 5.771 17.291C5.941 17.166 6.108 17.036 6.271 16.902C9.954 18.608 13.952 18.608 17.591 16.902C17.755 17.036 17.923 17.166 18.092 17.291C17.439 17.676 16.744 18.007 16.018 18.277C16.397 19.034 16.839 19.753 17.336 20.429C19.29 19.832 21.279 18.919 23.331 17.41C23.797 12.492 22.532 8.205 20.317 4.369ZM8.318 14.731C7.213 14.731 6.305 13.715 6.305 12.462C6.305 11.209 7.194 10.192 8.318 10.192C9.442 10.192 10.35 11.209 10.331 12.462C10.331 13.715 9.442 14.731 8.318 14.731ZM15.914 14.731C14.809 14.731 13.901 13.715 13.901 12.462C13.901 11.209 14.79 10.192 15.914 10.192C17.038 10.192 17.946 11.209 17.927 12.462C17.927 13.715 17.038 14.731 15.914 14.731Z" />
    </svg>
  );
}

export function ServerStats() {
  const [discord, setDiscord] = React.useState<{ members: number; online: number } | null>(null);
  const [server, setServer] = React.useState<{ online: boolean; players?: { online: number; max: number } } | null>(null);

  const fetchDiscord = async () => {
    try {
      const res = await fetch("/api/discord-stats");
      const data = await res.json();
      if (!data.error) setDiscord({ members: data.members, online: data.online });
    } catch {}
  };

  const fetchServer = async () => {
    try {
      const res = await fetch("/api/server-status");
      const data = await res.json();
      setServer(data);
    } catch {
      setServer({ online: false });
    }
  };

  React.useEffect(() => {
    fetchDiscord();
    fetchServer();
    const interval = setInterval(() => {
      fetchServer();
      fetchDiscord();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const copyIp = () => {
    navigator.clipboard?.writeText(`${SERVER_IP}:${SERVER_PORT}`).catch(() => {});
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "0 20px 30px" }}>
      <style>{`
        @keyframes csmp-stat-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes csmp-stat-glow-dc {
          0%, 100% { filter: drop-shadow(0 0 6px rgba(88,101,242,0.4)) drop-shadow(0 0 14px rgba(88,101,242,0.2)); }
          50% { filter: drop-shadow(0 0 12px rgba(88,101,242,0.8)) drop-shadow(0 0 28px rgba(88,101,242,0.5)); }
        }
        @keyframes csmp-stat-glow-mc {
          0%, 100% { filter: drop-shadow(0 0 6px rgba(34,197,94,0.4)) drop-shadow(0 0 14px rgba(34,197,94,0.2)); }
          50% { filter: drop-shadow(0 0 12px rgba(34,197,94,0.8)) drop-shadow(0 0 28px rgba(34,197,94,0.5)); }
        }
        @keyframes csmp-stat-glow-mc-off {
          0%, 100% { filter: drop-shadow(0 0 6px rgba(220,38,38,0.4)) drop-shadow(0 0 14px rgba(220,38,38,0.2)); }
          50% { filter: drop-shadow(0 0 12px rgba(220,38,38,0.8)) drop-shadow(0 0 28px rgba(220,38,38,0.5)); }
        }
        .csmp-stat-btn {
          animation: csmp-stat-pulse 2.8s ease-in-out infinite;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 0;
          background: transparent;
          border: none;
          text-decoration: none;
          cursor: pointer;
        }
        .csmp-stat-logo-dc { animation: csmp-stat-glow-dc 2.8s ease-in-out infinite; }
        .csmp-stat-logo-mc { animation: csmp-stat-glow-mc 2.8s ease-in-out infinite; }
        .csmp-stat-logo-mc-off { animation: csmp-stat-glow-mc-off 2.8s ease-in-out infinite; }
        .csmp-stat-ip {
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .csmp-stat-ip:hover { color: #22D3EE !important; }
      `}</style>

      <div style={{ display: "flex", gap: 40, justifyContent: "center", alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Discord button — logo on top, count below, no box */}
        <a
          href={DISCORD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="csmp-stat-btn"
          style={{ color: "#A5B4FC" }}
        >
          <div className="csmp-stat-logo-dc" style={{ color: "#5865F2", display: "flex", justifyContent: "center" }}>
            <DiscordLogo size={54} />
          </div>
          <div style={{ fontFamily: PRICE_FONT, fontWeight: 700, fontSize: 18, lineHeight: 1 }}>
            {discord ? (
              <>
                <span style={{ color: "#4ADE80" }}>{discord.online}</span>
                <span style={{ color: "#fff", opacity: 0.7 }}> / {discord.members}</span>
              </>
            ) : (
              <span style={{ opacity: 0.4, color: "#fff" }}>...</span>
            )}
          </div>
        </a>

        {/* Minecraft button — official logo from user, count below, no box */}
        <button
          onClick={copyIp}
          title={`Click to copy: ${SERVER_IP}:${SERVER_PORT}`}
          className="csmp-stat-btn"
          style={{ color: server?.online ? "#4ADE80" : "#FCA5A5" }}
        >
          <div
            className={server?.online ? "csmp-stat-logo-mc" : "csmp-stat-logo-mc-off"}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <img
              src="/mc-logo.webp"
              alt="Minecraft"
              style={{ width: 54, height: 54, objectFit: "contain" }}
              draggable={false}
            />
          </div>
          <div style={{ fontFamily: PRICE_FONT, fontWeight: 700, fontSize: 18, lineHeight: 1 }}>
            {server === null ? (
              <span style={{ opacity: 0.4, color: "#fff" }}>...</span>
            ) : server.online ? (
              <span style={{ color: "#4ADE80" }}>{server.players?.online ?? 0}</span>
            ) : (
              <span style={{ color: "#FCA5A5" }}>OFFLINE</span>
            )}
          </div>
        </button>
      </div>

      {/* Server IP below both buttons — click to copy, bold normal font */}
      <button
        onClick={copyIp}
        title="Click to copy IP"
        className="csmp-stat-ip"
        style={{
          fontFamily: PRICE_FONT,
          fontWeight: 700,
          fontSize: 13,
          color: "rgba(255,255,255,0.6)",
          textAlign: "center",
          letterSpacing: 0.3,
          background: "transparent",
          border: "none",
          padding: 0,
          marginTop: 16,
          cursor: "pointer",
        }}
      >
        {SERVER_IP}:{SERVER_PORT}
      </button>
    </div>
  );
}
