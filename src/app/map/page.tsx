import { createClient } from '@/lib/supabase/server'
import { PublicNavbar } from '@/components/public-navbar'
import { MapWithFilters } from '@/components/map/map-with-filters'
import type { BarWithEvents } from '@/components/map/bar-map'

export default async function MapPage() {
  const supabase = await createClient()

  const [{ data: barsData }, { data: sportsData }] = await Promise.all([
    supabase.rpc('get_bars_with_events'),
    supabase.from('sports_catalog').select('id, name').order('name'),
  ])

  const bars = (barsData as BarWithEvents[] | null) ?? []
  const sports = (sportsData ?? []) as Array<{ id: string; name: string }>

  return (
    <div className="flex flex-col h-screen">
      <PublicNavbar />
      <div className="flex-1 min-h-0">
        <MapWithFilters bars={bars} sports={sports} />
      </div>
    </div>
  )
}
