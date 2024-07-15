import { Exclude, Expose }    from "class-transformer";
import { IsNotEmpty, IsUUID } from "class-validator";

class ChatDto {
  @Exclude({ toPlainOnly: true })
  private id: number;

  @Expose()
  @IsNotEmpty({ message: "follower UUID is required" })
  @IsUUID(4, { message: "invalid UUID" })
  private uuid: any;

  @Exclude({ toPlainOnly: true })
  private conversation_id: number;

  @Expose()
  @IsNotEmpty({ message: "conversation UUID is required" })
  @IsUUID(4, { message: "invalid UUID" })
  private conversation_uuid: any;

  @Expose()
  @IsNotEmpty({ message: "user UUID is required" })
  @IsUUID(4, { message: "invalid UUID" })
  private user_uuid: any;

  @Expose()
  @IsNotEmpty({ message: "username is required" })
  private username: string | null;

  @Expose()
  private first_name: string | null;

  @Expose()
  private last_name: string | null;

  @Expose()
  private avatar_url: string | null;

  constructor(
    id: number,
    uuid: any,
    conversation_id: number,
    conversation_uuid: any,
    user_uuid: any,
    username: string | null,
    first_name?: string | null,
    last_name?: string | null,
    avatar_url?: string | null
  ) {
    this.id = id;
    this.uuid = uuid;
    this.conversation_id = conversation_id;
    this.conversation_uuid = conversation_uuid;
    this.user_uuid = user_uuid;
    this.username = username;
    this.first_name = first_name || null;
    this.last_name = last_name || null;
    this.avatar_url = avatar_url || null;
  }

  // getters
  getId(): number {
    return this.id;
  }

  getUuid(): any {
    return this.uuid;
  }

  getConversationId(): number {
    return this.conversation_id;
  }

  getConversationUuid(): any {
    return this.conversation_uuid;
  }

  getUserUuid(): any {
    return this.user_uuid;
  }

  getUsername(): string | null {
    return this.username;
  }

  getFirstName(): string | null {
    return this.first_name;
  }

  getLastName(): string | null {
    return this.last_name;
  }

  getAvatarUrl(): string | null {
    return this.avatar_url;
  }

  // setters
  setId(id: number) {
    this.id = id;
  }

  setUuid(uuid: any) {
    this.uuid = uuid;
  }

  setConversationId(conversation_id: number) {
    this.conversation_id = conversation_id;
  }

  setConversationUuid(conversation_uuid: any) {
    this.conversation_uuid = conversation_uuid;
  }

  setUserUuid(user_uuid: any) {
    this.user_uuid = user_uuid;
  }

  setUsername(username: string | null) {
    this.username = username;
  }

  setFirstName(first_name: string | null) {
    this.first_name = first_name;
  }

  setLastName(last_name: string | null) {
    this.last_name = last_name;
  }

  setAvatarUrl(avatar_url: string | null) {
    this.avatar_url = avatar_url;
  }
}

export default ChatDto;
