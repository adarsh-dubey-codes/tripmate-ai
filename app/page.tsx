import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* We would use next/image here with a real asset, but a gradient placeholder works for the structure */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2940&auto=format&fit=crop"
            alt="Cinematic landscape of a mountain lake"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 container mx-auto px-4 md:px-8 text-center text-white">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 drop-shadow-lg text-balance">
            Discover the World,<br /> Curated for You.
          </h1>
          <p className="font-sans text-lg md:text-2xl font-light max-w-2xl mx-auto mb-10 text-white/90 drop-shadow">
            Experience the ultimate journey with TripMate AI. Cinematic itineraries, intelligent recommendations, and unforgettable memories.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-6 text-lg" asChild>
              <Link href="/signup">Start Your Journey</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white/40 bg-black/20 hover:bg-white/20 backdrop-blur rounded-full px-8 py-6 text-lg" asChild>
              <Link href="/login">Explore Destinations</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Elevate Your Travel</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our AI crafts personalized, luxurious travel experiences that match your exact preferences and style.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center p-6 glass rounded-2xl">
              <div className="h-16 w-16 bg-primary/5 text-primary rounded-full flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-semibold mb-3">Immersive Destinations</h3>
              <p className="text-muted-foreground leading-relaxed">
                Explore hand-picked locations that offer the most breathtaking views and exclusive cultural experiences.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center p-6 glass rounded-2xl">
              <div className="h-16 w-16 bg-primary/5 text-primary rounded-full flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-semibold mb-3">AI Recommendations</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our advanced AI learns your tastes to recommend hidden gems, luxury stays, and unforgettable dining.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center p-6 glass rounded-2xl">
              <div className="h-16 w-16 bg-primary/5 text-primary rounded-full flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-semibold mb-3">Cinematic Itineraries</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your schedule, visualized beautifully. Seamlessly follow your personalized timeline of events.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
