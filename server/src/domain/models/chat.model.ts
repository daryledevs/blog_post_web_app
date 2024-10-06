class Chat {
  private id: number;
  private uuid: any;
  private conversation_id: number;
  private conversation_uuid: any;
  private sender_uuid: any;
  private text_message: string | null;
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

  public getSenderUuid(): any {
    return this.sender_uuid;
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

  public setSenderUuid(sender_uuid: any) {
    this.sender_uuid = sender_uuid;
  }

  public setTextMessage(text_message: string | null): void {
    this.text_message = text_message;
  }

  public setTimeSent(time_sent: Date): void {
    this.time_sent = time_sent;
  }
}

export default Chat;
