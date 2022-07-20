var express = require('express');
var router = express.Router();
let upload = require("../until/multer");
let config = require("../config/index");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/uploads", upload.array('filename'), (req, res, next) => {//根据filename进行上传
  //如果图片上传成功  返回图片上传的地址
  res.json({
    code: 1,
    url: config.baseURL + "/uploads/" + req.files[0].filename,
  })
})

module.exports = router;
