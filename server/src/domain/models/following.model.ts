import UserDetails from "./user-details.model";

class Following extends UserDetails {
  private followed_id: number;
  private followed_uuid: any;
  private created_at: Date | null;

  constructor(
    followed_id: number,
    followed_uuid: any,
    created_at: Date | null,
    username: string,
    first_name?: string | null,
    last_name?: string | null,
    avatar_url?: string | null,
  ) {
    super(username, first_name, last_name, avatar_url);
    this.followed_id = followed_id;
    this.followed_uuid = followed_uuid;
    this.created_at = created_at;
  }

  // getters
  public getFollowedId(): number {
    return this.followed_id;
  }

  public getFollowedUuid(): any {
    return this.followed_uuid;
  }

  public getCreatedAt(): Date | null {
    return this.created_at;
  }

  // setters
  public setFollowedId(followed_id: number): void {
    this.followed_id = followed_id;
  }

  public setFollowedUuid(followed_uuid: any): void {
    this.followed_uuid = followed_uuid;
  }

  public setCreatedAt(created_at: Date | null): void {
    this.created_at = created_at;
  }
}

export default Following;