"use client";

import TopBar from "./top-bar";

export default function DashboardPage() {
  return (
    <div className="relative bg-primary flex flex-col justify-center items-center">
      {/* <button onClick={signOut} className="bg-font-primary text-primary p-4 rounded-2xl">
        Sign Out
      </button> */}
      <TopBar />
    </div>
  );
}
