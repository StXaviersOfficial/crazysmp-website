"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Copy, Check, ExternalLink, ChevronDown, Shield, Zap, Users, Crown, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollProgress, CustomCursor, StaggerGroup, FadeUp, Magnetic, TextReveal, Counter } from "@/components/motion-primitives";
import { NoiseOverlay } from "@/components/noise-overlay";

const SERVER_IP = "crazysmp.bond";
const DISCORD_URL = "https://discord.gg/GFzAeUj7TJ";

const RANKS = [
  { name: "VIP", tier: "I", label: "NEW", color: "#22D3EE", desc: "The first step into greatness. Claim your name in the halls of Crazy SMP.", perks: ["/feed", "/heal", "/nick", "2 homes", "Colored chat"] },
  { name: "LEGEND", tier: "II", label: "STARTER", color: "#06B6D4", desc: "Legends never die. Enter the story and rise above the ordinary crowd.", perks: ["Everything in VIP", "/fly", "5 homes", "/ec", "Particle effects"] },
  { name: "IMMORTAL", tier: "III", label: "EXPERT", color: "#0EA5E9", desc: "Unkillable spirit, unstoppable drive. Leave a mark no time can erase.", perks: ["Everything in LEGEND", "/god", "8 homes", "Custom join msg", "Silent chest"] },
  { name: "TITAN", tier: "IV", label: "MASTER", color: "#3B82F6", desc: "Stand with the titans that shaped the world. Power befitting a god.", perks: ["Everything in IMMORTAL", "12 homes", "/tp", "Custom death msg", "Access to /kit titan"] },
  { name: "TECHNO", tier: "V", label: "ELITE", color: "#6366F1", desc: "Where chaos meets machine. Cold, calculated, completely unstoppable.", perks: ["Everything in TITAN", "20 homes", "Unlimited /tp", "Custom tags", "Priority queue"] },
  { name: "CRAZY", tier: "VI", label: "MAX", color: "#8B5CF6", desc: "The pinnacle. No cap, no limit — only the wild ones reach the top.", perks: ["Everything in TECHNO", "Unlimited homes", "/gm", "All kits", "Legendary status"] },
];

const KEYS = [
  { name: "SPAWNER KEY", rarity: "COMMON", color: "#22C55E", desc: "Unlock rare mob spawners and supercharge your farms.", drops: ["Mob Spawners", "XP Bottles", "Building Blocks"] },
  { name: "MEGA KEY", rarity: "RARE", color: "#3B82F6", desc: "Massive rewards, massive loot tables. Every turn is a jackpot.", drops: ["Enchanted Gear", "Diamond Sets", "Golden Apples", "Rare Items"] },
  { name: "CRAZY KEY", rarity: "EPIC", color: "#A855F7", desc: "The legendary key. Elite gear and the rarest resources in the whole realm.", drops: ["Netherite Gear", "God Apples", "Shulker Boxes", "Custom Items", "Spawner Keys"] },
];

const STAFF = [
  { name: "CrazyAnishXD", role: "Systems & Economy Mastermind", initial: "A", color: "#22D3EE", desc: "The mind behind custom systems, economy balance, and chaotic gameplay loops." },
  { name: "TitanPlayz", role: "Community Champion & Architect", initial: "T", color: "#3B82F6", desc: "The structural architect who built a stable home for alliances and massive events." },
  { name: "SparkStrider", role: "COPS&W Co-Founder · Threat Operations", initial: "S", color: "#6366F1", desc: "Directs tactical intelligence and server security operations." },
  { name: "Noty_Plays", role: "COPS&W Co-Founder · Player Protection", initial: "N", color: "#8B5CF6", desc: "Spearheads network oversight and community defense protocols." },
];

const FEATURES = [
  { title: "Progressive Economy", desc: "Upgrade across tiered ranks and climb the leaderboard of the realm.", icon: Zap },
  { title: "Dynamic Key Rewards", desc: "Trade invites or vote points for keys to unlock elite gear.", icon: Key },
  { title: "Community Events", desc: "Server-wide wars, treasure hunts, building competitions and seasonal boss fights.", icon: Users },
  { title: "COPS&W Security", desc: "TITAN bot network safeguards every player. Alt detection and threat monitoring.", icon: Shield },
];

const TICKER_ITEMS = [
  "CRAZY SMP SEASON 4 LIVE NOW",
  "COPS&W TITAN BOT DEPLOYED",
  "RANKS: VIP / LEGEND / IMMORTAL / TITAN / TECHNO / CRAZY",
  "KEYS: SPAWNER / MEGA / CRAZY",
  "SERVER WAR SATURDAY · TREASURE HUNT WEDNESDAY",
  "JOIN DISCORD: discord.gg/GFzAeUj7TJ",
];

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [serverOnline, setServerOnline] = useState(false);
  const [playerCount, setPlayerCount] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(100);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const copyIP = () => {
    navigator.clipboard.writeText(SERVER_IP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/60 border-b border-primary/15">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-full h-full">
                <defs>
                  <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22D3EE" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
                <path d="M20 4 L34 12 L34 28 L20 36 L6 28 L6 12 Z" fill="none" stroke="url(#logoGrad)" strokeWidth="2" />
                <path d="M14 16 L14 24 L18 24 L18 20 L22 20 L22 24 L26 24 L26 16" fill="none" stroke="url(#logoGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">
              Crazy<span className="text-gradient-cyan">SMP</span>
            </span>
            <Badge variant="outline" className="border-primary/40 text-primary/70 text-[10px] font-mono">S4</Badge>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-foreground/70">
            <a href="#about" className="link-underline hover:text-primary transition">About</a>
            <a href="#ranks" className="link-underline hover:text-primary transition">Ranks</a>
            <a href="#keys" className="link-underline hover:text-primary transition">Keys</a>
            <a href="#staff" className="link-underline hover:text-primary transition">Staff</a>
          </div>
          <Magnetic strength={0.3}>
            <Button asChild size="sm" className="bg-primary/15 border border-primary/40 text-primary hover:bg-primary/25 hover:text-primary font-medium">
              <a href={DISCORD_URL} target="_blank" rel="noreferrer">Discord</a>
            </Button>
          </Magnetic>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-screen flex items-center justify-center px-5 sm:px-8 pt-20"
      >
        <div className="relative max-w-5xl mx-auto text-center z-10">
          <StaggerGroup className="flex flex-col items-center gap-6" stagger={0.1}>
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
                <TextReveal text="CRAZY" />
                <br />
                <span className="text-gradient-cyan">
                  <TextReveal text="SMP" delay={0.3} />
                </span>
              </h1>
            </FadeUp>

            <FadeUp>
              <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl leading-relaxed">
                A heavily customized vanilla+ Minecraft SMP where creativity meets chaos.
                Build your kingdom, forge alliances, and write your legacy.
              </p>
            </FadeUp>

            <FadeUp>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Magnetic strength={0.4}>
                  <Button
                    onClick={copyIP}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-background font-bold text-base px-8 h-12 pulse-glow border-0 group"
                  >
                    {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    {copied ? "COPIED!" : `PLAY — ${SERVER_IP}`}
                  </Button>
                </Magnetic>
                <Magnetic strength={0.4}>
                  <Button asChild size="lg" variant="outline" className="border-primary/50 text-primary/80 hover:bg-primary/10 hover:text-primary hover:border-primary bg-primary/5 text-base px-8 h-12">
                    <a href={DISCORD_URL} target="_blank" rel="noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" /> DISCORD
                    </a>
                  </Button>
                </Magnetic>
              </div>
            </FadeUp>

            <FadeUp>
              <div className="flex items-center justify-center gap-3 mt-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/40 border border-primary/20 backdrop-blur">
                  <div className={`w-2.5 h-2.5 rounded-full ${serverOnline ? "bg-green-500" : "bg-red-500"} animate-pulse`} />
                  <span className="text-sm text-foreground/60 font-mono">
                    {serverOnline ? `${playerCount}/${maxPlayers} playing` : "Server starting..."}
                  </span>
                </div>
              </div>
            </FadeUp>

            {/* Stats */}
            <FadeUp delay={0.2}>
              <div className="flex flex-wrap items-center justify-center gap-8 mt-8">
                {[
                  { value: 6, label: "RANK TIERS", suffix: "" },
                  { value: 3, label: "KEY TYPES", suffix: "" },
                  { value: 100, label: "MAX PLAYERS", suffix: "" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-4xl font-black text-gradient-cyan">
                      <Counter to={stat.value} />
                    </div>
                    <div className="text-xs text-foreground/50 font-mono uppercase tracking-wider mt-1">{stat.label}</div>
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
          {TICKER_ITEMS.map((item, i) => <span key={i}>{item}</span>)}
          {TICKER_ITEMS.map((item, i) => <span key={`d-${i}`}>{item}</span>)}
        </motion.div>
      </div>

      {/* About Section */}
      <section id="about" className="relative z-10 py-24 px-5 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <StaggerGroup className="text-center mb-14">
            <FadeUp><Badge variant="outline" className="border-primary/40 text-primary/60 mb-4 font-mono">THE EXPERIENCE</Badge></FadeUp>
            <FadeUp><h2 className="text-4xl sm:text-5xl font-bold mb-4">Welcome to <span className="text-gradient-cyan">Crazy SMP</span></h2></FadeUp>
            <FadeUp><p className="text-foreground/60 max-w-2xl mx-auto text-lg leading-relaxed">A premier Minecraft multiplayer community led by CrazyAnishXD, TitanPlayz, and the COPS&W security division.</p></FadeUp>
          </StaggerGroup>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="glass-card p-6 h-full">
                  <f.icon className="h-6 w-6 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-foreground/60 leading-relaxed">{f.desc}</p>
                </div>
              </FadeUp>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Ranks Section */}
      <section id="ranks" className="relative z-10 py-24 px-5 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <StaggerGroup className="text-center mb-14">
            <FadeUp><Badge variant="outline" className="border-primary/40 text-primary/60 mb-4 font-mono">PROGRESSIVE ECONOMY</Badge></FadeUp>
            <FadeUp><h2 className="text-4xl sm:text-5xl font-bold mb-4">Paid <span className="text-gradient-cyan">Ranks</span></h2></FadeUp>
            <FadeUp><p className="text-foreground/60 max-w-xl mx-auto">Six tiers of status. Each rank unlocks more power, perks and prestige.</p></FadeUp>
          </StaggerGroup>

          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {RANKS.map((rank, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div className="glass-card p-6 h-full relative overflow-hidden group" style={{ borderColor: `${rank.color}30` }}>
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${rank.color}, transparent)` }} />
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-black" style={{ color: rank.color }}>{rank.name}</h3>
                    <Badge variant="outline" className="text-xs font-mono" style={{ borderColor: `${rank.color}50`, color: rank.color }}>TIER {rank.tier}</Badge>
                  </div>
                  <Badge className="mb-4 text-xs" style={{ background: `${rank.color}15`, color: rank.color }}>{rank.label}</Badge>
                  <p className="text-sm text-foreground/60 mb-4">{rank.desc}</p>
                  <ul className="space-y-1.5">
                    {rank.perks.map((perk, j) => (
                      <li key={j} className="text-xs text-foreground/50 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full" style={{ background: rank.color }} /> {perk}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeUp>
            ))}
          </StaggerGroup>

          <FadeUp><p className="text-center mt-10 text-foreground/40 text-sm">Want a paid rank? Open a ticket in our Discord server.</p></FadeUp>
        </div>
      </section>

      {/* Keys Section */}
      <section id="keys" className="relative z-10 py-24 px-5 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <StaggerGroup className="text-center mb-14">
            <FadeUp><Badge variant="outline" className="border-primary/40 text-primary/60 mb-4 font-mono">DYNAMIC REWARDS</Badge></FadeUp>
            <FadeUp><h2 className="text-4xl sm:text-5xl font-bold mb-4">Paid <span className="text-gradient-cyan">Keys</span></h2></FadeUp>
            <FadeUp><p className="text-foreground/60 max-w-xl mx-auto">Crack them open for elite gear and rare resources.</p></FadeUp>
          </StaggerGroup>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {KEYS.map((key, i) => (
              <FadeUp key={i} delay={i * 0.15}>
                <div className="glass-card p-8 text-center h-full" style={{ borderColor: `${key.color}30` }}>
                  <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center" style={{ background: `${key.color}15`, border: `1px solid ${key.color}40` }}>
                    <Key className="h-8 w-8" style={{ color: key.color }} />
                  </div>
                  <Badge className="mb-3 text-xs" style={{ background: `${key.color}15`, color: key.color }}>{key.rarity}</Badge>
                  <h3 className="text-xl font-bold mb-3" style={{ color: key.color }}>{key.name}</h3>
                  <p className="text-sm text-foreground/60 mb-4">{key.desc}</p>
                  <div className="space-y-1.5">
                    {key.drops.map((drop, j) => (
                      <div key={j} className="text-xs text-foreground/40 flex items-center justify-center gap-2">
                        <span className="w-1 h-1 rounded-full" style={{ background: key.color }} /> {drop}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Staff Section */}
      <section id="staff" className="relative z-10 py-24 px-5 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <StaggerGroup className="text-center mb-14">
            <FadeUp><Badge variant="outline" className="border-primary/40 text-primary/60 mb-4 font-mono">THE LEGACY</Badge></FadeUp>
            <FadeUp><h2 className="text-4xl sm:text-5xl font-bold mb-2">Leadership & <span className="text-gradient-cyan">Legacy</span></h2></FadeUp>
          </StaggerGroup>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STAFF.map((member, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="glass-card p-6 flex items-start gap-5">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black flex-shrink-0" style={{ background: `${member.color}20`, border: `1px solid ${member.color}50`, color: member.color, boxShadow: `0 0 20px ${member.color}30` }}>
                    {member.initial}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
                    <p className="text-xs font-medium mb-2" style={{ color: member.color }}>{member.role}</p>
                    <p className="text-sm text-foreground/60 leading-relaxed">{member.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <StaggerGroup>
            <FadeUp><h2 className="text-4xl sm:text-6xl font-black mb-4">Ready to go <span className="text-gradient-cyan">crazy?</span></h2></FadeUp>
            <FadeUp><p className="text-foreground/60 mb-8 max-w-xl mx-auto text-lg">Your story starts the moment you log in. Join hundreds of players writing the next chapter.</p></FadeUp>
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
          <p className="text-foreground/50 text-sm mb-2">
            <span className="font-bold text-gradient-cyan">CrazySMP</span> — Founded by CrazyAnishXD & TitanPlayz
          </p>
          <p className="text-foreground/30 text-xs">Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.</p>
          <p className="text-foreground/20 text-xs mt-2">© 2026 Crazy SMP. Crafted with ♥</p>
        </div>
      </footer>
    </div>
  );
}
