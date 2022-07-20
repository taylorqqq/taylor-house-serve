var express = require('express');
var router = express.Router();
var buginfoServer = require("../service/buginfoServer");
let jwt = require("jsonwebtoken"); //引入该模块

router.get('/', function (req, res, next) {
    res.json({
        code: 1,
        msg: "测试bug接口"
    })
});
router.get("/group", async (req, res, next) => {
    let list = await buginfoServer.group();
    res.json({
        code: 1,
        msg: list
    })
})

//查询所以BUG

router.get("/bugalllist", (req, res, next) => {
    let token = req.headers.token; //获取token信息
    let page = req.query.page; //页码
    let shownum = req.query.shownum; //每页显示的数量
    let key = req.query.key; //获取查询的关键字
    let type = req.query.type; //类别
    let key1 = req.query.key1
    let key2 = req.query.key2
    jwt.verify(token, "abc", async (err, info) => {
        if (!err) { //没有错

            if (info.usertype == 1) { //是经理
                //查看所有的请假信息
                let skipnum = (page - 1) * shownum; //跳过的数量
                let params = {}; //参数


                if (key) {
                    let reg = new RegExp(`${key}`)
                    params.kind = reg; //表示根据开发者来进行查找
                }
                //创建人
                if (key1) {
                    let reg = new RegExp(`${key1}`)
                    params.testname = reg;
                }
                //指派人
                if (key2) {
                    let reg = new RegExp(`${key2}`)
                    params.developname = reg;
                }
                if (type) {
                    params.bugtype = type;
                }
                // let developname = info.username;
                let list = await buginfoServer.querybugall(params, skipnum, shownum * 1);
                let count = await buginfoServer.querycount(params);
                // console.log(list.kind);

                res.json({
                    code: 1,
                    data: list,
                    count
                })

            } else {
                res.json({
                    code: 0,
                    msg: "权限不够"
                })
            }
        } else {
            res.json({
                code: 0,
                msg: "token解析失败"
            })
        }



    })




})
router.patch("/updevelop", (req, res, next) => { //开发者修改接口
    let token = req.headers.token; //解析token
    jwt.verify(token, "abc", async (err, info) => {
        if (!err) {
            if (info.usertype == 2) {
                let {
                    bugtype,
                    id,
                    end
                } = req.body
                let data = await buginfoServer.update({
                    _id: id
                }, {
                    $set: {
                        bugtype,
                        end
                    }
                })
                res.json({
                    code: 1,
                    msg: "修改成功",
                })
            } else {
                res.json({
                    code: 0,
                    msg: "权限不足"
                })
            }
        } else {
            res.json({
                code: 0,
                msg: "token异常"
            })
        }
    })
})
router.get("/developAll", async (req, res, next) => {
    let { testname } = req.query
    let data = await buginfoServer.query({ testname });
    let name = data.map(item => item.developname);
    let nameAll = Array.from(new Set(name))
    let arr1 = [];
    let arr2 = [];
    let arr3 = [];
    nameAll.forEach((info) => {
        let a = 0
        let b = 0
        let c = 0
        data.forEach(item => {
            if (info == item.developname && item.bugtype == 1) {
                a++
            }
            if (info == item.developname && item.bugtype == 2) {
                b++
            }
            if (info == item.developname && item.bugtype == 3) {
                c++
            }
        })
        arr1.push(a)
        arr2.push(b)
        arr3.push(c)
    })
    res.json({
        code: 1,
        nameAll,
        arr1,
        arr2,
        arr3,
    })
})
router.get("/develop", (req, res, next) => { //开发者查询接口
    let token = req.headers.token; //解析token
    jwt.verify(token, "abc", async (err, info) => {
        let { bugtype, pegenum, select, input } = req.query
        if (!err) {
            if (info.usertype == 2) {
                let developname = info.username;
                let parmas = {
                    developname,
                    bugtype,
                }
                if (select == "testname") {
                    let reg = new RegExp(`${input}`)
                    parmas.testname = reg
                }
                if (select == "title") {
                    let reg = new RegExp(`${input}`)
                    parmas.title = reg
                }
                if (select == "detail") {
                    let reg = new RegExp(`${input}`)
                    parmas.detail = reg
                }
                let num = await buginfoServer.querycount(parmas)
                let data = await buginfoServer.queryall(parmas, (pegenum - 1) * 2, 2)
                res.json({
                    code: 1,
                    data,
                    num,
                    msg: "查询成功"
                })
            } else {
                res.json({
                    code: 0,
                    msg: "权限不足"
                })
            }
        } else {
            res.json({
                code: 0,
                msg: "token异常"
            })
        }
    })
})
router.post('/add', async (req, res, next) => {
    //接收前端传来的数据  写入数据库  返回值
    var token = req.headers.token; //解析token
    jwt.verify(token, "abc", function (err, info) {
        console.log(info);
        if (!err) {
            if (info.usertype == 3) {
                let testname = info.username;
                var { developname, title, kind, detail, start, extend } = req.body;
                console.log(kind);
                buginfoServer.add({
                    testname,
                    developname,
                    title,
                    kind,
                    detail,
                    start,
                    extend,
                    bugtype: 1
                }).then((data) => {
                    if (data.length) {
                        res.json({
                            code: 1,
                            msg: "新增成功",
                            list: data[0]
                        })
                    } else {
                        res.json({
                            code: 0,
                            msg: "新增失败"
                        })
                    }
                })
            } else {
                res.json({
                    code: 2,
                    msg: "权限不够 非法使用"
                })
            }
        } else {
            res.json({
                code: 0,
                msg: "token异常"
            })
        }
    })
});

router.get("/tasklist", (req, res, next) => {
    let token = req.headers.token;

    let key = req.query.key;//获取查询的关键字
    let page = req.query.page;//页码
    let shownum = req.query.shownum;//每页显示的数量
    let bugtype = req.query.bugtype;//类别
    let kind = req.query.kind;
    let searchall = req.query.searchall;


    jwt.verify(token, "abc", async (err, info) => {
        if (!err) {
            // let userid = info._id;
            let params = {};

            let skipnum = (page - 1) * shownum;//跳过的数量
            let testname = info.username;
            if (info.usertype == 3) {
                if (key) {
                    let reg = new RegExp(`${key}`)
                    params.detail = reg;   //表示根据项目描述来进行查找

                }

                if (kind) {
                    let reg = new RegExp(`${kind}`)
                    params.kind = reg;   //表示根据任务类型来进行查找
                }

                if (bugtype) {
                    params.bugtype = bugtype;
                }

                if (searchall != 1) {
                    params.testname = testname;
                }
                let list = await buginfoServer.queryall(params, skipnum, shownum * 1);
                let count = await buginfoServer.querycount(params);
                res.json({
                    code: 1,
                    list,
                    count
                })
            } else {
                res.json({
                    code: 0,
                    msg: "权限不够"
                })
            }
        } else {
            res.json({
                code: 0,
                msg: "token解析异常"
            })
        }
    })
})

router.patch("/update", (req, res, next) => {
    let token = req.headers.token;
    let {
        id,
        type
    } = req.body;

    jwt.verify(token, "abc", async (err, info) => {
        if (!err) {
            let usertype = info.usertype;
            if (usertype == 3) {
                let result = await buginfoServer.update({
                    _id: id
                }, {
                    $set: {
                        bugtype: type
                    }
                });
                if (result.modifiedCount) { //新增受影响的行数
                    res.json({
                        code: 1,
                        msg: "修改成功"
                    })
                } else {
                    res.json({
                        code: 0,
                        msg: "修改失败"
                    })
                }
            } else {
                res.json({
                    code: 0,
                    msg: "权限不够"
                })
            }
        } else {
            res.json({
                code: 0,
                msg: "token解析异常"
            })
        }

    })
});
module.exports = router;