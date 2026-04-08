"use client"

import { useEffect, useRef, useState } from "react"
import { SplineScene } from "@/components/ui/splite"
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import { DottedSurface } from "@/components/ui/dotted-surface"
import { Lightbulb, BrainCircuit, LineChart, Code, Rocket, GraduationCap } from "lucide-react"

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
      className="absolute inset-0 w-full h-full pointer-events-none"
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
  const bg = dark ? "bg-black" : "bg-white"
  const heroBg = dark ? "bg-black/96" : "bg-white/95"
  const starColor = dark ? "#ffffff" : "#64748b"
  const txt1 = dark ? "text-slate-50" : "text-slate-900"
  const txt2 = dark ? "text-slate-400" : "text-slate-600"
  const headingGrad = dark
    ? "from-neutral-50 to-neutral-400"
    : "from-gray-900 to-gray-600"

  const cardBg = (isHov: boolean) =>
    isHov
      ? dark ? "bg-blue-500/10" : "bg-blue-500/10"
      : dark ? "bg-white/5" : "bg-black/5"

  if (!mounted) return null

  return (
    <>
      <div
        className={`min-h-screen relative z-10 transition-colors duration-300 ${bg}`}
        style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
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
                <h1
                  className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b ${headingGrad}`}
                >
                  VentureMind-AI
                </h1>

                <p className={`mt-3 sm:mt-4 max-w-lg text-sm sm:text-base lg:text-lg leading-relaxed transition-colors duration-300 ${dark ? "text-neutral-300" : "text-gray-600"}`}>
                  Discover, validate, and build startup ideas — powered by AI.
                </p>

                {/* CTA inside hero - responsive */}
                <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <button
                    onMouseEnter={() => setCtaHover(true)}
                    onMouseLeave={() => setCtaHover(false)}
                    className={`
                      inline-flex items-center gap-2.5 text-white border-none rounded-full px-7 py-3.5 text-sm font-semibold cursor-pointer
                      transition-all duration-200 ease-in-out tracking-wide
                      ${ctaHover ? 'translate-y-[-2px]' : 'translate-y-0'}
                    `}
                    style={{
                      background: dark 
                        ? "linear-gradient(135deg,#1d4ed8,#3b82f6)"
                        : "linear-gradient(135deg,#2563eb,#3b82f6)",
                      boxShadow: ctaHover
                        ? dark
                          ? "0 14px 44px rgba(37,99,235,0.58),0 4px 14px rgba(37,99,235,0.38)"
                          : "0 14px 44px rgba(37,99,235,0.35),0 4px 14px rgba(37,99,235,0.25)"
                        : dark
                          ? "0 8px 32px rgba(37,99,235,0.42),0 2px 8px rgba(37,99,235,0.28)"
                          : "0 8px 32px rgba(37,99,235,0.25),0 2px 8px rgba(37,99,235,0.15)",
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
            FEATURES SECTION — Full width grid layout
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="relative overflow-hidden transition-colors duration-300">
          {/* Sparkles — masked toward center-bottom */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              maskImage: "radial-gradient(ellipse 90% 70% at 50% 85%, white 40%, transparent)",
              WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 85%, white 40%, transparent)",
            }}
          >
            <Sparkles color={starColor} density={dark ? 650 : 400} />
          </div>

          {/* Blue radial glow - more visible in light mode */}
          <div
            className="absolute bottom-[-100px] left-1/2 transform -translate-x-1/2 pointer-events-none z-1 transition-colors duration-300"
            style={{
              width: "1000px",
              height: "460px",
              borderRadius: "50%",
              background: dark
                ? "radial-gradient(ellipse,rgba(37,99,235,0.5) 0%,rgba(29,78,216,0.16) 42%,transparent 68%)"
                : "radial-gradient(ellipse,rgba(37,99,235,0.25) 0%,rgba(59,130,246,0.12) 42%,transparent 68%)",
            }}
          />

          {/* Horizon arc — top of section as a divider */}
          <div
            className="absolute top-[-2px] left-[-30%] w-[160%] h-10 rounded-b-[50%] pointer-events-none z-2 transition-all duration-300"
            style={{
              background: dark ? "#000000" : "#ffffff",
              borderBottom: dark
                ? "1px solid rgba(59,130,246,0.3)"
                : "1px solid rgba(59,130,246,0.5)",
            }}
          />

          {/* Horizon arc — bottom fade */}
          <div
            className="absolute bottom-[-4px] left-[-30%] w-[160%] h-15 rounded-t-[50%] pointer-events-none z-2 transition-all duration-300"
            style={{
              background: dark ? "#050a14" : "#f8fafc",
              borderTop: dark
                ? "1px solid rgba(59,130,246,0.35)"
                : "1px solid rgba(59,130,246,0.5)",
            }}
          />

          {/* Content - full width */}
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24">
            {/* Section badge */}
            <div className="text-center mb-5">
              <span
                className={`
                  inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em]
                  ${dark ? "bg-blue-500/15 text-blue-300 border-blue-500/40" : "bg-blue-500/15 text-blue-600 border-blue-500/50"}
                  border
                `}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6] inline-block"
                />
                What we offer
              </span>
            </div>

            {/* Heading - responsive */}
            <h2
              className={`text-center text-[clamp(24px,5vw,48px)] font-bold leading-tight mb-4 tracking-[-0.022em] transition-colors duration-300 ${txt1}`}
            >
              Everything you need to go from
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                idea to insight in seconds
              </span>
            </h2>

            

            {/* Features Grid - Full width horizontal layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((feature, index) => {
                const isHovered = hovered === index
                
                return (
                  <div
                    key={feature.id}
                    onMouseEnter={() => setHovered(index)}
                    onMouseLeave={() => setHovered(null)}
                    className={`
                      group relative rounded-2xl p-6 cursor-default
                      transition-all duration-300 ease-in-out
                      ${isHovered ? '-translate-y-1' : 'translate-y-0'}
                      ${cardBg(isHovered)}
                      border
                      ${isHovered ? `border-[${feature.accent}]/60` : dark ? "border-blue-500/20" : "border-blue-500/40"}
                      ${isHovered && (dark 
                        ? `shadow-[0_16px_48px_-10px_${feature.accent}30,0_0_0_1px_${feature.accent}18]` 
                        : `shadow-[0_16px_48px_-10px_${feature.accent}40,0_0_0_1px_${feature.accent}30]`
                      )}
                    `}
                  >
                    {/* Corner glow */}
                    <div
                      className={`absolute -top-10 -right-10 w-30 h-30 rounded-full transition-opacity duration-300 pointer-events-none`}
                      style={{
                        background: `radial-gradient(circle,${feature.accent}${dark ? '1a' : '30'},transparent 68%)`,
                        opacity: isHovered ? 1 : 0,
                      }}
                    />

                    {/* Icon */}
                    <div className="mb-4">
                      {feature.icon}
                    </div>

                    {/* Title */}
                    <h3 className={`${txt1} text-lg font-semibold mb-1 transition-colors duration-300`}>
                      {feature.title}
                    </h3>

                    {/* Subtitle */}
                    <p
                      className="text-[11px] font-bold mb-3 uppercase tracking-[0.05em]"
                      style={{ color: feature.accent }}
                    >
                      {feature.subtitle}
                    </p>

                    {/* Description */}
                    <p className={`${txt2} text-sm leading-relaxed m-0 transition-colors duration-300`}>
                      {feature.desc}
                    </p>

                    {/* Bottom glow accent line */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl transition-opacity duration-300`}
                      style={{
                        background: `linear-gradient(90deg,transparent,${feature.accent},transparent)`,
                        opacity: isHovered ? 0.85 : 0,
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            HOW IT WORKS SECTION
        ══════════════════════════════════════════════════════════════════════ */}
        <section className={`relative w-full py-24 overflow-hidden border-t transition-colors duration-300 ${dark ? "border-blue-500/10 bg-black" : "border-blue-500/20 bg-white"}`}>
          <DottedSurface className="absolute inset-0 z-0 opacity-60" />
          
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 sm:mb-20">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] ${dark ? "bg-blue-500/15 text-blue-300 border-blue-500/40" : "bg-blue-500/15 text-blue-600 border-blue-500/50"} border mb-5`}>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6] inline-block" />
                Process
              </span>
              <h2 className={`text-[clamp(32px,5vw,56px)] font-bold tracking-[-0.022em] transition-colors duration-300 ${txt1}`}>
                How it works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-[50px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent z-0" />

              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center text-center group">
                <div className={`w-24 h-24 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${dark ? "bg-black/80 border-white/10" : "bg-white/80 border-blue-100"} border backdrop-blur-md group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]`}>
                  <Lightbulb size={40} className="text-blue-500" strokeWidth={1.5} />
                </div>
                <div className={`text-[13px] font-bold uppercase tracking-wider text-blue-500 mb-2`}>Step 1</div>
                <h3 className={`text-xl font-semibold mb-3 ${txt1} transition-colors duration-300`}>Enter Your Idea</h3>
                <p className={`${txt2} leading-relaxed transition-colors duration-300 max-w-[280px]`}>
                  Describe your startup idea in simple words
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center text-center group mt-4 md:mt-0">
                <div className={`w-24 h-24 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${dark ? "bg-black/80 border-white/10" : "bg-white/80 border-blue-100"} border backdrop-blur-md group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]`}>
                  <BrainCircuit size={40} className="text-blue-500" strokeWidth={1.5} />
                </div>
                <div className={`text-[13px] font-bold uppercase tracking-wider text-blue-500 mb-2`}>Step 2</div>
                <h3 className={`text-xl font-semibold mb-3 ${txt1} transition-colors duration-300`}>AI Analysis</h3>
                <p className={`${txt2} leading-relaxed transition-colors duration-300 max-w-[280px]`}>
                  We convert it into embeddings & search similar startups
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center text-center group mt-4 md:mt-0">
                <div className={`w-24 h-24 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${dark ? "bg-black/80 border-white/10" : "bg-white/80 border-blue-100"} border backdrop-blur-md group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]`}>
                  <LineChart size={40} className="text-blue-500" strokeWidth={1.5} />
                </div>
                <div className={`text-[13px] font-bold uppercase tracking-wider text-blue-500 mb-2`}>Step 3</div>
                <h3 className={`text-xl font-semibold mb-3 ${txt1} transition-colors duration-300`}>Get Insights</h3>
                <p className={`${txt2} leading-relaxed transition-colors duration-300 max-w-[280px]`}>
                  Discover competitors, trends, and opportunities
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            WHO IS THIS FOR SECTION
        ══════════════════════════════════════════════════════════════════════ */}
        <section className={`relative w-full py-24 overflow-hidden border-t transition-colors duration-300 ${dark ? "border-blue-500/10 bg-black/50" : "border-blue-500/20 bg-slate-50/50"}`}>
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 sm:mb-20">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] ${dark ? "bg-blue-500/15 text-blue-300 border-blue-500/40" : "bg-blue-500/15 text-blue-700 border-blue-500/50"} border mb-5`}>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6] inline-block" />
                Audience
              </span>
              <h2 className={`text-[clamp(32px,5vw,56px)] font-bold tracking-[-0.022em] transition-colors duration-300 ${txt1}`}>
                Who is this for?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className={`group relative rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 border ${dark ? "bg-white/[0.03] border-white/10 hover:border-blue-500/50" : "bg-white border-blue-100 hover:border-blue-400"} hover:shadow-[0_12px_40px_-10px_rgba(59,130,246,0.25)] overflow-hidden backdrop-blur-sm cursor-default`}>
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:bg-blue-500/30 group-hover:scale-110" />
                <Code size={40} className="text-blue-500 mb-6 relative z-10" strokeWidth={1.5} />
                <h3 className={`text-xl font-bold mb-3 ${txt1} relative z-10`}>Indie Hackers</h3>
                <p className={`${txt2} text-sm leading-relaxed relative z-10`}>Build faster by skipping the noise. Discover profitable niches and validate ideas instantly.</p>
              </div>

              {/* Card 2 */}
              <div className={`group relative rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 border ${dark ? "bg-white/[0.03] border-white/10 hover:border-blue-500/50" : "bg-white border-blue-100 hover:border-blue-400"} hover:shadow-[0_12px_40px_-10px_rgba(59,130,246,0.25)] overflow-hidden backdrop-blur-sm cursor-default`}>
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:bg-blue-500/30 group-hover:scale-110" />
                <Rocket size={40} className="text-blue-500 mb-6 relative z-10" strokeWidth={1.5} />
                <h3 className={`text-xl font-bold mb-3 ${txt1} relative z-10`}>Startup Founders</h3>
                <p className={`${txt2} text-sm leading-relaxed relative z-10`}>Analyze your competition, find white-space opportunities, and pivot with confidence.</p>
              </div>

              {/* Card 3 */}
              <div className={`group relative rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 border ${dark ? "bg-white/[0.03] border-white/10 hover:border-blue-500/50" : "bg-white border-blue-100 hover:border-blue-400"} hover:shadow-[0_12px_40px_-10px_rgba(59,130,246,0.25)] overflow-hidden backdrop-blur-sm cursor-default`}>
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:bg-blue-500/30 group-hover:scale-110" />
                <GraduationCap size={40} className="text-blue-500 mb-6 relative z-10" strokeWidth={1.5} />
                <h3 className={`text-xl font-bold mb-3 ${txt1} relative z-10`}>Students</h3>
                <p className={`${txt2} text-sm leading-relaxed relative z-10`}>Research markets for your next big project or thesis without spending hours manually searching.</p>
              </div>

              {/* Card 4 */}
              <div className={`group relative rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 border ${dark ? "bg-white/[0.03] border-white/10 hover:border-blue-500/50" : "bg-white border-blue-100 hover:border-blue-400"} hover:shadow-[0_12px_40px_-10px_rgba(59,130,246,0.25)] overflow-hidden backdrop-blur-sm cursor-default`}>
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:bg-blue-500/30 group-hover:scale-110" />
                <Lightbulb size={40} className="text-blue-500 mb-6 relative z-10" strokeWidth={1.5} />
                <h3 className={`text-xl font-bold mb-3 ${txt1} relative z-10`}>Idea Explorers</h3>
                <p className={`${txt2} text-sm leading-relaxed relative z-10`}>Constantly brainstorming? Turn your scattered thoughts into structured market insights.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════════════════════════════ */}
        <footer className={`relative border-t transition-colors duration-300 ${dark ? "border-blue-500/10 bg-black" : "border-blue-500/20 bg-slate-50"}`}>
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className={`flex flex-col md:flex-row items-center justify-between gap-6 ${txt2}`}>
              <div className="flex items-center gap-2">
                <span className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${dark ? "from-neutral-50 to-neutral-400" : "from-gray-900 to-gray-600"}`}>
                  VentureMind-AI
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-sm">
                <span>
                  Made with <span className="text-red-500">❤️</span> by Ayush Prasad
                </span>
                <span className="hidden sm:inline opacity-50">•</span>
                <a 
                  href="mailto:ayushprasad2110@gmail.com" 
                  className={`hover:text-blue-500 transition-colors duration-200 ${dark ? "text-blue-400" : "text-blue-600"}`}
                >
                  ayushprasad2110@gmail.com
                </a>
              </div>
            </div>
            <div className={`mt-8 pt-8 border-t flex flex-col sm:flex-row items-center justify-center text-xs opacity-60 text-center ${dark ? "border-white/10" : "border-black/5"}`}>
              © {new Date().getFullYear()} VentureMind-AI. All rights reserved.
            </div>
          </div>
        </footer>

        <style>{`
          * {
            box-sizing: border-box;
          }
        `}</style>
      </div>
    </>
  )
}