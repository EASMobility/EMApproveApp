
//////////////////////////////////////////////////////////////////
// Name : dbOracle.js						//	
// Description : Module to interact with Oracle server		//
//////////////////////////////////////////////////////////////////

/* define.js :- Include the definations file */
var define = require("./em-define");

/* Global variables */
//var util = require('util');
var assert = require('assert');
var fs = require('fs');
var oracle = require(define.oracleNodeModulePath) ;

/* For logging */
var logModule = require("./em-logModule");
var winston = logModule.getLogModule (); 

var PR_LIST_NEW = "PR_LIST_NEW" ;
var PR_LIST_OLD = "PR_LIST_OLD" ;

// Initialise
// Connect
// Query
// disconnect

/* This funciton Intialise Oracle client. 
 * connects to oracle client and returns the connection
*/
function initOracleInterface (oracleHostname, oraclePort, oracleSID, oracleUser, oraclePassword, callback)
{
	var oracleCon=null;
	if (oracleHostname && oraclePort && oracleUser && oraclePassword && oracleSID)
	{
		winston.log ("debug", "Connecting to oracle Hostname [" + oracleHostname + "] and Port [" + oraclePort + "] oracle user [" + oracleUser + "] oracle password ["
			+ oraclePassword + "]") ;

	oracleCon = new oracle.Database({
	    hostname: oracleHostname,
   		port: oraclePort,
   		user: oracleUser,
   		password: oraclePassword,
   		database: oracleSID
	}).connect(function(error) 
		{
			if (error)
			{
				winston.log ("debug", "Error connecting to the oracle server ... try again.. \n") ;
				callback (1, oracleCon) ;
			}
			else
			{
				winston.log ("debug", "Succesfully connect to oracle database...\n") ;
				callback (0, this) ;
			}
		}) ;
	}
	else
	{
		winston.log ("debug", "Invalid parameters received .. ") ;
		callback (1, oracleCon) ;
	}
	
}

/* This function executes the query and returns the result */
function executeQuery (oracleCon, queryStr, callback)
{
	if (oracleCon && queryStr)
	{
    	oracleCon.query(queryStr).execute(function(error, queryRecords) 
		{
			callback (error, queryRecords) ;
		}) ;
	}
	else
	{
		winston.log ("debug", "Invalid paramters received... oraclecon is [" + oracleCon + "] and querystr is [" + queryStr + "]\n") ;
		callback (1, null) ;
	}
}



//Methods or Properties from dbOracle to be used across this ERP Node Modules
exports.initOracleInterface = initOracleInterface;
exports.executeQuery = executeQuery;

