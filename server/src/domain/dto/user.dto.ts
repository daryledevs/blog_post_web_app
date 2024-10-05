
import {
  IsEmail,
  IsString,
  IsOptional,
  IsIn,
  ValidateIf,
  IsStrongPassword,
  Validate,
}                          from "class-validator";
import { IUser }           from "../types/user.interface";
import PasswordMatch       from "@/presentation/validations/validate-password-match.validation";
import UserDetailsDto      from "./user-details.dto";
import { Exclude, Expose } from "class-transformer";


class UserDto extends UserDetailsDto {
  @Exclude({ toPlainOnly: true })
  private id: number;

  @Expose({ toClassOnly: true })
  private uuid: string;

  @Expose()
  @ValidateIf((o) => o.uuid === undefined || o.uuid === null || o.uuid === "")
  @IsEmail({}, { message: "invalid email" })
  private email: string;

  @Exclude({ toPlainOnly: true })
  @ValidateIf((o) => o.password)
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    { message: "Password too weak" }
  )
  private password: string;

  @Exclude({ toPlainOnly: true })
  @ValidateIf((o) => o.password)
  @Validate(PasswordMatch, ["password"])
  private confirmPassword?: string | undefined;

  @Expose()
  @ValidateIf((o) => o.confirmPassword)
  @IsString({ message: "Roles must be a string" })
  @IsIn(["user", "admin"], { message: "invalid role" })
  private roles: string | null | undefined;

  @Expose()
  @IsOptional()
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
    created_at: Date | null,
    confirmPassword?: string
  ) {
    super(username, first_name, last_name, avatar_url, age, birthday);
    this.id = id;
    this.uuid = uuid;
    this.email = email;
    this.password = password;
    this.roles = roles;
    this.created_at = created_at;
    this.confirmPassword = confirmPassword!;
  }

  getUsers(): IUser {
    return {
      uuid: this.uuid,
      username: this.username,
      email: this.email,
      firstName: this.first_name,
      lastName: this.last_name,
      roles: this.roles,
      avatarUrl: this.avatar_url,
      age: this.age,
      birthday: this.birthday,
      createdAt: this.created_at,
    };
  }

  // Getters
  getId(): number {
    return this.id;
  }

  getUuid(): string {
    return this.uuid;
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

  getConfirmPassword(): string | undefined {
    return this.confirmPassword;
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

  setConfirmPassword(value: string) {
    this.confirmPassword = value;
  }

  setRoles(value: string | null) {
    this.roles = value;
  }

  setCreatedAt(value: Date | null) {
    this.created_at = value;
  }
}

export default UserDto;
