import { IUserDetails } from "./user.interface";

export interface IConversation extends Omit<IUserDetails, "age" | "birthday">{
  uuid: any;
  userUuid: any;
  username: string;
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  avatarUrl: string | null | undefined;
  createdAt: Date | null;
}