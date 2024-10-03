import UserDetails from "./user-details.model";

class Chat extends UserDetails {
  private id: number;
  private uuid: any;
  private conversation_id: number;
  private conversation_uuid: any;
  private user_uuid: any;
  private text_message: string | null;
  private time_sent: Date;

  constructor(
    id: number,
    uuid: any,
    conversation_id: number,
    conversation_uuid: any,
    user_uuid: any,
    username: string,
    first_name: string | null,
    last_name: string | null,
    text_message: string | null,
    time_sent: Date,
    avatar_url: string | null,
    age?: number | null,
    birthday?: string | null
  ) {
    super(username, first_name, last_name, avatar_url, age, birthday);
    this.id = id;
    this.uuid = uuid;
    this.conversation_id = conversation_id;
    this.conversation_uuid = conversation_uuid;
    this.user_uuid = user_uuid;
    this.text_message = text_message;
    this.time_sent = time_sent;
  }

  // getters
  public getId(): number {
    return this.id;
  }

  public getUuid(): any {
    return this.uuid;
  }

  public getConversationId(): number {
    return this.conversation_id;
  }

  public getConversationUuid(): any {
    return this.conversation_uuid;
  }

  public getUserUuid(): any {
    return this.user_uuid;
  }

  public getTextMessage(): string | null {
    return this.text_message ?? null;
  }

  public getTimeSent(): Date {
    return this.time_sent;
  }

  // setters
  public setId(id: number) {
    this.id = id;
  }

  public setUuid(uuid: any) {
    this.uuid = uuid;
  }

  public setConversationId(conversation_id: number) {
    this.conversation_id = conversation_id;
  }

  public setConversationUuid(conversation_uuid: any) {
    this.conversation_uuid = conversation_uuid;
  }

  public setUserUuid(user_uuid: any) {
    this.user_uuid = user_uuid;
  }

  public setTextMessage(text_message: string | null): void {
    this.text_message = text_message;
  }

  public setTimeSent(time_sent: Date): void {
    this.time_sent = time_sent;
  }
}

export default Chat;
