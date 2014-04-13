// call this from the developer console and you can control both instances

var NCUCalendar = {};
NCUCalendar.Calendar = function(initiator){



    init();

    function init(){
        var containerSelector = initContainerSelector(initiator);
        var resourceBank = initResourceBank();
        initCalendar({
            containerSelector:containerSelector,
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
        var resourceBank = new JResource.ResourceController({
            resourceGetter:getResourceRemoteFunc
        });
        function getResourceRemoteFunc(resourceName,processFunc){
            $.ajax({
                type:'POST',
                url:"https://appforncu.appspot.com/getevent",
                data:{type:"read",data:resourceName},
                dataType:"text",
                success:function(textResourceRemote){
                    var jsonResourceRemote = JSON.parse(textResourceRemote);
                    if(isResourceCorrect(jsonResourceRemote)){
                        processFunc(getResourceData(jsonResourceRemote));
                    }else{
                        console.log("GG:NOT OK");
                    }
                }
            });
        }
        function getResourceData(resource){
            return resource["data"]["data"];
        }
        function isResourceCorrect(resource){
            return resource["data"]["code"]=="ok";
        }
        return resourceBank;
    }
    function initCalendar(initiator){
        var containerSelector = initiator["containerSelector"];
        var resourceBank = initiator["resourceBank"];

        var monthChecker = new MonthChecker();

        var thisMonth = moment().format('YYYY-MM');
        var eventArray = [
            { startDate: thisMonth + '-10', endDate: thisMonth + '-14', title: 'Multi-Day Event' },
            { startDate: thisMonth + '-21', endDate: thisMonth + '-23', title: 'Another Multi-Day Event' }
        ];

        $(containerSelector).clndr({
            daysOfTheWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            events: eventArray,
            clickEvents: {
                click: function(target) {
                    console.log(getDateByTarget(target));
                },
                onMonthChange: function(target) {
                    var year = getYearByTarget(target);
                    var month = getMonthByTarget(target);
                    var timeString = year+"-"+month;
                    processMonthChangeWithTimeString(timeString);
//                    $('.calendar-day-2014-04-15').css('background-color','#000');
                }
            },
            multiDayEvents: {
                startDate: 'startDate',
                endDate: 'endDate'
            },
            showAdjacentMonths: true,
            adjacentDaysChangeMonth: false
        });
        function MonthChecker(){
            var checkedMonthMap = {};
            return {
                isMonthProcessed:function(month){
                    return (checkedMonthMap[month]);
                },
                setMonthProcessed:function(month){
                    checkedMonthMap[month] = 1;
                }
            }
        }
        function processMonthChangeWithTimeString(timeString){
            if( ! monthChecker.isMonthProcessed(timeString)){
                resourceBank.getResourceByName(timeString,function(resource){
//                    processResource(resource);
                })
            }
            //jump to specified month event list

        }

        function getDateByTarget(target){
            return target.date._i;
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
    }


};
