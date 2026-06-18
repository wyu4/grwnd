import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "../environment";

type DatabaseClient = ReturnType<typeof createSupabase>;

/**
 * Create a new Supabase client with the proper authentication
 * @returns Supabase client
 */
function createSupabase() {
  return createClient(SUPABASE_URL, SUPABASE_KEY);
}
