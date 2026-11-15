import type { Metadata } from "next";
import { FarmerHome } from "@/components/farmer/FarmerHome";

export const metadata: Metadata = { title: "Farmer dashboard" };

export default function DashboardPage() {
  return <FarmerHome />;
}

