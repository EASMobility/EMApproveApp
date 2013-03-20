var redis = require('/home/masadmin/nvm/v0.8.12/lib/node_modules/redis');
var util = require('util');
var assert = require('assert');
var fs = require('fs');
var redisclient = redis.createClient();
var oracle = require('/home/masadmin/nvm/v0.8.12/lib/node_modules/db-oracle');

var PR_LIST_NEW = "PR_LIST_NEW" ;
var PR_LIST_OLD = "PR_LIST_OLD" ;

var oracleHostname= "auohseart36.oracleoutsourcing.com" ;
var oraclePort= 10710;
var oracleUser= "xxea_mobile";
var oraclePassword= "xxea_mobile";
var oracleSID= "DEARTI";

function sleep(milliSeconds) {
	var startTime = new Date().getTime();
	while (new Date().getTime() < startTime + milliSeconds);
	}

var tot_rec = 0 ;
var tot_operations = 0 ;

var stream = fs.createWriteStream("toolLog.txt");
stream.once('open', function(fd) {
  stream.write("ERP Syn Tool Started .... \n");
});


util.log ("Connecting to the oracle db...\n") ;

var con = new oracle.Database(
{
    hostname: oracleHostname,
    port: oraclePort,
    user: oracleUser,
    password: oraclePassword,
    database: oracleSID
}).connect(function(error) 
{
	util.log ("Connected to the oracle db...\n") ;
  	stream.write("Connected to the oracle db...\n");  
    if (error) 
    {
        return console.log("CONNECTION ERROR: " + error);
    }
    util.log('starting query');
    this.query("select NOTIFICATION_ID, REQUISITION_HEADER_ID, REQUISITION_NUMBER, DESCRIPTION, AMOUNT, STATUS, APPROVAL_REQUESTED_DATE, APPROVED_DATE, APPROVAL_REQUESTED_BY, APPROVER_EMPLOYEE_NUMBER, TO_USER, REQUESTOR from XXEA_MOBILITY_PR_APPR_STATUS_V ").execute(function(error, PRApprovalRecords) 
    //this.query(" select * from XXEA_MOBILITY_PR_APPR_STATUS_V ").execute(function(error, PRApprovalRecords) 
	{
		util.log ("Oracle query executed...") ;
		assert.ifError (error) ;
		if (error) 
		{
			return console.log('ERROR: ' + error);
		}
		else
		{
			var resultStatus = "Success";
			ProcessPRApprRecords(PRApprovalRecords,function (err)
			{
				if (err)
				{
					util.log("Error in ProcessPRApprRecords\n");
				}
				else
				{
					util.log("Succesfully executed the operations\n");
  					stream.write("Succesfully completed the task.. ...\n");  
  					stream.write("Total record written [" + tot_rec + "]\n");  
  					//util.log ("Total record written " + tot_rec);  
					// Check if the OLD Key list is not there then rename the new to current
					//redisclient.smembers(PR_LIST_OLD, function (err, retrievedSets)
					redisclient.exists(PR_LIST_OLD, function (err, result)
					{
						if (!result)
						{
							util.log ("PR_LIST_OLD does not exists...\n") ;
							// rename new to old
							util.log ("First time called") ;
							redisclient.rename (PR_LIST_NEW, PR_LIST_OLD, function ()
							{}); 
							tot_operations++ ;
							if (tot_operations == 2)
							{
								console.log ("Finishing through PR APPR...\n") ;
								redisclient.quit () ;
							}
						}
						else
						{
							// compare the two list
							util.log ("PR_LIST_OLD exists, we should compare two lists...\n") ;
				
							// Records which got deleted A-B (Old - New)
							processDelPRList (function (){
								processAddPRList (function(){
									redisclient.rename (PR_LIST_NEW, PR_LIST_OLD, function ()
									{}); 
									tot_operations++ ;
									if (tot_operations == 2)
									{
										console.log ("Finishing through PR APPR...\n") ;
										redisclient.quit () ;
									}
								}) ;
							}) ;

						}
					}) ;

				}
			});
		}
	});

	// Lets sync the xxea_global.XXEA_MOBILITY_PR_LINES_V table too
    this.query("select REQUISITION_HEADER_ID, REQUISITION_LINE_ID, LINE_NUM, ITEM_DESCRIPTION, QUANTITY, UNIT_PRICE from xxea_global.XXEA_MOBILITY_PR_LINES_V ").execute(function(error, PRLinesRecords) 
	{
		util.log ("Oracle query executed...") ;
		assert.ifError (error) ;
		if (error) 
		{
			return console.log('ERROR: ' + error);
		}
		else
		{
			ProcessPRLinesRecords(PRLinesRecords,function (err)
			{
				if (err)
				{
					console.log ("Error ... while processing PR Lines Records...\n") ;
				}
				else
				{
					console.log ("Succesfull ... inserted PR Lines Records...\n") ;
				}
				tot_operations++ ;
				if (tot_operations == 2)
				{
					console.log ("Finishing through PR Lines...\n") ;
					redisclient.quit () ;
				}
			}) ;
		}
	}) ;
 });	

function processDelPRList (callback)
{
	redisclient.sdiff ("PR_LIST_OLD", "PR_LIST_NEW", function (err, result)
	{
		//console.log ("The LIST Of Deleted Entries are ..--------- START --------- .\n") ;
		processAllDelPRList (result, result.length, 0, function ()
		{
			callback () ;
		}) ;
	});
}

function processAllDelPRList (retrivedSets, len, index, callback)
{
	if (len)
	{
		// Call db module for actual getting the values from the database
		redisclient.hmset (retrivedSets [index], "Action", "D", function (err) 
		{
			if (err) { console.log ("Error .. while inserting record [HASH]... in Notification list... \n");} 
			else {console.log("Succesfully entered the record [HASH]..\n") ;}

			redisclient.sadd ("NOT_PR_LIST", retrivedSets[index], function (err,result) {
				if (err) { console.log ("Error .. while inserting record [SET] ... in Notification list... \n");} 
				else {console.log("Succesfully entered the record [SET]..\n") ;}
			});

			 len -- ; // One requests processed, hence reduce the counter
			 index ++ ; // For next Request 
			 processAllDelPRList (retrivedSets, len, index, function () {
				callback () ; // Call the originating function
			}) ;
		}) ;
	}
	else
	{
		callback () ; // Call the originating function
	}
}



	
					//processAddPRList (function()
function processAddPRList (callback)
{
	redisclient.sdiff ("PR_LIST_NEW", "PR_LIST_OLD", function (err, result)
	{
		//console.log ("The LIST Of Added Entries are ..--------- START --------- .\n") ;
		processAllAddPRList (result, result.length, 0, function ()
		{
			callback () ;
		}) ;
	});
}

function processAllAddPRList (retrivedSets, len, index, callback)
{
	if (len)
	{
		// Call db module for actual getting the values from the database
		redisclient.hmset (retrivedSets [index], "Action", "A", function (err) 
		{
			if (err) { console.log ("Error .. while inserting record [HASH]... in Notification list... \n");} 
			else {console.log("Succesfully entered the record [HASH]..\n") ;}

			redisclient.sadd ("NOT_PR_LIST", retrivedSets[index], function (err,result) {
				if (err) { console.log ("Error .. while inserting record [SET] ... in Notification list... \n");} 
				else {console.log("Succesfully entered the record [SET]..\n") ;}
			}) ;

			 len -- ; // One requests processed, hence reduce the counter
			 index ++ ; // For next Request 
			 processAllAddPRList (retrivedSets, len, index, function () {
				callback () ; // Call the originating function
			}) ;
		}) ;
	}
	else
	{
		callback () ; // Call the originating function
	}
}


function ProcessPRApprRecords(PRApprovalRecords,callbackRedisStoreResult)
{	
	var processed= 0;
	//util.log ("Process PR Appr Records \n") ;
	if(PRApprovalRecords != null)
	{
		for (var i in PRApprovalRecords)
		{
			// approver employee number + notification id + requisition number + header id is must)
			//util.log ("processing " + i + " Value.. \n") ;
			if ((PRApprovalRecords[i].NOTIFICATION_ID && PRApprovalRecords[i].REQUISITION_HEADER_ID && PRApprovalRecords[i].APPROVER_EMPLOYEE_NUMBER && PRApprovalRecords[i].REQUISITION_NUMBER))
			{
				//util.log ("Going to storein redis.. .\n") ;
				StoreWorklistPRRedis(PRApprovalRecords[i], function (err, prApprRecordsStorageStatus)
				{
					if (err)
					{
						util.log ("Error storing record in Redis Db..") ;
					}
					else
					{
						//util.log ("Record inserted succefully \n") ;
					}
					//util.log("THe store status is " + prApprRecordsStorageStatus [0]);
					//util.log("THe store status text is " + prApprRecordsStorageStatus [1]);
					processed++;
					// TODO Make sure we are inserting all the records
					if (processed == i)
					{
						util.log ("All records processed ... \n") ;
						callbackRedisStoreResult(0);
					}
				});
			}
			else
			{
				// Invalid data recieved hence will be discarding.
				//console.log ("Invalid data for not id " + PRApprovalRecords[i].NOTIFICATION_ID + " Header id " + PRApprovalRecords[i].REQUISITION_HEADER_ID + " Approver Employee Number " + PRApprovalRecords[i].APPROVER_EMPLOYEE_NUMBER + " Requisition Number " + PRApprovalRecords[i].REQUISITION_NUMBER) ;
				stream.write ("Invalid data for not id " + PRApprovalRecords[i].NOTIFICATION_ID + " Header id " + PRApprovalRecords[i].REQUISITION_HEADER_ID + " Approver Employee Number " + PRApprovalRecords[i].APPROVER_EMPLOYEE_NUMBER + " Requisition Number " + PRApprovalRecords[i].REQUISITION_NUMBER + "\n") ;
				processed++;
				// TODO Make sure we are inserting all the records
				if (processed == i)
				{
					util.log ("All records processed ... \n") ;
					callbackRedisStoreResult(0);
				}
				
			}
		}
	}
}


function StoreWorklistPRRedis(PRApprovalRecords, callback)
{
	//util.log  ("Request came to store in local redis db...\n") ;
	//Setting the hash and primary key's
	var HashkeyUniqueNotificationID = "PR-" + PRApprovalRecords.NOTIFICATION_ID;
	//Checks connection is there or not
	//redisclient.on('error', function (error) 
	//{ 
	//	console.log('Redis Server Not Started......'); 
	//}); 

	//Defining the Hash Key
	//Adding the Primary key HashkeyUniqueNotificationID and its fields
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//Doubt : Should the column names be similar to in oracle db like NotificationID like Notification_ID; Currenlty its not same
	//util.log ("Setting hash for key " + HashkeyUniqueNotificationID) ;
	// TODO Check if the notification id is already existing and the PRApprovalRecords.APPROVER_EMPLOYEE_NUMBER is same
	// in case it is not same then we should delete this notification from the previous PRApprovalRecords.APPROVER_EMPLOYEE_NUMBER Set
	


	// Check if the record already exisists and the approver employeer number is differnt
	redisclient.hget(HashkeyUniqueNotificationID, "APPROVEREMPLOYEENUMBER", function (err, result)
	{
		//console.log ("The err is " + err + " result is " + result) ;
		//console.log ("The result is " + result) ;
		delUserSet (HashkeyUniqueNotificationID, result, PRApprovalRecords.APPROVER_EMPLOYEE_NUMBER, function ()
		{
			redisclient.hmset(HashkeyUniqueNotificationID, "NOTIFICATIONID", PRApprovalRecords.NOTIFICATION_ID,
				//"ITEMKEY", PRApprovalRecords.ITEM_KEY,
				"REQUISITIONHEADERID", PRApprovalRecords.REQUISITION_HEADER_ID,
				"REQUISITIONNUMBER", PRApprovalRecords.REQUISITION_NUMBER,
				"DESCRIPTION",PRApprovalRecords.DESCRIPTION, "AMOUNT",PRApprovalRecords.AMOUNT,
				//"MESSAGENAME",PRApprovalRecords.MESSAGE_NAME,
				"STATUS",PRApprovalRecords.STATUS,
				"APPROVALREQUESTEDDATE",PRApprovalRecords.APPROVAL_REQUESTED_DATE,"APPROVEDDATE",PRApprovalRecords.APPROVED_DATE,
				"APPROVALREQUESTEDBY",PRApprovalRecords.APPROVAL_REQUESTED_BY, 
				// "EMERGENCYPONUM",PRApprovalRecords.EMERGENCY_PO_NUM,
				"APPROVEREMPLOYEENUMBER", PRApprovalRecords.APPROVER_EMPLOYEE_NUMBER,
				// "FROMUSER",PRApprovalRecords.FROM_USER, 
				"TOUSER", PRApprovalRecords.TO_USER,
				"REQUESTOR",PRApprovalRecords.REQUESTOR, function (err)	
				//"REQUESTOREMPLOYEENUMBER", PRApprovalRecords.REQUESTOR_EMPLOYEE_NUMBER, 
			{
				//util.log ("Hash key inserted...\n") ;
				// Modified by Vinod 
				if(err)
				{			
					callback(1, "Error in storing the Notification ID");		
 				}
				else
				{
					var SetKeyApprEmpNo = PRApprovalRecords.APPROVER_EMPLOYEE_NUMBER;
					var redisStorageResult = [] ;
					//util.log ("Going to add the set for approver employee numnber" + SetKeyApprEmpNo + " hash key .. " + HashkeyUniqueNotificationID) ;
					redisclient.sadd(SetKeyApprEmpNo,HashkeyUniqueNotificationID, function (err)
					{				
						if(err)
						{
							util.log ("Error in writing set for employee number..." + SetKeyApprEmpNo) ;
							redisStorageResult[0] = "-1000";
							redisStorageResult[1] = "Error in storing Approval Employee Number set key";
 							callback(1, redisStorageResult);
						}
						else
 						{
							//util.log ("Succesfully written set for employee number " + SetKeyApprEmpNo) ;
							redisclient.sadd(PRApprovalRecords.REQUISITION_NUMBER,HashkeyUniqueNotificationID, function (err) 
							{
								if(err)
								{
									util.log ("Error in writing set...for requisition number " + PRApprovalRecords.REQUISITION_NUMBER) ;
									redisStorageResult[0] = "-1001";
											redisStorageResult[1] = "Error in storing Requisition Number set key";
								}
								else
								{
									//util.log ("Successfully added the requisition number in the new list") ;
									//util.log ("Adding in the new list of notifiction id where status is awaiting approval\n") ;
		
									if (PRApprovalRecords.STATUS == "Awaiting Approval")
									{
										redisclient.sadd(PR_LIST_NEW,PRApprovalRecords.NOTIFICATION_ID, function (err) 
										{
											if(err)
											{
												util.log ("Error in writing set...for Notification ID" + PRApprovalRecords.NOTIFICATION_ID) ;
												redisStorageResult[0] = "-1002";
												redisStorageResult[1] = "Error in storing In Notification New List for notification id " + PRApprovalRecords.NOTIFICATION_ID;
											}
											else
											{
												//util.log ("Set added succesfully...for Notification ID " + PRApprovalRecords.NOTIFICATION_ID) ;
												redisStorageResult[0] = "200";
												redisStorageResult[1] = "Notification ID and fields added successfully";
											}

											tot_rec++ ;

											callback(0, redisStorageResult);
										});
									}
									else
									{
										redisStorageResult[0] = "200";
										redisStorageResult[1] = "Notification ID and fields added successfully";
										callback(0, redisStorageResult);
									}
								}
							});
						}			
					});
				}
			});
		});
	}) ;
}

function delUserSet (HashkeyUniqueNotificationID, oldApprover, newApprover, callback)
{

	if ((oldApprover == newApprover) || (oldApprover == null))
	{
		//console.log ("It matches\n") ;
		callback () ;
	}
	else
	{
		console.log ("The approver has changed For notificaiton id [" + HashkeyUniqueNotificationID + "] prev Approver [" + oldApprover + "] and New approver [" + newApprover + "] \n") ;
		stream.write ("The approver has changed For notificaiton id [" + HashkeyUniqueNotificationID + "] prev Approver [" + oldApprover + "] and New approver [" + newApprover + "] \n") ;
		// We should delete it from the user set then
		redisclient.srem (oldApprover, HashkeyUniqueNotificationID, function (err, result)
		{
			if (err) console.log ("Error while removing from SET...\n") ;
			else console.log ("Successfully removed from SET ...\n") ;
			callback () ;
		}) ;
	}
}




function ProcessPRLinesRecords (PRLinesRecords,callbackRedisStoreResult)
{	
	var prLinesprocessed= 0;
	//util.log ("Process PR Appr Records \n") ;
	if(PRLinesRecords != null)
	{
		for (var i in PRLinesRecords)
		{
			// approver employee number + notification id + requisition number + header id is must)
			//util.log ("processing " + i + " Value.. \n") ;
			if (PRLinesRecords[i].REQUISITION_LINE_ID && PRLinesRecords[i].REQUISITION_HEADER_ID)
			{
				//util.log ("Going to storein redis.. .\n") ;
				StoreWorklistPRLinesRedis(PRLinesRecords[i], function (err, prApprRecordsStorageStatus)
				{
					if (err)
					{
						util.log ("Error storing record in Redis Db..") ;
					}
					else
					{
						//util.log ("Record inserted succefully \n") ;
					}
					//util.log("THe store status is " + prApprRecordsStorageStatus [0]);
					//util.log("THe store status text is " + prApprRecordsStorageStatus [1]);
					prLinesprocessed++;
					// TODO Make sure we are inserting all the records
					if (prLinesprocessed == i)
					{
						util.log ("All records prLinesprocessed ... \n") ;
						callbackRedisStoreResult(0);
					}
				});
			}
			else
			{
				// Invalid data recieved hence will be discarding.
				//stream.write ("Invalid data for not id " + PRLinesRecords[i].NOTIFICATION_ID + " Header id " + PRLinesRecords[i].REQUISITION_HEADER_ID + " Approver Employee Number " + PRLinesRecords[i].APPROVER_EMPLOYEE_NUMBER + " Requisition Number " + PRLinesRecords[i].REQUISITION_NUMBER + "\n") ;
				stream.write ("Invalid data for Line id " + PRLinesRecords[i].REQUISITION_LINE_ID + " Header id " + PRLinesRecords[i].REQUISITION_HEADER_ID + "\n") ;
				prLinesprocessed++;
				// TODO Make sure we are inserting all the records
				if (prLinesprocessed == i)
				{
					util.log ("All records prLinesprocessed ... \n") ;
					callbackRedisStoreResult(0);
				}
				
			}
		}
	}
}


//StoreWorklistPRLinesRedis(PRLinesRecords[i], function (err, prApprRecordsStorageStatus)
//function StoreWorklistPRRedis(PRApprovalRecords, callback)
function StoreWorklistPRLinesRedis(PRLinesRecords, callback)
{
	var HashkeyUniqueHdrLineID = "PR-" + PRLinesRecords.REQUISITION_LINE_ID ;
	var hdrID = PRLinesRecords.REQUISITION_HEADER_ID ;
	var lineID = PRLinesRecords.REQUISITION_LINE_ID ;
	var lineNum = PRLinesRecords.LINE_NUM ;
	var descr = PRLinesRecords.DESCRIPTION ;
	var qty = PRLinesRecords.QUANTITY ;
	var unitPrice = PRLinesRecords.UNIT_PRICE ;
	if (!hdrID) hdrID = "-" ;
	if (!lineID) lineID = "-" ;
	if (!lineNum) lineNum = "-" ;
	if (!descr) descr = "-" ;
	if (!qty) qty = "-" ;
	if (!unitPrice) unitPrice = "-" ;

	redisclient.hmset(HashkeyUniqueHdrLineID, "REQUISITIONHEADERID", hdrID,
		"REQUISITIONLINEID", lineID,
		"LINENUM", lineNum,
		"DESCRIPTION",descr,
		"QUANTITY",qty,
		"UNITPRICE",unitPrice, function (err)	
	{
		//util.log ("Hash key inserted...\n") ;
		// Modified by Vinod 
		if(err)
		{			
			callback(1, "Error in storing the PR Line items");		
 		}
		else
		{
			// Lets put this in the header id set
			//stream.write ("Adding SET for header id [" + hdrID + "] and value [" + HashkeyUniqueHdrLineID + "]\n") ;
			redisclient.sadd (PRLinesRecords.REQUISITION_HEADER_ID, HashkeyUniqueHdrLineID, function (err,result) {
					callback (0, "Success") ;
			}) ;
		}
	});

}




