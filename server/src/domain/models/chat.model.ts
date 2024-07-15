import UserDetails from "./user-details.model";

class Chat extends UserDetails {
  private id: number;
  private uuid: any;
  private conversation_id: number;
  private conversation_uuid: any;
  private user_uuid: any;

  constructor(
    id: number,
    uuid: any,
    conversation_id: number,
    conversation_uuid: any,
    user_uuid: any,
    username: string,
    first_name: string | null,
    last_name: string | null,
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

  public setFirstName(first_name: string | null) {
    this.first_name = first_name;
  }

  public setLastName(last_name: string | null) {
    this.last_name = last_name;
  }

  public setAvatarUrl(avatar_url: string | null) {
    this.avatar_url = avatar_url;
  }
}

export default Chat;
