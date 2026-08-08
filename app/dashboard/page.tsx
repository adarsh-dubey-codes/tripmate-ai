import { getTrips } from "@/actions/trips"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Plus, Compass } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default async function DashboardPage() {
  const trips = await getTrips()

  return (
    <div className="flex flex-col flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold">My Trips</h1>
          <p className="text-muted-foreground">Manage your cinematic itineraries.</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/dashboard/create">
            <Plus className="w-4 h-4" /> Create Trip
          </Link>
        </Button>
      </div>

      {trips.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 h-[60vh] text-center border rounded-2xl border-dashed">
          <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-4">
            <Compass className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-serif text-2xl font-bold mb-2">No trips planned yet</h2>
          <p className="text-muted-foreground max-w-sm mb-6">
            Let our AI craft the perfect cinematic itinerary for your next adventure.
          </p>
          <Button asChild size="lg">
            <Link href="/dashboard/create">Design Your First Journey</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Link href={`/dashboard/trips/${trip.id}`} key={trip.id} className="group">
              <Card className="overflow-hidden h-full transition-all hover:shadow-md border-muted">
                <div className="h-48 w-full overflow-hidden relative">
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-serif text-xl font-bold mb-1 truncate">{trip.destination}</h3>
                    <div className="flex items-center gap-2 text-sm text-white/80 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {trip.days} Days Trip
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="capitalize">{trip.interests} Pace</span>
                    <span className="capitalize">
                      {trip.budget === 1 ? 'Budget' : trip.budget === 2 ? 'Moderate' : trip.budget === 3 ? 'Luxury' : trip.budget === 4 ? 'Ultra Luxury' : 'Unknown'} Budget
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
