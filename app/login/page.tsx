import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin } from 'lucide-react'

export default async function LoginPage(props: { searchParams: Promise<{ message?: string }> }) {
  const searchParams = await props.searchParams
  const message = searchParams.message

  async function login(formData: FormData) {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      redirect(`/login?message=${encodeURIComponent(error.message)}`)
    }

    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full">
      <div className="hidden lg:flex w-1/2 relative bg-zinc-900">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2940&auto=format&fit=crop"
          alt="Paris cinematic street"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-10 left-10 z-20 text-white">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-white/80" />
            <span className="text-sm font-medium tracking-wide uppercase text-white/80">Paris, France</span>
          </div>
          <h2 className="font-serif text-4xl font-bold">Your journey awaits.</h2>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">Enter your credentials to access your itineraries.</p>
          </div>

          <form action={login} className="space-y-6">
            {message && (
              <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm text-center">
                {message}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Email
                </label>
                <Input name="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Password
                </label>
                <Input name="password" type="password" required />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Log In
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/signup" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
