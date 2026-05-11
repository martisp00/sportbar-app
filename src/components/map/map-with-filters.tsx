'use client'

import { useMemo, useState } from 'react'
import { MapLoader } from './map-loader'
import type { BarWithEvents } from './bar-map'

type Sport = { id: string; name: string }

function FilterBtn({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
        active
          ? 'bg-foreground text-background'
          : 'border border-black/10 dark:border-white/10 text-zinc-500 hover:text-foreground dark:hover:text-foreground'
      }`}
    >
      {children}
    </button>
  )
}

const CITIES = ['Tarragona', 'Barcelona']

export function MapWithFilters({
  bars,
  sports,
}: {
  bars: BarWithEvents[]
  sports: Sport[]
}) {
  const [sportId, setSportId] = useState('all')
  const [city, setCity] = useState('all')
  const [soloHoy, setSoloHoy] = useState(false)

  const filtered = useMemo(() => {
    const today = new Date().toDateString()
    return bars
      .filter((bar) => city === 'all' || bar.city === city)
      .filter((bar) =>
        sportId === 'all' ? true : bar.events.some((e) => e.sport_id === sportId)
      )
      .filter((bar) =>
        !soloHoy
          ? true
          : bar.events.some((e) => new Date(e.starts_at).toDateString() === today)
      )
      .map((bar) => ({
        ...bar,
        events: bar.events.filter((e) => {
          if (sportId !== 'all' && e.sport_id !== sportId) return false
          if (soloHoy && new Date(e.starts_at).toDateString() !== today) return false
          return true
        }),
      }))
  }, [bars, sportId, city, soloHoy])

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 border-b border-black/10 dark:border-white/10 bg-background z-10">
        <div className="flex flex-wrap gap-1.5">
          <FilterBtn active={sportId === 'all'} onClick={() => setSportId('all')}>
            Todos
          </FilterBtn>
          {sports.map((s) => (
            <FilterBtn key={s.id} active={sportId === s.id} onClick={() => setSportId(s.id)}>
              {s.name}
            </FilterBtn>
          ))}
        </div>

        <div className="h-4 w-px bg-black/10 dark:bg-white/10 hidden sm:block" />

        <div className="flex flex-wrap gap-1.5">
          <FilterBtn active={city === 'all'} onClick={() => setCity('all')}>
            Todas
          </FilterBtn>
          {CITIES.map((c) => (
            <FilterBtn key={c} active={city === c} onClick={() => setCity(c)}>
              {c}
            </FilterBtn>
          ))}
        </div>

        <div className="h-4 w-px bg-black/10 dark:bg-white/10 hidden sm:block" />

        <FilterBtn active={soloHoy} onClick={() => setSoloHoy((v) => !v)}>
          Solo hoy
        </FilterBtn>
      </div>

      <div className="flex-1 min-h-0">
        <MapLoader bars={filtered} />
      </div>
    </div>
  )
}
