var express = require("express");
var router = express.Router();
const userService = require("../service/userService");
let crypto = require("crypto"); // 用来处理加密信息
let jwt = require("jsonwebtoken"); //引入该模块
const { route } = require(".");
const successMsg = "操作成功";
const errorMsg = "操作失败";

router.get("/type2", async (req, res, next) => {
  let list = await userService.querytype2();
  res.json({
    code: 1,
    msg: list,
  });
});

router.get("/search", async (req, res, next) => {
  let list = await userService.query({ usertype: 2 });
  res.json({
    code: 1,
    list,
  });
});

router.get("/testall", async (req, res, next) => {
  //查询测试者接口
  let data = await userService.query({ usertype: 3 });
  res.json({
    code: 1,
    data,
    msg: successMsg,
  });
});

// 查询用户列表
router.get("/user-list", async (req, res, next) => {
  let token = req.headers.token; //获取token信息
  if (!token) {
    res.json({
      code: 500,
      msg: "token异常!",
    });
  } else {
    const { search } = req.query; // 字段参数
    // let page = req.query.page; //页码
    // let shownum = req.query.shownum; //每页显示的数量
    // let key = req.query.key; //获取查询的关键字
    // let type = req.query.type; //类别
    // let key1 = req.query.key1;
    // let key2 = req.query.key2;
    let params = JSON.parse(search);
    jwt.verify(token, "abc", async (err, info) => {
      if (!err) {
        let data = await userService.query(params);
        res.json({
          code: 200,
          data,
          msg: successMsg,
        });
      } else {
        res.json({
          code: 500,
          msg: "token解析失败",
        });
      }
    });
  }
});

router.post("/login", async (req, res, next) => {
  let { username, userpwd } = req.body; // 获取请求的参数值
  let md5 = crypto.createHash("md5");
  userpwd = md5.update(userpwd).digest("hex");
  let list = await userService.query({ username, userpwd });
  if (list.length) {
    let info = list[0];
    let { username, _id, usertype } = info; //取出用户信息
    let token = jwt.sign({ username, _id, usertype }, "abc", {
      expiresIn: 60 * 60 * 24 * 7, //设置过期时间 ==> 秒(s)
    }); // token 签名加密
    res.json({
      msg: "登录成功",
      code: 200,
      data: {
        token,
        usertype,
        username,
        info,
      },
    });
  } else {
    res.json({
      code: 500,
      msg: "用户名和密码不匹配",
    });
  }
});
router.post("/register", async (req, res, next) => {
  let { username, userpwd, usertype } = req.body; //获取请求的参数值
  //查询用户名是否存在
  let result = await userService.query({ username });
  if (result.length) {
    res.json({
      code: 500,
      msg: "该用户名已经存在",
      data: [],
    });
  } else {
    //需要对密码进行加密处理
    let md5 = crypto.createHash("md5");
    userpwd = md5.update(userpwd).digest("hex");
    await userService.add([{ username, userpwd, usertype }]);
    res.json({
      code: 200,
      msg: "注册成功",
      data: [],
    });
  }
});
module.exports = router;
