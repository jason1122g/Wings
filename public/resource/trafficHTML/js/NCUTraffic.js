var NCUTraffic = {};
NCUTraffic.Bus = function(init){
    var busTime = [
        {n:2,a:"06:20",b:"06:40",t:2},
        {n:1,a:"14:10",b:"14:30",c:"14:50",t:1},
        {n:1,a:"06:30",b:"06:50",t:1},
        {n:1,a:"14:30",b:"14:50",t:1},
        {n:2,a:"06:50",b:"07:10",t:2},
        {n:2,a:"14:40",b:"15:00",t:2},
        {n:2,a:"07:00",b:"07:20",t:3},
        {n:1,a:"14:50",b:"15:10",t:1},
        {n:1,a:"07:10",b:"07:30",t:1},
        {n:2,a:"15:00",b:"15:20",t:3},
        {n:3,a:"07:20",b:"07:40",c:"08:05",t:2},
        {n:1,a:"15:10",b:"15:30",t:1},
        {n:1,a:"07:30",b:"07:50",c:"08:10",t:1},
        {n:2,a:"15:20",b:"15:40",t:2},
        {n:2,a:"07:40",b:"08:00",t:2},
        {n:1,a:"15:30",b:"15:50",t:1},
        {n:1,a:"07:50",b:"08:10",t:1},
        {n:1,a:"15:50",b:"16:10",t:1},
        {n:2,a:"08:00",b:"08:20",t:3},
        {n:2,a:"16:00",b:"16:20",t:3},
        {n:2,a:"08:05",b:"08:25",t:2},
        {n:3,a:"16:05",b:"16:30",c:"17:05",t:2},
        {n:1,a:"08:10",b:"08:30",c:"08:50",t:1},
        {n:1,a:"16:10",b:"16:30",t:1},
        {n:3,a:"08:20",b:"08:45",c:"09:10",t:1},
        {n:2,a:"16:20",b:"16:40",t:2},
        {n:1,a:"08:30",b:"08:50",t:1},
        {n:1,a:"16:30",b:"16:50",t:1},
        {n:1,a:"08:50",b:"09:10",t:1},
        {n:3,a:"16:45",b:"17:10",c:"17:30",t:3},
        {n:2,a:"09:00",b:"09:20",t:1},
        {n:2,a:"16:45",b:"17:15",t:2},
        {n:1,a:"09:10",b:"09:30",t:1},
        {n:1,a:"16:50",b:"17:10",t:1},
        {n:1,a:"09:30",b:"09:50",c:"10:10",t:1},
        {n:2,a:"17:00",b:"17:20",t:3},
        {n:1,a:"09:50",b:"10:10",t:1},
        {n:1,a:"17:10",b:"17:30",t:1},
        {n:2,a:"10:00",b:"10:25",t:1},
        {n:3,a:"17:05",b:"17:30",c:"17:55",t:2},
        {n:1,a:"10:10",b:"10:30",t:1},
        {n:1,a:"17:30",b:"17:50",t:1},
        {n:1,a:"10:30",b:"10:50",t:1},
        {n:1,a:"17:50",b:"18:10",t:1},
        {n:2,a:"10:45",b:"11:10",t:2},
        {n:2,a:"17:55",b:"18:15",t:3},
        {n:1,a:"10:50",b:"11:10",c:"11:30",t:1},
        {n:3,a:"18:00",b:"18:25",c:"18:50",t:1},
        {n:2,a:"11:00",b:"11:20",t:3},
        {n:1,a:"18:10",b:"18:30",t:1},
        {n:1,a:"11:10",b:"11:30",t:1},
        {n:2,a:"18:20",b:"18:40",t:2},
        {n:1,a:"11:30",b:"11:50",c:"12:10",t:1},
        {n:3,a:"18:25",b:"18:55",c:"19:20",t:3},
        {n:2,a:"11:45",b:"12:05",t:2},
        {n:1,a:"18:30",b:"18:50",t:1},
        {n:1,a:"11:50",b:"12:10",t:1},
        {n:1,a:"18:50",b:"19:10",c:"19:30",t:1},
        {n:2,a:"12:00",b:"12:20",t:3},
        {n:2,a:"19:00",b:"19:20",t:2},
        {n:1,a:"12:10",b:"12:30",t:1},
        {n:1,a:"19:10",b:"19:30",t:1},
        {n:3,a:"12:20",b:"12:45",c:"13:10",t:1},
        {n:1,a:"19:30",b:"19:50",t:1},
        {n:2,a:"12:25",b:"12:45",t:2},
        {n:3,a:"19:40",b:"20:05",c:"20:30",t:3},
        {n:1,a:"12:30",b:"12:50",t:1},
        {n:1,a:"19:50",b:"20:10",t:1},
        {n:2,a:"13:00",b:"13:20",t:3},
        {n:1,a:"20:10",b:"20:30",t:1},
        {n:1,a:"13:10",b:"13:30",c:"13:50",t:1},
        {n:1,a:"20:30",b:"20:50",t:1},
        {n:2,a:"13:20",b:"13:40",t:2},
        {n:1,a:"20:55",b:"21:15",t:1},
        {n:1,a:"13:30",b:"13:50",t:1},
        {n:1,a:"21:20",b:"21:40",t:1},
        {n:1,a:"13:50",b:"14:10",t:1},
        {n:1,a:"21:45",b:"22:05",t:1},
        {n:2,a:"14:00",b:"14:20",t:3},
        {n:1,a:"22:10",b:"22:30",t:1},
        {n:2,a:"14:05",b:"14:30",t:2}
    ];//桃132:1,中133:2,中172:3,每日1,一到五2,六日3
    var sliderContainer = init["sliderContainer"];

    var timeTransformer = new function(){
        var valueToTime = {
            0:"04:00",
            10:"06:00",
            20:"08:00",
            30:"10:00",
            40:"12:00",
            50:"14:00",
            60:"16:00",
            70:"18:00",
            80:"20:00",
            90:"22:00",
            100:"24:00"
        };
      return {
          transformValueToTime:function(value){
            return valueToTime[value];
          }
      }
    };

    var timeSliderID = "timeSlider",
        timeSliderLowerLabelID = "timeSliderLowerLabel",
        timeSliderUpperLabelID = "timeSliderUpperLabel",
        timeSliderLabelClass = "timeSliderLabel",
        sliderHTML =
        '<div id="'+timeSliderLowerLabelID+'" class="'+timeSliderLabelClass+'"></div>' +
        '<div id="'+timeSliderID+'"></div>' +
        '<div id="'+timeSliderUpperLabelID+'" class="'+timeSliderLabelClass+'"></div>';


    initSlider();

    function initSlider(){

        var transformTargetValueToTime = function(val){
            $(this).text(timeTransformer.transformValueToTime(parseInt(val)));
        };

        $(sliderContainer).html(sliderHTML);
        $('#'+timeSliderID).noUiSlider({
            start: [0, 100],
            step: 10,
            connect:true,
            range:{
                'min':0,
                'max':100
            },
            serialization:{
                lower:[new $.noUiSlider.Link({
                    target:$('#'+timeSliderLowerLabelID),
                    method:transformTargetValueToTime
                })],
                upper:[new $.noUiSlider.Link({
                    target:$('#'+timeSliderUpperLabelID),
                    method:transformTargetValueToTime
                })]
            }
        });

    }


    NCUTraffic.Bus.prototype.getByTimeBeginEndDays = function(timebegin,timeend,days){
        var timeArray=[],element;
        var daysArray=[0,0,0,0], i;
        for(i=0;i<days.length;i++){
            switch (days[i]){
                case "1":daysArray[1]=1;daysArray[2]=1;break;
                case "2":daysArray[1]=1;daysArray[2]=1;break;
                case "3":daysArray[1]=1;daysArray[2]=1;break;
                case "4":daysArray[1]=1;daysArray[2]=1;break;
                case "5":daysArray[1]=1;daysArray[2]=1;break;
                case "6":daysArray[1]=1;daysArray[3]=1;break;
                case "7":daysArray[1]=1;daysArray[3]=1;break;
            }
        }
        for(i=0;i<busTime.length;i++){
            element = busTime[i];
            if(element.b<timebegin&&element.b>timeend&&daysArray[element.t]){
                timeArray.push(element);
            }
        }
        return timeArray;
    }
};