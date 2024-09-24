import UserDetails from "./user-details.model";

class Conversation extends UserDetails {
  private id: number;
  private uuid: any;
  private user_uuid: any;
  private created_at: Date | null;

  constructor(
    id: number,
    uuid: any,
    user_uuid: any,
    username: string,
    first_name?: string | null,
    last_name?: string | null,
    avatar_url?: string | null,
    created_at?: Date | null
  ) {
    super(username, first_name, last_name, avatar_url);
    this.id = id;
    this.uuid = uuid;
    this.user_uuid = user_uuid;
    this.created_at = created_at || null;
  }

  // getters
  getId(): number {
    return this.id;
  }

  getUuid(): any {
    return this.uuid;
  }

  getUserUuid(): any {
    return this.user_uuid;
  }

  getCreatedAt(): Date | null {
    return this.created_at;
  }

  // setters
  setId(id: number) {
    this.id = id;
  }

  setUuid(uuid: any) {
    this.uuid = uuid;
  }
  
  setUserUuid(user_uuid: any) {
    this.user_uuid = user_uuid;
  }

  setCreatedAt(created_at: Date | null) {
    this.created_at = created_at;
  }
}

export default Conversation;
