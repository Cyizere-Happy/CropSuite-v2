"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";

type Language = "en" | "rw";
const LanguageContext = createContext<{ language: Language; change: (value: Language) => void }>({ language: "en", change: () => {} });
let fallback: Language = "en";
function subscribe(callback: () => void) { window.addEventListener("cropsuite:language", callback); window.addEventListener("storage", callback); return () => { window.removeEventListener("cropsuite:language", callback); window.removeEventListener("storage", callback); }; }
function readLanguage(): Language { try { return localStorage.getItem("cropsuite.language") === "rw" ? "rw" : "en"; } catch { return fallback; } }

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(subscribe, readLanguage, (): Language => "en");
  function change(value: Language) { fallback = value; try { localStorage.setItem("cropsuite.language", value); } catch { /* Keep the selection for this visit. */ } window.dispatchEvent(new Event("cropsuite:language")); }
  return <LanguageContext.Provider value={{ language, change }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  return { ...context, text: (english: string, kinyarwanda: string) => context.language === "rw" ? kinyarwanda : english };
}

const crops: Record<string, string> = { Maize: "Ibigori", "Common beans": "Ibishyimbo", Sorghum: "Amasaka", Soybeans: "Soya", Groundnuts: "Ubunyobwa", Cassava: "Imyumbati", "Sweet potatoes": "Ibijumba", "Irish potatoes": "Ibirayi", Rice: "Umuceri", Tomatoes: "Inyanya", Nothing: "Nta cyo", "I don't remember": "Sinibuka" };
export function cropLabel(name: string, language: Language) { return language === "rw" ? (crops[name] || name) : name; }

export function LanguageSwitch() {
  const { language, change } = useLanguage();
  return <label className="cs-language-switch"><span className="sr-only">Language / Ururimi</span><select value={language} onChange={(event) => change(event.target.value === "rw" ? "rw" : "en")}><option value="en">English</option><option value="rw">Ikinyarwanda</option></select></label>;
}
