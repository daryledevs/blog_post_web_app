import UserDetailsDto         from "./user-details.dto";
import { Exclude, Expose }    from "class-transformer";
import { IsNotEmpty, IsUUID } from "class-validator";

class FollowingDto extends UserDetailsDto {
  @Exclude({ toPlainOnly: true })
  private followed_id: number;

  @Expose()
  @IsNotEmpty({ message: "followed UUID is required" })
  @IsUUID(4, { message: "invalid UUID" })
  private followed_uuid: any;

  constructor(
    followed_id: number,
    followed_uuid: any,
    username: string,
    first_name?: string | null,
    last_name?: string | null,
    avatar_url?: string | null
  ) {
    super(username, first_name, last_name, avatar_url);
    this.followed_id = followed_id;
    this.followed_uuid = followed_uuid;
  }

  getFollowing() {
    return {
      followedUuid: this.followed_uuid,
      username: this.username,
      firstName: this.first_name,
      lastName: this.last_name,
      avatarUrl: this.avatar_url,
    };
  }

  // getters
  public getFollowedId(): number {
    return this.followed_id;
  }

  public getFollowedUuid(): any {
    return this.followed_uuid;
  }

  // setters
  public setFollowedId(followed_id: number): void {
    this.followed_id = followed_id;
  }

  public setFollowedUuid(followed_uuid: any): void {
    this.followed_uuid = followed_uuid;
  }
}

export default FollowingDto;