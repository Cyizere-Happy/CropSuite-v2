import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth/AuthScreen";
import "@/components/farmer/farmer.css";

export const metadata: Metadata = { title: "Sign in", description: "Sign in to CropSuite to start planning your season." };

export default function LoginPage() {
  return <AuthScreen mode="sign-in" />;
}

