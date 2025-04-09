"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Loader2 } from "lucide-react"
import { OTPInput } from "@/components/ui/otp-input"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function VerifyOTPPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get email from URL params
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
    } else {
      router.push("/login-with-otp")
    }
  }, [searchParams, router])

  const handleVerifyOTP = async (otp: string) => {
    if (!email) return

    setIsLoading(true)
    setError(null)

    try {
      // Verify the OTP
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      })

      if (verifyError) throw verifyError

      setSuccess("OTP verified successfully!")

      // Redirect to user dashboard
      setTimeout(() => {
        router.push("/user-dashboard")
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Invalid OTP")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!email) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Resend OTP
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      })

      if (otpError) throw otpError

      setSuccess("New OTP sent to your email. Please check your inbox.")
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Heart className="h-12 w-12 text-teal-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify OTP</CardTitle>
          <CardDescription>Enter the one-time password sent to {email || "your email"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <OTPInput length={6} onComplete={handleVerifyOTP} disabled={isLoading} className="mb-4" />

            {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}

            {success && <div className="rounded-md bg-green-50 p-3 text-sm text-green-500">{success}</div>}

            {isLoading && (
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-teal-500" />
              </div>
            )}

            <div className="text-center">
              <Button
                variant="link"
                type="button"
                onClick={handleResendOTP}
                disabled={isLoading}
                className="text-teal-500"
              >
                Didn&apos;t receive the code? Resend
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm">
            <Link href="/login" className="text-teal-500 hover:underline">
              Back to login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

