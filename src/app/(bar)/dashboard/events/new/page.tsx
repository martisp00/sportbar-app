import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EventForm } from '@/components/dashboard/event-form'

export default async function NewEventPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: bar } = await supabase
    .from('bars')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (!bar) redirect('/dashboard/bar')

  const { data: sports } = await supabase
    .from('sports_catalog')
    .select('*')
    .order('name')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Add event</h1>
        <p className="text-sm text-zinc-500 mt-1">Schedule a new sports event at your bar.</p>
      </div>
      <EventForm barId={bar.id} sports={sports ?? []} />
    </div>
  )
}
