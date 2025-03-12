"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Heart, MessageCircle, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useChat } from "@/contexts/chat-context"

export function UserNavigation() {
  const pathname = usePathname()
  const { chats } = useChat()

  // Calculate total unread messages
  const totalUnread = chats.reduce((total, chat) => total + chat.unreadCount, 0)

  const navItems = [
    {
      name: "Discover",
      href: "/discover",
      icon: Home,
    },
    {
      name: "Matches",
      href: "/matches",
      icon: Heart,
    },
    {
      name: "Messages",
      href: "/messages",
      icon: MessageCircle,
      badge: totalUnread > 0 ? totalUnread : undefined,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white shadow-lg z-10">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center py-2 px-3 relative",
                isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-900",
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.name}</span>

              {item.badge && (
                <span className="absolute top-0 right-0 h-5 min-w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center px-1 transform translate-x-1/2 -translate-y-1/2">
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

