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
 * WEB-POST is a block that makes a POST request to the endpoint specified in its settings menu anytime data arrives
 * The request includes the block's current value in the body in the format: {blockData: thisBlock.processedData}
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



//change endpointUrl below/url in PutInfo to match your endpoint
//also change currentEndpointUrl in index.html file



var generalProperties = {
    // display name underneath icon in block menu
    name: 'thingworx',
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
    type: 'thingworx'
};

exports.properties = generalProperties;

function ThingWorxPUT(name, val) {
    let fetch = require('node-fetch')
    var propValue = {[name]: val};
    var mkey = "Input_your_thingworx_key"; 
    var murl = "Input_your_thingworx_url";


    murl = murl + name;
    fetch(murl,{
        method: 'PUT',
        headers:{'Content-Type':'application/json', 'Accept':'application/json','AppKey':mkey},
        body: JSON.stringify(propValue),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success');
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

var thingworx_upload = 0; 
async function ThingWorxGET(name) {
    let fetch = require('node-fetch')
    var mkey = "Input_your_thingworx_key"; 
    var murl = "Your_thingworx_url";

    murl = murl + name;
    await fetch(murl,{
        method: 'GET',
        headers:{'Content-Type':'application/json', 'Accept':'application/json','AppKey':mkey}
        // body: JSON.stringify(propValue),
    })
    .then(res => {
        return res.json();
    })
    .then(response => {
        thingworx_upload = response.rows[0][name];
        return response.rows[0][name];
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// async function getThingWorx(name) {
//     await ThingWorxGET(name);
// }
/**
 * This defines how the value should be transformed before sending it to the destination
 * @param {string} object - objectID (object/frame/node/block specifies the "street address" of this block)
 * @param {string} frame - frameID
 * @param {string} node - nodeID
 * @param {string} block - blockID
 * @param {number} index - the index of which input was just received. for example, a block with two inputs will have its render function called twice - once with index 0 and once with index 1. it is up to the implemented to decide whether to trigger the callback when either index is triggered, or only once all indices have received values, etc.
 * @param {{data: Array.<number>, processedData: Array:<number>, ...}} thisBlock - reference to the full block data struct
 * @param {function} callback - should be triggered with these arguments: (object, frame, node, block, index, thisBlock)
 */
var previous = 0;
var triggered = 0; 
exports.render = function (object, frame, node, block, index, thisBlock, callback) {

    // Variable name user wants to edit or receive 
    // var thingworx_property = thisBlock.data[0].value;
    // var thingworx_property = "Motor1"; 
    // Value user wants to send 
    // var send_value = thisBlock.data[1].value; 
    setInterval(function(){ 
        // triggered += 10; 
        if (previous != thisBlock.data[1].value) {
            // ThingWorxPUT(thisBlock.data[0].value, thisBlock.data[1].value); 
            ThingWorxPUT("Motor1", thisBlock.data[1].value); 
            previous = thisBlock.data[1].value;
            console.log("Uploaded Value: " + previous);
            callback(object, frame, node, block, index, thisBlock);
        }
        else {
            console.log("Same");
            callback(object, frame, node, block, index, thisBlock);
        }

        async function getThingWorx(name) {
            await ThingWorxGET(name);
            thisBlock.processedData[0].value = thingworx_upload;
            console.log("IN FUNCTION: " + thisBlock.processedData[0].value);
        }
        // getThingWorx(thisBlock.data[0].value);
        getThingWorx("Motor1");
        console.log("NOT IN FUNCTION: " + thisBlock.processedData[0].value);

        // thisBlock.processedData[0].value = thingworx_upload;

    }, 800);

    // console.log("POO");
    callback(object, frame, node, block, index, thisBlock);
    // var response = httpGet(thingworx_property); 
    // response = response.substring(response.lastIndexOf("<TD>")+4, response.lastIndexOf("</TD>"));

    // thisBlock.processedData[0].value = response;

    
};

/**
 * @todo: not working yet
 */
exports.setup = function (_object, _frame, _node, _block, _thisBlock, _callback) {
// add code here that should be executed once.
    // var publicData thisBlock.publicData;
    // callback(object, frame, node, block, index, thisBlock);
};

