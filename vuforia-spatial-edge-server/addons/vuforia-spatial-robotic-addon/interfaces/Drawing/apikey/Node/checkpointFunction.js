// Imports
var app = require('./lib/app.js');
var transform = require('./lib/transform.js');

// Onshape UR3e did, wid, eid, mvid
var did = '677f3190f5afd3a61d3d4bdc';
var wid = '21e16f48bee8b1c1619babde';
var eid = '2dbe213f738ce89776dd4b44';
var mvid = "53b6c54f2f4083c89a9ba84c";

// Checkpoints eids
var eids = ["9a73e29d18847b0d191e2473", "1650030cb5b9d5fe834e26d5", "6754f30478e051d13de1dd5d", 
        "6d69d8168ac8387a85204594", "921cc76201fe024a893b7a2a", "57d3e395816d4cde0db6cdfb",
        "95122ee01a28697a130441b5", "5107104240eb3567a7953b0e", "bd4b2e62005e7e3fbf651955",
        "2cb96173025ee3f4ee574c7b"];

// Function that makes a checkpoint and then moves it to toolboxPos
var makeCheckpoint = function(toolboxPos, cb) {
    let args = toolboxPos.concat([-1, 0, 0, 90]);

    sortCheckpoints(function(checkpoints){
        app.createAssemblyInstance(did, wid, eid, did, eids[checkpoints.length], mvid, function(data){
            sortCheckpoints(function(checkpoints){
                transform.getTranslationMatrix(args, false, function(M){
                    app.transformOccurrence(did, wid, eid, M, false, [checkpoints[checkpoints.length-1]["id"]], function(data){
                        console.log(data);
                        cb(data);
                    })
                })
            })
        })
    })
}

// Function that updates the checkpoint number by sending it to position toolboxPos
var updateCheckpoint = function(number, toolboxPos, cb) {
    let args = toolboxPos.concat([-1, 0, 0, 90]);

    sortCheckpoints(function(checkpoints){
        transform.getTranslationMatrix(args, false, function(M){
            app.transformOccurrence(did, wid, eid, M, false, [checkpoints[number]["id"]], function(data){
                console.log(data);
                cb(data);
            })
        })
    })
}

// Function that deletes the checkpoint number
var deleteCheckpoint = function(number, cb) {
    sortCheckpoints(function(checkpoints){
        console.log(checkpoints)
        console.log(number)
        app.deleteAssemblyInstance(did, wid, eid, checkpoints[number]["id"], function(data){
            console.log(data);
            cb(data);
        })
    })
}

// Function that sorts the checkpoints numerically
function sortCheckpoints(cb){
    var checkpoints = [];
    let sorted_checkpoints = [];
    app.assemblyDefinition(did, 'w', wid, eid, function(data){
        let assembly = JSON.parse(data)
        for(var i = 0; i < assembly["rootAssembly"]["instances"].length; i++){
            if (assembly["rootAssembly"]["instances"][i]["name"].includes("Checkpoint")){
                checkpoints.push(assembly["rootAssembly"]["instances"][i]);
            }
        }
        for(var i = 0; i < checkpoints.length; i++){
            for(var j = 0; j < checkpoints.length; j++){
                if(checkpoints[j]['name'].includes("Checkpoint " + (i+1).toString() + " <")){
                    sorted_checkpoints.push(checkpoints[j]);
                }
            }
        }
        cb(sorted_checkpoints);
    })    
}

// Exported functions
module.exports = {
    makeCheckpoint: makeCheckpoint,
    updateCheckpoint: updateCheckpoint,
    deleteCheckpoint: deleteCheckpoint
}