"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .alterTable("messages")
        .modifyColumn("time_sent", "timestamp", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
}
exports.up = up;
;
async function down(db) { }
exports.down = down;
