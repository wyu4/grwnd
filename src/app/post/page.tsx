import { createPageMetadata } from "@/utils/metadata-helpers";
import { redirect } from "next/navigation";

export default async function () {
  redirect("/dashboard");
}

export const metadata = createPageMetadata("Post");
