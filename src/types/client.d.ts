/** The user object in the database */
declare type UserClient = {
  id: string;
  username: string | null;
  updated_at: string | null;
  joined_at: string | null;
};

/** The public user data required to sign a post */
declare type PublicUser = {
  username: string;
  icon: string;
  label: string;
};
