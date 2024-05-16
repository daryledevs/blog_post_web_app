import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { PersonType } from "./types";
import { SerializedError } from "@reduxjs/toolkit";
import { IEMessageState } from "@/redux/slices/messageSlice";
import { IESidebarState } from "@/redux/slices/sidebarSlice";

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

interface IEUserState {
  [key: string]: any;
  user_id: number;
  avatar_url: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  roles: string;
  age: number;
  birthday: string;
  fetch_status: FetchBaseQueryError | SerializedError;
}

interface IEOpenConversation extends PersonType {
  conversation_id: number;
  user_one_id: number;
  user_two_id: number;
}

interface IEReduxState {
  messages: IEMessageState;
  sidebar: IESidebarState;
};

export type { IEPost, IEUserState, IEOpenConversation, IEReduxState };