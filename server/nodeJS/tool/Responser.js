var fileSystem = require("./FileSystem");
var logger = require("./logger");
var comparer = require("./Comparer");
var fileReader = new fileSystem.FileReader();
var fileTypes={
    "css":"text/css",
    "html":"text/html",
    "js":"text/javascript",
    "ico":"image/x-icon",
    "jpg":"image/jpeg",
    "png":"image/png",
    "map":"application/json",
    "svg":"image/svg+xml",
    "gif":"image/gif",
    "manifest":"text/cache-manifest",
    "woff":"application/x-font-woff",
    "ttf":"application/x-font-ttf"
};


function checkHeaderIfNotModified(jsonData,lastModified){
    var expires = new Date();
    expires.setTime(expires.getTime() + 8000);
    jsonData.res.setHeader("Last-Modified",lastModified);
    jsonData.res.setHeader("Expires", expires.toUTCString());
    jsonData.res.setHeader("Cache-Control", "max-age=" + 8000);
    if(jsonData.req.headers["if-modified-since"] && lastModified==jsonData.req.headers["if-modified-since"]){
        return true;
    }else{
        return false;
    }
}
function prepareFile(jsonData){
    fileReader.readState({
        path:jsonData.path,
        successFunc:function(stat){
            if(checkHeaderIfNotModified(jsonData,stat.mtime.toUTCString())){
                exports.response304(jsonData.res);
            }else{
                responseFile(jsonData);
            }
        },
        failFunc:function(){
            exports.response500(jsonData.res);
        }
    });
}
function responseFile(jsonData){
    fileReader.readContent({
        path:jsonData.path,
        successFunc:function(content){
            jsonData.res.writeHead(200, {"Content-Type": fileTypes[comparer.getFileNameExtension(jsonData.path)]});
            jsonData.res.write(content);
            jsonData.res.end();
        },
        failFunc:function(){
            exports.response500(jsonData.res);
        }
    });
}
exports.response = function (jsonData){
    var nameExtension = comparer.getFileNameExtension(jsonData.path);
    if(fileTypes[nameExtension]){
        prepareFile(jsonData);
    }else{
        logger.logMSG("Invalid file type access:"+nameExtension,true);
        exports.response404(jsonData.res);
    }
}
exports.responseJSON = function(data,response){
    response.writeHead(200, {"Content-Type": "application/json"});
    response.write(data);
    response.end();
}
exports.response500 = function(response){
    response.writeHead(500,{"Content-Type":"text/plain"});
    response.write("500 internal error");
    response.end();
}
exports.response404 = function (response){
    response.writeHead(404,"404 Not Found");
    response.end();
}
exports.response304 = function(response){
    response.writeHead(304,"Not Modified");
    response.end();
}
