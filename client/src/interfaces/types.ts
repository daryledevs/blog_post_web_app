import { IEUserState } from "./interface";

type PersonType = {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
};

type MessageType = {
  conversation_id: number;
  message_id: number;
  sender_id: number;
  receiver_id: number;
  text_message: string;
};

type ProfileProps = {
  user: IEUserState;
};

export type { MessageType, PersonType, ProfileProps };
