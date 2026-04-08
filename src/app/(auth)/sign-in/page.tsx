"use client";
import React, { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

// ─────────────────────────────────────────────────────────────────────────────
// Canvas Sparkles Component
// ─────────────────────────────────────────────────────────────────────────────
function Sparkles({
  color = "#ffffff",
  density = 400,
  dark = true,
}: {
  color?: string;
  density?: number;
  dark?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    type Particle = {
      x: number;
      y: number;
      r: number;
      alpha: number;
      speed: number;
      dir: number;
      flicker: number;
    };
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const adjustedDensity =
        window.innerWidth < 768 ? density * 0.5 : density;
      particles = Array.from({ length: adjustedDensity }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random(),
        speed: Math.random() * 0.25 + 0.03,
        dir: Math.random() * Math.PI * 2,
        flicker: Math.random() * 0.015 + 0.003,
      }));
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.alpha += p.flicker * (Math.random() > 0.5 ? 1 : -1);
        p.alpha = Math.max(0.05, Math.min(0.8, p.alpha));
        p.x += Math.cos(p.dir) * p.speed;
        p.y += Math.sin(p.dir) * p.speed;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [color, density]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

export default function SignInPage() {
  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);
  const [darkTheme, setDarkTheme] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const checkTheme = () => {
      setDarkTheme(document.documentElement.classList.contains("dark"));
    };
    checkTheme();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") checkTheme();
      });
    });
    observer.observe(document.documentElement, { attributes: true });

    return () => {
      window.removeEventListener("resize", checkMobile);
      observer.disconnect();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    console.log(credentials);
    try {
      const response = await signIn("credentials", {
        identifier: credentials.identifier,
        password: credentials.password,
        redirect: false,
      });

      if (response?.error) {
        toast.error(response.error);
      } else {
        toast.success("Login successful");
        router.push("/dashboard");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: true,
      });
    } catch (error) {
      console.error("Google sign in error:", error);
      toast.error("Failed to sign in with Google. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  // Theme-based classes
  const bgColor = darkTheme ? "bg-black" : "bg-white";
  const cardBg = darkTheme ? "bg-black" : "bg-white";
  const leftSideBg = darkTheme
    ? "bg-gradient-to-br from-blue-900 to-black"
    : "bg-gradient-to-br from-blue-100 to-white";
  const textColor = darkTheme ? "text-white" : "text-gray-900";
  const textSecondary = darkTheme ? "text-gray-300" : "text-gray-600";
  const textMuted = darkTheme ? "text-gray-400" : "text-gray-500";
  const borderColor = darkTheme ? "border-blue-500/30" : "border-blue-300/50";
  const borderAccent = darkTheme ? "border-blue-500/20" : "border-blue-300/40";
  const inputBg = darkTheme ? "bg-black" : "bg-white";
  const inputBorder = darkTheme ? "border-gray-700" : "border-gray-300";
  const sparkleColor = darkTheme ? "#3b82f6" : "#2563eb";

  return (
    <div
      className={`flex justify-center items-center min-h-screen ${bgColor} p-3 sm:p-4 md:p-6 transition-colors duration-300`}
    >
      <div className="w-full max-w-5xl mx-auto">
        <div
          className={`relative overflow-hidden rounded-xl sm:rounded-2xl ${cardBg} border ${borderColor} shadow-xl sm:shadow-2xl shadow-blue-500/10 transition-all duration-300`}
        >
          {/* Background decorative blurs */}
          <div
            className={`absolute -top-40 -right-40 h-80 w-80 rounded-full ${
              darkTheme ? "bg-blue-600/5" : "bg-blue-400/5"
            } blur-3xl hidden md:block`}
          />
          <div
            className={`absolute -bottom-40 -left-40 h-80 w-80 rounded-full ${
              darkTheme ? "bg-blue-600/5" : "bg-blue-400/5"
            } blur-3xl hidden md:block`}
          />

          <div className="relative grid md:grid-cols-2">
            {/* ── Left Side ── */}
            <div
              className={`relative overflow-hidden ${leftSideBg} p-5 sm:p-6 md:p-8 border-b md:border-b-0 md:border-r ${borderAccent} transition-colors duration-300`}
            >
              <div className="absolute inset-0">
                <Sparkles
                  color={sparkleColor}
                  density={isMobile ? 150 : 350}
                  dark={darkTheme}
                />
              </div>

              {/* Blue glow */}
              <div
                className="absolute bottom-[-50px] left-1/2 transform -translate-x-1/2 pointer-events-none z-1 hidden sm:block"
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
                  {/* Logo */}
                  <div className="mb-4 sm:mb-5">
                    <img
                      src="/VentureMind.png"
                      alt="venturemind-logo"
                      className={`h-10 sm:h-12 w-auto ${
                        darkTheme ? "brightness-0 invert" : ""
                      } mx-auto md:mx-0 transition-all duration-300`}
                    />
                  </div>

                  <h3
                    className={`mb-2 sm:mb-3 text-xl sm:text-2xl md:text-3xl font-bold ${textColor} text-center md:text-left transition-colors duration-300`}
                  >
                    Welcome back to <br className="hidden sm:block" />
                    VentureMind-AI
                  </h3>

                  <div className="mb-3 sm:mb-4 h-0.5 w-16 bg-blue-500 rounded-full mx-auto md:mx-0" />

                  <p
                    className={`mb-5 sm:mb-6 text-sm sm:text-base ${textSecondary} text-center md:text-left transition-colors duration-300`}
                  >
                    Sign in to continue your journey. Your AI-powered business
                    partner is ready and waiting.
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3 sm:space-y-4">
                  {[
                    "AI-powered business insights",
                    "Real-time market analysis",
                    "Personalized recommendations",
                  ].map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center space-x-2.5 justify-center md:justify-start"
                    >
                      <div
                        className={`flex h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0 items-center justify-center rounded-full ${
                          darkTheme ? "bg-blue-500/20" : "bg-blue-500/10"
                        } backdrop-blur-sm border ${borderAccent}`}
                      >
                        <svg
                          className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p
                        className={`text-xs sm:text-sm ${textSecondary} transition-colors duration-300`}
                      >
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Sign Up Link */}
                <div className={`mt-5 sm:mt-6 pt-3 sm:pt-4 border-t ${borderAccent}`}>
                  <p
                    className={`text-xs sm:text-sm ${textMuted} text-center md:text-left transition-colors duration-300`}
                  >
                    Don&apos;t have an account?
                    <Link
                      href="/sign-up"
                      className="ml-1 font-semibold text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* ── Right Side – Form ── */}
            <div
              className={`p-5 sm:p-6 md:p-8 ${cardBg} transition-colors duration-300`}
            >
              <div className="mb-4 sm:mb-5 text-center md:text-left">
                <h2
                  className={`text-lg sm:text-xl font-bold ${textColor} transition-colors duration-300`}
                >
                  Sign In
                </h2>
                <p className={`text-xs sm:text-sm ${textMuted} mt-1`}>
                  Enter your credentials to access your account
                </p>
              </div>

              <form
                className="space-y-3 sm:space-y-4"
                onSubmit={handleSubmit}
              >
                <LabelInputContainer className="mb-2 sm:mb-3">
                  <Label
                    htmlFor="identifier"
                    className={`text-xs sm:text-sm font-medium ${textSecondary} transition-colors duration-300`}
                  >
                    Email / Username
                  </Label>
                  <Input
                    id="identifier"
                    name="identifier"
                    placeholder="Email / Username"
                    type="text"
                    value={credentials.identifier}
                    onChange={handleInputChange}
                    className={`rounded-lg ${inputBorder} ${inputBg} ${textColor} focus:border-blue-500 focus:ring-blue-500 text-sm h-9 sm:h-10 transition-colors duration-300`}
                  />
                </LabelInputContainer>

                <LabelInputContainer className="mb-3 sm:mb-4">
                  <Label
                    htmlFor="password"
                    className={`text-xs sm:text-sm font-medium ${textSecondary} transition-colors duration-300`}
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    className={`rounded-lg ${inputBorder} ${inputBg} ${textColor} focus:border-blue-500 focus:ring-blue-500 text-sm h-9 sm:h-10 transition-colors duration-300`}
                  />
                </LabelInputContainer>

                {/* Forgot password link */}
                {/* <div className="flex justify-end -mt-1">
                  <Link
                    href="/forgot-password"
                    className={`text-xs ${textMuted} hover:text-blue-500 transition-colors`}
                  >
                    Forgot password?
                  </Link>
                </div> */}

                <button
                  className="group/btn cursor-pointer relative flex items-center justify-center h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <span>Sign in &rarr;</span>
                  )}
                  <BottomGradient />
                </button>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div
                      className={`w-full border-t ${
                        darkTheme ? "border-gray-700" : "border-gray-300"
                      }`}
                    />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span
                      className={`px-2 ${
                        darkTheme
                          ? "bg-black text-gray-400"
                          : "bg-white text-gray-500"
                      }`}
                    >
                      OR
                    </span>
                  </div>
                </div>

                {/* Google Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading || submitting}
                  className={`cursor-pointer relative flex items-center justify-center gap-3 h-10 w-full rounded-md border ${
                    darkTheme
                      ? "border-gray-700 hover:bg-gray-900"
                      : "border-gray-300 hover:bg-gray-50"
                  } transition-all duration-200 ${textColor} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isGoogleLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span>Redirecting to Google...</span>
                    </div>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Shared sub-components ──────────────────────────────────────────────────

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-1 sm:space-y-1.5", className)}>
    {children}
  </div>
);