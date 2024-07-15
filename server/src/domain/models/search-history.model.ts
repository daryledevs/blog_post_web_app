import UserDetails     from "./user-details.model";
import { NewSearches } from "@/domain/types/table.types";

export interface IESearchHistoryData {
  id: number;
  uuid: unknown;
  searcher_id: number;
  searched_id: number;
  user_uuid: unknown;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  created_at: Date | null;
}

class SearchHistory extends UserDetails {
  private id: number;
  private uuid: any;
  private searcher_id: number;
  private searched_id: number;
  private user_uuid: string;;
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
    avatar_url?: string | null | undefined,
  ) {
    super(username, first_name, last_name, avatar_url);
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

  save(): NewSearches {
    return {
      searcher_id: this.searcher_id,
      searched_id: this.searched_id,
    };
  }

  // Getters
  public getId(): number {
    return this.id;
  }

  public getUuid(): any {
    return this.uuid;
  }

  public getSearcherId(): number {
    return this.searcher_id;
  }

  public getSearchedId(): number {
    return this.searched_id;
  }

  public getUserUuid(): string {
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

  public setSearcherId(searcher_id: number): void {
    this.searcher_id = searcher_id;
  }

  public setSearchedId(searched_id: number): void {
    this.searched_id = searched_id;
  }

  public setUserUuid(user_uuid: string): void {
    this.user_uuid = user_uuid;
  }

  public setCreatedAt(created_at: Date | null): void {
    this.created_at = created_at;
  }
}

export default SearchHistory;
