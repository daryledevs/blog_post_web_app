import { Insertable, Selectable, Updateable } from "kysely";

interface ResetPasswordTokenTable {
  token_id: string;
  user_id: number;
  encrypted: string | null;
  create_time: string;
};

export type ResetPasswordToken = Selectable<ResetPasswordTokenTable>;
export type NewResetPasswordToken = Insertable<ResetPasswordTokenTable>;
export type UpdateResetPasswordToken = Updateable<ResetPasswordTokenTable>;

export default ResetPasswordTokenTable;
