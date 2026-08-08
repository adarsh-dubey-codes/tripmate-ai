"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { Trip, Activity } from "@/utils/types_db"

export async function createTrip(tripData: Omit<Trip, 'id' | 'user_id' | 'created_at'>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from('trips')
    .insert([
      { ...tripData, user_id: user.id }
    ])
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')
  return data as Trip
}

export async function getTrips() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return []
  return data as Trip[]
}

export async function getTripById(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('trips')
    .select('*, activities(*)')
    .eq('id', id)
    .single()

  if (error) return null

  // Sort activities by start_time
  if (data.activities) {
    data.activities.sort((a: Activity, b: Activity) => 
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    )
  }

  return data as Trip & { activities: Activity[] }
}

export async function deleteTrip(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('trips')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  
  revalidatePath('/dashboard')
}

export async function createActivity(activityData: Omit<Activity, 'id' | 'created_at'>) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('activities')
    .insert([activityData])
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath(`/dashboard/trips/${activityData.trip_id}`)
  return data as Activity
}

export async function createActivities(activitiesData: Omit<Activity, 'id' | 'created_at'>[]) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('activities')
    .insert(activitiesData)
    .select()

  if (error) throw new Error(error.message)

  if (activitiesData.length > 0) {
    revalidatePath(`/dashboard/trips/${activitiesData[0].trip_id}`)
  }
  return data as Activity[]
}

export async function deleteActivity(id: string, tripId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  
  revalidatePath(`/dashboard/trips/${tripId}`)
}

