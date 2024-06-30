import { Exclude, Expose }    from "class-transformer";
import { IsNotEmpty, IsUUID } from "class-validator";

class FollowDto {
  @Exclude({ toPlainOnly: true })
  private followed_id: number;

  @Expose()
  @IsNotEmpty({ message: "followed UUID is required" })
  @IsUUID(4, { message: "invalid UUID" })
  private followed_uuid: any;

  @Exclude({ toPlainOnly: true })
  private follower_id: number;

  @Expose()
  @IsNotEmpty({ message: "follower UUID is required" })
  @IsUUID(4, { message: "invalid UUID" })
  private follower_uuid: any;

  @Expose()
  private created_at: Date | null;

  constructor(
    followed_id: number,
    followed_uuid: any,
    follower_id: number,
    follower_uuid: any,
    created_at: Date | null
  ) {
    this.followed_id = followed_id;
    this.followed_uuid = followed_uuid;
    this.follower_id = follower_id;
    this.follower_uuid = follower_uuid;
    this.created_at = created_at;
  }

  // getters
  public getFollowedId(): number {
    return this.followed_id;
  }

  public getFollowedUuid(): any {
    return this.followed_uuid;
  }

  public getFollowerId(): number {
    return this.follower_id;
  }

  public getFollowerUuid(): any {
    return this.follower_uuid;
  }

  public getCreatedAt(): Date | null {
    return this.created_at;
  }

  // setters
  public setFollowedId(followed_id: number): void {
    this.followed_id = followed_id;
  }

  public setFollowerId(follower_id: number): void {
    this.follower_id = follower_id;
  }

  public setCreatedAt(created_at: Date | null): void {
    this.created_at = created_at;
  }
}

export default FollowDto;