"use client";

import { apiKeyClient } from "@better-auth/api-key/client";
import { createAuthClient } from "better-auth/react";
import { redirect } from "next/navigation";

/** Authentication client [CLIENT-SIDE] */
export const authClient = createAuthClient({
  plugins: [apiKeyClient()],
});

/**
 * Prompts the user to log in using GitHub
 * @returns Promise containing the signin data
 */
export function signInGitHub() {
  return authClient.signIn.social({
    provider: "github",
    callbackURL: "/dashboard",
    scopes: ["read:user", "user:email", "public_repo"], // whatever scopes you need
  });
}

/**
 * Function that logs a client out
 */
export async function signOut() {
  await authClient.signOut();
  redirect("/auth");
}
