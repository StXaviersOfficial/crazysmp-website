'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Shield, Crown, Zap, Key, Users, Swords, ChevronDown, Copy, Check, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const SERVER_IP = 'crazysmp.bond'
const DISCORD_URL = 'https://discord.gg/GFzAeUj7TJ'

const RANKS = [
  { name: 'VIP', tier: 'I', label: 'NEW', color: '#00FFFF', glow: 'rgba(0,255,255,0.4)', desc: 'The first step into greatness. Claim your name in the halls of Crazy SMP.' },
  { name: 'LEGEND', tier: 'II', label: 'STARTER', color: '#00E5FF', glow: 'rgba(0,229,255,0.4)', desc: 'Legends never die. Enter the story and rise above the ordinary crowd.' },
  { name: 'IMMORTAL', tier: 'III', label: 'EXPERT', color: '#00CCFF', glow: 'rgba(0,204,255,0.4)', desc: 'Unkillable spirit, unstoppable drive. Leave a mark no time can erase.' },
  { name: 'TITAN', tier: 'IV', label: 'MASTER', color: '#0099FF', glow: 'rgba(0,153,255,0.4)', desc: 'Stand with the titans that shaped the world. Power befitting a god.' },
  { name: 'TECHNO', tier: 'V', label: 'ELITE', color: '#0066FF', glow: 'rgba(0,102,255,0.4)', desc: 'Where chaos meets machine. Cold, calculated, completely unstoppable.' },
  { name: 'CRAZY', tier: 'VI', label: 'MAX', color: '#0033FF', glow: 'rgba(0,51,255,0.5)', desc: 'The pinnacle. No cap, no limit — only the wild ones reach the top.' },
]

const KEYS = [
  { name: 'SPAWNER KEY', rarity: 'COMMON', color: '#22c55e', desc: 'Unlock rare mob spawners and supercharge your farms with continuous resources.', icon: '🌱' },
  { name: 'MEGA KEY', rarity: 'RARE', color: '#3b82f6', desc: 'Massive rewards, massive loot tables. Every turn is a jackpot waiting to drop.', icon: '💎' },
  { name: 'CRAZY KEY', rarity: 'EPIC', color: '#a855f7', desc: 'The legendary key. Elite gear and the rarest resources in the whole realm.', icon: '🔥' },
]

const STAFF = [
  { name: 'CrazyAnishXD', role: 'Systems & Economy Mastermind', initial: 'A', color: '#00FFFF', desc: 'The mind behind custom systems, economy balance, and chaotic gameplay loops.' },
  { name: 'TitanPlayz', role: 'Community Champion & Architect', initial: 'T', color: '#0099FF', desc: 'The structural architect who built a stable home for alliances and massive events.' },
  { name: 'SparkStrider', role: 'COPS&W Co-Founder • Threat Operations', initial: 'S', color: '#0066FF', desc: 'Directs tactical intelligence and server security operations. Architect of TITAN bot.' },
  { name: 'Noty_Plays', role: 'COPS&W Co-Founder • Player Protection', initial: 'N', color: '#0033FF', desc: 'Spearheads network oversight and community defense protocols.' },
]

const FEATURES = [
  { title: 'Progressive Economy', desc: 'Upgrade across tiered ranks and climb the leaderboard of the realm.', icon: '📈' },
  { title: 'Dynamic Key Rewards', desc: 'Trade invites or vote points for keys to unlock elite gear and rare resources.', icon: '🔑' },
  { title: 'Community Events', desc: 'Server-wide wars, treasure hunts, building competitions and seasonal boss fights.', icon: '🎉' },
  { title: 'Unbreakable Community', desc: 'More than a server — a family. Active Discord and dedicated moderation.', icon: '🛡️' },
]

const TICKER_ITEMS = [
  '🔥 CRAZY SMP SEASON 4 LIVE NOW',
  '🛡️ COPS&W TITAN BOT DEPLOYED',
  '💰 RANKS: VIP · LEGEND · IMMORTAL · TITAN · TECHNO · CRAZY',
  '🎁 KEYS: SPAWNER / MEGA / CRAZY',
  '⚔️ SERVER WAR SATURDAY · TREASURE HUNT WEDNESDAY',
  '💬 JOIN DISCORD: discord.gg/GFzAeUj7TJ',
]

export default function Home() {
  const [copied, setCopied] = useState(false)
  const [activeRank, setActiveRank] = useState(0)
  const [serverOnline, setServerOnline] = useState(false)
  const [playerCount, setPlayerCount] = useState(0)
  const [maxPlayers, setMaxPlayers] = useState(100)
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  const copyIP = () => {
    navigator.clipboard.writeText(SERVER_IP)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Fetch server status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`https://api.mcsrvstat.us/3/${SERVER_IP}`)
        const data = await res.json()
        setServerOnline(data.online || false)
        setPlayerCount(data.players?.online || 0)
        setMaxPlayers(data.players?.max || 100)
      } catch {
        setServerOnline(false)
      }
    }
    fetchStatus()
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#001a2e] via-[#000814] to-[#001033]" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#0066FF]/5 rounded-full blur-[150px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-black/40 border-b border-cyan-500/20">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              CRAZYSMP
            </span>
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 text-xs">S4</Badge>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#home" className="hover:text-cyan-400 transition">Home</a>
            <a href="#about" className="hover:text-cyan-400 transition">About</a>
            <a href="#ranks" className="hover:text-cyan-400 transition">Ranks</a>
            <a href="#keys" className="hover:text-cyan-400 transition">Keys</a>
            <a href="#staff" className="hover:text-cyan-400 transition">Staff</a>
          </div>
          <Button asChild size="sm" className="bg-cyan-500/20 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30">
            <a href={DISCORD_URL} target="_blank" rel="noreferrer">
              Discord
            </a>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        id="home"
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-screen flex items-center justify-center px-4 pt-20"
      >
        <div className="text-center max-w-4xl z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="outline" className="mb-4 border-cyan-500/50 text-cyan-400">
              SMP • SEASON IV • VANILLA+
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black mb-4 tracking-tight"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-700 bg-clip-text text-transparent">
              CRAZY
            </span>
            <span className="bg-gradient-to-r from-blue-600 via-cyan-400 to-cyan-300 bg-clip-text text-transparent">
              SMP
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
          >
            A heavily customized vanilla+ Minecraft SMP where creativity meets chaos.
            Build your kingdom, forge alliances, and write your legacy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              onClick={copyIP}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-lg px-8 py-6 rounded-xl shadow-lg shadow-cyan-500/30 transition-all hover:scale-105"
            >
              {copied ? <Check className="mr-2 h-5 w-5" /> : <Copy className="mr-2 h-5 w-5" />}
              {copied ? 'COPIED!' : `PLAY NOW — ${SERVER_IP}`}
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 font-bold text-lg px-8 py-6 rounded-xl"
            >
              <a href={DISCORD_URL} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-5 w-5" />
                DISCORD
              </a>
            </Button>
          </motion.div>

          {/* Server Status Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 flex items-center justify-center gap-3"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-cyan-500/20">
              <div className={`w-3 h-3 rounded-full ${serverOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
              <span className="text-sm text-gray-400">
                {serverOnline ? `Online — ${playerCount}/${maxPlayers} playing` : 'Server starting...'}
              </span>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <ChevronDown className="h-6 w-6 text-cyan-500/50" />
          </motion.div>
        </div>
      </motion.section>

      {/* Ticker */}
      <div className="relative z-10 overflow-hidden py-3 bg-cyan-500/5 border-y border-cyan-500/10">
        <motion.div
          animate={{ x: ['100%', '-100%'] }}
          transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
          className="whitespace-nowrap flex gap-8 text-sm text-cyan-400/60"
        >
          {TICKER_ITEMS.map((item, i) => (
            <span key={i}>{item}</span>
          ))}
          {TICKER_ITEMS.map((item, i) => (
            <span key={`dup-${i}`}>{item}</span>
          ))}
        </motion.div>
      </div>

      {/* About Section */}
      <section id="about" className="relative z-10 py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                Welcome to Crazy SMP
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A premier Minecraft multiplayer community led by CrazyAnishXD, TitanPlayz, and the
              COPS&W security division. An expansive realm where creativity meets chaos with
              player safety at its core.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-black/40 border-cyan-500/20 hover:border-cyan-500/40 transition-all hover:scale-[1.02] p-6 h-full">
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-cyan-400 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Staff Section */}
      <section id="staff" className="relative z-10 py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-2">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                The Legacy & Leadership
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STAFF.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-black/40 border-cyan-500/20 hover:border-cyan-500/40 transition-all p-6 flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black flex-shrink-0"
                    style={{
                      background: `${member.color}20`,
                      border: `1px solid ${member.color}50`,
                      color: member.color,
                      boxShadow: `0 0 20px ${member.color}30`,
                    }}
                  >
                    {member.initial}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{member.name}</h3>
                    <p className="text-xs font-medium mb-2" style={{ color: member.color }}>
                      {member.role}
                    </p>
                    <p className="text-sm text-gray-400">{member.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ranks Section */}
      <section id="ranks" className="relative z-10 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                Paid Ranks
              </span>
            </h2>
            <p className="text-gray-400">Six tiers of status. Climb the ladder of the realm.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RANKS.map((rank, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onMouseEnter={() => setActiveRank(i)}
              >
                <Card
                  className="relative bg-black/40 p-6 cursor-pointer transition-all hover:scale-[1.03] overflow-hidden"
                  style={{
                    borderColor: `${rank.color}40`,
                    boxShadow: activeRank === i ? `0 0 30px ${rank.glow}` : 'none',
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ background: `linear-gradient(90deg, transparent, ${rank.color}, transparent)` }}
                  />
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-black" style={{ color: rank.color }}>
                      {rank.name}
                    </h3>
                    <Badge variant="outline" className="text-xs" style={{ borderColor: `${rank.color}50`, color: rank.color }}>
                      Tier {rank.tier}
                    </Badge>
                  </div>
                  <Badge className="mb-3 text-xs" style={{ background: `${rank.color}20`, color: rank.color }}>
                    {rank.label}
                  </Badge>
                  <p className="text-sm text-gray-400">{rank.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8 text-gray-500 text-sm"
          >
            Want a paid rank? Open a ticket in the Discord server to claim it.
          </motion.p>
        </div>
      </section>

      {/* Keys Section */}
      <section id="keys" className="relative z-10 py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                Paid Keys
              </span>
            </h2>
            <p className="text-gray-400">Crack them open for elite gear and rare resources.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {KEYS.map((key, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Card
                  className="bg-black/40 p-8 text-center hover:scale-[1.05] transition-all"
                  style={{ borderColor: `${key.color}30` }}
                >
                  <div className="text-5xl mb-4">{key.icon}</div>
                  <Badge className="mb-3" style={{ background: `${key.color}20`, color: key.color }}>
                    {key.rarity}
                  </Badge>
                  <h3 className="text-xl font-bold mb-3" style={{ color: key.color }}>
                    {key.name}
                  </h3>
                  <p className="text-sm text-gray-400">{key.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-700 bg-clip-text text-transparent">
                Ready to go crazy?
              </span>
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Your story starts the moment you log in. Join CrazyAnishXD, TitanPlayz and
              hundreds of players writing the next great chapter.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={copyIP}
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-8 py-6 rounded-xl shadow-lg shadow-cyan-500/30 hover:scale-105"
              >
                {copied ? <Check className="mr-2 h-5 w-5" /> : <Copy className="mr-2 h-5 w-5" />}
                {copied ? 'COPIED!' : 'COPY SERVER IP'}
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 font-bold px-8 py-6 rounded-xl"
              >
                <a href={DISCORD_URL} target="_blank" rel="noreferrer">
                  JOIN THE DISCORD
                </a>
              </Button>
            </div>
            <p className="mt-6 text-cyan-400/50 text-sm font-mono">{SERVER_IP}</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mt-auto border-t border-cyan-500/10 py-8 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-gray-500 text-sm mb-2">
            <span className="font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              CRAZYSMP
            </span>
            {' '}— Founded by CrazyAnishXD & TitanPlayz
          </p>
          <p className="text-gray-600 text-xs">
            Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.
          </p>
          <p className="text-gray-700 text-xs mt-2">© 2026 Crazy SMP. Crafted with ♥.</p>
        </div>
      </footer>
    </div>
  )
}
