import { getServerAuthSession } from "@/utils/authentication/server";
import DashboardPage from "./components/dashboard-page";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/auth");
  }
  return <DashboardPage />;
}
