import { Expose }                           from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

class UserDetailsDto {
  @Expose()
  @IsNotEmpty({ message: "username is required" })
  protected username: string;

  @Expose()
  @IsOptional()
  @IsString({ message: "first name must be a string" })
  protected first_name?: string | null;

  @Expose()
  @IsOptional()
  @IsString({ message: "last name must be a string" })
  protected last_name?: string | null;

  @Expose()
  @IsOptional()
  @IsString({ message: "avatar url must be a string" })
  protected avatar_url?: string | null;

  @Expose()
  protected age?: number | null;

  @Expose()
  protected birthday?: string | null;

  constructor(
    username: string,
    first_name?: string | null,
    last_name?: string | null,
    avatar_url?: string | null,
    age?: number | null,
    birthday?: string | null
  ) {
    this.username = username;
    this.first_name = first_name;
    this.last_name = last_name;
    this.avatar_url = avatar_url;
    this.age = age;
    this.birthday = birthday;
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

  public getAvatarUrl(): string | null {
    return this.avatar_url || null;
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
}

export default UserDetailsDto;
