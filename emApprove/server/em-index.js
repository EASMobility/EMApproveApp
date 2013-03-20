
/* File : index.js
*  Description: This file defines the various request handlers.
*  It calls the server start function to start listening 
*/

/* define.js :- Include the definations file */
var define = require("./em-define");

/* For logging */
var logModule = require("./em-logModule");

/* server.js :- To handle the incoming rquests from client */
var server = require("./em-server");

/* router.js :- based on the input recieved the call will be routed */
var router = require("./em-router");

/* requestHandlers :- To process the incoming requests */
var requestHandlers = require("./em-requestHandlers");

/* dbEAERPOracleModule.js :- To process the Oracle EA-ERP request */
if (define.oracleDbSupport)
var dbEAERPOracleModule = require("./em-dbEAERPOracleModule");

/* dbRedisModule.js :- To process the Local Db requests */
var dbRedisModule = require("./em-dbRedisModule");

/* For File operations */
var fs = require ("fs") ;

/* If LDAP support i sthere then include the LDAP module */
if (define.ldapSupport)
{
	/* ldapManager.js :- Include the ldap manager file */
	var ldapManager = require("./em-ldapManager");
}




/* Defining the various handlers */
var handle = {}
handle[define.EAERPModule] = requestHandlers.ea_erp;

/* For Logging */
logModule.initLogModule (define.logFile, define.logLevel, define.logFileMaxSize, define.logFileMaxFile, define.logConsoleOut, define.logFileOut, function(){}) ;

if (define.logCLFSupport)
{
	logModule.initCLFLogModule (define.CLFFileName, define.CLFLogLevel, define.CLFLogFileMaxSize, define.CLFLogFileMaxFile, function () {}) ;
}

var winston = logModule.getLogModule (); 
winston.log ("debug", "emApprove Server Started .... \n");

/* Calling start module of server script to start the server */
server.start(router.route, handle);

if (define.oracleDbSupport)
{
	/* Initialise Oracle server db */
	dbEAERPOracleModule.initOracleInterface (function(){}) ;
}

/* Initialise Redis server db */
dbRedisModule.initRedisInterface (define.redisIP, define.redisPort, function(){}) ;

if (define.ldapSupport)
{
	/* Initialise the ldap module */
	ldapManager.ldapInit (define.ldapURL, function (){}) ;
}


