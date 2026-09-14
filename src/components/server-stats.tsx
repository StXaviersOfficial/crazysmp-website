"use client";

import * as React from "react";

/**
 * ServerStats — two info buttons below the logo, like FireMC.
 *
 * Left button: Discord logo + "20/200" (online/total members, live)
 * Right button: Minecraft logo + "5/100" (online players, live) or "OFFLINE" red
 *
 * Polls /api/discord-stats (60s cache) and /api/server-status (15s cache)
 * every 30 seconds from the client. Falls back gracefully on errors.
 */

const MC_FONT = "'Minecraft', 'Inter', monospace";
const DISCORD_URL = "https://discord.gg/GFzAeUj7TJ";
const SERVER_IP = "crazynetwork.mc-connect.xyz";
const SERVER_PORT = 25569;

function DiscordLogo({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: size, height: size }} aria-hidden>
      <path d="M20.317 4.369C18.777 3.699 17.135 3.213 15.429 2.948C15.213 3.341 14.961 3.87 14.789 4.285C12.988 4.04 11.211 4.04 9.443 4.285C9.271 3.87 9.013 3.341 8.797 2.948C7.09 3.213 5.447 3.7 3.908 4.371C0.926 8.812 0.139 13.139 0.532 17.41C2.584 18.918 4.572 19.831 6.525 20.428C7.022 19.752 7.464 19.034 7.843 18.276C7.117 18.006 6.423 17.675 5.771 17.291C5.941 17.166 6.108 17.036 6.271 16.902C9.954 18.608 13.952 18.608 17.591 16.902C17.755 17.036 17.923 17.166 18.092 17.291C17.439 17.676 16.744 18.007 16.018 18.277C16.397 19.034 16.839 19.753 17.336 20.429C19.29 19.832 21.279 18.919 23.331 17.41C23.797 12.492 22.532 8.205 20.317 4.369ZM8.318 14.731C7.213 14.731 6.305 13.715 6.305 12.462C6.305 11.209 7.194 10.192 8.318 10.192C9.442 10.192 10.35 11.209 10.331 12.462C10.331 13.715 9.442 14.731 8.318 14.731ZM15.914 14.731C14.809 14.731 13.901 13.715 13.901 12.462C13.901 11.209 14.79 10.192 15.914 10.192C17.038 10.192 17.946 11.209 17.927 12.462C17.927 13.715 17.038 14.731 15.914 14.731Z" />
    </svg>
  );
}

function MinecraftLogo({ size = 22 }: { size?: number }) {
  // Simplified Minecraft grass block icon
  return (
    <svg viewBox="0 0 24 24" style={{ width: size, height: size }} aria-hidden>
      {/* Top grass layer (green) */}
      <rect x="2" y="4" width="20" height="5" fill="#5fb344" />
      {/* Dirt body (brown) */}
      <rect x="2" y="9" width="20" height="11" fill="#8b5a2b" />
      {/* Grass pixel pattern */}
      <rect x="4" y="4" width="2" height="2" fill="#7ac655" />
      <rect x="8" y="4" width="2" height="2" fill="#4a8c3a" />
      <rect x="14" y="4" width="2" height="2" fill="#7ac65a" />
      <rect x="18" y="4" width="2" height="2" fill="#4a8c3a" />
      {/* Dirt pixel pattern */}
      <rect x="5" y="11" width="2" height="2" fill="#a06b3a" />
      <rect x="11" y="11" width="2" height="2" fill="#6b3f1a" />
      <rect x="16" y="11" width="2" height="2" fill="#a06b3a" />
      <rect x="7" y="14" width="2" height="2" fill="#6b3f1a" />
      <rect x="13" y="14" width="2" height="2" fill="#a06b3a" />
      <rect x="18" y="14" width="2" height="2" fill="#6b3f1a" />
      <rect x="4" y="16" width="2" height="2" fill="#a06b3a" />
      <rect x="10" y="16" width="2" height="2" fill="#6b3f1a" />
      <rect x="15" y="16" width="2" height="2" fill="#a06b3a" />
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
    }, 30000); // refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: "flex",
      gap: 12,
      justifyContent: "center",
      alignItems: "center",
      padding: "0 20px 30px",
      flexWrap: "wrap",
    }}>
      {/* Discord button */}
      <a
        href={DISCORD_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "rgba(88, 101, 242, 0.15)",
          border: "1.5px solid rgba(88, 101, 242, 0.6)",
          borderRadius: 12,
          padding: "12px 18px",
          color: "#A5B4FC",
          fontFamily: MC_FONT,
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: "0 0 16px -4px rgba(88, 101, 242, 0.5)",
        }}
      >
        <DiscordLogo size={22} />
        <span>
          {discord ? (
            <>
              <span style={{ color: "#fff" }}>{discord.online}</span>
              <span style={{ opacity: 0.5 }}> / {discord.members}</span>
            </>
          ) : (
            <span style={{ opacity: 0.5 }}>...</span>
          )}
        </span>
      </a>

      {/* Minecraft server button — copies IP to clipboard */}
      <button
        onClick={() => {
          navigator.clipboard?.writeText(`${SERVER_IP}:${SERVER_PORT}`).catch(() => {});
        }}
        title={`Click to copy: ${SERVER_IP}:${SERVER_PORT}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: server?.online
            ? "rgba(34, 197, 94, 0.15)"
            : "rgba(220, 38, 38, 0.15)",
          border: server?.online
            ? "1.5px solid rgba(34, 197, 94, 0.6)"
            : "1.5px solid rgba(220, 38, 38, 0.6)",
          borderRadius: 12,
          padding: "12px 18px",
          color: server?.online ? "#4ADE80" : "#FCA5A5",
          fontFamily: MC_FONT,
          fontWeight: 700,
          fontSize: 14,
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: server?.online
            ? "0 0 16px -4px rgba(34, 197, 94, 0.5)"
            : "0 0 16px -4px rgba(220, 38, 38, 0.5)",
        }}
      >
        <MinecraftLogo size={22} />
        {server === null ? (
          <span style={{ opacity: 0.5 }}>...</span>
        ) : server.online ? (
          <span>
            <span style={{ color: "#fff" }}>{server.players?.online ?? 0}</span>
            <span style={{ opacity: 0.5 }}> / {server.players?.max ?? 0}</span>
          </span>
        ) : (
          <span style={{ color: "#FCA5A5" }}>OFFLINE</span>
        )}
      </button>
    </div>
  );
}
