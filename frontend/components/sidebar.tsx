"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, CreditCard, Flag, Heart, Home, MessageSquare, Settings, Shield, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarLinks = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: Home,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Messages",
    href: "/admin/messages",
    icon: MessageSquare,
  },
  {
    name: "Reports",
    href: "/admin/reports",
    icon: Flag,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Moderation",
    href: "/admin/moderation",
    icon: Shield,
  },
  {
    name: "Subscriptions",
    href: "/admin/subscriptions",
    icon: CreditCard,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex md:w-64 flex-col bg-teal-900 text-white h-screen">
      <div className="p-4 border-b border-teal-700 flex items-center gap-2">
        <Heart className="h-6 w-6 text-teal-400" />
        <h1 className="text-xl font-bold">LoveConnect</h1>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {sidebarLinks.map((link) => {
            // Check if the current path matches the link or starts with the link path (for nested routes)
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    isActive ? "bg-teal-600 text-white" : "hover:bg-teal-800 text-teal-100",
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-teal-700">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-teal-700 flex items-center justify-center">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-teal-300">admin@loveconnect.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

