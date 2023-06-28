import database from "./database";

async function db(sql: string, params: any[]): Promise<any> {
  try {
    return await new Promise((resolve, reject) => {
      database.query(sql, [...params], (error, data) => {
        if (error) return reject(error); 
        return resolve(data);
      });
    });
  } catch (error) {
    throw error;
  }
};

export default db;
