var url = require("url");
var logger = require("./tool/logger");
var responser = require("./tool/Responser");

exports.route = function(pathHandleManager,request,response){
    var pathname = url.parse(request.url).pathname.substring(1);
    report("Route request:{"+pathname+"}==>["+request.connection.remoteAddress+"]",false);

    if(!pathHandleManager.tryHandlePath({path:pathname,req:request,res:response})){
        report("Invalid path access:"+pathname,true);
        responser.response404(response);
    }
}
function report(msg,bool){
    logger.logMSG("[Router] "+msg,bool);
}