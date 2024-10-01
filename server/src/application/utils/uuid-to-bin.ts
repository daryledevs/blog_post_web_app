import { sql } from "kysely";

function sqlUuidsToBin(uuids: string[]) {
  if ((uuids as any)?.[0]== 0) return ["0"];
  return sql`(${sql.join(uuids.map((uuid) => sql`UUID_TO_BIN(${uuid})`))})`;
};

export default sqlUuidsToBin;
