
var Server = require("./server");
var Router = require("./router");
var PathHandler   = require("./tool/PathHandler");
var StandardHandler = require("./handler/standardHandler");

var viewPath = "app/Map/view";
var pathHandler = new PathHandler.PathHandler();
pathHandler.addRoutePaths({
    "favicon.ico":"public/image/favicon.ico",
    "":viewPath+"/index.html",
    "map.html":viewPath+"/map.html",
    "attackDB.html":viewPath+"/attackDB.html",
    "traffic.html":viewPath+"/traffic.html",
    "event.html":viewPath+"/event.html",
    "leftSide.html":viewPath+"/leftSide.html",
    "contact.html":viewPath+"/contact.html",
    "contacts/contactA.html":viewPath+"/contacts/contactA.html",
    "contacts/contactB.html":viewPath+"/contacts/contactB.html",
    "contacts/contactC.html":viewPath+"/contacts/contactC.html",
    "contacts/contactD.html":viewPath+"/contacts/contactD.html",
    "contacts/contactE.html":viewPath+"/contacts/contactE.html",
    "mapContact.html":viewPath+"/mapContact.html"
});
pathHandler.addSpecialHandler({
//    "/":particularHandlers.start
});
pathHandler.addValidPaths({
    "public":StandardHandler.handleStandardRequest,
    "app/Map/view":StandardHandler.handleStandardRequest
});


Server.start(Router.route, pathHandler);
