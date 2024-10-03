import { IUserDetails } from "./user.interface";

export interface IChat extends Omit<IUserDetails, "age" | "birthday"> {
  id: number;
  uuid: any;
  conversationId: number;
  conversationUuid: any;
  userUuid: any;
  username: string;
  textMessage: string | null;
  timeSent: Date;
}
