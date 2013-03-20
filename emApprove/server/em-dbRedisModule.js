
//////////////////////////////////////////////////////////////////
// Name : dbRedismodule.js										//	
//Created on : 15/10/2010										//
// Description : Module to store and retrive data from Redis	//
// Unique key assumed as of now is : NOTIFICATION_ID 			//	
//This module interacts  with  :  dbModule and dbOracleModule   //
//////////////////////////////////////////////////////////////////

/* define.js :- Include the definations file */
var define = require("./em-define");

/* For logging */
var logModule = require("./em-logModule");
var winston = logModule.getLogModule (); 
var redis = require(define.redisNodeModulePath) ;

/* Global variables */
var redisclient;


/* This funciton Intialise redis client. It will connect to the redis 
*  server and keeps the connection
*/
function initRedisInterface (redisIP, redisPort, callback)
{
	if (redisIP && redisPort)
	{
		winston.log ("debug", "Connect to redis server @ IP [" + redisIP + "] and Port [" + redisPort + "]") ;
		redisclient = redis.createClient(redisPort, redisIP);
	}
	else
	{
		winston.log ("debug", "Connecting to the local redis server by default settings") ;
		redisclient = redis.createClient();
	}

		redisclient.on("error", function (err) {
   		winston.log("debug", "Error " + err);
	});

	
	callback () ;
}

function deinitRedisInterface (callback)
{
	redisclient.quit () ;
	callback () ;
}

/*This function stores the data from 
the xxea_global.XXEA_MOBILITY_PR_APPR_STATUS_V
into the redis db which has both hash and set datatypes*/
function AddWorklistPRRedis(userId, PRWorkListItem, callback)
{
	var redisStorageResult = [] ;

	redisclient.select(define.PRSessionRedisDb,function(err)
	{
		if(err)
		{
			winston.log("debug", "Error in switching to the db");
			redisStorageResult[0] = define.RedisDbError;
			redisStorageResult[1] = define.RedisErrStoringHashKey;
			redisDataType = "HashKey";
			callback(1, redisStorageResult,redisDataType);		
		}
		else
		{
			//Setting the hash and primary key's
			var HashkeyUniqueID = "PR-"+PRWorkListItem.NOTIFICATIONID;
			
			//Defining the Hash Key
			//Adding the Primary key HashkeyUniqueID and its fields

			redisclient.hmset(HashkeyUniqueID, "NOTIFICATIONID", PRWorkListItem.NOTIFICATIONID,
			//"ITEMKEY", PRWorkListItem.ITEMKEY, 
			"REQUISITIONHEADERID", PRWorkListItem.REQUISITIONHEADERID,
			"REQUISITIONNUMBER",	PRWorkListItem.REQUISITIONNUMBER,
			"DESCRIPTION",PRWorkListItem.DESCRIPTION, "AMOUNT",PRWorkListItem.Amount,
			//"MESSAGENAME",PRWorkListItem.MESSAGENAME,
			"STATUS",PRWorkListItem.STATUS,
			"APPROVALREQUESTEDDATE",PRWorkListItem.APPROVALREQUESTEDDATE,"APPROVEDDATE",PRWorkListItem.APPROVEDDATE,
			"APPROVALREQUESTEDBY",PRWorkListItem.APPROVALREQUESTEDBY,
			//"EMERGENCYPONUM",PRWorkListItem.EMERGENCYPONUM,
			"APPROVEREMPLOYEENUMBER", PRWorkListItem.APPROVEREMPLOYEENUMBER,
			//"FROMUSER",PRWorkListItem.FROMUSER, 
			"TOUSER",PRWorkListItem.TOUSER,
			"REQUESTOR",PRWorkListItem.REQUESTOR,
			//"REQUESTOREMPLOYEENUMBER",PRWorkListItem.REQUESTOREMPLOYEENUMBER,
		    function (err)	{
				// Modified by Vinod 
				if(err)
				{
					redisStorageResult[0] = define.RedisDbError;
					redisStorageResult[1] = define.RedisErrStoringHashKey;
					redisDataType = "HashKey";
					callback(1, redisStorageResult,redisDataType);		
				}
				else
				{
					//Defining the set key
					var SetKeyApprEmpNo = userId;

					//Adding hash key into the Employee set 	
					redisclient.sadd(SetKeyApprEmpNo,HashkeyUniqueID, function (err){
						redisDataType = "SetKey";
						if(err)
						{
							redisStorageResult[0] = define.RedisDbError;
							redisStorageResult[1] = define.RedisErrStoringSetKey;
							callback(1, redisStorageResult,redisDataType);
						}
						else
						{
							redisStorageResult[1] = define.RedisSetKeyStoreSucess;
							//Adding hash key into the Employee set 	
							redisclient.sadd(PRWorkListItem.REQUISITIONNUMBER,HashkeyUniqueID, function (err){
								if(err)
								{
									redisStorageResult[0] = define.RedisDbError;
									redisStorageResult[1] = define.RedisErrStoringSetKey;
									callback(1, redisStorageResult,redisDataType);
								}
								else
								{
									redisStorageResult[1] = define.RedisSetKeyStoreSucess;
									callback(0, redisStorageResult,redisDataType);
								}
							});
						}			
					});
				}
			});
		}
	});
  }

/* This function will get the record one by one and populate in the PRListResponseItems
*  array, once all the records are fetched it will send the PRListResponseItems array
*  back to the calling function, with all the fields populated
*/
function processgetAllPRSets (retrivedSets, len, PRListResponseItems, index, callback)
{
	if (len)
	{
		// Call db module for actual getting the values from the database
		redisclient.hgetall(retrivedSets[index], function(err, hashFields) 
		{
			 if(!err && hashFields)
			 {
				//winston.log("Fields of the retrieved set key : ");
				//winston.log(hashFields);
				PR = new Object () ;
				PR.NOTIFICATIONID = hashFields.NOTIFICATIONID;
				winston.log ("debug", "The not id is .." + PR.NOTIFICATIONID) ;
				//PR.ITEMKEY = hashFields.ITEMKEY;
				PR.REQUISITIONHEADERID = hashFields.REQUISITIONHEADERID;
				PR.REQUISITIONNUMBER = hashFields.REQUISITIONNUMBER;
				PR.DESCRIPTION = hashFields.DESCRIPTION;
				PR.Amount = hashFields.AMOUNT;
				PR.CURRENCYCODE = hashFields.CURRENCYCODE;
				//PR.MESSAGENAME = hashFields.MESSAGENAME;
				PR.STATUS = hashFields.STATUS;   
				PR.APPROVALREQUESTEDDATE = hashFields.APPROVALREQUESTEDDATE;
				PR.APPROVEDDATE = hashFields.APPROVEDDATE;
				PR.APPROVALREQUESTEDBY = hashFields.APPROVALREQUESTEDBY;
				//PR.EMERGENCYPONUM = hashFields.EMERGENCYPONUM;
				PR.APPROVEREMPLOYEENUMBER = hashFields.APPROVEREMPLOYEENUMBER;
				//PR.FROMUSER = hashFields.FROMUSER;
				PR.TOUSER = hashFields.TOUSER;
				PR.REQUESTOR = hashFields.REQUESTOR;
				//PR.REQUESTOREMPLOYEENUMBER = hashFields.REQUESTOREMPLOYEENUMBER;
				PRListResponseItems [index] = PR ;
			 }
			 len -- ; // One requests processed, hence reduce the counter
			 index ++ ; // For next Request 
			 processgetAllPRSets (retrivedSets, len, PRListResponseItems, index, function () {
				callback () ; // Call the originating function
			}) ;
		}) ;
	}		
	else
	{
		callback () ; // Call the originating function
	}
}


/*This function retrives the data from the 
redis db based on the employee number [set name] requested */ 
function ViewWorklistPRRedis(userId, filterId, callback)
{
	redisclient.select(define.PRSessionRedisDb,function(err)
	{
		if(err)
		{
			winston.log ("debug", "Error in switching to the db");
			callback (define.FAILURE, null) ;
		}
		else
		{
			//Getting the set key name
			var setKeyName = userId;
			winston.log("debug", "For Employee Number" + setKeyName);
			
			//Displaying all the employee ID set keys in redis 
			redisclient.smembers(setKeyName, function(err,retrivedSets) 
			{	 
				if (err)
				{
					winston.log("debug", "Failed Retrieving the set Key with name");
					winston.log("debug", setKeyName);
					callback (define.FAILURE, null) ;
				}
				else
				{
					PRListResponseItems = [];
					processgetAllPRSets (retrivedSets, retrivedSets.length, PRListResponseItems, 0, function ()
					{
						callback(define.SUCCESS, PRListResponseItems);
					}) ;
				}
		    });  
		}		
	});	
}

/* This function will get the record one by one and populate in the PRDetailedInfoResponseItems
*  array, once all the records are fetched it will send the PRDetailedInfoResponseItems array
*  back to the calling function, with all the fields populated
*/
function processgetAllPRInfoSets (retrivedSets, len, PRDetailedInfoResponseItems, index, callback)
{
	if (len)
	{
		// Call db module for actual getting the values from the database
		redisclient.select(define.PRSessionRedisDb,function(err) {}) ;
		redisclient.hgetall(retrivedSets[index], function(err, hashFields) 
		{
			 if(!err && hashFields)
			 {
				//winston.log("Fields of the retrieved set key for detailed info: ");
				//winston.log(hashFields);
				PR = new Object () ;
				PR.REQUISITIONHEADERID = hashFields.REQUISITIONHEADERID;
				PR.REQUISITIONLINEID = hashFields.REQUISITIONLINEID;
				PR.LINENUM = hashFields.LINENUM;
				PR.DESCRIPTION = hashFields.DESCRIPTION;
				PR.QUANTITY = hashFields.QUANTITY;
				PR.UNITPRICE = hashFields.UNITPRICE;
				PR.CURRENCYCODE = hashFields.CURRENCYCODE;
				PRDetailedInfoResponseItems [index] = PR ;
			 }
			 len -- ; // One requests processed, hence reduce the counter
			 index ++ ; // For next Request 
			 processgetAllPRInfoSets (retrivedSets, len, PRDetailedInfoResponseItems, index, function () {
				callback () ; // Call the originating function
			}) ;
		}) ;
	}
	else
	{
		callback () ; // Call the originating function
	}

}

function ViewPRDetailedInfoReq(REQUISITIONHEADERID, filterId, callback)
{
	redisclient.select(define.PRSessionRedisDb,function(err)
	{
		if(err)
		{
			winston.log("debug", "Error in switching to the db");
			callback (define.FAILURE, null) ;
		}
		else
		{
			//Getting the set key name
			var setKeyName = REQUISITIONHEADERID;
			winston.log("debug", "For Req. HeaderID " + setKeyName);
			
			//Displaying all the employee ID set keys in redis 
			redisclient.smembers(setKeyName, function(err,retrivedSets) 
			{	 
				if (err)
				{
					winston.log("debug", "Failed Retrieving the set Key with name");
					winston.log("debug", setKeyName);
					callback (define.FAILURE, null) ;
				}
				else
				{
					PRDetailedInfoResponseItems = [];
					//winston.log("Set Key is " + setKeyName);
					//winston.log("Retrieved Sets are LINE ID " + retrivedSets);
					processgetAllPRInfoSets (retrivedSets, retrivedSets.length, PRDetailedInfoResponseItems, 0, function ()
					{
						//winston.log(PRDetailedInfoResponseItems);
						callback(define.SUCCESS, PRDetailedInfoResponseItems);
					}) ;
				}
		    }); 
		}		
	});
}
//Method Name : RetrieveSessionDetail
//Parameters : userDetailsReq, callRetrivedSessionDetails
//Description : Retrieve the user details with session token from Redis DB and passes to SessionModule
//Other Module Fields involved : sessionModule.js
//Values passed to other modules : retUserDetailsResp[]
//Redis Datatype Involved : Set, Hash
//SetKey : UserID; HashKey : SessionToken

function RetrieveSessionDetail(sessionTokenId, callback)
{
	winston.log ("debug", "Inside RetrieveSessionDetail");
	redisclient.select(define.commonRedisDb,function(err)
	{
		var userDetails = new Object () ;
		userDetails.username = "" ;
		userDetails.password = "" ;
		userDetails.userID = "" ;
		userDetails.sessionTokenId = "" ;
		winston.log ("debug", "For retrieving session details for session token " + sessionTokenId);			

		if(err)
		{
			winston.log("debug", "Error in switching to the db");
			callback (define.UNAUTHORISED_STATUS, userDetails) ;
		}
		else
		{
			/* Get the details from the redis db */
			redisclient.hgetall(sessionTokenId, function(err, hashFields) 
			{
				if(err || (hashFields == null))
				{
					winston.log("debug", "Failed to get session details for session token " + sessionTokenId);
					callback (define.UNAUTHORISED_STATUS, userDetails) ;
				}
				else
				{
					winston.log("debug", "!!!!User details retrived!!!!");			
					// Check if the session is active or not. In case the session is not active then return back the error
					if (hashFields.ACTIVE == 0)
					{
						winston.log ("debug", "The session details are present and the session has become inactive. Hence rejecting the authentication request\n") ;
						callback (define.UNAUTHORISED_STATUS, userDetails) ;
					}
					else
					{
						userDetails.username =  hashFields.USERNAME;
						//userDetails.password = hashFields.PASSWORD ;
						userDetails.userID = hashFields.USERID ;
						userDetails.sessionTokenId = hashFields.SESSIONTOKEN ;		
						userDetails.DNAME = hashFields.DNAME ;		
						userDetails.DVERSION = hashFields.DVERSION ;		
						userDetails.DUID = hashFields.DUID ;		
						userDetails.DPLATFORM = hashFields.DPLATFORM ;		
						callback (define.REQ_SUCCESS, userDetails) ;
					}
				}
			});					
			return ;
		}
	});
}



//Method Name : StoreSessionDetail
// out :: function (status)
function StoreSessionDetail (sessionToken, userDetails, deviceInfo, userLdapDetails, callback) 
{
	redisclient.select(define.commonRedisDb,function(err)
	{
		if(err)
		{
			winston.log("debug", "Error in switching to the db");
			callback (define.UNAUTHORISED_STATUS) ;
		}
		else
		{
			winston.log ("debug", "usernamename is " + userDetails.username) ;
			winston.log ("debug", "userDetails.userID is " + userDetails.userID) ;
			winston.log ("debug", "session token is " + sessionToken) ;
			winston.log ("debug", "DNAME token is " + deviceInfo.DeviceName) ;
			winston.log ("debug", "deviceInfo.UniqueDeviceID is " + deviceInfo.UniqueDeviceID) ;
			winston.log ("debug", "deviceInfo.DeviceVersion token is " + deviceInfo.DeviceVersion) ;
			winston.log ("debug", "deviceInfo.Platform token is " + deviceInfo.Platform) ;
			winston.log ("debug", "deviceInfo.reg id is " + deviceInfo.RegistrationId) ;
			winston.log ("debug", "given name is " + userLdapDetails.givenName );
			winston.log ("debug", "second name is " + userLdapDetails.sn);
			winston.log ("debug", "title name is " + userLdapDetails.title ) ;

			/*console.log ("userDetails.userID token is " + userDetails.userID) ;
			console.log ("deviceInfo.DeviceVersion token is " + deviceInfo.DeviceVersion) ;
			console.log ("deviceInfo.UniqueDeviceID token is " + sessionToken) ;
			console.log ("session token is " + sessionToken) ;
			console.log ("deviceInfo.GIVENNAME token is " + userLdapDetails.givenName) ;*/

			//Setting the hash key as SessionToken and hash value as user detail fields
			//redisclient.hmset(sessionToken, "USERNAME", userDetails.username,"PASSWORD", userDetails.password,
			redisclient.hmset(sessionToken, "USERNAME", userDetails.username, "ACTIVE", "1",
				"USERID", userDetails.userID, "SESSIONTOKEN", sessionToken, "DNAME", deviceInfo.DeviceName,
				"DVERSION", deviceInfo.DeviceVersion, "DUID", deviceInfo.UniqueDeviceID, 
				"REGID", deviceInfo.RegistrationId,
				"DPLATFORM", deviceInfo.Platform, "GIVENNAME", userLdapDetails.givenName, "SECONDNAME",  userLdapDetails.sn,
				"TITLE", userLdapDetails.title, function (err)	
				{
					if(err)
					{	// return an error
						winston.log ("debug", "ERRROR >>>>>>>>>>>>> while creating session token record in redisdb\n");
						callback (define.UNAUTHORISED_STATUS) ;
					}
					else
					{  
						var userSessionKey = userDetails.userID + "-SESSION"
						// We need to put the details in User Session queue
						redisclient.sadd(userSessionKey, sessionToken, function (err)
						{
						}) ;
						// return success
						callback (define.REQ_SUCCESS) ;
					}
			}) ;
		}
	});
}


/* This function checks if the session details is there and then sets the active state to 1 */
function checkSessionDetail (sessionToken, callback)
{
	redisclient.select(define.commonRedisDb,function(err)
	{		
		if(err)
		{
			winston.log ("debug", 'Error in switching to the db');
			callback (0) ;
		}
		else
		{
			// Check if the session Token is there 
			redisclient.exists (sessionToken, function (err, result)
			{
				if (!result) // Not present
				{
					winston.log ("debug", "Session Details not present in session repository. Hence the session details to be written\n") ;
					callback (result) ;
				}
				else	// Present. We should not set the Active Flag to 1
				{
					winston.log ("debug", "Session Details was already present. Restting the ACTIVE flag to 1\n") ;
					redisclient.hset (sessionToken, "ACTIVE", "1", function (err, result)
					{
						callback (1) ;
					}) ;
				}
			}) ;
		}
	});
}
		
/*This function retrives the data from the 
redis db based on the requisition Number [set name] requested */ 
function ViewHistoryPRRedis(reqNo, filterId, callback)
{
	redisclient.select(define.PRSessionRedisDb,function(err)
	{
		if(err)
		{
			winston.log ("debug", 'Error in switching to the db');
			callback (define.FAILURE, null) ;
		}
		else
		{
			//Getting the set key name
			var setKeyName = reqNo;
			winston.log("debug", "For Requisition Number" + setKeyName);
			
			//Displaying all the Requisition Number set keys in redis 
			redisclient.smembers(setKeyName, function(err,retrivedSets) 
			{	 
				if (err)
				{
					winston.log("debug", "Failed Retrieving the set Key with name" + setKeyName);
					callback (define.FAILURE, null) ;
				}
				else
				{
					PRHistoryListResponseItems = [];
					processgetAllPRSets (retrivedSets, retrivedSets.length, PRHistoryListResponseItems, 0, function ()
					{
						callback(define.SUCCESS, PRHistoryListResponseItems);
					}) ;
				}
		    });   
		}		
	});	
}

function checkKeyExists (refDb, keyName, callback)
{	
	redisclient.select(refDb,function(err)
	{
		if(err)
		{
			winston.log ("debug", 'Error in switching to the db');
			callback (1, null) ;
		}
		else
		{
			redisclient.exists (keyName, function (err, result)
			{
				callback (err, result) ;
			}) ;
		}
	});
}
	

function addSet (setkeyName, setValue, callback)
{
	redisclient.sadd(setkeyName, setValue, function (err)
	{
		callback (err) ;
	}) ;
}

function renameKey (oldKeyName, newKeyName, callback)
{
	redisclient.rename (oldKeyName, newKeyName, function (err){
		callback (err) ;
	}) ;
}

function quit ()
{
	redisclient.quit () ;
}

function sdiffSet (setA, setB, callback)
{
	redisclient.sdiff (setA, setB, function (err, result) {
		callback (err, result) ;
	}) ;
}


function AddWorklistPRRedisMulti(redisclientMulti, userId, PRWorkListItem, callback)
{
	var redisStorageResult = [] ;

	redisclient.select(define.PRSessionRedisDb,function(err)
	{
		if(err)
		{
			winston.log ("debug", 'Error in switching to the db');
			redisStorageResult[0] = define.RedisDbError;
			redisStorageResult[1] = define.RedisErrStoringHashKey;
			redisDataType = "HashKey";
			callback(1, redisStorageResult,redisDataType);		
		}
		else
		{
			//Setting the hash and primary key's
			var HashkeyUniqueID = "PR-"+PRWorkListItem.NOTIFICATIONID;
			
			//Defining the Hash Key
			//Adding the Primary key HashkeyUniqueID and its fields
			redisclientMulti.hmset(HashkeyUniqueID, "NOTIFICATIONID", PRWorkListItem.NOTIFICATIONID,
			//"ITEMKEY", PRWorkListItem.ITEMKEY, 
			"REQUISITIONHEADERID", PRWorkListItem.REQUISITIONHEADERID,
			"REQUISITIONNUMBER",	PRWorkListItem.REQUISITIONNUMBER,
			"DESCRIPTION",PRWorkListItem.DESCRIPTION, "AMOUNT",PRWorkListItem.Amount,
			//"MESSAGENAME",PRWorkListItem.MESSAGENAME,
			"STATUS",PRWorkListItem.STATUS,
			"APPROVALREQUESTEDDATE",PRWorkListItem.APPROVALREQUESTEDDATE,"APPROVEDDATE",PRWorkListItem.APPROVEDDATE,
			"APPROVALREQUESTEDBY",PRWorkListItem.APPROVALREQUESTEDBY,
			//"EMERGENCYPONUM",PRWorkListItem.EMERGENCYPONUM,
			"APPROVEREMPLOYEENUMBER", PRWorkListItem.APPROVEREMPLOYEENUMBER,
			//"FROMUSER",PRWorkListItem.FROMUSER, 
			"TOUSER",PRWorkListItem.TOUSER,
			"REQUESTOR",PRWorkListItem.REQUESTOR,
			//"REQUESTOREMPLOYEENUMBER",PRWorkListItem.REQUESTOREMPLOYEENUMBER,
		    function (err)	{
				// Modified by Vinod 
				if(err)
				{
					redisStorageResult[0] = define.RedisDbError;
					redisStorageResult[1] = define.RedisErrStoringHashKey;
					redisDataType = "HashKey";
					callback(1, redisStorageResult,redisDataType);		
				}
				else
				{
					//Defining the set key
					var SetKeyApprEmpNo = userId;

					//Adding hash key into the Employee set 	
					redisclientMulti.sadd(SetKeyApprEmpNo,HashkeyUniqueID, function (err){
						redisDataType = "SetKey";
						if(err)
						{
							redisStorageResult[0] = define.RedisDbError;
							redisStorageResult[1] = define.RedisErrStoringSetKey;
							callback(1, redisStorageResult,redisDataType);
						}
						else
						{
							redisStorageResult[1] = define.RedisSetKeyStoreSucess;
							//Adding hash key into the Employee set 	
							redisclientMulti.sadd(PRWorkListItem.REQUISITIONNUMBER,HashkeyUniqueID, function (err){
								if(err)
								{
									redisStorageResult[0] = define.RedisDbError;
									redisStorageResult[1] = define.RedisErrStoringSetKey;
									callback(1, redisStorageResult,redisDataType);
								}
								else
								{
									redisStorageResult[1] = define.RedisSetKeyStoreSucess;
									callback(0, redisStorageResult,redisDataType);
								}
							});
						}			
					});
				}
			});
		}
	});
}


// This function will invalidate the session token. 
function InvalidateSessionToken(sessionTokenId, callback)
{
	redisclient.select(define.commonRedisDb,function(err)
	{
		if(err)
		{
			winston.log ("debug", 'Error in switching to the db');
			callback (1) ;
		}
		else
		{
			winston.log ("debug", "In the function InvalidateSessionToken. Invalidate session token [" + sessionTokenId + "]\n") ;
			// check if the token is present 
			redisclient.exists (sessionTokenId, function (err, result)
			{
				if (result)
				{
					// set the active flag to 0 of the session Token hash
					redisclient.hset (sessionTokenId, "ACTIVE", "0", function (err, result)
					{
						// We will also delete the registration id while invalidating the session
						//redisclient.select(define.PRSessionRedisDb,function(err) {}) ;
						//redisclient.hdel (sessionTokenId, "REGID", function (err, result) 
						//{
						//	callback (1) ;
						//}) ;
					}) ;
					callback (1) ;
				}
				else
				{
					callback (1) ;
				}
			}) ;
		}
	});
}


/* This function will store the worklisttypes in the session details */
function StoreWorkListDetail(SessionTokenId, userDetails, worklistApprTypes, callback)
{
	redisclient.select(define.commonRedisDb,function(err)
	{
		if(err)
		{
			winston.log ("debug", 'Error in switching to the db');
			callback (1) ;
		}
		else
		{
			redisclient.hmset (SessionTokenId, "PRSUPPORT", worklistApprTypes.PRSupport, "POSUPPORT", worklistApprTypes.POSupport,
				"EXPENSESUPPORT", worklistApprTypes.ExpenseSupport, "TRADEPROMOTIONSUPPORT", worklistApprTypes.TradePromotionsupport, function (err, result)
				{
					winston.log ("debug", "Updated session details with the worklist types support...\n") ;
					callback (1) ;
				}) ;
		}
	});
}


/* This function will store the regid in the session details */
function StoreRegID(SessionTokenId, userDetails, regID, callback)
{
	redisclient.select(define.commonRedisDb,function(err)
	{
		if(err)
		{
			winston.log ("debug", 'Error in switching to the db');
			callback (1) ;
		}
		else
		{
			redisclient.hmset (SessionTokenId, "REGID", regID, function (err, result)
			{
				winston.log ("debug", "Updated session details with the registration id..\n") ;
				callback (1) ;
			}) ;
		}
	});
}



/* This function will store the regid in the session details */
function delRegID(SessionTokenId, userDetails, regID, callback)
{
	redisclient.select(define.commonRedisDb,function(err)
	{
		if(err)
		{
			winston.log ("debug", 'Error in switching to the db');
			callback (1) ;
		}
		else
		{
			redisclient.hdel (SessionTokenId, "REGID", function (err, result)
			{
				winston.log ("debug", "deleted registration id..\n") ;
				callback (1) ;
			}) ;
		}
	});
}



/*This function removes the notification ID of the PR approval request from the redis db*/
function RemoveApproveRejectItemRedis(userDetails,ApprItemNotificationID,apprWorklistReqType,callback)
{
	/* Modified by Vinod  for RequestType  */
	/////////////////////////////////////////////////////////////////
	var dbselected;
	console.log('apprWorklistReqType : ' + apprWorklistReqType);
	if(apprWorklistReqType == 'IE')
	{
		dbselected = define.IERedisDb;
	}
	else if(apprWorklistReqType == 'PR')
	{
		dbselected = define.PRSessionRedisDb;
	}
	else if(apprWorklistReqType == 'JE')
	{
		dbselected = define.JERedisDb;
	}
	winston.log("debug", "Request Type is : " + apprWorklistReqType + " and dbSelected is " + dbselected);
	console.log('dbselected ' + dbselected);	
	redisclient.select(dbselected,function(err)
	///////////////////////////////////////////////////////////////////////	
	{
		console.log('inside dbselected');
		if(err)
		{
			console.log('Error in switching to the db');
		}
		else
		{
			//Setting the hash and primary key's
			var NotificationIDToBeDeleted = apprWorklistReqType + '-' + ApprItemNotificationID;	//Modified by Vinod  for RequestType
			var userID = userDetails.userID;
			var redisApprovalUpdationResult = [];				
			//callback(0,1);  // return success For testing
			console.log('NotificationIDToBeDeleted' + NotificationIDToBeDeleted);
			//To check the hashkey notification ID exists or not
			redisclient.exists(NotificationIDToBeDeleted, function(err,result)
			{
				console.log('NotificationIDToBeDeleted ' + NotificationIDToBeDeleted);
				console.log('result of deletion' + result);
				if(result)
				{
					//Deleting the notification from the user notification ID list  
					redisclient.srem(userID, NotificationIDToBeDeleted, function(err,setMemberDeletionResult)
					{
						if(err)
						{
							winston.log("debug", "Error in deleting notification ID set member " + NotificationIDToBeDeleted + " from the user ID set " + userID + " from redis DB");
							callback(1,1);  // return Error
						}
						else
						{
							// We shall now delete the hash key 
							redisclient.del(NotificationIDToBeDeleted, function(err,result)
							{		
								if(err)
								{
									winston.log("debug", "Error in deleting the notification ID hash key " + NotificationIDToBeDeleted + " from redis DB");			
								}
								else 
								{
									winston.log("debug", "Deleted the notification ID hash key " + NotificationIDToBeDeleted + " from redis DB");	
									//callback(define.REQ_SUCCESS,define.statusTextSuccessPRApprovalRes);								
								}				
							});
							callback(0,1);  // return success
						}
					});			
				}
				else
				{
					winston.log("debug", "Notification ID hash key " + NotificationIDToBeDeleted + " doesn't exist in redis DB");			
					//callback(1,1); // Return error
					callback(0,1); // Return success
				}
			});	
		}
	});	
}


function checkGetUserId (sessionToken, callback )
{
	redisclient.select(define.commonRedisDb,function(err)
	{
		if(err)
		{
			winston.log ("debug", 'Error in switching to the db');
			callback (1, null) ;
		}
		else
		{
			redisclient.hget(sessionToken, "USERID", function(err, result) 
			{
				if(err || (result == null))
				{
					winston.log("debug", "Failed to get session details for session token " + sessionToken);
					callback (1, null) ;
				}
				else
				{
					winston.log("debug", "!!!!User ID retrived. User id is [" +  result + "] !!!!");			
					callback (0, result) ;
				}
			}) ;
		}
	});
}

function StoreUAProfDetails (sessionToken, userDetails, deviceInfo, userLdapDetails, callback) 
{
	redisclient.select(define.commonRedisDb,function(err)
	{
		if(err)
		{
			winston.log ("debug", 'Error in switching to the db');
			callback (0) ;
		}
		else
		{
			var uaProfKey = userDetails.userID + "-UAPROF" ;
			var userDevProfKey = userDetails.userID + "-" + deviceInfo.UniqueDeviceID + "-DEVICEPROF"
			
			winston.log ("debug", "The uaProf Key is [" + uaProfKey + "] and userDevProfKey is [" + userDevProfKey + "]\n") ;
			redisclient.hmset(uaProfKey, "USERNAME", userDetails.username, "USERID", userDetails.userID, "SNAME", userLdapDetails.sn,
				"GIVENNAME", userLdapDetails.givenName, "TITLE", userLdapDetails.title, function (err)	
			{
				if(err)
				{	// Error
					winston.log ("debug", "Error: Writing the db entry for UAPROF\n") ;
				}
				else
				{  // return success
					winston.log ("debug", "Succesfull: Writing the db entry for UAPROF\n") ;
				}
			}) ;

			redisclient.hmset(userDevProfKey, "DNAME", deviceInfo.DeviceName, "DVERSION", deviceInfo.DeviceVersion, "DUID", deviceInfo.UniqueDeviceID,
				"DPLATFORM", deviceInfo.Platform, function (err)	
			{
				if(err)
				{	// Error
					winston.log ("debug", "Error: Writing the db entry for DEVPROF\n") ;
				}
				else
				{  // return success
					winston.log ("debug", "Succesfull: Writing the db entry for DEVPROF\n") ;
				}
			}) ;	
			callback (0) ;
		}
	});
}


/* This function will store the worklisttypes in the Device Profile details of the user */
function StoreDevProfileDetail(SessionTokenId, userDetails, worklistApprTypes, callback)
{
	redisclient.select(define.commonRedisDb,function(err)
	{
		if(err)
		{
			winston.log ("debug", 'Error in switching to the db');
			callback (0) ;
		}
		else
		{
			var userDevProfKey = userDetails.userID + "-" + userDetails.DUID + "-DEVPROFILE" ;
			
			winston.log ("The userDevProfKey is [" + userDevProfKey + "]\n") ;
			redisclient.hmset(userDevProfKey, "PRSUPPORT", worklistApprTypes.PRSupport, "POSUPPORT", worklistApprTypes.POSupport,
				"EXPENSESUPPORT", worklistApprTypes.ExpenseSupport, "TRADEPROMOTIONSUPPORT", worklistApprTypes.TradePromotionsupport, function (err, result)
			{
				winston.log ("debug", "Updated session details with the worklist types support...\n") ;
				callback (1) ;
			}) ;
		}
	});
}

//IE Expense Report Redis functions


//IE Worklist [This method will be done by the ERP Sync tool as done for PR Worklist; just a sample function]
/*This function stores the data from 
the XXEA_MOBILITY_IE_APPR_STATUS_V
into the redis db which has both hash and set datatypes*/
function AddWorklistIERedis(userId, IEWorkListItem, callback)
{	
	var redisStorageResult = [] ;
	redisclient.select(define.IERedisDb, function(err)
	{	
		if(err)
		{
			winston.log ("debug", 'Error in switching to the db');
			redisStorageResult[0] = define.RedisDbError;
			redisStorageResult[1] = define.RedisErrStoringHashKey;
			redisDataType = "HashKey";
			callback(1, redisStorageResult,redisDataType);		
		}
		else
		{
			//Setting the hash and primary key's
			winston.log ("debug", 'usrID' + userId);
			winston.log ("debug", 'IEWorkListItem' + IEWorkListItem);
			winston.log ("debug", 'IEWorkListItem.NOTIFICATIONID' + IEWorkListItem.NOTIFICATIONID);
			var HashkeyUniqueID = "IE-"+IEWorkListItem.NOTIFICATIONID;
			
			//Defining the Hash Key
			//Adding the Primary key HashkeyUniqueID and its fields
			redisclient.hmset(HashkeyUniqueID, "NOTIFICATIONID", IEWorkListItem.NOTIFICATIONID,	
			"REPORTHEADERID",	IEWorkListItem.REPORTHEADERID,
			"IEXPENSENUMBER", IEWorkListItem.IEXPENSENUMBER,
			"DESCRIPTION",IEWorkListItem.DESCRIPTION, 
			"AMOUNT",IEWorkListItem.AMOUNT,
			"CURRENCYCODE",IEWorkListItem.CURRENCYCODE,
			"REPORTSUBMITTEDDATE",IEWorkListItem.REPORTSUBMITTEDDATE,	
			"APPROVALREQUESTEDDATE", IEWorkListItem.APPROVALREQUESTEDDATE,
			"APPROVEDDATE", IEWorkListItem.APPROVEDDATE,
			"APPROVALREQUESTEDBY", IEWorkListItem.APPROVALREQUESTEDBY,
			"APPROVEREMPLOYEENUMBER", IEWorkListItem.APPROVEREMPLOYEENUMBER,	
			"TOUSER", IEWorkListItem.TOUSER,
			"FROMUSER", IEWorkListItem.FROMUSER,
			"REQUESTOR", IEWorkListItem.REQUESTOR,
			"STATUS", IEWorkListItem.STATUS,			
			"COSTCENTER", IEWorkListItem.COSTCENTER,	
		    function (err)	{
				// Modified by Vinod 
				if(err)
				{
					redisStorageResult[0] = define.RedisDbError;
					redisStorageResult[1] = define.RedisErrStoringHashKey;
					redisDataType = "HashKey";
					callback(1, redisStorageResult,redisDataType);		
				}
				else
				{
					//Defining the set key
					var SetKeyApprEmpNo = userId;

					//Adding hash key into the Employee set 	
					redisclient.sadd(SetKeyApprEmpNo,HashkeyUniqueID, function (err){
						redisDataType = "SetKey";
						if(err)
						{
							redisStorageResult[0] = define.RedisDbError;
							redisStorageResult[1] = define.RedisErrStoringSetKey;
							callback(1, redisStorageResult,redisDataType);
						}
						else
						{
							redisStorageResult[1] = define.RedisSetKeyStoreSucess;
							//Adding Notification ID's into IEXPENSENUMBER for history items
							redisclient.sadd(IEWorkListItem.IEXPENSENUMBER,HashkeyUniqueID, function (err){
								if(err)
								{
									redisStorageResult[0] = define.RedisDbError;
									redisStorageResult[1] = define.RedisErrStoringSetKey;
									callback(1, redisStorageResult,redisDataType);
								}
								else
								{
									redisStorageResult[1] = define.RedisSetKeyStoreSucess;
									callback(0, redisStorageResult,redisDataType);
								}
							});					
						}			
					});
				}
			});
		}
	});
}

/*This function retrives the data from the 
redis db based on the employee number [set name] requested */ 

function ViewWorklistIERedis(userId, filterId, callback)
{
	redisclient.select(define.IERedisDb,function(err)
	{
		if(err)
		{
			winston.log ("debug", 'Error in switching to the db');
			callback (define.FAILURE, null) ;
		}
		else
		{
			winston.log ("info", "In the function ViewWorklistIERedis") ;
			//Getting the set key name
			var setKeyName = userId;
			winston.log("debug", "For Employee Number" + setKeyName);
			
			//Displaying all the employee ID set keys in redis 
			redisclient.smembers(setKeyName, function(err,retrivedSets) 
			{	 
				if (err)
				{
					winston.log("debug", "Failed Retrieving the set Key with name");
					winston.log("debug", setKeyName);
					callback (define.FAILURE, null) ;
				}
				else
				{
					IEListResponseItems = [];
					//console.log('Total smembers ' + retrivedSets.length);
					processgetAllIESets (retrivedSets, retrivedSets.length, IEListResponseItems, 0, function ()
					{
						callback(define.SUCCESS, IEListResponseItems);
					}) ;
				}
		    }); 
		}		
	});
}


/* This function will get the record one by one and populate in the IEListResponseItems
*  array, once all the records are fetched it will send the IEListResponseItems array
*  back to the calling function, with all the fields populated
*/
function processgetAllIESets (retrivedSets, len, IEListResponseItems, index, callback)
{		
	if (len)
	{
		// Call db module for actual getting the values from the database		
        redisclient.select(define.IERedisDb,function(err) {}) ;
		redisclient.hgetall(retrivedSets[index], function(err, hashFields) 
		{
			 if(!err && hashFields)
			 {
				//winston.log("Fields of the retrieved set key : ");
				//winston.log(hashFields);
				IE = new Object () ;
				IE.NOTIFICATIONID = hashFields.NOTIFICATIONID;
				IE.REPORTHEADERID = hashFields.REPORTHEADERID;
				IE.IEXPENSENUMBER = hashFields.IEXPENSENUMBER;
				IE.DESCRIPTION = hashFields.DESCRIPTION;
				IE.AMOUNT = hashFields.AMOUNT;
				IE.CURRENCYCODE = hashFields.CURRENCYCODE;
				IE.REPORTSUBMITTEDDATE = hashFields.REPORTSUBMITTEDDATE;				
				IE.APPROVALREQUESTEDDATE = hashFields.APPROVALREQUESTEDDATE;
				IE.APPROVEDDATE = hashFields.APPROVEDDATE;
				IE.APPROVALREQUESTEDBY = hashFields.APPROVALREQUESTEDBY;
				IE.APPROVEREMPLOYEENUMBER = hashFields.APPROVEREMPLOYEENUMBER;				
				IE.TOUSER = hashFields.TOUSER;
				IE.FROMUSER = hashFields.FROMUSER;
				IE.REQUESTOR = hashFields.REQUESTOR;
				IE.STATUS = hashFields.STATUS;									
				IE.COSTCENTER = hashFields.COSTCENTER;
				IEListResponseItems [index] = IE ;
			 }
			 else if(err)
			 {
				winston.log ("debug", 'error in ret' + retrivedSets[index]);
			 }
			 len -- ; // One requests processed, hence reduce the counter
			 index ++ ; // For next Request 
			 processgetAllIESets (retrivedSets, len, IEListResponseItems, index, function () {
				callback () ; // Call the originating function
			}) ;
		}) ;
	}
	else
	{
		callback () ; // Call the originating function
	}
}


/*This function retrives the data from the 
redis db based on the iexpense Number [set name] requested */ 
function ViewHistoryIERedis(expNo, filterId, callback)
{
	redisclient.select(define.IERedisDb,function(err)
	{
		if(err)
		{
			winston.log ("debug", 'Error in switching to the db');
			callback (define.FAILURE, null) ;
		}
		else
		{
			//Getting the set key name
			var setKeyName = expNo;
			winston.log("debug", "For IExpense Number" + setKeyName);
			
			//Displaying all the Requisition Number set keys in redis 
			redisclient.smembers(setKeyName, function(err,retrivedSets) 
			{	 
				if (err)
				{
					winston.log("debug", "Failed Retrieving the set Key with name" + setKeyName);
					callback (define.FAILURE, null) ;
				}
				else
				{
					IEHistoryListResponseItems = [];
					processgetAllIESets (retrivedSets, retrivedSets.length, IEHistoryListResponseItems, 0, function ()
					{
						callback(define.SUCCESS, IEHistoryListResponseItems);
					}) ;
				}
		    });   
		}		
	});	
}

function ViewIEDetailedInfoReq(REPORTHEADERID, filterId, callback)
{
	redisclient.select(define.IERedisDb,function(err)
	{
		if(err)
		{
			winston.log ("debug", 'Error in switching to the db');
			callback (define.FAILURE, null) ;
		}
		else
		{
			//Getting the set key name
			var setKeyName = REPORTHEADERID;
			winston.log("debug", "For Report HeaderID " + setKeyName);
			
			//Displaying all the employee ID set keys in redis 
			redisclient.smembers(setKeyName, function(err,retrivedSets) 
			{	 
				if (err)
				{
					winston.log("debug", "Failed Retrieving the set Key with name");
					winston.log("debug", setKeyName);
					callback (define.FAILURE, null) ;
				}
				else
				{
					IEDetailedInfoResponseItems = [];
					//winston.log("Set Key is " + setKeyName);
					//console.log("retrivedSets.length : " + retrivedSets.length);	
					//console.log("Retrieved Sets are; Report HeaderId-DistLineNum : " + retrivedSets);														
					processgetAllIEInfoSets(retrivedSets, retrivedSets.length, IEDetailedInfoResponseItems, 0, function ()
					{
						//winston.log(IEDetailedInfoResponseItems);
						callback(define.SUCCESS, IEDetailedInfoResponseItems);
					}) ;
				}
		    }); 
		}		
	});
}

//IE Worklist
/* IE Worklist This function will get the record one by one and populate in the IEDetailedInfoResponseItems
*  array, once all the records are fetched it will send the IEDetailedInfoResponseItems array
*  back to the calling function, with all the fields populated
*/
function processgetAllIEInfoSets (retrivedSets, len, IEDetailedInfoResponseItems, index, callback)
{
	if (len)
	{
		// Call db module for actual getting the values from the database
		
		redisclient.select(define.IERedisDb,function(err) {}) ;
		redisclient.hgetall(retrivedSets[index], function(err, hashFields) 
		{
			 if(!err && hashFields)
			 {
				//winston.log("Fields of the retrieved set key for detailed info: ");
				//winston.log(hashFields);
				IE = new Object () ;
				IE.REPORTHEADERID = hashFields.REPORTHEADERID;
				IE.NOTIFICATIONID = hashFields.NOTIFICATIONID;
				IE.DISTRIBUTIONLINENUMBER = hashFields.DISTRIBUTIONLINENUMBER;
				IE.DESCRIPTION = hashFields.DESCRIPTION;				
				IE.AMOUNT = hashFields.AMOUNT;
				IE.CURRENCYCODE = hashFields.CURRENCYCODE;
				IE.JUSTIFICATION = hashFields.JUSTIFICATION;				
				IE.GLACCOUNT = hashFields.GLACCOUNT;								
				IEDetailedInfoResponseItems [index] = IE ;				
			 }
			 len -- ; // One requests processed, hence reduce the counter
			 index ++ ; // For next Request 
			 processgetAllIEInfoSets (retrivedSets, len, IEDetailedInfoResponseItems, index, function () {
				callback () ; // Call the originating function
			}) ;
		}) ;
	}
	else
	{
		callback () ; // Call the originating function
	}
}

/* Journal Entry Worklist related Redis DB methods */

/*This function retrives the data from the 
redis db based on the employee number [set name] requested */ 

function ViewWorklistJERedis(userId, filterId, callback)
{
	redisclient.select(define.JERedisDb,function(err)
	{
		if(err)
		{
			winston.log ("debug", 'Error in switching to the db');
			callback (define.FAILURE, null) ;
		}
		else
		{
			winston.log ("info", "In the function ViewWorklistJERedis") ;
			//Getting the set key name
			var setKeyName = userId;
			winston.log("debug", "For Employee Number" + setKeyName);
			
			//Displaying all the employee ID set keys in redis 
			redisclient.smembers(setKeyName, function(err,retrivedSets) 
			{	 
				if (err)
				{
					winston.log("debug", "Failed Retrieving the set Key with name");
					winston.log("debug", setKeyName);
					callback (define.FAILURE, null) ;
				}
				else
				{
					JEListResponseItems = [];
					//console.log('Total smembers ' + retrivedSets.length);
					processgetAllJESets (retrivedSets, retrivedSets.length, JEListResponseItems, 0, function ()
					{
						callback(define.SUCCESS, JEListResponseItems);
					}) ;
				}
		    }); 
		}		
	});
}


/* This function will get the record one by one and populate in the JEListResponseItems
*  array, once all the records are fetched it will send the JEListResponseItems array
*  back to the calling function, with all the fields populated
*/
function processgetAllJESets (retrivedSets, len, JEListResponseItems, index, callback)
{		
	if (len)
	{
		// Call db module for actual getting the values from the database		
        redisclient.select(define.JERedisDb,function(err) {}) ;
		redisclient.hgetall(retrivedSets[index], function(err, hashFields) 
		{
			 if(!err && hashFields)
			 {
				//winston.log("Fields of the retrieved set key : ");
				//winston.log(hashFields);
				JE = new Object () ;
				JE.NOTIFICATIONID = hashFields.NOTIFICATIONID;
				JE.ITEMKEY = hashFields.ITEMKEY;
				JE.MESSAGENAME = hashFields.MESSAGENAME;
				JE.STATUS = hashFields.STATUS;
				JE.APPROVALREQUESTEDDATE = hashFields.APPROVALREQUESTEDDATE;
				JE.APPROVEDDATE = hashFields.APPROVEDDATE;
				JE.RESPONDERID = hashFields.RESPONDERID;				
				JE.JEBATCHNAME = hashFields.JEBATCHNAME;
				JE.FROMUSER = hashFields.FROMUSER;				
				JE.TOUSER = hashFields.TOUSER;	
				JEListResponseItems [index] = JE ;
			 }
			 else if(err)
			 {
				winston.log ("debug", 'error in ret' + retrivedSets[index]);
			 }
			 len -- ; // One requests processed, hence reduce the counter
			 index ++ ; // For next Request 
			 processgetAllJESets (retrivedSets, len, JEListResponseItems, index, function () {
				callback () ; // Call the originating function
			}) ;
		}) ;
	}
	else
	{
		callback () ; // Call the originating function
	}
}

/* For Notification Dispatcher FROM HERE */

/* This function reads all the notifications from the notification 
*  queue (NOTIFICATION_QUEUE).
*/
function ReadProcessNotificationQueue(callback)
{
	redisclient.select(define.commonRedisDb,function(err)    //commonRedisDb can be changed based on the DB used for user details
	{
		if(err)
		{
			console.log('Error in switching to the db');
			//callback (define.FAILURE, null) ;
			callback (define.FAILURE) ;
		}
		else
		{
			//Getting the set key name
			var setNotQueueKeyName = define.NotificationQueueSetKey;
			winston.log("debug", "Reading Notification Queue set key with name : " + setNotQueueKeyName);
			
			redisclient.smembers(setNotQueueKeyName, function(err,retrivedNotificationIDs) 
			{
				winston.log ("debug", "err is [" + err + "] and retnotid is [" + retrivedNotificationIDs + "]") ;
				if (err || retrivedNotificationIDs.length == 0)
				{
					winston.log("debug", "NOTIFICATION_QUEUE is empty");
					//callback (define.FAILURE, null, null) ;
					callback (define.FAILURE) ;
				}
				else
				{
					ResponseList = [];
					processgetAllNotificationIDHashFields(retrivedNotificationIDs, retrivedNotificationIDs.length, ResponseList, 0, function ()
					//processAllNotificationQueue (retrivedSets, retrivedSets.length, ResponseList, 0, function ()
					{
						//callback(define.SUCCESS, NotificationIDHashFields, retrivedNotificationIDs.length);
						winston.log ("debug", " processed all the members in NOTFICATION_QUEUE ...") ;
						callback(define.SUCCESS);
					}) ;
				}
		    });  
		}		
	});	
}


function processgetAllNotificationIDHashFields (retrivedNotificationIDs, len, ResponseList, index, callback)
{
	if (len)
	{
		redisclient.select(define.PRSessionRedisDb,function(err) {}) ;
		redisclient.hgetall(retrivedNotificationIDs[index], function(err, hashFields) 
		{
			var ret = 1 ;
			var CurrentNotificationID = retrivedNotificationIDs[index] ;
			var CurrentDevPlat = hashFields.DEVPLATFORM ;
			if(!err && hashFields)
			{
				// get the current time stamp (CTS)				
				var cts = Math.round(new Date().getTime() / 1000);
				//console.log ("Current time stamp is [" + cts + "]..") ;
				winston.log ("silly", "Retrieved values for the notification. [" + CurrentNotificationID + "]..") ;
				// if ((state == ‘N’) || ((state == ‘R’) & (CTS > RETRYAFTER)) // RETRYAFTER if from the redis db corresponding to that notification id 
				if ((hashFields.STATE == "N") || ((hashFields.STATE == "R")  && (cts > hashFields.RETRYAFTER)) )
				{
					// check the device platform (from the redis db corresponding to that notification id)
					// if (device platform == Android platform)
					checkDevPlatAndroid (CurrentDevPlat, function (status)
					{
						if (status)
						{
							winston.log ("debug", CurrentDevPlat + " is Android device..") ;
							//Storing the notification ID with Andorid platform in ANDROID_NOTIFY_QUEUE 
							AndroidNotifyQueueStorage(CurrentNotificationID,function(StatusMsg)
							{						
								if(StatusMsg == define.RedisSetAndroidQueueKeyStoreSucess) //If notification ID storage in ANDROID_NOTIFY_QUEUE is a success
								{
									//Deleting the  notification ID from NOTIFICATION_QUEUE
									DeleteNotIDFromNotificationQueue(CurrentNotificationID,function(DeletionStatusMsg){
										if(DeletionStatusMsg == define.RedisNotificationIDDeletion)
										{
											//console.log("Success in deleting NotificationID " + CurrentNotificationID + " from NOTIFICATION_QUEUE"");
											winston.log ("debug", "Success in deleting NotificationID " + CurrentNotificationID + " from NOTIFICATION_QUEUE") ;
										}
										else
										{
											//console.log("Error in deleting NotificationID " + CurrentNotificationID + " from NOTIFICATION_QUEUE"");
											winston.log ("debug", "Error in deleting NotificationID " + CurrentNotificationID + " from NOTIFICATION_QUEUE") ;
										}
									});
								}							
								else //If notification ID storage in ANDROID_NOTIFY_QUEUE is a failure
								{
									//console.log("Error while storing the storing Device Token to set ANDROID_NOTIFY_QUEUE");
									winston.log ("debug", "Error while storing the storing Device Token to set ANDROID_NOTIFY_QUEUE") ;
								}
							});
						}
						else 
						{
							// else if (device platform == Apple platform)
							checkDevPlatApple (CurrentDevPlat, function (status)
							{
								if (status)
								{
									winston.log ("debug", CurrentDevPlat + " is Apple device..") ;
									//Storing the notification ID with IOS platform in APPLE_NOTIFY_QUEUE 
									AppleNotifyQueueStorage(CurrentNotificationID,function(StatusMsg)
									{						
										if(StatusMsg == define.RedisSetAppleQueueKeyStoreSucess) //If notification ID storage in Apple_Notify_Queue is a success
										{
											//Deleting the  notification ID from NOTIFICATION_QUEUE
											DeleteNotIDFromNotificationQueue(CurrentNotificationID,function(DeletionStatusMsg)
											{
												if(DeletionStatusMsg == define.RedisNotificationIDDeletion)
												{
													//console.log("Success in deleting NotificationID " + CurrentNotificationID + " from NOTIFICATION_QUEUE"");
													winston.log ("debug", "Success in deleting NotificationID " + CurrentNotificationID + " from NOTIFICATION_QUEUE") ;
												}
												else
												{
													//console.log("Error in deleting NotificationID " + CurrentNotificationID + " from NOTIFICATION_QUEUE"");
													winston.log ("debug", "Error in deleting NotificationID " + CurrentNotificationID + " from NOTIFICATION_QUEUE") ;
												}
											});
										}							
										else //If notification ID storage in Apple_Notify_Queue is a failure
										{
											//console.log("Error while storing the storing Device Token to set APPLE_NOTIFY_QUEUE");
											winston.log ("debug", "Error while storing the storing Device Token to set APPLE_NOTIFY_QUEUE") ;
										}
									});
								}
								else
								{ // ERROR: The device platform is not registered
									winston.log ("debug", CurrentDevPlat + " is neither Android nor Apple device ..") ;
									ret = 0 ;
									// delete from the NOTIFICATION_QUEUE set
									dbRedisModule.DeleteNotIDFromNotificationQueue(CurrentNotificationID,function(DeletionStatusMsg){
										// delete the notification id hash also
										dbRedisModule.DelNotIDKey (CurrentNotificationID, function (){
										}) ;
									}) ;
								}
							}) ;
						}
					}) ;
				}
				else
				{
					// Do nothing. Leave the notification in this queue as it is
					winston.log ("debug", "This notification is not picked for dispatching..") ;
				}
				ResponseList [index] = ret ;
			}
			else if(err)
			{
				winston.log ("debug", 'error in ret' + retrivedSets[index]);
			}	

			len -- ; // One requests processed, hence reduce the counter
			index ++ ; // For next Request 
			processgetAllNotificationIDHashFields (retrivedNotificationIDs, len, ResponseList, index, function () 
			{
				callback () ; // Call the originating function
			}) ;
		}) ;
	}		
	else
	{
		callback (); // Call the originating function
	}
}


/* This function stores the notification ids in the APPLE_NOTIFY_QUEUE
*/
function AppleNotifyQueueStorage(NotificationID,AppleNQCallback)  //NotificationID 
{
	redisclient.select(define.PRSessionRedisDb,function(err)    //PRSessionRedisDb can be changed based on the DB used for user details
	{
		if(err)
		{
			console.log('Error in switching to the db');
			AppleNQCallback(define.FAILURE) ;
		}
		else
		{
			//Getting the set key name
			var setAppleNotifyQueue = define.AppleNotifyQueueSet;
			var redisStorageResult = "";
			winston.log("debug", "Adding registration ID : " + NotificationID + " in set key with name : " + setAppleNotifyQueue);
			redisclient.sadd(setAppleNotifyQueue,NotificationID, function (err)
			{						
				if(err)
				{
					redisStorageResult = define.RedisErrStoringAppleQueueSetKey;
					AppleNQCallback(redisStorageResult);
				}
				else
				{
					redisStorageResult = define.RedisSetAppleQueueKeyStoreSucess;
					AppleNQCallback(redisStorageResult);
				}			
			});
			
		}		
	});	
}


/* This function stores the notification ids in the ANDROID_NOTIFY_QUEUE
*/
function AndroidNotifyQueueStorage(NotificationID,AndroidNQCallback)  
{
	redisclient.select(define.PRSessionRedisDb,function(err)    //PRSessionRedisDb can be changed based on the DB used for user details
	{
		if(err)
		{
			console.log('Error in switching to the db');
			AndroidNQCallback(define.FAILURE) ;
		}
		else
		{
			//Getting the set key name
			var setAndroidNotifyQueue = define.AndroidNotifyQueueSet;
			var redisStorageResult = "";
			winston.log("debug", "Adding registration ID : " + NotificationID + " in set key with name : " + setAndroidNotifyQueue);
			redisclient.sadd(setAndroidNotifyQueue,NotificationID, function (err)
			{						
				if(err)
				{
					redisStorageResult = define.RedisErrStoringAndroidQueueSetKey;
					AndroidNQCallback(redisStorageResult);
				}
				else
				{
					redisStorageResult = define.RedisSetAndroidQueueKeyStoreSucess;
					AndroidNQCallback(redisStorageResult);
				}			
			});
			
		}		
	});	
}

/* This function deletes the notification id from the notification queue */
function DeleteNotIDFromNotificationQueue(NotificationID, DelRegIDCallBack)
{
	//Deleting the notification from the user notification ID list  
	redisclient.select(define.PRSessionRedisDb,function(err) {}) ;
	redisclient.srem(define.NotificationQueueSetKey, NotificationID, function(err,setMemberDeletionResult)
	{
		if(err)
		{
			winston.log("debug", "Error in deleting NotificationID " + NotificationIDToBeDeleted + " from the set " + define.NotificationQueueSetKey + " from redis DB");
			DelRegIDCallBack(define.RedisErrNotificationIDDeletion);  // return Error
		}
		else
		{			
			DelRegIDCallBack(define.RedisNotificationIDDeletion);  // return success
		}
	});	
}

function delNotificationID (NotifyQueueSet, notid, callback)
{
	//Deleting the notification from the user notification ID list  
	redisclient.select(define.PRSessionRedisDb,function(err) {}) ;
	redisclient.srem(NotifyQueueSet, notid, function(err,result)
	{
		callback (err) ;
	}) ;
}


function putNotificationID (NotificationQueueSet, notid, callback)
{
	redisclient.select(define.PRSessionRedisDb,function(err) {}) ;
	redisclient.sadd(NotificationQueueSet,notid, function (err)
	{
		callback (err) ;
	});
}


/* This function deletes the notification key */
function DelNotIDKey (NotKeyToBeDeleted, callback)
{
	redisclient.select(define.PRSessionRedisDb,function(err) {}) ;
	redisclient.del(NotKeyToBeDeleted, function(err,result)
	{		
		if(err)
		{
			winston.log("debug", "Error in deleting the notification ID hash key " + NotKeyToBeDeleted + " from redis DB");			
		}
		else 
		{
			winston.log("debug", "Deleted the notification ID hash key " + NotKeyToBeDeleted + " from redis DB");	
		}
		callback (err, result) ;
	});
}




function checkDevPlatAndroid (devPlat, callback)
{
	var ret = 0 ;
	var devAndroidList = define.AndroidPlatformDevices ;
	
	for (i in devAndroidList)
	{
		console.log ("dev and list in " + i + " is " + devAndroidList [i]) ;
		if (devPlat == devAndroidList [i])
		{
			console.log ("SUCCESS in Android List") ;
			ret = 1 ;
			break ;
		}
	}
	callback (ret) ;
}

function checkDevPlatApple (devPlat, callback)
{
	var ret = 0 ;
	var devAppleList = define.ApplePlatformDevices ;
	for (i in devAppleList)
	{
		console.log ("dev and list in " + i + " is " + devAppleList [i]) ;
		if (devPlat == devAppleList [i])
		{
			console.log ("SUCCESS in Apple List") ;
			ret = 1 ;
			break ;
		}
	}
	callback (ret) ;
}




function getAndroidDispatcherList (AndroidNQCallback)
{
	winston.log("debug", "Inside function getAndroidDispatcherList");	
	redisclient.select(define.PRSessionRedisDb,function(err)    //PRSessionRedisDb can be changed based on the DB used for user details
	{
		if(err)
		{
			console.log('Error in switching to the db');
			AndroidNQCallback (define.FAILURE, null, null) ;
		}
		else
		{
			//Getting the set key name
			var setNotQueueKeyName = define.AndroidNotifyQueueSet;
			//console.log("Reading Notification Queue set key with name : " + setNotQueueKeyName);
			winston.log("debug", "Reading Notification Queue set key with name : " + setNotQueueKeyName);
			
			redisclient.smembers(setNotQueueKeyName, function(err,retrivedNotificationIDs) 
			{	 
				if (err)
				{
					console.log("Failed Retrieving the Notification Queue set key with name : " + setNotQueueKeyName);
					winston.log("debug", "Failed Retrieving the Notification Queue set key with name");
					AndroidNQCallback (define.FAILURE, null, null) ;
				}
				else
				{
					NotificationIDHashFields = [];
					processgetAllGCMNotIDHashFields(retrivedNotificationIDs, retrivedNotificationIDs.length, NotificationIDHashFields, 0, function ()
					{
						AndroidNQCallback(define.SUCCESS, NotificationIDHashFields, retrivedNotificationIDs.length);
					}) ;
				}
		    });  
		}		
	});	
}

function processgetAllGCMNotIDHashFields (retrivedNotificationIDs, len, NotificationIDHashFields, index, callback)
{
	if (len)
		{
			var notificationID = retrivedNotificationIDs[index];
			//console.log(index +  " reg id " + registrationID);
			redisclient.select(define.PRSessionRedisDb,function(err) {}) ;
			redisclient.hgetall(retrivedNotificationIDs[index], function(err, hashFields) 
			{
				 if(!err && hashFields)
				 {
					//winston.log("Fields of the retrieved set key : ");
					//winston.log(hashFields);
					NQRegIDHashKeyField = new Object () ;
					NQRegIDHashKeyField.MESSAGE  = hashFields.MESSAGE;					
					//NQRegIDHashKeyField.DEVPLATFORM  = hashFields.DEVPLATFORM;
					//NQRegIDHashKeyField.DEVVERSION  = hashFields.DEVVERSION;
					NQRegIDHashKeyField.STATE = hashFields.STATE ;
					NQRegIDHashKeyField.RETRYAFTER = hashFields.RETRYAFTER;
					NQRegIDHashKeyField.NOOFTRY = hashFields.NOOFTRY;
					NQRegIDHashKeyField.REGID = hashFields.REGID;
					NQRegIDHashKeyField.NOTID = notificationID;
					NotificationIDHashFields [index] = NQRegIDHashKeyField ;
				 }
				 len -- ; // One requests processed, hence reduce the counter
				 index ++ ; // For next Request 
				 processgetAllGCMNotIDHashFields (retrivedNotificationIDs, len, NotificationIDHashFields, index, function () {
					callback () ; // Call the originating function
				}) ;
			}) ;
		}		
		else
		{
			callback (); // Call the originating function
		}
}



// return notification ids and total number of notifications
function getAppleDispatcherList (AppleNQCallback)
{
	winston.log("debug", "Inside function getAppleDispatcherList");	
	redisclient.select(define.PRSessionRedisDb,function(err)    //PRSessionRedisDb can be changed based on the DB used for user details
	{
		if(err)
		{
			console.log('Error in switching to the db');
			AppleNQCallback (define.FAILURE, null, null) ;
		}
		else
		{
			//Getting the set key name
			var setNotQueueKeyName = define.AppleNotifyQueueSet;
			//console.log("Reading Notification Queue set key with name : " + setNotQueueKeyName);
			winston.log("debug", "Reading Notification Queue set key with name : " + setNotQueueKeyName);
			
			redisclient.smembers(setNotQueueKeyName, function(err,retrivedNotificationIDs) 
			{	 
				if (err)
				{
					console.log("Failed Retrieving the Notification Queue set key with name : " + setNotQueueKeyName);
					winston.log("debug", "Failed Retrieving the Notification Queue set key with name");
					AppleNQCallback (define.FAILURE, null, null) ;
				}
				else
				{
					NotificationIDHashFields = [];
					processgetAllAPNSNotIDHashFields(retrivedNotificationIDs, retrivedNotificationIDs.length, NotificationIDHashFields, 0, function ()
					{
						AppleNQCallback(define.SUCCESS, NotificationIDHashFields, retrivedNotificationIDs.length);
					}) ;
				}
		    });  
		}		
	});	
}

function processgetAllAPNSNotIDHashFields (retrivedNotificationIDs, len, NotificationIDHashFields, index, callback)
{
	if (len)
		{
			var notificationID = retrivedNotificationIDs[index];
			//console.log(index +  " reg id " + registrationID);
			redisclient.select(define.PRSessionRedisDb,function(err) {}) ;
			redisclient.hgetall(retrivedNotificationIDs[index], function(err, hashFields) 
			{
				 if(!err && hashFields)
				 {
					//winston.log("Fields of the retrieved set key : ");
					//winston.log(hashFields);
					NQRegIDHashKeyField = new Object () ;
					NQRegIDHashKeyField.MESSAGE  = hashFields.MESSAGE;					
					//NQRegIDHashKeyField.DEVPLATFORM  = hashFields.DEVPLATFORM;
					//NQRegIDHashKeyField.DEVVERSION  = hashFields.DEVVERSION;
					NQRegIDHashKeyField.STATE = hashFields.STATE ;
					NQRegIDHashKeyField.RETRYAFTER = hashFields.RETRYAFTER;
					NQRegIDHashKeyField.NOOFTRY = hashFields.NOOFTRY;
					NQRegIDHashKeyField.REGID = hashFields.REGID; // REGID will be the device token for the Apple device
					NQRegIDHashKeyField.NOTID = notificationID;
					NotificationIDHashFields [index] = NQRegIDHashKeyField ;
				 }
				 len -- ; // One requests processed, hence reduce the counter
				 index ++ ; // For next Request 
				 processgetAllAPNSNotIDHashFields (retrivedNotificationIDs, len, NotificationIDHashFields, index, function () {
					callback () ; // Call the originating function
				}) ;
			}) ;
		}		
		else
		{
			callback (); // Call the originating function
		}
}


function udpateNotID (notid, state, noofretry, retryafter, callback)
{
	redisclient.select(define.commonRedisDb,function(err)
	{
		if(err)
		{
			winston.log("debug", "Error in switching to the db");
			callback (1) ;
		}
		else
		{
			redisclient.hmset(notid, "STATE", state, "NOOFTRY", noofretry, "RETRYAFTER", retryafter, function (err)
			{
					if(err)
					{	// return an error
						winston.log ("debug", "ERRROR >>>>>>>>>>>>> while updating the notification id\n");
						callback (err) ;
					}
					else
					{  // return success
						callback (0) ;
					}
			}) ;
		}
	}) ;
}


function udpateAndroidQueueRegID (notid, regID, callback)
{
	redisclient.select(define.commonRedisDb,function(err)
	{
		if(err)
		{
			winston.log("debug", "Error in switching to the db");
			callback (1) ;
		}
		else
		{
			redisclient.hmset(notid, "REGID", regID, function (err)
			{
					if(err)
					{	// return an error
						winston.log ("debug", "ERRROR >>>>>>>>>>>>> while updating the registration id\n");
						callback (err) ;
					}
					else
					{  // return success
						callback (0) ;
					}
			}) ;
		}
	}) ;
}
	
/* For Notification Dispatcher TILL HERE */

//Methods or Properties from dbRedisMod to be used across this ERP Node Modules
exports.AddWorklistPRRedis = AddWorklistPRRedis;
exports.ViewWorklistPRRedis = ViewWorklistPRRedis;
exports.ViewPRDetailedInfoReq = ViewPRDetailedInfoReq;
exports.initRedisInterface = initRedisInterface;
exports.deinitRedisInterface = deinitRedisInterface;
exports.RetrieveSessionDetail = RetrieveSessionDetail;
exports.StoreSessionDetail = StoreSessionDetail;
exports.ViewHistoryPRRedis = ViewHistoryPRRedis;
exports.checkKeyExists = checkKeyExists;
exports.addSet = addSet;
exports.renameKey = renameKey;
exports.quit = quit;
exports.sdiffSet = sdiffSet;
exports.AddWorklistPRRedisMulti = AddWorklistPRRedisMulti;
exports.checkSessionDetail = checkSessionDetail;
exports.InvalidateSessionToken = InvalidateSessionToken;
exports.StoreWorkListDetail = StoreWorkListDetail;
exports.StoreRegID = StoreRegID;
exports.delRegID = delRegID;


//exports.RemovePRApprovedItemRedis = RemovePRApprovedItemRedis;
exports.RemoveApproveRejectItemRedis = RemoveApproveRejectItemRedis;
exports.checkGetUserId = checkGetUserId;
exports.StoreUAProfDetails = StoreUAProfDetails;
exports.StoreDevProfileDetail = StoreDevProfileDetail;
//IE Expense Report related exports
exports.ViewWorklistIERedis = ViewWorklistIERedis;
exports.AddWorklistIERedis = AddWorklistIERedis;
exports.ViewHistoryIERedis = ViewHistoryIERedis;
exports.ViewIEDetailedInfoReq = ViewIEDetailedInfoReq;

/* JE Journal Entry Related Exports */
exports.ViewWorklistJERedis = ViewWorklistJERedis;

/* Notification Dispatcher */
exports.ReadProcessNotificationQueue = ReadProcessNotificationQueue;
exports.AppleNotifyQueueStorage = AppleNotifyQueueStorage;
exports.AndroidNotifyQueueStorage = AndroidNotifyQueueStorage;
exports.DeleteNotIDFromNotificationQueue = DeleteNotIDFromNotificationQueue;
exports.DelNotIDKey = DelNotIDKey;
exports.delNotificationID = delNotificationID;
exports.putNotificationID = putNotificationID;
exports.getAndroidDispatcherList = getAndroidDispatcherList;
exports.getAppleDispatcherList = getAppleDispatcherList;
exports.udpateNotID = udpateNotID;
exports.udpateAndroidQueueRegID = udpateAndroidQueueRegID;



