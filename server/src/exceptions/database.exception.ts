import { QueryNode } from "kysely";

class DatabaseException {
  errorCode: number;
  errorType: string;
  message: string;
  state: string;
  query: string;
  node?: any;

  constructor(
    errno: number,
    code: string,
    sqlState: string,
    sqlMessage: string,
    sql: string,
    node?: QueryNode
  ) {
    this.errorCode = errno;
    this.message = sqlMessage;
    this.errorType = code;
    this.state = sqlState;
    this.query = sql;
    this.node = node;
  }

  static error(error: any): DatabaseException {
    return new DatabaseException(
      error.errno,
      error.code,
      error.sqlState,
      error.sqlMessage,
      error.sql,
      error.node
    );
  }
}

export default DatabaseException;