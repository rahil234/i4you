import { SubscriptionsTable } from "@/components/subscriptions-table"
import { SubscriptionsFilter } from "@/components/subscriptions-filter"
import { SubscriptionsStats } from "@/components/subscriptions-stats"

export default function SubscriptionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Subscription Management</h1>
      </div>
      <SubscriptionsStats />
      <SubscriptionsFilter />
      <SubscriptionsTable />
    </div>
  )
}

