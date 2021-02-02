/**
 * @preserve
 *
 *                                     .,,,;;,'''..
 *                                 .'','...     ..',,,.
 *                               .,,,,,,',,',;;:;,.  .,l,
 *                              .,',.     ...     ,;,   :l.
 *                             ':;.    .'.:do;;.    .c   ol;'.
 *      ';;'                   ;.;    ', .dkl';,    .c   :; .'.',::,,'''.
 *     ',,;;;,.                ; .,'     .'''.    .'.   .d;''.''''.
 *    .oxddl;::,,.             ',  .'''.   .... .'.   ,:;..
 *     .'cOX0OOkdoc.            .,'.   .. .....     'lc.
 *    .:;,,::co0XOko'              ....''..'.'''''''.
 *    .dxk0KKdc:cdOXKl............. .. ..,c....
 *     .',lxOOxl:'':xkl,',......'....    ,'.
 *          .';:oo:...                        .
 *               .cd,    ╔═╗┌─┐┬─┐┬  ┬┌─┐┬─┐   .
 *                 .l;   ╚═╗├┤ ├┬┘└┐┌┘├┤ ├┬┘   '
 *                   'l. ╚═╝└─┘┴└─ └┘ └─┘┴└─  '.
 *                    .o.                   ...
 *                     .''''','.;:''.........
 *                          .'  .l
 *                         .:.   l'
 *                        .:.    .l.
 *                       .x:      :k;,.
 *                       cxlc;    cdc,,;;.
 *                      'l :..   .c  ,
 *                      o.
 *                     .,
 *
 *             ╦ ╦┬ ┬┌┐ ┬─┐┬┌┬┐  ╔═╗┌┐  ┬┌─┐┌─┐┌┬┐┌─┐
 *             ╠═╣└┬┘├┴┐├┬┘│ ││  ║ ║├┴┐ │├┤ │   │ └─┐
 *             ╩ ╩ ┴ └─┘┴└─┴─┴┘  ╚═╝└─┘└┘└─┘└─┘ ┴ └─┘
 *
 * Created by Valentin on 10/22/14.
 *
 * Copyright (c) 2015 Valentin Heun
 *
 * All ascii characters above must be included in any redistribution.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */



/**
 * @fileOverview
 * SCALE is a block that outputs the input value multiplied by a constant, which can be adjusted in the settings menu.
 *
 * Defines a new logic block that will appear in the crafting menu
 * Anytime data arrives at the block, the render function will be triggered.
 * The input data value(s) will arrive in thisBlock.data
 * After performing the block's behavior, write the output value(s) to thisBlock.processedData,
 * And finally call the callback function to send the data to whatever this block is next linked to
 *
 * gui/icon.svg is the small menu icon for the block
 * gui/label.svg is the full image on the block (for a block of blockSize=1 might be the same as icon.svg)
 * gui/index.html is the optional settings menu that pops up when you tap on the block
 */
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fetch = require("node-fetch");


BASEID = "YOUR_BASE_ID"; 
TABLENAME = "YOU_TABLE_NAME"; // Usually this is defaulted to Table1 
APIKEY = "YOUR_AIRTABLE_APIKEY";


var generalProperties = {
    // display name underneath icon in block menu
    name: 'fft',
    // set this to how wide the block should be - (the bigger of # inputs and # outputs)
    blockSize: 2,
    privateData: {},
    // these properties are accessible to user modification via the block's settings menu (gui/index.html)
    publicData: {},
    // sets which input indices of the block can have links drawn to them
    activeInputs: [true, true, false, false],
    // sets which output indices of the block can have links drawn from them
    activeOutputs: [true, false, false, false],
    iconImage: 'icon.png',
    // not currently used anywhere, but helpful for developer reference
    nameInput: ['in', '', '', ''],
    nameOutput: ['out', '', '', ''],
    // should match the folder name
    type: 'fft'
};

exports.properties = generalProperties;

var fft_response;
var fftArray = [];
var arrIndex;
var maxMag = 0;
var maxMagIndex = 0;
var sampled = false;
// xml request to do a patch, which is updating the given variable with a given value on airtable
async function processFFT(arr, fs) {
    arr = Object.values(arr.map(s => Number(s)))
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    const body = JSON.stringify({
        "amplitude": arr, 
        "sampling_rate": fs,
        "percentage": 0.1
    })
    try {
        await fetch("https://ptc-fft-server.herokuapp.com/fft/simple_fft", {headers, method: "POST", body})
            .then(res => res.json())
            .then(res => {
                for (var i = 0; i < res.magnitude.length; i++) {
                    if (res.magnitude[i] > maxMag) {
                        maxMag = res.magnitude[i]
                        maxMagIndex = i;
                    }
                }
                fft_response = res;
                return res;
            })
            .catch(res => { 
                console.log("error " + res)
        })

    } catch (error) {
        return error;
    }
}

async function getFFT(arr, fs) {
    await processFFT(arr, fs);
}

function fillArray(size, samplePoint) {
    if (arrIndex == size) {
        return;
    } 
    else if (fftArray.length == 0) {
        arrIndex = 0;
        fftArray = new Array(size);
        fftArray[arrIndex] = samplePoint;
        arrIndex = arrIndex + 1;
        return;
    }
    else if (samplePoint != fftArray[arrIndex-1]) {
        fftArray[arrIndex] = samplePoint;
        arrIndex = arrIndex + 1;
        return;
    }
    return;
}

var temp_id; // Used to hold the id for Airtable variable

function httpGet(){
    var xmlHttp = new XMLHttpRequest();
    var url = "https://api.airtable.com/v0/" + BASEID + "/" + TABLENAME +"/";
      
    xmlHttp.open('GET', url, false);
    xmlHttp.setRequestHeader('Content-Type','application/json');
    xmlHttp.setRequestHeader('Authorization',"Bearer " + APIKEY);
      
    xmlHttp.send();
    return xmlHttp.responseText;
}

function getid(name) {
    var arr = (JSON.parse(httpGet())).records; 
    arr.forEach(function (arrayItem) {
        if (arrayItem.fields.Variables == name) {
            temp_id = arrayItem.id; 
        }
    });
}

function httpPatch(name, value){
    var xmlHttp = new XMLHttpRequest();
    var url = "https://api.airtable.com/v0/" + BASEID + "/" + TABLENAME +"/";
    // Updates temp_id
    getid(name);
    // this is the format for a propvalue to update airtable
    var propValue ={"records": [{"id": temp_id,"fields": {"Value": value.toString()}}]};

    xmlHttp.open('PATCH', url, true);
    xmlHttp.setRequestHeader('Content-Type','application/json');
    xmlHttp.setRequestHeader('Authorization','Bearer ' + APIKEY);
    xmlHttp.onreadystatechange = function() {
    if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            console.log(xmlHttp.responseText);
        }
        console.log(xmlHttp.status);
    };
    xmlHttp.send(JSON.stringify(propValue));
}



/**
 * This defines how the value should be transformed before sending it to the destination
 * @param {string} object - objectID (object/frame/node/block specifies the "street address" of this block)
 * @param {string} frame - frameID
 * @param {string} node - nodeID
 * @param {string} block - blockID
 * @param {number} index - the index of which input was just received. for example, a block with two inputs will have its render 
 function called twice - once with index 0 and once with index 1. it is up to the implemented to decide whether to trigger the 
 callback when either index is triggered, or only once all indices have received values, etc.
 * @param {{data: Array.<number>, processedData: Array:<number>, ...}} thisBlock - reference to the full block data struct
 * @param {function} callback - should be triggered with these arguments: (object, frame, node, block, index, thisBlock)
 */
exports.render = function (object, frame, node, block, index, thisBlock, callback) {

    var sampleSize = thisBlock.data[0].value; 
    console.log("START: " + sampleSize + " " + arrIndex);
    if (arrIndex > sampleSize) {
        arrIndex = 0; 
    }

    if (sampleSize != 0 && !isNaN(sampleSize) && !sampled) {
        fillArray(sampleSize, thisBlock.data[1].value);
        // console.log(thisBlock.data[1].value);
    }
    console.log("END");
    if (arrIndex == sampleSize && !sampled) {
        getFFT(fftArray, 50); // 50 is the default sample rate
        console.log("THE USER's ARRAY SIZE: " + thisBlock.data[0].value);
        console.log("THE USER's ACCELEROMETER: " + thisBlock.data[1].value);
        console.log("THE USER's filled ARRAY: " + fftArray);
        console.log("The Response:  " + JSON.stringify(fft_response));
        console.log("The Max Magnitude:  " + maxMag);
        console.log("The frequencies: " + fft_response.frequencies[maxMagIndex]);

        if (maxMag != 0) {
            for (var key in thisBlock.data[0]) {
                    thisBlock.processedData[0][key] = thisBlock.data[0][key];
                }

            httpPatch("magnitudes", fft_response.magnitude);
            httpPatch("frequencies", fft_response.frequencies);

            thisBlock.processedData[0].value = maxMag;
            arrIndex = 0;
            sampled = false;
            callback(object, frame, node, block, index, thisBlock);
        }
    }
};

/**
 * @todo: not working yet
 */
exports.setup = function (_object, _frame, _node, _block, _thisBlock, _callback) {
// add code here that should be executed once.
    // var publicData thisBlock.publicData;
    // callback(object, frame, node, block, index, thisBlock);
};

