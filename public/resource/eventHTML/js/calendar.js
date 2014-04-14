// call this from the developer console and you can control both instances

var NCUCalendar = {};
NCUCalendar.Calendar = function(initiator){

    var clickEventName = (('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch)) ? 'touchstart' : 'click';

    var calendar = init();
    initCalendarState();

    function init(){
        var containerSelector = initContainerSelector(initiator);
        var eventListSelector = initEventList(initiator);
        var resourceBank = initResourceBank();
        return initCalendar({
            containerSelector:$(containerSelector),
            eventListSelector:$(eventListSelector),
            resourceBank:resourceBank
        });
    }
    function initContainerSelector(initiator){
        var containerSelector;
        if(initiator.hasOwnProperty("containerSelector")){
            containerSelector = initiator["containerSelector"];
        }else{
            throw "No containerSelector specified";
        }
        return containerSelector;
    }
    function initResourceBank(){
        return new JResource.ResourceController({
            resourceGetter:getResourceRemoteFunc
        });
        function getResourceRemoteFunc(resourceName,processFuncCallBack){

            var thisYearAndMonth = resourceName;

            $.ajax({
                type:'POST',
                url:"https://appforncu.appspot.com/getevent",
                data:{type:"read",data:thisYearAndMonth},
                dataType:"text",
                success:function(textResourceMessage){
                    var jsonResourceMessage = JSON.parse(textResourceMessage);
                    if(isResourceCorrectByJSON(jsonResourceMessage)){
                        var resourceData = getResourceDataByJSON(jsonResourceMessage);
                        var eventArrayCollection = parseDataIntoHTMLAndSelectorWithThisYearMonth(resourceData,thisYearAndMonth);
                        processFuncCallBack(eventArrayCollection);
                    }else{
                        console.log("GG:NOT OK");
                    }
                }
            });

            function getResourceDataByJSON(resource){
                return resource["data"]["data"];
            }
            function isResourceCorrectByJSON(resource){
                return resource["data"]["code"]=="OK";
            }
        }
        function parseDataIntoHTMLAndSelectorWithThisYearMonth(arrEventObject,thisYearAndMonth){

            var eventHTMLArray=[];
            var eventSelectorNameArray=[];
            var eventDateToHTMLIndexArray={};
            var eventCounter;
            for(eventCounter=0;eventCounter<arrEventObject.length;eventCounter++){
                var event = arrEventObject[eventCounter];
                processEventWithThisYearMonth(event,thisYearAndMonth);
            }
            return {
                eventHTMLArray:eventHTMLArray,
                eventSelectorNameArray:eventSelectorNameArray,
                eventDateToHTMLIndexArray:eventDateToHTMLIndexArray
            };

            function processEventWithThisYearMonth(event,thisYearAndMonth){
                var name = event["name"];
                var timeFrom = event['from'];
                var timeTo = event['to'];
                var dateFrom = parseTimeIntoDate(timeFrom);
                var dateTo = parseTimeIntoDate(timeTo);
                var dateThis = parseTimeIntoDate(thisYearAndMonth+"-01"); //rule of momentJS
                var startDate=0,endDate=31;

                calculateStartDateAndEndDate();

                applyEventToSelectorNameArray();
                applyEventToHTMLArray();
                applyEventDateToHTMLIndexArrayMap();

                function calculateStartDateAndEndDate(){
                    if(isAlloutsideThisMonth()){
                        startDate = 0;
                        endDate   = 31;
                    }else if(isLeftOutsideThisMonth()){
                        startDate = 0;
                        endDate = dateTo.getDate();
                    }else if(isRightOutsideThisMonth()){
                        startDate = dateFrom.getDate();
                        endDate = 31;
                    }else{
                        startDate = dateFrom.getDate();
                        endDate = dateTo.getDate();
                    }
                    function isAlloutsideThisMonth(){
                        return (dateFrom.getMonth()<dateThis.getMonth()&&dateTo.getMonth()>dateThis.getMonth())
                    }
                    function isLeftOutsideThisMonth(){
                        return dateFrom.getMonth() < dateThis.getMonth();
                    }
                    function isRightOutsideThisMonth(){
                        return dateTo.getMonth() > dateThis.getMonth();
                    }
                }
                function applyEventToSelectorNameArray(){
                    for(var i=startDate;i<=endDate;i++){
                        var eachDate = thisYearAndMonth +"-"+ formatIntegerDayToString(i);
                        eventSelectorNameArray.push('.calendar-day-'+eachDate);
                    }
                }
                function applyEventToHTMLArray(){
                    eventHTMLArray.push(getHTMLTemplate());
                }
                function applyEventDateToHTMLIndexArrayMap(){
                    for(var i=startDate;i<=endDate;i++){
                        var eachDate = thisYearAndMonth +"-"+ formatIntegerDayToString(i);
                        if(typeof eventDateToHTMLIndexArray[eachDate] != 'object'){
                            eventDateToHTMLIndexArray[eachDate] = [];
                        }
                        eventDateToHTMLIndexArray[eachDate].push(eventCounter);
                    }
                }
                function getHTMLTemplate(){
                    return  "<div class='eventLine'>" +
                        "<div class='eventContent'>"+
                        "<div class='eventName'>"+name+"</div>" +
                        "<div class='eventTime'>"+timeFrom+" ~ "+timeTo+"</div> "+
                        "</div>"+
                        "</div>";
                }

                function parseTimeIntoDate(time){
                    var date = new Date();
                    date.setFullYear(getYearByTime(time));
                    date.setMonth(getMonthByTime(time));
                    date.setDate(getDateByTime(time));
                    return date;

                    function getYearByTime(time){
                        return time.substring(0,4);
                    }
                    function getMonthByTime(time){
                        return parseInt(time.substring(5,7))-1;
                    }
                    function getDateByTime(time){
                        return time.substring(8,10);
                    }
                }
                function formatIntegerDayToString(day){
                    if(day<10){
                        return "0"+day;
                    }else{
                        return day;
                    }
                }
            }
        }

    }
    function initEventList(initiator){
        var eventList;
        if(initiator.hasOwnProperty("eventListSelector")){
            eventList = initiator["eventListSelector"];
        }else{
            throw "No eventList specified";
        }
        return eventList;
    }
    function initCalendar(initiator){
        var containerSelector = initiator["containerSelector"];
        var resourceBank = initiator["resourceBank"];
        var eventListSelector = initiator["eventListSelector"];

        var calender = containerSelector.clndr({
            daysOfTheWeek: ['日', '一', '二', '三', '四', '五', '六'],
            clickEvents: {
                click: function(clickResult) {
                    if(!$(clickResult.element).hasClass("adjacent-month")){

                        var timeString = getTimeStringByClickResult(clickResult);

                        resourceBank.getResourceByName(timeString,function(eventArrayCollection){

                            var eventHTMLArray = eventArrayCollection.eventHTMLArray;
                            var dateToHTMLIndexArrayMap = eventArrayCollection.eventDateToHTMLIndexArray;
                            var eventsIndexArray = dateToHTMLIndexArrayMap[getDateByClickResult(clickResult)];

                            if(hasEvents()){
                                eventListSelector.html("");
                                for(var i=0;i<eventsIndexArray.length;i++){
                                    var eachIndex = eventsIndexArray[i];
                                    eventListSelector.append(eventHTMLArray[eachIndex]);
                                }
                            }
                            function hasEvents(){
                                return eventsIndexArray;
                            }
                        })
                    }
                },
                onMonthChange: function(target) {
                    var timeString = getTimeStringByTarget(target);
                    processMonthChangeWithTimeString(timeString);
                    processMonthTitleEvent();
                }
            },
            showAdjacentMonths: true,
            adjacentDaysChangeMonth: false
        });
        return calender;

        function processMonthChangeWithTimeString(timeString){
            resourceBank.getResourceByName(timeString,function(eventArrayCollection){
                processEventHTML();
                processEventSelector();
                function processEventHTML(){
                    eventListSelector.html(eventArrayCollection.eventHTMLArray.join(""));
                }
                function processEventSelector(){
                    var nameArray = eventArrayCollection.eventSelectorNameArray;
                    for(var i=0;i<nameArray.length;i++){
                        $(nameArray[i]).addClass('hasEvent');
                    }
                }
            })
        }
        function processMonthTitleEvent(){
            var titleSelector =  $('.month');
            titleSelector.on(clickEventName,function(){
                initCalendarState();
            });
        }
        function getDateByClickResult(result){
            return result.date._i;
        }
        function getTimeStringByClickResult(result){
            return getDateByClickResult(result).substring(0,7);
        }
        function getMonthByTarget(target){
            var month = target.month()+1;
            if(month.length=1){
                month = "0"+month;
            }
            return month;
        }
        function getYearByTarget(target){
            return target.year();
        }
        function getTimeStringByTarget(target){
            var year = getYearByTarget(target);
            var month = getMonthByTarget(target);
            return year+"-"+month;
        }
    }
    function initCalendarState(){
        $('.clndr-previous-button').click();
        $('.clndr-next-button').click();
    }

};
