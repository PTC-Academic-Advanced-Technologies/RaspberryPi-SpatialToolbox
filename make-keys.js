const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var url = "https://cad.onshape.com"
const path1 = '/home/pi/Desktop/RaspberryPi-SpatialToolbox/vuforia-spatial-edge-server/addons/vuforia-spatial-robotic-addon/interfaces/Spike-Drawing/apikey/Node/config/apikey.js'
const path2 = '/home/pi/Desktop/RaspberryPi-SpatialToolbox/vuforia-spatial-edge-server/addons/vuforia-spatial-robotic-addon/interfaces/Drawing/apikey/Node/config/apikey.js'

promptUser();

function promptUser() {
    rl.question("Are you using an enterprise account? (Y/N)\n", function(ent){
        if (ent.toLowerCase().includes('y')) {
            rl.question("What is the name of your enterprise? It comes before '.onshape.com' in the url.\n", function(enterprise){
                url = "https://" + enterprise + ".onshape.com"
                makeKeys(url)
            })
        }
        else {
            url = "https://cad.onshape.com"
            makeKeys(url)
        } 
    })
}

function makeKeys(url) {
    rl.question("What is your access key for Onshape?\n", function(aKey){
        rl.question("What is your secret key for Onshape?\n", function(sKey){
            rl.question("Double check you've entered the keys correctly.\
            \nWould you like to save these keys? (Y/N)\n", function(accept){
                if (accept.toLowerCase().includes('y')) {
                    writeAPI(url, aKey, sKey)
                    rl.close()
                }
                else {
                    promptUser()
                }
            })
        })
    })
}

function writeAPI(url, aKey, sKey) {
    var content = "var prod = {\n\t'baseUrl': '" + url + "',\n\t'accessKey': '" + aKey + "',\n\t'secretKey': '" + sKey + "',\n};\n\nmodule.exports = prod;";
    try {
        const data1 = fs.writeFileSync(path1, content)
        const data2 = fs.writeFileSync(path2, content)
    }
    catch(e){
        console.log(e)
    }
}

rl.on('close', function(){
    console.log("Thank you for entering your keys. They have been saved.\n");
    process.exit(0)
})
