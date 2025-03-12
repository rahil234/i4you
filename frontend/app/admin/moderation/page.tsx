import { ModerationQueue } from "@/components/moderation-queue"
import { ModerationFilter } from "@/components/moderation-filter"

export default function ModerationPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Content Moderation</h1>
      </div>
      <ModerationFilter />
      <ModerationQueue />
    </div>
  )
}

