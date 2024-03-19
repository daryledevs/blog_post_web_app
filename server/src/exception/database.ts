class DatabaseException {
  errorCode: number;
  errorType: string;
  message: string;
  state: string;
  query: string;

  constructor(errno: number, code: string, sqlState: string, sqlMessage: string, sql: string) {
    this.errorCode = errno;
    this.message = sqlMessage;
    this.errorType = code;
    this.state = sqlState;
    this.query = sql;
  }

  static fromError(error: any): DatabaseException {
    return new DatabaseException(error.errno, error.code, error.sqlState, error.sqlMessage, error.sql);
  }
}

export default DatabaseException;