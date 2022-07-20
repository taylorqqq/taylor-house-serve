let menuinfoModel = require("../model/menuinfoModel");

module.exports = {
  query: (params) => {
    return menuinfoModel.find(params);
  },
  queryall: (params, skipnum, shownum) => {
    return menuinfoModel.find(params).skip(skipnum).limit(shownum);
  },
  querycount: (params) => {
    return menuinfoModel.find(params).count();
  },
  add: (info) => {
    return menuinfoModel.insertMany([info]); //返回的是一个promise
  },
  update: (params1, params2) => {
    return menuinfoModel.updateOne(params1, params2);
  },

  group: () => {
    return menuinfoModel.aggregate([
      {
        $group: {
          _id: "$bugtype", //_id不能变  $username
          count: { $sum: 1 }, //类似于.count 但这是是管道函数　　所以还需要加上$sum关键词
        },
      },
    ]);
  },
  querybugall: (params, skipnum, shownum) => {
    return menuinfoModel.find(params).skip(skipnum).limit(shownum);
  },
};
