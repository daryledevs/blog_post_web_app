import { IUserDetails } from "./user.interface";

export interface IFollower extends Omit<IUserDetails, "age" | "birthday"> {
  followerUuid: any;
}

export interface IFollowing extends Omit<IUserDetails, "age" | "birthday"> {
  followedUuid: any;
}