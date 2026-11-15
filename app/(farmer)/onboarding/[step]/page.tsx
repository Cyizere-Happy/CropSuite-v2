import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Onboarding } from "@/components/farmer/Onboarding";
import { steps } from "@/lib/farmer/model";

type Props = PageProps<"/onboarding/[step]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { step } = await params;
  return { title: steps.find(({ id }) => id === step)?.label ?? "Farm setup" };
}

export default async function OnboardingPage({ params, searchParams }: Props) {
  const [{ step }, { edit }] = await Promise.all([params, searchParams]);
  const current = steps.find(({ id }) => id === step);
  if (!current) notFound();
  return <Onboarding key={current.id + String(edit)} step={current.id} editing={edit === "1"} />;
}

