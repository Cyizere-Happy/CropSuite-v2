import type { ReactNode } from "react";
import "@/components/farmer/farmer.css";
import "@/components/farmer/journey.css";
import "leaflet/dist/leaflet.css";
import "@/components/farmer/guide.css";
import { LanguageProvider } from "@/components/farmer/Language";

export default function FarmerLayout({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}

