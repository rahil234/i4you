"use client"

import Link from "next/link"
import {usePathname} from "next/navigation"
import {Heart, MessageCircle, User} from "lucide-react"
import {cn} from "@/lib/utils"
import useMatchesStore from "@/store/matchesStore"
import {Logo} from "@/components/logo"
import useChatStore from '@/store/chatStore';

export function UserNavigation() {
    const pathname = usePathname()
    const {matches} = useMatchesStore()
    const {messages} = useChatStore()

    // Calculate total unread messages
    const totalUnread = Object.values(messages).reduce((total, chatMessages) => {
        const unreadCount = chatMessages.filter((msg) => msg.sender !== "user1" && msg.status !== "read").length
        return total + unreadCount
    }, 0)

    const navItems = [
        {
            name: "Discover",
            href: "/discover",
            icon: Logo,
        },
        {
            name: "Matches",
            href: "/matches",
            icon: Heart,
            badge: matches.length > 0 ? matches.length : undefined,
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
        <div className="fixed bottom-0 left-0 right-0 border-t bg-background shadow-lg z-10">
            <div className="flex justify-around">
                {navItems.map((item) => {
                    const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center py-2 px-3 relative",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                            )}
                        >
                            <item.icon className="h-6 w-6"/>
                            <span className="text-xs mt-1">{item.name}</span>

                            {item.badge && (
                                <span
                                    className="absolute top-0 right-0 h-5 min-w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center px-1 transform translate-x-1/2 -translate-y-1/2">
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

