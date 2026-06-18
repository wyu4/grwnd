import { createClient, PostgrestError } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "../environment";
import { Database } from "@/types/database.types";

type DatabaseClient = ReturnType<typeof createSupabase>;

const supabaseError = (error: PostgrestError) =>
  console.error(`[POSTGRE-${error.code}] ${error.message}`);

const DEFAULT_PUBLIC_PROFILE: Database["public"]["Tables"]["public_profile"]["Row"] = {
  id: "err",
  description: "???",
  first: "???",
  last: "???",
  github_user: "",
  icon: "/grwnd-light.svg",
  last_updated: new Date().toISOString(),
  role: "",
  default_name: "...",
};

/**
 * Create a new Supabase client with the proper authentication
 * @returns Supabase client
 */
function createSupabase() {
  return createClient<Database>(SUPABASE_URL, SUPABASE_KEY);
}

/**
 * Checks if a user was registered and assigned an ID
 * @param id ID to check
 * @param database Optional pre-created database client
 * @returns `true` or `false`
 */
async function userExists(id: string, database: DatabaseClient | void) {
  if (!database) {
    database = createSupabase();
  }
  const { data: user, error: userError } = await database
    .from("user")
    .select("*")
    .eq("id", id)
    .single();

  // console.log(user);

  if (userError) {
    supabaseError(userError);
    return false;
  }
  return !!user;
}

/**
 * Get the public profile of a user
 * @param id ID to lookup
 * @param [skipUserCheck=false] Whether or not to skip the user existance check
 * @returns The user's public profile, or a default one if an error occurs
 */
export async function getPublicProfile(id: string, skipUserCheck: boolean = false) {
  const database = createSupabase();

  if (!skipUserCheck && !(await userExists(id, database))) return DEFAULT_PUBLIC_PROFILE;

  const { data: profile, error: profileError } = await database
    .from("public_profile")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (profileError) {
    supabaseError(profileError);
    return DEFAULT_PUBLIC_PROFILE;
  }

  return profile ?? DEFAULT_PUBLIC_PROFILE;
}
