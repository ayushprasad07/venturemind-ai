"use client";
import React, { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// Canvas Sparkles Component
// ─────────────────────────────────────────────────────────────────────────────
function Sparkles({ color = "#ffffff", density = 400, dark = true }: { color?: string; density?: number; dark?: boolean }) {
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
      const adjustedDensity = window.innerWidth < 768 ? density * 0.5 : density
      particles = Array.from({ length: adjustedDensity }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random(),
        speed: Math.random() * 0.25 + 0.03,
        dir: Math.random() * Math.PI * 2,
        flicker: Math.random() * 0.015 + 0.003,
      }))
    }

    resize()
    window.addEventListener("resize", resize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.alpha += p.flicker * (Math.random() > 0.5 ? 1 : -1)
        p.alpha = Math.max(0.05, Math.min(0.8, p.alpha))
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

export default function SignupFormDemo() {
  const [isMobile, setIsMobile] = useState(false)
  const [darkTheme, setDarkTheme] = useState(true)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    
    // Check for theme
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark")
      setDarkTheme(isDark)
    }
    
    checkTheme()
    
    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          checkTheme()
        }
      })
    })
    
    observer.observe(document.documentElement, { attributes: true })
    
    return () => {
      window.removeEventListener("resize", checkMobile)
      observer.disconnect()
    }
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };
  
  // Theme-based classes
  const bgColor = darkTheme ? "bg-black" : "bg-white"
  const cardBg = darkTheme ? "bg-black" : "bg-white"
  const leftSideBg = darkTheme 
    ? "bg-gradient-to-br from-blue-900 to-black" 
    : "bg-gradient-to-br from-blue-100 to-white"
  const textColor = darkTheme ? "text-white" : "text-gray-900"
  const textSecondary = darkTheme ? "text-gray-300" : "text-gray-600"
  const textMuted = darkTheme ? "text-gray-400" : "text-gray-500"
  const borderColor = darkTheme ? "border-blue-500/30" : "border-blue-300/50"
  const borderAccent = darkTheme ? "border-blue-500/20" : "border-blue-300/40"
  const inputBg = darkTheme ? "bg-black" : "bg-white"
  const inputBorder = darkTheme ? "border-gray-700" : "border-gray-300"
  const buttonBg = "bg-blue-600"
  const sparkleColor = darkTheme ? "#3b82f6" : "#2563eb"
  
  return (
    <div className={`flex justify-center items-center min-h-screen ${bgColor} p-3 sm:p-4 md:p-6 transition-colors duration-300`}>
      <div className="w-full max-w-5xl mx-auto">
        {/* Premium Card with Split Layout - Reduced height */}
        <div className={`relative overflow-hidden rounded-xl sm:rounded-2xl ${cardBg} border ${borderColor} shadow-xl sm:shadow-2xl shadow-blue-500/10 transition-all duration-300`}>
          {/* Background Decorative Elements - Hidden on mobile */}
          <div className={`absolute -top-40 -right-40 h-80 w-80 rounded-full ${darkTheme ? "bg-blue-600/5" : "bg-blue-400/5"} blur-3xl hidden md:block`}></div>
          <div className={`absolute -bottom-40 -left-40 h-80 w-80 rounded-full ${darkTheme ? "bg-blue-600/5" : "bg-blue-400/5"} blur-3xl hidden md:block`}></div>
          
          <div className="relative grid md:grid-cols-2">
            {/* Left Side - Info Section with Sparkles - Reduced padding */}
            <div className={`relative overflow-hidden ${leftSideBg} p-5 sm:p-6 md:p-8 border-b md:border-b-0 md:border-r ${borderAccent} transition-colors duration-300`}>
              {/* Sparkles Animation */}
              <div className="absolute inset-0">
                <Sparkles color={sparkleColor} density={isMobile ? 150 : 350} dark={darkTheme} />
              </div>
              
              {/* Blue glow behind content */}
              <div className="absolute bottom-[-50px] left-1/2 transform -translate-x-1/2 pointer-events-none z-1 hidden sm:block"
                style={{
                  width: "350px",
                  height: "250px",
                  borderRadius: "50%",
                  background: darkTheme 
                    ? "radial-gradient(ellipse,rgba(59,130,246,0.25) 0%,rgba(37,99,235,0.08) 42%,transparent 68%)"
                    : "radial-gradient(ellipse,rgba(59,130,246,0.15) 0%,rgba(37,99,235,0.05) 42%,transparent 68%)",
                }}
              />
              
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  {/* Logo - Smaller */}
                  <div className="mb-4 sm:mb-5">
                    <img
                      src="/VentureMind.png"
                      alt="venturemind-logo"
                      className={`h-10 sm:h-12 w-auto ${darkTheme ? "brightness-0 invert" : ""} mx-auto md:mx-0 transition-all duration-300`}
                    />
                  </div>
                  
                  {/* Heading - Smaller text */}
                  <h3 className={`mb-2 sm:mb-3 text-xl sm:text-2xl md:text-3xl font-bold ${textColor} text-center md:text-left transition-colors duration-300`}>
                    Welcome to <br className="hidden sm:block" />
                    VentureMind-AI
                  </h3>
                  
                  <div className="mb-3 sm:mb-4 h-0.5 w-16 bg-blue-500 rounded-full mx-auto md:mx-0"></div>
                  
                  <p className={`mb-5 sm:mb-6 text-sm sm:text-base ${textSecondary} text-center md:text-left transition-colors duration-300`}>
                    Your intelligent partner for business growth and innovation. 
                    Join thousands of entrepreneurs who are transforming their ideas into reality.
                  </p>
                </div>
                
                {/* Features List - Condensed */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-2.5 justify-center md:justify-start">
                    <div className={`flex h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0 items-center justify-center rounded-full ${darkTheme ? "bg-blue-500/20" : "bg-blue-500/10"} backdrop-blur-sm border ${borderAccent}`}>
                      <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className={`text-xs sm:text-sm ${textSecondary} transition-colors duration-300`}>AI-powered business insights</p>
                  </div>
                  
                  <div className="flex items-center space-x-2.5 justify-center md:justify-start">
                    <div className={`flex h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0 items-center justify-center rounded-full ${darkTheme ? "bg-blue-500/20" : "bg-blue-500/10"} backdrop-blur-sm border ${borderAccent}`}>
                      <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className={`text-xs sm:text-sm ${textSecondary} transition-colors duration-300`}>Real-time market analysis</p>
                  </div>
                  
                  <div className="flex items-center space-x-2.5 justify-center md:justify-start">
                    <div className={`flex h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0 items-center justify-center rounded-full ${darkTheme ? "bg-blue-500/20" : "bg-blue-500/10"} backdrop-blur-sm border ${borderAccent}`}>
                      <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className={`text-xs sm:text-sm ${textSecondary} transition-colors duration-300`}>Personalized recommendations</p>
                  </div>
                </div>
                
                {/* Sign In Link - Condensed */}
                <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t ${borderAccent}">
                  <p className={`text-xs sm:text-sm ${textMuted} text-center md:text-left transition-colors duration-300`}>
                    Already have an account? 
                    <Link href="/sign-in" className="ml-1 font-semibold text-blue-500 hover:text-blue-600 transition-colors">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right Side - Form Section - Reduced padding */}
            <div className={`p-5 sm:p-6 md:p-8 ${cardBg} transition-colors duration-300`}>
              <div className="mb-4 sm:mb-5 text-center md:text-left">
                <h2 className={`text-lg sm:text-xl font-bold ${textColor} transition-colors duration-300`}>Create Account</h2>
              </div>
              
              <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
                <LabelInputContainer className="mb-2 sm:mb-3">
                  <Label htmlFor="name" className={`text-xs sm:text-sm font-medium ${textSecondary} transition-colors duration-300`}>Full name</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    type="text" 
                    name="name"
                    className={`rounded-lg ${inputBorder} ${inputBg} ${textColor} placeholder:${darkTheme ? "text-gray-500" : "text-gray-400"} focus:border-blue-500 focus:ring-blue-500 text-sm h-9 sm:h-10 transition-colors duration-300`}
                  />
                </LabelInputContainer>
                
                <LabelInputContainer className="mb-2 sm:mb-3">
                  <Label htmlFor="username" className={`text-xs sm:text-sm font-medium ${textSecondary} transition-colors duration-300`}>Username</Label>
                  <Input 
                    id="username" 
                    placeholder="johndoe" 
                    type="text" 
                    name="username"
                    className={`rounded-lg ${inputBorder} ${inputBg} ${textColor} placeholder:${darkTheme ? "text-gray-500" : "text-gray-400"} focus:border-blue-500 focus:ring-blue-500 text-sm h-9 sm:h-10 transition-colors duration-300`}
                  />
                </LabelInputContainer>
                
                <LabelInputContainer className="mb-2 sm:mb-3">
                  <Label htmlFor="email" className={`text-xs sm:text-sm font-medium ${textSecondary} transition-colors duration-300`}>Email Address</Label>
                  <Input 
                    id="email" 
                    placeholder="john@example.com" 
                    type="email" 
                    name="email"
                    className={`rounded-lg ${inputBorder} ${inputBg} ${textColor} placeholder:${darkTheme ? "text-gray-500" : "text-gray-400"} focus:border-blue-500 focus:ring-blue-500 text-sm h-9 sm:h-10 transition-colors duration-300`}
                  />
                </LabelInputContainer>
                
                <LabelInputContainer className="mb-3 sm:mb-4">
                  <Label htmlFor="password" className={`text-xs sm:text-sm font-medium ${textSecondary} transition-colors duration-300`}>Password</Label>
                  <Input 
                    id="password" 
                    placeholder="••••••••" 
                    type="password" 
                    name="password"
                    className={`rounded-lg ${inputBorder} ${inputBg} ${textColor} placeholder:${darkTheme ? "text-gray-500" : "text-gray-400"} focus:border-blue-500 focus:ring-blue-500 text-sm h-9 sm:h-10 transition-colors duration-300`}
                  />
                </LabelInputContainer>

                <button
                    className="group/btn cursor-pointer relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
                    type="submit"
                    >
                    Sign up &rarr;
                    <BottomGradient />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-1 sm:space-y-1.5", className)}>
      {children}
    </div>
  );
};