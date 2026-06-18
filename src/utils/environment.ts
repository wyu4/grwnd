export const GITHUB_OAUTH_ID = process.env.GITHUB_OAUTH_ID ?? "";
export const GITHUB_OAUTH_SECRET = process.env.GITHUB_OAUTH_SECRET ?? "";
export const DATABASE_CONNECTION_URL = process.env.DATABASE_CONNECTION_URL ?? "";
export const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
export const SUPABASE_KEY = process.env.SUPABASE_KEY ?? "";

/**
 * Get the value of a CSS variable
 * @param name Name of the variable (ie: --name-of-variable)
 * @returns Value set inside of the CSS
 */
export const getVar = (name: string) => {
  const style = getComputedStyle(document.documentElement);
  return style.getPropertyValue(name).trim();
};
