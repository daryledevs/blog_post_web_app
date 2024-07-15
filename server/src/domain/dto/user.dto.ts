
import UserDetails                                     from "../models/user-details.model";
import { Exclude, Expose }                             from "class-transformer";
import { Length, IsEmail, IsString, IsOptional, IsIn } from "class-validator";

class UserDto extends UserDetails {
  @Exclude({ toPlainOnly: true })
  private id: number;

  @Expose()
  private uuid: string;

  @Expose()
  @IsEmail({}, { message: "invalid email" })
  private email: string;

  @Exclude({ toPlainOnly: true })
  @Length(6, 100, { message: "password must be at least 6 characters" })
  private password: string;

  @Expose()
  @IsString({ message: "Roles must be a string" })
  @IsIn(["user", "admin"], { message: "invalid role" })
  private roles: string | null | undefined;

  @Expose()
  @IsOptional()
  private created_at: Date | null | undefined;

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

  // Getters
  getId(): number {
    return this.id;
  }

  getUuid(): string {
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
    return this.password;
  }

  getAvatar(): string | null | undefined {
    return this.avatar_url;
  }

  getCreatedAt(): Date | null | undefined {
    return this.created_at;
  }

  // Setters
  setId(value: number) {
    this.id = value;
  }

  setUuid(value: string) {
    this.uuid = value;
  }

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

export default UserDto;
