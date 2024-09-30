import { IPost }                       from "../types/post.interface";
import { Exclude, Expose }             from "class-transformer";
import {IsEmpty, IsUUID, ValidateIf }  from "class-validator";

class PostDto {
  @Exclude({ toPlainOnly: true })
  @ValidateIf((o) => !o.files?.length)
  private id: number;

  @Expose()
  @ValidateIf((o) => !o.files?.length)
  @IsUUID(4, { message: "invalid post's UUID" })
  private uuid: any;

  @Exclude()
  @ValidateIf((o) => !o.files?.length)
  @IsEmpty({ message: "Image is not allowed to be changed" })
  private image_id: string;

  @Expose()
  @ValidateIf((o) => !o.files?.length)
  @IsEmpty({ message: "Image is not allowed to be changed" })
  private image_url: string | null;

  @Exclude({ toPlainOnly: true })
  private files: Express.Multer.File[];

  @Exclude({ toPlainOnly: true })
  private user_id: number;

  @Expose()
  @ValidateIf((o) => o.files?.length)
  @IsUUID(4, { message: "invalid user's UUID" })
  private user_uuid: any;

  @Expose()
  private caption: string | null;

  @Expose()
  private privacy_level: string | null;

  @Expose()
  private created_at: Date | null;

  constructor(
    id: number,
    uuid: any,
    image_id: string,
    image_url: string | null,
    files: Express.Multer.File[],
    user_id: number,
    user_uuid: any,
    caption: string | null,
    privacy_level: string | null,
    created_at: Date | null
  ) {
    this.id = id;
    this.uuid = uuid;
    this.image_id = image_id;
    this.image_url = image_url;
    this.files = files;
    this.user_id = user_id;
    this.user_uuid = user_uuid;
    this.caption = caption;
    this.privacy_level = privacy_level;
    this.created_at = created_at;
  }

  getPosts(): IPost {
    return {
      id: this.id,
      uuid: this.uuid,
      imageId: this.image_id,
      imageUrl: this.image_url,
      files: this.files,
      userId: this.user_id,
      userUuid: this.user_uuid,
      caption: this.caption,
      privacyLevel: this.privacy_level,
      createdAt: this.created_at,
    };
  }

  // getters
  public getId(): number {
    return this.id;
  }

  public getUuid(): any {
    return this.uuid;
  }

  public getImageId(): string {
    return this.image_id;
  }

  public getImageUrl(): string | null {
    return this.image_url;
  }

  public getFiles(): Express.Multer.File[] {
    return this.files;
  }

  public getUserId(): number {
    return this.user_id;
  }

  public getUserUuid(): any {
    return this.user_uuid;
  }

  public getCaption(): string | null {
    return this.caption;
  }

  public getPrivacyLevel(): string | null {
    return this.privacy_level;
  }

  public getCreatedAt(): Date | null {
    return this.created_at;
  }

  // setters
  public setId(id: number): void {
    this.id = id;
  }

  public setUuid(uuid: any): void {
    this.uuid = uuid;
  }

  public setImageId(image_id: string): void {
    this.image_id = image_id;
  }

  public setImageUrl(image_url: string | null): void {
    this.image_url = image_url;
  }

  public setFiles(files: Express.Multer.File[]): void {
    this.files = files;
  }

  public setUserId(user_id: number): void {
    this.user_id = user_id;
  }

  public setUserUuid(user_uuid: any): void {
    this.user_uuid = user_uuid;
  }

  public setCaption(caption: string | null): void {
    this.caption = caption;
  }

  public setPrivacyLevel(privacy_level: string | null): void {
    this.privacy_level = privacy_level;
  }

  public setCreatedAt(created_at: Date | null): void {
    this.created_at = created_at;
  }
}

export default PostDto; 