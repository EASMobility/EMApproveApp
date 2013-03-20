
/* File : processRequest.js
*  Description: This file process the requests recieved from the client
*/

/* define.js :- Include the definations file */
var define = require("./em-define");

/* http include
var http = require("http");*/

/* dbEAERPOracleModule.js :- Include the oracle EA-ERP module */
if (define.oracleDbSupport)
var dbEAERPOracleModule = require("./em-dbEAERPOracleModule");

/* dbRedisModule.js :- Include the Local Db Redis module */
var dbRedisModule = require("./em-dbRedisModule");

/* responseHandler.js :- Include the response Handler file */
var responseHandler = require("./em-responseHandler");

/* sessionManager.js :- Include the session manager file */
var sessionManager = require("./em-sessionManager");

/* webManager.js :- Include the web manager file */
var webManager = require("./em-webManager");

/* ldapManager.js :- Include the ldap manager file */
if (define.ldapSupport)
var ldapManager = require("./em-ldapManager");

/* For logging */
var logModule = require("./em-logModule");
var winston = logModule.getLogModule (); 


/* Description : The function gets the authenticate user request
*  from the client. It will call the LDAP module to process
*  the authentication request. And respond with the authentication 
*  response back to the client.
*/
function processAuthenticateReq (jsonrequest, response, request)
{
	winston.log ("info", "In the function processAuthenticateReq") ;

	// Check if token is there. 
	if (jsonrequest[define.AuthenticateUserReq].SessionTokenId)
	{
		winston.log ("debug", "Session token id is ::" + jsonrequest[define.AuthenticateUserReq].SessionTokenId) ;
		// Get the details of the token from the session manager 
		sessionManager.validateSessionID (jsonrequest[define.AuthenticateUserReq].SessionTokenId, function (status, userDetails)
		{
			if (status == define.REQ_SUCCESS)	// If the session is valid 
			{
				winston.log ("debug", "Session re-establishment SUCCESS\n") ;
				winston.log ("debug", "User name fetched is " + userDetails.username) ;
				//winston.log ("Password fetched is " + userDetails.password) ;
				winston.log ("debug", "User id fetched is " + userDetails.userID) ;
				winston.log ("debug", "session Token id is " + userDetails.sessionTokenId) ;
				
				// Send success response back to the client
				responseHandler.getAuthenticationResponse (jsonrequest[define.AuthenticateUserReq].Tid, define.REQ_SUCCESS, "SUCCESS", 
					jsonrequest[define.AuthenticateUserReq].SessionTokenId, userDetails.userID, function (AuthenticationResponse)
				{
					// We should respond it back to the client
						var jsonRespText = JSON.stringify(AuthenticationResponse);
						response.statusCode = 200;
						var resLen = Buffer.byteLength(jsonRespText) ;
						response.setHeader("Access-Control-Allow-Origin", "*");
						response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
						response.setHeader("Content-Type", "application/json");
						response.setHeader("Content-Length", resLen) ;
						//response.write(define.AuthenticationJSONSuccess);
						response.write(jsonRespText);
						winston.log  ("info", "Response back to client.." + jsonRespText) ;
						response.end() ;
						logModule.putCLFRecord ("-", "POST /ea-erp HTTP/1.1", response.statusCode, resLen, "-", "-", define.AuthenticateUserReq, userDetails.DNAME, userDetails.DPLATFORM, userDetails.DUID, userDetails.DVERSION, userDetails.GIVENNAME, userDetails.SECONDNAME, userDetails.userID, userDetails.TITLE)
				}) ;
			}
			else	// Else send an eror
			{
				responseHandler.getAuthenticationResponse (jsonrequest[define.AuthenticateUserReq].Tid, define.UNAUTHORISED_STATUS, "Invalid Session Token", 
					"", "", function (AuthenticationResponse)
				{
					// We should respond it back to the client
						var jsonRespText = JSON.stringify(AuthenticationResponse);
						response.statusCode = 200;
						var resLen = Buffer.byteLength(jsonRespText) ;
						response.setHeader("Access-Control-Allow-Origin", "*");
						response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
						response.setHeader("Content-Type", "application/json");
						response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));
						//response.write(define.AuthenticationJSONSuccess);
						response.write(jsonRespText);
						winston.log  ("info", "Response back to client.." + jsonRespText) ;
						response.end() ;
						logModule.putCLFRecord ("-", "POST /ea-erp HTTP/1.1", response.statusCode, resLen, "-", "-", define.AuthenticateUserReq, userDetails.DNAME, userDetails.DPLATFORM, userDetails.DUID, userDetails.DVERSION, userDetails.GIVENNAME, userDetails.SECONDNAME, userDetails.userID, userDetails.TITLE)
				}) ;			
			}
		}) ;
	}
	else // if the token is not there
	{
		winston.log ("debug", "No session token received\n") ;
		// Call the LDAP module for authentication and get the user details for active directory
		var userDetails = new Object () ;
		userDetails.username = jsonrequest[define.AuthenticateUserReq].username ;
		userDetails.password = jsonrequest[define.AuthenticateUserReq].password ;
		winston.log ("debug", "username is " + userDetails.username) ;
		//winston.log ("password is " + userDetails.password) ;

		var deviceInfo = new Object () ;
		if (jsonrequest[define.AuthenticateUserReq].DeviceInfo)
		{
			deviceInfo.DeviceName = jsonrequest[define.AuthenticateUserReq].DeviceInfo.DeviceName ;
			deviceInfo.DeviceVersion = jsonrequest[define.AuthenticateUserReq].DeviceInfo.DeviceVersion ;
			deviceInfo.UniqueDeviceID = jsonrequest[define.AuthenticateUserReq].DeviceInfo.UniqueDeviceID ;
			deviceInfo.Platform = jsonrequest[define.AuthenticateUserReq].DeviceInfo.Platform ;
			deviceInfo.RegistrationId = jsonrequest[define.AuthenticateUserReq].DeviceInfo.RegistrationId ;
			winston.log ("debug", "Device Name is " + deviceInfo.DeviceName) ;
			winston.log ("debug", "Device Version is " + deviceInfo.DeviceVersion) ;
			winston.log ("debug", "Unique Device ID is " + deviceInfo.UniqueDeviceID) ;
			winston.log ("debug", "Platform is " + deviceInfo.Platform) ;
			winston.log ("debug", "RegistrationId is " + deviceInfo.RegistrationId) ;
		}
		
		if (!define.ldapSupport)
		{
			var userLdapDetails = new Object () ;
			userDetails.userID = jsonrequest[define.AuthenticateUserReq].username ;
			winston.log ("debug", "userid is " + userDetails.userID) ;
			storeUserDetails (response, userDetails, deviceInfo, userLdapDetails, jsonrequest, function ()	{}) ;
		}
		else
		{
			//ldapManager.LDAPAuthenticateUser (userDetails.username, userDetails.password, define.ldapBase, function (err, result)
			winston.log ("info", "Going for authentication ...\n") ;
			// Check and get the user id from the session
			sessionManager.checkGetUserId (userDetails, deviceInfo, function (err, result)
			{
				winston.log ("debug", "user details fetched is ... " + userDetails.userID) ;
				ldapManager.LDAPAuthenticateUser (userDetails.username, userDetails.password, userDetails.userID, function (err, userLdapDetails)
				{
					winston.log ("debug", "Authentication completed...\n") ;
					if (err)
					{
						winston.log ("debug", "Authentication failed.... \n") ;
						responseHandler.getAuthenticationResponse (jsonrequest[define.AuthenticateUserReq].Tid, define.INVALID_CREDENTIALS, "Invalid Username / Password", "", "", function (AuthenticationResponse)
						{
						// We should respond it back to the client
							var jsonRespText = JSON.stringify(AuthenticationResponse);
							response.statusCode = 200;
							var resLen = Buffer.byteLength(jsonRespText) ;
							response.setHeader("Access-Control-Allow-Origin", "*");
							response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
							response.setHeader("Content-Type", "application/json");
							response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));
							//response.write(define.AuthenticationJSONSuccess);
							response.write(jsonRespText);
							winston.log  ("info", "Response back to client.." + jsonRespText) ;
							response.end() ;
							logModule.putCLFRecord ("-", "POST /ea-erp HTTP/1.1", response.statusCode, resLen, "-", "-", define.AuthenticateUserReq, deviceInfo.DeviceName, deviceInfo.Platform, deviceInfo.UniqueDeviceID, deviceInfo.DeviceVersion, userLdapDetails.givenName, userLdapDetails.sn, userLdapDetails.employeeNumber, userLdapDetails.title)
						}) ;			
					}
					else
					{
						userDetails.userID = userLdapDetails.employeeNumber ;
						winston.log ("debug", "userid is " + userDetails.userID) ;
						// Store the information in the session manager and get the token
						storeUserDetails (response, userDetails, deviceInfo, userLdapDetails, jsonrequest, function ()	{});
					}
				}) ;
			});
		}
	}

	return ;
}

function storeUserDetails (response, userDetails, deviceInfo, userLdapDetails, jsonrequest, callback)
{
	sessionManager.storeUserDetailsGetSessionToken (userDetails, deviceInfo, userLdapDetails, function (status, sessionToken)
	{
		if (status == define.REQ_SUCCESS)
		{			
			// send the token back to the client for further use
			responseHandler.getAuthenticationResponse (jsonrequest[define.AuthenticateUserReq].Tid, define.REQ_SUCCESS, "SUCCESS", 
				sessionToken, userDetails.userID , function (AuthenticationResponse)
			{
				// We should respond it back to the client
					var jsonRespText = JSON.stringify(AuthenticationResponse);
					response.statusCode = 200;
					var resLen = Buffer.byteLength(jsonRespText) ;
					response.setHeader("Access-Control-Allow-Origin", "*");
					response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
					response.setHeader("Content-Type", "application/json");
					response.setHeader("Content-Length", resLen);
					//response.write(define.AuthenticationJSONSuccess);
					response.write(jsonRespText);
					winston.log  ("info", "Response back to client.." + jsonRespText) ;
					response.end() ;
					callback () ;
					logModule.putCLFRecord ("-", "POST /ea-erp HTTP/1.1", response.statusCode, resLen, "-", "-", define.AuthenticateUserReq, deviceInfo.DeviceName, deviceInfo.Platform, deviceInfo.UniqueDeviceID, deviceInfo.DeviceVersion, userLdapDetails.givenName, userLdapDetails.sn, userLdapDetails.employeeNumber, userLdapDetails.title)
			}) ;
		}
		else
		{
			responseHandler.getAuthenticationResponse (jsonrequest[define.AuthenticateUserReq].Tid, define.UNAUTHORISED_STATUS, "Invalid Session Token", 
				"", "", function (AuthenticationResponse)
			{
				// We should respond it back to the client
					var jsonRespText = JSON.stringify(AuthenticationResponse);
					response.statusCode = 200;
					var resLen = Buffer.byteLength(jsonRespText) ;
					response.setHeader("Access-Control-Allow-Origin", "*");
					response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
					response.setHeader("Content-Type", "application/json");
					response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));
					//response.write(define.AuthenticationJSONSuccess);
					response.write(jsonRespText);
					response.end() ;
					winston.log  ("info", "Response back to client.." + jsonRespText) ;
					callback () ;
					logModule.putCLFRecord ("-", "POST /ea-erp HTTP/1.1", response.statusCode, resLen, "-", "-", define.AuthenticateUserReq, deviceInfo.DeviceName, deviceInfo.Platform, deviceInfo.UniqueDeviceID, deviceInfo.DeviceVersion, userLdapDetails.givenName, userLdapDetails.sn, userLdapDetails.employeeNumber, userLdapDetails.title)
			}) ;			
		}
	}) ;
}
/* Description : The function validates the session. If
*  the session is valid then it will fill in the user details
*  which will be utilised further. This module will call
*  LDAP module to fetch the details.
*/
function validateSession (SessionTokenId, callback)
{
	reqStatus = define.FAILURE ; // Lets set is failed by default
	
	winston.log ("info", "Request to validate session id received. Session id :: " + SessionTokenId) ;
	sessionManager.validateSessionID (SessionTokenId, function (status, userDetails)
	{
		if (status == define.REQ_SUCCESS)	// If the session is valid 
		{
			winston.log ("info", "Session already exists\n") ;
			winston.log ("debug", "User name fetched is " + userDetails.username) ;
			//winston.log ("Password fetched is " + userDetails.password) ;
			winston.log ("debug", "User id fetched is " + userDetails.userID) ;
			winston.log ("debug", "session Token id is " + userDetails.sessionTokenId) ;
		}
		callback (status, userDetails) ;
	}) ;
}


/* Description : The function gets the query PR Work list
*  item request from the client. It will call the db module
*  to further fetch the data from the ERP system. After
*  fetching the data it sends the JSON response back to
*  the client.
*/

function processQueryPRWorklistReq (jsonrequest, response, request)
{
	winston.log ("info", "In the function processQueryPRWorklistReq") ;
	// Validate the session first and get the user details before processing further

	validateSession (jsonrequest[define.QueryWorklistPRReq].SessionTokenId, function (reqStatus, userDetails)
	{
		winston.log ("debug", "req status is " + reqStatus) ;
		winston.log ("debug", "username is " + userDetails.username) ;
		//winston.log ("debug", "password is " + userDetails.password) ;
		winston.log ("debug", "userid is " + userDetails.userID) ;
		if (reqStatus == define.REQ_SUCCESS)
		{
			winston.log ("debug", "Session Validation SUCCESS") ;
			// We should process the PR Work list items
			// We should fetch the entries from the ERP database for this user (with userID)
			dbRedisModule.ViewWorklistPRRedis(userDetails.userID, null, function (status, PRWorkListItems)
			{
				/*winston.log ("Start Displaying the items ... ") ;
				displayLocalDbWorklistItems (PRWorkListItems) ;
				winston.log ("END Displaying the items ... ") ;*/
				if (status)
				{
					winston.log ("debug", "Tid is :" + jsonrequest[define.QueryWorklistPRReq].Tid) ;
					winston.log ("info", "Fetched the data from the ERP system") ;
					// We should send the response back to the client and then sychronise the Redis database
					responseHandler.getPRWorkListItemResponse (jsonrequest[define.QueryWorklistPRReq].Tid, define.REQ_SUCCESS_TEXT, "SUCCESS", PRWorkListItems, function (PRWorkListItemsResponse)
					{
						// We should respond it back to the client
							var jsonRespText = JSON.stringify(PRWorkListItemsResponse);
							response.statusCode = 200;
							response.setHeader("Access-Control-Allow-Origin", "*");
							response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
							response.setHeader("Content-Type", "application/json");
							response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));
							response.write(jsonRespText);
							winston.log ("debug", jsonRespText) ;
							winston.log ("info", "Successfully Processed QueryWorklistPRReq") ; 
							response.end() ;
					});
				}
				
			})
		}
		else
		{ // Corresponding error should be sent back to the client
			winston.log ("debug", "Error while validating the session") ;
			responseHandler.getPRWorkListItemResponse (jsonrequest[define.QueryWorklistPRReq].Tid, define.REQ_UNAUTHORISED_TEXT, "Invalid Session Token", "", function (PRWorkListItemsResponse)
			{
				// We should respond it back to the client
					var jsonRespText = JSON.stringify(PRWorkListItemsResponse);
					response.statusCode = 200;
					response.setHeader("Access-Control-Allow-Origin", "*");
					response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
					response.setHeader("Content-Type", "application/json");
					response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));
					//response.write(define.AuthenticationJSONSuccess);
					response.write(jsonRespText);
					winston.log  ("info", "Response back to client.." + jsonRespText) ;
					response.end() ;
			});
			
		}
	});

	return ;
}

function processQueryPRDetailedInfoReq (jsonrequest, response, request)
{
	winston.log ("info", "In the function processQueryPRDetailedInfoReq") ;

	// Validate the session first and get the user details before processing further
	
	validateSession (jsonrequest[define.QueryPRDetailedInfoReq].SessionTokenId, function (reqStatus, userDetails)
	{
		winston.log ("debug", "req status is " + reqStatus) ;
		winston.log ("debug", "username is " + userDetails.username) ;
		//winston.log ("debug", "password is " + userDetails.password) ;
		winston.log ("debug", "userid is " + userDetails.userID) ;
		winston.log("debug", "Requistion Header ID " + jsonrequest[define.QueryPRDetailedInfoReq].REQUISITIONHEADERID);
		if (reqStatus == define.REQ_SUCCESS)
		{
			winston.log ("debug", "Session Validation SUCCESS") ;
			// We should process the PRDetailedInfoReq
			// We should fetch the entries from the ERP database for this user (with userid)
			dbRedisModule.ViewPRDetailedInfoReq(jsonrequest[define.QueryPRDetailedInfoReq].REQUISITIONHEADERID, null, function (status, PRDetailedInfoItems)
			{
				if (status)
				{
					winston.log ("debug", "Tid is :" + jsonrequest[define.QueryPRDetailedInfoReq].Tid) ;
					winston.log ("info", "Fetched the data from the ERP system") ;
					// We should send the response back to the client and then sychronise the Redis database
					responseHandler.getPRDetailedInfoResponse (jsonrequest[define.QueryPRDetailedInfoReq].Tid, define.REQ_SUCCESS_TEXT, "SUCCESS", PRDetailedInfoItems, function (PRDetailedInfoResponse)
					{
						// We should respond it back to the client
							var jsonRespText = JSON.stringify(PRDetailedInfoResponse);
							response.statusCode = 200;
							response.setHeader("Access-Control-Allow-Origin", "*");
							response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
							response.setHeader("Content-Type", "application/json");
							response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));
							//response.write(define.AuthenticationJSONSuccess);
							response.write(jsonRespText);
							winston.log  ("info", "Response back to client.." + jsonRespText) ;
							response.end() ;
					})
				}
			})
		}
		else
		{ // Corresponding error should be sent back to the client
			winston.log ("debug", "Error while validating the session") ;
			responseHandler.getPRDetailedInfoResponse (jsonrequest[define.QueryPRDetailedInfoReq].Tid, define.REQ_UNAUTHORISED_TEXT, "Invalid Session Token", "", function (PRDetailedInfoResponse)
			{
				// We should respond it back to the client
					var jsonRespText = JSON.stringify(PRDetailedInfoResponse);
					response.statusCode = 200;
					response.setHeader("Access-Control-Allow-Origin", "*");
					response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
					response.setHeader("Content-Type", "application/json");
					response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));
					//response.write(define.AuthenticationJSONSuccess);
					response.write(jsonRespText);
					response.end() ;
					winston.log  ("info", "Response back to client.." + jsonRespText) ;
			});
		}
	})

	return ;
}

function processQueryHistoryItemsReq (jsonrequest, response, request)
{
	winston.log ("info", "In the function processQueryHistoryItemReq") ;
	// Validate the session first and get the user details before processing further
	
	validateSession (jsonrequest[define.QueryHistoryItemsReq].SessionTokenId, function (reqStatus, userDetails)
	{
		winston.log ("info", "req status is " + reqStatus) ;
		winston.log ("debug", "username is " + userDetails.username) ;
		//winston.log ("debug", "password is " + userDetails.password) ;
		winston.log ("debug", "userid is " + userDetails.userID) ;
		if (reqStatus == define.REQ_SUCCESS)
		{
			winston.log ("debug", "Session Validation SUCCESS") ;
			// We should process the PR history items
			// We should fetch the entries from the ERP database for this user (with userid)
			dbRedisModule.ViewHistoryPRRedis(jsonrequest[define.QueryHistoryItemsReq].REQUISITIONNUMBER, null, function (status, PRHistoryItems)
			{
				/*winston.log ("Start Displaying the items ... ") ;
				displayLocalDbWorklistItems (PRHistoryItems) ;
				winston.log ("END Displaying the items ... ") ;*/
				if (status)
				{
					winston.log ("debug", "Tid is :" + jsonrequest[define.QueryHistoryItemsReq].Tid) ;
					winston.log ("info", "Fetched the history data from the ERP system") ;
					// We should send the response back to the client and then sychronise the Redis database
					responseHandler.getQueryHistoryItemsRes (jsonrequest[define.QueryHistoryItemsReq].Tid, define.REQ_SUCCESS_TEXT, "SUCCESS", PRHistoryItems, function (PRHistoryItemsResponse)
					{
						// We should respond it back to the client
							var jsonRespText = JSON.stringify(PRHistoryItemsResponse);
							response.statusCode = 200;
							response.setHeader("Access-Control-Allow-Origin", "*");
							response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
							response.setHeader("Content-Type", "application/json");
							response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));
							//response.write(define.AuthenticationJSONSuccess);
							response.write(jsonRespText);
							response.end() ;
							winston.log  ("info", "Response back to client.." + jsonRespText) ;
					})
				}
			})
		}
		else
		{ // Corresponding error should be sent back to the client
			winston.log ("debug", "Error while validating the session") ;
			responseHandler.getQueryHistoryItemsRes (jsonrequest[define.QueryHistoryItemsReq].Tid, define.REQ_UNAUTHORISED_TEXT, "Invalid Session Token", "", function (PRHistoryItemsResponse)
			{
				// We should respond it back to the client
					var jsonRespText = JSON.stringify(PRHistoryItemsResponse);
					response.statusCode = 200;
					response.setHeader("Access-Control-Allow-Origin", "*");
					response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
					response.setHeader("Content-Type", "application/json");
					response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));
					//response.write(define.AuthenticationJSONSuccess);
					response.write(jsonRespText);
					response.end() ;
					winston.log  ("info", "Response back to client.." + jsonRespText) ;
			});
		}
	})

	return ;
}

/* Description : The function will form the data to be stored in 
   call Local DB. This internally will be calling local db storage
   calls for storing.
*/
function addPRWorkListItemsInLocalDB (userId, PRWorkListItems, callback)
{
	for (var i in PRWorkListItems)
	{
		PR = new Object () ;
		PR.NOTIFICATIONID = PRWorkListItems[i].NOTIFICATIONID;
		//PR.ITEMKEY = PRWorkListItems[i].ITEMKEY;
		PR.REQUISITIONHEADERID = PRWorkListItems[i].REQUISITIONHEADERID;
		PR.REQUISITIONNUMBER = PRWorkListItems[i].REQUISITIONNUMBER;
		PR.DESCRIPTION = PRWorkListItems[i].DESCRIPTION;
		PR.Amount = PRWorkListItems[i].Amount;
		//PR.MESSAGENAME = PRWorkListItems[i].MESSAGENAME;
		PR.STATUS = PRWorkListItems[i].STATUS;   
		PR.APPROVALREQUESTEDDATE = PRWorkListItems[i].APPROVALREQUESTEDDATE;
		PR.APPROVEDDATE = PRWorkListItems[i].APPROVEDDATE;
		PR.APPROVALREQUESTEDBY = PRWorkListItems[i].APPROVALREQUESTEDBY;
		//PR.EMERGENCYPONUM = PRWorkListItems[i].EMERGENCYPONUM;
		PR.APPROVEREMPLOYEENUMBER = PRWorkListItems[i].APPROVEREMPLOYEENUMBER;
		//PR.FROMUSER = PRWorkListItems[i].FROMUSER;
		PR.TOUSER = PRWorkListItems[i].TOUSER;
		PR.REQUESTOR = PRWorkListItems[i].REQUESTOR;
		//PR.REQUESTOREMPLOYEENUMBER = PRWorkListItems[i].REQUESTOREMPLOYEENUMBER;
		dbRedisModule.AddWorklistPRRedis (userId, PR, function (){}) ;
	}
	
	callback () ;
}


/* Description : The function is used to display the work list items
   The function traverses all the work list items and display.
*/
function displayLocalDbWorklistItems (LocalDbPRWorkListItems)
{
	for (var i in LocalDbPRWorkListItems)
	{
		winston.log ("info", "========== START Of [" + i + "] record ==========") ;
		winston.log ("info", "NOTIFICATIONID :: " + LocalDbPRWorkListItems[i].NOTIFICATIONID);
		//winston.log ("info", "ITEMKEY :: " + LocalDbPRWorkListItems[i].ITEMKEY);
		winston.log ("info", "REQUISITIONHEADERID :: " + LocalDbPRWorkListItems[i].REQUISITIONHEADERID);
		winston.log ("info", "REQUISITIONNUMBER :: " + LocalDbPRWorkListItems[i].REQUISITIONNUMBER);
		winston.log ("info", "DESCRIPTION :: " + LocalDbPRWorkListItems[i].DESCRIPTION);
		winston.log ("info", "Amount :: " + LocalDbPRWorkListItems[i].Amount);
		//winston.log ("info", "MESSAGENAME :: " + LocalDbPRWorkListItems[i].MESSAGENAME);
		winston.log ("info", "STATUS :: " + LocalDbPRWorkListItems[i].STATUS);   
		winston.log ("info", "APPROVALREQUESTEDDATE :: " + LocalDbPRWorkListItems[i].APPROVALREQUESTEDDATE);
		winston.log ("info", "APPROVEDDATE :: " + LocalDbPRWorkListItems[i].APPROVEDDATE);
		winston.log ("info", "APPROVALREQUESTEDBY :: " + LocalDbPRWorkListItems[i].APPROVALREQUESTEDBY);
		//winston.log ("info", "EMERGENCYPONUM :: " + LocalDbPRWorkListItems[i].EMERGENCYPONUM);
		winston.log ("info", "APPROVEREMPLOYEENUMBER :: " + LocalDbPRWorkListItems[i].APPROVEREMPLOYEENUMBER);
		//winston.log ("info", "FROMUSER :: " + LocalDbPRWorkListItems[i].FROMUSER);
		winston.log ("info", "TOUSER :: " + LocalDbPRWorkListItems[i].TOUSER);
		winston.log ("info", "REQUESTOR :: " + LocalDbPRWorkListItems[i].REQUESTOR);
		//winston.log ("info", "REQUESTOREMPLOYEENUMBER :: " + LocalDbPRWorkListItems[i].REQUESTOREMPLOYEENUMBER);
		winston.log ("info", "========== END of the record ==========\n");
	}
}


// This function process the Logout request
function processLogoutUserReq(jsonrequest, response, request)
{
	winston.log ("info", "In the function processLogoutUserReq") ;
	
	dbRedisModule.InvalidateSessionToken(jsonrequest[define.LogoutUserReq].SessionTokenId, function (status)
	{
		/*winston.log ("Start Displaying the items ... ") ;
		displayLocalDbWorklistItems (PRHistoryItems) ;
		winston.log ("END Displaying the items ... ") ;*/
		if (status)
		{
			winston.log ("debug", "Tid is :" + jsonrequest[define.LogoutUserReq].Tid) ;
			winston.log ("debug", "Success : Deleted the session token from redis db") ;
			// We should send the response back to the client and then sychronise the Redis database
			responseHandler.getLogoutUserRes (jsonrequest[define.LogoutUserReq].Tid, define.REQ_SUCCESS_TEXT, "SUCCESS", 
			jsonrequest[define.LogoutUserReq].SessionTokenId, function (LogoutUserResponse)
			{
				// We should respond it back to the client
					var jsonRespText = JSON.stringify(LogoutUserResponse);
					response.statusCode = 200;
					response.setHeader("Content-Type", "application/json");
					response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));
					//response.write(define.AuthenticationJSONSuccess);
					response.write(jsonRespText);
					response.end() ;
					winston.log  ("info", "Response back to client.." + jsonRespText) ;
			})
		}
	})

	return ;
}

/* This function processess the work list details request. It recieves the request from client.
	on what all types of work list types items are selected in an application. It stores this
	information in its session
*/
function processWorkListDetailsReq(jsonrequest, response, request)
{
	winston.log ("info", "In the function processWorkListDetailsReq") ;
	validateSession (jsonrequest[define.WorkListDetailsReq].SessionTokenId, function (reqStatus, userDetails)
	{
		winston.log ("debug", "req status is " + reqStatus) ;
		winston.log ("debug", "username is " + userDetails.username) ;
		winston.log ("debug", "userid is " + userDetails.userID) ;
		if (reqStatus == define.REQ_SUCCESS)
		{
			winston.log ("debug", "Session Validation SUCCESS") ;
			var worklistApprTypes = new Object () ;
			worklistApprTypes.PRSupport = jsonrequest[define.WorkListDetailsReq].PRSupport ;
			worklistApprTypes.POSupport = jsonrequest[define.WorkListDetailsReq].POSupport ;
			worklistApprTypes.ExpenseSupport = jsonrequest[define.WorkListDetailsReq].ExpenseSupport ;
			worklistApprTypes.TradePromotionsupport = jsonrequest[define.WorkListDetailsReq].TradePromotionsupport ;
			winston.log ("debug", "PRSupport is " + worklistApprTypes.PRSupport) ;
			winston.log ("debug", "POSupport is " + worklistApprTypes.POSupport) ;
			winston.log ("debug", "ExpenseSupport is " + worklistApprTypes.ExpenseSupport) ;
			winston.log ("debug", "TradePromotionsupport is " + worklistApprTypes.TradePromotionsupport) ;
			dbRedisModule.StoreWorkListDetail(jsonrequest[define.WorkListDetailsReq].SessionTokenId,userDetails, worklistApprTypes, function (status)
			{
				if (status)
				{
					winston.log ("debug", "Tid is :" + jsonrequest[define.WorkListDetailsReq].Tid) ;
					winston.log ("debug", "Success :User Details are stored in redis db") ;
					// We should send the response back to the client and then sychronise the Redis database
					responseHandler.getWorkListDetailsRes (jsonrequest[define.WorkListDetailsReq].Tid, define.REQ_SUCCESS_TEXT, "SUCCESS", 
					jsonrequest[define.WorkListDetailsReq].SessionTokenId, function (WorkListDetailsResponse)
					{
						// We should respond it back to the client
							var jsonRespText = JSON.stringify(WorkListDetailsResponse);
							response.statusCode = 200;
							response.setHeader("Content-Type", "application/json");
							response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));
							//response.write(define.AuthenticationJSONSuccess);
							response.write(jsonRespText);
							response.end() ;
							winston.log  ("info", "Response back to client.." + jsonRespText) ;
					})
				}
			})
			if (define.UAProfSupport)
			{
				winston.log ("debug", "Storing WorkListTypes selected information in the Device-Prof of the user \n") ;
				dbRedisModule.StoreDevProfileDetail(jsonrequest[define.WorkListDetailsReq].SessionTokenId,userDetails, worklistApprTypes, function (status)
				{
				});
			}
		}
		else
		{ // Corresponding error should be sent back to the client
			winston.log ("debug", "Error while validating the session") ;
			responseHandler.getWorkListDetailsRes (jsonrequest[define.WorkListDetailsReq].Tid, define.REQ_FAIL, "FAILED", 
			jsonrequest[define.WorkListDetailsReq].SessionTokenId, function (WorkListDetailsResponse)
			{
				// We should respond it back to the client
					var jsonRespText = JSON.stringify(WorkListDetailsResponse);
					response.statusCode = 200;
					response.setHeader("Content-Type", "application/json");
					response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));
					//response.write(define.AuthenticationJSONSuccess);
					response.write(jsonRespText);
					response.end() ;
					winston.log  ("info", "Response back to client.." + jsonRespText) ;
			});
		}
	})

	return ;

}


/* This function process the approval / approve with comments request from the client */
function processPRApproveItemReq(jsonrequest, response, request)
{
	winston.log ("info", "In the function processPRApproveItemReq") ;
	// Validate the session first and get the user details before processing further	
	validateSession (jsonrequest[define.PRApproveItemReq].SessionTokenId, function (reqStatus, userDetails)
	{
		var notID = jsonrequest[define.PRApproveItemReq].NOTIFICATIONID ;
		var apprWorklistReqType = jsonrequest[define.PRApproveItemReq].RequestType;   // Modified by Vinod
		winston.log ("debug", "req status is " + reqStatus) ;
		winston.log ("debug", "username is " + userDetails.username) ;
		winston.log ("debug", "userid is " + userDetails.userID) ;
		if (reqStatus == define.REQ_SUCCESS)
		{
			winston.log ("debug", "Session Validation SUCCESS") ;	
			winston.log ("debug", "Request for approving  notification id.. " + notID) ;
			sendERPApproveRequest (apprWorklistReqType, userDetails, notID, jsonrequest[define.PRApproveItemReq].ApprovalComments, function (err, result)
			{
				if (err)
				{
					winston.log ("debug", "Error processing the approval request. Responding back with failure \n") ;
					responseHandler.getPRApprovedItemsResponse (jsonrequest[define.PRApproveItemReq].Tid, define.APPROVEREQ_REJECT, "Unable to approve", notID, function (PRApprovedItemsResponse)
					{
						// We should respond it back to the client
							var jsonRespText = JSON.stringify(PRApprovedItemsResponse);
							response.statusCode = 200;
							response.setHeader("Access-Control-Allow-Origin", "*");
							response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
							response.setHeader("Content-Type", "application/json");
							response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));					
							response.write(jsonRespText);
							response.end() ;
							winston.log  ("info", "Response back to client.." + jsonRespText) ;
					});			
				}
				else
				{
					// We should delete the notification id from the user worklist type too
					//dbRedisModule.RemovePRApprovedItemRedis(userDetails, notID, function (err, status)
					dbRedisModule.RemoveApproveRejectItemRedis(userDetails, notID, apprWorklistReqType, function (err, status)  //Modified by Vinod
					{						
						if (!err)
						{
							winston.log ("debug", "Tid is :" + jsonrequest[define.PRApproveItemReq].Tid) ;
							winston.log ("debug", "PRApproveItemReq response from the ERP system") ;
							// We should send the response back to the client and then sychronise the Redis database
							responseHandler.getPRApprovedItemsResponse(jsonrequest[define.PRApproveItemReq].Tid, define.REQ_SUCCESS, "SUCCESS", notID, function (PRApprovedItemsResponse)
							{
								// We should respond it back to the client
								var jsonRespText = JSON.stringify(PRApprovedItemsResponse);
								response.statusCode = 200;
								response.setHeader("Access-Control-Allow-Origin", "*");
								response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
								response.setHeader("Content-Type", "application/json");
								response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));
								response.write(jsonRespText);
								response.end() ;
								winston.log  ("info", "Response back to client.." + jsonRespText) ;
							});
						}
						else
						{
							responseHandler.getPRApprovedItemsResponse (jsonrequest[define.PRApproveItemReq].Tid, define.APPROVEREQ_REJECT, "Unable to approve", notID, function (PRApprovedItemsResponse)
							{
								// We should respond it back to the client
									var jsonRespText = JSON.stringify(PRApprovedItemsResponse);
									response.statusCode = 200;
									response.setHeader("Access-Control-Allow-Origin", "*");
									response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
									response.setHeader("Content-Type", "application/json");
									response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));					
									response.write(jsonRespText);
									response.end() ;
									winston.log  ("info", "Response back to client.." + jsonRespText) ;
							});			
						}				
					}) ;
				}
			}) ;
		}
		else
		{ // Corresponding error should be sent back to the client
			winston.log ("info", "Error while validating the session") ;
			responseHandler.getPRApprovedItemsResponse (jsonrequest[define.PRApproveItemReq].Tid, define.REQ_UNAUTHORISED_TEXT, "Invalid Session Token", notID, function (PRApprovedItemsResponse)
			{
				// We should respond it back to the client
					var jsonRespText = JSON.stringify(PRApprovedItemsResponse);
					response.statusCode = 200;
					response.setHeader("Access-Control-Allow-Origin", "*");
					response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
					response.setHeader("Content-Type", "application/json");
					response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));					
					response.write(jsonRespText);
					response.end() ;
					winston.log  ("info", "Response back to client.." + jsonRespText) ;
			});			
		}
	});
	return ;
}


/* This function process the reject request */
function processPRRejectItemReq(jsonrequest, response, request)
{
	winston.log ("info", "In the function processPRRejectItemReq") ;
	// Validate the session first and get the user details before processing further	
	validateSession (jsonrequest[define.PRRejectItemReq].SessionTokenId, function (reqStatus, userDetails)
	{
		var notID = jsonrequest[define.PRRejectItemReq].NOTIFICATIONID ;
		var apprWorklistReqType = jsonrequest[define.PRRejectItemReq].RequestType;   //Modified by Vinod
		winston.log ("debug", "req status is " + reqStatus) ;
		winston.log ("debug", "username is " + userDetails.username) ;
		winston.log ("debug", "userid is " + userDetails.userID) ;
		if (reqStatus == define.REQ_SUCCESS)
		{
			winston.log ("debug", "Session Validation SUCCESS") ;	
			winston.log ("debug", "Request for approving  notification id.. " + notID) ;
			sendERPRejectRequest (apprWorklistReqType, userDetails, notID, jsonrequest[define.PRRejectItemReq].RejectionComments, function (err, result)
			{
				if (err)
				{
					winston.log ("debug", "Error processing the reject request. Responding back with failure \n") ;
					responseHandler.getPRRejectItemsResponse (jsonrequest[define.PRRejectItemReq].Tid, define.REJECTREQ_REJECT, "Unable to reject", notID, function (PRRejectItemsResponse)
					{
						// We should respond it back to the client
							var jsonRespText = JSON.stringify(PRRejectItemsResponse);
							response.statusCode = 200;
							response.setHeader("Access-Control-Allow-Origin", "*");
							response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
							response.setHeader("Content-Type", "application/json");
							response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));					
							response.write(jsonRespText);
							response.end() ;
							winston.log  ("info", "Response back to client.." + jsonRespText) ;
					});			
				}
				else
				{
					// We should delete the notification id from the user worklist type too
					//dbRedisModule.RemovePRApprovedItemRedis(userDetails, notID, function (err, status)
					dbRedisModule.RemoveApproveRejectItemRedis(userDetails, notID, apprWorklistReqType, function (err, status)  //Modified by Vinod
					{						
						if (!err)
						{
							winston.log ("debug", "Tid is :" + jsonrequest[define.PRRejectItemReq].Tid) ;
							winston.log ("debug", "PRRejectItemReq response from the ERP system") ;
							// We should send the response back to the client and then sychronise the Redis database
							responseHandler.getPRRejectItemsResponse(jsonrequest[define.PRRejectItemReq].Tid, define.REQ_SUCCESS, "SUCCESS", notID, function (PRRejectItemsResponse)
							{
								// We should respond it back to the client
								var jsonRespText = JSON.stringify(PRRejectItemsResponse);
								response.statusCode = 200;
								response.setHeader("Access-Control-Allow-Origin", "*");
								response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
								response.setHeader("Content-Type", "application/json");
								response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));
								response.write(jsonRespText);
								response.end() ;
								winston.log  ("info", "Response back to client.." + jsonRespText) ;
							});
						}
						else
						{
							responseHandler.getPRRejectItemsResponse (jsonrequest[define.PRRejectItemReq].Tid, define.REJECTREQ_REJECT, "Unable to reject", notID, function (PRRejectItemsResponse)
							{
								// We should respond it back to the client
								var jsonRespText = JSON.stringify(PRRejectItemsResponse);
								response.statusCode = 200;
								response.setHeader("Access-Control-Allow-Origin", "*");
								response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
								response.setHeader("Content-Type", "application/json");
								response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));					
								response.write(jsonRespText);
								response.end() ;
								winston.log  ("info", "Response back to client.." + jsonRespText) ;
							});			
						}				
					}) ;
				}
			}) ;
		}
		else
		{ // Corresponding error should be sent back to the client
			winston.log ("info", "Error while validating the session") ;
			responseHandler.getPRRejectItemsResponse (jsonrequest[define.PRRejectItemReq].Tid, define.REQ_UNAUTHORISED_TEXT, "Invalid Session Token", notID, function (PRRejectItemsResponse)
			{
				// We should respond it back to the client
				var jsonRespText = JSON.stringify(PRRejectItemsResponse);
				response.statusCode = 200;
				response.setHeader("Access-Control-Allow-Origin", "*");
				response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
				response.setHeader("Content-Type", "application/json");
				response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));					
				response.write(jsonRespText);
				response.end() ;
				winston.log  ("info", "Response back to client.." + jsonRespText) ;
			});			
		}
	});
	return ;
}


/* 	This function is expected to connect to the REST API provided by Snap Logic or the ERP system (oracle server)
*	to execute  the stored procedure for approving the request
*	reqType will be "PR" / "IE" / "JE"
*/
function sendERPApproveRequest (reqType, userdetails, notID, ApprovalComments, callback)
{
	var ret = new Object () ;
	winston.log ("info", "function sendERPApproveRequest called with the not id [" + notID + "] and approval comments [" + ApprovalComments + "]\n") ;
	formSLAppPRBuffer (userdetails, notID, ApprovalComments, function (reqBuffer)
	{
		winston.log ("info", "The buffer to send to SL for APproval Request is " + reqBuffer) ;
		if (define.javaERPInterface)
		{
			webManager.processApprRejRequestjavaERPInt (1, reqType, userdetails, notID, ApprovalComments, reqBuffer, function (err, response)
			{
				if (err)
				{
					callback (1, ret) ;
				}
				else
				{
					callback (0, ret) ; 
				}
			}) ;
		}
		else
		{	
			webManager.processApprRejRequest (1, userdetails, notID, ApprovalComments, reqBuffer, function (err, response)
			{
				if (err)
				{
					callback (1, ret) ;
				}
				else
				{
					callback (0, ret) ; 
				}
			}) ;
		}
	}) ;
}


function formSLAppPRBuffer (userdetails, notID, ApprovalComments, callback)
{
	callback ("Test buffer") ;
}


/* 	This function is expected to connect to the REST API provided by Snap Logic or the ERP system (oracle server)
*	to execute  the stored procedure for approving the request
*	reqType will be "PR" / "IE" / "JE"
*/
function sendERPRejectRequest (reqType, userdetails, notID, RejectComments, callback)
{
	winston.log ("info", "function sendERPRejectRequest called with the not id [" + notID + "] and reject comments [" + RejectComments + "]\n") ;
	var ret = new Object () ;

	formSLAppPRBuffer (userdetails, notID, RejectComments, function (reqBuffer)
	{
		if (define.javaERPInterface)
		{
			webManager.processApprRejRequestjavaERPInt (2, reqType, userdetails, notID, RejectComments, reqBuffer, function (err, response)
			{
				if (err)
				{
					callback (1, ret) ;
				}
				else
				{
					callback (0, ret) ; 
				}
			}) ;
		}
		else
		{	
			winston.log ("debug", "The buffer to send to SL for Reject Request is " + reqBuffer) ;
			webManager.processApprRejRequest (2, userdetails, notID, RejectComments, reqBuffer, function (err, response)
			{
				if (err)
				{
					callback (1, ret) ;
				}
				else
				{
					callback (0, ret) ; 
				}
			}) ;
		}
	}) ;
}

/* Phase 2 : IE Expense Report Process Requests */

/* Description : The function gets the query IE Work list
*  item request from the client. It will call the db module
*  to further fetch the data from the ERP system. After
*  fetching the data it sends the JSON response back to
*  the client.
*/

function processQueryIEWorklistReq (jsonrequest, response, request)
{
	winston.log ("info", "In the function processQueryIEWorklistReq") ;
	// Validate the session first and get the user details before processing further	
	validateSession (jsonrequest[define.QueryWorklistIEReq].SessionTokenId, function (reqStatus, userDetails)
	{
		winston.log ("debug", "req status is " + reqStatus) ;
		winston.log ("debug", "username is " + userDetails.username) ;
		//winston.log ("debug", "password is " + userDetails.password) ;
		winston.log ("debug", "userid is " + userDetails.userID) ;
		if (reqStatus == define.REQ_SUCCESS)
		{
			winston.log ("debug", "Session Validation SUCCESS") ;
			// We should process the IE Work list items
			// We should fetch the entries from the ERP database for this user (with userID)
			console.log('jsonrequest[define.QueryWorklistIEReq]' + jsonrequest[define.QueryWorklistIEReq]);
			///////////
			/*dbRedisModule.AddWorklistIERedis(userDetails.userID,jsonrequest[define.QueryWorklistIEReq],function(code,redisStorageResult,redisDataType)
			{
				winston.log ("debug", "Inside Add IE Worklist") ;
				if(redisStorageResult[1] == "User ID set key added successfully")
				{
					console.log('redisStorageResult[1]' + redisStorageResult[1]);
					//////
			*/
			dbRedisModule.ViewWorklistIERedis(userDetails.userID, null, function (status, IEWorkListItems)
			{
				//winston.log ("Start Displaying the items ... ") ;
				//displayLocalDbWorklistItems (IEWorkListItems) ;
				//winston.log ("END Displaying the items ... ") ;						
				if (status)
				{
					winston.log ("debug", "Tid is :" + jsonrequest[define.QueryWorklistIEReq].Tid) ;
					winston.log ("info", "Fetched the IE worklist data from the ERP system") ;
					// We should send the response back to the client and then sychronise the Redis database
					responseHandler.getIEWorkListItemResponse (jsonrequest[define.QueryWorklistIEReq].Tid, define.REQ_SUCCESS_TEXT, "SUCCESS", IEWorkListItems, function (IEWorkListItemsResponse)
					{
						// We should respond it back to the client
							var jsonRespText = JSON.stringify(IEWorkListItemsResponse);
							response.statusCode = 200;
							response.setHeader("Access-Control-Allow-Origin", "*");
							response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
							response.setHeader("Content-Type", "application/json");
							response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));
							response.write(jsonRespText);
							winston.log ("debug", jsonRespText) ;
							winston.log ("info", "Successfully Processed QueryWorklistIEReq") ; 
							response.end() ;
					});
				}
			});
		}
		else
		{ // Corresponding error should be sent back to the client
			winston.log ("debug", "Error while validating the session") ;
			responseHandler.getIEWorkListItemResponse (jsonrequest[define.QueryWorklistIEReq].Tid, define.REQ_UNAUTHORISED_TEXT, "Invalid Session Token", "", function (IEWorkListItemsResponse)
			{
				// We should respond it back to the client
					var jsonRespText = JSON.stringify(IEWorkListItemsResponse);
					response.statusCode = 200;
					response.setHeader("Access-Control-Allow-Origin", "*");
					response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
					response.setHeader("Content-Type", "application/json");
					response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));
					//response.write(define.AuthenticationJSONSuccess);
					response.write(jsonRespText);
					winston.log  ("info", "Response back to client.." + jsonRespText) ;
					response.end() ;
			});			
		}
	});
	return ;
}

/* Description : The function gets the query IE history
*  item request from the client. It will call the db module
*  to further fetch the data from the ERP system. After
*  fetching the data it sends the JSON response back to
*  the client.
*/
function processQueryIEHistoryItemsReq(jsonrequest, response, request)
{
	winston.log ("info", "In the function processQueryHistoryItemReq") ;
	// Validate the session first and get the user details before processing further
	
	validateSession (jsonrequest[define.QueryIEHistoryItemsReq].SessionTokenId, function (reqStatus, userDetails)
	{
		winston.log ("info", "req status is " + reqStatus) ;
		winston.log ("debug", "username is " + userDetails.username) ;
		//winston.log ("debug", "password is " + userDetails.password) ;
		winston.log ("debug", "userid is " + userDetails.userID) ;
		if (reqStatus == define.REQ_SUCCESS)
		{
			winston.log ("debug", "Session Validation SUCCESS") ;
			// We should process the IE history items
			// We should fetch the entries from the ERP database for this user (with userid)
			dbRedisModule.ViewHistoryIERedis(jsonrequest[define.QueryIEHistoryItemsReq].IEXPENSENUMBER, null, function (status, IEHistoryItems)
			{
				/*winston.log ("Start Displaying the items ... ") ;
				displayLocalDbWorklistItems (IEHistoryItems) ;
				winston.log ("END Displaying the items ... ") ;*/
				if (status)
				{
					winston.log ("debug", "Tid is :" + jsonrequest[define.QueryIEHistoryItemsReq].Tid) ;
					winston.log ("info", "Fetched the IE history data from the ERP system") ;
					// We should send the response back to the client and then sychronise the Redis database
					responseHandler.getQueryIEHistoryItemsRes(jsonrequest[define.QueryIEHistoryItemsReq].Tid, define.REQ_SUCCESS_TEXT, "SUCCESS", IEHistoryItems, function (IEHistoryItemsResponse)
					{
						// We should respond it back to the client
							var jsonRespText = JSON.stringify(IEHistoryItemsResponse);
							response.statusCode = 200;
							response.setHeader("Access-Control-Allow-Origin", "*");
							response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
							response.setHeader("Content-Type", "application/json");
							response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));
							//response.write(define.AuthenticationJSONSuccess);
							response.write(jsonRespText);
							response.end() ;
							winston.log  ("info", "Response back to client.." + jsonRespText) ;
					})
				}
			})
		}
		else
		{ // Corresponding error should be sent back to the client
			winston.log ("debug", "Error while validating the session") ;
			responseHandler.getQueryIEHistoryItemsRes(jsonrequest[define.QueryIEHistoryItemsReq].Tid, define.REQ_UNAUTHORISED_TEXT, "Invalid Session Token", "", function (IEHistoryItemsResponse)
			{
				// We should respond it back to the client
					var jsonRespText = JSON.stringify(IEHistoryItemsResponse);
					response.statusCode = 200;
					response.setHeader("Access-Control-Allow-Origin", "*");
					response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
					response.setHeader("Content-Type", "application/json");
					response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));
					//response.write(define.AuthenticationJSONSuccess);
					response.write(jsonRespText);
					response.end() ;
					winston.log  ("info", "Response back to client.." + jsonRespText) ;
			});
		}
	})
	return ;
}

function processQueryIEDetailedInfoReq(jsonrequest, response, request)
{
	winston.log ("info", "In the function processQueryIEDetailedInfoReq") ;

	// Validate the session first and get the user details before processing further
	
	validateSession (jsonrequest[define.QueryIEDetailedInfoReq].SessionTokenId, function (reqStatus, userDetails)
	{
		winston.log ("debug", "req status is " + reqStatus) ;
		winston.log ("debug", "username is " + userDetails.username) ;
		//winston.log ("debug", "password is " + userDetails.password) ;
		winston.log ("debug", "userid is " + userDetails.userID) ;
		winston.log("debug", "Session token " + jsonrequest[define.QueryIEDetailedInfoReq].SessionTokenId);
		winston.log("debug", "Report Header ID " + jsonrequest[define.QueryIEDetailedInfoReq].REPORTHEADERID);
		if (reqStatus == define.REQ_SUCCESS)
		{
			winston.log ("debug", "Session Validation SUCCESS") ;
			// We should process the IEDetailedInfoReq
			// We should fetch the entries from the ERP database for this user (with userid)
			dbRedisModule.ViewIEDetailedInfoReq(jsonrequest[define.QueryIEDetailedInfoReq].REPORTHEADERID, null, function (status, IEDetailedInfoItems)
			{
				/*winston.log ("Start Displaying the items ... ") ;
				displayLocalDbWorklistItems (IEDetailedInfo) ;
				winston.log ("END Displaying the items ... ") ;*/
				if (status)
				{
					winston.log ("debug", "Tid is :" + jsonrequest[define.QueryIEDetailedInfoReq].Tid) ;
					winston.log ("info", "Fetched the data from the ERP system") ;
					// We should send the response back to the client and then sychronise the Redis database
					responseHandler.getIEDetailedInfoResponse (jsonrequest[define.QueryIEDetailedInfoReq].Tid, define.REQ_SUCCESS_TEXT, "SUCCESS", IEDetailedInfoItems, function (IEDetailedInfoResponse)
					{
						// We should respond it back to the client
							var jsonRespText = JSON.stringify(IEDetailedInfoResponse);
							response.statusCode = 200;
							response.setHeader("Access-Control-Allow-Origin", "*");
							response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
							response.setHeader("Content-Type", "application/json");
							response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));
							//response.write(define.AuthenticationJSONSuccess);
							response.write(jsonRespText);
							winston.log  ("info", "Response back to client.." + jsonRespText) ;
							response.end() ;
					})
				}
			})
		}
		else
		{ // Corresponding error should be sent back to the client
			winston.log ("debug", "Error while validating the session") ;
			responseHandler.getIEDetailedInfoResponse (jsonrequest[define.QueryIEDetailedInfoReq].Tid, define.REQ_UNAUTHORISED_TEXT, "Invalid Session Token", "", function (IEDetailedInfoResponse)
			{
				// We should respond it back to the client
					var jsonRespText = JSON.stringify(IEDetailedInfoResponse);
					response.statusCode = 200;
					response.setHeader("Access-Control-Allow-Origin", "*");
					response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
					response.setHeader("Content-Type", "application/json");
					response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));
					//response.write(define.AuthenticationJSONSuccess);
					response.write(jsonRespText);
					response.end() ;
					winston.log  ("info", "Response back to client.." + jsonRespText) ;
			});
		}
	})

	return ;
}

/* Phase 2 : IE Expense Report Process Requests */

/* Description : The function gets the query JE Work list
*  item request from the client. It will call the db module
*  to further fetch the data from the ERP system. After
*  fetching the data it sends the JSON response back to
*  the client.
*/

function processQueryJEWorklistReq (jsonrequest, response, request)
{
	winston.log ("info", "In the function processQueryJEWorklistReq") ;
	// Validate the session first and get the user details before processing further	
	validateSession (jsonrequest[define.QueryWorklistJEReq].SessionTokenId, function (reqStatus, userDetails)
	{
		winston.log ("debug", "req status is " + reqStatus) ;
		winston.log ("debug", "username is " + userDetails.username) ;
		//winston.log ("debug", "password is " + userDetails.password) ;
		winston.log ("debug", "userid is " + userDetails.userID) ;
		if (reqStatus == define.REQ_SUCCESS)
		{
			winston.log ("debug", "Session Validation SUCCESS") ;
			// We should process the JE Work list items
			console.log('jsonrequest[define.QueryWorklistJEReq]' + jsonrequest[define.QueryWorklistJEReq]);
			dbRedisModule.ViewWorklistJERedis(userDetails.userID, null, function (status, JEWorkListItems)
			{
				//winston.log ("Start Displaying the items ... ") ;
				//displayLocalDbWorklistItems (JEWorkListItems) ;
				//winston.log ("END Displaying the items ... ") ;						
				if (status)
				{
					winston.log ("debug", "Tid is :" + jsonrequest[define.QueryWorklistJEReq].Tid) ;
					winston.log ("info", "Fetched the JE worklist data from the ERP system") ;
					// We should send the response back to the client and then sychronise the Redis database
					responseHandler.getJEWorkListItemResponse (jsonrequest[define.QueryWorklistJEReq].Tid, define.REQ_SUCCESS_TEXT, "SUCCESS", JEWorkListItems, function (JEWorkListItemsResponse)
					{
						// We should respond it back to the client
							var jsonRespText = JSON.stringify(JEWorkListItemsResponse);
							response.statusCode = 200;
							response.setHeader("Access-Control-Allow-Origin", "*");
							response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
							response.setHeader("Content-Type", "application/json");
							response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));
							response.write(jsonRespText);
							winston.log ("debug", jsonRespText) ;
							winston.log ("info", "Successfully Processed QueryWorklistJEReq") ; 
							response.end() ;
					});
				}
			});
		}
		else
		{ // Corresponding error should be sent back to the client
			winston.log ("debug", "Error while validating the session") ;
			responseHandler.getJEWorkListItemResponse (jsonrequest[define.QueryWorklistJEReq].Tid, define.REQ_UNAUTHORISED_TEXT, "Invalid Session Token", "", function (JEWorkListItemsResponse)
			{
				// We should respond it back to the client
					var jsonRespText = JSON.stringify(JEWorkListItemsResponse);
					response.statusCode = 200;
					response.setHeader("Access-Control-Allow-Origin", "*");
					response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
					response.setHeader("Content-Type", "application/json");
					response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));
					//response.write(define.AuthenticationJSONSuccess);
					response.write(jsonRespText);
					winston.log  ("info", "Response back to client.." + jsonRespText) ;
					response.end() ;
			});			
		}
	});
	return ;
}

function processRegisterAppReq(jsonrequest, response, request)
{
	winston.log ("info", "In the function processRegisterAppReq") ;

	// Validate the session first and get the user details before processing further
	validateSession (jsonrequest[define.RegisterAppReq].SessionTokenId, function (reqStatus, userDetails)
	{
		winston.log ("debug", "req status is " + reqStatus) ;
		winston.log ("debug", "username is " + userDetails.username) ;
		//winston.log ("debug", "password is " + userDetails.password) ;
		winston.log ("debug", "userid is " + userDetails.userID) ;
		winston.log("debug", "Session token " + jsonrequest[define.RegisterAppReq].SessionTokenId);
		winston.log("debug", "Register ID " + jsonrequest[define.RegisterAppReq].RegistrationId);

		if (reqStatus == define.REQ_SUCCESS)
		{
			winston.log ("debug", "Session Validation SUCCESS") ;
			
			dbRedisModule.StoreRegID(jsonrequest[define.RegisterAppReq].SessionTokenId,userDetails, jsonrequest[define.RegisterAppReq].RegistrationId, function (status)
			{
				if (status)
				{
					winston.log ("debug", "Tid is :" + jsonrequest[define.RegisterAppReq].Tid) ;
					// We should send the response back to the client and then sychronise the Redis database
					responseHandler.getRegisterAppRes (jsonrequest[define.RegisterAppReq].Tid, define.REQ_SUCCESS_TEXT, "SUCCESS", 
					jsonrequest[define.RegisterAppReq].SessionTokenId, function (RegisterAppResponse)
					{
						// We should respond it back to the client
							var jsonRespText = JSON.stringify(RegisterAppResponse);
							response.statusCode = 200;
							response.setHeader("Content-Type", "application/json");
							response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));
							//response.write(define.AuthenticationJSONSuccess);
							response.write(jsonRespText);
							response.end() ;
							winston.log  ("info", "Response back to client.." + jsonRespText) ;
					})
				}
			})
		}
		else
		{ // Corresponding error should be sent back to the client
			winston.log ("debug", "Error while validating the session") ;
			responseHandler.getRegisterAppRes (jsonrequest[define.RegisterAppReq].Tid, define.REQ_FAIL, "FAILED", 
			jsonrequest[define.RegisterAppReq].SessionTokenId, function (RegisterAppResponse)
			{
				// We should respond it back to the client
					var jsonRespText = JSON.stringify(RegisterAppResponse);
					response.statusCode = 200;
					response.setHeader("Content-Type", "application/json");
					response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));
					//response.write(define.AuthenticationJSONSuccess);
					response.write(jsonRespText);
					response.end() ;
					winston.log  ("info", "Response back to client.." + jsonRespText) ;
			});
		}
	})

	return ;
}



function processUnRegisterAppReq(jsonrequest, response, request)
{
	winston.log ("info", "In the function processRegisterAppReq") ;

	// Validate the session first and get the user details before processing further
	validateSession (jsonrequest[define.UnRegisterAppReq].SessionTokenId, function (reqStatus, userDetails)
	{
		winston.log ("debug", "req status is " + reqStatus) ;
		winston.log ("debug", "username is " + userDetails.username) ;
		//winston.log ("debug", "password is " + userDetails.password) ;
		winston.log ("debug", "userid is " + userDetails.userID) ;
		winston.log("debug", "Session token " + jsonrequest[define.UnRegisterAppReq].SessionTokenId);
		winston.log("debug", "Register ID " + jsonrequest[define.UnRegisterAppReq].RegistrationId);

		if (reqStatus == define.REQ_SUCCESS)
		{
			winston.log ("debug", "Session Validation SUCCESS") ;
			
			dbRedisModule.delRegID(jsonrequest[define.UnRegisterAppReq].SessionTokenId,userDetails, jsonrequest[define.UnRegisterAppReq].RegistrationId, function (status)
			{
				if (status)
				{
					winston.log ("debug", "Tid is :" + jsonrequest[define.UnRegisterAppReq].Tid) ;
					// We should send the response back to the client and then sychronise the Redis database
					responseHandler.getUnRegisterAppRes (jsonrequest[define.UnRegisterAppReq].Tid, define.REQ_SUCCESS_TEXT, "SUCCESS", 
					jsonrequest[define.UnRegisterAppReq].SessionTokenId, function (UnRegisterAppResponse)
					{
						// We should respond it back to the client
							var jsonRespText = JSON.stringify(UnRegisterAppResponse);
							response.statusCode = 200;
							response.setHeader("Content-Type", "application/json");
							response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));
							//response.write(define.AuthenticationJSONSuccess);
							response.write(jsonRespText);
							response.end() ;
							winston.log  ("info", "Response back to client.." + jsonRespText) ;
					})
				}
			})
		}
		else
		{ // Corresponding error should be sent back to the client
			winston.log ("debug", "Error while validating the session") ;
			responseHandler.getUnRegisterAppRes (jsonrequest[define.UnRegisterAppReq].Tid, define.REQ_FAIL, "FAILED", 
			jsonrequest[define.UnRegisterAppReq].SessionTokenId, function (UnRegisterAppResponse)
			{
				// We should respond it back to the client
					var jsonRespText = JSON.stringify(UnRegisterAppResponse);
					response.statusCode = 200;
					response.setHeader("Content-Type", "application/json");
					response.setHeader("Content-Length", Buffer.byteLength(jsonRespText));
					//response.write(define.AuthenticationJSONSuccess);
					response.write(jsonRespText);
					response.end() ;
					winston.log  ("info", "Response back to client.." + jsonRespText) ;
			});
		}
	})

	return ;
}

/* Make the routines availble to others too */
exports.processAuthenticateReq=processAuthenticateReq ;
exports.processQueryPRWorklistReq=processQueryPRWorklistReq ;
exports.processQueryPRDetailedInfoReq=processQueryPRDetailedInfoReq ;
exports.processQueryHistoryItemsReq=processQueryHistoryItemsReq ;
exports.validateSession=validateSession ;
exports.processLogoutUserReq=processLogoutUserReq ;
exports.processWorkListDetailsReq = processWorkListDetailsReq;
exports.processPRRejectItemReq=processPRRejectItemReq ;
exports.processPRApproveItemReq=processPRApproveItemReq ;
exports.processRegisterAppReq = processRegisterAppReq;
exports.processUnRegisterAppReq = processUnRegisterAppReq;


// IE Expense Report exports
exports.processQueryIEWorklistReq = processQueryIEWorklistReq;
exports.processQueryIEHistoryItemsReq = processQueryIEHistoryItemsReq;
exports.processQueryIEDetailedInfoReq = processQueryIEDetailedInfoReq;
// JE Journal Entry exports

exports.processQueryJEWorklistReq = processQueryJEWorklistReq;


