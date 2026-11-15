import type { Forecast } from "@/lib/environment/types";
import { useLanguage } from "./Language";

export function WeatherSnapshot({ forecast, cache }: { forecast: Forecast; cache?: string }) {
  const { text } = useLanguage();
  if (forecast.status !== "available") return <p>{text(forecast.message, "Iteganyagihe ntiriboneka ubu. Ongera ugerageze nyuma.")}</p>;
  return <div className="cs-weather-snapshot">
    <p>{text("Meteomatics forecast for your selected location:", "Iteganyagihe rya Meteomatics ry’aho wahisemo:")}</p>
    <dl>
      <div><dt>{text("Rainfall over 48 hours", "Imvura mu masaha 48")}</dt><dd>{forecast.rainMm} mm</dd></div>
      <div><dt>{text("Average temperature", "Impuzandengo y’ubushyuhe")}</dt><dd>{forecast.meanTempC}°C</dd></div>
      <div><dt>{text("Highest wind speed", "Umuvuduko mwinshi w’umuyaga")}</dt><dd>{forecast.maxWindMs} m/s ({Math.round(forecast.maxWindMs! * 3.6)} km/h)</dd></div>
    </dl>
    <small>{text("Valid", "Bireba igihe kuva")} {new Date(forecast.start!).toLocaleString()} – {new Date(forecast.end!).toLocaleString()} ({text("your device’s time", "igihe cyo ku gikoresho cyawe")}). {text("Retrieved", "Byabonetse")} {new Date(forecast.retrievedAt!).toLocaleString()}{cache ? ` · ${cache === "cached" ? text("cached", "byari bibitswe") : text("live", "bishya")}` : ""}.</small>
    <small>{text("Rainfall is the forecast amount, not a guarantee that crops will receive that water.", "Ingano y’imvura ni iteganyagihe; ntibivuze ko ayo mazi yose azagera ku bihingwa.")}</small>
  </div>;
}
