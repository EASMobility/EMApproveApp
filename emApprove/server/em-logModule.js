
/* File : logModule.js
*  Description: This file contains the modules for logging using WINSTON log module
*/

/* define.js :- Include the definations file */
var define = require("./em-define");
var winston = require(define.winstonNodeModulePath);

var clflog ;



/* This function initialises the Log Module */
function initLogModule (logFilename, logLevel, fileMaxsize, fileMaxfiles, needConsoleLog, needFileLog, callback)
{
	winston.remove(winston.transports.Console) ; // Be default it is ON
	if (needConsoleLog)
	{
		winston.add(winston.transports.Console, {level: logLevel });
	}
	if (needFileLog)
	{
		winston.add(winston.transports.File, { filename: logFilename, level: logLevel, maxsize: fileMaxsize, maxFiles: fileMaxfiles, json: false });
	}
	define.winston = winston ;

	callback (0) ; // return Success
}


function getLogModule ()
{
	return winston ;
}


function initCLFLogModule (logFilename, logLevel, fileMaxsize, fileMaxfiles, callback)
{
	clflog = require ('fs').createWriteStream (logFilename, {'flags': 'a'}) ;
	
	//winston2.add(winston2.transports.File, { filename: logFilename, level: logLevel, maxsize: fileMaxsize, maxFiles: fileMaxfiles, json: false });
	/*
	var logger = new (winston.Logger) ({
    transports: [
        new (winston.transports.File) ({ 
            level: logLevel,
            filename: logFilename ,
            json: false
        }),
		]

	logger.data ("Hello man how are you\n") ;

	callback (0) ;

	}) ;
	*/
}

//var CLFLogFormat "%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-agent}i\" %R %N %P %I %V %G %S %U %T" ; // Combined Log format string
// h --> device id
// l --> "-"
// u --> userid
// t --> Time when the request was recieved [day/month/year:hour:minute:second zone] 
// r --> "POST /ea-erp HTTP/1.1"
// b --> number of bytes
// s --> Status code
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

function putCLFRecord (iden, reqLine, reqStatusCode, resBytes, referer, useragent, reqType, dname, dplat, did, dver, gname, sname, uid, uTitle)
{
	var logformat = define.CLFLogFormat ;

	if (!iden) iden = "-" ;
	if (!reqLine) reqLine = "-" ;
	if (!reqStatusCode) reqStatusCode = "-" ;
	if (!resBytes) iden = "-" ;
	if (!referer) referer = "-" ;
	if (!useragent) useragent = "-" ;
	if (!reqType) reqType = "-" ;
	if (!dname) dname = "-" ;
	if (!dplat) dplat = "-" ;
	if (!did) did = "-" ;
	if (!dver) dver = "-" ;
	if (!gname) gname = "-" ;
	if (!sname) sname = "-" ;
	if (!uid) uid = "-" ;
	if (!uTitle) uTitle = "-" ;

	console.log ("KAWAL: DEBUGMS ... In function putCLFRecord \n") ;
	getCurrentDateCLFFormat (function (curTime) 
	{
		var CLFBuff = (((((((((((((((((logformat.replace ("%T", uTitle)).replace ("%U", uid)).replace ("%S", sname)).replace ("%G", gname)).replace ("%V", dver)).replace ("%I", did)).replace ("%P", dplat)).replace ("%N", dname)).replace ("%R", reqType)).replace ("%{User-agent}i", useragent)).replace ("%{Referer}i", referer)).replace ("%b", resBytes)).replace ("%>s", reqStatusCode)).replace ("%r", reqLine)).replace ("%t", curTime)).replace ("%u", uid)).replace ("%l", iden)).replace ("%h", did) ;
		//winston.log ("debug", CLFBuff) ;
		clflog.write (CLFBuff+"\n") ;
	}) ;
}


// [day/month/year:hour:minute:second zone]
function getCurrentDateCLFFormat (callback)
{
    var myDate = new Date () ;
	var months = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec') ;
    var month = myDate.getMonth() + 1;
    oMonth = (month < 10 ? '0' + month : month) ;
	oMonthStr = months [oMonth-1] ;
    var cDate = myDate.getDate();
    oDate = (cDate < 10 ? '0' + cDate : cDate) ;
    var hrs = myDate.getHours();
    oHrs = (hrs < 10 ? '0' + hrs : hrs) ;
    var min = myDate.getMinutes();
    oMin = (min < 10 ? '0' + min : min) ;
    var sec = myDate.getSeconds();
    oSec = (sec < 10 ? '0' + sec : sec) ;
	var tzoffset = myDate.getTimezoneOffset () ;
	console.log ("tzoffset is [" + tzoffset + "]\n") ;
	gettzstr (Math.abs (tzoffset), function (tzstr)
	{
		console.log ("tzstr is [" + tzstr + "]\n") ;
		if (tzoffset > 0)
		{
			otzstr = "-" + tzstr ;
		}
		else
		{
			otzstr = "-" + tzstr ;
		}
		
		var outdate = oDate + "/" + oMonthStr + "/" + myDate.getFullYear() + ":" + oHrs + ":" + oMin + ":" + oSec + " " + otzstr;
		callback (outdate) ;
	}) ;

}

function gettzstr (min, callback)
{
	console.log ("min recvd is " + min) ;
	var hr = Math.floor (min / 60) ;
	console.log ("hr is " + hr) ;
	
	ohr = (hr < 10 ? '0' + hr : hr) ;
	
	rmin = min - (hr*60) ;
	omin = (rmin < 10 ? '0' + rmin : rmin) ;
	
	callback (ohr+omin) ;
}




//Methods or Properties to be used across this ERP Node Modules
exports.initLogModule = initLogModule;
exports.getLogModule = getLogModule;
exports.initCLFLogModule = initCLFLogModule;
exports.putCLFRecord = putCLFRecord;



