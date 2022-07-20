var mongoose = require("./db.js");
var schema = mongoose.Schema; //模型生成器(表生成器)

//建立表 并且指定字段
var userSchema = new schema({
    developname: String,  //开发者
    testname: String,    // 测试者
    title: String,      // 项目主题
    kind: String,  // 项目类型
    detail: String,         // 项目详情
    start: Date,//发布时间   
    end: Date,//完成时间
    extend: String,//附件
    bugtype: Number//bug状态 1表示待处理  2表示处理中  3:已解决
});


//转成数据模型导出
module.exports = mongoose.model("buginfo", userSchema);