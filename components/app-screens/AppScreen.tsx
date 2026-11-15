import Image from "next/image";

export type ScreenName = "login" | "dashboard" | "farms" | "earnings" | "notifications";

const previews: Record<ScreenName, string> = {
  login: "/previews/crops.png",
  dashboard: "/previews/farm.png",
  farms: "/previews/crops.png",
  earnings: "/previews/comparison.png",
  notifications: "/previews/rotation.png",
};

export function AppScreen({ name }: { name: ScreenName }) {
  return <Image src={previews[name]} alt="" width={780} height={1688} className="h-full w-full object-cover object-top" loading="eager" unoptimized />;
}
