import { NewSearches } from "@/types/table.types";

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

class SearchHistory {
  private id: number;
  private uuid: any;
  private searcher_id: number;
  private searched_id: number;
  private user_uuid: string;
  private username: string;
  private first_name?: string | null | undefined;
  private last_name?: string | null | undefined;
  private avatar_url?: string | null | undefined;
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

  getUserUuid(): string {
    return this.user_uuid;
  }

  getUsername(): string {
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

  setFirstName(first_name: string): void {
    this.first_name = first_name;
  }

  setLastName(last_name: string): void {
    this.last_name = last_name;
  }

  setAvatarUrl(avatar_url: string): void {
    this.avatar_url = avatar_url;
  }

  setCreatedAt(created_at: Date | null): void {
    this.created_at = created_at;
  }
}

export default SearchHistory;
