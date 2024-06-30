import { NewPosts } from "@/types/table.types";

class Post {
  private id: number;
  private uuid: any;
  private image_id: string;
  private image_url: string | null;
  private user_id: number;
  private caption: string | null;
  private privacy_level: string | null;
  private created_at: Date | null;

  constructor(
    id: number,
    uuid: any,
    image_id: string,
    image_url: string | null,
    user_id: number,
    caption: string | null,
    privacy_level: string | null,
    created_at: Date | null
  ) {
    this.id = id;
    this.uuid = uuid;
    this.image_id = image_id;
    this.image_url = image_url;
    this.user_id = user_id;
    this.caption = caption;
    this.privacy_level = privacy_level;
    this.created_at = created_at;
  }

  public save(): NewPosts {
    return {
      image_id: this.image_id,
      image_url: this.image_url,
      user_id: this.user_id,
      caption: this.caption,
      privacy_level: this.privacy_level,
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

  public getUserId(): number {
    return this.user_id;
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

  public setUserId(user_id: number): void {
    this.user_id = user_id;
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

export default Post;