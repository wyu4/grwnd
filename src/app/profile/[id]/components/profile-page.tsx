"use client";

import { UndraggableImage } from "@/app/reusable/Images";
import LoadingScreen from "@/app/reusable/loading";
import TopBar from "@/app/reusable/top-bar";
import { Database } from "@/types/database.types";
import { PageType } from "@/types/global";
import { useState } from "react";

type ProfilePageType = PageType & {
  profile: Database["public"]["Tables"]["public_profile"]["Row"];
  isQuerier: boolean;
};

export default function ProfilePage({ isLoggedIn, profile }: ProfilePageType) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="relative bg-secondary h-screen flex flex-col justify-start items-center">
      <LoadingScreen hidden={!loading} />
      <TopBar isLoggedIn={isLoggedIn} onNavigate={() => setLoading(true)} />
      <div className="absolute w-screen h-screen flex flex-col justify-center items-center">
        <div className="relative overflow-clip bg-primary border border-font-tertiary rounded-2xl flex flex-col w-1/2">
          <div className="relative flex flex-row h-50 w-full justify-center items-center overflow-clip z-1">
            <UndraggableImage
              className="aspect-square z-1 brightness-50 blur-lg w-full"
              src={profile.icon}
            />
          </div>
          <div className="p-8 gap-4 z-2">
            <div className="relative w-40 rounded-full bg-primary grid place-items-center p-1 aspect-square -mt-35">
              <UndraggableImage
                src={profile.icon}
                className="relative w-full rounded-full aspect-square"
              />
            </div>
            <h1>{profile.default_name}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
