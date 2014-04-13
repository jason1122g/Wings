var logger = require("./logger");
var comparer = require("./Comparer");
function PathHandler(){
    this.validPaths = {};
    this.routePaths = {};
    this.handles = {};
}
PathHandler.prototype.tryHandlePath = function(jsonData){//{path,request,response}
    if(typeof this.routePaths[jsonData.path]!='undefined'){
        jsonData.path = this.routePaths[jsonData.path];
    }
    if(typeof this.handles[jsonData.path]!='undefined'){
        this.handles[jsonData.path](jsonData);
        return true;
    }
    for(var v in this.validPaths){
        if(comparer.isMatchedHead(v,jsonData.path)){
            this.validPaths[v](jsonData);
            return true;
        }
    }//TODO can optimize by trim "/"
    return false;
}
PathHandler.prototype.addSpecialHandler = function(paths){
    for(var p in paths){
        this.handles[p] = paths[p];
        report("addSpecialHandler:"+p);
    }
}
PathHandler.prototype.addValidPaths = function(paths){
    for(var p in paths){
        this.validPaths[p]=paths[p];
        report("addValidPaths:"+p);
    }
}
PathHandler.prototype.addRoutePaths = function(paths){
    for(var p in paths){
        this.routePaths[p] = paths[p];
        report("addRoutePaths:"+p+"->"+paths[p]);
    }
}
function report(msg){
    logger.logMSG("[PathManager] "+msg,false);
}
exports.PathHandler = PathHandler;