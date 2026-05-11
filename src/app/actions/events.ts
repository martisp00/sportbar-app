'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createEvent(
  prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const barId = formData.get('bar_id') as string

  const { data: bar } = await supabase
    .from('bars')
    .select('id')
    .eq('id', barId)
    .eq('owner_id', user.id)
    .single()

  if (!bar) return 'Bar not found or access denied'

  const { error } = await supabase.from('sports_events').insert({
    bar_id: barId,
    sport_id: formData.get('sport_id') as string,
    title: formData.get('title') as string,
    starts_at: formData.get('starts_at') as string,
    ends_at: (formData.get('ends_at') as string) || null,
    screen_count: Number(formData.get('screen_count')) || 1,
    notes: (formData.get('notes') as string) || null,
  })

  if (error) return error.message

  revalidatePath('/dashboard/events')
  redirect('/dashboard/events')
}

export async function deleteEvent(
  _: unknown,
  formData: FormData
): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const id = formData.get('id') as string

  const { data: bars } = await supabase
    .from('bars')
    .select('id')
    .eq('owner_id', user.id)

  if (!bars?.length) return

  await supabase
    .from('sports_events')
    .delete()
    .eq('id', id)
    .in('bar_id', bars.map((b) => b.id))

  revalidatePath('/dashboard/events')
}
