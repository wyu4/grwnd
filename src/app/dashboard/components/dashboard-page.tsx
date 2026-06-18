"use client";

import { useRef, useState } from "react";
import TopBar from "../../reusable/top-bar";
import { useInnerWindowEffect } from "@/utils/hooks/window-hooks";
import FeedPost from "./feed-post";
import { PageType } from "@/types/global";
import LoadingScreen from "@/app/reusable/loading";

const TestUser: PublicUser = {
  username: "null",
  icon: "https://avatars.githubusercontent.com/u/139521392?v=4",
  label: "CEO @ grwnd",
};

const TestTime = new Date(1781413718000);

export default function DashboardPage({ isLoggedIn }: PageType) {
  const topBarRef = useRef<HTMLDivElement>(null);
  const [topBarHeight, setTopBarHeight] = useState(0);
  const [loading, setLoading] = useState(false);

  useInnerWindowEffect(() => {
    if (topBarRef.current === null) return;
    setTopBarHeight(topBarRef.current.getBoundingClientRect().height);
  }, []);

  return (
    <div
      className="relative bg-secondary min-h-screen flex flex-col justify-start items-center overflow-hidden"
      style={{ paddingTop: topBarHeight }}
    >
      <LoadingScreen hidden={!loading} />
      <TopBar
        ref={topBarRef}
        isLoggedIn={isLoggedIn}
        onNavigate={() => setLoading(true)}
      />
      <div className="relative flex flex-col justify-start items-center p-4 gap-2 w-full h-full md:w-1/2">
        <FeedPost
          author={TestUser}
          title="This is a post"
          description="This post is about this awesome project called Grwnd, where developers can post about projects worth knowing."
          uploadDate={TestTime}
        />
        <FeedPost
          author={TestUser}
          title="This is a post"
          description="This post is about this awesome project called Grwnd, where developers can post about projects worth knowing."
          uploadDate={TestTime}
        />
        <FeedPost
          author={TestUser}
          title="This is a post"
          description="This post is about this awesome project called Grwnd, where developers can post about projects worth knowing."
          uploadDate={TestTime}
        />
        <FeedPost
          author={TestUser}
          title="This is a post"
          description="This post is about this awesome project called Grwnd, where developers can post about projects worth knowing."
          uploadDate={TestTime}
        />
        <FeedPost
          author={TestUser}
          title="This is a post"
          description="This post is about this awesome project called Grwnd, where developers can post about projects worth knowing."
          uploadDate={TestTime}
        />
        <FeedPost
          author={TestUser}
          title="This is a post"
          description="This post is about this awesome project called Grwnd, where developers can post about projects worth knowing."
          uploadDate={TestTime}
        />
        <FeedPost
          author={TestUser}
          title="This is a post"
          description="This post is about this awesome project called Grwnd, where developers can post about projects worth knowing."
          uploadDate={TestTime}
        />
        <FeedPost
          author={TestUser}
          title="This is a post"
          description="This post is about this awesome project called Grwnd, where developers can post about projects worth knowing."
          uploadDate={TestTime}
        />
        <FeedPost
          author={TestUser}
          title="This is a post"
          description="This post is about this awesome project called Grwnd, where developers can post about projects worth knowing."
          uploadDate={TestTime}
        />
        <FeedPost
          author={TestUser}
          title="This is a post"
          description="This post is about this awesome project called Grwnd, where developers can post about projects worth knowing."
          uploadDate={TestTime}
        />
        <FeedPost
          author={TestUser}
          title="This is a post"
          description="This post is about this awesome project called Grwnd, where developers can post about projects worth knowing."
          uploadDate={TestTime}
        />
        <FeedPost
          author={TestUser}
          title="This is a post"
          description="This post is about this awesome project called Grwnd, where developers can post about projects worth knowing."
          uploadDate={TestTime}
        />
        <FeedPost
          author={TestUser}
          title="This is a post"
          description="This post is about this awesome project called Grwnd, where developers can post about projects worth knowing."
          uploadDate={TestTime}
        />
        <FeedPost
          author={TestUser}
          title="This is a post"
          description="This post is about this awesome project called Grwnd, where developers can post about projects worth knowing."
          uploadDate={TestTime}
        />
      </div>
    </div>
  );
}
