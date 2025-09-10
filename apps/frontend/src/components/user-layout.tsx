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
    <div className={cn("bg-background", className)}>
      <main
        className={cn(
          hideNavigation && "pb-0 overflow-hidden",
        )}
      >
        {children}
      </main>
      {!hideNavigation && <UserNavigation />}
    </div>
  )
}
