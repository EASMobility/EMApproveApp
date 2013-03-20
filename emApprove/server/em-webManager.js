
/* File : webManager.js
*  Description: This file defines the various HTTP handlers.
*/

/* define.js :- Include the definations file */
var define = require("./em-define");

/* For logging */
var logModule = require("./em-logModule");
var winston = logModule.getLogModule (); 


var https = require ("https") ;
var http = require ("http") ;

var hostname = define.SLIhostname ;
var portNo = define.SLportNo ;
var path = define.SLpath ;
var username = define.SLusername ;
var password = define.SLpassword ;

/* 	This function connects to the HTTP server, sends the request and gets the response 
*	It returns the data and data length (of the data recieved from the web service) and
*	sends it back to the client.
*	reqType = 1 -> Approve 2 -> Reject
*/
function processApprRejRequest (reqType, userdetails, notID, ApprovalComments, reqBuffer, callback)
{
	var querystr, url;
	var actionType ;
	var deviceID = userdetails.DUID ;
	var docType = "PR" ;

	getCurrentDateERPFormat (function (cTime)
	{
		if (reqType == 1) actionType = "APPROVE" ;
		else if (reqType == 2) actionType = "REJECT" ;

		if (!deviceID) deviceID = "UNKN-123" ;
	
		querystr = "P_RESPONDER_ID=" + userdetails.userID + "&P_ACTION_DATE=" + cTime + "&P_ACTION=" + actionType 
			+ "&P_DOCUMENT_TYPE=" + docType + "&P_NID=" + notID + "&P_DEVICE_ID=" + deviceID + "&P_NOTE=" + ApprovalComments + "&sn.content_type=text/tab-separated-values" ;
		winston.log ("debug", "username is " + userdetails.username) ;
		winston.log ("debug", "userid is " + userdetails.userID) ;
	
		url = "https://" + username + ":" + password + "@" + hostname +  path + "?" + querystr ;
		winston.log ("debug", "The final url is " + url) ;

		try 
		{
			https.get(url, function(res) 
			{
				winston.log("debug", "statusCode: ", res.statusCode);
				winston.log("debug", "headers: ", res.headers);

				res.on('data', function(d) 
				{
					process.stdout.write(d);
					var jsonrequest = JSON.parse(d);
					winston.log ("debug", "Parse SUCCESS") ;
					winston.log ("debug", "Request for json X_RET_CODE" + jsonrequest[0].X_RET_CODE) ;
					winston.log ("debug", "Request for json X_RET_MSG" + jsonrequest[0].X_RET_MSG) ;
					if (jsonrequest[0].X_RET_CODE == 'S')
					{
						winston.log ("debug", "Success status from Snap Logic...\n") ;
						//callback (0, "SUCCESS") ; // For always success and send request after sending response
					}
					else
					{
						winston.log ("debug", "Error status from Snap Logic...\n") ;
						//callback (1, "ERROR") ; // For always success and send request after sending response
					}
				});

			}).on('error', function(e) 
			{
				winston.error("debug", e);
				//callback (1, "ERROR") ; // For always success and send request after sending response
			});
			callback (0, "SUCCESS") ; // For always success and send request after sending response
		}
		catch (e)
		{	// Error
			winston.log ("debug", "Unable to get the response from the Snap Logic server ...\n") ;
			//callback (1, "ERROR") ; // For always success and send request after sending response
			callback (0, "SUCCESS") ; // For always success and send request after sending response
		}
	}) ;
}

/* 	This function connects to the HTTP server, sends the request and gets the response 
*	It returns the data and data length (of the data recieved from the web service) and
*	sends it back to the client.
*	reqType = 1 -> Approve 2 -> Reject
*/
function processApprRejRequestjavaERPInt (reqType, docType, userdetails, notID, ApprovalComments, reqBuffer, callback)
{
    var actionType, deviceID, responderid ; //, docType  = "PR" ;

	if (userdetails)
	{
		deviceID = userdetails.DUID ;
		responderid = userdetails.userID ;
	}
	
    getCurrentDateERPFormat (function (cTime)
    {
        if (reqType == 1) actionType = "APPROVE" ;
        else if (reqType == 2) actionType = "REJECT" ;

        if (!deviceID) deviceID = "UNKN-123" ;

		//Approve request packet
		var req = new Object () ;
		req.ApproveRejectReq = Object () ;
		req.ApproveRejectReq.TID = Math.floor(Math.random()*9000) + 1000 ;
		req.ApproveRejectReq.RESPONDERID = responderid ;
		req.ApproveRejectReq.ACTIONDATE = cTime;
		req.ApproveRejectReq.ACTION = actionType;
		req.ApproveRejectReq.DOCUMENTTYPE = docType ;
		req.ApproveRejectReq.NID = notID ;
		req.ApproveRejectReq.DEVICEID = deviceID ;
		req.ApproveRejectReq.NOTE = ApprovalComments ;
		req.ApproveRejectReq.FWDTOUSER = "" ;
		JSONdata = JSON.stringify(req);
		winston.log ("debug", "JSON data to send is [" + JSONdata + "]\n") ;

        try
        {
			var options = {
				host: define.javaERPIntHost,
				port: define.javaERPIntPort,
				path: define.javaERPIntPath,
				//auth: 'shepard:eatest77',
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Content-Length': Buffer.byteLength(JSONdata),
				}			
			};
				
			//Creating the request with the Server by posting the host, post method, function to be called and port no.
			var reqClient = http.request(options, function(res)	
			{
				var str = '';
				res.on('data', function (chunk) {
					str += chunk;
				});
				res.on('end', function () {
					winston.log("debug", res.statusCode + "\n");
					winston.log("debug", res.headers);
						winston.log("debug", "str is ... [" + str + "]\n");
					try
					{
						var jsonrequest = JSON.parse(str);
						if (jsonrequest["ApproveRejectRes"])
						{
							winston.log  ("debug", "ApproveRejectRes response recieved...\n") ;
							if (jsonrequest["ApproveRejectRes"].Status.Code == "200")
							{
								winston.log ("debug", "Succesfully processed the Approve / Reject request...\n") ;
							}
							else
							{
								winston.log ("debug", "Error while processing the Approve / Reject request...\n") ;
								winston.log ("debug", "Error is ... [" + jsonrequest["ApproveRejectRes"].Status.Description + "]...\n") ;
							}
						}
						else
						{
							winston.log ("debug", "ApproveRejectRes not recvd..\n") ;
						}
					}
					catch (e)
					{
						winston.log ("debug", "Error while processing the Approve / Reject request...\n") ;
						// winston.log ("debug", "Error is ... [" + jsonrequest["ApproveRejectRes"].Status.Description + "]...\n") ;
					}
				});
			}).on('error', function(e)
            {
                winston.error("debug", e);
            });

            callback (0, "SUCCESS") ; // For always success and send request after sending response

			//Posts the data to the Server
			reqClient.write(JSONdata);
			reqClient.end();
		}
        catch (e)
        {   // Error
            winston.log ("debug", "Unable to get the response from the java ERP interface server ...\n") ;
            //callback (1, "ERROR") ; // For always success and send request after sending response
            callback (0, "SUCCESS") ; // For always success and send request after sending response
        }
    }) ;
}		

//YYYY-MM-DD HH:MM:SS
function getCurrentDateERPFormat (callback)
{
	var myDate = new Date () ;
	var month = myDate.getMonth() + 1;
	oMonth = (month < 10 ? '0' + month : month) ;
	var cDate = myDate.getDate();
	oDate = (cDate < 10 ? '0' + cDate : cDate) ;
	var hrs = myDate.getHours();
	oHrs = (hrs < 10 ? '0' + hrs : hrs) ;
	var min = myDate.getMinutes();
	oMin = (min < 10 ? '0' + min : min) ;
	var sec = myDate.getSeconds();
	oSec = (sec < 10 ? '0' + sec : sec) ;
	//var outdate = myDate.getFullYear() + "-" + oMonth + "-" + oDate + "%20" + oHrs + "%3A" + oMin + "%3A" + oSec ;
	var outdate = myDate.getFullYear() + "-" + oMonth + "-" + oDate + " " + oHrs + ":" + oMin + ":" + oSec ;

	callback (outdate) ;
}


/* Make the routines availble to others too */
exports.processApprRejRequest = processApprRejRequest;
exports.processApprRejRequestjavaERPInt = processApprRejRequestjavaERPInt ;


