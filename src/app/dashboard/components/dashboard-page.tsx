"use client";

import { useEffect, useRef, useState } from "react";
import TopBar from "./top-bar";
import { useInnerWindowEffect } from "@/utils/hooks/window-hooks";
import FeedPost from "./feed-post";

const TestUser: PublicUser = {
  username: "null",
  icon: "https://avatars.githubusercontent.com/u/139521392?v=4",
  label: "CEO @ grwnd",
};

const TestTime = new Date(1781413718000);

export default function DashboardPage({ isLoggedIn }: { isLoggedIn: boolean }) {
  const topBarRef = useRef<HTMLDivElement>(null);
  const [topBarHeight, setTopBarHeight] = useState(0);

  useInnerWindowEffect(() => {
    if (topBarRef.current === null) return;
    setTopBarHeight(topBarRef.current.getBoundingClientRect().height);
  }, []);

  return (
    <div
      className="relative bg-secondary min-h-screen flex flex-col justify-start items-center"
      style={{ paddingTop: topBarHeight }}
    >
      <TopBar ref={topBarRef} isLoggedIn={isLoggedIn} />
      <div className="relative flex flex-col justify-start items-center p-4 gap-2 min-h-full w-1/3">
        <FeedPost
          author={TestUser}
          title="This is a post"
          description="This post is about  this awesome project called Grwnd, where developers can post about projects worth knowing."
          uploadDate={TestTime}
        />
      </div>
    </div>
  );
}
