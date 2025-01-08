import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import PredictionDashboard from "@/components/dashboard"

export default async function Dashboard() {
  const data = await getServerSession(authOptions);
  if (!data) {
    redirect("/login");
  }
  const user = await prisma.user.findUnique({
    where: { id: Number(data.user.id) },
  });
  if (user?.isApproved === false) {
    redirect("/access-denied");
  }

  return (<PredictionDashboard />)
}
