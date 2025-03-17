"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Mon", matches: 240 },
  { name: "Tue", matches: 300 },
  { name: "Wed", matches: 320 },
  { name: "Thu", matches: 380 },
  { name: "Fri", matches: 520 },
  { name: "Sat", matches: 650 },
  { name: "Sun", matches: 470 },
]

export function MatchesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Matches</CardTitle>
        <CardDescription>Number of matches per day this week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="matches" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

