var mongoose = require("./db.js");
var schema = mongoose.Schema; //模型生成器(表生成器)

//建立表 并且指定字段
var userSchema = new schema({
    username: String,
    userpwd: String,
    usertype: Number
});

//转成数据模型导出
module.exports = mongoose.model("userinfo", userSchema);