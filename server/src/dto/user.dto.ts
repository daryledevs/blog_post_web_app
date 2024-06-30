import {
  IsInt,
  Length,
  IsEmail,
  IsString,
  IsOptional,
  IsIn,
}                          from "class-validator";
import { SelectUsers }     from "@/types/table.types";
import { Exclude, Expose } from "class-transformer";

class UserDto {
  @Exclude({ toPlainOnly: true })
  private id!: number;

  @Expose()
  private uuid!: string;

  @Expose()
  @Length(5, 30, { message: "username must be between 5 and 30 characters" })
  private username!: string;

  @Expose()
  @IsEmail({}, { message: "invalid email" })
  private email!: string;

  @Exclude({ toPlainOnly: true })
  @Length(6, 100, { message: "password must be at least 6 characters" })
  private password!: string;

  @Expose()
  @IsString({ message: "Roles must be a string" })
  @IsIn(["user", "admin"], { message: "invalid role" })
  private roles: string | null | undefined;

  @Expose()
  @IsOptional()
  @IsString({ message: "First name must be a string" })
  private first_name: string | null | undefined;

  @Expose()
  @IsOptional()
  @IsString({ message: "Last name must be a string" })
  private last_name: string | null | undefined;

  @Expose()
  @IsOptional()
  @IsInt({ message: "Age must be a number" })
  private age: number | null | undefined;

  @Expose()
  @IsOptional()
  @IsString({ message: "Avatar url must be a string" })
  private avatar_url: string | null | undefined;

  @Expose()
  @IsOptional()
  @IsString({ message: "Birthday must be a string" })
  private birthday: string | null | undefined;

  @Expose()
  @IsOptional()
  private created_at: Date | null | undefined;

  constructor(user: Partial<SelectUsers>) {
    Object.assign(this, user);
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
