"use client"

import { useEffect, useRef, useState } from "react"
import { SplineScene } from "@/components/ui/splite"
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"

// ─────────────────────────────────────────────────────────────────────────────
// Canvas Sparkles
// ─────────────────────────────────────────────────────────────────────────────
function Sparkles({ color = "#ffffff", density = 700 }: { color?: string; density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    let animId: number
    type Particle = { x: number; y: number; r: number; alpha: number; speed: number; dir: number; flicker: number }
    let particles: Particle[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      particles = Array.from({ length: density }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.3,
        alpha: Math.random(),
        speed: Math.random() * 0.35 + 0.04,
        dir: Math.random() * Math.PI * 2,
        flicker: Math.random() * 0.018 + 0.004,
      }))
    }

    resize()
    window.addEventListener("resize", resize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.alpha += p.flicker * (Math.random() > 0.5 ? 1 : -1)
        p.alpha = Math.max(0.04, Math.min(1, p.alpha))
        p.x += Math.cos(p.dir) * p.speed
        p.y += Math.sin(p.dir) * p.speed
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = p.alpha
        ctx.fill()
        ctx.globalAlpha = 1
      }
      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [color, density])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Feature data
// ─────────────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    id: "search",
    title: "Semantic Search",
    subtitle: "Find ideas even if keywords don't match",
    desc: "Powered by vector embeddings that understand meaning, not just words. Search by concept and surface hidden connections across thousands of startups.",
    accent: "#3b82f6",
    icon: (
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
        <circle cx="20" cy="20" r="11" stroke="#3b82f6" strokeWidth="2" />
        <circle cx="20" cy="20" r="5.5" fill="rgba(59,130,246,0.18)" stroke="#60a5fa" strokeWidth="1.2" />
        <line x1="18" y1="20" x2="22" y2="20" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="20" y1="18" x2="20" y2="22" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="28.5" y1="28.5" x2="40" y2="40" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="40" cy="40" r="2.2" fill="#60a5fa" />
      </svg>
    ),
  },
  {
    id: "validate",
    title: "AI Idea Validation",
    subtitle: "Know if your idea already exists",
    desc: "Our AI scans 50,000+ companies to instantly tell you if your idea is original, saturated, or ripe for disruption — with a confidence score.",
    accent: "#8b5cf6",
    icon: (
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
        <path d="M24 8C16 8 10 14 10 21c0 5 3 9 8 11v4h12v-4c5-2 8-6 8-11 0-7-6-13-14-13Z" fill="rgba(139,92,246,0.15)" stroke="#8b5cf6" strokeWidth="1.8" strokeLinejoin="round" />
        <line x1="18" y1="36" x2="30" y2="36" stroke="#a78bfa" strokeWidth="1.4" />
        <line x1="20" y1="39" x2="28" y2="39" stroke="#a78bfa" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="36" cy="36" r="7" fill="#0f172a" stroke="#34d399" strokeWidth="1.5" />
        <path d="M33 36l2.5 2.5 4-5.5" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="20" cy="21" r="1.5" fill="#c4b5fd" />
        <circle cx="24" cy="18" r="1.5" fill="#c4b5fd" />
        <circle cx="28" cy="21" r="1.5" fill="#c4b5fd" />
      </svg>
    ),
  },
  {
    id: "instant",
    title: "Instant Insights",
    subtitle: "Get results in seconds",
    desc: "No waiting, no forms, no 30-day trials. Type your idea and receive a full competitive landscape analysis in under 3 seconds flat.",
    accent: "#f59e0b",
    icon: (
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
        <polygon points="26,6 14,26 23,26 22,42 34,22 25,22" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" strokeWidth="1.8" strokeLinejoin="round" />
        <line x1="8" y1="10" x2="12" y2="14" stroke="#fcd34d" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="40" y1="10" x2="36" y2="14" stroke="#fcd34d" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="6" y1="24" x2="11" y2="24" stroke="#fcd34d" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="42" y1="24" x2="37" y2="24" stroke="#fcd34d" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "recommend",
    title: "Smart Recommendations",
    subtitle: "Discover similar startups",
    desc: "Surface adjacent companies, white-space opportunities, and potential partners you never would have found with a traditional keyword search.",
    accent: "#10b981",
    icon: (
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
        <rect x="6" y="30" width="8" height="12" rx="2.5" fill="rgba(16,185,129,0.2)" stroke="#10b981" strokeWidth="1.4" />
        <rect x="18" y="22" width="8" height="20" rx="2.5" fill="rgba(16,185,129,0.3)" stroke="#10b981" strokeWidth="1.4" />
        <rect x="30" y="13" width="8" height="29" rx="2.5" fill="rgba(16,185,129,0.45)" stroke="#10b981" strokeWidth="1.4" />
        <polyline points="10,28 22,19 34,10" stroke="#6ee7b7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="10" cy="28" r="2.5" fill="#6ee7b7" />
        <circle cx="22" cy="19" r="2.5" fill="#6ee7b7" />
        <circle cx="34" cy="10" r="2.5" fill="#6ee7b7" />
      </svg>
    ),
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function Home() {
  const [dark, setDark] = useState(true)
  const [hovered, setHovered] = useState<number | null>(null)
  const [ctaHover, setCtaHover] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)
  const [scrollPct, setScrollPct] = useState(0)
  const [mounted, setMounted] = useState(false)

  // Listen for theme changes from navbar toggle
  useEffect(() => {
    setMounted(true)
    
    // Check initial theme
    const stored = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const isDarkMode = stored === "dark" || (!stored && prefersDark)
    setDark(isDarkMode)

    // Create a mutation observer to watch for class changes on html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDarkNow = document.documentElement.classList.contains("dark")
          setDark(isDarkNow)
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    // Also listen for storage changes in case theme is updated in another tab
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme") {
        const isDarkNow = e.newValue === "dark"
        setDark(isDarkNow)
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      observer.disconnect()
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // ── Derived theme tokens ──
  const bg = dark ? "#000000" : "#ffffff"
  const heroBg = dark ? "bg-black/[0.96]" : "bg-white/95"
  const starColor = dark ? "#ffffff" : "#64748b" // Darker stars for light mode
  const txt1 = dark ? "#f8fafc" : "#0f172a"
  const txt2 = dark ? "#94a3b8" : "#475569"
  const headingGrad = dark
    ? "from-neutral-50 to-neutral-400"
    : "from-gray-900 to-gray-600"
  const subText = dark ? "text-neutral-300" : "text-gray-600"

  const cardBg = (isHov: boolean) =>
    isHov
      ? dark ? "rgba(59,130,246,0.07)" : "rgba(59,130,246,0.08)" // Darker background for light mode hover
      : dark ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.03)"
  const cardBorder = (isHov: boolean, accent: string) =>
    isHov ? `${accent}99` : dark ? "rgba(59,130,246,0.2)" : "rgba(59,130,246,0.4)" // Darker border for light mode

  const onScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setCanLeft(el.scrollLeft > 8)
    setCanRight(el.scrollLeft < max - 8)
    setScrollPct(max > 0 ? el.scrollLeft / max : 0)
  }

  const nudge = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" })
  }

  if (!mounted) return null

  return (
    <div
      style={{ background: bg, transition: "background 0.4s", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
      className="min-h-screen"
    >
      {/* ══════════════════════════════════════════════════════════════════════
          HERO — Spline 3D scene (100vh)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="relative w-full h-screen">
        <Card className={`w-full h-full ${heroBg} relative overflow-hidden border-0 rounded-none transition-colors duration-300`}>
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="currentColor"
          />
          <div className="flex h-full flex-col md:flex-row">
            {/* Left text */}
            <div className="flex-1 p-6 sm:p-8 md:p-12 relative z-10 flex flex-col justify-center">
              {/* AI badge - responsive */}
              <div className="mb-4 sm:mb-5">
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    background: dark ? "rgba(59,130,246,0.14)" : "rgba(59,130,246,0.12)",
                    border: `1px solid ${dark ? "rgba(59,130,246,0.38)" : "rgba(59,130,246,0.5)"}`,
                    borderRadius: 999,
                    padding: "4px 12px sm:4px 14px",
                    fontSize: 10,
                    fontWeight: 700,
                    color: dark ? "#93c5fd" : "#2563eb",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase" as const,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#3b82f6",
                      boxShadow: "0 0 6px #3b82f6",
                      display: "inline-block",
                    }}
                  />
                  Powered by AI
                </span>
              </div>

              <h1
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b ${headingGrad}`}
              >
                VentureMind-AI
              </h1>

              <p className={`mt-3 sm:mt-4 ${subText} max-w-lg text-sm sm:text-base lg:text-lg leading-relaxed transition-colors duration-300`}>
                Discover, validate, and build startup ideas — powered by AI.
              </p>

              {/* CTA inside hero - responsive */}
              <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  onMouseEnter={() => setCtaHover(true)}
                  onMouseLeave={() => setCtaHover(false)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    background: dark 
                      ? "linear-gradient(135deg,#1d4ed8,#3b82f6)"
                      : "linear-gradient(135deg,#2563eb,#3b82f6)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 999,
                    padding: "13px 28px",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: ctaHover
                      ? dark
                        ? "0 14px 44px rgba(37,99,235,0.58),0 4px 14px rgba(37,99,235,0.38)"
                        : "0 14px 44px rgba(37,99,235,0.35),0 4px 14px rgba(37,99,235,0.25)"
                      : dark
                        ? "0 8px 32px rgba(37,99,235,0.42),0 2px 8px rgba(37,99,235,0.28)"
                        : "0 8px 32px rgba(37,99,235,0.25),0 2px 8px rgba(37,99,235,0.15)",
                    transform: ctaHover ? "translateY(-2px)" : "translateY(0)",
                    transition: "all 0.22s ease",
                    letterSpacing: "0.01em",
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  Search startup ideas
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
                <span style={{ color: txt2, fontSize: 12, transition: "color 0.3s" }}>
                  No sign-up · No credit card · Results in &lt;3s
                </span>
              </div>
            </div>

            {/* Right — Spline */}
            <div className="flex-1 relative min-h-[300px] md:min-h-0">
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          FEATURES SECTION — sparkles + horizontal scroll cards
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          background: bg,
          transition: "background 0.4s",
        }}
      >
        {/* Sparkles — masked toward center-bottom */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            maskImage: "radial-gradient(ellipse 90% 70% at 50% 85%, white 40%, transparent)",
            WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 85%, white 40%, transparent)",
          }}
        >
          <Sparkles color={starColor} density={dark ? 650 : 400} />
        </div>

        {/* Blue radial glow - more visible in light mode */}
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: "50%",
            transform: "translateX(-50%)",
            width: 1000,
            height: 460,
            borderRadius: "50%",
            background: dark
              ? "radial-gradient(ellipse,rgba(37,99,235,0.5) 0%,rgba(29,78,216,0.16) 42%,transparent 68%)"
              : "radial-gradient(ellipse,rgba(37,99,235,0.25) 0%,rgba(59,130,246,0.12) 42%,transparent 68%)",
            pointerEvents: "none",
            zIndex: 1,
            transition: "background 0.4s",
          }}
        />

        {/* Horizon arc — top of section as a divider */}
        <div
          style={{
            position: "absolute",
            top: -2,
            left: "-30%",
            width: "160%",
            height: 120,
            borderRadius: "0 0 50% 50%",
            background: bg,
            borderBottom: dark
              ? "1px solid rgba(59,130,246,0.3)"
              : "1px solid rgba(59,130,246,0.5)",
            pointerEvents: "none",
            zIndex: 2,
            transition: "background 0.4s,border-bottom 0.4s",
          }}
        />

        {/* Horizon arc — bottom fade */}
        <div
          style={{
            position: "absolute",
            bottom: -4,
            left: "-30%",
            width: "160%",
            height: 180,
            borderRadius: "50% 50% 0 0",
            background: dark ? "#050a14" : "#f8fafc",
            borderTop: dark
              ? "1px solid rgba(59,130,246,0.35)"
              : "1px solid rgba(59,130,246,0.5)",
            pointerEvents: "none",
            zIndex: 2,
            transition: "background 0.4s,border-top 0.4s",
          }}
        />

        {/* Content - responsive padding */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: 920,
            margin: "0 auto",
            padding: "60px 20px 80px",
          }}
          className="px-4 sm:px-6 py-16 sm:py-20 md:py-24"
        >
          {/* Section badge */}
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: dark ? "rgba(59,130,246,0.14)" : "rgba(59,130,246,0.12)",
                border: `1px solid ${dark ? "rgba(59,130,246,0.38)" : "rgba(59,130,246,0.5)"}`,
                borderRadius: 999,
                padding: "5px 16px",
                fontSize: 11,
                fontWeight: 700,
                color: dark ? "#93c5fd" : "#2563eb",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#3b82f6",
                  boxShadow: "0 0 6px #3b82f6",
                  display: "inline-block",
                }}
              />
              What we offer
            </span>
          </div>

          {/* Heading - responsive */}
          <h2
            style={{
              textAlign: "center",
              fontSize: "clamp(24px,5vw,48px)",
              fontWeight: 700,
              lineHeight: 1.2,
              margin: "0 0 16px",
              color: txt1,
              letterSpacing: "-0.022em",
              transition: "color 0.3s",
            }}
          >
            Everything you need to go from
            <br />
            <span
              style={{
                background: "linear-gradient(90deg,#2563eb,#60a5fa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              idea to insight in seconds
            </span>
          </h2>

          <p
            style={{
              textAlign: "center",
              fontSize: 14,
              color: txt2,
              maxWidth: 480,
              margin: "0 auto 40px",
              lineHeight: 1.7,
              transition: "color 0.3s",
            }}
            className="text-sm sm:text-base"
          >
            No sign-up required. No credit card. Just type your idea and let AI do the rest.
          </p>

          {/* ── Scroll controls header - responsive ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: txt2,
              }}
            >
              Core features
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { dir: -1, label: "←", active: canLeft },
                { dir: 1, label: "→", active: canRight },
              ].map(({ dir, label, active }) => (
                <button
                  key={dir}
                  onClick={() => nudge(dir)}
                  disabled={!active}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    border: `1px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.15)"}`,
                    background: active
                      ? dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"
                      : "transparent",
                    color: active ? txt1 : txt2,
                    cursor: active ? "pointer" : "default",
                    opacity: active ? 1 : 0.28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    transition: "all 0.2s",
                    padding: 0,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Horizontal scroll strip ── */}
          <div style={{ position: "relative" }}>
            {/* Edge fades */}
            {[
              { side: "left" as const, on: canLeft, grad: "to right" },
              { side: "right" as const, on: canRight, grad: "to left" },
            ].map(({ side, on, grad }) => (
              <div
                key={side}
                style={{
                  position: "absolute",
                  [side]: 0,
                  top: 0,
                  bottom: 16,
                  width: 40,
                  background: `linear-gradient(${grad},${bg},transparent)`,
                  zIndex: 4,
                  pointerEvents: "none",
                  opacity: on ? 1 : 0,
                  transition: "opacity 0.25s",
                }}
              />
            ))}

            <div
              ref={scrollRef}
              onScroll={onScroll}
              style={{
                display: "flex",
                gap: 16,
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                paddingBottom: 16,
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {FEATURES.map((f, i) => {
                const isHov = hovered === i
                return (
                  <div
                    key={f.id}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      flex: "0 0 260px",
                      scrollSnapAlign: "start",
                      background: cardBg(isHov),
                      border: `1px solid ${cardBorder(isHov, f.accent)}`,
                      borderRadius: 18,
                      padding: "22px 18px 24px",
                      cursor: "default",
                      transition: "all 0.26s ease",
                      transform: isHov ? "translateY(-5px)" : "translateY(0)",
                      boxShadow: isHov
                        ? dark
                          ? `0 16px 48px -10px ${f.accent}30,0 0 0 1px ${f.accent}18`
                          : `0 16px 48px -10px ${f.accent}40,0 0 0 1px ${f.accent}30`
                        : "none",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    className="sm:flex-0 sm:basis-[272px]"
                  >
                    {/* Corner glow */}
                    <div
                      style={{
                        position: "absolute",
                        top: -40,
                        right: -40,
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        background: `radial-gradient(circle,${f.accent}${dark ? '1a' : '30'},transparent 68%)`,
                        opacity: isHov ? 1 : 0,
                        transition: "opacity 0.3s",
                        pointerEvents: "none",
                      }}
                    />

                    <div style={{ marginBottom: 16 }}>{f.icon}</div>

                    <p style={{ color: txt1, fontSize: 15, fontWeight: 650, margin: "0 0 5px", transition: "color 0.3s" }}>
                      {f.title}
                    </p>
                    <p
                      style={{
                        color: f.accent,
                        fontSize: 10,
                        fontWeight: 700,
                        margin: "0 0 10px",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                    >
                      {f.subtitle}
                    </p>
                    <p style={{ color: txt2, fontSize: 12.5, lineHeight: 1.68, margin: 0, transition: "color 0.3s" }}>
                      {f.desc}
                    </p>

                    {/* Bottom glow accent line */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        borderRadius: "0 0 18px 18px",
                        background: `linear-gradient(90deg,transparent,${f.accent},transparent)`,
                        opacity: isHov ? 0.85 : 0,
                        transition: "opacity 0.3s",
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Scroll progress bar */}
          <div
            style={{
              height: 3,
              borderRadius: 999,
              background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)",
              marginTop: 8,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.round((scrollPct * 0.75 + 0.05) * 100)}%`,
                borderRadius: 999,
                background: "linear-gradient(90deg,#2563eb,#60a5fa)",
                transition: "width 0.15s",
              }}
            />
          </div>
        </div>
      </div>

      <style>{`div::-webkit-scrollbar{display:none}*{box-sizing:border-box}`}</style>
    </div>
  )
}