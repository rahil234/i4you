import { AnalyticsCharts } from "@/components/analytics-charts"
import { AnalyticsMetrics } from "@/components/analytics-metrics"
import { DateRangePicker } from "@/components/date-range-picker"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <DateRangePicker />
      </div>
      <AnalyticsMetrics />
      <AnalyticsCharts />
    </div>
  )
}

