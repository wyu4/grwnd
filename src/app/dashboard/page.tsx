import { signOut } from "@/utils/supabase/server";

export default function Dashboard() {
  return (
    <div className="bg-primary flex flex-col justify-center items-center">
      <button onClick={signOut} className="bg-font-primary text-primary p-4 rounded-2xl">
        Sign Out
      </button>
    </div>
  );
}
