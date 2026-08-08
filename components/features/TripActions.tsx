"use client"

import { Button } from "@/components/ui/button"
import { Trash, Sparkles } from "lucide-react"
import { deleteTrip } from "@/actions/trips"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"

export function TripActions({ tripId }: { tripId: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this trip?")) return

    try {
      setIsDeleting(true)
      await deleteTrip(tripId)
      toast.success("Trip deleted")
      router.push("/dashboard")
    } catch (error: any) {
      toast.error(error.message)
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Button variant="outline" className="w-full justify-start gap-2" onClick={() => toast.info("Regeneration is coming soon!")}>
        <Sparkles className="w-4 h-4 text-primary" /> Regenerate Itinerary
      </Button>
      <Button 
        variant="outline" 
        className="w-full justify-start gap-2 text-destructive hover:text-destructive" 
        onClick={handleDelete}
        disabled={isDeleting}
      >
        <Trash className="w-4 h-4" /> {isDeleting ? "Deleting..." : "Delete Trip"}
      </Button>
    </>
  )
}
