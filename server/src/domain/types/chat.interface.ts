import { IUserDetails } from "./user.interface";

export interface IChat extends Omit<IUserDetails, "age" | "birthday"> {
  uuid: any;
  conversationUuid: any;
  userUuid: any;
  username: string;
  textMessage: string | null;
  timeSent: Date;
}
