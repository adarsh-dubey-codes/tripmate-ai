import { Map, Plane, Compass, Settings, LogOut, Sparkles } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { MobileNav } from "@/components/layout/MobileNav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  async function logout() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background hidden md:flex flex-col">
        <div className="p-6">
          <p className="text-sm font-medium text-muted-foreground mb-4">YOUR TRIPS</p>
          <nav className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 bg-primary/5 text-primary rounded-md font-medium">
              <Compass className="w-4 h-4" />
              Current Trip
            </Link>
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
              <Plane className="w-4 h-4" />
              Past Trips
            </Link>
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
              <Map className="w-4 h-4" />
              Destinations
            </Link>
          </nav>
        </div>
        
        <div className="p-6 mt-auto">
          <nav className="space-y-2 mb-6">
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </nav>
          
          <div className="flex items-center gap-3 px-3 py-3 border-t">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user.email}</p>
            </div>
          </div>
          
          <form action={logout} className="px-3 mt-2">
            <button type="submit" className="flex items-center gap-3 w-full py-2 text-sm text-destructive hover:text-destructive/80 font-medium transition-colors">
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {children}
      </main>
      
      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}
