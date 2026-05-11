import { createClient } from '@/lib/supabase/server'
import { PublicNavbar } from '@/components/public-navbar'
import { MapLoader } from '@/components/map/map-loader'
import type { BarWithEvents } from '@/components/map/bar-map'

export default async function MapPage() {
  const supabase = await createClient()

  const { data: barsRaw, error: barsError } = await supabase
    .rpc('get_bars_with_coordinates')

  console.log('[map] bars:', barsRaw, 'error:', barsError)

  const bars = (barsRaw ?? []) as Array<{
    id: string
    name: string
    city: string
    slug: string
    latitude: number
    longitude: number
  }>

  let eventsRaw: Array<{
    id: string
    bar_id: string
    title: string
    starts_at: string
  }> = []

  if (bars.length) {
    const { data } = await supabase
      .from('sports_events')
      .select('id, bar_id, title, starts_at')
      .in('bar_id', bars.map((b) => b.id))
      .gte('starts_at', new Date().toISOString())
      .order('starts_at')

    eventsRaw = data ?? []
  }

  // Group events by bar_id
  const eventsByBar = eventsRaw.reduce<Record<string, BarWithEvents['events']>>(
    (acc, ev) => {
      if (!acc[ev.bar_id]) acc[ev.bar_id] = []
      acc[ev.bar_id].push({ id: ev.id, title: ev.title, starts_at: ev.starts_at })
      return acc
    },
    {}
  )

  const barsWithEvents: BarWithEvents[] = bars.map((bar) => ({
    ...bar,
    events: eventsByBar[bar.id] ?? [],
  }))

  return (
    <div className="flex flex-col h-screen">
      <PublicNavbar />
      <div className="flex-1 min-h-0">
        <MapLoader bars={barsWithEvents} />
      </div>
    </div>
  )
}
