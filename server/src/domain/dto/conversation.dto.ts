
import UserDetailsDto      from "./user-details.dto";
import { Exclude, Expose } from "class-transformer";

class ConversationDto extends UserDetailsDto {
  @Exclude({ toPlainOnly: true })
  private id: number;

  @Expose()
  private uuid: any;

  private user_uuid: any;

  @Expose()
  private created_at: Date | null;

  constructor(
    id: number,
    uuid: any,
    username: string,
    created_at: Date | null,
    first_name?: string | null,
    last_name?: string | null,
    avatar_url?: string | null,
  ) {
    super(username, first_name, last_name, avatar_url);
    this.id = id;
    this.uuid = uuid;
    this.created_at = created_at || null;
  }

  getConversations() {
    return {
      id: this.id,
      uuid: this.uuid,
      userUuid: this.user_uuid,
      createdAt: this.created_at,
      ...super.getUserDetails(),
    };
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

export default ConversationDto;
