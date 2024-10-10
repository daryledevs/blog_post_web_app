import { ExcludeUSerProps } from "./types";

interface IUser {
  uuid: string;
  username: string;
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  roles: string | null;
  avatarUrl: string | null;
  birthday: string | null;
  age: number | null;
  createdAt: Date | null;
}

interface IFollowers extends ExcludeUSerProps<IUser, "email"> {
  followerUuid: string;
}

interface IFollowing extends ExcludeUSerProps<IUser, "email"> {
  followedUuid: string;
}

interface ISearchHistory extends ExcludeUSerProps<IUser, "email"> {
  userUuid: string;
  searchedUuid: number;
  searcherUuid: number;
  createdAt: Date | null;
}

interface IPost {
  uuid: string;
  image_url: string | null;
  userUuid: number;
  caption: string | null;
  privacyLevel: string | null;
  createdAt: Date | null;
}

interface IConversation extends ExcludeUSerProps<IUser, "email"> {
  uuid: string;
  userUuid: string;
}

interface IBaseChat {
  uuid: string;
  conversationUuid: string;
  senderUuid: string;
  textMessage: string;
  timeSent: Date | null;
}

interface IChat extends IBaseChat, ExcludeUSerProps<IUser, "email"> {
}

interface MessageType extends Omit<IBaseChat, "uuid" | "timeSent" | "uuid"> {
  receiverUuid: string;
}

export type {
  IUser,
  IFollowers,
  IFollowing,
  ISearchHistory,
  IConversation,
  IChat,
  MessageType,
  IPost,
};
