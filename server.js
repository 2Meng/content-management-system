const mysql = require("mysql2");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Macross!0",
    database: "employee_db"
});

// db.connect(
//     function (error) {
//         console.log(error)
//     }
// )

// module.exports = db;

module.exports = db.promise();