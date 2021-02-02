
// const fetch = require("node-fetch");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest; // Need this to use XMLHttpRequest since this is a nodejs file
// Process the arr of FFT data sampled at fs times per second by posting it to our heroku server
// function processFFT(arr, fs) {
//     maxMag = 0
//     // var rando = [0, 1, 0, 1, 0, 1];
//     // arr = rando; 
//     arr = Object.values(arr.map(s => Number(s)))
  
//     const headers = {
//         "Content-Type": "application/json",
//         "Accept": "application/json"
//     }
//     const body = JSON.stringify({
//         "amplitude": arr, 
//         "sampling_rate": fs,
//         "percentage": 0.5
//     })
// 	try {
// 	  	fetch("https://ptc-fft-server.herokuapp.com/fft/raw_fft", {headers, method: "POST", body})
//         	.then(res => res.json())
//         	.then(res => {
//         	    console.log(res.magnitude)
//         	    console.log(res.frequencies)
//         	    for (var i = 0; i < res.magnitude.length; i++) {
//         	        if (res.magnitude[i] > maxMag) {
//         	            maxMag = res.magnitude[i]
//         	            maxMagIndex = i
//         	        }
//         	    }
//         	    console.log(res);
//         	    return res;
//         	})
//         	.catch(res => { 
//         		console.log("error " + res)
//         })

// 	} catch (error) {
// 		return error;
// 	}
// }

// xml request to do a patch, which is updating the given variable with a given value on airtable
// function herokurequest(arr, fs){
// 	arr = [0, 10, 1, 0];
//     var xmlHttp = new XMLHttpRequest();
//     var url = "http://ptc-fft-server.herokuapp.com/fft/raw_fft";
//     // this is the format for a propvalue to update airtable
//     var body = JSON.stringify({
//         "amplitude": arr, 
//         "sampling_rate": fs,
//         "percentage": 0.5
//     })
//     xmlHttp.open("POST", url, false);
//     xmlHttp.setRequestHeader("Content-Type","application/json");
//     xmlHttp.setRequestHeader("Accept","application/json");

// 	try {    
// 	    xmlHttp.onreadystatechange = function() {
// 		    if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
// 		        // console.log(xmlHttp.responseText);
// 		        response = "HERE!!!!";
// 		        return JSON.parse(xmlHttp.responseText);
		        
// 		        // console.log(response.magnitude);
// 		        // console.log(response.frequencies); 
// 				// console.log(xmlHttp.responseText.frequencies)
// 		    }
// 		    else{
// 		    	// console.log(xmlHttp.status);
// 		    	response = "FAILED"
// 		    	return "HERE!!!!"
// 			}
// 		};
// 	    xmlHttp.send(body);
// 	    return xmlHttp.status;
// 	}
// 	catch(error) {
// 		return error;
// 	}
// }


// var fft_response;
// var fftArray = [];
// var arrIndex;
// var maxMag = 0;
// var maxMagIndex = 0;
// var sampled = false;
// // xml request to do a patch, which is updating the given variable with a given value on airtable
// function processFFT(arr, fs) {
//     arr = Object.values(arr.map(s => Number(s)))
//     const headers = {
//         "Content-Type": "application/json",
//         "Accept": "application/json"
//     }
//     const body = JSON.stringify({
//         "amplitude": arr, 
//         "sampling_rate": fs,
//         "percentage": 0.1
//     })
//     try {
//         return fetch("https://ptc-fft-server.herokuapp.com/fft/simple_fft", {headers, method: "POST", body})
//             .then(res => res.json())
//             .then(res => {
//                 // console.log(res.magnitude)
//                 // console.log(res.frequencies)
//                 for (var i = 0; i < res.magnitude.length; i++) {
//                     if (res.magnitude[i] > maxMag) {
//                         maxMag = res.magnitude[i]
//                         maxMagIndex = i;
//                     }
//                 }
//                 // console.log(res);
//                 fft_response = res;
//                 return res;
//             })
//             .catch(res => { 
//                 console.log("error " + res)
//         })

//     } catch (error) {
//         return error;
//     }
// }

// async function getFFT(arr, fs) {
//     return await processFFT(arr, fs);
// }

// function fillArray(size, samplePoint) {
//     if (arrIndex == size) {
//         return;
//     } 
//     else if (fftArray.length == 0) {
//         arrIndex = 0;
//         fftArray = new Array(size);
//         fftArray[arrIndex] = samplePoint;
//         arrIndex = arrIndex + 1;
//         return;
//     }
//     else if (samplePoint != fftArray[arrIndex-1]) {
//         fftArray[arrIndex] = samplePoint;
//         arrIndex = arrIndex + 1;
//         return;
//     }
//     return;
// }


// rando = [3, 5, 0, 23, 4, 2, 1, 21];

// for (i = 0; i < rando.length; i++) {
//     fillArray(rando.length, rando[i]);
// }

// getFFT(fftArray, 50); 

// processFFT(rando, 50).then(response => console.log(response));
// console.log("The Response:  " + processFFT(rando, 50));

// var TESTING1; 
// TESTING1 = herokurequest(rando, 2);
// console.log(TESTING1)

// rando = [0, 0, 1];
// processFFT(rando, 2);








// xml request to do a patch, which is updating the given variable with a given value on airtable
function herokurequest(arr, fs){
    var xmlHttp = new XMLHttpRequest();
    var url = "http://ptc-fft-server.herokuapp.com/fft/simple_fft";
    // this is the format for a propvalue to update airtable
    var body = JSON.stringify({
        "amplitude": arr, 
        "sampling_rate": fs,
        "percentage": 0.1
    })
    xmlHttp.open('POST', url, false);
    xmlHttp.setRequestHeader('Content-Type','application/json');
    xmlHttp.setRequestHeader('Accept','application/json');

    // try {    
        xmlHttp.onreadystatechange = function() {
            if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                return JSON.parse(xmlHttp.responseText);
            }
            else{
                console.log(xmlHttp.status);
                response = "FAILED"
                return "HERE!!!!"
            }
        };
        xmlHttp.send(body);
        return xmlHttp.responseText;
    // }
    // catch(error) {
        // return error;
    // }
}




rando = [7,9,7,6,7,9,7,8,9,7,8,9,-32,-77,-53,-363,-298,281,522,435,401,482,674,723,695,511,178,-70,-211,-156,-135,93,297,60,109,77,197,58,-36,-152,-207,-257,-89,-1,33,25,81,96,158,113,75,103,90,140,231,311,340,466,455,725,565,782,534,481,193,185,-44,-29,-160,-168,-13,103,275,407,492,605,475,315,266,-29,-184,-193,211,292,386,422,515,394,356,214,35,9,2,130,355,482,595,590,489,397,372,355,187,68,32,47,117,201,338,501,463,411,451,385,161,-59,-20,-62,84,267,297,487,499,501,480,343,308,227];
const SOLUTION = herokurequest(rando, 50); 
// console.log(rando.length);
// var testing; 
// testing = herokurequest(rando, 50);
console.log(SOLUTION);



