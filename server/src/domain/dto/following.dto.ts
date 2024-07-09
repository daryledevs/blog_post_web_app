import FollowDto              from "./follow.dto";
import { Exclude, Expose }    from "class-transformer";
import { IsNotEmpty, IsUUID } from "class-validator";

class FollowingDto extends FollowDto {
  @Exclude({ toPlainOnly: true })
  private followed_id: number;

  @Expose()
  @IsNotEmpty({ message: "followed UUID is required" })
  @IsUUID(4, { message: "invalid UUID" })
  private followed_uuid: any;

  constructor(
    followed_id: number,
    followed_uuid: any,
    created_at: Date | null,
    username: string,
    first_name?: string | null,
    last_name?: string | null,
    avatar_url?: string | null
  ) {
    super(username, created_at, first_name, last_name, avatar_url);
    this.followed_id = followed_id;
    this.followed_uuid = followed_uuid;
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