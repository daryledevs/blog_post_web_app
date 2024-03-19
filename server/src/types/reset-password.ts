import { Generated, Insertable, Selectable, Updateable } from "kysely";

interface ResetPasswordTokenTable {
  token_id: Generated<number>;
  user_id: number;
  encrypted: string | null;
  create_time: Generated<Date>;
};

export type ResetPasswordToken = Selectable<ResetPasswordTokenTable>;
export type NewResetPasswordToken = Insertable<ResetPasswordTokenTable>;
export type UpdateResetPasswordToken = Updateable<ResetPasswordTokenTable>;

export default ResetPasswordTokenTable;
