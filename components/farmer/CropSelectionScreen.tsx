import Image from "next/image";
import { crops, toggleValue, type CropSelection } from "@/lib/farmer/model";
import { supportedCropIds } from "@/lib/farmer/supportedCrops";
import { cropLabel, useLanguage } from "./Language";

export function CropSelectionScreen({ selection, query, onQuery, onChange }: { selection: CropSelection; query: string; onQuery: (value: string) => void; onChange: (update: (selection: CropSelection) => CropSelection) => void }) {
  const { language, text } = useLanguage();
  const selected = crops.filter((crop) => selection.ids.includes(crop.id));
  const showCrops = crops.filter((crop) => (supportedCropIds.some((id) => id === crop.id) || selection.ids.includes(crop.id)) && (crop.name.toLowerCase().includes(query.toLowerCase().trim()) || cropLabel(crop.name, language).toLowerCase().includes(query.toLowerCase().trim())));
  const unsure = !selected.length && selection.suggestions === "I'm open to suggestions";
  return <div className="cs-crop-picker">
    <div className="cs-picker-intro"><span aria-hidden="true">✦</span><p>{text("Select one or more crops you are considering. We’ll compare the choices with information for your location.", "Hitamo igihingwa kimwe cyangwa byinshi wifuza guhinga. Tuzabigereranya n’amakuru y’aho umurima wawe uri.")}</p></div>
    <div className="cs-picker-toolbar"><div><strong>{text("Your crops", "Ibihingwa byawe")}</strong><span aria-live="polite">{selected.length ? text(`${selected.length} selected`, `${selected.length} byatoranyijwe`) : text("Choose at least one", "Hitamo nibura kimwe")}</span></div><label className="cs-guide-search"><span className="sr-only">{text("Search crops", "Shakisha igihingwa")}</span><input type="search" placeholder={text("Search crops…", "Shakisha igihingwa…")} value={query} onChange={(event) => onQuery(event.target.value)} /></label></div>
    {selected.length > 0 && <p className="cs-picker-selected"><strong>{text("Selected:", "Ibyo wahisemo:")}</strong> {selected.map((crop) => cropLabel(crop.name, language)).join(", ")}</p>}
    <div className="cs-guide-crops cs-picker-grid">{showCrops.map((crop) => {
      const isSelected = selection.ids.includes(crop.id);
      const supported = supportedCropIds.some((id) => id === crop.id);
      return <button type="button" key={crop.id} aria-pressed={isSelected} onClick={() => onChange((current) => ({ ...current, ids: toggleValue(current.ids, crop.id), suggestions: current.suggestions || "I'm open to suggestions" }))}><Image src={crop.image} alt="" width={320} height={180} /><span>{cropLabel(crop.name, language)}<small className={supported ? "cs-picker-crop-hint" : "cs-guide-unavailable"}>{supported ? text("Available to compare", "Gereranya iki gihingwa") : text("Saved choice · data unavailable", "Igihingwa wabikaga · nta makuru")}</small></span><b aria-hidden="true">{isSelected ? "✓" : "+"}</b></button>;
    })}</div>
    {!showCrops.length && <p className="cs-picker-empty" role="status">{text("No matching crops. Try another name or clear your search.", "Nta gihingwa kibonetse. Gerageza irindi zina cyangwa usibe ibyo wanditse.")}</p>}
    {selected.length > 0 && <label className="cs-picker-alternatives"><input type="checkbox" checked={selection.suggestions === "I'm open to suggestions"} onChange={(event) => onChange((current) => ({ ...current, suggestions: event.target.checked ? "I'm open to suggestions" : "Only my selected crops" }))}/><span><strong>{text("Show me other crop options too", "Unyereke n’ibindi bihingwa")}</strong><small>{text("Compare other crops where information is available.", "Gereranya n’ibindi bihingwa iyo amakuru yabyo ahari.")}</small></span></label>}
    <button className="cs-guide-help" type="button" aria-pressed={unsure} onClick={() => onChange((current) => ({ ...current, ids: [], custom: "", suggestions: "I'm open to suggestions" }))}><span><strong>{text("Not sure what to plant?", "Nturanamenya icyo wahinga?")}</strong><small>{text("Explore available crop options", "Reba ibihingwa bishobora kugereranywa")}</small></span><span aria-hidden="true">→</span></button>
    <p className="cs-picker-footnote">{text("Availability depends on the information at your selected location.", "Amakuru aboneka bitewe n’aho umurima wahisemo uri.")}</p>
  </div>;
}
