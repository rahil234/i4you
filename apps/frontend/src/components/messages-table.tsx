"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Eye, Trash, Ban, Flag } from "lucide-react"

export function MessagesTable() {
  const [messages] = useState([
    {
      id: "1",
      sender: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "AJ",
      },
      recipient: {
        name: "Samantha Lee",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "SL",
      },
      content: "Hey there! I saw that we both like hiking. Have you been to any good trails lately?",
      status: "delivered",
      date: "10 minutes ago",
      flagged: false,
    },
    {
      id: "2",
      sender: {
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "MC",
      },
      recipient: {
        name: "Jessica Williams",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "JW",
      },
      content: "Would you like to meet for coffee sometime this week?",
      status: "read",
      date: "2 hours ago",
      flagged: false,
    },
    {
      id: "3",
      sender: {
        name: "David Kim",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "DK",
      },
      recipient: {
        name: "Emma Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "ER",
      },
      content: "Hey beautiful, what's your number? Let's take this conversation somewhere else...",
      status: "flagged",
      date: "1 day ago",
      flagged: true,
    },
    {
      id: "4",
      sender: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "SJ",
      },
      recipient: {
        name: "James Watson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "JW",
      },
      content: "I really enjoyed our conversation yesterday. Looking forward to getting to know you better!",
      status: "delivered",
      date: "3 hours ago",
      flagged: false,
    },
    {
      id: "5",
      sender: {
        name: "Tyler Jackson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "TJ",
      },
      recipient: {
        name: "Sophia Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "SC",
      },
      content: "Check out my Instagram @tyler_j for more pics. I don't check this app much.",
      status: "flagged",
      date: "5 hours ago",
      flagged: true,
    },
  ])

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sender</TableHead>
            <TableHead>Recipient</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => (
            <TableRow key={message.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                    <AvatarFallback>{message.sender.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{message.sender.name}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={message.recipient.avatar} alt={message.recipient.name} />
                    <AvatarFallback>{message.recipient.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{message.recipient.name}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="max-w-[300px] truncate">{message.content}</p>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    message.status === "delivered" ? "outline" : message.status === "read" ? "secondary" : "destructive"
                  }
                >
                  {message.status}
                </Badge>
              </TableCell>
              <TableCell>{message.date}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Full Message
                    </DropdownMenuItem>
                    {message.flagged ? (
                      <DropdownMenuItem>
                        <Ban className="mr-2 h-4 w-4" />
                        Mark as Inappropriate
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem>
                        <Flag className="mr-2 h-4 w-4" />
                        Flag Message
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="text-destructive">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete Message
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

