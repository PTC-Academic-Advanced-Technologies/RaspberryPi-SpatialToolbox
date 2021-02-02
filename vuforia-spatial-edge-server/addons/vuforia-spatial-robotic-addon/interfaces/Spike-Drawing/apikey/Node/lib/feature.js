var onshape = require('./app.js')

info = {
    "feature": {
        "type" : 151,
        "typeName" : "BTMSketch",
        "message" : {
        "entities" : [ {
            "type" : 155,
            "typeName" : "BTMSketchCurveSegment",
            "message" : {
            "startPointId" : "Tsloc88BpTkS.start",
            "endPointId" : "Tsloc88BpTkS.end",
            "startParam" : 0.0,
            "endParam" : 1.0,
            "geometry" : {
                "type" : 116,
                "typeName" : "BTCurveGeometryInterpolatedSpline",
                "message" : {
                "interpolationPoints" : [-0.009858964942395687, 0.0343238040804863, -0.023734545335173607, 0.01217156182974577, -0.015457883477210999, -0.003651468316093087, 0.012293277308344841, 0.006816074252128601 ],
                "isPeriodic" : "false",
                "startDerivativeX" : 0.001,
                "startDerivativeY" : 0.001,
                "endDerivativeX" : 0.001,
                "endDerivativeY" : 0.001,
                "startHandleX" : 0.001,
                "startHandleY" : 0.001,
                "endHandleX" : 0.001,
                "endHandleY" : 0.001
                }
            },
            "centerId" : "",
            "internalIds" : [ "Tsloc88BpTkS.0.internal", "Tsloc88BpTkS.1.internal", "Tsloc88BpTkS.2.internal", "Tsloc88BpTkS.3.internal", "Tsloc88BpTkS.4.internal", "Tsloc88BpTkS.startHandle", "Tsloc88BpTkS.endHandle" ],
            "isConstruction" : "false",
            "parameters" : [ {
                "type" : 144,
                "typeName" : "BTMParameterBoolean",
                "message" : {
                "value" : "false",
                "parameterId" : "geometryIsPeriodic",
                "hasUserCode" : "false",
                "nodeId" : "MmIKfr3rZrueiIwh/"
                }
            }, {
                "type" : 144,
                "typeName" : "BTMParameterBoolean",
                "message" : {
                "value" : "true",
                "parameterId" : ".hasHandlesInSketch",
                "hasUserCode" : "false",
                "nodeId" : "M0xhRgmIWlxPUg7jB"
                }
            }, {
                "type" : 147,
                "typeName" : "BTMParameterQuantity",
                "message" : {
                "units" : "",
                "value" : 0.0,
                "expression" : "0.0",
                "isInteger" : "false",
                "parameterId" : "splinePointParamCount",
                "hasUserCode" : "false",
                "nodeId" : "MEIcFtEwEx1NTUK8D"
                }
            }, {
                "type" : 147,
                "typeName" : "BTMParameterQuantity",
                "message" : {
                "units" : "",
                "value" : 0.0,
                "expression" : "5.0",
                "isInteger" : "false",
                "parameterId" : "splinePointCount",
                "hasUserCode" : "false",
                "nodeId" : "MdAQqZOk0QxFPeQfG"
                }
            } ],
            "isFromSplineHandle" : "false",
            "entityId" : "Tsloc88BpTkS",
            "namespace" : "",
            "hasUserCode" : "false",
            "nodeId" : "MCXPY055U7FXSH3Fu"
            }
        } ],
        "constraints" : [ {
            "type" : 2,
            "typeName" : "BTMSketchConstraint",
            "message" : {
            "constraintType" : "COINCIDENT",
            "parameters" : [ {
                "type" : 149,
                "typeName" : "BTMParameterString",
                "message" : {
                "value" : "Tsloc88BpTkS.start",
                "parameterId" : "localFirst",
                "hasUserCode" : "false",
                "nodeId" : "MOcZBfQfw1uF6Ysd/"
                }
            }, {
                "type" : 149,
                "typeName" : "BTMParameterString",
                "message" : {
                "value" : "Tsloc88BpTkS.0.internal",
                "parameterId" : "localSecond",
                "hasUserCode" : "false",
                "nodeId" : "MNaWCDLocpqxfN8oY"
                }
            } ],
            "helpParameters" : [ ],
            "hasOffsetData1" : "false",
            "offsetOrientation1" : "false",
            "offsetDistance1" : 0.0,
            "hasOffsetData2" : "false",
            "offsetOrientation2" : "false",
            "offsetDistance2" : 0.0,
            "hasPierceParameter" : "false",
            "pierceParameter" : 0.0,
            "entityId" : "Tsloc88BpTkS.startSnap",
            "namespace" : "",
            "hasUserCode" : "false",
            "nodeId" : "M46fY4SjkbhobCJMF"
            }
        }, {
            "type" : 2,
            "typeName" : "BTMSketchConstraint",
            "message" : {
            "constraintType" : "COINCIDENT",
            "parameters" : [ {
                "type" : 149,
                "typeName" : "BTMParameterString",
                "message" : {
                "value" : "Tsloc88BpTkS.end",
                "parameterId" : "localFirst",
                "hasUserCode" : "false",
                "nodeId" : "MXzeD9THVmgWoXMK2"
                }
            }, {
                "type" : 149,
                "typeName" : "BTMParameterString",
                "message" : {
                "value" : "Tsloc88BpTkS.4.internal",
                "parameterId" : "localSecond",
                "hasUserCode" : "false",
                "nodeId" : "M1AKV+t97fpy7wiMl"
                }
            } ],
            "helpParameters" : [ ],
            "hasOffsetData1" : "false",
            "offsetOrientation1" : "false",
            "offsetDistance1" : 0.0,
            "hasOffsetData2" : "false",
            "offsetOrientation2" : "false",
            "offsetDistance2" : 0.0,
            "hasPierceParameter" : "false",
            "pierceParameter" : 0.0,
            "entityId" : "Tsloc88BpTkS.endSnap",
            "namespace" : "",
            "hasUserCode" : "false",
            "nodeId" : "Me/WWyCP0mZk73/+2"
            }
        } ],
        "featureType" : "newSketch",
        "featureId" : "FXkaWonTbreiMKs_1",
        "name" : "Sketch 2",
        "parameters" : [ {
            "type" : 148,
            "typeName" : "BTMParameterQueryList",
            "message" : {
            "queries" : [ {
                "type" : 138,
                "typeName" : "BTMIndividualQuery",
                "message" : {
                "geometryIds" : [ "JDC" ],
                "hasUserCode" : "false",
                "nodeId" : "Fmd7c1BMfHRvs64"
                }
            } ],
            "parameterId" : "sketchPlane",
            "hasUserCode" : "false",
            "nodeId" : "hnoo42iYtOUBOpnv"
            }
        } ],
        "suppressed" : "false",
        "namespace" : "",
        "subFeatures" : [ ],
        "returnAfterSubfeatures" : "false",
        "suppressionState" : {
            "type" : 0
        },
        "hasUserCode" : "false",
        "nodeId" : "fSZlkDu/KOhauF7X"
        }
    },
    "serializationVersion": "1.1.20",
    "sourceMicroversion": "096a738d2762e82756adabd7",
    "rejectMicroversionSkew": "false"
}

var makeSpline = function(did, wid, eid, name, points, deletePrevious = false, startXDeriv = 0.001, startYDeriv = 0.001, endXDeriv = 0.001, endYDeriv = 0.001) {
    var nameExists = false;
    onshape.getFeatureList(did, wid, eid, function(rawInfo) {
        rawInfo = JSON.parse(rawInfo)
        for (var i = 0; i < rawInfo["features"].length; i++) {
            if (rawInfo["features"][i]["message"]["name"] == name) {
                nameExists = true;
                break
            }
        }
        if (deletePrevious && nameExists) {
            updateInfo = {'feature': rawInfo["features"][i],
                          'serializationVersion': rawInfo["serializationVersion"],
                          'sourceMicroversion': rawInfo["sourceMicroversion"]}
            splineString = updateInfo["feature"]["message"]["entities"][0]["message"]["internalIds"][0].substring(0,13)
            updateInfo["feature"]["message"]["entities"][0]["message"]["parameters"][3]["message"]["expression"] = ((points.length)/2).toString()
            updateInfo["feature"]["message"]["constraints"][1]["message"]["parameters"][1]["message"]["value"] = splineString + (parseInt((points.length)/2) - 1).toString() + ".internal"
            updateInfo["feature"]["message"]["entities"][0]["message"]["geometry"]["message"]["interpolationPoints"] = points
            updateInfo["feature"]["message"]["entities"][0]["message"]["internalIds"] = new Array(Math.round((points.length)/2)).fill(0)
            for (var i = 0; i < parseInt(points.length/2); i++) {
                updateInfo["feature"]["message"]["entities"][0]["message"]["internalIds"][i] = splineString + i.toString() + ".internal"
            }
            updateInfo["feature"]["message"]["entities"][0]["message"]["internalIds"][i] = splineString + "startHandle"
            updateInfo["feature"]["message"]["entities"][0]["message"]["internalIds"][i+1] = splineString + "endHandle"
            onshape.updateFeature(did, wid, eid, updateInfo["feature"], updateInfo["serializationVersion"], updateInfo["sourceMicroversion"], function(data){
                //console.log(data)
            })
        }
        else {
            info["sourceMicroversion"] = rawInfo["sourceMicroversion"]
            info["feature"]["message"]["name"] = name
            info["feature"]["message"]["entities"][0]["message"]["parameters"][3]["message"]["expression"] = ((points.length)/2).toString()
            info["feature"]["message"]["constraints"][1]["message"]["parameters"][1]["message"]["value"] = "Tsloc88BpTkS.".concat((parseInt((points.length)/2) - 1).toString(), ".internal")
            info["feature"]["message"]["entities"][0]["message"]["geometry"]["message"]["interpolationPoints"] = points
            info["feature"]["message"]["entities"][0]["message"]["internalIds"] = new Array(Math.round((points.length)/2)).fill(0)
            for (var i = 0; i < parseInt(points.length/2); i++) {
                info["feature"]["message"]["entities"][0]["message"]["internalIds"][i] = "Tsloc88BpTkS.".concat(i.toString(), ".internal")
            }
            info["feature"]["message"]["entities"][0]["message"]["internalIds"][i] = "Tsloc88BpTkS.startHandle"
            info["feature"]["message"]["entities"][0]["message"]["internalIds"][i+1] = "Tsloc88BpTkS.endHandle"
            info["feature"]["message"]["entities"][0]["message"]["geometry"]["message"]["startDerivativeX"] = startXDeriv
            info["feature"]["message"]["entities"][0]["message"]["geometry"]["message"]["startDerivativeY"] = startYDeriv
            info["feature"]["message"]["entities"][0]["message"]["geometry"]["message"]["endDerivativeX"] = endXDeriv
            info["feature"]["message"]["entities"][0]["message"]["geometry"]["message"]["endDerivativeY"] = endYDeriv
            onshape.addFeature(did, wid, eid, info["feature"], info["serializationVersion"], info["sourceMicroversion"], function(data){
                //console.log(data)
            })
        }
    })
}

module.exports = {
    makeSpline: makeSpline
}