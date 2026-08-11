'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin } from 'lucide-react'

function SignupFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlMessage = searchParams.get('message')

  const [errorMsg, setErrorMsg] = useState<string | null>(urlMessage)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [debugTrace, setDebugTrace] = useState<any>(null) // ADDED TRACING

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)
    setDebugTrace(null) // CLEAR TRACE

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const supabase = createClient()

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      })

      // CAPTURE TRACE
      const traceData = {
        timestamp: new Date().toISOString(),
        email,
        responseData: data,
        responseError: error
      };
      setDebugTrace(traceData);
      console.log("--- SIGNUP TRACE ---", traceData);

      if (error) {
        setErrorMsg(error.message)
        setIsLoading(false)
        return
      }

      // Detect fake success returned by Supabase when Prevent Email Enumeration is ON
      // and the email rate limit is exceeded, or email is already registered.
      // GoTrue deletes the auth.users record but leaves the public.profiles record orphaned.
      if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
        setErrorMsg('Signup failed. This email may be rate-limited by the email provider, or already registered.')
        setIsLoading(false)
        return
      }

      if (!data.session) {
        setSuccessMsg('Check your email to confirm your account')
        setIsLoading(false)
        return
      }

      router.refresh()
      router.push('/dashboard')
    } catch (err: any) {
      setDebugTrace({
        timestamp: new Date().toISOString(),
        email,
        caughtException: err.toString(),
        stack: err.stack
      });
      setErrorMsg(err.message || 'An unexpected error occurred')
      setIsLoading(false)
    }
  }

  const displayMessage = errorMsg || successMsg
  const isError = !!errorMsg

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col lg:flex-row">
      <div className="flex flex-1 items-center justify-center p-8 lg:p-12 order-2 lg:order-1 flex-col">
        {debugTrace && (
          <div className="w-full max-w-2xl bg-zinc-950 text-green-400 p-4 rounded-md mb-8 overflow-auto text-xs font-mono text-left">
            <h3 className="text-white mb-2 font-bold">SIGNUP TRACE:</h3>
            <pre>{JSON.stringify(debugTrace, null, 2)}</pre>
          </div>
        )}
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold tracking-tight">Create an Account</h1>
            <p className="text-muted-foreground mt-2">Join TripMate AI and start planning your next cinematic adventure.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            {displayMessage && (
              <div className={`p-3 rounded-md text-sm text-center ${isError ? 'bg-destructive/15 text-destructive' : 'bg-green-500/15 text-green-600'}`}>
                {displayMessage}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Email
                </label>
                <Input name="email" type="email" placeholder="m@example.com" required disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Password
                </label>
                <Input name="password" type="password" required disabled={isLoading} />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Signing up...' : 'Sign Up'}
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

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <SignupFormContent />
    </Suspense>
  )
}
