import { Expose }                           from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

class FollowDto {
  @Expose()
  @IsNotEmpty({ message: "username is required" })
  private username: string;

  @Expose()
  @IsOptional()
  @IsString({ message: "first name must be a string" })
  private first_name?: string | null;

  @Expose()
  @IsOptional()
  @IsString({ message: "last name must be a string" })
  private last_name?: string | null;

  @Expose()
  @IsOptional()
  @IsString({ message: "avatar url must be a string" })
  private avatar_url?: string | null;

  @Expose()
  private created_at: Date | null;

  constructor(
    username: string,
    created_at: Date | null,
    first_name?: string | null,
    last_name?: string | null,
    avatar_url?: string | null,
  ) {
    this.username = username;
    this.first_name = first_name;
    this.last_name = last_name;
    this.avatar_url = avatar_url;
    this.created_at = created_at;
  }

  // getters
  public getUsername(): string {
    return this.username;
  }

  public getFirstName(): string | null {
    return this.first_name || null;
  }

  public getLastName(): string | null {
    return this.last_name || null;
  }

  public getAvatarUrl(): string | null{
    return this.avatar_url || null;
  }

  public getCreatedAt(): Date | null {
    return this.created_at;
  }

  // setters
  public setUsername(username: string): void {
    this.username = username;
  }

  public setFirstName(first_name: string | null): void {
    this.first_name = first_name;
  }

  public setLastName(last_name: string | null): void {
    this.last_name = last_name;
  }

  public setAvatarUrl(avatar_url: string | null): void {
    this.avatar_url = avatar_url;
  }

  public setCreatedAt(created_at: Date | null): void {
    this.created_at = created_at;
  }
}

export default FollowDto;
