import { getTripById } from "@/actions/trips"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Clock, Navigation } from "lucide-react"
import { format, parseISO } from "date-fns"
import { TripActions } from "@/components/features/TripActions"
import { ActivityActions } from "@/components/features/ActivityActions"

export default async function TripDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const trip = await getTripById(params.id)

  if (!trip) {
    notFound()
  }

  // Group activities by date
  const groupedActivities: Record<string, typeof trip.activities> = {}
  trip.activities.forEach(activity => {
    const dateStr = format(parseISO(activity.start_time), "yyyy-MM-dd")
    if (!groupedActivities[dateStr]) groupedActivities[dateStr] = []
    groupedActivities[dateStr].push(activity)
  })

  const sortedDates = Object.keys(groupedActivities).sort()

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {/* Dashboard Header / Hero */}
      <div className="relative w-full h-[300px] shrink-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
        <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-20 text-white">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium tracking-wide uppercase text-white/90">Itinerary</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-2">{trip.destination}</h1>
          <p className="text-white/80 font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {trip.days} Days Trip
          </p>
        </div>
      </div>

      <div className="p-6 md:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column - Itinerary Timeline */}
        <div className="xl:col-span-2 space-y-8">
          {sortedDates.map((dateStr, dayIndex) => (
            <div key={dateStr} className="space-y-6">
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="font-serif text-2xl font-bold text-primary">Day {dayIndex + 1}</h2>
                <span className="text-muted-foreground font-medium">{format(parseISO(dateStr), "EEEE, MMM do")}</span>
              </div>

              <div className="space-y-4">
                {groupedActivities[dateStr].map((activity, index) => (
                  <div key={activity.id} className="flex gap-4 group">
                    <div className="flex flex-col items-center mt-1">
                      <div className="w-3 h-3 rounded-full border-2 border-primary bg-background" />
                      {index !== groupedActivities[dateStr].length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-2" />
                      )}
                    </div>
                    <Card className="flex-1 shadow-sm border-muted transition-all hover:shadow-md">
                      <CardContent className="p-5 flex gap-5">
                        {activity.image_url && (
                          <img
                            src={activity.image_url}
                            alt={activity.title}
                            className="w-24 h-24 object-cover rounded-md hidden sm:block"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2 text-sm text-primary font-medium mb-1">
                              <Clock className="w-4 h-4" /> {format(parseISO(activity.start_time), "h:mm a")}
                              {activity.end_time && ` - ${format(parseISO(activity.end_time), "h:mm a")}`}
                            </div>
                            <ActivityActions activityId={activity.id} tripId={trip.id} />
                          </div>
                          <h3 className="font-semibold text-lg mb-1">{activity.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{activity.description}</p>
                          {activity.location && (
                            <Button variant="secondary" size="sm" className="h-8 gap-1 text-xs">
                              <Navigation className="w-3 h-3" /> {activity.location}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
                
                {groupedActivities[dateStr].length === 0 && (
                  <p className="text-muted-foreground text-sm py-4">No activities planned for this day.</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column - Trip Tools */}
        <div className="space-y-6">
          <Card className="border-muted shadow-sm">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base font-serif">Trip Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 flex flex-col gap-3">
              <TripActions tripId={trip.id} />
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
