"use client"

import * as React from "react"
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  AnimatePresence,
  type Variants,
} from "framer-motion"

/* ---------- 1. Stagger container ---------- */
export function StaggerGroup({
  children,
  className,
  delay = 0,
  stagger = 0.08,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  stagger?: number
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- 2. Stagger child (fade up) ---------- */
export function FadeUp({
  children,
  className,
  delay = 0,
  y = 24,
  once = true,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
  once?: boolean
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- 3. Fade + scale ---------- */
export function FadeScale({
  children,
  className,
  delay = 0,
  scale = 0.92,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  scale?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- 4. Slide-in from left ---------- */
export function SlideInLeft({
  children,
  className,
  delay = 0,
  x = -40,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  x?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- 5. Slide-in from right ---------- */
export function SlideInRight({
  children,
  className,
  delay = 0,
  x = 40,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  x?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- 6. Blur in ---------- */
export function BlurIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- 7. Reveal width (line drawing) ---------- */
export function RevealLine({ className }: { className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: "left" }}
    />
  )
}

/* ---------- 8. Magnetic button ---------- */
export function Magnetic({
  children,
  className,
  strength = 0.4,
}: {
  children: React.ReactNode
  className?: string
  strength?: number
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 15 })
  const springY = useSpring(y, { stiffness: 200, damping: 15 })

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const relX = e.clientX - rect.left - rect.width / 2
    const relY = e.clientY - rect.top - rect.height / 2
    x.set(relX * strength)
    y.set(relY * strength)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </motion.div>
  )
}

/* ---------- 9. 3D tilt card ---------- */
export function TiltCard({
  children,
  className,
  max = 8,
  glare = true,
}: {
  children: React.ReactNode
  className?: string
  max?: number
  glare?: boolean
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const rotateX = useSpring(0, { stiffness: 200, damping: 20 })
  const rotateY = useSpring(0, { stiffness: 200, damping: 20 })
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)
  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]: number[]) =>
      `radial-gradient(circle at ${gx}% ${gy}%, rgba(0, 229, 255, 0.18), transparent 50%)`
  )

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    rotateY.set((px - 0.5) * max * 2)
    rotateX.set(-(py - 0.5) * max * 2)
    glareX.set(px * 100)
    glareY.set(py * 100)
  }

  const handleLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
    glareX.set(50)
    glareY.set(50)
  }

  return (
    <motion.div
      ref={ref}
      className={`relative ${className ?? ""}`}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: glareBg }}
        />
      )}
    </motion.div>
  )
}

/* ---------- 10. Hover lift ---------- */
export function HoverLift({
  children,
  className,
  y = -6,
  scale = 1.02,
}: {
  children: React.ReactNode
  className?: string
  y?: number
  scale?: number
}) {
  return (
    <motion.div
      className={className}
      whileHover={{ y, scale }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- 11. Text reveal (word-by-word) ---------- */
export function TextReveal({
  text,
  className,
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) {
  const words = text.split(" ")
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.05, delayChildren: delay },
        },
      }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%", opacity: 0 },
              visible: {
                y: "0%",
                opacity: 1,
                transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </motion.span>
  )
}

/* ---------- 12. Scroll-driven parallax ---------- */
export function Parallax({
  children,
  className,
  speed = 0.3,
}: {
  children: React.ReactNode
  className?: string
  speed?: number
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [offset, setOffset] = React.useState(0)

  React.useEffect(() => {
    const onScroll = () => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const center = rect.top + rect.height / 2
      const windowCenter = window.innerHeight / 2
      setOffset((center - windowCenter) * speed)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [speed])

  return (
    <div ref={ref} className={className} style={{ transform: `translateY(${offset}px)` }}>
      {children}
    </div>
  )
}

/* ---------- 13. Counter (number animates on view) ---------- */
export function Counter({
  value,
  className,
  prefix = "",
  suffix = "",
  duration = 1.8,
}: {
  value: number
  className?: string
  prefix?: string
  suffix?: string
  duration?: number
}) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const [display, setDisplay] = React.useState(0)

  React.useEffect(() => {
    if (!inView) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(value * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  )
}

/* ---------- 14. Scroll progress bar ---------- */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })
  return <motion.div className="scroll-progress" style={{ scaleX, width: "100%" }} />
}

/* ---------- 15. Custom cursor (desktop only) ---------- */
export function CustomCursor() {
  const dotRef = React.useRef<HTMLDivElement>(null)
  const ringRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(hover: none)").matches) return

    let mouseX = 0
    let mouseY = 0
    let ringX = 0
    let ringY = 0

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`
      }
      const target = e.target as HTMLElement
      const interactive = target.closest("a, button, [role='button'], input, textarea, select, [data-cursor='hover']")
      if (ringRef.current) {
        if (interactive) {
          ringRef.current.style.width = "56px"
          ringRef.current.style.height = "56px"
          ringRef.current.style.borderColor = "rgba(0, 229, 255, 1)"
          ringRef.current.style.background = "rgba(0, 229, 255, 0.06)"
        } else {
          ringRef.current.style.width = "36px"
          ringRef.current.style.height = "36px"
          ringRef.current.style.borderColor = "rgba(0, 229, 255, 0.6)"
          ringRef.current.style.background = "transparent"
        }
      }
    }

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.18
      ringY += (mouseY - ringY) * 0.18
      if (ringRef.current) {
        const w = parseFloat(ringRef.current.style.width) || 36
        ringRef.current.style.transform = `translate(${ringX - w / 2}px, ${ringY - w / 2}px)`
      }
      raf = requestAnimationFrame(animateRing)
    }
    let raf = requestAnimationFrame(animateRing)

    window.addEventListener("mousemove", onMove)
    return () => {
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}

/* ---------- 16. Reveal on click (interactive) ---------- */
export function RevealOnTap({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className={className}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left"
        aria-expanded={open}
      >
        {React.Children.toArray(children)[0]}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            {React.Children.toArray(children)[1]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------- 17. Glow border (animated) ---------- */
export function GlowBorder({
  children,
  className,
  color = "rgba(0, 229, 255, 0.4)",
}: {
  children: React.ReactNode
  className?: string
  color?: string
}) {
  return (
    <motion.div
      className={`relative ${className ?? ""}`}
      whileHover={{
        boxShadow: `0 0 0 1px ${color}, 0 0 32px -4px ${color}`,
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- 18. Floating element (continuous) ---------- */
export function Floating({
  children,
  className,
  duration = 6,
  distance = 12,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  duration?: number
  distance?: number
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-distance, distance, -distance],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- 19. Typewriter effect ---------- */
export function Typewriter({
  text,
  className,
  speed = 40,
  delay = 0,
  cursor = true,
}: {
  text: string
  className?: string
  speed?: number
  delay?: number
  cursor?: boolean
}) {
  const [display, setDisplay] = React.useState("")
  const ref = React.useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  React.useEffect(() => {
    if (!inView) return
    let i = 0
    const startTimer = setTimeout(() => {
      const tick = () => {
        if (i <= text.length) {
          setDisplay(text.slice(0, i))
          i++
          setTimeout(tick, speed)
        }
      }
      tick()
    }, delay * 1000)
    return () => clearTimeout(startTimer)
  }, [inView, text, speed, delay])

  return (
    <span ref={ref} className={className}>
      {display}
      {cursor && inView && <span className="animate-pulse">_</span>}
    </span>
  )
}

/* ---------- 20. Marquee ---------- */
export function Marquee({
  children,
  className,
  speed = 30,
  direction = "left",
}: {
  children: React.ReactNode
  className?: string
  speed?: number
  direction?: "left" | "right"
}) {
  return (
    <div className={`overflow-hidden ${className ?? ""}`} style={{ transform: "translateZ(0)" }}>
      <motion.div
        className="flex w-max"
        style={{ willChange: "transform", backfaceVisibility: "hidden" }}
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
      >
        <div className="flex">{children}</div>
        <div className="flex" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  )
}

export const easeOutExpo = [0.22, 1, 0.36, 1] as const
