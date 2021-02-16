var feature = require('./lib/feature.js')
var app = require('./lib/app.js')

var onshapePoints = [];
var name = 'VST Drawing';
var did = 'ee61e6f250d2c324d8ef264b';
var wid = '3105b4bf84e8ea3fdd5074a1';
var eid = 'f06c4bc382926e56e6534f92';

var setParams = function(documentId, workspaceId, elementId, featureName) {
    did = documentId;
    wid = workspaceId;
    eid = elementId;
    name = featureName;
    console.log("Params set")
}

var addPoints = function(points, cb) {
    onshapePoints = onshapePoints.concat(points)
    feature.makeSpline(did, wid, eid, name, onshapePoints, deletePrevious = true);
    cb(true)
}

var deleteSpline = function(cb) {
    let fid = 'empty'
    app.getFeatureList(did, wid, eid, function(data){
        rawInfo = JSON.parse(data)
        for (var i = 0; i < rawInfo["features"].length; i++) {
            if (rawInfo["features"][i]["message"]["name"] == name) {
                fid = rawInfo["features"][i]["message"]["featureId"]
                break
            }
        }
        if (fid != 'empty') {
            app.deleteFeature(did, wid, eid, fid, function(data){

            })
        }
    })
    onshapePoints = [];
    cb(true)
}

module.exports = {
    setParams: setParams,
    addPoints: addPoints,
    deleteSpline: deleteSpline
}