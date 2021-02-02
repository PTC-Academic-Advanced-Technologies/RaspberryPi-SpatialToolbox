//Alina Shah
//Or Block

var generalProperties = {
    // display name underneath icon in block menu
    name: 'or',
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
    nameInput: ['A', 'B', '', ''],
    nameOutput: ['result', '', '', ''],
    // should match the folder name
    type: 'or'
};

exports.properties = generalProperties;

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
exports.render = function (object, frame, node, block, index, thisBlock, callback) {

    for (var key in thisBlock.data[0]) {
        thisBlock.processedData[0][key] = thisBlock.data[0][key];
    }

    //if one or both of the values are greater than 0.5 then output is true, false if both inputs are less than 0.5
    if ((thisBlock.data[0].value >= 0.5) || (thisBlock.data[1].value >= 0.5)) {
        thisBlock.processedData[0].value = 1.0;
    } else {
        thisBlock.processedData[0].value = 0.0;
    }

    callback(object, frame, node, block, index, thisBlock);
};

/**
 * @todo: not working yet
 */
exports.setup = function (_object, _frame, _node, _block, _thisBlock, _callback) {
// add code here that should be executed once.
    // var publicData thisBlock.publicData;
    // callback(object, frame, node, block, index, thisBlock);
};
