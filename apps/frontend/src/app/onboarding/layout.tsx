import type React from "react"
import { ThemeProvider } from "@/contexts/theme-context"
import { ThemeToggle } from "@/components/theme-toggle"

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        {children}
      </div>
    </ThemeProvider>
  )
}

