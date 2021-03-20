//Carter Silvey

var serial = require('./serial.js');
var server = require('@libraries/hardwareInterfaces');
var draw = require('./apikey/Node/drawing.js');
var inverse = require('./inverseKinematics.js');
var settings = server.loadHardwareInterface(__dirname);

var TOOL_NAME = "spikeKineticAR"; // This is what is made on the webserver for the image target
let objectName = "spikeDraw"; // This is the name of the folder in spatialToolbox in Documents 

exports.enabled = settings('enabled');
exports.configurable = true;

let inMotion = false;                   // When robot is moving
let pathData = [];                      // List of paths with checkpoints
let activeCheckpointName = null;        // Current active checkpoint

var portLetters = ["A", "B", "C", "D", "E", "F"]
var ports = ["none", "none", "none", "none", "none", "none"]
var [motor1, motor2, motor3, distanceSensor, colorSensor, forceSensor] = ports
var firstMotor, secondMotor, thirdMotor
var runMotors = true
let documentId = "did";
let workspaceId = "wid";
let elementId = "eid";

try {
    serial.openPort()
    setTimeout(() => {serial.sendFile('initialize.py')}, 10000) // CHANGED HERE --> Reverted the times back to original
    setTimeout(() => {serial.sendFile('initialize2.py')}, 13000) // CHANGED HERE --> Reverted the times back to original
    setTimeout(() => {initializePorts()}, 16000) // CHANGED HERE --> Reverted the times back to original
} catch(e) {
    console.log('Spike Prime NOT connected')
}

if (exports.enabled){
    // Code executed when your robotic addon is enabled
    setup();
    console.log('spikeDraw: Settings loaded: ', objectName)
    console.log("Spike is connected");

    // Sets up the settings that can be customized on localhost:8080
    function setup() {
        exports.settings = {
            // Name for the object
            spikeDrawName: { // CHANGED HERE --> Name is changed here 
                value: settings('objectName', objectName),
                type: 'text',
                default: objectName,
                disabled: true,
                helpText: 'The name of the object that connects to this hardware interface.'
            },
	        // Onshape Url link to be parsed 
            spikeOnshapeURL: {
                value: settings('spikeOnshapeURL', "cad.onshape.com/documents/did/w/wid/e/eid"),
                type: 'text',
                default: 'cad.onshape.com/documents/did/w/wid/e/eid',
                disabled: false,
                helpText: 'Enter the link to your Onshape Document where you will be drawing.'
            },
            // X distance from image target to first joint
            imageToBaseX: {
                value: settings('imageToBaseX', 0),
                type: 'number',
                default: 0,
                disabled: false,
                helpText: "The horizontal distance (in millimeters) from the center of the image target \
                to the center of the first rotating joint."
            },
            // Y distance from image target to first joint
            imageToBaseY: {
                value: settings('imageToBaseY', 0),
                type: 'number',
                default: 0,
                disabled: false,
                helpText: "The vertical distance (in millimeters) from the center of the image target \
                to the center of the first rotating joint."
            },
            // Length of the first linkage
            link1Length: {
                value: settings('link1Length', 0),
                type: 'number',
                default: 0,
                disabled: false,
                helpText: "The length (in millimeters) from the first rotating joint to the second rotating joint."
            },
            // Length of the second linkages
            link2Length: {
                value: settings('link2Length', 0),
                type: 'number',
                default: 0,
                disabled: false,
                helpText: "The length (in millimeters) from the second rotating joint to the end effector."
            },
            // Feature Name
            spikeFeatureName: {
                value: settings('spikeFeatureName', 'VST Drawing'),
                type: 'text',
                default: 'VST Drawing',
                disabled: false,
                helpText: 'The name of the Onshape feature that will be created.'
            },
            // Onshape origin offset in X
            spikeOnshapeOffsetX: {
                value: settings('spikeOnshapeOffsetX', 0),
                type: 'number',
                default: 0,
                disabled: false,
                helpText: 'The horizontal offset from the Onshape origin where you want to being drawing.'
            },
            // Onshape origin offset in Y
            spikeOnshapeOffsetY: {
                value: settings('spikeOnshapeOffsetY', 0),
                type: 'number',
                default: 0,
                disabled: false,
                helpText: 'The vertical offset from the Onshape origin where you want to being drawing.'
            }
        };
    }

    // Get the settings that the user defined on localhost:8080
    objectName = exports.settings.spikeDrawName.value;
    console.log("spikeDraw: " + objectName)
    imageToBaseX = exports.settings.imageToBaseX.value;
    imageToBaseY = exports.settings.imageToBaseY.value;
    link1Length = exports.settings.link1Length.value;
    link2Length = exports.settings.link2Length.value;
    featureName = exports.settings.spikeFeatureName.value;
    offsetX = exports.settings.spikeOnshapeOffsetX.value;
    offsetY = exports.settings.spikeOnshapeOffsetY.value;

    // Get the entire URL link
    onshapeUrl = exports.settings.spikeOnshapeURL.value;
    console.log("spikeDraw thinks it is connected to: " + onshapeUrl);
    onshapeUrl_object = onshapeUrl.split('/');
    if(onshapeUrl_object.length >= 9) {
        documentId = onshapeUrl_object[4]; 
        workspaceId = onshapeUrl_object[6]; 
        elementId = onshapeUrl_object[8];
    }
    else if (onshapeUrl_object.length >= 7) {
        documentId = onshapeUrl_object[2]; 
        workspaceId = onshapeUrl_object[4]; 
        elementId = onshapeUrl_object[6];
    }


    if (link1Length != 0 && link2Length != 0) {
        inverse.setLengths(imageToBaseX, imageToBaseY, link1Length, link2Length);
    }

    if (documentId != 'did' && workspaceId != 'wid' && elementId != 'eid') {
        draw.setParams(documentId, workspaceId, elementId, featureName);
    }

    server.addEventListener('reset', function () {
        settings = server.loadHardwareInterface(__dirname);
        setup();

        console.log('spikeDraw: Settings loaded: ', objectName);
    });
}

function startHardwareInterface() {
    console.log('spikeDraw: Starting up')

    server.enableDeveloperUI(true)

    console.log('spikeDraw: Setting default tool to spikeDrawing');
    server.setTool(objectName, TOOL_NAME, 'spikeDrawing', __dirname);
    server.removeAllNodes(objectName, TOOL_NAME);

    server.addNode(objectName, TOOL_NAME, "kineticNode1", "storeData");     // Node for checkpoint stop feedback
    server.addNode(objectName, TOOL_NAME, "kineticNode2", "storeData");     // Node for the data path. Follow Checkpoints
    server.addNode(objectName, TOOL_NAME, "kineticNode4", "storeData");     // Node for cleaning the path

    server.addPublicDataListener(objectName, TOOL_NAME, "kineticNode4","ClearPath",function (data) {

        console.log("spikeDraw:    -   -   -   Frame has requested to clear path: ", data);

        pathData.forEach(path => {
            path.checkpoints.forEach(checkpoint => {
                server.removeNode(objectName, TOOL_NAME, checkpoint.name);
            });
            path.checkpoints = [];
        });
        pathData = [];

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

                                // Number and position of the current checkpoint in this loop
                                //let checkpointNumber = parseInt(frameCheckpoint.name.slice(-1));
                                //let checkpointPos = [frameCheckpoint.posX/1000, frameCheckpoint.posY/1000, frameCheckpoint.posZ/1000];

                                // If the checkpoint has already been added to Onshape, update its position
                                // if (checkpointNumber < onshapeCheckpoints) {
                                //     check.updateCheckpoint(checkpointNumber, checkpointPos, function(data){
                                //         //console.log(data);
                                //     });
                                // } 
                            }
                        });

                        // If the checkpoint is not in the server, add it and add the node listener.
                        if (!exists){
                            serverPath.checkpoints.push(frameCheckpoint);

                            server.addNode(objectName, TOOL_NAME, frameCheckpoint.name, "node");

                            console.log('spikeDraw: NEW ' + frameCheckpoint.name + ' | position: ', frameCheckpoint.posX, frameCheckpoint.posY, frameCheckpoint.posZ);

                            // <node>, <frame>, <Node>, x, y, scale, matrix
                            server.moveNode(objectName, TOOL_NAME, frameCheckpoint.name, frameCheckpoint.posX, frameCheckpoint.posZ, 0.3,[
                                1, 0, 0, 0,
                                0, 1, 0, 0,
                                0, 0, 1, 0,
                                0, 0, frameCheckpoint.posY * 3, 1
                            ], true);

                            server.pushUpdatesToDevices(objectName);

                            console.log('spikeDraw: ************** Add read listener to ', frameCheckpoint.name);

                            // Add listener to node
                            server.addReadListener(objectName, TOOL_NAME, frameCheckpoint.name, function(data){

                                let indexValues = frameCheckpoint.name.split("_")[1];
                                let pathIdx = parseInt(indexValues.split(":")[0]);
                                let checkpointIdx = parseInt(indexValues.split(":")[1]);
                                nodeReadCallback(data, checkpointIdx, pathIdx);

                            });

                            console.log(frameCheckpoint.posX/1000 + "," + frameCheckpoint.posY/1000 + "," + frameCheckpoint.posZ/1000)
                        }
                    });
                }
            });

            if (!pathExists){   // If the path doesn't exist on the server, add it to the server path data

                pathData.push(framePath);

            }
        });

        console.log("spikeDraw: Current PATH DATA in SERVER: ", JSON.stringify(pathData));

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

            inMotion = true

            console.log(checkpointTriggered.posXUR)
            console.log(checkpointTriggered.posYUR)

            // Move the Spike Prime
            inverse.getAngles(checkpointTriggered.posXUR, -checkpointTriggered.posYUR, function(angles){
                angle1 = ((180/Math.PI * angles.q1)%360 + 360)%360
                angle2 = ((180/Math.PI * angles.q2)%360 + 360)%360
                console.log(angle1)
                console.log(angle2)

                setTimeout(() => { serial.writePort(motor1 + ".run_to_position(" + Math.round(angle1) + ", 'shortest path', 20)\r\n") }, 0);
                setTimeout(() => { serial.writePort(motor2 + ".run_to_position(" + Math.round(angle2) + ", 'shortest path', 20)\r\n") }, 1000);
                inMotion = false
                onshapeX = (checkpointTriggered.posXUR-imageToBaseX)/1000 + offsetX;
                onshapeY = (checkpointTriggered.posYUR-imageToBaseY)/1000 + offsetY;
                draw.addPoints([onshapeX, onshapeY], function(data){
                    console.log(data)
                })
                setTimeout(() => { server.write(objectName, TOOL_NAME, activeCheckpointName, 0) }, 3000);
            });
            
            server.writePublicData(objectName, TOOL_NAME, "kineticNode1", "CheckpointTriggered", checkpointIdx);          // Alert frame of new checkpoint goal

        } else {
            console.log('spikeDraw: WARNING - This checkpoint was already active!');
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

// Gets the port ordering from the Spike Prime, which initialized itself
function initializePorts() {
    sensorData = readSensor()
    if (sensorData.includes('[') && sensorData.includes(',')) {
        sensorData = sensorData.substring(1, sensorData.length - 2)
        sensorData = sensorData.replace(/'/g, '')
        sensorData = sensorData.replace(/ /g, '')
        sensorData = sensorData.split(',')
        for (i = 0; i < sensorData.length; i++) {
            ports[i] = sensorData[i]
        }
        console.log(ports)
        definePorts()
    }
    else {
        setTimeout(() => { initializePorts(); }, 0);
    }
}

// Change the names of the motors and sensor to be their corresponding ports
// For example, a motor on port A is named "A"
function definePorts() {
    if (ports.indexOf('motor') != -1) {
        firstMotor = ports.indexOf('motor')
        motor1 = portLetters[firstMotor]
        if (ports.indexOf('motor', firstMotor + 1) != -1) {
            secondMotor = ports.indexOf('motor', firstMotor + 1)
            motor2 = portLetters[secondMotor]
            if (ports.indexOf('motor', secondMotor + 1) != -1) {
                thirdMotor = ports.indexOf('motor', secondMotor + 1)
                motor3 = portLetters[thirdMotor]
            }
        }
    }
    if (ports.indexOf('color') != -1) {
        colorSensor = portLetters[ports.indexOf('color')]
    }
    if (ports.indexOf('distance') != -1) {
        distanceSensor = portLetters[ports.indexOf('distance')]
    }
    if (ports.indexOf('force') != -1) {
        forceSensor = portLetters[ports.indexOf('force')]
    }
    console.log(motor1, motor2, motor3, colorSensor, distanceSensor, forceSensor)
}

function readSensor() {
    sensorData = serial.getSensor()
    return sensorData
}

// Send commands to stop all the motors
function stopMotors() {
    runMotors = false
    if (motor1 != "none") {
        serial.writePort(motor1 + ".stop()\r\n")
    }
    if (motor2 != "none") {
        serial.writePort(motor2 + ".stop()\r\n")
    }
    if (motor3 != "none") {
        serial.writePort(motor3 + ".stop()\r\n")
    }
}

server.addEventListener("reset", function () {

});

// Wait for the connection to be established with the Spike Prime before starting up
server.addEventListener("initialize", function () {
    if (exports.enabled) setTimeout(() => { startHardwareInterface() }, 20000)
});

// Stop motors on server shutdown
server.addEventListener("shutdown", function () {
    stopMotors()
});