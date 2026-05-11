import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { deleteEvent } from '@/app/actions/events'

export default async function EventsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: bar } = await supabase
    .from('bars')
    .select('id, name')
    .eq('owner_id', user.id)
    .single()

  if (!bar) redirect('/dashboard/bar')

  const { data: events } = await supabase
    .from('sports_events')
    .select('*, sports_catalog(name)')
    .eq('bar_id', bar.id)
    .order('starts_at', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Events</h1>
          <p className="text-sm text-zinc-500 mt-1">{bar.name}</p>
        </div>
        <Link
          href="/dashboard/events/new"
          className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80"
        >
          + Add event
        </Link>
      </div>

      {!events?.length ? (
        <p className="text-sm text-zinc-500">No events yet.</p>
      ) : (
        <ul className="divide-y divide-black/10 dark:divide-white/10">
          {events.map((event) => (
            <li key={event.id} className="flex items-start justify-between gap-4 py-4">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{event.title}</p>
                <p className="text-xs text-zinc-500">
                  {(event.sports_catalog as { name: string } | null)?.name} ·{' '}
                  {new Date(event.starts_at).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                  {event.is_recurring && ' · recurring'}
                </p>
              </div>
              <form action={deleteEvent}>
                <input type="hidden" name="id" value={event.id} />
                <button
                  type="submit"
                  className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
                >
                  Delete
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
