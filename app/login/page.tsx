import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
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
      redirect('/login?message=Could not authenticate user')
    }

    redirect('/dashboard')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form action={login} className="flex flex-col gap-4 max-w-sm w-full p-4 border rounded-md shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <label className="flex flex-col gap-1">
          <span>Email</span>
          <input name="email" type="email" required className="border p-2 rounded" />
        </label>
        <label className="flex flex-col gap-1">
          <span>Password</span>
          <input name="password" type="password" required className="border p-2 rounded" />
        </label>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Login
        </button>
        <div className="text-sm mt-4 text-center">
          Don't have an account? <Link href="/signup" className="text-blue-600 hover:underline">Sign up</Link>
        </div>
      </form>
    </div>
  )
}
