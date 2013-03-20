
/* File : server.js
*  Description: This file defines the function to start 
*  the HTTP server which will listen to the defined port
*/

/* define.js :- Include the definations file */
var define = require("./em-define");

/* http and url modules are required */
var http = require("http");
var url = require("url");
//var express = require("express");

/* For logging */
var logModule = require("./em-logModule");
var winston = logModule.getLogModule (); 


/* Description : The function starts listening on the PORT defined
*  It will accept the HTTP requests. Parse the URL and pass the 
*  pathname information for further routing
*/
function start(route, handle) 
{
	if (!(route && handle))
	{
		winston.log ("error", "ERROR :: Invalid parameters received in start (). Unable to start the server \n") ;
	}
	
	function onRequest(request, response)
	{
		var pathname = url.parse(request.url).pathname;
		winston.log("info", "Request for " + pathname + " received.");
		request.setEncoding("utf8");

		route(handle, pathname, response, request);
	}

	http.createServer(onRequest).listen(define.PortNo);
	winston.log("debug", "Server has started. Listening at port = ["+define.PortNo+"]");
}

/* start funciton can be envoked from other files too */
exports.start = start;


