"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", users: 4000 },
  { name: "Feb", users: 5000 },
  { name: "Mar", users: 6000 },
  { name: "Apr", users: 7000 },
  { name: "May", users: 9000 },
  { name: "Jun", users: 12000 },
  { name: "Jul", users: 16000 },
  { name: "Aug", users: 18000 },
  { name: "Sep", users: 20000 },
  { name: "Oct", users: 22000 },
  { name: "Nov", users: 23000 },
  { name: "Dec", users: 24500 },
]

export function UserGrowthChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
        <CardDescription>Total users over the past year</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#14b8a6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

