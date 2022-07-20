//设置multer
var multer = require("multer");
var path = require('path');//路径
var storage = multer.diskStorage({
    //设置上传路径
    destination: function (req, file, cb) {
        //path.join(__dirname, 'public/views')
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    // destination:path.join(__dirname, 'public/uploads/'),
    //设置上传后文件的名称
    filename: function (req, file, cb) {
        var fileList = (file.originalname).split("."); //名称拆分获取名称和文件后缀
        //console.log(file);
        var newName = fileList[0] + "-" + Date.now() + "." + fileList[fileList.length - 1];
        //为了方式重复的名称出现  我们采用名称+时间戳+文件后缀名
        cb(null, newName);
    }
});
var upload = multer({
    storage: storage
});
//导出公共的方法
module.exports = upload;