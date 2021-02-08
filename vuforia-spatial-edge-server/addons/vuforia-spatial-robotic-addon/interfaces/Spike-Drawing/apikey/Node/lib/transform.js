var getTranslationMatrix = function(translation, verbose, cb){

    //Translate variables
    let tx = translation[0]
    let ty = translation[1]
    let tz = translation[2]
    //Vector for Rotation
    let rx = translation[3]
    let ry = translation[4]
    let rz = translation[5]
    //Angle for Rotation
    let w_deg = translation[6]
    if (w_deg == 0) {
        cb([1.0,  0.0,  0.0,  tx,
            0.0,  1.0,  0.0,  ty,
            0.0,  0.0,  1.0,  tz,
            0.0,  0.0,  0.0,  1.0])
    }

    //Unit Vector for Rotation
    let rotLen = Math.sqrt(Math.pow(rx, 2) + Math.pow(ry, 2) + Math.pow(rz, 2))
    let ux = rx / rotLen
    let uy = ry / rotLen
    let uz = rz / rotLen

    let w = w_deg * Math.PI/180;

    let sc = Math.sin(w/2) * Math.cos(w/2)
    let sq = Math.pow(Math.sin(w/2), 2)

    let M = [1.0 - 2.0 * (Math.pow(uy, 2) + Math.pow(uz, 2)) * sq,  //m11
         2.0 * (ux * uy * sq - uz * sc),                            //m21
         2.0 * (ux * uz * sq + uy * sc),                            //m31
         tx,                                                        //m41
         2.0 * (ux * uy * sq + uz * sc),                            //m12
         1.0 - 2.0 * (Math.pow(ux, 2) + Math.pow(uz, 2)) * sq,      //m22
         2.0 * (uy * uz * sq - ux * sc),                            //m32
         ty,                                                        //m42
         2.0 * (ux * uz * sq - uy * sc),                            //m13
         2.0 * (uy * uz * sq + ux * sc),                            //m23
         1.0 - 2.0 * (Math.pow(ux, 2) + Math.pow(uy, 2)) * sq,      //m33
         tz,                                                        //m43
         0.0,                                                       //m14
         0.0,                                                       //m24
         0.0,                                                       //m34
         1.0]                                                       //m44

    if (verbose) {
        console.log(M)
    }
    cb(M)
}

module.exports = {
    getTranslationMatrix: getTranslationMatrix
}