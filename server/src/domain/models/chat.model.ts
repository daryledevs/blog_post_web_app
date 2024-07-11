class Chat {
  private id: number;
  private uuid: any;
  private user_uuid: any;
  private username: string | null;
  private first_name: string | null;
  private last_name: string | null;
  private avatar_url: string | null;

  constructor(
    id: number,
    uuid: any,
    user_uuid: any,
    username: string | null,
    first_name: string | null,
    last_name: string | null,
    avatar_url: string | null
  ) {
    this.id = id;
    this.uuid = uuid;
    this.user_uuid = user_uuid;
    this.username = username;
    this.first_name = first_name;
    this.last_name = last_name;
    this.avatar_url = avatar_url;
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

export default Chat;
