
exports.logMSG = function(msg,isLogFile){
    var date = new Date();
    var string = msg+" ---> "+
        date.getFullYear()+
        "/"+(date.getMonth()+1)+
        "/"+date.getDate()+
        "-"+date.getHours()+
        ":"+date.getMinutes()+
        ":"+date.getSeconds();
    console.log(string);
    if(isLogFile){

    }
}