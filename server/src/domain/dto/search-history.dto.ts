import UserDetailsDto                             from "./user-details.dto";
import { Exclude, Expose }                        from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

class SearchHistoryDto extends UserDetailsDto {
  @Exclude({ toPlainOnly: true })
  private id: number;

  @Expose()
  @IsNotEmpty({ message: "UUID is required" })
  @IsUUID(4, { message: "invalid search's UUID version" })
  private uuid: any;

  @Exclude({ toPlainOnly: true })
  private searcher_id: number;

  @Exclude({ toPlainOnly: true })
  private searched_id: number;

  @Expose()
  @IsUUID(4, { message: "invalid user's UUID version" })
  private user_uuid: string;

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
    super(username, first_name, last_name, avatar_url);
    this.id = id;
    this.uuid = uuid;
    this.searcher_id = searcher_id;
    this.searched_id = searched_id;
    this.user_uuid = user_uuid;
    this.created_at = created_at;
  }

  getSearchHistories() {
    return {
      id: this.id,
      uuid: this.uuid,
      searcherId: this.searcher_id,
      searchedId: this.searched_id,
      userUuid: this.user_uuid,
      username: this.username,
      firstName: this.first_name,
      lastName: this.last_name,
      avatarUrl: this.avatar_url,
      createdAt: this.created_at,
    };
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

  setCreatedAt(created_at: Date | null): void {
    this.created_at = created_at;
  }
}

export default SearchHistoryDto;
