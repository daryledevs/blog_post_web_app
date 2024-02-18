import { PersonType } from "./types";

interface IEOpenConversation extends PersonType {
  conversation_id: number;
  user_one: number;
  user_two: number;
}

export type { IEOpenConversation };