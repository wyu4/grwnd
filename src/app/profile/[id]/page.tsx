import { auth } from "@/utils/authentication/server";
import ProfilePage from "./components/profile-page";
import { headers } from "next/headers";
import { createPageMetadata } from "@/utils/metadata-helpers";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ({ params }: Props) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { id: queriedId } = await params;

  const loggedIn = session !== null;
  const isQuerier = loggedIn && queriedId === session.user.id;

  let data: PublicUser = {
    username: session?.user.name ?? "???",
    icon: session?.user.image ?? "???",
    label: "???",
  };

  return <ProfilePage isLoggedIn={loggedIn} isQuerier={isQuerier} data={data} />;
}

export const metadata = createPageMetadata("Profile");
