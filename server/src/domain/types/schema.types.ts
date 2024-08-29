import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Comments {
  id: Generated<number>;
  uuid: Generated<any>;
  post_id: number;
  user_id: number;
  comment: string;
  created_at: Generated<Date | null>;
}

export interface ConversationMembers {
  id: Generated<number>;
  uuid: Generated<any>;
  conversation_id: number;
  user_id: number;
  joined_at: Generated<Date | null>;
}

export interface Conversations {
  id: Generated<number>;
  uuid: Generated<any>;
  created_at: Generated<Date | null>;
}

export interface Followers {
  followed_id: number;
  follower_id: number;
  created_at: Generated<Date | null>;
}

export interface Likes {
  id: Generated<number>;
  uuid: Generated<any>;
  post_id: number;
  user_id: number;
  created_at: Generated<Date | null>;
}

export interface Messages {
  uuid: Generated<any>;
  id: Generated<number>;
  conversation_id: number;
  sender_id: number;
  text_message: string;
  time_sent: Generated<Date | null>;
}

export interface Posts {
  id: Generated<number>;
  uuid: Generated<any>;
  image_id: string;
  image_url: string | null;
  user_id: number;
  caption: string | null;
  privacy_level: Generated<string | null>;
  created_at: Generated<Date | null>;
}

export interface ResetPasswordToken {
  id: Generated<number>;
  uuid: Generated<any>;
  reference_token: string;
  encrypted: string;
  created_at: Generated<Date | null>;
}

export interface SearchHistory {
  id: Generated<number>;
  uuid: Generated<any>;
  searcher_id: number;
  searched_id: number;
  created_at: Generated<Date | null>;
}

export interface Users {
  id: Generated<number>;
  uuid: Generated<any>;
  username: string;
  email: string;
  password: string;
  first_name: string | null;
  last_name: string | null;
  roles: string | null;
  avatar_url: string | null;
  birthday: string | null;
  age: number | null;
  created_at: Generated<Date | null>;
}

export interface DB {
  users: Users;
  followers: Followers;
  search_history: SearchHistory;
  conversations: Conversations;
  conversation_members: ConversationMembers;
  messages: Messages;
  posts: Posts;
  likes: Likes;
  comments: Comments;
  reset_password_token: ResetPasswordToken;
}
