var http = require('http'),
    sys = require("sys"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    events = require("events"),
    paperboy = require('paperboy'),
    request = require('request')
	

WEBROOT = "/Users/kristin/Projects/node_js/telebrain-master/public/lib/node-parlez-master";

console.log("ROUTE:" + WEBROOT);

http.createServer(function (req, res) {
    
var downloadfile = "http://translate.google.com/translate_tts?ie=UTF-8&tl=en&q=This%20is%20a%20serious%20test.&_=0.40490341070108116";
	console.log(downloadfile);

	var currentTime = new Date();
	var realname = currentTime.getTime() + ".mp3";

	request(downloadfile, function(error, response, buffer) {
		//console.log(error)
		//console.log(response)
	}).pipe(fs.createWriteStream("/Users/kristin/Projects/node_js/telebrain-master/public/lib/node-parlez-master/" + realname));


	res.setHeader("Content-Type", "text/html");
	res.write(realname);
	res.end();   

}).listen(8000);
console.log('Server Running');

