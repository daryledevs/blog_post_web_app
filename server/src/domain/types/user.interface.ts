export interface IUserDetails {
  username: string;
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  avatarUrl: string | null | undefined;
  age: number | null | undefined;
  birthday: string | null | undefined;
};

export interface IUser extends IUserDetails {
  uuid: string;
  email: string;
  roles: string | null | undefined;
  createdAt: Date | null;
}