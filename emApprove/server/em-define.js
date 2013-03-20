/* File : define.js
*  Description: This file defines the global variables / constants
*  The other files should uses these values ONLY
*/

var DEV_ENV = 1 ;
var TEST_ENV = 2 ;
var QA_ENV = 3; // QA and Production environment is the same
var LOCAL_ENV = 8; // CTS LocalSetup

var runEnvironment = LOCAL_ENV ;

var util = require('util');

//var nodeModuleBasePath = './node_modules' ; // CTS local environment
if (runEnvironment == DEV_ENV)
	nodeModuleBasePath = '/home/kawaljeet/nvm/v0.8.12/lib/node_modules' ; // Dev environment
else if (runEnvironment == TEST_ENV)
	nodeModuleBasePath = '/home/masadmin/nvm/v0.8.12/lib/node_modules' ; // Test environment
else if (runEnvironment == QA_ENV)
	nodeModuleBasePath = '/home/masadmin/nvm/v0.8.12/lib/node_modules' ; // QA environment
else if (runEnvironment == LOCAL_ENV)
	nodeModuleBasePath = './node_modules' ; // Local Dev environment

var oracleNodeModulePath = nodeModuleBasePath + '/db-oracle' ;
var ldapNodeModulePath = nodeModuleBasePath + '/ldapjs' ;
var winstonNodeModulePath = nodeModuleBasePath + '/winston' ;
var redisNodeModulePath = nodeModuleBasePath + '/redis' ;
var apnModulePath = nodeModuleBasePath + '/apn' ;
var gcmModulePath = nodeModuleBasePath + '/node-gcm' ;

/* Variables */
var EAERPModule = "/ea-erp" ;

var PortNo = 8888; // Offshore Testing
if (runEnvironment == DEV_ENV) // Dev environment
	 PortNo = 18888 ;
else if (runEnvironment == TEST_ENV) // Test environment
	 PortNo = 38888 ;
else if (runEnvironment == QA_ENV) // QA environment
	 PortNo = 28888 ;
else if (runEnvironment == LOCAL_ENV)
	 PortNo = 8888 ;

/* Redis server details */
var redisIP = "127.0.0.1"; // Offshore Testing
var redisPort = 6379; //Offshore Testing
if (runEnvironment == DEV_ENV) // Dev environment
{
	 redisIP = "10.14.200.235"; 
	 redisPort = 16379; // Development Environment
}
else if (runEnvironment == TEST_ENV) // Test environment
{
	 redisIP = "10.14.200.235"; 
	 redisPort = 36379;
}
else if (runEnvironment == QA_ENV) // QA environment
{
	 redisIP = "10.14.200.235"; 
	 redisPort = 26379;
}


/* SnapLogic Server Details */
var SLIhostname="ec2-50-18-48-77.us-west-1.compute.amazonaws.com" ;
var SLportNo=80;
var SLpath = "/feed/EA/Call_XXEA_Mobility_Stored_Procedure/Update_Responder_Action/Output1" ;
var SLusername = "shepard" ;
var SLpassword = "eatest77" ;

/* Java ERP Interface */
var javaERPIntHost = "10.14.200.235";
var javaERPIntPort = 10080; //Development Environment
var javaERPIntPath = '/emEntConnect/erpService/erpWfAction' ;
if (runEnvironment == DEV_ENV) // Dev environment
	javaERPIntPort = 10080; 
else if (runEnvironment == TEST_ENV) // Test environment
	javaERPIntPort = 30080;
else if (runEnvironment == QA_ENV) // QA environment
	javaERPIntPort = 20080;

/* LDAP details */
var searchUsername = "kawsingh@contractor.ea.com" ;
var searchUserPass = "Ctskawal123" ;
var ldapURL = "ldap://ad.ea.com:3268" ;

/* For windows setup keep this configuration as 0, otherwise it will be always 1 */
var ldapSupport ;
if (LOCAL_ENV)
	ldapSupport = 0; //1 for EA connected else 0
else
	ldapSupport = 1; //1 for EA connected else 0
	
var oracleDbSupport = 0 ;
var UAProfSupport = 0 ;
var testEnvironment = 0 ;
var javaERPInterface = 1 ;
var AndroidNotifySupport = 1 ;
var AppleNotifySupport = 1 ;

/* Log configuration */
var logConsoleOut = 1 ; // For Enabling / disabling output in console
var logFileOut = 1 ;	// For Enabling / disabling output in File
var logCLFSupport = 1 ; // For Enabling / disabling CLF FILE
var logFile="./emApproveServer.log" ;	// Log file name
var notlogFile="./emNotificationDispatcher.log" ;	// Log file name
var logLevel="silly" ;
var logFileMaxSize = 500 * 1024 * 1024 ; // 500 Mb. Maximun size of the file
var logFileMaxFile = 0 ; // unlimited. Maximum number of files
var CLFFileName="./emApproveServer.clf"
var CLFLogLevel = "info"
var CLFLogFileMaxSize = 500 * 1024 * 1024 ; // 500 Mb. Maximun size of the file
var CLFLogFileMaxFile = 0 ; // unlimited. Maximum number of files
var CLFLogFormat = "%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-agent}i\" \"%R\" \"%N\" \"%P\" \"%I\" \"%V\" \"%G\" \"%S\" %U \"%T\"" ; // Combined Log format string
// h --> device id
// l --> "-"
// u --> userid
// t --> Time when the request was recieved [day/month/year:hour:minute:second zone] 
// r --> "POST /ea-erp HTTP/1.1"
// s --> Status code
// b --> number of bytes
// Referer --> "-"
// User-Agent --> "-"
// R --> Request Type
// N --> Device Name
// P --> Device Platform
// I --> Device Version
// G --> Requestor Given Name
// S --> Requestor Second Name
// U --> Requestor User ID
// T --> Requestor Title


/* List of White List Users... Email, Password, Name, UserID */
var whiteListUsers = [ 
	["pazhang@ea.com", "Welcome", "Paige Zhang", "142461"],
	["unaicker@ea.com", "Welcome", "Udesh Naicker", "131329"],
	["dadvani@ea.com", "Welcome", "Deepak Advani", "119794"],
	["mtonnesen@ea.com", "Welcome", "Mark Tonnesen", "141915"],
	["rajat@ea.com", "Welcome", "Rajat Taneja", "140714"],
	["ryoshii@ea.com", "Welcome", "Ryuhei Yoshii", "143664"],
    ["gparampalli@ea.com", "Welcome", "Gopi Parampalli", "143419"],
	["VMaudgalya@ea.com", "Welcome", "Venktesh Maudgalya", "112377"]
] ;


var ContentTypeJSONHeader = "Content-Type: application/json" ;
var AuthenticationJSONError = "{\"data\":{\"status\":\"error\"}}" ;
var AuthenticationJSONSuccess = "{\"data\":{\"status\":\"success\"}}" ;

var winston ;
var fstream ;

var SUCCESS = 1 ;
var FAILURE = 0 ;

var REQ_SUCCESS = 200 ;
var REQ_SUCCESS_TEXT = "200" ;
var REQ_UNAUTHORISED_TEXT = "401" ;
var REQ_FAIL = 500 ;


var UNAUTHORISED_STATUS = 401 ;
var INVALID_CREDENTIALS = 402 ;
var APPROVEREQ_REJECT = 410 ;
var REJECTREQ_REJECT = 411 ;

var SessionTokenId = "SessionTokenId";

var ldapHost = "ad.ea.com";
var ldapPort = 3268;
var ldapBase = "DC=ad,DC=ea,DC=com" ;
var ldapScheme = "ldap" ;

/* Requests Types */
// User relate general requests
var AuthenticateUserReq = "AuthenticateUserReq";
var AuthenticateUserRes = "AuthenticateUserRes";
var LogoutUserReq = "LogoutUserReq";
var LogoutUserRes = "LogoutUserRes";
var WorkListDetailsReq = "WorkListDetailsReq";
var WorkListDetailsRes = "WorkListDetailsRes";
var RegisterAppReq = "RegisterAppReq" ;
var RegisterAppRes = "RegisterAppRes" ;
var UnRegisterAppReq = "UnRegisterAppReq" ;
var UnRegisterAppRes = "UnRegisterAppRes" ;


//Purchase Requisition PR related requests
var QueryWorklistPRReq = "QueryWorklistPRReq";
var QueryWorklistPRRes = "QueryWorklistPRRes";
var QueryPRDetailedInfoReq = "QueryPRDetailedInfoReq";
var QueryPRDetailedInfoRes = "QueryPRDetailedInfoRes";
var QueryHistoryItemsReq = "QueryHistoryItemsReq";
var QueryHistoryItemsRes = "QueryHistoryItemsRes";
var PRApproveItemReq = "PRApproveItemReq";
var PRApproveItemRes = "PRApproveItemRes";
var PRRejectItemReq = "PRRejectItemReq";
var PRRejectItemRes = "PRRejectItemRes";

//Expense Report IE related requests
var QueryWorklistIEReq = "QueryWorklistIEReq";
var QueryWorklistIERes = "QueryWorklistIERes";
var QueryIEHistoryItemsReq = "QueryIEHistoryItemsReq";
var QueryIEHistoryItemsRes = "QueryIEHistoryItemsRes";
var QueryIEDetailedInfoReq = "QueryIEDetailedInfoReq";
var QueryIEDetailedInfoRes = "QueryIEDetailedInfoRes";

//Journal Entry JE related requests
var QueryWorklistJEReq = "QueryWorklistJEReq";
var QueryWorklistJERes = "QueryWorklistJERes";
/* Redis Db Error Messages*/
var RedisDbError = -1000;
var RedisErrStoringHashKey = "Error in storing notification ID hash key";
var RedisMessage = "Message from redis";
var RedisHashKeyStoreSucess = "Notification ID and fields added successfully";
var RedisErrStoringSetKey = "Error in storing User ID set key";
var RedisSetKeyStoreSucess = "User ID set key added successfully";
var RedisSetAppleQueueKeyStoreSucess = "Device Token added successfully in set APPLE_NOTIFY_QUEUE";
var RedisErrStoringAppleQueueSetKey = "Error in storing Device Token to set APPLE_NOTIFY_QUEUE";
var RedisSetAndroidQueueKeyStoreSucess = "Device Token added successfully in set ANDROID_NOTIFY_QUEUE";
var RedisErrStoringAndroidQueueSetKey = "Error in storing Device Token to set ANDROID_NOTIFY_QUEUE";
var RedisNotificationIDDeletion = "Successfully deleted Notification ID from NOTIFICATION_QUEUE";
var RedisErrNotificationIDDeletion = "Error in deleting Notification ID from NOTIFICATION_QUEUE";



/* Redis DB's */
var commonRedisDb = 0 ; // For common activities like session details / user profile, this database will be used
//var PRRedisDb = 0; // For PR we will be using database 1 
var PRSessionRedisDb = 0; // For PR we will be using database 1 
var IERedisDb = 2; // For Expense we will be using database 2 
var JERedisDb = 3; // For Journal Entry using Database 3


/* For Notification Dispatcher */
//var APIKey = "lAIzaSyDix4KF3N1nQyt-3PCakgkW0I5iz3SKj0I" ;
//var APIKey="AIzaSyDcXXwIAIXjSKvpc6za1kxFSA2cO4jf9vU" ;
var APIKey="AIzaSyDqk3Nf7MKmglYomeuN9fz3DiO836H3thM" ;
var APNSServerAddress = 'gateway.sandbox.push.apple.com' ;  // this URL is different for Apple's Production Servers and changes when you go to production
var GCMServerAddress = "" ;  // Need to check
var APNSServerPort = 2195 ;
var APNSCertFilePath = 'PushSampleIOSCert.pem' ;
var APNSKeyFilePath = 'PushSampleIOSKey.pem' ;
var APNSKeyPassPhrase = 'ea_123456' ;
var AppleNotLaunchImage = "mysplash.png" ;
var AppleNotActionLocKey = "Play" ;
var AppleNotMessageFrom = "emApprove Server" ;
var AppleNotSound = "notification-beep.wav" ;
var ApplePlatformDevices = [ "iOS", "iPad", "iPhone"] ;  // Need to define to support multiple values
var AndroidPlatformDevices = [ "Android", "Ginger"] ; // Need to define to support multiple values
var MaxNotTry = 5 ;
var RetryAfterTime = 1 * 60 * 60 ; // 1 hr
var notTimeToLive = 1 * 24 * 60 * 60 ; // 1 day
var NotificationQueueSetKey = 'NOTIFICATION_QUEUE';
var AppleNotifyQueueSet = "APPLE_NOTIFY_QUEUE";
var AndroidNotifyQueueSet = "ANDROID_NOTIFY_QUEUE";
var DevicePlatformError = "The device platform is not registered";
var gcmRespMulticaseID = "multicast_id" ;
var gcmRespSuccess = "success" ;
var gcmRespFailure = "failure" ;
var gcmRespCanonicalIds = "canonical_ids" ;
var gcmRespResults = "results" ;

/* Make the variables accessible across other files */
exports.oracleNodeModulePath=oracleNodeModulePath;
exports.ldapNodeModulePath=ldapNodeModulePath;
exports.winstonNodeModulePath=winstonNodeModulePath;
exports.redisNodeModulePath=redisNodeModulePath;
exports.apnModulePath=apnModulePath;
exports.gcmModulePath=gcmModulePath;

exports.EAERPModule=EAERPModule;
exports.PortNo=PortNo;
exports.ContentTypeJSONHeader=ContentTypeJSONHeader;
exports.AuthenticationJSONError=AuthenticationJSONError;
exports.AuthenticationJSONSuccess=AuthenticationJSONSuccess;
exports.redisIP=redisIP;
exports.redisPort=redisPort;
exports.fstream=fstream;
exports.logFile=logFile;
exports.notlogFile=notlogFile;
exports.logLevel=logLevel;

exports.SUCCESS=SUCCESS;
exports.FAILURE=FAILURE;
exports.REQ_SUCCESS=REQ_SUCCESS;
exports.REQ_SUCCESS_TEXT=REQ_SUCCESS_TEXT;
exports.SessionTokenId=SessionTokenId;
exports.REQ_FAIL=REQ_FAIL;


exports.ldapSupport=ldapSupport;
exports.UAProfSupport=UAProfSupport;
exports.oracleDbSupport=oracleDbSupport;

exports.ldapBase=ldapBase;
exports.ldapHost=ldapHost;
exports.ldapPort=ldapPort;
exports.ldapScheme=ldapScheme;

exports.AuthenticateUserReq=AuthenticateUserReq;
exports.AuthenticateUserRes=AuthenticateUserRes;
exports.QueryWorklistPRReq=QueryWorklistPRReq;
exports.QueryWorklistPRRes=QueryWorklistPRRes;
exports.QueryPRDetailedInfoReq=QueryPRDetailedInfoReq;
exports.QueryPRDetailedInfoRes=QueryPRDetailedInfoRes;
exports.PRApproveItemReq = PRApproveItemReq;
exports.PRApproveItemRes = PRApproveItemRes;
exports.PRRejectItemReq = PRRejectItemReq;
exports.PRRejectItemRes = PRRejectItemRes;

exports.RedisDbError = RedisDbError;
exports.RedisErrStoringHashKey = RedisErrStoringHashKey;
exports.RedisMessage = RedisMessage;
exports.RedisHashKeyStoreSucess = RedisHashKeyStoreSucess;
exports.RedisSetKeyStoreSucess = RedisSetKeyStoreSucess;
exports.RedisErrStoringSetKey = RedisErrStoringSetKey;
exports.RedisSetAppleQueueKeyStoreSucess = RedisSetAppleQueueKeyStoreSucess;
exports.RedisErrStoringAppleQueueSetKey = RedisErrStoringAppleQueueSetKey;
exports.RedisNotificationIDDeletion = RedisNotificationIDDeletion;
exports.RedisErrNotificationIDDeletion = RedisErrNotificationIDDeletion;


exports.UNAUTHORISED_STATUS = UNAUTHORISED_STATUS;
exports.INVALID_CREDENTIALS = INVALID_CREDENTIALS;
exports.REQ_UNAUTHORISED_TEXT = REQ_UNAUTHORISED_TEXT;
exports.QueryHistoryItemsReq=QueryHistoryItemsReq;
exports.QueryHistoryItemsRes=QueryHistoryItemsRes;
exports.LogoutUserReq = LogoutUserReq;
exports.LogoutUserRes = LogoutUserRes;
exports.WorkListDetailsReq = WorkListDetailsReq;
exports.WorkListDetailsRes = WorkListDetailsRes;
exports.util = util;
exports.RegisterAppReq = RegisterAppReq;
exports.RegisterAppRes = RegisterAppRes;
exports.UnRegisterAppReq = UnRegisterAppReq;
exports.UnRegisterAppRes = UnRegisterAppRes;

exports.APPROVEREQ_REJECT = APPROVEREQ_REJECT;
exports.REJECTREQ_REJECT = REJECTREQ_REJECT;


exports.SLIhostname = SLIhostname;
exports.SLportNo = SLportNo;
exports.SLpath = SLpath;
exports.SLusername = SLusername;
exports.SLpassword = SLpassword;

exports.searchUsername = searchUsername;
exports.searchUserPass = searchUserPass;
exports.ldapURL = ldapURL;
exports.whiteListUsers = whiteListUsers;
exports.testEnvironment = testEnvironment;
exports.javaERPInterface = javaERPInterface;
exports.AndroidNotifySupport = AndroidNotifySupport;
exports.AppleNotifySupport = AppleNotifySupport;
exports.logConsoleOut = logConsoleOut;
exports.logFileOut = logFileOut;
exports.winston = winston;

exports.javaERPIntHost = javaERPIntHost;
exports.javaERPIntPort = javaERPIntPort;
exports.javaERPIntPath = javaERPIntPath;

exports.logFileMaxSize = logFileMaxSize;
exports.logFileMaxFile = logFileMaxFile;

exports.logCLFSupport = logCLFSupport;
exports.CLFFileName = CLFFileName;
exports.CLFLogLevel = CLFLogLevel;
exports.CLFLogFileMaxSize = CLFLogFileMaxSize;
exports.CLFLogFileMaxFile = CLFLogFileMaxFile;
exports.CLFLogFormat = CLFLogFormat;

//IE Expense Report related exports
exports.QueryWorklistIEReq = QueryWorklistIEReq;
exports.QueryWorklistIERes = QueryWorklistIERes;
exports.QueryIEHistoryItemsReq = QueryIEHistoryItemsReq;
exports.QueryIEHistoryItemsRes = QueryIEHistoryItemsRes;
exports.QueryIEDetailedInfoReq = QueryIEDetailedInfoReq;
exports.QueryIEDetailedInfoRes = QueryIEDetailedInfoRes;

//JE Journal Entry related exports
exports.QueryWorklistJEReq = QueryWorklistJEReq;
exports.QueryWorklistJERes = QueryWorklistJERes;

//Redis DB's
exports.commonRedisDb = commonRedisDb;
exports.PRSessionRedisDb = PRSessionRedisDb;
exports.IERedisDb = IERedisDb;
exports.JERedisDb = JERedisDb;

/* Notification Dispatcher */
exports.APIKey = APIKey;
exports.APNSServerAddress = APNSServerAddress;
exports.APNSServerPort = APNSServerPort;
exports.APNSCertFilePath = APNSCertFilePath;
exports.APNSKeyFilePath = APNSKeyFilePath;
exports.APNSKeyPassPhrase = APNSKeyPassPhrase;
exports.AppleNotLaunchImage = AppleNotLaunchImage;
exports.AppleNotActionLocKey = AppleNotActionLocKey;
exports.AppleNotMessageFrom = AppleNotMessageFrom;
exports.AppleNotSound = AppleNotSound;
exports.GCMServerAddress = GCMServerAddress;
exports.ApplePlatformDevices = ApplePlatformDevices;
exports.AndroidPlatformDevices = AndroidPlatformDevices;
exports.MaxNotTry = MaxNotTry;
exports.RetryAfterTime = RetryAfterTime;
exports.notTimeToLive = notTimeToLive;
exports.NotificationQueueSetKey = NotificationQueueSetKey;
exports.AppleNotifyQueueSet = AppleNotifyQueueSet;
exports.AndroidNotifyQueueSet = AndroidNotifyQueueSet;
exports.DevicePlatformError = DevicePlatformError;
exports.gcmRespMulticaseID = gcmRespMulticaseID;
exports.gcmRespSuccess = gcmRespSuccess;
exports.gcmRespFailure = gcmRespFailure;
exports.gcmRespCanonicalIds = gcmRespCanonicalIds;
exports.gcmRespResults = gcmRespResults;




