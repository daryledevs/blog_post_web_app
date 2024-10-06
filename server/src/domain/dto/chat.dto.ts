import { IChat }              from "../types/chat.interface";
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
  private sender_uuid: any;

  @Expose()
  private text_message: string | null;

  @Expose()
  private time_sent: Date;

  constructor(
    id: number,
    uuid: any,
    conversation_id: number,
    conversation_uuid: any,
    sender_uuid: any,
    text_message: string | null,
    time_sent: Date,
  ) {
    this.id = id;
    this.uuid = uuid;
    this.conversation_id = conversation_id;
    this.conversation_uuid = conversation_uuid;
    this.sender_uuid = sender_uuid;
    this.text_message = text_message;
    this.time_sent = time_sent;
  }

  getChats(): IChat {
    return {
      uuid: this.uuid,
      conversationUuid: this.conversation_uuid,
      senderUuid: this.sender_uuid,
      textMessage: this.text_message,
      timeSent: this.time_sent,
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

  getSenderUuid(): any {
    return this.sender_uuid;
  }

  public getTextMessage(): string | null {
    return this.text_message ?? null;
  }

  public getTimeSent(): Date {
    return this.time_sent;
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
  public setTextMessage(text_message: string | null): void {
    this.text_message = text_message;
  }

  public setTimeSent(time_sent: Date): void {
    this.time_sent = time_sent;
  }
}

export default ChatDto;
