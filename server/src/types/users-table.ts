import { Insertable, Selectable, Updateable } from "kysely";

interface UsersTable {
  user_id: number;
  username: string;
  email: string;
  password: string;
  first_name: string | null;
  last_name: string | null;
  age: number | null;
  birthday: string | null;
  avatar_url: string | null;
  roles: string | "users" | "admin";
  created_at: string;
};

export type User = Selectable<UsersTable>;
export type NewUser = Insertable<UsersTable>;
export type UpdateUser = Updateable<UsersTable>;

export default UsersTable;
