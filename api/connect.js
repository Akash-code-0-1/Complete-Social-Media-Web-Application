import mysql from "mysql";

export const db= mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Akash360@",
    database:"social"
})