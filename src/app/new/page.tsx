import { auth } from "@/utils/authentication/server";
import { headers } from "next/headers";
import { createPageMetadata } from "@/utils/metadata-helpers";
import { redirect } from "next/navigation";
import CreatePage from "./components/create-page";

export default async function () {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session === null) {
    redirect("/dashboard");
  }
  return <CreatePage />;
}

export const metadata = createPageMetadata("Feed");
