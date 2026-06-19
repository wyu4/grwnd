"use server";

import { createClient, PostgrestError } from "@supabase/supabase-js";
import { FEED_PAGE_SIZE, SUPABASE_KEY, SUPABASE_URL } from "../environment";
import { Database } from "@/types/database.types";
import { auth } from "../authentication/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type DatabaseClient = ReturnType<typeof createSupabase>;

const defaultISO = new Date().toISOString();

const supabaseError = (error: PostgrestError) =>
  console.error(`[POSTGRE-${error.code}] ${error.message}`);

const DEFAULT_PUBLIC_PROFILE: Database["public"]["Tables"]["public_profile"]["Row"] = {
  id: "err",
  description: "???",
  first: "???",
  last: "???",
  github_user: "",
  icon: "/grwnd-light.svg",
  last_updated: defaultISO,
  role: "",
  default_name: "...",
  last_post: defaultISO,
};

const generateRandomString = (length = 12) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
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
 * Checks if a session ID matches the user ID
 * @param sessionId Session ID
 * @param userId User ID
 * @param database Optional pre-created database client
 * @returns `true` or `false`
 */
async function sessionValid(
  sessionId: string,
  userId: string,
  database: DatabaseClient | void,
) {
  if (!database) {
    database = createSupabase();
  }
  const { data: session, error: sessionError } = await database
    .from("session")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (sessionError) {
    supabaseError(sessionError);
    return false;
  }

  return session.userId === userId;
}

/**
 * Get the public profile of a user
 * @param id ID to lookup
 * @param [skipUserCheck=false] Whether or not to skip the user existance check
 * @returns The user's public profile, or a default one if an error occurs
 */
export async function getPublicProfile(
  id: string,
  skipUserCheck: boolean = false,
  database: DatabaseClient | void,
) {
  if (!database) {
    database = createSupabase();
  }

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

/**
 * Creates a post under the authenticated user's name
 * @param title Post title
 * @param description Post description
 * @param demo Post demo link
 */
export async function createPost(
  title: string,
  description: string,
  demo: string | undefined,
) {
  if (!title || !description) return false;
  const h = await headers();
  const session = await auth.api.getSession({
    headers: h,
  });
  if (!session) return false;

  const sessionId = session.session.id;
  const userId = session.user.id;
  const database = createSupabase();

  if (!(await sessionValid(sessionId, userId, database))) {
    await auth.api.signOut({ headers: h });
    redirect("/dashboard");
  }

  let postId: string | undefined = undefined;
  while (postId === undefined) {
    postId = generateRandomString();
    const { data: exists } = await database
      .from("post")
      .select("*")
      .eq("id", postId)
      .maybeSingle();
    if (exists) postId = undefined;
  }

  const { error: postError } = await database.from("post").insert({
    id: postId,
    title: title,
    description: description,
    author: userId,
    created_at: new Date().toISOString(),
    demo: demo,
  });

  if (postError) {
    supabaseError(postError);
    return false;
  }
  return true;
}

/**
 * Get a list of posts and the authors
 * @param page Page number
 * @returns Posts and authors
 */
export async function getPosts(page: number = 0) {
  const database = createSupabase();
  const from = page * FEED_PAGE_SIZE;
  const to = from + FEED_PAGE_SIZE - 1;

  const {
    data: posts,
    error: postsError,
    count: postsCount,
  } = await database
    .from("post")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (postsError) {
    supabaseError(postsError);
    return;
  }

  const authors: Record<string, Omit<PostAuthor, "id">> = {};
  for (const p of posts) {
    const id = p.author;
    if (!id || authors[id]) continue;
    const { data, error } = await database
      .from("public_profile")
      .select("default_name, icon, role")
      .eq("id", id)
      .single();
    if (error) {
      supabaseError(error);
      continue;
    }
    if (!data) {
      authors[id] = {
        icon: "/grwnd-light.svg",
        label: "...",
        username: "...",
      };
      continue;
    }
    authors[id] = {
      icon: data.icon,
      label: data.role ?? "",
      username: data.default_name,
    };
  }

  return {
    posts: posts as Database["public"]["Tables"]["post"]["Row"][],
    authors: authors,
  };
}
