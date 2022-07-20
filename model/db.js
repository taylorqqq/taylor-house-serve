var mongoose = require("mongoose");
var DB_URL = "mongodb://localhost:27017/2189";

mongoose.connect(DB_URL, { useNewUrlParser: true });
//状态的监听
mongoose.connection.on("connected", function () {
    console.log("连接成功");
});
mongoose.connection.on("error", function (err) {
    console.log(err);
});
mongoose.connection.on("disconnected", function () {
    console.log("连接断开");
});
//导出方便其他地方使用
//commonjs
module.exports = mongoose;


// var mysql = require('mysql')
// var connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'dbuser',
//   password: 's3kreee7',
//   database: 'my_db'
// })

// connection.connect()

// connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
//   if (err) throw err

//   console.log('The solution is: ', rows[0].solution)
// })

// connection.end()