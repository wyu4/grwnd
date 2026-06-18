import { auth } from "@/utils/authentication/server";
import ProfilePage from "./components/profile-page";
import { headers } from "next/headers";
import { createPageMetadata } from "@/utils/metadata-helpers";
import { getPublicProfile } from "@/utils/database/database";
import { Database } from "@/types/database.types";

type Props = {
  params: Promise<{ id: string }>;
};

type Result = {
  isLoggedIn: boolean;
  isQuerier: boolean;
  profile: Database["public"]["Tables"]["public_profile"]["Row"];
};

async function getUser({ params }: Props): Promise<Result> {
  const session = await auth.api.getSession({ headers: await headers() });
  const { id: queriedId } = await params;
  const loggedIn = session !== null;

  return {
    isLoggedIn: loggedIn,
    isQuerier: loggedIn && queriedId === session.user.id,
    profile: await getPublicProfile(queriedId),
  };
}

export default async function (props: Props) {
  const result = await getUser(props);
  return (
    <ProfilePage
      isLoggedIn={result.isLoggedIn}
      isQuerier={result.isQuerier}
      profile={result.profile}
    />
  );
}

export async function generateMetadata(props: Props) {
  // fetch user data here...
  const username = (await getUser(props)).profile.default_name;

  return createPageMetadata(username);
}
