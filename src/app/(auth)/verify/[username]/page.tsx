"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Shield } from "lucide-react"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

interface OTPVerificationProps {
  email?: string
  onVerify?: (otp: string) => void
  onResend?: () => void
  isLoading?: boolean
  autoFocus?: boolean
}

export default function OTPVerification({ 
  onResend,
  isLoading: externalLoading,
  autoFocus = true
}: OTPVerificationProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]) // Changed to 6 digits
  const [internalLoading, setInternalLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false) // New state for verification loading
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const isLoading = externalLoading !== undefined ? externalLoading : internalLoading || isVerifying

  const paramas = useParams<{ username: string }>();
  const router = useRouter();

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) { // Changed from 3 to 5
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async () => {
    const otpCode = otp.join("")
    if (otpCode.length !== 6) return

    setIsVerifying(true)

    try {
      const response = await axios.post("/api/verify-code", {
        username: paramas.username,
        verificationToken: otpCode
      })

      if(response.data.success){
        toast.success(response.data.message)
        router.push("/sign-in")
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error("Error verifying OTP:", error)
      toast.error("Error verifying OTP. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    if (onResend) {
      onResend()
    } else {
      setInternalLoading(true)
      try {
        // Add your resend API call here
        await axios.post("/api/resend-code", {
          username: paramas.username
        })
        toast.success("Verification code resent successfully!")
      } catch (error) {
        console.error("Error resending code:", error)
        toast.error("Error resending code. Please try again.")
      } finally {
        setInternalLoading(false)
      }
    }
  }

  // Auto-focus first input on mount
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [autoFocus])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl shadow-2xl">
        <div className="absolute inset-0 z-0">
          {/* Using a free stock image from Unsplash - tunnel effect */}
          <img
            src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=2000"
            alt="Abstract background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/80 via-blue-800/90 to-black/95" />
        </div>

        <div className="relative z-10 p-8 py-14">
          <div className="text-center mb-8">
            <div className="w-12 h-12 mx-auto mb-6 text-white bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-semibold text-white mb-3">Enter verification code</h1>
          </div>

          <div className="flex justify-center gap-2 flex-wrap mb-8">
            {otp.map((digit, index) => (
              <div key={index} className="relative">
                <input
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-xl font-medium bg-white/10 border border-white/20 text-white placeholder-white/40 focus:bg-white/20 focus:border-blue-400 focus:outline-none transition-all duration-200 shadow-lg rounded-2xl"
                  placeholder=""
                  disabled={isLoading}
                />
              </div>
            ))}
          </div>

          <div className="text-center mb-8">
            <button
              onClick={handleVerify}
              disabled={isLoading || otp.join("").length !== 6}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
            >
              {isVerifying ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (
                "Verify Code"
              )}
            </button>
          </div>

          <div className="text-center">
            <span className="text-white/60 text-sm">Didn't get the code? </span>
            <button
              onClick={handleResend}
              disabled={isLoading}
              className="text-white/80 hover:text-white text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {internalLoading ? (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                "Resend Code"
              )}
            </button>
          </div>

          <div className="text-center mt-8 pt-4 border-t border-white/10">
            <p className="text-white/40 text-xs leading-relaxed">
              By continuing, you agree to our{" "}
              <button className="text-white/60 hover:text-white underline transition-colors">
                Terms of Service
              </button>{" "}
              &{" "}
              <button className="text-white/60 hover:text-white underline transition-colors">
                Privacy Policy
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}