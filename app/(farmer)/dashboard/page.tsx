import type { Metadata } from "next";
import { Dashboard } from "@/components/farmer/Dashboard";

export const metadata: Metadata = { title: "Farmer dashboard" };

export default function DashboardPage() {
  return <Dashboard section="" />;
}

