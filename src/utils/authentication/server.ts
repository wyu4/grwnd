import { betterAuth } from "better-auth";
import {
  DATABASE_CONNECTION_URL,
  GITHUB_OAUTH_ID,
  GITHUB_OAUTH_SECRET,
} from "../environment";
import { Pool } from "pg";
import { headers } from "next/headers";
import { apiKey } from "@better-auth/api-key";

const database = new Pool({
  connectionString: DATABASE_CONNECTION_URL,
});

/** Authentication client [SERVER-SIDE] */
export const auth = betterAuth({
  database: database,
  socialProviders: {
    github: {
      clientId: GITHUB_OAUTH_ID,
      clientSecret: GITHUB_OAUTH_SECRET,
    },
  },
  plugins: [apiKey()],
});

/**
 * Get the session of the authenticated user (if it exists)
 * @returns Session, otherwise `null` if unauthenticated
 */
export async function getServerAuthSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

/**
 * Get's the authenticated user's GitHub token
 * @returns Token (string), otherwise `null` if unauthenticated
 */
export async function getGitHubSessionToken() {
  const session = await getServerAuthSession();
  if (!session) return null;

  const account = await auth.api.listUserAccounts({
    headers: await headers(),
  });

  const result = await database.query(
    `SELECT "accessToken" FROM account WHERE "userId" = $1 AND "providerId" = 'github'`,
    [session.user.id],
  );

  return result.rows[0]?.accessToken ?? null;
}
