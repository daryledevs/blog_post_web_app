import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Comments {
  comment: string;
  created_at: Generated<Date | null>;
  id: Generated<number>;
  post_id: number;
  user_id: number;
  uuid: Generated<any>;
}

export interface ConversationMembers {
  conversation_id: number;
  id: Generated<number>;
  joined_at: Generated<Date | null>;
  user_id: number;
  uuid: Generated<any>;
}

export interface Conversations {
  created_at: Generated<Date | null>;
  id: Generated<number>;
  uuid: Generated<any>;
}

export interface Followers {
  created_at: Generated<Date | null>;
  followed_id: number;
  follower_id: number;
}

export interface Likes {
  created_at: Generated<Date | null>;
  id: Generated<number>;
  post_id: number;
  user_id: number;
  uuid: Generated<any>;
}

export interface Messages {
  conversation_id: number;
  id: Generated<number>;
  sender_id: number;
  text_message: string;
  time_sent: Generated<Date | null>;
  uuid: Generated<any>;
}

export interface Posts {
  caption: string | null;
  created_at: Generated<Date | null>;
  id: Generated<number>;
  image_id: string;
  image_url: string | null;
  privacy_level: Generated<string | null>;
  user_id: number;
  uuid: Generated<any>;
}

export interface ResetPasswordToken {
  created_at: Generated<Date | null>;
  encrypted: string;
  id: Generated<number>;
  user_id: number;
  uuid: Generated<any>;
}

export interface SearchHistory {
  created_at: Generated<Date | null>;
  id: Generated<number>;
  searched_id: number;
  searcher_id: number;
  uuid: Generated<any>;
}

export interface Users {
  age: number | null;
  avatar_url: string | null;
  birthday: string | null;
  created_at: Generated<Date | null>;
  email: string;
  first_name: string | null;
  id: Generated<number>;
  last_name: string | null;
  password: string;
  roles: Generated<string | null>;
  username: string;
  uuid: Generated<any>;
}

export interface DB {
  comments: Comments;
  conversation_members: ConversationMembers;
  conversations: Conversations;
  followers: Followers;
  likes: Likes;
  messages: Messages;
  posts: Posts;
  reset_password_token: ResetPasswordToken;
  search_history: SearchHistory;
  users: Users;
}
