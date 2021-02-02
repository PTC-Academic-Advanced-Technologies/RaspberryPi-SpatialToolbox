//Carter Silvey

// Constants
const SerialPort = require('serialport')
const parsers = SerialPort.parsers
const reader = require('readline')
const syncReader = require('readline-sync')
const fs = require("fs");

// Variables
var name = "test.py"
var tabs = 0, lastTabs = 0
var backspaces = '\b'
var sensorReading = 'Nothing'
var i = 1, j = 0
var waitTime = 1000
var moreIndents = true

// Use a `\r\n` as a line terminator
const parser = new parsers.Readline({
	delimiter: '\r\n',
})

// The port to connect to (CHANGE TO YOUR SERAIL PORT)
const port = new SerialPort('/dev/tty.LEGOHub380B3CAA5E34-Ser', { 
	baudRate: 115200,
})
// var test = port._readableState;
// console.log("SOPHIE: " + JSON.stringify(test));

port.pipe(parser)

// Connected to the serial port
function openPort() {
	port.on('open', () => console.log('Port open'))
	// Use the below line to see what the REPL outputs
	//parser.on('data', console.log)
	writePort('\x03');

	try{
		readMessage();
	}
	catch(error){
		console.log("SPIKE Prime Not Connected");
	}
	// readMessage();
	// setInterval(() => { readMessage(); }, 0);
}

// Reads in from the port and sets sensorReading to be the most recent non-empty line
function readMessage() {
	port.on('readable', function() {
		setInterval(() => {  
			raw = port.read()
			if (raw != null) {
				sensorReading = raw.toString('utf8')
				//console.log(sensorReading)
				// Checks to see if there is exactly one enter line
				if (((sensorReading.match(/\n/g) || []).length) == 1)  {
					//Do nothing
				}
				// If there is not exactly one enter line, then split at the enters, and take the most recent line that has data
				else {
					arr = sensorReading.split('\n')
					i = 1
					while (i < arr.length) {
						// Eliminates lines that are either empty or were code that we excuted
						if (arr[arr.length-i].includes(">") || arr[arr.length-i].includes("...") || arr[arr.length-i] === "") {
							i = i + 1
						}
						else {
							break;
						}
					}
					sensorReading = arr[arr.length - i]
				}
				sensorReading = sensorReading.replace(/>>>/g, '')
				sensorReading = sensorReading.replace(/\n/g, '')
				sensorReading = sensorReading.replace(/\r/g, '')
			}
		}, 0)
	})
	//console.log(sensorReading)
}

// Write a message to the connected device
function writePort(msg) {
	try{
		port.write(msg);
	}
	catch(error){
		console.log("SPIKE Prime Not Connected");
	}
	// port.write(msg)
}

// Get the name of the file that is to be sent over the serial port (not used in index.js)
function getFileName() {
	name = syncReader.question('What file would you like to send?', {
		});
	console.log('Sending the file');
	sendFile(name)
}

// Read in the file line by line and send each line to the Spike Prime
async function sendFile(name) {
	const fileStream = fs.createReadStream(name);

	const rl = reader.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	// Each line will be successively available here as `line`.
	for await (const line of rl) {
		// Compare the tab spacing to the last lines tab spacing
		lastTabs = tabs

		// Reset variables every loop before the while statement that used them
		j = 0
		moreIndents = true

		// Find out how many indents the current line is on (up to 3 currently)
		while (moreIndents) {
			if (line[4*j] != ' ') {
				moreIndents = false
				tabs = j
			}
			j = j + 1
		}

		// If we have unindented, then make sure the repl knows
		if (tabs < lastTabs) {
			// If we are back at the bottom, send multiple fresh lines to execute the previous lines
			if (tabs == 0) {
				setTimeout(() => { writePort('\r\n\r\n\r\n'); }, waitTime);
			}
			// Otherwise just send the amount of backspaces as tabs unindented
			else {
				backspaces = '\b'.repeat(lastTabs-tabs)
				setTimeout(() => { writePort(backspaces); }, waitTime);
			}
		}
		//Send the line that we read from the file while trimming off the excess spaces/tabs and adding a delimiter
		setTimeout(() => { writePort(line.trim().concat('\r\n')); }, waitTime);
	}
}

// Functions to export to other files (right now, only index.js uses these)
module.exports = {
	getSensor: function() {
		return sensorReading;
	},
	openPort : openPort,
	sendFile : sendFile,
	writePort : writePort,
	readMessage : readMessage
};