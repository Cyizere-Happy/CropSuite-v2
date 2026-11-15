export const dashboardSections = [
  { id: "", title: "Dashboard", icon: "grid" },
  { id: "fields", title: "My Fields", icon: "map" },
  { id: "crop-planning", title: "Crop Planning", icon: "sprout" },
  { id: "assessments", title: "Planting Assessments", icon: "clipboard" },
  { id: "history", title: "Farm History", icon: "history" },
  { id: "reports", title: "Reports", icon: "chart" },
  { id: "settings", title: "Settings", icon: "settings" },
  { id: "help", title: "Help", icon: "help" },
] as const;

export type DashboardSection = (typeof dashboardSections)[number]["id"];

export function dashboardHref(section: DashboardSection) {
  return section ? "/dashboard/" + section : "/dashboard";
}

