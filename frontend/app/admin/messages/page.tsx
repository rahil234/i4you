import { MessagesTable } from "@/components/messages-table"
import { MessagesFilter } from "@/components/messages-filter"

export default function MessagesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Message Management</h1>
      </div>
      <MessagesFilter />
      <MessagesTable />
    </div>
  )
}

