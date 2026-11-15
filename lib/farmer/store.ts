"use client";

import { useSyncExternalStore } from "react";
import {
  blankDraft, crops, drainageChoices, goalChoices, harvestChoices, inputChoices,
  irrigationChoices, sequenceChoices, suggestionChoices, type FarmerOnboardingDraft,
} from "./model";
import { firstIncomplete, isAmount, isDate, isMonth, isPin } from "./validation";

const storageKey = "cropsuite.farmer.v1";
const eventName = "cropsuite:farmer";
type FarmerSession = {
  version: 1;
  demo: boolean;
  completed: boolean;
  draft: FarmerOnboardingDraft;
  persistent: boolean;
};

const empty: FarmerSession = { version: 1, demo: false, completed: false, draft: blankDraft, persistent: true };
let memory: FarmerSession | undefined;
let cachedRaw: string | null | undefined;
let cached = empty;

function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function text(value: unknown, max = 120) {
  return typeof value === "string" ? value.slice(0, max) : "";
}

function option<T extends string>(value: unknown, values: readonly T[]): T | "" {
  return values.find((entry) => entry === value) ?? "";
}

function options(value: unknown, values: readonly string[]) {
  return Array.isArray(value) ? values.filter((entry) => value.includes(entry)) : [];
}

function sanitizeDraft(value: unknown): FarmerOnboardingDraft {
  const root = record(value);
  const profile = record(root.profile);
  const selection = record(root.selection);
  const location = record(root.location);
  const planting = record(root.planting);
  const history = record(root.history);
  const resources = record(root.resources);
  const pin = text(location.pin, 48);
  const area = text(location.area, 20);
  const budget = text(resources.budget, 20);
  const month = text(planting.month, 7);
  const date = text(planting.date, 10);
  const harvest = text(planting.harvest, 10);

  return {
    profile: { displayName: text(profile.displayName, 60) },
    fieldName: text(root.fieldName, 60),
    selection: {
      ids: options(selection.ids, crops.map(({ id }) => id)),
      custom: text(selection.custom, 80),
      suggestions: option(selection.suggestions, suggestionChoices),
    },
    location: {
      district: text(location.district, 80),
      sector: text(location.sector, 80),
      village: text(location.village, 80),
      pin: isPin(pin) ? pin : "",
      area: isAmount(area, 0.0001) ? area : "",
    },
    planting: {
      help: planting.help === true,
      month: isMonth(month) ? month : "",
      date: isDate(date) ? date : "",
      harvest: isDate(harvest) ? harvest : "",
    },
    history: {
      recent: text(history.recent, 80),
      previous: text(history.previous, 500),
      sequence: option(history.sequence, sequenceChoices),
      outcome: option(history.outcome, harvestChoices),
      problems: text(history.problems, 500),
    },
    goals: options(root.goals, goalChoices.map(({ name }) => name)),
    resources: {
      irrigation: option(resources.irrigation, irrigationChoices),
      budget: isAmount(budget, 0) ? budget : "",
      seeds: text(resources.seeds, 500),
      soil: text(resources.soil, 500),
      drainage: option(resources.drainage, drainageChoices),
      inputs: option(resources.inputs, inputChoices),
    },
  };
}

function restore(raw: string | null): FarmerSession {
  if (!raw) return empty;
  try {
    const stored = record(JSON.parse(raw));
    if (stored.version !== 1) return empty;
    const draft = sanitizeDraft(stored.draft);
    return { version: 1, demo: stored.demo === true, completed: stored.completed === true && !firstIncomplete(draft), draft, persistent: true };
  } catch {
    return empty;
  }
}

function getSession(): FarmerSession {
  if (memory) return memory;
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cached = restore(raw);
    }
    return cached;
  } catch {
    memory = { ...cached, persistent: false };
    return memory;
  }
}

function subscribe(callback: () => void) {
  function sync(event: StorageEvent) {
    if (event.key !== null && event.key !== storageKey) return;
    callback();
  }

  window.addEventListener(eventName, callback);
  window.addEventListener("storage", sync);
  return () => {
    window.removeEventListener(eventName, callback);
    window.removeEventListener("storage", sync);
  };
}

function updateSession(update: (current: FarmerSession) => FarmerSession) {
  const next = update(getSession());
  const raw = JSON.stringify(next);
  try {
    window.localStorage.setItem(storageKey, raw);
    cached = { ...next, persistent: true };
    cachedRaw = raw;
    memory = undefined;
  } catch {
    memory = { ...next, persistent: false };
  }
  window.dispatchEvent(new Event(eventName));
}

export function useFarmerSession() {
  return useSyncExternalStore(subscribe, getSession, () => null);
}

export function startDemo() {
  updateSession((current) => ({ ...current, demo: true }));
}

export function leaveDemo() {
  updateSession((current) => ({ ...current, demo: false }));
}

export function updateDraft(update: (current: FarmerOnboardingDraft) => FarmerOnboardingDraft) {
  updateSession((current) => ({ ...current, draft: update(current.draft) }));
}

export function completePlan() {
  const current = getSession();
  if (!current.demo || firstIncomplete(current.draft)) return false;
  updateSession((session) => ({ ...session, completed: true }));
  return true;
}

