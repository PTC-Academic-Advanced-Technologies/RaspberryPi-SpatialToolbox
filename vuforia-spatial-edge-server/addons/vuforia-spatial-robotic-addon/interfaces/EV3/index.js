//Carter Silvey
//Alina Shah
//EV3 Vuforia

// Variables
var zerorpc = require("zerorpc");
var server = require('@libraries/hardwareInterfaces');
var settings = server.loadHardwareInterface(__dirname);
var noble = require('@abandonware/noble');

var msgA = "ignore", msgB = "ignore", msgC = "ignore", msgD = "ignore";
var msgLeft = "ignore", msgRight = "ignore", msgSpkr = "ignore";
var msgUltra = "ignore", msgGyro = "ignore", msgTouch = "ignore", msgColor = "ignore";
var val_u, val_t, val_c, val_g;
const TOOL_NAME = "IO";
var run_motors = true;

let objectName = "ev3Node";

// ZeroRPC client with client.py file
//separate message/response for each sensor/motor
var zeroServer = new zerorpc.Server({
    messageA: function(reply) {
        reply(null, msgA)
    },
    responseA: function(message, reply) {
        if (message != "ignore"){
            console.log(message)
        }
        reply(null, "done")
    },
    messageB: function(reply) {
        reply(null, msgB)
    },
    responseB: function(message, reply) {
        if (message != "ignore"){
            console.log("msg " + message)
        }
        reply(null, "done")
    },
    messageC: function(reply) {
        reply(null, msgC)
    },
    responseC: function(message, reply) {
        if (message != "ignore"){
            console.log(message)
        }
        reply(null, "done")
    },
    messageD: function(reply) {
        reply(null, msgD)
    },
    responseD: function(message, reply) {
        if (message != "ignore"){
            console.log(message)
        }
        reply(null, "done")
    },
    messageR: function(reply) {
        reply(null, msgRight)
    },
    responseR: function(message, reply) {
        if (message != "ignore"){
            console.log(message)
        }
        reply(null, "done")
    },
    messageL: function(reply) {
        reply(null, msgLeft)
    },
    responseL: function(message, reply) {
        if (message != "ignore"){
            console.log(message)
        }
        reply(null, "done")
    },
    messageS: function(reply) {
        reply(null, msgSpkr)
    },
    responseS: function(message, reply) {
        if (message != "ignore"){
            console.log(message)
        }
        reply(null, "done")
    },
    messageU: function(reply) {
        reply(null, msgUltra)
    },
    responseU: function(message, reply) {
        if (message != "ignore"){
            //console.log(message)
            val_u = message
        }
        reply(null, "done")
    },
    messageG: function(reply) {
        reply(null, msgGyro)
    },
    responseG: function(message, reply) {
        if (message != "ignore"){
            val_g = message
        }
        reply(null, "done")
    },
    messageT: function(reply) {
        reply(null, msgTouch)
    },
    responseT: function(message, reply) {
        if (message != "ignore"){
            val_t = message
        }
        reply(null, "done")
    },
    messageCo: function(reply) {
        reply(null, msgColor)
    },
    responseCo: function(message, reply) {
        if (message != "ignore"){
            val_c = message
        }
        reply(null, "done")
    },
});

zeroServer.bind("tcp://0.0.0.0:4343");

exports.enabled = settings('enabled');
exports.configurable = true;

if (exports.enabled){
    
    // Code executed when your robotic addon is enabled
    setup();

    console.log('EV3: Settings loaded: ', objectName)

    console.log("EV3 is connected");

    function setup() {
    	exports.settings = {
    		ev3Name: {
    			value: settings('objectName', 'ev3Node'),
    			type: 'text',
    			default: 'ev3Node',
    			disabled: false,
    			helpText: 'The name of the object that connects to this hardware interface.'
    		},
            ev3Complexity: {
                value: settings('ev3Complexity', 'advanced'),
                type: 'text',
                default: 'advanced',
                disabled: false,
                helpText: 'The complexity of the interface. "beginner" gives a few nodes, "intermediate" gives more, and "advanced" gives full control.'
            }
    	};
    }

    objectName = exports.settings.ev3Name.value;
    ev3Complexity = exports.settings.ev3Complexity.value.toLowerCase();
    ev3Complexity = ev3Complexity.replace(/\n/g,'');
    console.log("EV3" + objectName)
    console.log("with complexity: " + ev3Complexity)

    server.addEventListener('reset', function () {
    	settings = server.loadHardwareInterface(__dirname);
    	setup();

    	console.log('EV3: Settings loaded: ', objectName);
	});
}

// Starts the interface with the hardware
function startHardwareInterface() {
	console.log('EV3: Starting up')

	server.enableDeveloperUI(true)
  
     // add all nodes to app for advanced mode
    server.addNode(objectName, TOOL_NAME, "motorA", "node", {x: -125, y: -100, scale: 0.175});
    server.addNode(objectName, TOOL_NAME, "motorB", "node", {x: -125, y: -25, scale: 0.175});
    server.addNode(objectName, TOOL_NAME, "motorC", "node", {x: -125, y: 50, scale: 0.175});
    server.addNode(objectName, TOOL_NAME, "motorD", "node", {x: -125, y: 125, scale: 0.175});
    server.addNode(objectName, TOOL_NAME, "ultra", "node", {x: 125, y: -100, scale: 0.175});
    server.addNode(objectName, TOOL_NAME, "touch", "node", {x: 125, y: -25, scale: 0.175});
    server.addNode(objectName, TOOL_NAME, "color", "node", {x: 125, y: 50, scale: 0.175});
    server.addNode(objectName, TOOL_NAME, "gyro", "node", {x: 125, y: 125, scale: 0.175});
    server.addNode(objectName, TOOL_NAME, "ledLeft", "node", {x: -42, y: -100, scale: 0.175});
    server.addNode(objectName, TOOL_NAME, "ledRight", "node", {x: 42, y: -100, scale: 0.175});
    server.addNode(objectName, TOOL_NAME, "speaker", "node", {x: 42, y: 125, scale: 0.175});
    server.addNode(objectName, TOOL_NAME, "stopMotors", "node", {x: -42, y: 125, scale: 0.175})

    //remove node from beginner
    server.removeNode(objectName, TOOL_NAME, "motors") 

    //all motors controlled from one node, right led light node, speaker node, ultra node, stop motors
    if (ev3Complexity == "beginner") {
        server.removeNode(objectName, TOOL_NAME, "motorA");
        server.removeNode(objectName, TOOL_NAME, "motorB");
        server.removeNode(objectName, TOOL_NAME, "motorC");
        server.removeNode(objectName, TOOL_NAME, "motorD");
        server.removeNode(objectName, TOOL_NAME, "color");
        server.removeNode(objectName, TOOL_NAME, "gyro");
        server.removeNode(objectName, TOOL_NAME, "touch");
        server.removeNode(objectName, TOOL_NAME, "ledLeft");

        server.moveNode(objectName, TOOL_NAME, "stopMotors", 42, 125);
        server.moveNode(objectName, TOOL_NAME, "ledRight", 125, -100);
        server.moveNode(objectName, TOOL_NAME, "speaker", 125, -25);
        server.moveNode(objectName, TOOL_NAME, "ultra", 125, 50);

        server.addNode(objectName, TOOL_NAME, "motors", "node", {x: 125, y: 125, scale: 0.175});

    }

    //all motor and sensor nodes
    if (ev3Complexity == "intermediate") {
        server.removeNode(objectName, TOOL_NAME, "ledLeft");
        server.removeNode(objectName, TOOL_NAME, "ledRight");
        server.removeNode(objectName, TOOL_NAME, "speaker");
        server.removeNode(objectName, TOOL_NAME, "motors");

        server.moveNode(objectName, TOOL_NAME, "stopMotors", 0, 125);
        server.moveNode(objectName, TOOL_NAME, "ultra", 125, -100);
    }

    if (ev3Complexity == "advanced") {
        server.moveNode(objectName, TOOL_NAME, "ledRight", 42, -100);
        server.moveNode(objectName, TOOL_NAME, "ultra", 125, -100);
        server.moveNode(objectName, TOOL_NAME, "stopMotors", -42, 125);
        server.moveNode(objectName, TOOL_NAME, "speaker", 42, 125);
    }

    //if true value passed to node, stop motors
    server.addReadListener(objectName, TOOL_NAME, "stopMotors", function(data) {
        if (data.value == 1) {
            console.log("motors off");
            stop();
        }
        if (data.value == 0) run_motors = true;
    });

    //Listen for Motor A node
    server.addReadListener(objectName, TOOL_NAME, "motorA", function(data) {
        if (run_motors) {
            console.log(data.value);
            msgA = "A.on(" + get_val(data.value) + ")";   
        }
        else stop();
    });

    //Listen for Motor B node
    server.addReadListener(objectName, TOOL_NAME, "motorB", function(data) {
        if (run_motors) {
            console.log(data.value);
            msgB = "B.on(" + get_val(data.value) + ")"; 
        }
        else stop();
    });

    //Listen for Motor C node
    server.addReadListener(objectName, TOOL_NAME, "motorC", function(data) {
        if (run_motors) {
            console.log(data.value);
            msgC = "C.on(" + get_val(data.value) + ")"; 
        }
        else stop();  
    });

    //Listen for Motor D node
    server.addReadListener(objectName, TOOL_NAME, "motorD", function(data) {
        if (run_motors) {
            console.log(data.value);
            msgD = "D.on(" + get_val(data.value) + ")"; 
        }
        else stop();   
    });

    //Listen for all motors (all motors run from one node in beginner mode)
    server.addReadListener(objectName, TOOL_NAME, "motors", function(data) {
        if (run_motors) {
            console.log(data.value);
            var num = get_val(data.value);
            msgA = "A.on(" + num + ")";
            msgB = "B.on(" + num + ")";
            msgC = "C.on(" + num + ")";
            msgD = "D.on(" + num + ")";
        }
    });

    //Listen for left LED lights
    server.addReadListener(objectName, TOOL_NAME, "ledLeft", function(data) {
        console.log(data.value)
        if (data.value < 0.2) msgLeft = "leds.set_color('LEFT', 'AMBER', " + data.value + ")"
        else if (data.value < 0.4) msgLeft = "leds.set_color('LEFT', 'ORANGE', " + data.value + ")"
        else if (data.value < 0.6) msgLeft = "leds.set_color('LEFT', 'RED', " + data.value + ")"
        else if (data.value < 0.8) msgLeft = "leds.set_color('LEFT', 'YELLOW', " + data.value + ")"
        else if (data.value < 1) msgLeft = "leds.set_color('LEFT', 'GREEN', " + data.value + ")"  
    });

    //Listen for right LED lights
    server.addReadListener(objectName, TOOL_NAME, "ledRight", function(data) {
        console.log(data.value)
        if (data.value < 0.2) msgRight = "leds.set_color('RIGHT', 'AMBER', " + data.value + ")"
        else if (data.value < 0.4) msgRight = "leds.set_color('RIGHT', 'ORANGE', " + data.value + ")"
        else if (data.value < 0.6) msgRight = "leds.set_color('RIGHT', 'RED', " + data.value + ")"
        else if (data.value < 0.8) msgRight = "leds.set_color('RIGHT', 'YELLOW', " + data.value + ")"
        else if (data.value < 1) msgRight = "leds.set_color('RIGHT', 'GREEN', " + data.value + ")"  
    });

    //Listen for speaker
    server.addReadListener(objectName, TOOL_NAME, "speaker", function(data) {
        console.log(data.value)
        var num
        if (data.value < 1) num = Math.trunc(data.value * 1000)
        else if (data.value < 100) num = Math.trunc(data.value * 100)
        else if (data.value < 1000) num = Math.trunc(data.value * 10)
        msgSpkr = "spkr.play_tone(" + num + ", 1, 0, 100, 0)"
    });

    setTouchVal()
    setUltraVal()
    setGyroVal()
    setColorVal()

	updateEvery(0, 10);
}

//if you don't want to have to use the transfer tool use the map function within server.write
//server.write(objectName, TOOL_NAME, "ultra", server.map(num, 0, 255, 0, 1), "f")
//where server.map uses the bounds of the input (0, 255) to map the value to a float between 0 and 1

//continuously writes ultra distance (cm) to node
function setUltraVal() {
    msgUltra = "ultra.distance_centimeters"
    if (val_u != undefined && val_u.substring(0, 1) == "u") {
        var num = val_u.substring(1, val_u.length)
        server.write(objectName, TOOL_NAME, "ultra", num, "f")
    }
    setTimeout(() => { setUltraVal(); }, 10);
}

//continuously writes bool for if touched to node
function setTouchVal() {
    msgTouch = "touch.is_pressed"
    if (val_t != undefined && val_t.substring(0, 1) == "t") {
        var num = val_t.substring(1, val_t.length)
        server.write(objectName, TOOL_NAME, "touch", num, "f")
    }
    setTimeout(() => { setTouchVal(); }, 10);
}

//continuously writes gyro angle to node
function setGyroVal() {
    msgGyro = "gy.angle"
    if (val_g != undefined && val_g.substring(0, 1) == "g") {
        var num = val_g.substring(1, val_g.length)
        server.write(objectName, TOOL_NAME, "gyro", num, "f")
    }
    setTimeout(() => { setGyroVal(); }, 10);
}

//continuously writes color number to node
function setColorVal() {
    //change to color.color if you want the corresponsing color number instead of the color name
    msgColor = "color.color_name"
    if (val_c != undefined && val_c.substring(0, 1) == "c") {
        var num = val_c.substring(1, val_c.length)
        server.write(objectName, TOOL_NAME, "color", num, "f")
    }
    setTimeout(() => { setColorVal(); }, 10);
}

function updateEvery(i, time){
	setTimeout(() => {
		updateEvery(++i, time);
	}, time)
}

//adjusts motor speed to be between -100 and 100
function get_val(data){
    var speed;
    if ((data >= -100 && data <= -1) || (data <= 100 && data >= 1)) speed = data;
    else if (data < -100 || data > 100) speed = 0;
    else if ((data > 0 && data < 1) || (data < 0 && data > -1)) speed = data * 100;
    else speed = 0;
    return speed;
}

//stops all motors
function stop() {
    run_motors = false;
    msgA = "A.stop()";
    msgB = "B.stop()";
    msgC = "C.stop()";
    msgD = "D.stop()";
}

server.addEventListener("initialize", function () {
    if (exports.enabled) startHardwareInterface();
});

server.addEventListener("shutdown", function () {
    msgRight = "leds.set_color('RIGHT', 'GREEN')";
    msgLeft = "leds.set_color('LEFT', 'GREEN')";
    msgSpkr = "spkr.play_tone(" + 0 + ", 1, 0, 100, 0)";
    stop();
});
