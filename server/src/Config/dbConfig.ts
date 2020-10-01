import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();

export const myDB = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB_NAME,
});
