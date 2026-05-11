'use client'

import dynamic from 'next/dynamic'
import type { BarWithEvents } from './bar-map'

// Leaflet requires window — disable SSR for the entire map component
const BarMap = dynamic(() => import('./bar-map').then((m) => m.BarMap), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
      <p className="text-sm text-zinc-400">Loading map…</p>
    </div>
  ),
})

export function MapLoader({ bars }: { bars: BarWithEvents[] }) {
  return <BarMap bars={bars} />
}
