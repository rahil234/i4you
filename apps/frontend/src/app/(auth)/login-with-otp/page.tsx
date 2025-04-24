"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Loader2 } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

export default function LoginWithOTPPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showOTPInput, setShowOTPInput] = useState(false)
  const [otp, setOtp] = useState("")
  const router = useRouter()

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {

      setSuccess("OTP sent to your email. Please check your inbox.")
      setShowOTPInput(true)
    } catch (err: any) {
      setError(err.message || "Failed to send OTP")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {

      // Redirect to user dashboard on successful verification
      router.push("/user-dashboard")
    } catch (err: any) {
      setError(err.message || "Invalid OTP")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // if (otpError) throw otpError

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
          <CardTitle className="text-2xl font-bold">Sign in with OTP</CardTitle>
          <CardDescription>
            {showOTPInput
              ? "Enter the one-time password sent to your email"
              : "We'll send a one-time password to your email"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showOTPInput ? (
            <form onSubmit={handleSendOTP}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}

                {success && <div className="rounded-md bg-green-50 p-3 text-sm text-green-500">{success}</div>}

                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">One-Time Password</Label>
                  <Input
                    id="otp"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>

                {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}

                {success && <div className="rounded-md bg-green-50 p-3 text-sm text-green-500">{success}</div>}

                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </Button>

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
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            <Link href="/login" className="text-teal-500 hover:underline">
              Sign in with password instead
            </Link>
          </div>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-teal-500 hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

