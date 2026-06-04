"use client";
import { signOut } from "@/utils/authentication/client";

export default function DashboardPage() {
  return (
    <div className="bg-primary flex flex-col justify-center items-center">
      <button onClick={signOut} className="bg-font-primary text-primary p-4 rounded-2xl">
        Sign Out
      </button>
    </div>
  );
}
