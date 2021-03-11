//Carter Silvey

var server = require('@libraries/hardwareInterfaces');
var draw = require('./apikey/Node/drawing.js')
var settings = server.loadHardwareInterface(__dirname);

var TOOL_NAME = "kineticAR"; // This is what is made on the webserver for the image target
let objectName = "draw"; // This is the name of the folder in spatialToolbox in Documents 

exports.enabled = settings('enabled');
exports.configurable = true;

let inMotion = false;                   // When robot is moving
let pathData = [];                      // List of paths with checkpoints
let activeCheckpointName = null;        // Current active checkpoint
var onshapeX, onshapeY;

if (exports.enabled){
    // Code executed when your robotic addon is enabled
    setup();
    console.log('draw: Settings loaded: ', objectName)
    console.log("Draw is connected");

    // Sets up the settings that can be customized on localhost:8080
    function setup() {
        exports.settings = {
            // Name for the object
            drawName: { // CHANGED HERE --> Name is changed here 
                value: settings('objectName', objectName),
                type: 'text',
                default: objectName,
                disabled: true,
                helpText: 'The name of the object that connects to this hardware interface.'
            },
	        // Onshape Url link to be parsed 
            drawOnshapeURL: {
                value: settings('drawOnshapeURL', "cad.onshape.com/documents/did/w/wid/e/eid"),
                type: 'text',
                default: 'cad.onshape.com/documents/did/w/wid/e/eid',
                disabled: false,
                helpText: 'Enter the link to your Onshape Document where you will be drawing.'
            },
            // Feature Name
            drawFeatureName: {
                value: settings('drawFeatureName', 'VST Drawing'),
                type: 'text',
                default: 'VST Drawing',
                disabled: false,
                helpText: 'The name of the Onshape feature that will be created.'
            },
            // Onshape origin offset in X
            drawOnshapeOffsetX: {
                value: settings('drawOnshapeOffsetX', 0),
                type: 'number',
                default: 0,
                disabled: false,
                helpText: 'The horizontal offset from the Onshape origin where you want to being drawing.'
            },
            // Onshape origin offset in Y
            drawOnshapeOffsetY: {
                value: settings('drawOnshapeOffsetY', 0),
                type: 'number',
                default: 0,
                disabled: false,
                helpText: 'The vertical offset from the Onshape origin where you want to being drawing.'
            }
        };
    }

    // Get the settings that the user defined on localhost:8080
    objectName = exports.settings.drawName.value;
    console.log("draw: " + objectName)
    featureName = exports.settings.drawFeatureName.value;
    offsetX = exports.settings.drawOnshapeOffsetX.value;
    offsetY = exports.settings.drawOnshapeOffsetY.value;
    // Get the entire URL link
    onshapeUrl = exports.settings.drawOnshapeURL.value;
    onshapeUrl_object = onshapeUrl.split('/');
    documentId = onshapeUrl_object[4]; 
    workspaceId = onshapeUrl_object[6]; 
    elementId = onshapeUrl_object[8]; 
    // https://cad.onshape.com/documents/688d52d4b40fa464e65b9335/w/9399f9d1b4a559d90a2ac87a/e/c9a50713ea054cf8b1803b2c

    if (documentId != 'did' && workspaceId != 'wid' && elementId != 'eid') {
        draw.setParams(documentId, workspaceId, elementId, featureName);
    }

    server.addEventListener('reset', function () {
        settings = server.loadHardwareInterface(__dirname);
        setup();

        console.log('draw: Settings loaded: ', objectName);
    });
}

function startHardwareInterface() {
    console.log('draw: Starting up')

    server.enableDeveloperUI(true)

    console.log('draw: Setting default tool to drawing');
    server.setTool('draw', 'kineticAR', 'drawing', __dirname);
    server.removeAllNodes('draw', 'kineticAR');

    server.addNode(objectName, TOOL_NAME, "kineticNode1", "storeData");     // Node for checkpoint stop feedback
    server.addNode(objectName, TOOL_NAME, "kineticNode2", "storeData");     // Node for the data path. Follow Checkpoints
    server.addNode(objectName, TOOL_NAME, "kineticNode4", "storeData");     // Node for cleaning the path

    server.addPublicDataListener(objectName, TOOL_NAME, "kineticNode4","ClearPath",function (data) {

        console.log("draw:    -   -   -   Frame has requested to clear path: ", data);

        pathData.forEach(path => {
            path.checkpoints.forEach(checkpoint => {
                server.removeNode(objectName, TOOL_NAME, checkpoint.name);
            });
            path.checkpoints = [];
        });
        pathData = [];

        draw.deleteSpline(function(data){
            console.log(data)
        })

        server.pushUpdatesToDevices(objectName);

        inMotion = false;
        activeCheckpointName = null;

    });

    server.addPublicDataListener(objectName, TOOL_NAME, "kineticNode2","pathData",function (data){
        data.forEach(framePath => {             // We go through array of paths

            let pathExists = false;

            pathData.forEach(serverPath => {

                if (serverPath.index === framePath.index){   // If this path exists on the server, proceed to update checkpoints
                    pathExists = true;
                    
                    framePath.checkpoints.forEach(frameCheckpoint => {              // Foreach checkpoint received from the frame

                        let exists = false;
                        
                        serverPath.checkpoints.forEach(serverCheckpoint => {        // Check against each checkpoint stored on the server

                            if (serverCheckpoint.name === frameCheckpoint.name){    // Same checkpoint. Check if position has changed and update
                                
                                exists = true;

                                if (serverCheckpoint.posX !== frameCheckpoint.posX) serverCheckpoint.posX = frameCheckpoint.posX;
                                if (serverCheckpoint.posY !== frameCheckpoint.posY) serverCheckpoint.posY = frameCheckpoint.posY;
                                if (serverCheckpoint.posZ !== frameCheckpoint.posZ) serverCheckpoint.posZ = frameCheckpoint.posZ;
                                if (serverCheckpoint.posXUR !== frameCheckpoint.posXUR) serverCheckpoint.posXUR = frameCheckpoint.posXUR;
                                if (serverCheckpoint.posYUR !== frameCheckpoint.posYUR) serverCheckpoint.posYUR = frameCheckpoint.posYUR;
                                if (serverCheckpoint.posZUR !== frameCheckpoint.posZUR) serverCheckpoint.posZUR = frameCheckpoint.posZUR;
                                if (serverCheckpoint.orientation !== frameCheckpoint.orientation) serverCheckpoint.orientation = frameCheckpoint.orientation;

                                // <node>, <frame>, <Node>, x, y, scale, matrix
                                server.moveNode(objectName, TOOL_NAME, frameCheckpoint.name, frameCheckpoint.posX, frameCheckpoint.posZ, 0.3,[
                                    1, 0, 0, 0,
                                    0, 1, 0, 0,
                                    0, 0, 1, 0,
                                    0, 0, frameCheckpoint.posY * 3, 1
                                ], true);
                                server.pushUpdatesToDevices(objectName);
                            }
                        });

                        // If the checkpoint is not in the server, add it and add the node listener.
                        if (!exists){
                            serverPath.checkpoints.push(frameCheckpoint);

                            server.addNode(objectName, TOOL_NAME, frameCheckpoint.name, "node");

                            console.log('draw: NEW ' + frameCheckpoint.name + ' | position: ', frameCheckpoint.posX, frameCheckpoint.posY, frameCheckpoint.posZ);

                            // <node>, <frame>, <Node>, x, y, scale, matrix
                            server.moveNode(objectName, TOOL_NAME, frameCheckpoint.name, frameCheckpoint.posX, frameCheckpoint.posZ, 0.3,[
                                1, 0, 0, 0,
                                0, 1, 0, 0,
                                0, 0, 1, 0,
                                0, 0, frameCheckpoint.posY * 3, 1
                            ], true);

                            server.pushUpdatesToDevices(objectName);

                            console.log('draw: ************** Add read listener to ', frameCheckpoint.name);

                            // Add listener to node
                            server.addReadListener(objectName, TOOL_NAME, frameCheckpoint.name, function(data){

                                let indexValues = frameCheckpoint.name.split("_")[1];
                                let pathIdx = parseInt(indexValues.split(":")[0]);
                                let checkpointIdx = parseInt(indexValues.split(":")[1]);
                                nodeReadCallback(data, checkpointIdx, pathIdx);

                            });

                            //console.log(frameCheckpoint.posX/1000 + "," + frameCheckpoint.posY/1000 + "," + frameCheckpoint.posZ/1000)

                            onshapeX = offsetX + frameCheckpoint.posXUR/1000;
                            onshapeY = offsetY + frameCheckpoint.posYUR/1000;

                            // Update the spline
                            draw.addPoints([onshapeX, onshapeY], function(data){
                                console.log(data)
                            });
                        }
                    });
                }
            });

            if (!pathExists){   // If the path doesn't exist on the server, add it to the server path data

                pathData.push(framePath);

            }
        });

        console.log("draw: Current PATH DATA in SERVER: ", JSON.stringify(pathData));

    });
}

function nodeReadCallback(data, checkpointIdx, pathIdx){

    // if the value of the checkpoint node changed to 1, we need to send the robot to that checkpoint
    // if the value of the checkpoint node changed to 0, the robot just reached the checkpoint and we can trigger other stuff

    console.log('NODE ', checkpointIdx, ' path: ', pathIdx, ' received ', data);

    let checkpointTriggered = pathData[pathIdx].checkpoints[checkpointIdx];

    if (data.value === 1){

        if (!checkpointTriggered.active){

            console.log('Checkpoint has changed from not active to active: ', checkpointTriggered.name);

            // Checkpoint has changed from not active to active. We have to send robot here
            activeCheckpointName = checkpointTriggered.name;
            checkpointTriggered.active = 1; // This checkpoint gets activated

            inMotion = false
            server.write(objectName, TOOL_NAME, activeCheckpointName, 0)
            
            server.writePublicData(objectName, TOOL_NAME, "kineticNode1", "CheckpointTriggered", checkpointIdx);          // Alert frame of new checkpoint goal

        } else {
            console.log('draw: WARNING - This checkpoint was already active!');
        }

    } else if (data.value === 0){   // If node receives a 0

        if (checkpointTriggered.active){

            console.log('Checkpoint has changed from active to not active: ', checkpointTriggered.name);

            if (inMotion){

                // The node has been deactivated in the middle of the move mission!
                // We need to delete the mission from the mission queue

                console.log('MISSION INTERRUPTED');

                // TODO: STOP UR

                ur_mission_interrupted = true;

            } else {    // Checkpoint has changed from active to not active, robot just got here. We have to trigger next checkpoint
                
                console.log('Checkpoint reached: ', checkpointTriggered.name);
                checkpointTriggered.active = 0; // This checkpoint gets deactivated

                server.writePublicData(objectName, TOOL_NAME, "kineticNode1", "CheckpointStopped", checkpointIdx);

                let nextCheckpointToTrigger = null;

                if (checkpointIdx + 1 < pathData[pathIdx].checkpoints.length){                      // Next checkpoint in same path
                    nextCheckpointToTrigger = pathData[pathIdx].checkpoints[checkpointIdx + 1];

                    console.log('Next checkpoint triggered: ', nextCheckpointToTrigger.name);
                    server.write(objectName, TOOL_NAME, nextCheckpointToTrigger.name, 1);

                } else {                                                                            // We reached end of path

                    activeCheckpointName = null;

                }
            }
        }
    }
}

server.addEventListener("reset", function () {

});

// Wait for the connection to be established with the Spike Prime before starting up
server.addEventListener("initialize", function () {
    if (exports.enabled) startHardwareInterface()
});

// Stop motors on server shutdown
server.addEventListener("shutdown", function () {

});