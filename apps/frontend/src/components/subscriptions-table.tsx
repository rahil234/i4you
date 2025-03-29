"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash, RefreshCw, Eye } from "lucide-react"

export function SubscriptionsTable() {
  const [subscriptions] = useState([
    {
      id: "1",
      user: {
        name: "Alex Johnson",
        email: "alex@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "AJ",
      },
      plan: "Premium",
      status: "active",
      startDate: "Jan 12, 2023",
      endDate: "Jan 12, 2024",
      amount: "$99.99",
      paymentMethod: "Credit Card",
    },
    {
      id: "2",
      user: {
        name: "Samantha Lee",
        email: "samantha@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "SL",
      },
      plan: "Basic",
      status: "active",
      startDate: "Mar 5, 2023",
      endDate: "Mar 5, 2024",
      amount: "$49.99",
      paymentMethod: "PayPal",
    },
    {
      id: "3",
      user: {
        name: "Michael Chen",
        email: "michael@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "MC",
      },
      plan: "Premium",
      status: "expired",
      startDate: "Feb 18, 2023",
      endDate: "Feb 18, 2024",
      amount: "$99.99",
      paymentMethod: "Credit Card",
    },
    {
      id: "4",
      user: {
        name: "Jessica Williams",
        email: "jessica@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "JW",
      },
      plan: "Premium Plus",
      status: "active",
      startDate: "Apr 22, 2023",
      endDate: "Apr 22, 2024",
      amount: "$149.99",
      paymentMethod: "Credit Card",
    },
    {
      id: "5",
      user: {
        name: "David Kim",
        email: "david@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "DK",
      },
      plan: "Basic",
      status: "canceled",
      startDate: "May 10, 2023",
      endDate: "Jun 10, 2023",
      amount: "$49.99",
      paymentMethod: "PayPal",
    },
  ])

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((subscription) => (
            <TableRow key={subscription.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={subscription.user.avatar} alt={subscription.user.name} />
                    <AvatarFallback>{subscription.user.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{subscription.user.name}</p>
                    <p className="text-sm text-muted-foreground">{subscription.user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{subscription.plan}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    subscription.status === "active"
                      ? "default"
                      : subscription.status === "expired"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {subscription.status}
                </Badge>
              </TableCell>
              <TableCell>{subscription.startDate}</TableCell>
              <TableCell>{subscription.endDate}</TableCell>
              <TableCell>{subscription.amount}</TableCell>
              <TableCell>{subscription.paymentMethod}</TableCell>
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
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Subscription
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Renew Subscription
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash className="mr-2 h-4 w-4" />
                      Cancel Subscription
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

