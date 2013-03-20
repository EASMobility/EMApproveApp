
/* File : requesthandler.js
*  Description: This file handles the request recieved from the client
*/

/* define.js :- Include the definations file */
var define = require("./em-define");

/* processRequest.js :- Include the definations file */
var processRequest = require("./em-processRequest");

/* For logging */
var logModule = require("./em-logModule");
var winston = logModule.getLogModule (); 

/* Description : The function handles all types of requests
*  handling to the node server wrt to the ERP system. The
*  request can be getting the worklist items / expense report
*  HR requests / getting the details of the items in the 
*  respective requests type. The request received is of JSON type
*  The query response will be send as JSON
*/
function ea_erp(response, request)
{
	winston.log("debug", "Request handler 'ea_erp()' was called.");

	//  Handle only the POST request. Thats ONLY we expect
	if ( request.method === 'POST' )
	{
		// the body of the POST is JSON payload.
		var data = '';
		/* Lets accumulate full data */
		request.addListener('data', function(chunk)
		{
			data += chunk;
			winston.log ("silly", "Recvd chunk [" + chunk + "]") ;
		});

		/* Lets process the request after recieving complete data */
		request.addListener('end', function()
		{
			winston.log ("silly", "data recvd is [" + data + "]") ;
			try // Lets not believe blindly on client
			{
				// Parse the JSON contents, 
				var jsonrequest = JSON.parse(data);
				winston.log ("info", "Parse SUCCESS") ;
				
				//Phase 1 : Purchase Requisition and General User Requests 
				if (jsonrequest[define.AuthenticateUserReq])
				{ // Process Authentication Request
					winston.log ("debug", "Request for " + define.AuthenticateUserReq) ;
					processRequest.processAuthenticateReq (jsonrequest, response, request) ;
				}
				else if (jsonrequest[define.QueryWorklistPRReq])
				{ // Process Query Work list PR request
					winston.log ("debug", "Request for" + define.QueryWorklistPRReq) ;
					processRequest.processQueryPRWorklistReq (jsonrequest, response, request) ;
				}
				else if (jsonrequest[define.QueryHistoryItemsReq])
				{ // Process history items request
					winston.log ("debug", "Request for" + define.QueryHistoryItemsReq) ;
					processRequest.processQueryHistoryItemsReq (jsonrequest, response, request) ;
				}
				else if (jsonrequest[define.QueryPRDetailedInfoReq])
				{ // Process Query PR detailed info request
					winston.log ("debug", "Request for" + define.QueryPRDetailedInfoReq) ;
					processRequest.processQueryPRDetailedInfoReq (jsonrequest, response, request) ;
				}
				else if (jsonrequest[define.LogoutUserReq])
				{ // Process Logout Request 
					winston.log ("debug", "Request for" + define.LogoutUserReq) ;
					processRequest.processLogoutUserReq (jsonrequest, response, request) ;
				}
				else if (jsonrequest[define.WorkListDetailsReq])
				{ // Process WorkListDetails info request
					winston.log ("debug", "Request for" + define.WorkListDetailsReq) ;
					processRequest.processWorkListDetailsReq (jsonrequest, response, request) ;
				}
				else if (jsonrequest[define.PRApproveItemReq])
				{ // Process PR Approval request
					winston.log ("debug", "Request for" + define.PRApproveItemReq) ;
					processRequest.processPRApproveItemReq (jsonrequest, response, request) ;
				}	
				else if (jsonrequest[define.PRRejectItemReq])
				{ // Process PR reject info request
					winston.log ("debug", "Request for" + define.PRRejectItemReq) ;
					processRequest.processPRRejectItemReq(jsonrequest, response, request) ;
				}						
				//Phase 2 : Expense Report Requests 				
				else if (jsonrequest[define.QueryWorklistIEReq])
				{ // Process Query Work list IE request
					winston.log ("debug", "Request for" + define.QueryWorklistIEReq) ;
					processRequest.processQueryIEWorklistReq (jsonrequest, response, request) ;
				}
				else if (jsonrequest[define.QueryIEHistoryItemsReq])
				{ // Process IE history items request
					winston.log ("debug", "Request for" + define.QueryIEHistoryItemsReq) ;
					processRequest.processQueryIEHistoryItemsReq (jsonrequest, response, request) ;
				}
				else if (jsonrequest[define.QueryIEDetailedInfoReq])
				{ // Process Query IE detailed info request
					winston.log ("debug", "Request for" + define.QueryIEDetailedInfoReq) ;
					processRequest.processQueryIEDetailedInfoReq(jsonrequest, response, request) ;
				}
				else if (jsonrequest[define.RegisterAppReq])
				{ // Process Register App request for register application for receiving notification
					winston.log ("debug", "Request for" + define.RegisterAppReq) ;
					processRequest.processRegisterAppReq(jsonrequest, response, request) ;
				}
				else if (jsonrequest[define.UnRegisterAppReq])
				{ // Process Register App request for unregister application for receiving notification
					winston.log ("debug", "Request for" + define.UnRegisterAppReq) ;
					processRequest.processUnRegisterAppReq(jsonrequest, response, request) ;
				}
				//Journal Entry Requests 	
				else if (jsonrequest[define.QueryWorklistJEReq])
				{ // Process Query Work list JE request
					winston.log ("debug", "Request for" + define.QueryWorklistJEReq) ;
					processRequest.processQueryJEWorklistReq (jsonrequest, response, request) ;
				}				
				else
				{
					winston.log ("debug", " INVALID Request received  hence discarding") ;
				}
			}
			catch (e)
			{
				winston.log ("debug", "Unable to parse the content") ;
			}
		});
    }
	else // If its not the POST request, we should respond an ERROR
	{
		winston.log ("debug", "POST data Expected. Didnt recvd POST data hence rejecting") ;
		response.writeHead(200, define.ContentTypeJSONHeader);
		response.write(define.AuthenticationJSONError);
		response.end();
	}

}

/* Make the routines availble to others too */
exports.ea_erp = ea_erp;

