import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LandingClient from "@/components/layout/LandingClient";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/studio");

  return <LandingClient />;
}
