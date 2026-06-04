import { createAuthClient } from "better-auth/client";
import { redirect } from "next/navigation";

/** Authentication client [CLIENT-SIDE] */
export const authClient = createAuthClient();

/**
 * Function that logs a client out
 */
export async function signOut() {
  await authClient.signOut();
  redirect("/auth");
}
