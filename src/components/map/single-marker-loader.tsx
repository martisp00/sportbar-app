'use client'

import dynamic from 'next/dynamic'

const SingleMarkerMap = dynamic(
  () => import('./single-marker-map').then((m) => m.SingleMarkerMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
        <p className="text-sm text-zinc-400">Loading map…</p>
      </div>
    ),
  }
)

export function SingleMarkerLoader({
  latitude,
  longitude,
}: {
  latitude: number
  longitude: number
}) {
  return <SingleMarkerMap latitude={latitude} longitude={longitude} />
}
