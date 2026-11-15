"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FarmAdvice } from "./FarmAdvice";
import { CropSuiteLogo } from "@/components/brand/CropSuiteLogo";
import { cropNames, crops } from "@/lib/farmer/model";
import { useFarmerSession } from "@/lib/farmer/store";
import { isPin } from "@/lib/farmer/validation";
import type { Environment } from "@/lib/environment/types";
import { useSavedAnalysis } from "@/lib/farmer/savedPlan";
import { RotationResults } from "./RotationResults";
import { WeatherSnapshot } from "./WeatherSnapshot";
import { cropLabel, LanguageSwitch, useLanguage } from "./Language";
import countries from "@/lib/farmer/countries.json";

export function FarmerHome({ section = "" }: { section?: string }) {
  const { language, text } = useLanguage();
  const router = useRouter();
  const session = useFarmerSession();
  const saved = useSavedAnalysis();
  const [data, setData] = useState<Environment | null>(null);
  const [weatherError, setWeatherError] = useState<"rate_limit" | "network" | null>(null);
  const pin = session?.draft.location.pin || "";
  useEffect(() => {
    if (!isPin(pin)) return;
    const controller = new AbortController();
    const [lat, lon] = pin.split(",").map(Number);
    fetch("/api/environment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lat, lon }), signal: controller.signal }).then((res) => { if (!res.ok) throw new Error(res.status === 429 ? "rate_limit" : "network"); return res.json(); }).then((value) => { setData(value); setWeatherError(null); }).catch((reason: unknown) => { if (!controller.signal.aborted) setWeatherError(reason instanceof Error && reason.message === "rate_limit" ? "rate_limit" : "network"); });
    return () => controller.abort();
  }, [pin]);
  if (!session) return <div className="cs-farmer cs-guide">Loading your farm…</div>;
  if (!session.demo) return <main className="cs-farmer cs-guide cs-guide-results"><h1>Let’s get to know your farm.</h1><Link href="/onboarding/journey/farm">Start your plan →</Link></main>;
  const { draft } = session;
  const names = cropNames(draft.selection);
  const chosen = names[0];
  const crop = crops.find((item) => item.name === chosen);
  const countryName = countries.find((item) => item.code === draft.location.country)?.name;
  const current = section === "fields" ? "farm" : section === "crop-planning" || section === "history" ? "plan" : section === "help" ? "learn" : "home";
  return <div className="cs-farmer cs-guide cs-home" lang={language}><header className="cs-guide-header"><Link href="/"><CropSuiteLogo /></Link><LanguageSwitch /></header><div className="cs-home-layout"><nav className="cs-home-nav" aria-label="Farm navigation">{[{id:"home",name:"Home",href:"/dashboard"},{id:"farm",name:"My Farm",href:"/dashboard/fields"},{id:"plan",name:"Plan",href:"/dashboard/crop-planning"},{id:"learn",name:"Learn",href:"/dashboard/help"}].map((item) => <Link key={item.id} href={item.href} aria-current={current === item.id ? "page" : undefined}>{item.id === "home" ? text("Home", "Ahabanza") : item.id === "farm" ? text("My Farm", "Umurima wanjye") : item.id === "plan" ? text("Plan", "Gahunda") : text("Learn", "Menya byinshi")}</Link>)}</nav><main className="cs-home-main"><span className="cs-home-kicker">{text("CROPSUITE GUIDE", "UMUJYANAMA WA CROPSUITE")}</span><h1>{current === "home" ? `${text("Hello", "Muraho")}${draft.profile.displayName ? `, ${draft.profile.displayName}` : ""}.` : current === "farm" ? text("Your farm.", "Umurima wawe.") : current === "plan" ? text("Your crop plan.", "Gahunda y’ibihingwa.") : text("Learn with CropSuite.", "Menya byinshi na CropSuite.")}</h1><p className="cs-guide-subtitle">{current === "home" ? text("A clearer view of your next season.", "Sobanukirwa neza igihembwe gitaha.") : text("Small steps for a thoughtful growing season.", "Intambwe nto zo gutegura igihembwe.")}</p>{current === "learn" ? <section className="cs-guide-result-card"><h2>Why the weather matters</h2><p>Rainfall timing and dry spells can affect crops. Historic patterns describe the past; a forecast describes the next few days.</p><p><a href="https://www.fao.org/4/s2022e/s2022e07.htm" target="_blank" rel="noreferrer">Learn about crops and water ↗</a></p><p><a href="https://power.larc.nasa.gov/" target="_blank" rel="noreferrer">Explore NASA POWER ↗</a></p></section> : <div className="cs-home-grid"><section className="cs-home-farm"><span>{text("YOUR FARM", "UMURIMA WAWE")}</span><h2>{draft.fieldName || text("My farm", "Umurima wanjye")}</h2><p>{[draft.location.sector, draft.location.district, countryName].filter(Boolean).join(", ") || text("Location point saved", "Aho umurima uri harabitswe")}</p><div className="cs-home-leaves" aria-hidden="true">❧</div><Link href="/onboarding/journey/farm">{text("Edit farm details", "Hindura amakuru y’umurima")} →</Link></section><section className="cs-guide-result-card"><span>{text("WEATHER", "ITEGANYAGIHE")}</span><h2>{text("Your local weather", "Iteganyagihe ry’aho uri")}</h2>{data ? <WeatherSnapshot forecast={data.forecast} /> : <p>{weatherError === "rate_limit" ? text("Too many requests. Please wait a few minutes and try again.", "Hasabwe amakuru inshuro nyinshi. Tegereza iminota mike wongere ugerageze.") : weatherError ? text("Weather could not be retrieved. Please try again later.", "Iteganyagihe ntiriboneka ubu. Ongera ugerageze nyuma.") : isPin(pin) ? text("Checking your forecast…", "Turareba iteganyagihe…") : text("Choose a farm point to check the weather.", "Hitamo umurima ku ikarita kugira ngo urebe iteganyagihe.")}</p>}</section><section className="cs-guide-result-card cs-home-crop">{crop && <Image src={crop.image} alt="" width={320} height={180} unoptimized />}<span>{text("YOUR CROPS", "IBIHINGWA BYAWE")}</span><h2>{names.map((name) => cropLabel(name, language)).join(", ") || text("Explore your options", "Reba ibyo wahitamo")}</h2><p>{text("Your chosen crops are a starting point. More information is needed for a field-specific assessment.", "Ibyo wahisemo ni intangiriro. Harakenewe andi makuru kugira ngo umurima wawe usuzumwe.")}</p><Link href="/onboarding/journey/plan">{text("View your analysis", "Reba isuzuma")} →</Link></section><section className="cs-guide-result-card"><span>{text("THINK AHEAD", "TEGANYA IBIZAZA")}</span><h2>{text("Your next seasons", "Ibihe bizakurikiraho")}</h2><p>{saved?.data?.rotation?.status === "exploratory" ? `${text("Saved plan", "Gahunda yabitswe")}: ${saved.data.rotation.plans[0].crops.map((name) => cropLabel(name, language)).join(" → ")}.` : `Previously: ${draft.history.recent || "not shared"}.`} Future rotations are provisional and need local review.</p>{saved && <small>Saved {new Date(saved.savedAt).toLocaleDateString()}. This saved version is not changed by weather refreshes.</small>}<br /><Link href="/onboarding/journey/plan">{text("Review analysis", "Ongera urebe isuzuma")} →</Link></section></div>}{current === "plan" && saved?.data?.rotation && <><p className="cs-guide-save">{text("Your saved analysis from", "Isuzuma wabikaga ryo ku wa")} {new Date(saved.savedAt).toLocaleString()}.{saved.locationPrecision === "area" && ` ${text("It uses an approximate district centre, not the farm point.", "Rikoresha hafi y’ahari hagati y’akarere, si umurima nyirizina.")}`}</p><FarmAdvice data={saved.data} loading={false} hasPoint={isPin(saved.pin)} previous={saved.previous ? saved.previous.split(", ") : []} onEdit={() => router.push("/onboarding/journey/farm")} saved /><RotationResults analysis={saved.data.rotation} /></>}</main></div></div>;
}
