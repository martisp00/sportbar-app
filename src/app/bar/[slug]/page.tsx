import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PublicNavbar } from '@/components/public-navbar'
import { SingleMarkerLoader } from '@/components/map/single-marker-loader'

export default async function BarPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: bar } = await supabase
    .from('bars')
    .select(
      'id, name, slug, address, city, description, phone, ST_Y(location::geometry) as latitude, ST_X(location::geometry) as longitude'
    )
    .eq('slug', slug)
    .single()

  if (!bar) notFound()

  const barTyped = bar as typeof bar & { latitude: number | null; longitude: number | null }

  const { data: events } = await supabase
    .from('sports_events')
    .select('id, title, starts_at, ends_at, screen_count, sports_catalog(name)')
    .eq('bar_id', barTyped.id)
    .gte('starts_at', new Date().toISOString())
    .order('starts_at')

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8 space-y-8">
        <Link
          href="/map"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-foreground transition-colors"
        >
          ← Back to map
        </Link>

        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{barTyped.name}</h1>
          <p className="text-sm text-zinc-500">{barTyped.address}, {barTyped.city}</p>
          {barTyped.phone && (
            <p className="text-sm text-zinc-500">{barTyped.phone}</p>
          )}
          {barTyped.description && (
            <p className="text-sm text-zinc-400 pt-1">{barTyped.description}</p>
          )}
        </div>

        {barTyped.latitude != null && barTyped.longitude != null && (
          <div className="h-64 rounded-xl overflow-hidden border border-black/10 dark:border-white/10">
            <SingleMarkerLoader
              latitude={barTyped.latitude}
              longitude={barTyped.longitude}
            />
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-base font-semibold">Upcoming events</h2>
          {!events?.length ? (
            <p className="text-sm text-zinc-500">No upcoming events scheduled.</p>
          ) : (
            <ul className="divide-y divide-black/10 dark:divide-white/10">
              {events.map((ev) => (
                <li key={ev.id} className="py-3 space-y-0.5">
                  <p className="text-sm font-medium">{ev.title}</p>
                  <p className="text-xs text-zinc-500">
                    {(ev.sports_catalog as { name: string } | null)?.name}
                    {' · '}
                    {new Date(ev.starts_at).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                    {ev.screen_count != null && ` · ${ev.screen_count} screen${ev.screen_count !== 1 ? 's' : ''}`}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}
