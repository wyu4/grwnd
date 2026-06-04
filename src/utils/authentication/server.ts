import { betterAuth } from "better-auth";
import {
  DATABASE_CONNECTION_URL,
  GITHUB_OAUTH_ID,
  GITHUB_OAUTH_SECRET,
} from "../environment";
import { Pool } from "pg";

/** Authentication client [SERVER-SIDE] */
export const auth = betterAuth({
  database: new Pool({
    connectionString: DATABASE_CONNECTION_URL,
  }),
  socialProviders: {
    github: {
      clientId: GITHUB_OAUTH_ID,
      clientSecret: GITHUB_OAUTH_SECRET,
    },
  },
});
