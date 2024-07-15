import UserDetails from "./user-details.model";

class Conversation extends UserDetails {
  private id: number;
  private uuid: any;
  private created_at: Date | null;

  constructor(
    id: number,
    uuid: any,
    username: string,
    first_name?: string | null,
    last_name?: string | null,
    avatar_url?: string | null,
    created_at?: Date | null
  ) {
    super(username, first_name, last_name, avatar_url);
    this.id = id;
    this.uuid = uuid;
    this.created_at = created_at || null;
  }

  // getters
  getId(): number {
    return this.id;
  }

  getUuid(): any {
    return this.uuid;
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

  setCreatedAt(created_at: Date | null) {
    this.created_at = created_at;
  }
}

export default Conversation;
