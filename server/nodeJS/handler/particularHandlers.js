var responser = require("../tool/Responser");
var logger = require("../tool/logger");

exports.start = function (jsonData){
    responser.response(jsonData);
}

