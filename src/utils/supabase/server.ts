"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "../environment";
import { redirect } from "next/navigation";

/**
 * Creates a Supabase Client for use on the server-side of a server-side rendering (SSR) framework.
 * @returns A Supabase Client object
 */
export async function createClient() {
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
    redirect("/error");
  }
  if (data.user) {
    const current = new Date().toISOString();
    await client.from("user_profiles").insert({
      id: data.user.id,
      username: entry.get("username"),
      joined_at: current,
      updated_at: current,
    });
  } else {
    console.error("Could not sign up user onto profile table, no user data received");
    redirect("/error");
  }
  redirect("/dashboard");
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
    redirect("/error");
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
