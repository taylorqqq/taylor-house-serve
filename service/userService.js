let userinfoModel = require("../model/userinfoModel");

module.exports = {
    query: (params) => {
        return userinfoModel.find(params);
    },
    add: (list) => {
        return userinfoModel.insertMany(list);
    },

    querytype2: () => {
        return userinfoModel.find({ usertype: 2 })
    },

}