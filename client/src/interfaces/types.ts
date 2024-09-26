import { IConversation, IUser } from "./interface";

export type ExcludeUSerProps<IUser, K extends keyof IUser = never> = Omit<
  IUser,
  "uuid" | "password" | "age" | "roles" | "birthday" | "createdAt" | K
>;

export type FollowStats = {
  followers: number;
  following: number;
};

export type SidebarState = {
  previous: string;
  current: string;
};

export type ConversationState = {
  openConversation: IConversation[];
  recipients: IUser[];
  search: string;
  newMessageTrigger: boolean;
  switchAccountTrigger: boolean;
};
export type ReduxState = {
  messages: ConversationState;
  sidebar: SidebarState;
};
