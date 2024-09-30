import { IFollower }          from "../types/follower.interface";
import UserDetailsDto         from "./user-details.dto";
import { Exclude, Expose }    from "class-transformer";
import { IsNotEmpty, IsUUID } from "class-validator";

class FollowerDto extends UserDetailsDto {
  @Exclude({ toPlainOnly: true })
  private follower_id: number;

  @Expose()
  @IsNotEmpty({ message: "follower UUID is required" })
  @IsUUID(4, { message: "invalid UUID" })
  private follower_uuid: any;

  constructor(
    follower_id: number,
    follower_uuid: any,
    username: string,
    first_name?: string | null,
    last_name?: string | null,
    avatar_url?: string | null
  ) {
    super(username, first_name, last_name, avatar_url);
    this.follower_id = follower_id;
    this.follower_uuid = follower_uuid;
  }

  getFollowers(): IFollower {
    return {
      followerUuid: this.follower_uuid,
      username: this.username,
      firstName: this.first_name ?? null,
      lastName: this.last_name ?? null,
      avatarUrl: this.avatar_url ?? null,
    };
  }

  // getters
  public getFollowerId(): number {
    return this.follower_id;
  }

  public getFollowerUuid(): any {
    return this.follower_uuid;
  }

  // setters
  public setFollowerId(follower_id: number): void {
    this.follower_id = follower_id;
  }

  public setFollowerUuid(follower_uuid: any): void {
    this.follower_uuid = follower_uuid;
  }
}

export default FollowerDto;