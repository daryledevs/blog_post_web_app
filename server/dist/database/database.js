"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const mysql2_1 = require("mysql2");
const kysely_1 = require("kysely");
dotenv.config();
const dialect = new kysely_1.MysqlDialect({
    pool: (0, mysql2_1.createPool)({
        database: `${process.env.DATABASE}`,
        host: `${process.env.DATABASE_HOST}`,
        port: process.env.DATABASE_PORT,
        user: `${process.env.USER}`,
        password: process.env.PASSWORD,
        waitForConnections: true,
        multipleStatements: true,
        charset: "utf8mb4",
        connectionLimit: `${process.env.DATABASE_CONNECTION_LIMIT}`,
        queueLimit: 0,
    }),
});
const db = new kysely_1.Kysely({
    dialect,
    plugins: [new kysely_1.CamelCasePlugin]
});
exports.default = db;
