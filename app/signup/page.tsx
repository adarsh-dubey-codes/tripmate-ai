import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin } from 'lucide-react'

export default async function SignupPage(props: { searchParams: Promise<{ message?: string }> }) {
  const searchParams = await props.searchParams
  const message = searchParams.message

  async function signup(formData: FormData) {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      redirect(`/signup?message=${encodeURIComponent(error.message)}`)
    }

    if (!data.session) {
      redirect('/signup?message=Check your email to confirm your account')
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full">
      <div className="flex flex-1 items-center justify-center p-8 lg:p-12 order-2 lg:order-1">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold tracking-tight">Create an Account</h1>
            <p className="text-muted-foreground mt-2">Join TripMate AI and start planning your next cinematic adventure.</p>
          </div>

          <form action={signup} className="space-y-6">
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
              Sign Up
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Log in
              </Link>
            </div>
          </form>
        </div>
      </div>
      <div className="hidden lg:flex w-1/2 relative bg-zinc-900 order-1 lg:order-2">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2783&auto=format&fit=crop"
          alt="Venice cinematic canal"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-10 right-10 z-20 text-white text-right">
          <div className="flex items-center justify-end gap-2 mb-2">
            <span className="text-sm font-medium tracking-wide uppercase text-white/80">Venice, Italy</span>
            <MapPin className="w-5 h-5 text-white/80" />
          </div>
          <h2 className="font-serif text-4xl font-bold">Unforgettable memories.</h2>
        </div>
      </div>
    </div>
  )
}
