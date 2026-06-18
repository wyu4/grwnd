import { auth } from "@/utils/authentication/server";
import DashboardPage from "./components/dashboard-page";
import { headers } from "next/headers";
import { createPageMetadata } from "@/utils/metadata-helpers";

export default async function () {
  const session = await auth.api.getSession({ headers: await headers() });
  return <DashboardPage isLoggedIn={session !== null} />;
}

export const metadata = createPageMetadata("Feed");
