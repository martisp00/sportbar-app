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

function toLocation(lat: FormDataEntryValue | null, lng: FormDataEntryValue | null): string | null {
  const latN = parseFloat(lat as string)
  const lngN = parseFloat(lng as string)
  if (!Number.isFinite(latN) || !Number.isFinite(lngN)) return null
  // PostGIS WKT geography: longitude comes first
  return `POINT(${lngN} ${latN})`
}

export async function upsertBar(
  prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const id = formData.get('id') as string | null
  const name = formData.get('name') as string
  const slugRaw = (formData.get('slug') as string).trim()

  const payload = {
    owner_id: user.id,
    name,
    slug: slugRaw ? toSlug(slugRaw) : toSlug(name),
    address: formData.get('address') as string,
    city: formData.get('city') as string,
    phone: (formData.get('phone') as string) || null,
    description: (formData.get('description') as string) || null,
    location: toLocation(formData.get('latitude'), formData.get('longitude')),
  }

  const { error } = id
    ? await supabase.from('bars').update(payload).eq('id', id).eq('owner_id', user.id)
    : await supabase.from('bars').insert(payload)

  if (error) return error.message

  revalidatePath('/dashboard/bar')
  return null
}
