// Reason codes are independent of presentation, so a future locale can add
// translations without changing the evidence that produced an explanation.
export type ReasonCode = "previous_unknown" | "same_family" | "different_family" | "previous_recorded" | "forecast_available" | "forecast_unavailable";
type Locale = "en" | "rw";
const templates: Record<ReasonCode, Record<Locale, string>> = {
  previous_unknown: { en: "Previous crop is unknown.", rw: "Igihingwa cyabanje ntikizwi." },
  same_family: { en: "The previous crop is from the same crop family; consider rotation and local pest history.", rw: "Igihingwa cyabanje kiri mu muryango umwe; tekereza guhinduranya ibihingwa no kureba udukoko n’indwara." },
  different_family: { en: "A different crop family is one rotation option to discuss locally.", rw: "Igihingwa cyo mu wundi muryango ni kimwe mu byo waganiraho n’umujyanama." },
  previous_recorded: { en: "Previous crop recorded; check its rotation locally.", rw: "Igihingwa cyabanje cyabitswe; ganira n’umujyanama ku gikurikiraho." },
  forecast_available: { en: "The 48-hour forecast contains {rain} mm of rain; this is not a seasonal prediction.", rw: "Mu masaha 48 ateganyijwe imvura ya mm {rain}; si iteganyagihe ry’igihembwe." },
  forecast_unavailable: { en: "A forecast is not available for this assessment.", rw: "Nta teganyagihe ribonetse kuri iri suzuma." },
};
export function explainReason(code: ReasonCode, language: Locale, values: Record<string, string | number> = {}) {
  return (templates[code][language] || templates[code].en).replace(/\{(\w+)\}/g, (match, key: string) => values[key] === undefined ? match : String(values[key]));
}
