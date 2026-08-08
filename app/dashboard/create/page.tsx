"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { MapPin, Calendar, Wallet, Compass, Sparkles, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { differenceInDays } from "date-fns"
import { createTrip, createActivities } from "@/actions/trips"

const tripSchema = z.object({
  destination: z.string().min(2, "Destination is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  budget: z.string().min(1, "Budget is required"),
  travel_style: z.string().min(1, "Travel style is required"),
})

type TripFormValues = z.infer<typeof tripSchema>

export default function CreateTripPage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      budget: "moderate",
      travel_style: "balanced"
    }
  })

  async function onSubmit(data: TripFormValues) {
    try {
      setIsGenerating(true)
      toast.info("AI is crafting your itinerary...")

      // 1. Generate itinerary via AI Route Handler
      const response = await fetch('/api/generate-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to generate itinerary")
      }

      const generatedData = await response.json()
      
      const startDate = new Date(data.start_date)
      const endDate = new Date(data.end_date)
      let numDays = differenceInDays(endDate, startDate) + 1
      
      // Ensure it's a valid positive integer before sending to Supabase
      if (isNaN(numDays) || numDays < 1) {
        numDays = 1
      } else {
        numDays = Math.max(1, Math.round(Number(numDays)))
      }

      const budgetMap: Record<string, number> = {
        "budget": 1,
        "moderate": 2,
        "luxury": 3,
        "ultra-luxury": 4,
      }
      const numericBudget = budgetMap[data.budget] || 2

      // 2. Save trip to Supabase
      const newTrip = await createTrip({
        destination: data.destination,
        days: numDays,
        budget: numericBudget,
        travelers: 2,
        interests: data.travel_style,
        itinerary: null,
      })

      // 3. Save activities
      if (generatedData.activities && generatedData.activities.length > 0) {
        const activitiesToSave = generatedData.activities.map((act: any) => {
          const actDate = new Date(act.start_time)
          let dayNum = differenceInDays(actDate, startDate) + 1
          if (isNaN(dayNum) || dayNum < 1) dayNum = 1
          
          return {
            trip_id: newTrip.id,
            day_number: act.day_number || Math.max(1, Math.round(Number(dayNum))),
            title: act.title,
            description: act.description || null,
            activity_type: act.activity_type || 'other',
            start_time: act.start_time,
            end_time: act.end_time || null,
            location: act.location || null,
            image_url: act.image_url || null,
          }
        })
        await createActivities(activitiesToSave)
      }
      
      // 4. Redirect to the trip page
      toast.success("Trip generated successfully!")
      router.push(`/dashboard/trips/${newTrip.id}`)
      
    } catch (error: any) {
      toast.error(error.message || "An error occurred")
      setIsGenerating(false)
    }
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 h-[80vh] gap-6">
        <div className="relative">
          <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full animate-pulse" />
          <div className="relative bg-background border p-6 rounded-2xl shadow-xl flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-primary animate-bounce" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="font-serif text-3xl font-bold">Curating your journey</h2>
          <p className="text-muted-foreground max-w-sm">
            Our AI is analyzing thousands of data points to create the perfect cinematic itinerary for you.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 md:p-8 max-w-3xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Design Your Journey</h1>
        <p className="text-muted-foreground text-lg">Tell us where you want to go, and let AI handle the rest.</p>
      </div>

      <Card className="border-muted/60 shadow-sm">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            <div className="space-y-4">
              <label className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> Destination
              </label>
              <Input 
                {...register("destination")} 
                placeholder="e.g., Kyoto, Japan or Amalfi Coast" 
                className="h-12 text-lg"
              />
              {errors.destination && <p className="text-sm text-destructive">{errors.destination.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" /> Start Date
                </label>
                <Input 
                  type="date"
                  {...register("start_date")} 
                  className="h-12"
                />
                {errors.start_date && <p className="text-sm text-destructive">{errors.start_date.message}</p>}
              </div>
              <div className="space-y-4">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" /> End Date
                </label>
                <Input 
                  type="date"
                  {...register("end_date")} 
                  className="h-12"
                />
                {errors.end_date && <p className="text-sm text-destructive">{errors.end_date.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-primary" /> Budget
                </label>
                <select 
                  {...register("budget")}
                  className="flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="budget">Budget-Friendly</option>
                  <option value="moderate">Moderate</option>
                  <option value="luxury">Luxury</option>
                  <option value="ultra-luxury">Ultra Luxury</option>
                </select>
              </div>
              
              <div className="space-y-4">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Compass className="w-4 h-4 text-primary" /> Travel Style
                </label>
                <select 
                  {...register("travel_style")}
                  className="flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="relaxed">Relaxed</option>
                  <option value="balanced">Balanced</option>
                  <option value="packed">Action Packed</option>
                  <option value="cultural">Cultural</option>
                  <option value="nature">Nature & Outdoors</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button type="submit" size="lg" className="w-full text-lg h-14 gap-2">
                <Sparkles className="w-5 h-5" /> Generate Itinerary <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
