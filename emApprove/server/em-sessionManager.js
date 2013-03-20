//////////////////////////////////////////////////////////////////////////
// Name : sessionModule.js							
// Description : Module to store and retrive user details and session token in Redis		
//This module interacts  with  :  dbRedisSessionModule.js         
///////////////////////////////////////////////////////////////////////////

/* define.js :- Include the definations file */
var define = require("./em-define");

/* For logging */
var logModule = require("./em-logModule");
var winston = logModule.getLogModule (); 


//Including dbRedisSessionModule; 
var dbRedisModule = require("./em-dbRedisModule");

/* This function will validate the session if the session is valid then it pass 
*  on the User details to the calling function
*/
function validateSessionID (sessionTokenId, callback)
{
	status = define.UNAUTHORISED_STATUS ; // Consider it un-authorised until user is authorised.

	winston.log ("debug", "Request for validating session token id " + sessionTokenId) ;
	dbRedisModule.RetrieveSessionDetail (sessionTokenId, function (status, userDetails)
	{
		callback (status, userDetails) ;
	}) ;
	
	return ;
}

// out :: function (status, sessionToken)
function storeUserDetailsGetSessionToken (userDetails, deviceInfo, userLdapDetails, callback)
{
	var status = define.UNAUTHORISED_STATUS ; // Consider it un-authorised until user is authorised.

	winston.log ("debug", "In function storeUserDetailsGetSessionToken\n") ;
	CreateSessionID (userDetails, deviceInfo, function (sessionToken)
	{
		winston.log ("info", "The session Token created is ::" + sessionToken) ;
		// Check if session id details are already there then update the active flag to 1
		dbRedisModule.checkSessionDetail (sessionToken, function (status)
		{
			if (!status) // if not found
			{
				dbRedisModule.StoreSessionDetail (sessionToken, userDetails, deviceInfo, userLdapDetails, function (status)
				{
					winston.log ("debug","Request from username [" + userDetails.username + "] userid [" + userDetails.userID + "] and device details are ... Device Name [" + deviceInfo.DeviceName + "] Device Version [" + deviceInfo.DeviceVersion + "]  device Unique id  [" + deviceInfo.UniqueDeviceID +   "] and device platform is [" + deviceInfo.Platform + "]\n") ;
					callback (status, sessionToken) ;
				}) ;
				/* If the UAProf support is enabled, we will be storing all the details in the UAProfile list */
				if (define.UAProfSupport)
				{
					winston.log ("debug", "Storing information in the UA-Prof of the user \n") ;
					dbRedisModule.StoreUAProfDetails (sessionToken, userDetails, deviceInfo, userLdapDetails, function (status)
					{
						winston.log ("debug","UAprof information written / updated for user [" + userDetails.username + "]\n") ;
					}) ;
				}
			}
			else
			{
				callback (define.REQ_SUCCESS, sessionToken) ;
			}
		}) ;
	}) ;
	
	return ;
}

/* It will check if  the session token is available in the database for the specific user.
 * and return the corresponding user back to it
 */
function checkGetUserId (userDetails, deviceInfo, callback)
{
	// If user id and device id is there then only go for checking the details
	if (userDetails.userID && deviceInfo.UniqueDeviceID)
	{
		// Check if the session Token is there 
		CreateSessionID(userDetails, deviceInfo, function (sessionToken)
		{
			//redisclient.exists (sessionToken, function (err, result)
			dbRedisModule.checkGetUserId (sessionToken, function (err, userID)
			{
				if (err) // error
				{
					winston.log ("debug", "User details not present..\n") ;
					callback (1, null) ;
				}
				else
				{
					winston.log ("debug", "The user id recvd is [" + userID + "] \n") ;
					userDetails.userID = userID ;
					callback (0, userID) ;
				}
			}) ;
		}) ;
	}
	else
	{
		winston.log ("debug", "User details not present..\n") ;
		callback (1, null) ;
	}
}


		


//Method Name : CreateSessionID
//Parameters : userDetails
//Description : Creates a random session token for the first time user
//Other Module Methods involved : No

function CreateSessionID(userDetails, deviceInfo, callback)
{
	//var timeStamp = Date.now();   //taking system time as unique session id

	//Setting the session ID into userDetails variable
	//var newSessionTokenID = userDetails.userID + timeStamp;
	// Session Token ID = device ID + User ID
	var newSessionTokenID = userDetails.userID + "-" + deviceInfo.UniqueDeviceID ;
	//userDetails.AuthenticateUserReq.SessionTokenId = newSessionTokenID;	
	winston.log("debug", "Session ID created :: [" + newSessionTokenID + "] for user ID " + userDetails.userID );
	winston.log("debug", "is : " + newSessionTokenID + "\n");
	callback (newSessionTokenID) ;
}

exports.validateSessionID = validateSessionID;
exports.storeUserDetailsGetSessionToken = storeUserDetailsGetSessionToken;
exports.checkGetUserId = checkGetUserId;
