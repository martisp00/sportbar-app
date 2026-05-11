'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { PIN_SVG, PIN_ICON_OPTIONS } from './pin-icon'

const pinIcon = L.divIcon({ html: PIN_SVG, ...PIN_ICON_OPTIONS })

export function SingleMarkerMap({
  latitude,
  longitude,
}: {
  latitude: number
  longitude: number
}) {
  const position: [number, number] = [latitude, longitude]

  return (
    <MapContainer
      center={position}
      zoom={15}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
      zoomControl
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} icon={pinIcon} />
    </MapContainer>
  )
}
