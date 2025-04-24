import { DashboardCards } from "@/components/dashboard-cards"
import { RecentActivity } from "@/components/recent-activity"
import { UserGrowthChart } from "@/components/user-growth-chart"
import { MatchesChart } from "@/components/matches-chart"

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      <p className="text-muted-foreground">Welcome back to your dating app admin panel</p>

      <DashboardCards />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <UserGrowthChart />
        <MatchesChart />
      </div>
      <RecentActivity />
    </div>
  )
}

