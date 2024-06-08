import { NewUsers, SelectUsers } from "@/types/table.types";

class User {
  private id: number;
  private uuid: any;
  private username: string;
  private email: string;
  private password: string;
  private first_name: string | null;
  private last_name: string | null;
  private age: number | null;
  private roles: string | null;
  private avatar_url: string | null;
  private birthday: string | null;
  private created_at: Date | null;

  constructor(user: SelectUsers) {
    this.id = user.id;
    this.uuid = user.uuid;
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.age = user.age;
    this.roles = user.roles;
    this.avatar_url = user.avatar_url;
    this.birthday = user.birthday;
    this.created_at = user.created_at;
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

  getId(): number {
    return this.id;
  }

  setId(id: number): void {
    this.id = id;
  }

  getUuid(): any {
    return this.uuid;
  }

  setUuid(uuid: any): void {
    this.uuid = uuid;
  }

  getUsername(): string {
    return this.username;
  }

  setUsername(username: string): void {
    this.username = username;
  }

  getEmail(): string {
    return this.email;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  getPassword(): string {
    throw new Error("Password access is restricted");
  }

  setPassword(password: string): void {
    this.password = password;
  }

  getFirstName(): string | null {
    return this.first_name;
  }

  setFirstName(first_name: string | null): void {
    this.first_name = first_name;
  }

  getLastName(): string | null {
    return this.last_name;
  }

  setLastName(last_name: string | null): void {
    this.last_name = last_name;
  }

  getFullName(): string {
    return `${this.first_name} ${this.last_name}`;
  }

  setFullName(first_name: string, last_name: string): void {
    this.first_name = first_name;
    this.last_name = last_name;
  }

  getAge(): number | null {
    return this.age;
  }

  setAge(age: number | null): void {
    this.age = age;
  }

  getRoles(): string | null {
    return this.roles;
  }

  setRoles(roles: string | null): void {
    this.roles = roles;
  }

  getAvatarUrl(): string | null {
    return this.avatar_url;
  }

  setAvatarUrl(avatar_url: string | null): void {
    this.avatar_url = avatar_url;
  }

  getBirthday(): string | null {
    return this.birthday;
  }

  setBirthday(birthday: string | null): void {
    this.birthday = birthday;
  }

  getCreatedAt(): Date | null {
    return this.created_at;
  }

  setCreatedAt(created_at: Date | null): void {
    this.created_at = created_at;
  }
}

export default User;
