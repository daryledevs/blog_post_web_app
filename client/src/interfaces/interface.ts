import { PersonType } from "./types";

interface IEPost {
  post_id: number;
  image_id: string;
  user_id: number;
  followed_id: number;
  follower_id: number;
  caption: string;
  image_url: string;
  count: number; 
  privacy_level: string;
  post_date: string;
}

interface IEOpenConversation extends PersonType {
  conversation_id: number;
  user_one: number;
  user_two: number;
}

export type { IEPost, IEOpenConversation };