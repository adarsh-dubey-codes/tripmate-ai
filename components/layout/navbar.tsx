import Link from "next/link"
import { createClient } from "@/utils/supabase/server"

export async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <nav className="w-full h-16 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container h-full mx-auto flex items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-xl font-bold tracking-tight">TripMate<span className="text-muted-foreground font-sans text-lg font-normal">.ai</span></span>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary/80 transition-colors">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Log In
              </Link>
              <Link href="/signup" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
