require("dotenv").config()
// const mysql = require("mysql")

const connection = {
    host : "127.0.0.1",
    user : "root",
    password : process.env.MYSQL_PASSWORD,
    database : "coding_bros",
}

module.exports = connection