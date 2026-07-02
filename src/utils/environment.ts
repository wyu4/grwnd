export const GITHUB_OAUTH_ID = process.env.GITHUB_OAUTH_ID ?? "";
export const GITHUB_OAUTH_SECRET = process.env.GITHUB_OAUTH_SECRET ?? "";
export const DATABASE_CONNECTION_URL = process.env.DATABASE_CONNECTION_URL ?? "";
export const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
export const SUPABASE_KEY = process.env.SUPABASE_KEY ?? "";
export const FEED_PAGE_SIZE = +(process.env.FEED_PAGE_SIZE ?? 15);
export const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL ?? "";

export const POST_WEBHOOK = process.env.POST_WEBHOOK;
export const EDIT_WEBHOOK = process.env.EDIT_WEBHOOK;
export const TRASH_WEBHOOK = process.env.TRASH_WEBHOOK;
export const ERROR_WEBHOOK = process.env.ERROR_WEBHOOK;

export const NEXT_PUBLIC_TITLE_LIMIT = +(process.env.NEXT_PUBLIC_TITLE_LIMIT ?? 300);
export const NEXT_PUBLIC_DESC_LIMIT = +(process.env.NEXT_PUBLIC_DESC_LIMIT ?? 5000);

/**
 * Get the value of a CSS variable
 * @param name Name of the variable (ie: --name-of-variable)
 * @returns Value set inside of the CSS
 */
export const getVar = (name: string) => {
  const style = getComputedStyle(document.documentElement);
  return style.getPropertyValue(name).trim();
};
