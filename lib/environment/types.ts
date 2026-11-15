export type Availability = "available" | "unavailable";
export type Forecast = { status: Availability; provider: "Meteomatics"; message: string; retrievedAt?: string; issuedAt?: string | null; start?: string; end?: string; rainMm?: number; meanTempC?: number; maxWindMs?: number };
export type MonthlyClimate = { month: number; meanRainMm: number; minRainMm: number; maxRainMm: number; meanTempC: number; meanSolarMjM2Day?: number };
export type History = { status: Availability; provider: "NASA POWER"; message: string; year?: number; rainMm?: number; meanTempC?: number; days?: number; retrievedAt?: string; periodStart?: number; periodEnd?: number; monthly?: MonthlyClimate[] };
export type Environment = { forecast: Forecast; history: History };
