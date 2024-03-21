import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Conversations {
  conversation_id: Generated<number>;
  user_one_id: number;
  user_two_id: number;
}

export interface Followers {
  followed_id: number;
  follower_id: number;
}

export interface Likes {
  post_id: number;
  user_id: number;
}

export interface Messages {
  conversation_id: number;
  message_id: Generated<number>;
  sender_id: number;
  text_message: string | null;
  time_sent: Generated<Date | null>;
}

export interface Posts {
  caption: string | null;
  image_id: string;
  image_url: string | null;
  post_date: Generated<Date | null>;
  post_id: Generated<number>;
  privacy_level: Generated<string | null>;
  user_id: number;
}

export interface RecentSearches {
  /**
   * Create Time
   */
  create_time: Generated<Date | null>;
  /**
   * Primary Key
   */
  recent_id: Generated<number>;
  /**
   * User ID
   */
  search_user_id: number;
  /**
   * User ID
   */
  user_id: number;
}

export interface ResetPasswordToken {
  created_at: Generated<Date | null>;
  encrypted: string | null;
  token_id: Generated<number>;
  user_id: number;
}

export interface Users {
  age: number | null;
  avatar_url: string | null;
  birthday: string | null;
  created_at: Generated<Date | null>;
  email: string;
  first_name: string | null;
  last_name: string | null;
  password: string;
  roles: Generated<string | null>;
  user_id: Generated<number>;
  username: string;
}

export interface DB {
  conversations: Conversations;
  followers: Followers;
  likes: Likes;
  messages: Messages;
  posts: Posts;
  recent_searches: RecentSearches;
  reset_password_token: ResetPasswordToken;
  users: Users;
}
