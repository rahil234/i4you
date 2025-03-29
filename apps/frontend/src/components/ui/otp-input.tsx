"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface OTPInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  length?: number
  onComplete?: (otp: string) => void
}

export function OTPInput({ length = 6, onComplete, className, ...props }: OTPInputProps) {
  const [otp, setOtp] = React.useState<string[]>(Array(length).fill(""))
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value

    // Only allow one character per input
    if (value.length > 1) return

    // Update the OTP array
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // If a digit was entered, move to the next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // If all digits are entered, call onComplete
    if (newOtp.every((digit) => digit) && onComplete) {
      onComplete(newOtp.join(""))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Only process if the pasted data has the correct length
    if (pastedData.length !== length || !/^\d+$/.test(pastedData)) return

    // Update all inputs with the pasted data
    const newOtp = pastedData.split("")
    setOtp(newOtp)

    // Focus the last input
    inputRefs.current[length - 1]?.focus()

    // Call onComplete
    if (onComplete) {
      onComplete(pastedData)
    }
  }

  return (
    <div className={cn("flex gap-2 justify-center", className)}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={index === 0 ? handlePaste : undefined}
          className={cn(
            "h-12 w-12 rounded-md border border-input bg-background text-center text-xl font-semibold shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring",
            props.className,
          )}
          {...props}
        />
      ))}
    </div>
  )
}

