import { NewUsers } from "@/types/table.types";

class User {
  private id!: number;
  private uuid!: any;
  private username!: string;
  private email!: string;
  private password!: string;
  private first_name!: string | null;
  private last_name!: string | null;
  private age!: number | null;
  private roles!: string | null;
  private avatar_url!: string | null;
  private birthday!: string | null;
  private created_at!: Date | null;

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
    this.id = id;
    this.uuid = uuid;
    this.username = username;
    this.email = email;
    this.password = password;
    this.first_name = first_name;
    this.last_name = last_name;
    this.age = age;
    this.roles = roles;
    this.avatar_url = avatar_url;
    this.birthday = birthday;
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

  // Getters

  getId(): number {
    return this.id;
  }

  getUuid(): any {
    return this.uuid;
  }

  getUsername(): string {
    return this.username;
  }

  getEmail(): string {
    return this.email;
  }

  getRoles(): string | null | undefined {
    return this.roles;
  }

  getPassword(): string {
    throw new Error("Password is restricted");
  }

  getFirstName(): string | null | undefined {
    return this.first_name;
  }

  getLastName(): string | null | undefined {
    return this.last_name;
  }

  getAge(): number | null | undefined {
    return this.age;
  }

  getAvatar(): string | null | undefined {
    return this.avatar_url;
  }

  getBirthday(): string | null | undefined {
    return this.birthday;
  }

  getCreatedAt(): Date | null | undefined {
    return this.created_at;
  }

  // Setters
  setUsername(value: string) {
    this.username = value;
  }

  setEmail(value: string) {
    this.email = value;
  }

  setPassword(value: string) {
    this.password = value;
  }

  setRoles(value: string | null) {
    this.roles = value;
  }

  setFirstName(value: string | null) {
    this.first_name = value;
  }

  setLastName(value: string | null) {
    this.last_name = value;
  }

  setAge(value: number | null) {
    this.age = value;
  }

  setAvatar(value: string | null) {
    this.avatar_url = value;
  }

  setBirthday(value: string | null) {
    this.birthday = value;
  }

  setCreatedAt(value: Date | null) {
    this.created_at = value;
  }
}

export default User;
