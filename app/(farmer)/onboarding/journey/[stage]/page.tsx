import { notFound } from "next/navigation";
import { FarmerGuide } from "@/components/farmer/FarmerGuide";
import { journeyStages } from "@/lib/farmer/guided";

type Props = { params: Promise<{ stage: string }>; searchParams: Promise<{ from?: string | string[]; step?: string | string[] }> };

export default async function JourneyPage({ params, searchParams }: Props) {
  const [{ stage }, { step }] = await Promise.all([params, searchParams]);
  const current = journeyStages.find((item) => item === stage);
  if (!current) notFound();
  return <FarmerGuide initialStep={current === "plan" ? 5 : step === "location" ? 1 : 0} />;
}
