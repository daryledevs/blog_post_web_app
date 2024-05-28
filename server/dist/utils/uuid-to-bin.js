"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kysely_1 = require("kysely");
function sqlUuidsToBin(uuids) {
    return (0, kysely_1.sql) `(${kysely_1.sql.join(uuids.map((uuid) => (0, kysely_1.sql) `UUID_TO_BIN(${uuid})`))})`;
}
;
exports.default = sqlUuidsToBin;
