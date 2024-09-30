import { IChat }              from "../types/chat.interface";
import UserDetailsDto         from "./user-details.dto";
import { Exclude, Expose }    from "class-transformer";
import { IsNotEmpty, IsUUID } from "class-validator";

class ChatDto extends UserDetailsDto {
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

  constructor(
    id: number,
    uuid: any,
    conversation_id: number,
    conversation_uuid: any,
    user_uuid: any,
    username: string,
    first_name?: string | null,
    last_name?: string | null,
    avatar_url?: string | null
  ) {
    super(username, first_name, last_name, avatar_url);
    this.id = id;
    this.uuid = uuid;
    this.conversation_id = conversation_id;
    this.conversation_uuid = conversation_uuid;
    this.user_uuid = user_uuid;
  }

  getChats(): IChat {
    return {
      id: this.id,
      uuid: this.uuid,
      conversationId: this.conversation_id,
      conversationUuid: this.conversation_uuid,
      userUuid: this.user_uuid,
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

  getConversationId(): number {
    return this.conversation_id;
  }

  getConversationUuid(): any {
    return this.conversation_uuid;
  }

  getUserUuid(): any {
    return this.user_uuid;
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
}

export default ChatDto;
