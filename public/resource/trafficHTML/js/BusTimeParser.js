function transform(){
    var parser = new Parser((document.getElementById("text").value));
    var token,status= 0, n, t,result="";
    while((token =parser.nextToken())!=null){
        switch (status){
            case 0:
                switch (token){
                    case "桃132": n=1;break;
                    case "中133": n=2;break;
                    case "中172": n=3;break;
                }
                result+='{n:'+n+',';
                break;
            case 1:
                result+='a:"'+token+'",';
                break;
            case 2:
                result+='b:"'+token.substring(1)+'",';
                break;
            case 3:
                if(token!="－－"){
                    result+='c:"'+token+'",';
                }
                break;
            case 4:
                switch (token){
                    case "每日":t=1;break;
                    case "週一至週五":t=2;break;
                    case "週六、週日":t=3;break;
                }
                result+='t:'+t+"},\n";
                break;
        }
        status = (status+1)%5;
    }
    document.getElementById("output").value = result;
}