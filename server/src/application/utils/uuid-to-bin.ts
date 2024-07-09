import { sql } from "kysely";

function sqlUuidsToBin(uuids: string[]) {
  return sql`(${sql.join(uuids.map((uuid) => sql`UUID_TO_BIN(${uuid})`))})`;
};

export default sqlUuidsToBin;
