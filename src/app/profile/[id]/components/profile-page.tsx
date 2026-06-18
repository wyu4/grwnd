"use client";

import { UndraggableImage } from "@/app/reusable/Images";
import LoadingScreen from "@/app/reusable/loading";
import TopBar from "@/app/reusable/top-bar";
import { PageType } from "@/types/global";
import { useInnerWindowEffect } from "@/utils/hooks/window-hooks";
import { useEffect, useRef, useState } from "react";

type ProfilePageType = PageType & {
  data: PublicUser;
  isQuerier: boolean;
};

export default function ProfilePage({ isLoggedIn, data }: ProfilePageType) {
  const topBarRef = useRef<HTMLDivElement>(null);
  const [topBarHeight, setTopBarHeight] = useState(0);
  const [loading, setLoading] = useState(false);

  useInnerWindowEffect(() => {
    if (topBarRef.current === null) return;
    setTopBarHeight(topBarRef.current.getBoundingClientRect().height);
  }, []);

  return (
    <div
      className="relative bg-secondary h-screen flex flex-col justify-center items-center"
      style={{ paddingTop: topBarHeight }}
    >
      <LoadingScreen hidden={!loading} />
      <TopBar
        ref={topBarRef}
        isLoggedIn={isLoggedIn}
        onNavigate={() => setLoading(true)}
      />
      <div className="relative overflow-clip bg-primary border border-font-tertiary rounded-2xl flex flex-col w-1/2">
        <div className="relative flex flex-row h-50 w-full justify-center items-center overflow-clip z-1">
          <UndraggableImage
            className="aspect-square z-1 brightness-50 blur-lg w-full"
            src={data.icon}
          />
        </div>
        <div className="p-8 gap-4 z-2">
          <div className="relative w-40 rounded-full bg-primary grid place-items-center p-1 aspect-square -mt-35">
            <UndraggableImage
              src={data.icon}
              className="relative w-full rounded-full aspect-square"
            />
          </div>
          <h1>{data.username}</h1>
        </div>
      </div>
    </div>
  );
}
