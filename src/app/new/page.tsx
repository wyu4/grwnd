import { auth } from "@/utils/authentication/server";
import { headers } from "next/headers";
import { createPageMetadata } from "@/utils/metadata-helpers";
import { redirect } from "next/navigation";
import PostPage from "./components/post-page";

export default async function () {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session === null) {
    redirect("/dashboard");
  }
  return <PostPage />;
}

export const metadata = createPageMetadata("Feed");
