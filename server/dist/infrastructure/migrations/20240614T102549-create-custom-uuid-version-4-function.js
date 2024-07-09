"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const kysely_1 = require("kysely");
async function up(db) {
    // create a custom UUID version 4 function
    await (0, kysely_1.sql) `CREATE FUNCTION UUID_V4() RETURNS CHAR(36) READS SQL DATA BEGIN RETURN LOWER(CONCAT(HEX(RANDOM_BYTES(4)), '-', HEX(RANDOM_BYTES(2)), '-4', SUBSTR(HEX(RANDOM_BYTES(2)), 2, 3), '-', HEX(FLOOR(ASCII(RANDOM_BYTES(1)) / 64) + 8), SUBSTR(HEX(RANDOM_BYTES(2)), 2, 3), '-', hex(RANDOM_BYTES(6)))); END;`.execute(db);
    // create a trigger for each table
    [
        "users",
        "search_history",
        "reset_password_token",
        "posts",
        "messages",
        "likes",
        "conversation_members",
        "conversations",
        "comments",
    ].map(async (table) => await (0, kysely_1.sql) `CREATE TRIGGER before_insert_${kysely_1.sql.raw(table)} BEFORE INSERT ON ${kysely_1.sql.raw(table)} FOR EACH ROW BEGIN IF NEW.uuid IS NULL THEN SET NEW.uuid = UUID_TO_BIN(UUID_V4()); END IF; END;`.execute(db));
}
exports.up = up;
async function down(db) {
    // drop the custom UUID version 4 function
    await (0, kysely_1.sql) `DROP FUNCTION IF EXISTS UUID_V4`.execute(db);
    // drop the trigger for each table
    [
        "users",
        "search_history",
        "reset_password_token",
        "posts",
        "messages",
        "likes",
        "conversation_members",
        "conversations",
        "comments",
    ].map(async (table) => await (0, kysely_1.sql) `DROP TRIGGER IF EXISTS before_insert_${kysely_1.sql.raw(table)}`.execute(db));
}
exports.down = down;
;
