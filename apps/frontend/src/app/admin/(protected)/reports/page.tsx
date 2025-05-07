import { ReportsTable } from "@/components/reports-table"
import { ReportsFilter } from "@/components/reports-filter"

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reports & Flags</h1>
      </div>
      <ReportsFilter />
      <ReportsTable />
    </div>
  )
}

