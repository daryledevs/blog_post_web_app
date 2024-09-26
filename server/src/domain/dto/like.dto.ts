import { Exclude, Expose }    from "class-transformer";
import { IsNotEmpty, IsUUID } from "class-validator";

class LikeDto {
  @Exclude({ toPlainOnly: true })
  private id: number;

  @Expose()
  @IsNotEmpty({ message: "UUID is required" })
  @IsUUID(4, { message: "invalid search's UUID version" })
  private uuid: any;

  @Exclude({ toPlainOnly: true })
  private post_id: number;

  @Expose()
  @IsNotEmpty({ message: "post's UUID is required" })
  @IsUUID(4, { message: "invalid search's UUID version" })
  private post_uuid: any;

  @Exclude({ toPlainOnly: true })
  private user_id: number;

  @Exclude()
  @IsNotEmpty({ message: "user's UUID is required" })
  @IsUUID(4, { message: "invalid search's UUID version" })
  private user_uuid: any;

  @Expose()
  private created_at: Date | null;

  constructor(
    id: number,
    uuid: any,
    post_id: number,
    post_uuid: any,
    user_id: number,
    user_uuid: any,
    created_at: Date | null
  ) {
    this.id = id;
    this.uuid = uuid;
    this.post_id = post_id;
    this.post_uuid = post_uuid;
    this.user_id = user_id;
    this.user_uuid = user_uuid;
    this.created_at = created_at;
  }

  getLikes() {
    return {
      id: this.id,
      uuid: this.uuid,
      postId: this.post_id,
      postUuid: this.post_uuid,
      userId: this.user_id,
      userUuid: this.user_uuid,
      createdAt: this.created_at,
    };
  }

  // Getters
  public getId(): number {
    return this.id;
  }

  public getUuid(): any {
    return this.uuid;
  }

  public getPostId(): number {
    return this.post_id;
  }

  public getPostUuid(): any {
    return this.post_uuid;
  }

  public getUserId(): number {
    return this.user_id;
  }

  public getUserUuid(): any {
    return this.user_uuid;
  }

  public getCreatedAt(): Date | null {
    return this.created_at;
  }

  // Setters
  public setId(id: number): void {
    this.id = id;
  }

  public setUuid(uuid: any): void {
    this.uuid = uuid;
  }

  public setPostId(post_id: number): void {
    this.post_id = post_id;
  }

  public setPostUuid(post_uuid: any): void {
    this.post_uuid = post_uuid;
  }

  public setUserId(user_id: number): void {
    this.user_id = user_id;
  }

  public setUserUuid(user_uuid: any): void {
    this.user_uuid = user_uuid;
  }

  public setCreatedAt(created_at: Date | null): void {
    this.created_at = created_at;
  }
}

export default LikeDto;