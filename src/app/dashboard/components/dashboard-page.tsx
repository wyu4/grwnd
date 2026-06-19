"use client";

import { useEffect, useRef, useState } from "react";
import TopBar from "../../reusable/top-bar";
import { useInnerWindowEffect } from "@/utils/hooks/window-hooks";
import FeedPost from "./feed-post";
import { PageType } from "@/types/global";
import LoadingScreen from "@/app/reusable/loading";
import { Database } from "@/types/database.types";
import { getPosts } from "@/utils/database/database";

const TestUser: PostAuthor = {
  id: "skjdbkajlfbelkwjf",
  username: "null",
  icon: "https://avatars.githubusercontent.com/u/139521392?v=4",
  label: "CEO @ grwnd",
};

const TestTime = new Date(1781413718000);

export default function DashboardPage({ isLoggedIn }: PageType) {
  const topBarRef = useRef<HTMLDivElement>(null);
  const [topBarHeight, setTopBarHeight] = useState(0);
  const [navigating, setNavigating] = useState(false);
  const [posts, setPosts] = useState<Database["public"]["Tables"]["post"]["Row"][]>();
  const [authors, setAuthors] = useState<Record<string, Omit<PostAuthor, "id">>>();

  useInnerWindowEffect(() => {
    if (topBarRef.current === null) return;
    setTopBarHeight(topBarRef.current.getBoundingClientRect().height);
  }, []);

  useEffect(() => {
    getPosts(0).then((result) => {
      if (!result) return;
      console.log(result);
      setPosts(result.posts);
      setAuthors(result.authors);
    });
  }, []);

  return (
    <div
      className="relative bg-secondary min-h-screen flex flex-col justify-start items-center overflow-hidden"
      style={{ paddingTop: topBarHeight }}
    >
      <LoadingScreen hidden={!navigating} />
      <TopBar
        ref={topBarRef}
        isLoggedIn={isLoggedIn}
        onNavigate={() => setNavigating(true)}
      />
      <div className="relative flex flex-col justify-start items-center p-4 gap-2 w-full h-full md:w-1/2">
        {posts &&
          authors &&
          posts.map((p) => {
            const u = authors[p.author ?? ""];
            return (
              <FeedPost
                key={"feed-" + p.id}
                author={{ id: p.author ?? "", ...u }}
                title={p.title}
                description={p.description}
                uploadDate={new Date(p.created_at)}
                onNavigate={() => setNavigating(true)}
              />
            );
          })}
      </div>
    </div>
  );
}
