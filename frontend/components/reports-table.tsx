"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, CheckCircle, XCircle, Eye } from "lucide-react"

export function ReportsTable() {
  const [reports] = useState([
    {
      id: "1",
      reporter: {
        name: "Emma Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "EW",
      },
      reported: {
        name: "Jake Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "JS",
      },
      reason: "Inappropriate messages",
      status: "pending",
      date: "May 12, 2023",
    },
    {
      id: "2",
      reporter: {
        name: "Daniel Brown",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "DB",
      },
      reported: {
        name: "Olivia Davis",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "OD",
      },
      reason: "Fake profile",
      status: "pending",
      date: "May 14, 2023",
    },
    {
      id: "3",
      reporter: {
        name: "Sophia Martinez",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "SM",
      },
      reported: {
        name: "Liam Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "LJ",
      },
      reason: "Harassment",
      status: "resolved",
      date: "May 10, 2023",
    },
    {
      id: "4",
      reporter: {
        name: "Noah Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "NW",
      },
      reported: {
        name: "Ava Thompson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "AT",
      },
      reason: "Inappropriate photos",
      status: "pending",
      date: "May 15, 2023",
    },
    {
      id: "5",
      reporter: {
        name: "Isabella Garcia",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "IG",
      },
      reported: {
        name: "Mason Lee",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "ML",
      },
      reason: "Spam messages",
      status: "dismissed",
      date: "May 9, 2023",
    },
  ])

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reporter</TableHead>
            <TableHead>Reported User</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={report.reporter.avatar} alt={report.reporter.name} />
                    <AvatarFallback>{report.reporter.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{report.reporter.name}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={report.reported.avatar} alt={report.reported.name} />
                    <AvatarFallback>{report.reported.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{report.reported.name}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{report.reason}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    report.status === "pending" ? "outline" : report.status === "resolved" ? "default" : "secondary"
                  }
                >
                  {report.status}
                </Badge>
              </TableCell>
              <TableCell>{report.date}</TableCell>
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
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Resolved
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <XCircle className="mr-2 h-4 w-4" />
                      Dismiss Report
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

