exports.isMatchedFrom = function (src,tar,targetBegin){
    for(var i=0;i<src.length;i++){
        if(src[i]!=tar[targetBegin+i]){
            return false;
        }
    }
    return true;
}
exports.isMatchedHead =function (src,tar){
    return exports.isMatchedFrom(src,tar,0);
}
exports.getFileNameExtension = function (name){
    var i = name.length;
    for(;i>=0;i--){
        if(name[i]=='.'){
            break;
        }
    }
    if(i==0){
        return null;
    }
    return name.substring(i+1,name.length);
}