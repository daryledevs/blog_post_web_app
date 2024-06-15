import { Exclude, Expose }                                  from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

class SearchHistoryDto {
  @Exclude({ toPlainOnly: true })
  private id: number;

  @Expose()
  @IsNotEmpty({ message: "UUID is required" })
  @IsUUID(4, { message: "Invalid search's UUID version" })
  private uuid: any;

  @Exclude({ toPlainOnly: true })
  private searcher_id: number;

  @Exclude({ toPlainOnly: true })
  private searched_id: number;

  @Expose()
  @IsUUID(4, { message: "Invalid user's UUID version" })
  private user_uuid: string;

  @Expose()
  @IsNotEmpty({ message: "Username is required" })
  @IsString({ message: "Username must be a string" })
  private username: string;

  @Expose()
  private first_name?: string | null | undefined;

  @Expose()
  private last_name?: string | null | undefined;

  @Expose()
  private avatar_url?: string | null | undefined;

  @Expose()
  @IsOptional()
  @IsDate({ message: "Created at must be a valid date" })
  private created_at: Date | null;

  constructor(
    id: number,
    uuid: any,
    searcher_id: number,
    searched_id: number,
    user_uuid: string,
    username: string,
    created_at: Date | null,
    first_name?: string | null | undefined,
    last_name?: string | null | undefined,
    avatar_url?: string | null | undefined
  ) {
    this.id = id;
    this.uuid = uuid;
    this.searcher_id = searcher_id;
    this.searched_id = searched_id;
    this.user_uuid = user_uuid;
    this.username = username;
    this.first_name = first_name;
    this.last_name = last_name;
    this.avatar_url = avatar_url;
    this.created_at = created_at;
  }

  // Getters
  getId(): number {
    return this.id;
  }

  getUuid(): any {
    return this.uuid;
  }

  getSearcherId(): number {
    return this.searcher_id;
  }

  getSearchedId(): number {
    return this.searched_id;
  }

  getUserUuid(): any {
    return this.user_uuid;
  }

  getUsername(): string | null | undefined {
    return this.username;
  }

  getFirstName(): string | null | undefined {
    return this.first_name;
  }

  getLastName(): string | null | undefined {
    return this.last_name;
  }

  getAvatar(): string | null | undefined {
    return this.avatar_url;
  }

  getCreatedAt(): Date | null {
    return this.created_at;
  }

  // Setters
  setId(id: number): void {
    this.id = id;
  }

  setUuid(uuid: any): void {
    this.uuid = uuid;
  }

  setSearcherId(searcher_id: number): void {
    this.searcher_id = searcher_id;
  }

  setSearchedId(searched_id: number): void {
    this.searched_id = searched_id;
  }

  setUserUuid(user_uuid: string): void {
    this.user_uuid = user_uuid;
  }

  setUsername(username: string): void {
    this.username = username;
  }

  setFirstName(first_name: string | undefined): void {
    this.first_name = first_name;
  }

  setLastName(last_name: string | undefined): void {
    this.last_name = last_name;
  }

  setAvatarUrl(avatar_url: string | undefined): void {
    this.avatar_url = avatar_url;
  }

  setCreatedAt(created_at: Date | null): void {
    this.created_at = created_at;
  }
}

export default SearchHistoryDto;
