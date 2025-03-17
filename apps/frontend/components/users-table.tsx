"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash, Ban, Eye } from "lucide-react"

export function UsersTable() {
  const [users] = useState([
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex@example.com",
      status: "active",
      joined: "Jan 12, 2023",
      location: "New York, USA",
      age: 28,
      gender: "Male",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AJ",
    },
    {
      id: "2",
      name: "Samantha Lee",
      email: "samantha@example.com",
      status: "active",
      joined: "Mar 5, 2023",
      location: "Los Angeles, USA",
      age: 24,
      gender: "Female",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SL",
    },
    {
      id: "3",
      name: "Michael Chen",
      email: "michael@example.com",
      status: "suspended",
      joined: "Feb 18, 2023",
      location: "Toronto, Canada",
      age: 32,
      gender: "Male",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MC",
    },
    {
      id: "4",
      name: "Jessica Williams",
      email: "jessica@example.com",
      status: "active",
      joined: "Apr 22, 2023",
      location: "London, UK",
      age: 26,
      gender: "Female",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JW",
    },
    {
      id: "5",
      name: "David Kim",
      email: "david@example.com",
      status: "inactive",
      joined: "May 10, 2023",
      location: "Seoul, South Korea",
      age: 30,
      gender: "Male",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "DK",
    },
  ])

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Age/Gender</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    user.status === "active" ? "default" : user.status === "suspended" ? "destructive" : "secondary"
                  }
                >
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>{user.location}</TableCell>
              <TableCell>
                {user.age} / {user.gender}
              </TableCell>
              <TableCell>{user.joined}</TableCell>
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
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit User
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Ban className="mr-2 h-4 w-4" />
                      Suspend User
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete User
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

