var util = require('./lib/util.js');
var errors = require('./config/errors.js');
var pathModule = require('path');

var minimist = require('minimist');
var app = null;

did = 'did';
wid = 'wid';
eid = 'eid';

app = require('./lib/app.js');

var getConfigTest = function (documentId, workspaceId, elementId) {
    app.getConfig(documentId, workspaceId, elementId, function(data) {
        var configData = JSON.parse(data.toString());
        //console.log(configData);
        var configParams = configData["configurationParameters"]
        for (var i = 0; i < configParams.length; i++) {
            var configMsg = configParams[i]["message"]["rangeAndDefault"];
            var configId = configParams[i]["message"]["parameterId"];
            try {
                let minVal = configMsg["message"]["minValue"];
                let maxVal = configMsg["message"]["maxValue"];
                let defaultVal = configMsg["message"]["defaultValue"];
                console.log("Configuration: " + configId);
                console.log("\tDefault value: " + defaultVal);
                console.log("\tMax value: " + maxVal);
                console.log("\tMin value: " + minVal + "\r\n");
            }
            catch {
                console.log(configId + " does not have values\r\n");
            }
        }
    })
}

var postConfigTest = function (documentId, workspaceId, elementId, toChange, values) {
    app.postConfig(documentId, workspaceId, elementId, toChange, values, function(data) {
        //console.log(data);
    })
}

toChange = []; //Names of configurations to change
values = []; //Values to update for each configuration

postConfigTest(did, wid, eid, toChange, values);

setTimeout(() => { getConfigTest(did, wid, eid) }, 1000);