var fs = require("fs");
var logger = require("./logger");

exports.FileReader = function FileReader(){
    FileReader.prototype.readContent = function(jsonObject){
        var path = jsonObject.path;
        var successFunc = jsonObject.successFunc;
        var failFunc = jsonObject.failFunc;

        fs.readFile(path,function(err,content){
            if(err){
                report("Error occured: Cannot read File(CONTENT)");
                if(typeof failFunc!='undefined'){
                    failFunc(err);
                }
            }else{
                successFunc(content);
            }
        });
        return this;
    }
    FileReader.prototype.readState = function(jsonObject){
        var path = jsonObject.path;
        var successFunc = jsonObject.successFunc;
        var failFunc = jsonObject.failFunc;
        fs.stat(path,function(err,stat){
            if(err&&failFunc){
                report("Error occured:Cannot read File(STATE)");
                failFunc(err);
            }else{
                successFunc(stat);
            }
        });
    }
}
function report(msg){
    logger.logMSG("[FileSystem] "+msg,true);
}