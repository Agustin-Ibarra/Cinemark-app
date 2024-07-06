import mysql from 'mysql2';

const pool = mysql.createPool({
  host:"localhost",
  user:"root",
  password:"",
  database:"cinemark",
  port:3306,
  waitForConnections:true,
  connectionLimit:10,
  queueLimit:0
});

export const connection = pool.promise();