var imageTargetToLink1X = 220
var imageTargetToLink1Y = 0
var a1 = 70
var a2 = 90

let q1 = 0;
let q2 = 0;

var setLengths = function(imageToBaseX, imageToBaseY, link1Length, link2Length) {
    imageTargetToLink1X = imageToBaseX;
    imageTargetToLink1Y = imageToBaseY;
    a1 = link1Length;
    a2 = link2Length;
    console.log("Lengths set")
}

var getAngles = function(x, y, cb) {
    x = x - imageTargetToLink1X;
    y = y - imageTargetToLink1Y;
    if (Math.sqrt(Math.pow(x,2) + Math.pow(y,2)) > link1Length + link2Length) {
        q1 = Math.atan2(y, x);
        q2 = 0;
    }
    else {
        q2 = Math.acos((Math.pow(x,2) + Math.pow(y,2) - Math.pow(a1,2) - Math.pow(a2,2))/(2*a1*a2));
        q1 = Math.atan2(y, x) - Math.atan2(a2*Math.sin(q2), (a1 + a2 * Math.cos(q2)));
    }
    angles = {
        q1: q1,
        q2: q2
    }
    cb(angles)
}

module.exports = {
    setLengths: setLengths,
    getAngles: getAngles
}