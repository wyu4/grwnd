"use server";

import { createClient, PostgrestError } from "@supabase/supabase-js";
import {
  BETTER_AUTH_URL,
  EDIT_WEBHOOK,
  ERROR_WEBHOOK,
  FEED_PAGE_SIZE,
  POST_WEBHOOK,
  SUPABASE_KEY,
  SUPABASE_URL,
  TRASH_WEBHOOK,
} from "../environment";
import { Database } from "@/types/database.types";
import { auth } from "../authentication/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type DatabaseClient = ReturnType<typeof createSupabase>;

const defaultISO = new Date().toISOString();

/**
 * Creates a POST request to a webhook URL
 * @param url Webhook URL. This function self-returns if the URL is undefined.
 * @param payload Webhook payload
 * @returns Promise containing the webhook task
 */
const createWebhook = (url: string | undefined = undefined, payload: any) => {
  if (!url) return;
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
};

const supabaseError = (error: PostgrestError) => {
  console.error(
    `[POSTGRE-${error.code}] ${error.message}. Webhook will ${!ERROR_WEBHOOK ? "not " : ""}be sent.`,
  );
  createWebhook(ERROR_WEBHOOK, {
    content: `**[❌ DATABASE ERROR][POSTGRE-${error.code}]:** "${error.message}"\n\`\`\`${error.details}\`\`\``,
  });
};

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

/**
 * Checks if a URL is valid (http or https protocol)
 * @param s Unknown URL
 * @returns Boolean value
 */
const validateURL = (s: string) => {
  try {
    const url = new URL(s);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
};

/**
 * Generates a random string (numbers and letters) of n length. Can be used to generate keys or IDs.
 * @param length n
 * @returns Random string
 */
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
    .maybeSingle();

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
async function sessionValid(sessionId: string, userId: string, database: DatabaseClient | void) {
  if (!database) {
    database = createSupabase();
  }
  const { data: session, error: sessionError } = await database
    .from("session")
    .select("*")
    .eq("id", sessionId)
    .maybeSingle();

  if (sessionError) {
    supabaseError(sessionError);
    return false;
  }

  return (
    session && session.userId === userId && new Date(session.expiresAt).getTime() >= Date.now()
  );
}

/**
 * Get the public profile of a user
 * @param id ID to lookup
 * @param [skipUserCheck=false] Whether or not to skip the user existance check
 * @returns The user's public profile, or a default one if an error occurs
 */
export async function getPublicProfile(id: string) {
  const database = createSupabase();

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
export async function createPost(title: string, description: string, demo: string | undefined) {
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
    const { data: exists } = await database.from("post").select("*").eq("id", postId).maybeSingle();
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

  await createWebhook(POST_WEBHOOK, {
    embeds: [
      {
        color: 0x00ff00,
        title: `📰 ${title}`,
        description: `**Author:** \`${session.user.name}\` \`[${userId}]\`\n**Post ID:** \`${postId}\` \n**Demo:** \`${demo !== undefined ? demo : "no demo"}\`\n\`\`\`${description}\`\`\``,
        url: `${BETTER_AUTH_URL}/post/${postId}`,
        footer: {
          text: "NEW POST",
        },
      },
    ],
  });

  return postId;
}

/**
 * Updates a post under the authenticated user's name
 * @param postId Post ID
 * @param title Post title
 * @param description Post description
 * @param demo Post demo link
 */
export async function updatePost(
  postId: string,
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

  const { data: author, error } = await database
    .from("post")
    .select("author")
    .eq("id", postId)
    .single();

  if (error) {
    supabaseError(error);
    return false;
  }

  if (userId !== author.author) {
    await auth.api.signOut({ headers: h });
    redirect("/dashboard");
  }

  const { error: updateError } = await database
    .from("post")
    .update({
      title: title,
      description: description,
      last_edited: new Date().toISOString(),
      demo: demo,
    })
    .eq("id", postId);

  if (updateError) {
    supabaseError(updateError);
    return false;
  }

  await createWebhook(EDIT_WEBHOOK, {
    embeds: [
      {
        color: 0xffff00,
        title: `📝 Edited: '${title}'`,
        description: `**Author:** \`${session.user.name}\` \`[${userId}]\`\n**Post ID:** \`${postId}\` \n**Demo:** \`${demo !== undefined ? demo : "no demo"}\`\n\`\`\`${description}\`\`\``,
        url: `${BETTER_AUTH_URL}/post/${postId}`,
        footer: {
          text: "EDIT POST",
        },
      },
    ],
  });
  return true;
}

/**
 * Deletes a post under the authenticated user's name
 * @param postId Post ID
 */
export async function deletePost(postId: string) {
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

  const { data: post, error } = await database.from("post").select("*").eq("id", postId).single();

  if (error) {
    supabaseError(error);
    return false;
  }

  if (!post) return false;

  if (userId !== post.author) {
    await auth.api.signOut({ headers: h });
    redirect("/dashboard");
  }

  const { error: deleteError } = await database.from("post").delete().eq("id", postId);

  if (deleteError) {
    supabaseError(deleteError);
    return false;
  }

  await createWebhook(TRASH_WEBHOOK, {
    embeds: [
      {
        color: 0xff0000,
        title: `🗑️ Deleted: '${post.title}'`,
        description: `**Author:** \`${session.user.name}\` \`[${userId}]\`\n**Post ID:** \`${postId}\` \n**Demo:** \`${post.demo !== undefined ? post.demo : "no demo"}\`\n\`\`\`${post.description}\`\`\``,
        url: `${BETTER_AUTH_URL}/post/${postId}`,
        footer: {
          text: "DELETE POST",
        },
      },
    ],
  });
  return true;
}

/**
 * Get a specific post from its ID
 * @param id Post ID
 * @returns Information about the post and its author
 */
export async function getPost(id: string) {
  const database = createSupabase();
  const { data: post, error: postError } = await database
    .from("post")
    .select("*")
    .eq("id", id)
    .single();

  if (postError) {
    supabaseError(postError);
    return null;
  }

  if (!post || !post.author) return null;

  const { data: author, error: authorError } = await database
    .from("public_profile")
    .select("default_name, icon, role")
    .eq("id", post.author)
    .single();

  if (authorError) {
    supabaseError(authorError);
    return null;
  }

  if (!author) return null;

  return {
    post: post as Database["public"]["Tables"]["post"]["Row"],
    author: author,
  };
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

  const { data: posts, error: postsError } = await database
    .from("post")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .neq("id", "test")
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
