"use client";

import TopBar from "./top-bar";

export default function DashboardPage({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div className="relative bg-primary min-h-screen flex flex-col justify-center items-center">
      <TopBar isLoggedIn={isLoggedIn} />
    </div>
  );
}
