import { auth } from "@/utils/authentication/server";
import DashboardPage from "./components/dashboard-page";
import { headers } from "next/headers";

export default async function Dashboard() {
  const session = await auth.api.getSession({ headers: await headers() });
  return <DashboardPage isLoggedIn={session !== null} />;
}
