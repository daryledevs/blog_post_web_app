import UserDetails from "./user-details.model";

class Follower extends UserDetails {
  private follower_id: number;
  private follower_uuid: any;
  private created_at: Date | null;

  constructor(
    follower_id: number,
    follower_uuid: any,
    created_at: Date | null,
    username: string,
    first_name?: string | null,
    last_name?: string | null,
    avatar_url?: string | null,
  ) {
    super(username, first_name, last_name, avatar_url);
    this.follower_id = follower_id;
    this.follower_uuid = follower_uuid;
    this.created_at = created_at;
  }

  // getters
  public getFollowerId(): number {
    return this.follower_id;
  }

  public getFollowerUuid(): any {
    return this.follower_uuid;
  }

  public getCreatedAt(): Date | null {
    return this.created_at;
  }

  // setters
  public setFollowerId(follower_id: number): void {
    this.follower_id = follower_id;
  }

  public setFollowerUuid(follower_uuid: any): void {
    this.follower_uuid = follower_uuid;
  }

  public setCreatedAt(created_at: Date | null): void {
    this.created_at = created_at;
  }
}

export default Follower;