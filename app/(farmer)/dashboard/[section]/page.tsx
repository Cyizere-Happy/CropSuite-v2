import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Dashboard } from "@/components/farmer/Dashboard";
import { dashboardSections } from "@/lib/farmer/dashboard";

type Props = PageProps<"/dashboard/[section]">;

export function generateStaticParams() {
  return dashboardSections.filter(({ id }) => id).map(({ id }) => ({ section: id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  return { title: dashboardSections.find(({ id }) => id === section)?.title ?? "Farmer dashboard" };
}

export default async function DashboardSectionPage({ params }: Props) {
  const { section } = await params;
  const current = dashboardSections.find(({ id }) => id === section);
  if (!current) notFound();
  return <Dashboard key={current.id} section={current.id} />;
}

