var zerorpc = require("zerorpc");

var msg = "ultra.distance_centimeters"
var msg_u = "touch.is_pressed"

var server = new zerorpc.Server({
    message: function(reply) {
        reply(null, msg)
    },
    response: function(message, reply) {
        console.log(message)
        if (message == 'quit'){
            process.abort()
        }
        reply(null, "done")
    },
    message_u: function(reply) {
        reply(null, msg_u)
    },
    response_u: function(message, reply) {
        console.log(message)
        if (message == 'quit'){
            process.abort()
        }
        reply(null, "done")
    },
    
});

function tester(){
    msg = "touch.is_pressed";
    console.log(msg);
}

function tester2() {
    msg_u = "ultra.distance_centimeters"
    console.log(msg_u)
}

setTimeout(tester, 25000);
setTimeout(tester2, 25000);

server.bind("tcp://0.0.0.0:4344");