
NCUMap.MarkerEditor = function(init){
    var map = init["map"];
    var leafletMap = map.getLeafletMap();
    // Initialise the FeatureGroup to store editable layers
    var drawnItems = new L.FeatureGroup();
    leafletMap.addLayer(drawnItems);

    // Initialise the draw control and pass it the FeatureGroup of editable layers
    var drawControl = new L.Control.Draw({
        draw: {
            polygon: false,
            polyline: false,
            rectangle: false,
            circle: false
        },
        edit: {
            featureGroup: drawnItems,
            edit: false
        }
    });
    leafletMap.addControl(drawControl);

    var markerGroupGeoJSON = {name:"customLayer",type:"FeatureCollection",features:[]};
    leafletMap
    .on('draw:created', function (e) {
        var type = e.layerType,
        layer = e.layer;

        if (type === 'marker') {
            // Do marker specific actions
            var modal = "<!-- Modal -->" +
                "<div class='modal fade' id='markerInfoModal' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'> " +
                "<div class='modal-dialog'> " +
                "<div class='modal-content'> " +

                    "<div class='modal-header'>" +
                        "<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button> " +
                        "<h4 class='modal-title' id='myModalLabel'>Marker Informations</h4> " +
                    "</div> " +

                    "<div class='modal-body'> " +
                        "<div class='form-group'><label>Marker Title:</label> <input type='text' id='markerInfoTitle' class='form-control' ></div> " +
                        "<div class='form-group'><label>Marker Image:</label> <input type='text' id='markerInfoImg' class='form-control'></div> " +
                        "<div class='form-group'><label> Marker Url:</label> <input type='text' id='markerInfoLink' class='form-control'></div> " +
                        "<div class='form-group'><label>Marker Color:</label> <select id='markerInfoMarkerColor' class='form-control'><option>red</option><option>darkred</option><option>orange</option><option>green</option><option>darkgreen</option><option>blue</option><option>purple</option><option>darkpurple</option><option>cadetblue</option></select></div> " +
                        "<div class='form-group'><label>Marker Icon: <a href='http://fortawesome.github.io/Font-Awesome/icons/' target='_blank'>FontAwesome</a></label> <input type='text' id='markerInfoIcon' class='form-control' value='fa-home'> </div> " +
                        "<div class='form-group'><label>Marker Icon Color:</label> <input type='text' id='markerInfoIconColor' class='form-control' value='#fff'> </div> " +
                    "</div> " +
                    "<div class='modal-footer'> <button id='markerInfoModalSaveBtn' type='button' class='btn btn-primary'>Save changes</button> </div>" +

                "</div> </div></div>";
            $('body').append(modal);
            $('#markerInfoModalSaveBtn').click(function(){
                var markerTitle = $('#markerInfoTitle').val();
                var markerImage = $('#markerInfoImg').val();
                var markerLink = $('#markerInfoLink').val();
                var markerColor = $('#markerInfoMarkerColor').val();
                var iconName = $('#markerInfoIcon').val();
                var iconColor = $('#markerInfoIconColor').val();
                var markerGeoJSON = layer.toGeoJSON();
                markerGeoJSON.properties.title = markerTitle;
                markerGeoJSON.properties.img = markerImage;
                markerGeoJSON.properties.link = markerLink;
                markerGeoJSON.properties.number = 0;
                markerGeoJSON.properties.icon = {};
                markerGeoJSON.properties.icon.icon = iconName;
                markerGeoJSON.properties.icon.iconColor = iconColor;
                markerGeoJSON.properties.icon.prefix = 'fa';
                markerGeoJSON.properties.icon.markerColor = markerColor;
                // console.log(markerGeoJSON);
                markerGroupGeoJSON.features.push(markerGeoJSON);
                var styler = map.getStyleParser();
                var customMarker = styler.parseFeatureToMarker(markerGeoJSON);
                drawnItems.addLayer(customMarker);
                $('#markerInfoModal').modal('hide');
                $('#markersEditorSaveBtn').attr('disabled',false);
            });
            $('#markerInfoModal').on('hidden.bs.modal', function (e) {
                $('#markerInfoModal').remove();
            });
            $('#markerInfoModal').modal();
        }
    })
    .on('draw:deleted',function(e){
        var deletedLayersGroup = e.layers;
        // console.log(deletedLayersGroup);
        deletedLayersGroup.eachLayer(function (deletedLayer) {
            var geometry = {};
            geometry[0] = deletedLayer.getLatLng().lng;
            geometry[1] = deletedLayer.getLatLng().lat;

            var deletedLayerGeoJSONIndex = getLayerIndex(markerGroupGeoJSON.features, geometry);
            markerGroupGeoJSON.features.splice(deletedLayerGeoJSONIndex,1);
            // console.log(geometry);
        });
        if(markerGroupGeoJSON.features.length==0)
            $('#markersEditorSaveBtn').attr('disabled',true);
    });
    // .on('draw:edited', function (e) {
    //     var editedLayers = e.layers;
    //     editedLayers.eachLayer(function (editedLayer) {
    //         var geometry = {};
    //         geometry[0] = editedLayer.getLatLng().lng;
    //         geometry[1] = editedLayer.getLatLng().lat;
    //         var editedLayerGeoJSONIndex = getLayerIndex(markerGroupGeoJSON.features, geometry);
    //         markerGroupGeoJSON.features[editedLayerGeoJSONIndex].geometry.coordinates = [geometry[0],geometry[1]];
    //     });
    // });

    //==============================================
    var layerControler = L.control({position:'topleft'});
    layerControler.onAdd = function(){
        var div = L.DomUtil.create('div');
        div.innerHTML = " <div id='markersEditorSaveBtn' class='info btn btn-default btn-sm'> " +
        "<i class='fa fa-check-circle fa-1x'></i>" +
        "</div>";
        return div;
    };

    layerControler.addTo(leafletMap);
    $('#markersEditorSaveBtn').attr('disabled',true);
    $('#markersEditorSaveBtn').click(function(){
        // console.log(markerGroupGeoJSON);
        // console.log(JSON.stringify(markerGroupGeoJSON));

        var layerInfoModal = "<div class='modal fade' id='markerLayerNameModal' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'> <div class='modal-dialog'> <div class='modal-content'> <div class='modal-header'> <button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button> <h4 class='modal-title' id='myModalLabel'>Marker Layer Informations</h4> </div> <div class='modal-body'> <div class='form-group'> <label>Layer Name:</label><input type='text' id='markerInfoLayerName' class='form-control'> </div> </div> <div class='modal-footer'> <button id='markerLayerNameModalSaveBtn' type='button' class='btn btn-primary'>Save changes</button> </div> </div> </div> </div>";
        $('body').append(layerInfoModal);
        $('#markerLayerNameModalSaveBtn').click(function(){
            var layerName = $('#markerInfoLayerName').val();
            markerGroupGeoJSON.name = layerName;
            // console.log(markerGroupGeoJSON);

            $('#markersEditorSaveBtn').attr('disabled',true);
            $('#markerLayerNameModal').modal('hide');
            $.post("https://appforncu.appspot.com/getmap",{type:"create",data:JSON.stringify(markerGroupGeoJSON)},
                function(data){
//                    console.log(data);
                    data = JSON.parse(data);
                    var showResultModal = "<div class='modal fade' id='markerLayerCodeModal' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'> <div class='modal-dialog'> <div class='modal-content'> <div class='modal-header'> <button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button> <h4 class='modal-title' id='myModalLabel'>Marker Layer Informations</h4> </div> <div class='modal-body'> <div class='form-group'> <label>Layer Code:</label><input type='text' disabled='disabled' class='form-control' value='"+data.data.data+"'> </div> </div> <div class='modal-footer'> </div> </div> </div> </div>";
                    $('body').append(showResultModal);
                    var mod =  $('#markerLayerCodeModal');
                    mod.on('hidden.bs.modal', function (e) {
                        $('#markerLayerCodeModal').remove();
                    });
                    mod.modal();

                },"text");
            markerGroupGeoJSON = {name:"customLayer",type:"FeatureCollection",features:[]};
        });
        $('#markerLayerNameModal').on('hidden.bs.modal', function (e) {
            $('#markerLayerNameModal').remove();
        });
        $('#markerLayerNameModal').modal();
    });

    function getLayerIndex(targetGeoJSONFeatures, geometry) {
        for (var i=0;i<targetGeoJSONFeatures.length;i++) {
            if (typeof targetGeoJSONFeatures[i] == 'object') {
                var coordinates = targetGeoJSONFeatures[i].geometry.coordinates;
                if(coordinates[0]==geometry[0]&&coordinates[1]==geometry[1]){
                    return i;
                }
            }
        }
        return null;
    }
};