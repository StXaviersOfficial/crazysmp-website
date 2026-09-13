"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Copy, Check, ExternalLink, ChevronDown, Shield, Zap, Users, Key, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollProgress, CustomCursor, StaggerGroup, FadeUp, Magnetic, TextReveal, Counter } from "@/components/motion-primitives";
import { NoiseOverlay } from "@/components/noise-overlay";

const SERVER_IP = "crazysmp.bond";
const DISCORD_URL = "https://discord.gg/GFzAeUj7TJ";

const RANKS = [
  { name: "VIP", tier: "I", label: "NEW", price: "$5", color: "#22D3EE", desc: "The first step into greatness.", perks: ["/feed", "/heal", "/nick", "2 homes", "Colored chat"] },
  { name: "LEGEND", tier: "II", label: "STARTER", price: "$10", color: "#06B6D4", desc: "Legends never die. Rise above.", perks: ["All VIP perks", "/fly", "5 homes", "/ec", "Particles"] },
  { name: "IMMORTAL", tier: "III", label: "EXPERT", price: "$15", color: "#0EA5E9", desc: "Unkillable spirit, unstoppable drive.", perks: ["All LEGEND perks", "/god", "8 homes", "Custom join msg"] },
  { name: "TITAN", tier: "IV", label: "MASTER", price: "$25", color: "#3B82F6", desc: "Power befitting a god.", perks: ["All IMMORTAL perks", "12 homes", "/tp", "Custom death msg"] },
  { name: "TECHNO", tier: "V", label: "ELITE", price: "$35", color: "#6366F1", desc: "Where chaos meets machine.", perks: ["All TITAN perks", "20 homes", "Unlimited /tp", "Custom tags"] },
  { name: "CRAZY", tier: "VI", label: "MAX", price: "$50", color: "#8B5CF6", desc: "The pinnacle. No cap, no limit.", perks: ["All TECHNO perks", "Unlimited homes", "/gm", "All kits"] },
];

const KEYS = [
  { name: "SPAWNER KEY", rarity: "COMMON", price: "$3", color: "#22C55E", desc: "Unlock rare mob spawners.", drops: ["Mob Spawners", "XP Bottles", "Building Blocks"] },
  { name: "MEGA KEY", rarity: "RARE", price: "$7", color: "#3B82F6", desc: "Massive rewards, massive loot.", drops: ["Enchanted Gear", "Diamond Sets", "Golden Apples"] },
  { name: "CRAZY KEY", rarity: "EPIC", price: "$12", color: "#A855F7", desc: "The legendary key. Elite gear.", drops: ["Netherite Gear", "God Apples", "Shulker Boxes", "Custom Items"] },
];

const STAFF = [
  { name: "CrazyAnishXD", role: "Systems & Economy Mastermind", initial: "A", color: "#22D3EE", desc: "The mind behind custom systems and economy balance." },
  { name: "TitanPlayz", role: "Community Champion & Architect", initial: "T", color: "#3B82F6", desc: "Built a stable home for alliances and massive events." },
  { name: "SparkStrider", role: "COPS&W Co-Founder", initial: "S", color: "#6366F1", desc: "Directs tactical intelligence and server security." },
  { name: "Noty_Plays", role: "COPS&W Co-Founder", initial: "N", color: "#8B5CF6", desc: "Spearheads network oversight and community defense." },
];

const FEATURES = [
  { title: "Progressive Economy", desc: "Upgrade across tiered ranks and climb the leaderboard.", icon: Zap },
  { title: "Dynamic Key Rewards", desc: "Trade invites or vote points for keys to unlock elite gear.", icon: Key },
  { title: "Community Events", desc: "Server-wide wars, treasure hunts, and seasonal boss fights.", icon: Users },
  { title: "COPS&W Security", desc: "TITAN bot network safeguards every player. Alt detection.", icon: Shield },
];

const TICKER = ["CRAZY SMP SEASON 4 LIVE NOW", "COPS&W TITAN BOT DEPLOYED", "RANKS: VIP / LEGEND / IMMORTAL / TITAN / TECHNO / CRAZY", "KEYS: SPAWNER / MEGA / CRAZY", "SERVER WAR SATURDAY · TREASURE HUNT WEDNESDAY", "JOIN DISCORD: discord.gg/GFzAeUj7TJ"];

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [serverOnline, setServerOnline] = useState(false);
  const [playerCount, setPlayerCount] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(100);
  const [activeTab, setActiveTab] = useState<"ranks" | "keys">("ranks");
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);

  const copyIP = () => { navigator.clipboard.writeText(SERVER_IP); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`https://api.mcsrvstat.us/3/${SERVER_IP}`);
        const data = await res.json();
        setServerOnline(data.online || false);
        setPlayerCount(data.players?.online || 0);
        setMaxPlayers(data.players?.max || 100);
      } catch { setServerOnline(false); }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <ScrollProgress />
      <CustomCursor />
      <NoiseOverlay />

      {/* Background image */}
      <div className="fixed inset-0 z-0 opacity-20">
        <img src="/crazysmp-bg.png" alt="" className="w-full h-full object-cover" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-primary/15">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/crazysmp-logo.webp" alt="CrazySMP" className="w-8 h-8 rounded-lg" />
            <span className="text-xl font-bold tracking-tight">Crazy<span className="text-gradient-cyan">SMP</span></span>
            <Badge variant="outline" className="border-primary/40 text-primary/70 text-[10px] font-mono">S4</Badge>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-foreground/70">
            <a href="#store" className="link-underline hover:text-primary transition">Store</a>
            <a href="#about" className="link-underline hover:text-primary transition">About</a>
            <a href="#staff" className="link-underline hover:text-primary transition">Staff</a>
          </div>
          <Magnetic strength={0.3}>
            <Button asChild size="sm" className="bg-primary/15 border border-primary/40 text-primary hover:bg-primary/25 hover:text-primary font-medium">
              <a href={DISCORD_URL} target="_blank" rel="noreferrer">Discord</a>
            </Button>
          </Magnetic>
        </div>
      </nav>

      {/* Hero */}
      <motion.section style={{ y: heroY }} className="relative min-h-screen flex items-center justify-center px-5 sm:px-8 pt-20 z-10">
        <div className="relative max-w-5xl mx-auto text-center">
          <StaggerGroup className="flex flex-col items-center gap-6" stagger={0.1}>
            <FadeUp>
              <img src="/crazysmp-logo.webp" alt="CrazySMP Logo" className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-2xl glow-cyan" />
            </FadeUp>
            <FadeUp>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-xs font-mono text-primary/80">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                SMP · SEASON IV · VANILLA+
              </span>
            </FadeUp>
            <FadeUp>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95]">
                <TextReveal text="CRAZY" /><br />
                <span className="text-gradient-cyan"><TextReveal text="SMP" delay={0.3} /></span>
              </h1>
            </FadeUp>
            <FadeUp>
              <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl leading-relaxed">
                A heavily customized vanilla+ Minecraft SMP where creativity meets chaos. Build your kingdom, forge alliances, and write your legacy.
              </p>
            </FadeUp>
            <FadeUp>
              <div className="flex flex-col sm:flex-row gap-3">
                <Magnetic strength={0.4}>
                  <Button onClick={copyIP} size="lg" className="bg-primary hover:bg-primary/90 text-background font-bold text-base px-8 h-12 pulse-glow border-0 group">
                    {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    {copied ? "COPIED!" : `PLAY — ${SERVER_IP}`}
                  </Button>
                </Magnetic>
                <Magnetic strength={0.4}>
                  <Button asChild size="lg" variant="outline" className="border-primary/50 text-primary/80 hover:bg-primary/10 hover:text-primary hover:border-primary bg-primary/5 text-base px-8 h-12">
                    <a href={DISCORD_URL} target="_blank" rel="noreferrer"><ExternalLink className="mr-2 h-4 w-4" /> DISCORD</a>
                  </Button>
                </Magnetic>
              </div>
            </FadeUp>
            <FadeUp>
              <div className="flex items-center justify-center gap-3 mt-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/40 border border-primary/20 backdrop-blur">
                  <div className={`w-2.5 h-2.5 rounded-full ${serverOnline ? "bg-green-500" : "bg-red-500"} animate-pulse`} />
                  <span className="text-sm text-foreground/60 font-mono">{serverOnline ? `${playerCount}/${maxPlayers} playing` : "Server starting..."}</span>
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="flex flex-wrap items-center justify-center gap-8 mt-6">
                {[{v:6,l:"RANK TIERS"},{v:3,l:"KEY TYPES"},{v:100,l:"MAX PLAYERS"}].map((s,i)=>(
                  <div key={i} className="text-center">
                    <div className="text-4xl font-black text-gradient-cyan"><Counter to={s.v} /></div>
                    <div className="text-xs text-foreground/50 font-mono uppercase tracking-wider mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </StaggerGroup>
        </div>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronDown className="h-5 w-5 text-primary/40" />
        </motion.div>
      </motion.section>

      {/* Ticker */}
      <div className="relative z-10 overflow-hidden py-3 bg-primary/5 border-y border-primary/10">
        <motion.div animate={{ x: ["100%", "-100%"] }} transition={{ repeat: Infinity, duration: 30, ease: "linear" }} className="whitespace-nowrap flex gap-8 text-sm text-primary/50 font-mono">
          {TICKER.map((t,i)=><span key={i}>{t}</span>)}
          {TICKER.map((t,i)=><span key={`d${i}`}>{t}</span>)}
        </motion.div>
      </div>

      {/* Store Section — FireMC-style */}
      <section id="store" className="relative z-10 py-24 px-5 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <StaggerGroup className="text-center mb-12">
            <FadeUp><Badge variant="outline" className="border-primary/40 text-primary/60 mb-4 font-mono">OFFICIAL STORE</Badge></FadeUp>
            <FadeUp><h2 className="text-4xl sm:text-5xl font-bold mb-4">CrazySMP <span className="text-gradient-cyan">Store</span></h2></FadeUp>
            <FadeUp><p className="text-foreground/60 max-w-xl mx-auto">Purchase ranks and keys to enhance your gameplay. All payments are final and non-refundable.</p></FadeUp>
          </StaggerGroup>

          {/* Tab switcher */}
          <FadeUp>
            <div className="flex justify-center gap-2 mb-10">
              <button onClick={() => setActiveTab("ranks")} className={`px-6 py-2 rounded-full text-sm font-medium transition ${activeTab==="ranks"?"bg-primary text-background":"bg-primary/10 text-primary/60 hover:bg-primary/20"}`}>Ranks</button>
              <button onClick={() => setActiveTab("keys")} className={`px-6 py-2 rounded-full text-sm font-medium transition ${activeTab==="keys"?"bg-primary text-background":"bg-primary/10 text-primary/60 hover:bg-primary/20"}`}>Keys</button>
            </div>
          </FadeUp>

          {/* Ranks grid */}
          {activeTab === "ranks" && (
            <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {RANKS.map((r,i) => (
                <FadeUp key={i} delay={i*0.08}>
                  <div className="glass-card p-6 h-full relative overflow-hidden group" style={{ borderColor: `${r.color}30` }}>
                    <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${r.color}, transparent)` }} />
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl font-black" style={{ color: r.color }}>{r.name}</h3>
                      <div className="text-2xl font-black text-foreground">{r.price}</div>
                    </div>
                    <Badge className="mb-3 text-xs" style={{ background: `${r.color}15`, color: r.color }}>TIER {r.tier} · {r.label}</Badge>
                    <p className="text-sm text-foreground/60 mb-4">{r.desc}</p>
                    <ul className="space-y-1.5 mb-5">
                      {r.perks.map((p,j) => (
                        <li key={j} className="text-xs text-foreground/50 flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full" style={{ background: r.color }} /> {p}
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="w-full text-sm h-10" style={{ background: `${r.color}20`, border: `1px solid ${r.color}50`, color: r.color }}>
                      <a href={DISCORD_URL} target="_blank" rel="noreferrer"><ShoppingCart className="mr-2 h-3.5 w-3.5" /> Buy {r.name}</a>
                    </Button>
                  </div>
                </FadeUp>
              ))}
            </StaggerGroup>
          )}

          {/* Keys grid */}
          {activeTab === "keys" && (
            <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {KEYS.map((k,i) => (
                <FadeUp key={i} delay={i*0.15}>
                  <div className="glass-card p-8 text-center h-full" style={{ borderColor: `${k.color}30` }}>
                    <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center" style={{ background: `${k.color}15`, border: `1px solid ${k.color}40` }}>
                      <Key className="h-8 w-8" style={{ color: k.color }} />
                    </div>
                    <Badge className="mb-3 text-xs" style={{ background: `${k.color}15`, color: k.color }}>{k.rarity}</Badge>
                    <h3 className="text-xl font-bold mb-1" style={{ color: k.color }}>{k.name}</h3>
                    <div className="text-2xl font-black mb-3">{k.price}</div>
                    <p className="text-sm text-foreground/60 mb-4">{k.desc}</p>
                    <div className="space-y-1.5 mb-5">
                      {k.drops.map((d,j) => (
                        <div key={j} className="text-xs text-foreground/40 flex items-center justify-center gap-2">
                          <span className="w-1 h-1 rounded-full" style={{ background: k.color }} /> {d}
                        </div>
                      ))}
                    </div>
                    <Button asChild className="w-full text-sm h-10" style={{ background: `${k.color}20`, border: `1px solid ${k.color}50`, color: k.color }}>
                      <a href={DISCORD_URL} target="_blank" rel="noreferrer"><ShoppingCart className="mr-2 h-3.5 w-3.5" /> Buy</a>
                    </Button>
                  </div>
                </FadeUp>
              ))}
            </StaggerGroup>
          )}

          <FadeUp><p className="text-center mt-10 text-foreground/40 text-sm">Want a rank or key? Open a ticket in our Discord server to claim it.</p></FadeUp>
        </div>
      </section>

      {/* About */}
      <section id="about" className="relative z-10 py-24 px-5 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <StaggerGroup className="text-center mb-14">
            <FadeUp><h2 className="text-4xl sm:text-5xl font-bold mb-4">Welcome to <span className="text-gradient-cyan">Crazy SMP</span></h2></FadeUp>
            <FadeUp><p className="text-foreground/60 max-w-2xl mx-auto text-lg leading-relaxed">A premier Minecraft multiplayer community led by CrazyAnishXD, TitanPlayz, and the COPS&W security division.</p></FadeUp>
          </StaggerGroup>
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f,i) => (
              <FadeUp key={i} delay={i*0.1}>
                <div className="glass-card p-6 h-full">
                  <f.icon className="h-6 w-6 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-foreground/60 leading-relaxed">{f.desc}</p>
                </div>
              </FadeUp>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Staff */}
      <section id="staff" className="relative z-10 py-24 px-5 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <StaggerGroup className="text-center mb-14">
            <FadeUp><h2 className="text-4xl sm:text-5xl font-bold mb-2">Leadership & <span className="text-gradient-cyan">Legacy</span></h2></FadeUp>
          </StaggerGroup>
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STAFF.map((m,i) => (
              <FadeUp key={i} delay={i*0.1}>
                <div className="glass-card p-6 flex items-start gap-5">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black flex-shrink-0" style={{ background: `${m.color}20`, border: `1px solid ${m.color}50`, color: m.color, boxShadow: `0 0 20px ${m.color}30` }}>
                    {m.initial}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{m.name}</h3>
                    <p className="text-xs font-medium mb-2" style={{ color: m.color }}>{m.role}</p>
                    <p className="text-sm text-foreground/60 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24 px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <StaggerGroup>
            <FadeUp><h2 className="text-4xl sm:text-6xl font-black mb-4">Ready to go <span className="text-gradient-cyan">crazy?</span></h2></FadeUp>
            <FadeUp><p className="text-foreground/60 mb-8 max-w-xl mx-auto text-lg">Your story starts the moment you log in.</p></FadeUp>
            <FadeUp>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Magnetic strength={0.4}>
                  <Button onClick={copyIP} size="lg" className="bg-primary hover:bg-primary/90 text-background font-bold px-8 h-12 pulse-glow border-0">
                    {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    {copied ? "COPIED!" : "COPY SERVER IP"}
                  </Button>
                </Magnetic>
                <Magnetic strength={0.4}>
                  <Button asChild size="lg" variant="outline" className="border-primary/50 text-primary/80 hover:bg-primary/10 hover:text-primary hover:border-primary bg-primary/5 font-bold px-8 h-12">
                    <a href={DISCORD_URL} target="_blank" rel="noreferrer">JOIN DISCORD</a>
                  </Button>
                </Magnetic>
              </div>
            </FadeUp>
            <FadeUp><p className="mt-6 text-primary/40 text-sm font-mono">{SERVER_IP}</p></FadeUp>
          </StaggerGroup>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mt-auto border-t border-primary/10 py-8 px-5 sm:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-foreground/50 text-sm mb-2"><span className="font-bold text-gradient-cyan">CrazySMP</span> — Founded by CrazyAnishXD & TitanPlayz</p>
          <p className="text-foreground/30 text-xs">Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.</p>
          <p className="text-foreground/20 text-xs mt-2">© 2026 Crazy SMP. Crafted with ♥</p>
        </div>
      </footer>
    </div>
  );
}
