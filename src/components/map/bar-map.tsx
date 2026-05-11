'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { PIN_SVG, PIN_ICON_OPTIONS } from './pin-icon'

const pinIcon = L.divIcon({ html: PIN_SVG, ...PIN_ICON_OPTIONS })

export type BarEvent = {
  id: string
  title: string
  starts_at: string
  sport_name: string
  sport_id: string
}

export type BarWithEvents = {
  id: string
  name: string
  city: string
  slug: string
  latitude: number
  longitude: number
  events: BarEvent[]
}

const SPAIN_CENTER: [number, number] = [40.4168, -3.7038]

export function BarMap({ bars }: { bars: BarWithEvents[] }) {
  return (
    <MapContainer
      center={SPAIN_CENTER}
      zoom={6}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {bars.map((bar) => (
        <Marker key={bar.id} position={[bar.latitude, bar.longitude]} icon={pinIcon}>
          <Popup minWidth={200}>
            <p className="font-semibold text-sm">{bar.name}</p>
            <p className="text-xs text-zinc-500 mb-2">{bar.city}</p>
            {bar.events.length === 0 ? (
              <p className="text-xs text-zinc-400">No upcoming events</p>
            ) : (
              <ul className="space-y-1">
                {bar.events.map((ev) => (
                  <li key={ev.id} className="text-xs">
                    <span className="font-medium">{ev.title}</span>
                    <br />
                    <span className="text-zinc-400">
                      {ev.sport_name} ·{' '}
                      {new Date(ev.starts_at).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
