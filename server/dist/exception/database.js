"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DatabaseException {
    constructor(errno, code, sqlState, sqlMessage, sql) {
        this.errorCode = errno;
        this.message = sqlMessage;
        this.errorType = code;
        this.state = sqlState;
        this.query = sql;
    }
    static fromError(error) {
        return new DatabaseException(error.errno, error.code, error.sqlState, error.sqlMessage, error.sql);
    }
}
exports.default = DatabaseException;
