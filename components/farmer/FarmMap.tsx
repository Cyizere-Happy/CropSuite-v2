"use client";

import { mapUrl } from "@/lib/farmer/map";

export default function FarmMap({ pin }: { pin: string }) {
  return <div className="cs-journey-map-wrap"><iframe className="cs-journey-map" title="Farm location map" loading="lazy" src={mapUrl(pin)} />
    <p className="cs-journey-note">{pin ? "Your saved location point is shown. It is not a field boundary." : "Map centered on Kayonza. Use your device location above to show your farm’s location point."} Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>.</p></div>;
}
