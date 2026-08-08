import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default function SignupPage() {
  async function signup(formData: FormData) {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      redirect('/signup?message=Could not authenticate user')
    }

    redirect('/dashboard')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form action={signup} className="flex flex-col gap-4 max-w-sm w-full p-4 border rounded-md shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        <label className="flex flex-col gap-1">
          <span>Email</span>
          <input name="email" type="email" required className="border p-2 rounded" />
        </label>
        <label className="flex flex-col gap-1">
          <span>Password</span>
          <input name="password" type="password" required className="border p-2 rounded" />
        </label>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Sign Up
        </button>
      </form>
    </div>
  )
}
