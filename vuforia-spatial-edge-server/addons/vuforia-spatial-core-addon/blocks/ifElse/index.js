//Alina Shah
//If/Else Block

var generalProperties = {
    // display name underneath icon in block menu
    name: 'if/else',
    // set this to how wide the block should be - (the bigger of # inputs and # outputs)
    blockSize: 2,
    privateData: {},
    // these properties are accessible to user modification via the block's settings menu (gui/index.html)
    publicData: {toggle: false},
    // sets which input indices of the block can have links drawn to them
    activeInputs: [true, true, false, false],
    // sets which output indices of the block can have links drawn from them
    activeOutputs: [false, true, false, false],
    iconImage: 'icon.png',
    // not currently used anywhere, but helpful for developer reference
    nameInput: ['in', 'in', 'in', ''],
    nameOutput: ['digital out', 'digital out', 'out', ''],
    // should match the folder name
    type: 'ifElse'
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
exports.render = function (object, frame, node, block, index, thisBlock, callback)  {
    if (index === 0) {
        // if the first input receives a value of true, the toggle switches to true
        if (thisBlock.data[0].value === 1) {
            thisBlock.publicData.toggle = true;
            return callback(object, frame, node, block, index, thisBlock);
        }
        // if the first input receives a value of false, the toggle remains false
        else if (thisBlock.data[0].value === 0) {
            thisBlock.publicData.toggle = false;
            return callback(object, frame, node, block, index, thisBlock);
        }
    } else if (index === 1) {
        // if the second input receives data, and the toggle is flipped towards true, the block outputs the received input
        if (thisBlock.publicData.toggle === true) {
            thisBlock.processedData[1] = thisBlock.data[1];
        }
        if (thisBlock.publicData.toggle === false) {
            thisBlock.processedData[1].value = 0;
        }
        return callback(object, frame, node, block, index, thisBlock);
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
