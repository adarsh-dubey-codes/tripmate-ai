"use client"

import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { deleteActivity } from "@/actions/trips"
import { toast } from "sonner"
import { useState } from "react"

export function ActivityActions({ activityId, tripId }: { activityId: string, tripId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm("Delete this activity?")) return

    try {
      setIsDeleting(true)
      await deleteActivity(activityId, tripId)
      toast.success("Activity deleted")
    } catch (error: any) {
      toast.error(error.message)
      setIsDeleting(false)
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash className="w-4 h-4" />
    </Button>
  )
}
