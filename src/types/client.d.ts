/** A user row in the database */
declare type UserClient = {
  id: string;
  username: string | null;
  updated_at: string | null;
  joined_at: string | null;
};

/** The public user data required to sign a post */
declare type PostAuthor = {
  id: string;
  username: string;
  icon: string;
  label: string;
};

/**
 * A row in the public_profile table
 */
declare type PublicProfile = {
  id: string;
  first: string;
  last: string;
  description: string;
  role: string;
  last_updated: string;
  icon: string;
  github_user: string;
};
