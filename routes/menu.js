var express = require("express");
var router = express.Router();
var menuinfoService = require("../service/menuinfoService");
let jwt = require("jsonwebtoken"); //引入该模块
const successMsg = "操作成功";
const errorMsg = "操作失败";

//查询菜单
router.get("/menu-list", (req, res, next) => {
  let token = req.headers.token; //获取token信息
  const { search } = req.query;
  //   let params = JSON.parse(search);
  let params = search;
  //   let page = req.query.page; //页码
  //   let shownum = req.query.shownum; //每页显示的数量
  //   let key = req.query.key; //获取查询的关键字
  //   let type = req.query.type; //类别
  //   let key1 = req.query.key1;
  //   let key2 = req.query.key2;
  if (!token) {
    res.json({
      code: 500,
      msg: "token异常!",
    });
  } else {
    jwt.verify(token, "abc", async (err, info) => {
      if (!err) {
        menuinfoService.query(params).then((data) => {
          res.json({
            code: 200,
            data,
            msg: successMsg,
          });
        });
      } else {
        res.json({
          code: 200,
          msg: "token解析失败",
        });
      }
    });
  }
});
router.post("/add", async (req, res, next) => {
  var token = req.headers.token; //解析token
  if (!token) {
    res.json({
      code: 500,
      msg: "token异常!",
    });
  } else {
    jwt.verify(token, "abc", function (err, info) {
      if (!err) {
        const {
          component,
          deleteFlag,
          enabled,
          icon,
          name,
          number,
          parentNumber,
          pushBtn,
          sort,
          state,
          type,
        } = req.body;
        menuinfoService.query({ name }).then((data) => {
          if (data.length) {
            res.json({
              code: 500,
              msg: "菜单名称已存在",
            });
          } else {
            menuinfoService
              .add({
                component,
                deleteFlag,
                enabled,
                icon,
                name,
                number,
                parentNumber,
                pushBtn,
                sort,
                state,
                type,
              })
              .then((data) => {
                if (data.length) {
                  res.json({
                    code: 200,
                    msg: "新增成功",
                  });
                } else {
                  res.json({
                    code: 500,
                    msg: "新增失败",
                  });
                }
              });
          }
        });
      } else {
        res.json({
          code: 500,
          msg: "token异常",
        });
      }
    });
  }
});
router.patch("/update", (req, res, next) => {
  let token = req.headers.token;
  let { id, type } = req.body;

  jwt.verify(token, "abc", async (err, info) => {
    if (!err) {
      let usertype = info.usertype;
      if (usertype == 3) {
        let result = await menuinfoService.update(
          {
            _id: id,
          },
          {
            $set: {
              bugtype: type,
            },
          }
        );
        if (result.modifiedCount) {
          //新增受影响的行数
          res.json({
            code: 1,
            msg: "修改成功",
          });
        } else {
          res.json({
            code: 0,
            msg: "修改失败",
          });
        }
      } else {
        res.json({
          code: 0,
          msg: "权限不够",
        });
      }
    } else {
      res.json({
        code: 0,
        msg: "token解析异常",
      });
    }
  });
});
module.exports = router;
