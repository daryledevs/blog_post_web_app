"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kysely_1 = require("kysely");
function sqlUuidsToBin(uuids) {
    if (uuids?.[0] == 0)
        return ["0"];
    return (0, kysely_1.sql) `(${kysely_1.sql.join(uuids.map((uuid) => (0, kysely_1.sql) `UUID_TO_BIN(${uuid})`))})`;
}
;
exports.default = sqlUuidsToBin;
