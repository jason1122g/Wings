var http = require("http");
var logger = require("./tool/logger")
function start(route,pathHandleManager){
    function onRequest(request,response){
        route(pathHandleManager ,request, response);
    }
    http.createServer(onRequest).listen(8888,function(){
        logger.logMSG("[Server] Server start\n===============================",false);
    });
}

exports.start = start;
