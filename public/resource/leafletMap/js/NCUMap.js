var NCUMap = {};
NCUMap.Map = function(init){
    var thisPtr = NCUMap.Map;
    var container = init["container"];
    var gpsEnable = init["gpsEnable"];
    var coderEnable = init["coderEnable"];
    var selecterEnable = init["selecterEnable"];

    var clickEventName = (('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch)) ? 'touchstart' : 'click';
    var locationNameToLatlng  = {};
    var layerIdToRefernce = {};
    var layerCodeInput;   //jquery selector(input/text)
    var layerDivGroup;    //jquery selector(div/checkbox,delete,label)
    var map = initMap();
    initControllers();

    function initMap(){
        var map = L.map(container,{
            minZoom:16,
            maxZoom:18,
            maxBounds: L.latLngBounds(L.latLng(24.962752, 121.200285), L.latLng(24.974560, 121.183312)),
            zoomControl:false,
            attributionControl:true
        }).setView([24.968282,121.192511],16);
        map.doubleClickZoom.disable();
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        }).addTo(map);
        return map;
    }
    function initControllers(){
        initMenu();
        initSelector();
        initGPSLocator();
        function initMenu(){
            initSetting();
            initCoder();
            initEvent();
            function initSetting(){
                var layerControler = L.control({position:'topright'});
                layerControler.onAdd = function(){
                    var div = L.DomUtil.create('div');
                    div.innerHTML = " <div id='nculayercontrol' class='info btn btn-default'> " +
                        "<i id='ncucontrolbutton' class='fa fa-gear fa-2x'></i>" +
                        "</div>";
                    return div;
                };
                layerControler.addTo(map);
            }
            function initCoder(){
                var controlLayer = L.control({position:'topright'});
                controlLayer.onAdd = function(){
                    var div = L.DomUtil.create('div','controlLayer info');//
                    div.innerHTML = "";
                    if(coderEnable){
                        div.innerHTML += "<div id='nculayerblock' class='input-group'><input placeholder=' 輸入圖層碼' id='nculayerinput' class='form-control' type='text'>" +
                            "<span id='ncuinputblock' class='input-group-addon btn btn-default'><i class='fa fa-download '></i></span></div>";
                    }
                    div.innerHTML += "<div id='nculayergroup'></div>";
                    return div;
                };
                controlLayer.addTo(map);
            }
            function initEvent(){
                var layer = $('.controlLayer');
                $('#ncucontrolbutton').on(clickEventName,function(e){
                    layer.toggle();
                    e.preventDefault();
                });
                layerCodeInput = $('#nculayerinput');
                $('#ncuinputblock').on(clickEventName,function(){
                    getLayerByID(layerCodeInput.val());
                });
                layer.hide();

                layerDivGroup = $('#nculayergroup');
                layerDivGroup.on(clickEventName,'label.nculayercheckbox',function(){
                    var checkbox = $(this);
                    var layerid = checkbox.parent().attr('id');
                    if(checkbox.attr('data-checked')=='true'){
                        setLayerState(layerid,false);
                    }else{
                        setLayerState(layerid,true);
                    }
                });
                layerDivGroup.on(clickEventName,'span.nculayerdelete',function(){
                    var layername = $(this).closest('div').attr('id');
                    map.removeLayer(layerIdToRefernce[layername]);
                    layerIdToRefernce[layername] = null;
                    $('#'+layername).remove();
                });
            }
        }
        function initSelector(){
            if(selecterEnable){
                var searcher = L.control({position:'topleft'});
                searcher.onAdd = function(){
                    var div = L.DomUtil.create('div');
                    div.innerHTML = " <select id='ncuplace'><option></option></select>";
                    return div;
                };
                searcher.addTo(map);

                var selector_area = $('#ncuplace');
                selector_area.select2({
                    placeholder:"選擇地區",
                    width:200
                });
                selector_area.change(function(){
                    setViewToLocationName(selector_area.val());
                });
            }
            var data = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"name":"大講堂","kind":4},"geometry":{"type":"Point","coordinates":[121.19597911834717,24.96721004886997]}},{"type":"Feature","properties":{"name":"高壓變電站","kind":4},"geometry":{"type":"Point","coordinates":[121.19663357734679,24.96731703725409]}},{"type":"Feature","properties":{"name":"男十三舍","kind":2},"geometry":{"type":"Point","coordinates":[121.19641900062561,24.966563253476057]}},{"type":"Feature","properties":{"name":"據德樓","kind":4},"geometry":{"type":"Point","coordinates":[121.19588792324066,24.966806410037965]}},{"type":"Feature","properties":{"name":"游藝館","kind":4},"geometry":{"type":"Point","coordinates":[121.19596838951111,24.966271464967516]}},{"type":"Feature","properties":{"name":"男六舍","kind":2},"geometry":{"type":"Point","coordinates":[121.1956626176834,24.965882412546595]}},{"type":"Feature","properties":{"name":"男七舍","kind":2},"geometry":{"type":"Point","coordinates":[121.19541585445404,24.96560521194631]}},{"type":"Feature","properties":{"name":"男五舍","kind":2},"geometry":{"type":"Point","coordinates":[121.19524955749512,24.9661012546847]}},{"type":"Feature","properties":{"name":"男十一舍","kind":2},"geometry":{"type":"Point","coordinates":[121.19495451450348,24.965610075120114]}},{"type":"Feature","properties":{"name":"國際學生宿舍","kind":2},"geometry":{"type":"Point","coordinates":[121.19444489479065,24.966193654581723]}},{"type":"Feature","properties":{"name":"女十四舍","kind":2},"geometry":{"type":"Point","coordinates":[121.19435369968414,24.96561493829374]}},{"type":"Feature","properties":{"name":"學生活動中心","kind":4},"geometry":{"type":"Point","coordinates":[121.19377970695494,24.965639254158944]}},{"type":"Feature","properties":{"name":"女五舍","kind":2},"geometry":{"type":"Point","coordinates":[121.19332373142242,24.9661012546847]}},{"type":"Feature","properties":{"name":"男三舍","kind":2},"geometry":{"type":"Point","coordinates":[121.19328081607819,24.965561443373396]}},{"type":"Feature","properties":{"name":"女一舍","kind":2},"geometry":{"type":"Point","coordinates":[121.19240105152129,24.966397906739502]}},{"type":"Feature","properties":{"name":"女三舍","kind":2},"geometry":{"type":"Point","coordinates":[121.19241714477539,24.966183928280042]}},{"type":"Feature","properties":{"name":"女二舍","kind":2},"geometry":{"type":"Point","coordinates":[121.19172513484953,24.966422222449978]}},{"type":"Feature","properties":{"name":"女四舍","kind":2},"geometry":{"type":"Point","coordinates":[121.1917197704315,24.966183928280042]}},{"type":"Feature","properties":{"name":"水文與海洋科學所","kind":1},"geometry":{"type":"Point","coordinates":[121.1949437856674,24.967365668307018]}},{"type":"Feature","properties":{"name":"科學一館","kind":1},"geometry":{"type":"Point","coordinates":[121.1945468187332,24.96744347795174]}},{"type":"Feature","properties":{"name":"應用地質研究所","kind":1},"geometry":{"type":"Point","coordinates":[121.19417667388915,24.9673608052026]}},{"type":"Feature","properties":{"name":"地球科學院","kind":1},"geometry":{"type":"Point","coordinates":[121.19457364082336,24.96708847104787]}},{"type":"Feature","properties":{"name":"化材系館","kind":1},"geometry":{"type":"Point","coordinates":[121.19303405284882,24.967686632774342]}},{"type":"Feature","properties":{"name":"實習一館","kind":1},"geometry":{"type":"Point","coordinates":[121.19237959384918,24.96756019232656]}},{"type":"Feature","properties":{"name":"工程一館","kind":1},"geometry":{"type":"Point","coordinates":[121.19276583194731,24.967156554643065]}},{"type":"Feature","properties":{"name":"資策會","kind":9},"geometry":{"type":"Point","coordinates":[121.19163393974303,24.96774985294953]}},{"type":"Feature","properties":{"name":"通訊系","kind":1},"geometry":{"type":"Point","coordinates":[121.19186460971832,24.967239227529426]}},{"type":"Feature","properties":{"name":"電機系","kind":1},"geometry":{"type":"Point","coordinates":[121.19134962558746,24.967467793455604]}},{"type":"Feature","properties":{"name":"行政大樓","kind":9},"geometry":{"type":"Point","coordinates":[121.19506716728209,24.968289654661078]}},{"type":"Feature","properties":{"name":"總圖書館","kind":5},"geometry":{"type":"Point","coordinates":[121.1943107843399,24.96824588704294]}},{"type":"Feature","properties":{"name":"中正圖書館","kind":5},"geometry":{"type":"Point","coordinates":[121.19361877441405,24.96823616090347]}},{"type":"Feature","properties":{"name":"文學一館","kind":1},"geometry":{"type":"Point","coordinates":[121.19463801383972,24.969374114005042]}},{"type":"Feature","properties":{"name":"文學二館","kind":1},"geometry":{"type":"Point","coordinates":[121.19457900524138,24.968921851853032]}},{"type":"Feature","properties":{"name":"人文社會科學大樓","kind":1},"geometry":{"type":"Point","coordinates":[121.19520127773285,24.96933034677267]}},{"type":"Feature","properties":{"name":"前門","kind":4},"geometry":{"type":"Point","coordinates":[121.19563043117522,24.968299380796328]}},{"type":"Feature","properties":{"name":"中大圓環","kind":4},"geometry":{"type":"Point","coordinates":[121.19611859321593,24.968275065456755]}},{"type":"Feature","properties":{"name":"復校紀念塔","kind":4},"geometry":{"type":"Point","coordinates":[121.19561970233917,24.967954102524264]}},{"type":"Feature","properties":{"name":"車庫","kind":4},"geometry":{"type":"Point","coordinates":[121.19595766067503,24.970118154573566]}},{"type":"Feature","properties":{"name":"資源回收及垃圾處理場","kind":4},"geometry":{"type":"Point","coordinates":[121.19626879692076,24.969981990622863]}},{"type":"Feature","properties":{"name":"男九舍","kind":2},"geometry":{"type":"Point","coordinates":[121.19580209255219,24.970487741680152]}},{"type":"Feature","properties":{"name":"停車場1","kind":7},"geometry":{"type":"Point","coordinates":[121.1949920654297,24.970059798613164]}},{"type":"Feature","properties":{"name":"國鼎圖書資料館","kind":5},"geometry":{"type":"Point","coordinates":[121.19445025920868,24.970040346620213]}},{"type":"Feature","properties":{"name":"中大會館","kind":4},"geometry":{"type":"Point","coordinates":[121.19490087032317,24.970818423939722]}},{"type":"Feature","properties":{"name":"男十二舍","kind":2},"geometry":{"type":"Point","coordinates":[121.19485795497893,24.97127067912044]}},{"type":"Feature","properties":{"name":"研究生宿舍","kind":2},"geometry":{"type":"Point","coordinates":[121.19421422481535,24.970813560971738]}},{"type":"Feature","properties":{"name":"管理二館","kind":1},"geometry":{"type":"Point","coordinates":[121.19366705417633,24.970764931281515]}},{"type":"Feature","properties":{"name":"志希館","kind":4},"geometry":{"type":"Point","coordinates":[121.19367241859436,24.970195962477735]}},{"type":"Feature","properties":{"name":"綜教館","kind":4},"geometry":{"type":"Point","coordinates":[121.19284093379974,24.970278633322]}},{"type":"Feature","properties":{"name":"語言中心","kind":1},"geometry":{"type":"Point","coordinates":[121.19296967983244,24.97026404435352]}},{"type":"Feature","properties":{"name":"科學二館","kind":1},"geometry":{"type":"Point","coordinates":[121.19226157665253,24.969967401619222]}},{"type":"Feature","properties":{"name":"理學院大樓","kind":1},"geometry":{"type":"Point","coordinates":[121.19239568710327,24.969962538617622]}},{"type":"Feature","properties":{"name":"鴻經館","kind":1},"geometry":{"type":"Point","coordinates":[121.19277119636534,24.970818423939722]}},{"type":"Feature","properties":{"name":"科三館","kind":1},"geometry":{"type":"Point","coordinates":[121.19213283061983,24.97074061642918]}},{"type":"Feature","properties":{"name":"科五館","kind":1},"geometry":{"type":"Point","coordinates":[121.19273900985718,24.97138738986495]}},{"type":"Feature","properties":{"name":"理學院教學館","kind":1},"geometry":{"type":"Point","coordinates":[121.19226694107056,24.97136307513564]}},{"type":"Feature","properties":{"name":"科學四館","kind":1},"geometry":{"type":"Point","coordinates":[121.19190752506256,24.97136307513564]}},{"type":"Feature","properties":{"name":"中大湖","kind":6},"geometry":{"type":"Point","coordinates":[121.19131207466124,24.970891368436153]}},{"type":"Feature","properties":{"name":"客家學院","kind":1},"geometry":{"type":"Point","coordinates":[121.19043767452239,24.970915683258667]}},{"type":"Feature","properties":{"name":"國鼎光電大樓","kind":4},"geometry":{"type":"Point","coordinates":[121.19040548801422,24.970230003420337]}},{"type":"Feature","properties":{"name":"松苑餐廳","kind":10},"geometry":{"type":"Point","coordinates":[121.19067907333373,24.967093334163074]}},{"type":"Feature","properties":{"name":"單四舍","kind":2},"geometry":{"type":"Point","coordinates":[121.19057178497314,24.966752915635567]}},{"type":"Feature","properties":{"name":"松果館","kind":4},"geometry":{"type":"Point","coordinates":[121.1908721923828,24.966752915635567]}},{"type":"Feature","properties":{"name":"單二舍","kind":2},"geometry":{"type":"Point","coordinates":[121.19070053100586,24.96651948524387]}},{"type":"Feature","properties":{"name":"單一舍","kind":2},"geometry":{"type":"Point","coordinates":[121.19091510772704,24.966402769881984]}},{"type":"Feature","properties":{"name":"中大新村三區","kind":8},"geometry":{"type":"Point","coordinates":[121.18975639343263,24.966820999416406]}},{"type":"Feature","properties":{"name":"排球場1","kind":3},"geometry":{"type":"Point","coordinates":[121.19071662425993,24.967574781615614]}},{"type":"Feature","properties":{"name":"排球場2","kind":3},"geometry":{"type":"Point","coordinates":[121.18893027305603,24.9694567854015]}},{"type":"Feature","properties":{"name":"籃球場1","kind":3},"geometry":{"type":"Point","coordinates":[121.19066298007965,24.969578360883656]}},{"type":"Feature","properties":{"name":"籃球場2","kind":3},"geometry":{"type":"Point","coordinates":[121.189107298851,24.96939356610333]}},{"type":"Feature","properties":{"name":"籃球場3","kind":3},"geometry":{"type":"Point","coordinates":[121.18917703628539,24.968673836418752]}},{"type":"Feature","properties":{"name":"依仁堂","kind":3},"geometry":{"type":"Point","coordinates":[121.19076490402222,24.96827992852504]}},{"type":"Feature","properties":{"name":"羽球館","kind":3},"geometry":{"type":"Point","coordinates":[121.19081318378448,24.96911637341245]}},{"type":"Feature","properties":{"name":"溜冰場","kind":3},"geometry":{"type":"Point","coordinates":[121.19099020957945,24.969534593723928]}},{"type":"Feature","properties":{"name":"網球場","kind":3},"geometry":{"type":"Point","coordinates":[121.18989586830139,24.969544319760757]}},{"type":"Feature","properties":{"name":"體育器材室","kind":4},"geometry":{"type":"Point","coordinates":[121.19055032730101,24.96932548374588]}},{"type":"Feature","properties":{"name":"田徑場","kind":3},"geometry":{"type":"Point","coordinates":[121.18991732597352,24.968318833064508]}},{"type":"Feature","properties":{"name":"實習一廠","kind":1},"geometry":{"type":"Point","coordinates":[121.18923068046571,24.96790060862081]}},{"type":"Feature","properties":{"name":"機械系館","kind":1},"geometry":{"type":"Point","coordinates":[121.18862986564636,24.967856840864304]}},{"type":"Feature","properties":{"name":"機電實驗室","kind":1},"geometry":{"type":"Point","coordinates":[121.18810415267946,24.967827662351308]}},{"type":"Feature","properties":{"name":"大型力學實驗室","kind":1},"geometry":{"type":"Point","coordinates":[121.18856012821198,24.968732193036487]}},{"type":"Feature","properties":{"name":"土木品保中心","kind":4},"geometry":{"type":"Point","coordinates":[121.18858158588408,24.969179592853088]}},{"type":"Feature","properties":{"name":"環工所","kind":1},"geometry":{"type":"Point","coordinates":[121.18765890598299,24.968270202388265]}},{"type":"Feature","properties":{"name":"工程五館","kind":1},"geometry":{"type":"Point","coordinates":[121.18741750717165,24.967030113650594]}},{"type":"Feature","properties":{"name":"天線區","kind":4},"geometry":{"type":"Point","coordinates":[121.18589401245117,24.967813073092227]}},{"type":"Feature","properties":{"name":"大氣環境實驗室","kind":4},"geometry":{"type":"Point","coordinates":[121.18564724922182,24.96732190036024]}},{"type":"Feature","properties":{"name":"雷達站","kind":4},"geometry":{"type":"Point","coordinates":[121.18635535240173,24.968158351760003]}},{"type":"Feature","properties":{"name":"停車場2","kind":7},"geometry":{"type":"Point","coordinates":[121.18846893310547,24.967073881701133]}},{"type":"Feature","properties":{"name":"停車場3","kind":7},"geometry":{"type":"Point","coordinates":[121.19021773338318,24.965790012415887]}},{"type":"Feature","properties":{"name":"後門","kind":4},"geometry":{"type":"Point","coordinates":[121.191086769104,24.96561493829374]}},{"type":"Feature","properties":{"name":"中大新村一區","kind":8},"geometry":{"type":"Point","coordinates":[121.19204163551329,24.965726791233834]}},{"type":"Feature","properties":{"name":"校長宿舍","kind":2},"geometry":{"type":"Point","coordinates":[121.19572699069977,24.969344935851854]}},{"type":"Feature","properties":{"name":"太極銅雕","kind":11},"geometry":{"type":"Point","coordinates":[121.19366168975831,24.9693011686091]}},{"type":"Feature","properties":{"name":"教學研究綜合大樓","kind":1},"geometry":{"type":"Point","coordinates":[121.19208991527556,24.968309106930786]}},{"type":"Feature","properties":{"name":"室內游泳池","kind":4},"geometry":{"type":"Point","coordinates":[121.18957936763762,24.970030620622566]}}]};
            L.geoJson(data,{
                onEachFeature:function(feature){
                    var name = feature.properties.name;
                    locationNameToLatlng[name] = [feature.geometry.coordinates[1],feature.geometry.coordinates[0]];
                    selector_area.append("<option value='"+name+"'>"+name+"</option>");
                }
            });
        }
        function initGPSLocator(){

            if(gpsEnable){
                var geoInfo = L.control({position:'bottomright'});
                geoInfo.onAdd = function(){
                    var div = L.DomUtil.create('div','info');
                    div.innerHTML = "<div id='ncumaptag'><div id='ncumapinfo'>準備定位...</div>  <a  id='ncumaplocate'></a></div>";
                    return div;
                };
                geoInfo.addTo(map);

                var mapTag =  $("#ncumaptag");
                var mapContainer = $("#"+container);
                $(window).resize(function(){
                    mapTag.css('width',mapContainer.width()-37);
                });
                mapTag.css('width',mapContainer.width()-37);


                var isFocus = false;
                var isAccurate = false;
                var focusInfo = $('#ncumaplocate');
                focusInfo.on('click',function(){
                    if(isAccurate){
                        if(!isFocus){
                            map.stopLocate();
                            map.locate({watch:true,setView:true,enableHighAccuracy:true});
                            focusInfo.html('(追蹤中)')
                        }else{
                            map.stopLocate();
                            map.locate({watch:true,enableHighAccuracy:true});
                            focusInfo.html('(點擊追蹤)')
                        }
                        isFocus = !isFocus;
                    }
                });

                //-------------------------------------------------------

                var marker;
                var mapInfo = $("#ncumapinfo");
                map.on("locationfound",function(location){
                    if(location.accuracy/2<50){
                        isAccurate = true;
                        if (!marker){
                            marker = L.userMarker(location.latlng).addTo(map);
                        }
                        marker.setLatLng(location.latlng);
                        marker.setAccuracy(location.accuracy);
                        mapInfo.html("定位中");
                        focusInfo.html('(點擊追蹤)');
                        focusInfo.show();
                    }else{
                        isAccurate = false;
                        if(marker){
                            map.removeLayer(marker);
                        }
                        mapInfo.html("精準度不足:"+location.accuracy/2+"m");
                        focusInfo.hide();
                    }
                });
                map.on("locationerror",function(e){
                    mapInfo.html("定位錯誤:"+ e.message);
                });
                map.locate({
                    watch:true,
                    enableHighAccuracy:true
                });
            }
        }
    }
    function setViewToLatlng(target){
        map.setView(target,18,{animate:true});
    }
    function setViewToLocationName(locationName){
        setViewToLatlng(locationNameToLatlng[locationName]);
    }
    function setLayerState(layerId,state){
        var checkbox = $("#"+layerId).find('label.nculayercheckbox');
        var layername = checkbox.closest('div').attr('id');
        if(state){
            map.addLayer(layerIdToRefernce[layername]);
            checkbox.removeClass('fa-circle-o');
            checkbox.addClass('fa-check-circle-o');
            checkbox.attr('data-checked','true');
        }else{
            map.removeLayer(layerIdToRefernce[layername]);
            checkbox.removeClass('fa-check-circle-o');
            checkbox.addClass('fa-circle-o');
            checkbox.attr('data-checked','false');
        }
    }
    function getLayerByID(layerId){
        if(layerId!=""){
            layerCodeInput.attr('disabled', 'disabled');
            $.ajax({
                type:'POST',
                url:"https://appforncu.appspot.com/getmap",
                data:{type:"read",data:layerId},
                dataType:"text",
                success:function(textData){
                    processLayer(textData,layerId);
                    layerCodeInput.removeAttr('disabled');
                    layerCodeInput.val('');
                }
            });
        }
    }
    function processLayer(textData,layerid){
        var result = JSON.parse(textData);
        var r = result.data.data;
        if(result.data.code=="GG"){
            alert("無此圖層");
        }else{
            try{
                layerIdToRefernce[layerid]=processLayerGroup(r);
                map.addLayer(layerIdToRefernce[layerid]);
                layerDivGroup.append(
                    "<div class='input-group' id='"+layerid+"'>" +
                        "<label class='input-group-addon nculayercheckbox fa fa-check-circle-o fa-2x btn btn-default' data-checked='true'>" +
                        "</label>" +
                        "<span  class='form-control' >"+r.name+"</span>" +
                        "<span class='input-group-addon btn btn-default nculayerdelete'>" +
                        "<i class='fa fa-times'></i>" +
                        "</span></div>");
            }catch (e){
                alert("圖層處理錯誤");
            }
        }
    }
    function processLayerGroup(jsonData){
        return L.geoJson(jsonData,{
            pointToLayer: function(feature){
                return parseFeatureToMarker(feature);
            }
        });
    }
    function parseFeatureToMarker(feature){
        var prop = feature.properties;
        var geo = feature.geometry.coordinates;
        var htmlContent = "";
        if(prop["img"])
            htmlContent+="<img src='"+prop["img"]+"'>";
        if(prop["title"]){
            if(prop["link"]){
                htmlContent+="<a href='"+prop["link"]+"'>"+prop["title"]+"</a>";
            }else{
                htmlContent+=prop["title"];
            }
        }
        htmlContent+="  <span>人氣度"+prop.number+"</span>";
        return L.marker(L.latLng(geo[1],geo[0]),{
            icon: L.AwesomeMarkers.icon(prop.icon)
        }).bindPopup(htmlContent);
    }

    thisPtr.prototype.addCustomLayerByIDs=function(ids){
        for(var i=0;i<ids.length;i++){
            getLayerByID(ids[i]);
        }
    };
    thisPtr.prototype.setViewToName=function(name){
        setViewToLocationName(name);
    };
    thisPtr.prototype.setViewToLatlng=function(lat,lng){
        setViewToLatlng([lat,lng]);
    };
    thisPtr.prototype.setCurrentLayerToIDs=function(ids){
        var list_needfetch  = {};
        var list_notDisable = {};
        var i,indexer;
        for(i=0;i<ids.length;i++){
            if(!layerIdToRefernce[ids[i]]){
                list_needfetch[ids[i]]=true;
            }else{
                list_notDisable[ids[i]]=true;
            }
        }
        for(indexer in layerIdToRefernce){
            if(layerIdToRefernce.hasOwnProperty(indexer)&&!list_notDisable[layerIdToRefernce[indexer]]){
                setLayerState(layerIdToRefernce[indexer],false);
            }
        }
        for(indexer in list_needfetch){
            if(list_needfetch.hasOwnProperty(indexer)){
                getLayerByID(indexer);
            }
        }
    };
    thisPtr.prototype.getLeafletMap=function(){
            return map;
        };
    thisPtr.prototype.getStyleParser=function(){
            return{
                parseFeatureToMarker:function(feature){
                    return parseFeatureToMarker(feature);
                }
            }
        };
};

