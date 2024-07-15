import { Exclude, Expose } from "class-transformer";

class ConversationDto {
  @Exclude({ toPlainOnly: true })
  private id: number;

  @Expose()
  private uuid: any;

  @Expose()
  private created_at: Date | null;

  constructor(id: number, uuid: any, created_at?: Date | null) {
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

export default ConversationDto;
