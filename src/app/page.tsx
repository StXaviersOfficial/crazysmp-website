"use client";

import { useState, useEffect } from "react";
import { Copy, Check, ExternalLink, ChevronDown, Shield, Zap, Users, Key, ShoppingCart, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollProgress, CustomCursor, FadeUp } from "@/components/motion-primitives";
import { NoiseOverlay } from "@/components/noise-overlay";

const SERVER_IP = "crazysmp.bond";
const DISCORD_URL = "https://discord.gg/GFzAeUj7TJ";

const RANKS = [
  { name: "VIP", price: "$5", color: "#22D3EE", desc: "The first step into greatness.", perks: ["/feed", "/heal", "/nick", "2 homes"] },
  { name: "LEGEND", price: "$10", color: "#06B6D4", desc: "Legends never die.", perks: ["All VIP", "/fly", "5 homes", "/ec"] },
  { name: "IMMORTAL", price: "$15", color: "#0EA5E9", desc: "Unkillable spirit.", perks: ["All LEGEND", "/god", "8 homes"] },
  { name: "TITAN", price: "$25", color: "#3B82F6", desc: "Power befitting a god.", perks: ["All IMMORTAL", "12 homes", "/tp"] },
  { name: "TECHNO", price: "$35", color: "#6366F1", desc: "Where chaos meets machine.", perks: ["All TITAN", "20 homes"] },
  { name: "CRAZY", price: "$50", color: "#8B5CF6", desc: "The pinnacle. No limit.", perks: ["All TECHNO", "Unlimited", "/gm"] },
];

const KEYS = [
  { name: "SPAWNER KEY", price: "$3", rarity: "COMMON", color: "#22C55E", desc: "Rare mob spawners.", drops: ["Spawners", "XP Bottles", "Blocks"] },
  { name: "MEGA KEY", price: "$7", rarity: "RARE", color: "#3B82F6", desc: "Massive loot tables.", drops: ["Enchanted Gear", "Diamond Sets", "Gapples"] },
  { name: "CRAZY KEY", price: "$12", rarity: "EPIC", color: "#A855F7", desc: "Elite gear & resources.", drops: ["Netherite", "God Apples", "Shulkers"] },
];

const STAFF = [
  { name: "CrazyAnishXD", role: "Systems & Economy", initial: "A", color: "#22D3EE" },
  { name: "TitanPlayz", role: "Community & Architecture", initial: "T", color: "#3B82F6" },
  { name: "SparkStrider", role: "COPS&W Security", initial: "S", color: "#6366F1" },
  { name: "Noty_Plays", role: "COPS&W Security", initial: "N", color: "#8B5CF6" },
];

const FEATURES = [
  { title: "Progressive Economy", desc: "Climb the leaderboard.", icon: Zap },
  { title: "Dynamic Keys", desc: "Elite gear & rare resources.", icon: Key },
  { title: "Community Events", desc: "Wars, hunts, boss fights.", icon: Users },
  { title: "COPS&W Security", desc: "TITAN bot protection.", icon: Shield },
];

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [serverOnline, setServerOnline] = useState(false);
  const [playerCount, setPlayerCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"ranks" | "keys">("ranks");
  const [showLogin, setShowLogin] = useState(false);
  const [mcUsername, setMcUsername] = useState("");
  const [isBedrock, setIsBedrock] = useState(false);

  const copyIP = () => { navigator.clipboard.writeText(SERVER_IP); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`https://api.mcsrvstat.us/3/${SERVER_IP}`);
        const data = await res.json();
        setServerOnline(data.online || false);
        setPlayerCount(data.players?.online || 0);
      } catch { setServerOnline(false); }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    const name = isBedrock ? `.${mcUsername}` : mcUsername;
    if (mcUsername.trim()) {
      window.open(`${DISCORD_URL}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <ScrollProgress />
      <CustomCursor />
      <NoiseOverlay />

      {/* Minecraft-themed background */}
      <div className="fixed inset-0 z-0">
        <img src="/mc-bg.png" alt="" className="w-full h-full object-cover opacity-10" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-primary/15">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/nav-logo.jpg" alt="CrazySMP" className="w-8 h-8 rounded object-cover" />
            <span className="text-lg font-bold">Crazy<span className="text-gradient-cyan">SMP</span></span>
          </div>
          <div className="hidden md:flex items-center gap-5 text-sm text-foreground/60">
            <a href="#store" className="hover:text-primary transition">Store</a>
            <a href="#about" className="hover:text-primary transition">About</a>
            <a href="#staff" className="hover:text-primary transition">Staff</a>
          </div>
          <Button size="sm" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 text-sm" onClick={() => setShowLogin(!showLogin)}>
            <LogIn className="mr-1.5 h-3.5 w-3.5" /> Login
          </Button>
        </div>
        {/* Login dropdown */}
        {showLogin && (
          <div className="absolute top-full right-4 w-72 p-4 glass-card z-50">
            <h3 className="text-sm font-bold mb-3 text-primary">Minecraft Login</h3>
            <input
              type="text"
              placeholder="Username"
              value={mcUsername}
              onChange={(e) => setMcUsername(e.target.value)}
              className="w-full mb-2 px-3 py-2 bg-background/60 border border-primary/30 rounded text-sm text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none"
            />
            <label className="flex items-center gap-2 mb-3 text-xs text-foreground/60">
              <input type="checkbox" checked={isBedrock} onChange={(e) => setIsBedrock(e.target.checked)} className="accent-primary" />
              Bedrock player (adds . prefix)
            </label>
            <Button onClick={handleLogin} size="sm" className="w-full bg-primary text-background text-sm">
              {isBedrock && mcUsername ? `.${mcUsername}` : mcUsername || "Enter username"} → Discord
            </Button>
          </div>
        )}
      </nav>

      {/* Hero — FireMC style: BIG centered logo */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 z-10">
        {/* Big logo */}
        <FadeUp>
          <img src="/hero-logo.webp" alt="CrazySMP" className="w-48 h-48 sm:w-64 sm:h-64 rounded-2xl mb-8 glow-cyan" />
        </FadeUp>

        <FadeUp delay={0.1}>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-center mb-3">
            <span className="text-gradient-cyan">CrazySMP</span>
          </h1>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="text-base sm:text-lg text-foreground/60 max-w-lg text-center mb-6 leading-relaxed">
            Season IV · Vanilla+ · Build your kingdom, forge alliances, write your legacy.
          </p>
        </FadeUp>

        <FadeUp delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <Button onClick={copyIP} size="lg" className="bg-primary text-background font-bold px-6 h-11 pulse-glow border-0">
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              {copied ? "COPIED!" : SERVER_IP}
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 font-bold px-6 h-11">
              <a href={DISCORD_URL} target="_blank" rel="noreferrer"><ExternalLink className="mr-2 h-4 w-4" /> Discord</a>
            </Button>
          </div>
        </FadeUp>

        {/* Server status — real data */}
        <FadeUp delay={0.4}>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/40 border border-primary/20">
            <div className={`w-2 h-2 rounded-full ${serverOnline ? "bg-green-500" : "bg-orange-500"} animate-pulse`} />
            <span className="text-xs text-foreground/50 font-mono">
              {serverOnline ? `${playerCount} players online` : "Checking server status..."}
            </span>
          </div>
        </FadeUp>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-6">
          <ChevronDown className="h-5 w-5 text-primary/30" />
        </motion.div>
      </section>

      {/* Store — compact, QuackForge-style cards */}
      <section id="store" className="relative z-10 py-16 px-4">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <h2 className="text-3xl font-bold text-center mb-2">Store</h2>
            <p className="text-center text-foreground/50 text-sm mb-8">Purchase ranks and keys. Open a ticket in Discord to claim.</p>
          </FadeUp>

          {/* Tab switcher */}
          <div className="flex justify-center gap-2 mb-8">
            <button onClick={() => setActiveTab("ranks")} className={`px-5 py-1.5 rounded-full text-sm font-medium transition ${activeTab === "ranks" ? "bg-primary text-background" : "bg-primary/10 text-primary/60 hover:bg-primary/20"}`}>Ranks</button>
            <button onClick={() => setActiveTab("keys")} className={`px-5 py-1.5 rounded-full text-sm font-medium transition ${activeTab === "keys" ? "bg-primary text-background" : "bg-primary/10 text-primary/60 hover:bg-primary/20"}`}>Keys</button>
          </div>

          {/* Ranks */}
          {activeTab === "ranks" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {RANKS.map((r, i) => (
                <FadeUp key={i} delay={i * 0.05}>
                  <div className="glass-card p-5" style={{ borderColor: `${r.color}30` }}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-black" style={{ color: r.color }}>{r.name}</h3>
                      <span className="text-xl font-black">{r.price}</span>
                    </div>
                    <p className="text-xs text-foreground/50 mb-3">{r.desc}</p>
                    <div className="space-y-1 mb-4">
                      {r.perks.map((p, j) => (
                        <div key={j} className="text-xs text-foreground/40 flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full" style={{ background: r.color }} /> {p}
                        </div>
                      ))}
                    </div>
                    <Button asChild size="sm" className="w-full h-8 text-xs" style={{ background: `${r.color}20`, border: `1px solid ${r.color}50`, color: r.color }}>
                      <a href={DISCORD_URL} target="_blank" rel="noreferrer"><ShoppingCart className="mr-1 h-3 w-3" /> Buy</a>
                    </Button>
                  </div>
                </FadeUp>
              ))}
            </div>
          )}

          {/* Keys */}
          {activeTab === "keys" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {KEYS.map((k, i) => (
                <FadeUp key={i} delay={i * 0.1}>
                  <div className="glass-card p-6 text-center" style={{ borderColor: `${k.color}30` }}>
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ background: `${k.color}15`, border: `1px solid ${k.color}40` }}>
                      <Key className="h-6 w-6" style={{ color: k.color }} />
                    </div>
                    <Badge className="mb-2 text-xs" style={{ background: `${k.color}15`, color: k.color }}>{k.rarity}</Badge>
                    <h3 className="text-lg font-bold" style={{ color: k.color }}>{k.name}</h3>
                    <span className="text-lg font-black">{k.price}</span>
                    <p className="text-xs text-foreground/50 my-2">{k.desc}</p>
                    <div className="space-y-0.5 mb-4">
                      {k.drops.map((d, j) => (
                        <div key={j} className="text-xs text-foreground/40">{d}</div>
                      ))}
                    </div>
                    <Button asChild size="sm" className="w-full h-8 text-xs" style={{ background: `${k.color}20`, border: `1px solid ${k.color}50`, color: k.color }}>
                      <a href={DISCORD_URL} target="_blank" rel="noreferrer"><ShoppingCart className="mr-1 h-3 w-3" /> Buy</a>
                    </Button>
                  </div>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About — compact */}
      <section id="about" className="relative z-10 py-16 px-4">
        <div className="mx-auto max-w-6xl">
          <FadeUp><h2 className="text-3xl font-bold text-center mb-8">Why <span className="text-gradient-cyan">CrazySMP?</span></h2></FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {FEATURES.map((f, i) => (
              <FadeUp key={i} delay={i * 0.05}>
                <div className="glass-card p-4 text-center">
                  <f.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                  <h3 className="text-sm font-semibold mb-1">{f.title}</h3>
                  <p className="text-xs text-foreground/50">{f.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Staff — compact */}
      <section id="staff" className="relative z-10 py-16 px-4">
        <div className="mx-auto max-w-4xl">
          <FadeUp><h2 className="text-3xl font-bold text-center mb-8">Staff</h2></FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {STAFF.map((m, i) => (
              <FadeUp key={i} delay={i * 0.05}>
                <div className="glass-card p-4 text-center">
                  <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center text-xl font-black mb-2" style={{ background: `${m.color}20`, border: `1px solid ${m.color}50`, color: m.color }}>
                    {m.initial}
                  </div>
                  <h3 className="text-sm font-bold">{m.name}</h3>
                  <p className="text-xs" style={{ color: m.color }}>{m.role}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — minimal */}
      <section className="relative z-10 py-16 px-4 text-center">
        <FadeUp>
          <h2 className="text-3xl sm:text-4xl font-black mb-3">Ready to go <span className="text-gradient-cyan">crazy?</span></h2>
          <div className="flex gap-3 justify-center">
            <Button onClick={copyIP} className="bg-primary text-background font-bold px-6 h-11 pulse-glow border-0">
              <Copy className="mr-2 h-4 w-4" /> {copied ? "COPIED!" : "COPY IP"}
            </Button>
            <Button asChild variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 font-bold px-6 h-11">
              <a href={DISCORD_URL} target="_blank" rel="noreferrer">DISCORD</a>
            </Button>
          </div>
          <p className="mt-4 text-primary/30 text-sm font-mono">{SERVER_IP}</p>
        </FadeUp>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mt-auto border-t border-primary/10 py-6 px-4 text-center">
        <p className="text-foreground/40 text-xs">CrazySMP — Founded by CrazyAnishXD & TitanPlayz · Not affiliated with Mojang · © 2026</p>
      </footer>
    </div>
  );
}
