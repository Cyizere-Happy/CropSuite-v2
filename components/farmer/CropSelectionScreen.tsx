import Image from "next/image";
import { crops, toggleValue, type CropSelection } from "@/lib/farmer/model";
import { supportedCropIds } from "@/lib/farmer/supportedCrops";
import { cropLabel, useLanguage } from "./Language";

const order = ["maize", "sorghum", "common-beans", "soybeans", "groundnuts"];
export function CropSelectionScreen({ selection, query, onQuery, onChange }: { selection: CropSelection; query: string; onQuery: (value: string) => void; onChange: (update: (selection: CropSelection) => CropSelection) => void }) {
  const { language, text } = useLanguage();
  const selected = crops.filter((crop) => selection.ids.includes(crop.id));
  const showCrops = crops.filter((crop) => (supportedCropIds.some((id) => id === crop.id) || selection.ids.includes(crop.id)) && (crop.name.toLowerCase().includes(query.toLowerCase().trim()) || cropLabel(crop.name, language).toLowerCase().includes(query.toLowerCase().trim()))).sort((a, b) => (order.indexOf(a.id) < 0 ? 99 : order.indexOf(a.id)) - (order.indexOf(b.id) < 0 ? 99 : order.indexOf(b.id)));
  const unsure = !selected.length && selection.suggestions === "I'm open to suggestions";
  const toggle = (id: string) => onChange((current) => ({ ...current, ids: toggleValue(current.ids, id), suggestions: current.suggestions || "I'm open to suggestions" }));
  return <div className="cs-crop-picker cs-picker-compact">
    <div className="cs-picker-intro"><span aria-hidden="true">✦</span><p>{text("We’ll explore your crops using local area information, crop history and weather context.", "Tuzasuzuma ibihingwa dukoresheje amakuru y’agace, ibyo wahinze n’iteganyagihe.")}</p></div>
    <div className="cs-picker-toolbar"><div><strong>{text("Your crops", "Ibihingwa byawe")}</strong><span aria-live="polite">{text(`${selected.length} selected`, `${selected.length} byatoranyijwe`)}</span></div><label className="cs-guide-search"><span className="sr-only">{text("Search crops", "Shakisha igihingwa")}</span><input type="search" placeholder={text("Search crops…", "Shakisha igihingwa…")} value={query} onChange={(event) => onQuery(event.target.value)} /></label></div>
    <div className="cs-picker-chips" aria-label={text("Selected crops", "Ibihingwa wahisemo")}>
      {selected.length ? selected.map((crop) => <button type="button" className="cs-picker-chip" key={crop.id} onClick={() => toggle(crop.id)} aria-label={text(`Remove ${crop.name}`, `Kuraho ${cropLabel(crop.name, language)}`)}><span aria-hidden="true">✿</span> {cropLabel(crop.name, language)} <b aria-hidden="true">×</b></button>) : <span className="cs-picker-placeholder">{text("Your selected crops will appear here", "Ibihingwa wahisemo bizagaragara hano")}</span>}
    </div>
    <div className="cs-picker-content"><div><div className="cs-guide-crops cs-picker-grid">{showCrops.map((crop) => {
      const isSelected = selection.ids.includes(crop.id);
      const supported = supportedCropIds.some((id) => id === crop.id);
      return <button type="button" key={crop.id} aria-pressed={isSelected} onClick={() => toggle(crop.id)}><Image src={crop.image} alt="" width={240} height={130} /><span>{cropLabel(crop.name, language)}{!supported && <small className="cs-guide-unavailable">{text("Data unavailable", "Nta makuru")}</small>}</span><b aria-hidden="true">{isSelected ? "✓" : "+"}</b></button>;
    })}</div>{!showCrops.length && <p className="cs-picker-empty" role="status">{text("No matching crops. Try another name or clear your search.", "Nta gihingwa kibonetse. Gerageza irindi zina cyangwa usibe ibyo wanditse.")}</p>}</div>
      <aside className="cs-picker-preview"><span>{text("COMING UP", "IBIKURIKIRA")}</span><h2>{text("Next: Compare with farm data", "Ibikurikira: Gereranya n’amakuru y’umurima")}</h2><div><i aria-hidden="true">☼</i><strong>{text("Weather", "Iteganyagihe")}</strong><span aria-hidden="true">▁▃▂▅</span></div><div><i aria-hidden="true">≋</i><strong>{text("Soil", "Ubutaka")}</strong><span aria-hidden="true">━━</span></div><div><i aria-hidden="true">↻</i><strong>{text("Rotation", "Guhinduranya")}</strong><span aria-hidden="true">○ → ○</span></div><small>{text("Area estimates are not a field soil test.", "Amakuru y’agace si isuzuma ry’ubutaka bw’umurima.")}</small></aside>
    </div>
    <div className="cs-picker-choices">{selected.length > 0 && <label className="cs-picker-alternatives"><input type="checkbox" checked={selection.suggestions === "I'm open to suggestions"} onChange={(event) => onChange((current) => ({ ...current, suggestions: event.target.checked ? "I'm open to suggestions" : "Only my selected crops" }))}/><span><strong>{text("Show other crop options too", "Unyereke n’ibindi bihingwa")}</strong></span></label>}
    <button className="cs-guide-help" type="button" aria-pressed={unsure} onClick={() => onChange((current) => ({ ...current, ids: [], custom: "", suggestions: "I'm open to suggestions" }))}><span><strong>{text("Not sure? Help me choose.", "Nturanamenya? Mfasha guhitamo.")}</strong></span><span aria-hidden="true">→</span></button></div>
  </div>;
}
