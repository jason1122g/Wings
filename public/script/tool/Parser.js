function Parser (s){
    var i=0;
    Parser.prototype.nextToken = function(){
        var t="";
        var status=1;
        var nextChar;
        while(true){
            if(i== s.length){
                if(t!=""){
                    return t;
                }else{
                    return null;
                }
            }
            nextChar = s.charAt(i++);
            if(nextChar==" "|| nextChar=="\n" || nextChar=="\t" || nextChar=="\r"){
                if(status==1){
                    continue;
                }else{
                    break;
                }
            }else{
                if(status==1){
                    status=2;
                    i--;
                }else{
                    t+=nextChar;
                }
            }
        }
        return t;
    }
}