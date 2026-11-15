"use client";

import { ClimateContext } from "./ClimateContext";
import { CropSelectionScreen } from "./CropSelectionScreen";
import { FarmAdvice } from "./FarmAdvice";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CropSuiteLogo } from "@/components/brand/CropSuiteLogo";
import { cropNames, crops, toggleValue } from "@/lib/farmer/model";
import { completeGuidedPlan, startDemo, updateDraft, useFarmerSession } from "@/lib/farmer/store";
import { isPin } from "@/lib/farmer/validation";
import type { Environment } from "@/lib/environment/types";
import { cropConsiderations } from "@/lib/farmer/assessment";
import type { RotationAnalysis } from "@/lib/farmer/rotationEngine";
import { BotanicalArt } from "./BotanicalArt";
import { RotationResults } from "./RotationResults";
import { hasSavedAnalysis, saveAnalysis } from "@/lib/farmer/savedPlan";
import { WeatherSnapshot } from "./WeatherSnapshot";
import { supportedCropIds } from "@/lib/farmer/supportedCrops";
import countries from "@/lib/farmer/countries.json";
import rwandaDistricts from "@/lib/farmer/rwandaDistricts.json";
import type { MapFocus } from "./LocationPicker";
import { cropLabel, LanguageSwitch, useLanguage } from "./Language";

const LocationPicker = dynamic(() => import("./LocationPicker"), { ssr: false, loading: () => <p>Loading map…</p> });
const featured = ["maize", "common-beans", "sorghum", "soybeans", "groundnuts", "cassava", "sweet-potatoes", "irish-potatoes", "rice", "tomatoes"];
const headings = ["What would you like to plant?", "Where is your farm?", "What did you grow last season?", "When do you plan to plant?", "Can you water your crops?"];
const descriptions = ["Choose a crop, or let us help.", "We’ll check the conditions there.", "Choose all that apply.", "Choose the time that works for you.", "Tell us how you get water."];
const headingsRw = ["Ni iki wifuza guhinga?", "Umurima wawe uherereye he?", "Ni iki wahinze ubushize?", "Uteganya guhinga ryari?", "Ushobora kuvomera imyaka yawe?"];
const descriptionsRw = ["Hitamo igihingwa, cyangwa tugufashe guhitamo.", "Turareba imiterere y’aho hantu.", "Hitamo byose wahinze.", "Hitamo igihe kigukwiriye.", "Tubwire uko ubona amazi."];
const errorsRw: Record<string, string> = {
  "Choose a crop or ask for help.": "Hitamo igihingwa cyangwa usabe ubufasha.",
  "Choose a crop with an available FAO baseline, or select help me choose.": "Hitamo igihingwa gifite amakuru ya FAO, cyangwa usabe ubufasha.",
  "Choose a location on the map or enter your district.": "Hitamo aho umurima uri ku ikarita cyangwa wandike akarere.",
  "Choose an answer to continue.": "Hitamo igisubizo kugira ngo ukomeze.",
  "Choose when you plan to plant.": "Hitamo igihe uteganya guhinga.",
  "Choose this month or a future month.": "Hitamo uku kwezi cyangwa ukwezi kuzakurikiraho.",
  "Choose how you water your crops.": "Hitamo uko imyaka yawe ibona amazi.",
  "Please choose a valid location on the map.": "Hitamo ahantu hemewe ku ikarita.",
  "Enter a valid latitude and longitude separated by a comma.": "Andika latitude na longitude bitandukanyijwe n’akatuzo.",
  "Location is unavailable. Choose a point on the map instead.": "Aho uri ntihabonetse. Hitamo umurima ku ikarita.",
  "We couldn’t get your location. Choose a point on the map instead.": "Ntabwo twabonye aho uri. Hitamo umurima ku ikarita.",
  "Your plan could not be saved in this browser. Please check your browser storage.": "Gahunda ntiyabitswe muri iyi porogaramu. Reba niba yemera kubika amakuru.",
};

function monthString(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; }

export function FarmerGuide({ initialStep = 0 }: { initialStep?: number }) {
  const router = useRouter();
  const { language, text } = useLanguage();
  const session = useFarmerSession();
  const [step, setStep] = useState(initialStep);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [locating, setLocating] = useState(false);
  const [environment, setEnvironment] = useState<(Environment & { cache: string; rotation: RotationAnalysis | null }) | null>(null);
  const [loading, setLoading] = useState(initialStep === 5);
  const [requested, setRequested] = useState(0);
  const [mapFocus, setMapFocus] = useState<MapFocus>(null);
  const [coordinateText, setCoordinateText] = useState("");
  useEffect(() => { if (session && !session.demo) startDemo(); }, [session]);
  const pin = session?.draft.location.pin || "";
  const water = session?.draft.guide.water || "";
  const selectedKey = session ? cropNames(session.draft.selection).join("|") : "";
  const previousKey = session?.draft.history.recent || "";
  const plantingMonth = session?.draft.planting.month || "";
  const allowAlternatives = session?.draft.selection.suggestions === "I'm open to suggestions";
  useEffect(() => {
    if (step !== 5 || !isPin(pin)) return;
    const controller = new AbortController();
    const [lat, lon] = pin.split(",").map(Number);
    fetch("/api/environment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lat, lon, water, selected: selectedKey ? selectedKey.split("|") : [], previous: previousKey ? previousKey.split(", ") : [], plantingMonth, allowAlternatives }), signal: controller.signal })
      .then(async (response) => { if (!response.ok) throw new Error(); return response.json(); })
      .then((data) => { setEnvironment(data); setLoading(false); })
      .catch(() => { if (!controller.signal.aborted) { setEnvironment(null); setLoading(false); } });
    return () => controller.abort();
  }, [step, pin, requested, water, selectedKey, previousKey, plantingMonth, allowAlternatives]);
  if (!session) return <main className="cs-farmer cs-guide"><p>Loading your farm…</p></main>;
  const { draft } = session;
  const selected = cropNames(draft.selection);
  const unsure = !selected.length && draft.selection.suggestions === "I'm open to suggestions";
  const previous = draft.history.recent ? draft.history.recent.split(", ") : [];
  const country = draft.location.country || "RW";
  const countryNames = new Intl.DisplayNames([language === "rw" ? "rw" : "en"], { type: "region" });
  const provinces = [...new Set(rwandaDistricts.map((district) => district.province))].sort();
  const districts = rwandaDistricts.filter((district) => !draft.location.province || district.province === draft.location.province);

  function focusMap(latitude: number, longitude: number, zoom: number) {
    setMapFocus((current) => ({ latitude, longitude, zoom, revision: (current?.revision ?? 0) + 1 }));
  }
  function changeCountry(code: string) {
    if (code === country) return;
    if (draft.location.pin && !window.confirm(text("Changing country will clear your saved farm point. Continue?", "Guhindura igihugu birakuraho aho umurima wabitswe. Urakomeza?"))) return;
    const place = countries.find((item) => item.code === code);
    updateDraft((current) => ({ ...current, location: { ...current.location, country: code, province: "", district: "", sector: "", pin: "" } }));
    if (place) focusMap(place.latitude, place.longitude, 5);
  }
  function changeProvince(province: string) {
    if (province === (draft.location.province || "")) return;
    if (draft.location.pin && !window.confirm(text("Changing province will clear your saved farm point. Continue?", "Guhindura intara birakuraho aho umurima wabitswe. Urakomeza?"))) return;
    updateDraft((current) => ({ ...current, location: { ...current.location, province, district: "", sector: "", pin: "" } }));
    const items = rwandaDistricts.filter((item) => item.province === province);
    if (items.length) focusMap(items.reduce((sum, item) => sum + item.latitude, 0) / items.length, items.reduce((sum, item) => sum + item.longitude, 0) / items.length, 8);
  }
  function changeDistrict(name: string) {
    if (name === draft.location.district) return;
    if (draft.location.pin && !window.confirm(text("Changing district will clear your saved farm point. Continue?", "Guhindura akarere birakuraho aho umurima wabitswe. Urakomeza?"))) return;
    const district = rwandaDistricts.find((item) => item.district === name);
    updateDraft((current) => ({ ...current, location: { ...current.location, province: district?.province || current.location.province, district: name, sector: "", pin: "" } }));
    if (district) focusMap(district.latitude, district.longitude, 10);
  }

  function setPoint(lat: number, lon: number, precision: "farm" | "area" = "farm") {
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) { setError("Please choose a valid location on the map."); return; }
    setError("");
    updateDraft((current) => ({ ...current, location: { ...current.location, pin: `${lat.toFixed(5)}, ${lon.toFixed(5)}`, precision } }));
  }
  function useLocation() {
    if (!navigator.geolocation) { setError("Location is unavailable. Choose a point on the map instead."); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition((position) => { setLocating(false); setPoint(position.coords.latitude, position.coords.longitude); }, () => { setLocating(false); setError("We couldn’t get your location. Choose a point on the map instead."); }, { timeout: 15000 });
  }
  function next() {
    if (step === 0 && !selected.length && !unsure) { setError("Choose a crop or ask for help."); return; }
    if (step === 0 && !unsure && !draft.selection.ids.some((id) => supportedCropIds.some((supported) => supported === id))) { setError("Choose a crop with an available FAO baseline, or select help me choose."); return; }
    if (step === 1 && !isPin(draft.location.pin) && !draft.location.district.trim()) { setError("Choose a location on the map or enter your district."); return; }
    if (step === 2 && !draft.history.recent) { setError("Choose an answer to continue."); return; }
    if (step === 3 && !draft.planting.help && !draft.planting.month) { setError("Choose when you plan to plant."); return; }
    if (step === 3 && !draft.planting.help && draft.planting.month < monthString(new Date())) { setError("Choose this month or a future month."); return; }
    if (step === 4 && !draft.guide.water) { setError("Choose how you water your crops."); return; }
    setError("");
    if (step === 4) { setEnvironment(null); setLoading(isPin(draft.location.pin)); completeGuidedPlan(); }
    setStep(step + 1); window.scrollTo({ top: 0, behavior: "instant" });
  }
  function togglePrevious(name: string) {
    const exclusive = ["Nothing", "I don't remember"];
    const value = exclusive.includes(name) ? (previous.includes(name) ? [] : [name]) : toggleValue(previous.filter((item) => !exclusive.includes(item)), name);
    updateDraft((current) => ({ ...current, history: { ...current.history, recent: value.join(", ") } }));
  }
  function savePlan() {
    if (hasSavedAnalysis() && !window.confirm(text("Replace your previously saved plan with this version?", "Gusimbuza gahunda wabikaga iyi nshya?"))) return;
    const saved = saveAnalysis({ savedAt: new Date().toISOString(), pin, locationPrecision: draft.location.precision, crops: selected, previous: draft.history.recent, plantingMonth, water, data: environment });
    if (!saved) { setError("Your plan could not be saved in this browser. Please check your browser storage."); return; }
    router.push("/dashboard");
  }

  return <div className="cs-farmer cs-guide" lang={language}><header className="cs-guide-header"><Link href="/" aria-label="CropSuite home"><CropSuiteLogo /></Link><LanguageSwitch /></header>
    {step < 5 ? <main className="cs-guide-layout"><aside className="cs-guide-art"><span>{text("YOUR FARM, YOUR FUTURE", "UMURIMA WAWE, EJO HAWE")}</span><BotanicalArt /><h2>{text("Every farm has a story.", "Buri murima ufite amateka.")}</h2><p>{text("Let’s find a thoughtful next step, together.", "Reka dushakire hamwe igikurikiraho.")}</p></aside><section className="cs-guide-card"><div className="cs-guide-progress"><span>{text("Step", "Intambwe")} {step + 1} / 5</span><progress max={5} value={step + 1} aria-label="Your progress" /></div><h1>{language === "rw" ? headingsRw[step] : headings[step]}</h1><p className="cs-guide-subtitle">{language === "rw" ? descriptionsRw[step] : descriptions[step]}</p>{error && <p className="cs-guide-error" role="alert">{language === "rw" ? (errorsRw[error] || error) : error}</p>}
      {step === 0 && <CropSelectionScreen selection={draft.selection} query={query} onQuery={setQuery} onChange={(change) => { setError(""); updateDraft((current) => ({ ...current, selection: change(current.selection) })); }} />}
      {step === 1 && <div className="cs-guide-location"><div className="cs-guide-location-copy">
        <label>{text("Country", "Igihugu")}<select value={country} onChange={(event) => changeCountry(event.target.value)}>{countries.map((item) => <option key={item.code} value={item.code}>{countryNames.of(item.code) || item.name}</option>)}</select></label><small>{text("Country data", "Amakuru y’ibihugu")}: <a href="https://github.com/mledoze/countries" target="_blank" rel="noreferrer">World countries</a> · <a href="https://opendatacommons.org/licenses/odbl/1-0/" target="_blank" rel="noreferrer">ODbL</a></small>
        {country === "RW" ? <><label>{text("Province", "Intara")}<select value={draft.location.province || ""} onChange={(event) => changeProvince(event.target.value)}><option value="">{text("Choose a province", "Hitamo intara")}</option>{provinces.map((province) => <option key={province} value={province}>{province}</option>)}</select></label><label>{text("District", "Akarere")}<select value={draft.location.district} onChange={(event) => changeDistrict(event.target.value)}><option value="">{text("Choose a district", "Hitamo akarere")}</option>{districts.map((district) => <option key={district.district} value={district.district}>{district.district}</option>)}</select></label><label>{text("Sector", "Umurenge")} <small>{text("Optional", "Si ngombwa")}</small><input value={draft.location.sector} placeholder={text("Enter your sector", "Andika umurenge")} onChange={(event) => updateDraft((current) => ({ ...current, location: { ...current.location, sector: event.target.value } }))} /></label></> : <label>{text("Area or district", "Agace cyangwa akarere")} <small>{text("Optional", "Si ngombwa")}</small><input value={draft.location.district} placeholder={text("Enter your area", "Andika agace")} onChange={(event) => updateDraft((current) => ({ ...current, location: { ...current.location, district: event.target.value } }))} /></label>}
        <div className="cs-guide-location-actions"><button type="button" onClick={useLocation} disabled={locating}>{locating ? text("Finding you…", "Turashaka aho uri…") : text("◎ Use my location", "◎ Koresha aho ndi")}</button><button type="button" onClick={() => focusMap(-1.9021, 30.50729, 10)}>{text("Explore Kayonza", "Reba Kayonza")}</button></div>
        <p>{draft.location.pin ? `${draft.location.precision === "area" ? text("Approximate district centre", "Hagati y’akarere hafi") : text("Location point", "Aho umurima uri")}: ${draft.location.pin}` : text("Choose an area, then tap the map to mark your farm. You can also choose the approximate district centre.", "Hitamo agace, hanyuma ukande ku ikarita werekane umurima wawe. Ushobora no guhitamo hafi y’ahari hagati y’akarere.")}</p>{country === "RW" && draft.location.district && !draft.location.pin && <button type="button" className="cs-guide-text" onClick={() => { const district = rwandaDistricts.find((item) => item.district === draft.location.district); if (district) setPoint(district.latitude, district.longitude, "area"); }}>{text("Use approximate district centre", "Koresha hafi y’ahari hagati y’akarere")}</button>}
        {draft.location.pin && <button type="button" className="cs-guide-text" onClick={() => updateDraft((current) => ({ ...current, location: { ...current.location, pin: "" } }))}>{text("Remove point", "Kuraho aho wahisemo")}</button>}
        <details><summary>{text("Enter coordinates", "Andika ibipimo by’ahantu")}</summary><label>Latitude, longitude<input value={coordinateText} placeholder="e.g. -1.90, 30.65" onChange={(event) => setCoordinateText(event.target.value)} /></label><button type="button" className="cs-guide-text" onClick={() => { if (!isPin(coordinateText)) { setError("Enter a valid latitude and longitude separated by a comma."); return; } const [lat, lon] = coordinateText.split(",").map(Number); setPoint(lat, lon); }}>{text("Use coordinates", "Koresha ibi bipimo")}</button></details>
        {country === "RW" && <small>{text("District names and map centres: National Institute of Statistics of Rwanda.", "Amazina y’uturere n’aho turi ku ikarita: NISR.")}</small>}
      </div><LocationPicker pin={draft.location.pin} focus={mapFocus} onChange={setPoint} /></div>}
      {step === 2 && <div className="cs-guide-crops">{crops.filter((crop) => featured.includes(crop.id)).map((crop) => <button type="button" key={crop.id} aria-pressed={previous.includes(crop.name)} onClick={() => togglePrevious(crop.name)}><Image src={crop.image} alt="" width={160} height={100} unoptimized /><span>{cropLabel(crop.name, language)}</span><b>{previous.includes(crop.name) ? "✓" : "+"}</b></button>)}{["Nothing", "I don't remember"].map((item) => <button className="cs-guide-text-choice" type="button" key={item} aria-pressed={previous.includes(item)} onClick={() => togglePrevious(item)}><span>{cropLabel(item, language)}</span><b>{previous.includes(item) ? "✓" : "+"}</b></button>)}</div>}
      {step === 3 && <div className="cs-guide-options">{(country === "RW" ? ["Soon", "Next season", "Not sure yet"] : ["Soon", "Not sure yet"]).map((item) => <button type="button" key={item} onClick={() => { const date = new Date(); if (item === "Next season") { const m = date.getMonth(); date.setMonth(m < 2 ? 2 : m < 9 ? 9 : 14, 1); } updateDraft((current) => ({ ...current, planting: { ...current.planting, help: item === "Not sure yet", month: item === "Not sure yet" ? "" : monthString(date), date: "", harvest: "" } })); }} aria-pressed={item === "Not sure yet" ? draft.planting.help : !draft.planting.help && !!draft.planting.month && (item === "Soon" ? draft.planting.month === monthString(new Date()) : draft.planting.month !== monthString(new Date()))}>{item === "Soon" ? text("Soon", "Vuba") : item === "Next season" ? text("Next season", "Igihembwe gitaha") : text("Not sure yet", "Sindiramenya")}<span>→</span></button>)}<label>{text("Or choose a month", "Cyangwa hitamo ukwezi")}<input type="month" value={draft.planting.month} onChange={(event) => updateDraft((current) => ({ ...current, planting: { ...current.planting, help: false, month: event.target.value, date: "", harvest: "" } }))} /></label></div>}
      {step === 4 && <div className="cs-guide-options">{[{label:"Yes", value:"I use irrigation"},{label:"Sometimes", value:"Sometimes both"},{label:"Rain only", value:"I depend on rainfall"}].map((item) => <button type="button" key={item.value} aria-pressed={draft.guide.water === item.value} onClick={() => updateDraft((current) => ({ ...current, guide: { ...current.guide, water: item.value } }))}>{item.value === "I use irrigation" ? text("Yes", "Yego") : item.value === "Sometimes both" ? text("Sometimes", "Rimwe na rimwe") : text("Rain only", "Imvura gusa")}<span>{draft.guide.water === item.value ? "✓" : "→"}</span></button>)}</div>}
      <div className="cs-guide-actions"><button type="button" onClick={() => { setError(""); if (step) setStep(step - 1); else router.push("/"); }}>{text("Back", "Subira inyuma")}</button><button type="button" onClick={next}>{step === 4 ? text("See my plan", "Reba gahunda") : text("Continue", "Komeza")} →</button></div></section></main> : <main className="cs-guide-results"><div className="cs-guide-result-heading"><span>{text("YOUR FARM PLAN", "GAHUNDA Y’UMURIMA WAWE")}</span><h1>{text("Your next season, made clearer.", "Sobanukirwa neza igihembwe gitaha.")}</h1><p>{text("Your choices and available environmental information, together in one place.", "Dore ibyo wahisemo n’amakuru y’ibidukikije ahari.")}</p>{draft.location.precision === "area" && pin && <p className="cs-guide-data-note">{text("These results use an approximate district centre, not your farm. Select your field on the map for a more relevant estimate.", "Aya makuru akoresha hafi y’ahari hagati y’akarere, si umurima wawe. Hitamo umurima ku ikarita kugira ngo ubone amakuru yegeranye na wo.")}</p>}</div><FarmAdvice data={environment} loading={loading && isPin(pin)} hasPoint={isPin(pin)} previous={previous} onEdit={() => { setStep(1); window.scrollTo({ top: 0, behavior: "instant" }); }} />{environment?.rotation ? <RotationResults analysis={environment.rotation} /> : <section className="cs-guide-next"><h2>{text("Plan another season", "Tegura ikindi gihembwe")}</h2><p>{loading && isPin(pin) ? text("Checking available FAO land suitability information…", "Turareba amakuru ya FAO…") : text("Choose a farm point on the map to compare available FAO land suitability information.", "Hitamo umurima ku ikarita kugira ngo ugereranye amakuru ya FAO.")}</p></section>}<div className="cs-guide-result-grid"><section className="cs-guide-result-card"><span>{selected.length ? text("YOUR CHOICES", "IBYO WAHISEMO") : text("CROPS TO EXPLORE", "IBIHINGWA WAREBA")}</span><h2>{selected.length ? selected.map((name) => cropLabel(name, language)).join(", ") : text("Let’s explore crops", "Reka turebe ibihingwa")}</h2><p>{environment?.rotation?.status === "exploratory" || environment?.rotation?.status === "comparison" ? text("Compare the FAO baseline for your location. It is a historical grid estimate, not a farm-specific yield prediction.", "Gereranya amakuru y’amateka ya FAO y’aho uri. Si iteganyamusaruro ry’umurima wawe.") : text("Choose a supported crop and a location with FAO data to see a baseline. Your field still needs local assessment.", "Hitamo igihingwa n’ahantu bifite amakuru ya FAO. Umurima wawe uracyakeneye gusuzumwa.")}</p>{cropConsiderations(draft, environment, language).map((candidate) => <details key={candidate.name} open><summary>{cropLabel(candidate.name, language)} · {candidate.status}</summary><div className="cs-guide-reasons"><div><strong>{text("Weather", "Iteganyagihe")}</strong><p>{loading && isPin(pin) ? text("Checking the weather…", "Turareba iteganyagihe…") : candidate.weather}</p></div><div><strong>{text("Soil", "Ubutaka")}</strong><p>{candidate.soil}</p></div><div><strong>{text("Rotation", "Guhinduranya ibihingwa")}</strong><p>{candidate.rotation}</p></div></div></details>)}<details><summary>{text("Why this result?", "Kuki twabonye iki gisubizo?")}</summary><p>{text("FAO baseline indices are historical modeled estimates, not measurements of your farm or yield predictions. A reliable assessment needs local soil, crop variety, water and seasonal evidence. A 48-hour forecast cannot predict a harvest.", "Ibipimo bya FAO ni amakuru y’amateka, si ibipimo by’umurima wawe cyangwa iteganyamusaruro. Hakenewe amakuru y’ubutaka, imbuto, amazi n’igihembwe. Iteganyagihe ry’amasaha 48 ntiriteganya umusaruro.")}</p><p><a href="https://www.fao.org/4/x4799e/x4799e.pdf" target="_blank" rel="noreferrer">Read about crop rotation ↗</a></p></details></section><aside className="cs-guide-result-card cs-guide-weather"><span>{text("CROPSUITE GUIDE", "UMUJYANAMA WA CROPSUITE")}</span><h2>{text("Weather and past seasons", "Iteganyagihe n’ibihe byashize")}</h2>{loading && isPin(pin) ? <p role="status">{text("Checking environmental information…", "Turareba amakuru y’ibidukikije…")}</p> : <>{environment ? <WeatherSnapshot forecast={environment.forecast} cache={environment.cache} /> : <p>{text("Select a farm point to check the weather.", "Hitamo aho umurima uri ku ikarita kugira ngo urebe iteganyagihe.")}</p>}<p>{environment?.history.status === "available" ? text(`NASA POWER estimated ${environment.history.rainMm} mm of rain and an average temperature of ${environment.history.meanTempC}°C in ${environment.history.year}. This is historical, not a forecast.`, `NASA POWER yagereranyije imvura ya mm ${environment.history.rainMm} n’impuzandengo y’ubushyuhe bwa ${environment.history.meanTempC}°C mu mwaka wa ${environment.history.year}. Ni amakuru y’amateka, si iteganyagihe.`) : environment?.history.message ? text(environment.history.message, "Amakuru y’ikirere y’amateka ntabonetse ubu.") : text("Historical climate requires a map point.", "Amakuru y’ikirere y’amateka akeneye aho umurima uri ku ikarita.")}</p>{environment?.history && <ClimateContext history={environment.history} plantingMonth={plantingMonth} />}<button type="button" className="cs-guide-text" onClick={() => { setLoading(isPin(pin)); setRequested(requested + 1); }}>{text("Refresh information", "Ongera urebe amakuru")}</button></>}</aside></div><div className="cs-guide-actions"><button type="button" onClick={() => setStep(4)}>{text("Back", "Subira inyuma")}</button><button type="button" onClick={savePlan} disabled={loading && isPin(pin)}>{text("Save my plan", "Bika gahunda yanjye")} →</button></div>{error && <p className="cs-guide-error" role="alert">{language === "rw" ? (errorsRw[error] || error) : error}</p>}<p className="cs-guide-save">{text("Save your plan to find it again under Plan on this device. No account is needed.", "Bika gahunda yawe kugira ngo uzongere kuyibona munsi ya Gahunda kuri iki gikoresho. Nta konti ikenewe.")}</p></main>}</div>;
}

