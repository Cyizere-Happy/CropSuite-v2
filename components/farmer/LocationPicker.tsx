"use client";

import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { useEffect } from "react";

export type MapFocus = { latitude: number; longitude: number; zoom: number; revision: number } | null;
function LocationEvents({ point, focus, onChange }: { point: [number, number] | null; focus: MapFocus; onChange: (lat: number, lon: number) => void }) {
  const map = useMap();
  useMapEvents({ click: (event) => onChange(event.latlng.lat, event.latlng.lng) });
  const latitude = point?.[0];
  const longitude = point?.[1];
  useEffect(() => { if (latitude !== undefined && longitude !== undefined) map.setView([latitude, longitude], Math.max(map.getZoom(), 11)); }, [map, latitude, longitude]);
  useEffect(() => { if (focus) map.setView([focus.latitude, focus.longitude], focus.zoom); }, [map, focus]);
  return point ? <CircleMarker center={point} radius={10} pathOptions={{ color: "white", fillColor: "#245a46", fillOpacity: 1, weight: 3 }} /> : null;
}

export default function LocationPicker({ pin, focus, onChange }: { pin: string; focus: MapFocus; onChange: (lat: number, lon: number) => void }) {
  const parts = pin.split(",").map(Number);
  const point: [number, number] | null = pin && parts.length === 2 && parts.every(Number.isFinite) ? [parts[0], parts[1]] : null;
  return <MapContainer center={point || [-1.94, 29.87]} zoom={point ? 11 : 8} scrollWheelZoom={false} className="cs-guide-map" aria-label="World map. Tap to choose a farm location.">
    <TileLayer attribution={'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'} url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <LocationEvents point={point} focus={focus} onChange={onChange} />
  </MapContainer>;
}
