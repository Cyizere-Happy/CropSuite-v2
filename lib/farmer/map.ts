import { isPin } from "./validation";

export function mapUrl(pin: string) {
  const point = isPin(pin) ? pin.split(",").map(Number) : null;
  const [lat, lon] = point || [-1.9021, 30.50729];
  const delta = point ? 0.04 : 0.16;
  const params = new URLSearchParams({ bbox: `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`, layer: "mapnik" });
  if (point) params.set("marker", `${lat},${lon}`);
  return `https://www.openstreetmap.org/export/embed.html?${params}`;
}
