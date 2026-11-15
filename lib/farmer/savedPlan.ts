"use client";

import { useSyncExternalStore } from "react";
import type { Environment } from "@/lib/environment/types";
import type { RotationAnalysis } from "./rotationEngine";

const key = "cropsuite.saved-analysis.v1";
const event = "cropsuite:saved-analysis";
export type SavedAnalysis = { savedAt: string; pin: string; locationPrecision?: "farm" | "area"; crops: string[]; previous: string; plantingMonth: string; water: string; data: (Environment & { cache: string; rotation: RotationAnalysis | null }) | null };

export function saveAnalysis(value: SavedAnalysis) {
  try { localStorage.setItem(key, JSON.stringify(value)); window.dispatchEvent(new Event(event)); return true; } catch { return false; }
}

export function hasSavedAnalysis() { try { return Boolean(localStorage.getItem(key)); } catch { return false; } }

function subscribe(callback: () => void) {
  window.addEventListener(event, callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener(event, callback); window.removeEventListener("storage", callback); };
}
function read() { try { return localStorage.getItem(key); } catch { return null; } }
export function useSavedAnalysis(): SavedAnalysis | null {
  const raw = useSyncExternalStore(subscribe, read, () => null);
  try { return raw ? JSON.parse(raw) as SavedAnalysis : null; } catch { return null; }
}
