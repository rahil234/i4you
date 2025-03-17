import type React from "react"
import { UserNavigation } from "@/components/user-navigation"
import { cn } from "@/lib/utils"

interface UserLayoutProps {
  children: React.ReactNode
  className?: string
  hideNavigation?: boolean
}

export function UserLayout({ children, className, hideNavigation = false }: UserLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-gray-50", className)}>
      <main
        className={cn(
          "pb-16", // Space for the bottom navigation
          hideNavigation && "pb-0",
        )}
      >
        {children}
      </main>
      {!hideNavigation && <UserNavigation />}
    </div>
  )
}

