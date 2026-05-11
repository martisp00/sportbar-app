'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function geocode(address: string, city: string): Promise<string | null> {
  const q = encodeURIComponent(`${address}, ${city}, Spain`)
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`,
    { headers: { 'User-Agent': 'sportbar-app/1.0' } }
  )
  if (!res.ok) return null
  const results: Array<{ lat: string; lon: string }> = await res.json()
  if (!results.length) return null
  const { lat, lon } = results[0]
  // PostGIS WKT: longitude first
  return `POINT(${lon} ${lat})`
}

export async function upsertBar(
  prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const address = formData.get('address') as string
  const city = formData.get('city') as string

  const locationWkt = await geocode(address, city)
  if (!locationWkt) {
    return 'Could not find coordinates for this address. Please check the address and city and try again.'
  }

  const id = (formData.get('id') as string) || null
  const name = formData.get('name') as string
  const slugRaw = (formData.get('slug') as string).trim()

  const { error } = await supabase.rpc('upsert_bar', {
    p_id:           id,
    p_owner_id:     user.id,
    p_name:         name,
    p_slug:         slugRaw ? toSlug(slugRaw) : toSlug(name),
    p_address:      address,
    p_city:         city,
    p_phone:        (formData.get('phone') as string) || null,
    p_description:  (formData.get('description') as string) || null,
    p_location_wkt: locationWkt,
  })

  if (error) return error.message

  revalidatePath('/dashboard/bar')
  return null
}
