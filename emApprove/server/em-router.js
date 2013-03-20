/* File : router.js
*  Description: The file has function which invokes the corresponding
*  request handler based on the pathname received
*/

/* define.js :- Include the definations file */
var define = require("./em-define");

/* For logging */
var logModule = require("./em-logModule");
var winston = logModule.getLogModule (); 


/* Description : The function receives the request initiated by the
*  client. Checks if the corresponding function is registered. It will
*  invoke the registered function, otherwise respond a HTTP error
*/
function route(handle, pathname, response, request) 
{
	winston.log("info", "About to route a request for " + pathname);
	//winston.log ("info", handle[pathname]) ;
	if (typeof handle[pathname] === 'function')
	{
		handle[pathname](response, request);
	}
	else
	{
		winston.log("error", "No request handler found for " + pathname);
		response.writeHead(404, {"Content-Type": "text/html"});
		response.write("404 Not found");
		response.end();
	}
}

/* Make the routines availble to others too */
exports.route = route;


