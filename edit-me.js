// Import the Onshape file with functions that can draw our spline
var draw = require('./vuforia-spatial-edge-server/addons/vuforia-spatial-robotic-addon/interfaces/Spike-Drawing/apikey/Node/drawing.js');

// INSERT YOUR DOCUMENT PARAMETERS HERE
var documentId = 'did';
var workspaceId = 'wid';
var elementId = 'eid';
var featureName = 'VST Drawing';

// Set these parameters
draw.setParams(documentId, workspaceId, elementId, featureName);

// YOUR CODE HERE to determine the points to draw
var points = [0 /*X point*/, 0 /*Y point*/]

// Add the array of points to the drawing we currently have in Onshape
// Note: The addPoints function will automatically add the points in the array to the existing spline.
//       This means you do not have to keep track of all the points, just the ones you haven't yet added.
//       However, each time this script is run, it clears the previous spline in Onshape.
draw.addPoints(points, function(pointsAdded){
    // pointsAdded returns true once the points have been added
})