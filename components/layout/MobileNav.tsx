"use client"

import { Map, Plane, Compass, Settings, LogOut, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Button size="icon" className="rounded-full h-14 w-14 shadow-lg" onClick={() => setIsOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className="md:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-y-0 right-0 w-3/4 max-w-sm bg-background border-l shadow-xl p-6 flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <span className="font-serif text-xl font-bold">Menu</span>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <nav className="space-y-4 flex-1">
          <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-3 bg-primary/5 text-primary rounded-md font-medium text-lg">
            <Compass className="w-5 h-5" /> Current Trip
          </Link>
          <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-3 text-muted-foreground hover:bg-muted rounded-md font-medium text-lg">
            <Plane className="w-5 h-5" /> Past Trips
          </Link>
          <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-3 text-muted-foreground hover:bg-muted rounded-md font-medium text-lg">
            <Map className="w-5 h-5" /> Destinations
          </Link>
        </nav>
      </div>
    </div>
  )
}
