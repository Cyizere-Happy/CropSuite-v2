import type { History } from "@/lib/environment/types";
import { useLanguage } from "./Language";

export function ClimateContext({ history, plantingMonth }: { history: History; plantingMonth: string }) {
  const { language, text } = useLanguage();
  const month = Number(plantingMonth.split("-")[1]);
  const climate = history.monthly?.find((item) => item.month === month);
  if (!climate || !history.periodStart || !history.periodEnd) return null;
  const name = new Intl.DateTimeFormat(language === "rw" ? "rw" : "en", { month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2020, month - 1, 1)));
  return <div className="cs-guide-data-note">
    <strong>{text("What past seasons tell us", "Ibyo ibihe byashize bitwereka")}</strong>
    <p>{text(`In ${name}, NASA POWER estimated an average of ${climate.meanRainMm} mm of rain across ${history.periodStart}–${history.periodEnd}. The amount ranged from ${climate.minRainMm} to ${climate.maxRainMm} mm.`, `Muri ${name}, NASA POWER yagereranyije impuzandengo y’imvura ya mm ${climate.meanRainMm} kuva ${history.periodStart} kugeza ${history.periodEnd}. Yagiye iva kuri mm ${climate.minRainMm} ikagera kuri mm ${climate.maxRainMm}.`)}</p>
    <p>{text(`The average temperature was ${climate.meanTempC}°C. These are past estimates for a broad area, not a forecast for your planting month or a measurement of your field.`, `Impuzandengo y’ubushyuhe yari ${climate.meanTempC}°C. Aya ni amakuru yagereranyijwe mu gihe cyashize ku gace kanini, si iteganyagihe ry’ukwezi uzateramo cyangwa ibipimo by’umurima wawe.`)}</p>
    <p>{text("Rainfall varied between these years. Use this as a reminder to plan for different conditions, and check local advice closer to planting.", "Ingano y’imvura yagiye ihinduka muri iyi myaka. Teganya uko wakwitwara mu bihe bitandukanye, kandi ubaze abajyanama bo hafi igihe cyo guhinga cyegereje.")}</p>
    {climate.meanSolarMjM2Day !== undefined && <details><summary>{text("More climate details", "Andi makuru y’ikirere")}</summary><small>{text("Average daily solar energy", "Impuzandengo y’ingufu z’izuba ku munsi")}: {climate.meanSolarMjM2Day} MJ/m²/day · NASA POWER</small></details>}
  </div>;
}
