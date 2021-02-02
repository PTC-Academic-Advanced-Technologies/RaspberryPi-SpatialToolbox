var onshape = require('./onshape.js');

var getParts = function (documentId, wvm, wvmId, elementId, cb) {
  var opts = {
    d: documentId,
    e: elementId,
    resource: 'parts'
  };
  opts[wvm] = wvmId;
  onshape.get(opts, cb);
}

var getMassProperties = function (documentId, wvm, wvmId, elementId, cb) {
  var opts = {
    d: documentId,
    e: elementId,
    resource: 'partstudios',
    subresource: 'massproperties',
    query: {
      massAsGroup: false
    }
  }
  opts[wvm] = wvmId;
  onshape.get(opts, cb);
}

var createPartStudio = function (documentId, workspaceId, name, cb) {
  var opts = {
    d: documentId,
    w: workspaceId,
    resource: 'partstudios'
  }
  if (typeof name === 'string') {
    opts.body = {name: name};
  }
  onshape.post(opts, cb);
}

var deleteElement = function (documentId, workspaceId, elementId, cb) {
  var opts = {
    d: documentId,
    w: workspaceId,
    e: elementId,
    resource: 'elements',
  }
  onshape.delete(opts, cb);
}

var uploadBlobElement = function (documentId, workspaceId, file, mimeType, cb) {
  var opts = {
    d: documentId,
    w: workspaceId,
    resource: 'blobelements',
    file: file,
    mimeType: mimeType
  }
  onshape.upload(opts, cb);
}

var getDocuments = function(queryObject, cb) {
  var opts = {
    path: '/api/documents',
    query: queryObject
  }
  onshape.get(opts, cb);
}

var partStudioStl = function (documentId, workspaceId, elementId, queryObject, cb) {
  var opts = {
    d: documentId,
    w: workspaceId,
    e: elementId,
    query: queryObject,
    resource: 'partstudios',
    subresource: 'stl',
    headers: {
      'Accept': 'application/vnd.onshape.v1+octet-stream'
    }
  };
  onshape.get(opts, cb);
}

// Get configuration parameters
var getConfig = function(documentId, workspaceId, elementId, cb) {
  var opts = {
    d: documentId,
    w: workspaceId,
    e: elementId,
    resource: 'elements',
    subresource: 'configuration'
  }
  onshape.get(opts, cb);
}

// Post new configuration parameters
var postConfig = function(documentId, workspaceId, elementId, toChange, values, cb) {
  var opts = {
    d: documentId,
    w: workspaceId,
    e: elementId,
    resource: 'elements',
    subresource: 'configuration'
  }

  if (typeof(values) === "number" || typeof(values[0]) === "number") {
    try {
      getConfig(documentId, workspaceId, elementId, function(data) {
        var configData = JSON.parse(data.toString());
        let configParams = configData["configurationParameters"];
        for (var i = 0; i < configParams.length; i++) {
          if (toChange.includes(configParams[i]["message"]["parameterId"])) {
            currIndex = toChange.indexOf(configParams[i]["message"]["parameterId"]);
            configData["configurationParameters"][i]["message"]["rangeAndDefault"]["message"]["defaultValue"] = values[currIndex];
            configData["configurationParameters"][i]["message"]["rangeAndDefault"]["message"]["minValue"] = values[currIndex];
            configData["configurationParameters"][i]["message"]["rangeAndDefault"]["message"]["maxValue"] = values[currIndex];
          }
        }
        opts.body = configData;
        onshape.post(opts, cb);
      })
    }
    catch(e) {
      console.log("API call failed. Check document, workspace, and element IDs.");
    }
  }
}

// Get a list of features
var getFeatureList = function(documentId, workspaceId, elementId, cb) {
  var opts = {
    d: documentId,
    w: workspaceId,
    e: elementId,
    resource: 'partstudios',
    subresource: 'features'
  }
  onshape.get(opts, cb)
}

// Add a feature to the studio
var addFeature = function(documentId, workspaceId, elementId, feature, serialV, mv, cb) {
  var opts = {
    d: documentId,
    w: workspaceId,
    e: elementId,
    resource: 'partstudios',
    subresource: 'features',
    body: {
      feature: feature,
      serializationVersion: serialV,
      sourceMicroversion: mv,
      rejectMicroversionSkew: 'false'
    }
  }
  console.log(opts["body"]["feature"]["message"]["entities"][0]["message"])
  onshape.post(opts, cb)
}

// Update a feature in the studio
var updateFeature = function(documentId, workspaceId, elementId, feature, serialV, mv, cb) {
  var opts = {
    d: documentId,
    w: workspaceId,
    e: elementId,
    resource: 'partstudios',
    subresource: 'features/featureid/'.concat(feature["message"]["featureId"]),
    body: {
      feature: feature,
      serializationVersion: serialV,
      sourceMicroversion: mv,
      rejectMicroversionSkew: false
    }
  }
  onshape.post(opts, cb)
}

// Delete a feature in the studio
var deleteFeature = function(documentId, workspaceId, elementId, featureId, cb) {
  var opts = {
    d: documentId,
    w: workspaceId,
    e: elementId,
    resource: 'partstudios',
    subresource: 'features/featureid/'.concat(featureId)
  }
  onshape.delete(opts, cb)
}

// Get the assembly information
var assemblyDefinition = function(documentId, wvm, wvmId, elementId, cb) {
  var opts = {
    d: documentId,
    e: elementId,
    resource: 'assemblies'
  };
  opts[wvm] = wvmId;
  onshape.get(opts, cb);
}

// Transform an occurrence within an assembly
var transformOccurrence = function (documentId, workspaceId, elementId, transform, isRelative, occurrences, cb) {
  var opts = {
    d: documentId,
    e: elementId,
    w: workspaceId,
    resource: 'assemblies',
    subresource: 'occurrencetransforms',
    body: {
      occurrences: occurrences,
      transform: transform,
      isRelative: isRelative
    }
  };
  onshape.post(opts, cb)
}

// Add an assembly into another assembly (creating a subassembly)
var createAssemblyInstance = function(documentId, workspaceId, elementId, did, eid, mvid, cb){
  var opts = {
    d: documentId,
    e: elementId,
    w: workspaceId,
    resource: 'assemblies',
    subresource: 'instances',
    body: {
      documentId: did,
      elementId: eid,
      microversionId: mvid,
      isAssembly: true
    }
  };
  onshape.post(opts, cb)
}

// Delete an instance within the assembly
var deleteAssemblyInstance = function(documentId, workspaceId, elementId, nid, cb){
  var opts = {
    d: documentId,
    e: elementId,
    w: workspaceId,
    nid: nid,
    resource: 'assemblies',
    subresource: 'instance/nodeid/' + nid
  };
  onshape.delete(opts, cb)
}

module.exports = {
  getParts: getParts,
  getMassProperties: getMassProperties,
  createPartStudio: createPartStudio,
  deleteElement: deleteElement,
  uploadBlobElement: uploadBlobElement,
  getDocuments: getDocuments,
  partStudioStl: partStudioStl,
  getConfig: getConfig,
  postConfig: postConfig,
  getFeatureList: getFeatureList,
  addFeature: addFeature,
  updateFeature: updateFeature,
  deleteFeature: deleteFeature,
  assemblyDefinition: assemblyDefinition,
  transformOccurrence: transformOccurrence,
  createAssemblyInstance: createAssemblyInstance,
  deleteAssemblyInstance: deleteAssemblyInstance
}