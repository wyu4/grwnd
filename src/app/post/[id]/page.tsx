import { auth } from "@/utils/authentication/server";
import { headers } from "next/headers";
import { createPageMetadata } from "@/utils/metadata-helpers";
import { getPost } from "@/utils/database/database";
import PostPage from "./components/post-page";

type Props = {
  params: Promise<{ id: string }>;
};

type Result = {
  isLoggedIn: boolean;
  isQuerier: boolean;
  postData: Awaited<ReturnType<typeof getPost>>;
};

async function getData({ params }: Props): Promise<Result> {
  const session = await auth.api.getSession({ headers: await headers() });
  const { id: queriedId } = await params;
  const loggedIn = session !== null;

  return {
    isLoggedIn: loggedIn,
    isQuerier: loggedIn && queriedId === session.user.id,
    postData: await getPost(queriedId),
  };
}

export default async function (props: Props) {
  const result = await getData(props);
  return (
    <PostPage
      isLoggedIn={result.isLoggedIn}
      isQuerier={result.isQuerier}
      postData={result.postData}
    />
  );
}

export const metadata = createPageMetadata("Post");
