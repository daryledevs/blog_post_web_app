import UserDetails  from "./user-details.model";
import { NewUsers } from "@/domain/types/table.types";

class User extends UserDetails {
  private id: number;
  private uuid: any;
  private email: string;
  private password: string;
  private roles: string | null;
  private created_at: Date | null;

  constructor(
    id: number,
    uuid: any,
    username: string,
    email: string,
    password: string,
    first_name: string | null,
    last_name: string | null,
    age: number | null,
    roles: string | null,
    avatar_url: string | null,
    birthday: string | null,
    created_at: Date | null
  ) {
    super(username, first_name, last_name, avatar_url, age, birthday);
    this.id = id;
    this.uuid = uuid;
    this.email = email;
    this.password = password;
    this.roles = roles;
    this.created_at = created_at;
  }

  save(): NewUsers {
    return {
      username: this.username,
      email: this.email,
      first_name: this.first_name || null,
      last_name: this.last_name || null,
      password: this.password,
      age: this.age || null,
      roles: this.roles,
      avatar_url: this.avatar_url || null,
      birthday: this.birthday || null,
      created_at: this.created_at,
    };
  }

  // getters

  public getId(): number {
    return this.id;
  }

  public getUuid(): any {
    return this.uuid;
  }

  public getEmail(): string {
    return this.email;
  }

  public getRoles(): string | null | undefined {
    return this.roles;
  }

  public getPassword(): string {
    throw new Error("Password is restricted");
  }

  public getCreatedAt(): Date | null | undefined {
    return this.created_at;
  }

  // setters

  public setEmail(value: string) {
    this.email = value;
  }

  public setPassword(value: string) {
    this.password = value;
  }

  public setRoles(value: string | null) {
    this.roles = value;
  }

  public setCreatedAt(value: Date | null) {
    this.created_at = value;
  }
}

export default User;
