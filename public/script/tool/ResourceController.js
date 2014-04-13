var JResource = {};
JResource.ResourceController = function(initiator){
    var thisPtr = JResource.ResourceController;
    var resourceGetter;
    var resourceBank={};

    initOptions(initiator);

    function initOptions(initiator){
        if(initiator.hasOwnProperty("resourceGetter")){
            resourceGetter = initiator["resourceGetter"];
        }else{
            throw "No resourceGetter specified";
        }
    }
    function hasResourceInBank(resourceName){
        return getResourceInBank(resourceName);
    }
    function getResourceInBank(resourceName){
        return resourceBank[resourceName];
    }
    function setResourceInBank(resourceName,resource){
        resourceBank[resourceName] = resource;
    }
    function getResourceLocalAsyn(resourceName,processFunc){
        processFunc(getResourceInBank(resourceName));
    }
    function getResourceRemoteAsyn(resourceName,processFunc){
        resourceGetter(resourceName,function(resource){
            setResourceInBank(resourceName,resource);
            processFunc(resource);
        });
    }

    thisPtr.prototype.getResourceByName = function(resourceName,processFunc){
        if(hasResourceInBank(resourceName)){
            getResourceLocalAsyn(resourceName,processFunc);
        }else{
            getResourceRemoteAsyn(resourceName,processFunc);
        }
    }
};