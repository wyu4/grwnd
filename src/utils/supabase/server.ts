"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_SERVICE_KEY,
  SUPABASE_URL,
} from "../environment";
import { redirect } from "next/navigation";

/**
 * Creates a Supabase Client for use on the server-side of a server-side rendering (SSR) framework.
 * @returns A Supabase Client object
 */
export async function createClient() {
  if (SUPABASE_URL === "") {
    console.warn("Warning: Missing supabase URL");
  }
  if (SUPABASE_PUBLISHABLE_KEY === "") {
    console.warn("Warning: Missing supabase publishable key");
  }
  if (SUPABASE_SERVICE_KEY === "") {
    console.warn("Warning: Missing supabase admin key");
  }
  const clientCookies = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll: () => clientCookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) =>
          clientCookies.set(name, value, options),
        );
      },
    },
  });
}

/**
 * Check if authentication form data is invalid (missing 'email' or 'password' field)
 * @param data Form data
 * @returns `true` if invalid
 */
function formIsInvalid(data: FormData) {
  return !data.get("email") || !data.get("password");
}

/**
 * Signs up a user and redirects
 * @param entry Form data
 */
export async function signUp(entry: FormData) {
  if (formIsInvalid(entry)) {
    redirect("/auth?error=Incorrect%entry");
  }

  const client = await createClient();
  const { data, error } = await client.auth.signUp({
    email: entry.get("email") as string,
    password: entry.get("password") as string,
  });
  if (error) {
    console.error(error.message);
    return error.message;
  }
  if (data.user && data.session) {
    const current = new Date().toISOString();
    const tableError = await pushUser(client, {
      id: data.user.id,
      username: entry.get("username") as string,
      updated_at: current,
      joined_at: current,
    });
    if (tableError) {
      console.error(tableError.message);
    } else {
      redirect("/dashboard");
    }
  }
  return "We could not sign you up (it's our fault). Try again.";
}

/**
 * Signs in a user and redirects
 * @param entry Form data
 */
export async function signIn(entry: FormData) {
  if (formIsInvalid(entry)) {
    redirect("/auth?error=Incorrect%entry");
  }
  const client = await createClient();
  const { error } = await client.auth.signInWithPassword({
    email: entry.get("email") as string,
    password: entry.get("password") as string,
  });
  if (error) {
    console.error(error.message);
    return error.message;
  }

  redirect("/dashboard");
}

/**
 * Logs out a user and redirects
 */
export async function signOut() {
  const client = await createClient();
  await client.auth.signOut();
  redirect("/auth");
}

/**
 * Create an entirely new user
 * @param client Authenticated user client object
 * @param user Brand new user data
 * @returns Potential error
 */
export async function pushUser(
  client: Awaited<ReturnType<typeof createClient>>,
  user: UserClient,
) {
  const { error: tableError } = await client.from("user_profiles").insert({
    id: user.id,
    username: user.username,
    joined_at: user.joined_at,
    updated_at: user.updated_at,
  });
  return tableError;
}
