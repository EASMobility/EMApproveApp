

/* File : responseHandler.js
*  Description: This file process the resposne to be
*  sent back to the client
*/

/* define.js :- Include the definations file */
var define = require("./em-define");

/* For logging */
var logModule = require("./em-logModule");
var winston = logModule.getLogModule (); 


/* Description : The function forms the PRWorkListItemsResponse 
*  for the data which is fetched from the ERP system. 
*/
function getPRWorkListItemResponse (Tid, statusCode, statusText, PRWorkListItems, callback)
{
	winston.log ("silly", "Request for Tid ::" + Tid) ;
	winston.log ("silly", "Status Code is ::" + statusCode) ;
	winston.log ("silly", "Status Text is ::" + statusText) ;

	var PRWorkListItemsResponse = new Object () ;
	PRWorkListItemsResponse.QueryWorklistPRApprRes = new Object () ;
	PRWorkListItemsResponse.QueryWorklistPRApprRes.Tid = Tid ;
	
	PRWorkListItemsResponse.QueryWorklistPRApprRes.Status = new Object () ;
	PRWorkListItemsResponse.QueryWorklistPRApprRes.Status.Code = statusCode ;
	PRWorkListItemsResponse.QueryWorklistPRApprRes.Status.Text = statusText ;
	
	winston.log ("silly", "status code is ::" + statusCode) ;
	if (statusCode == define.REQ_SUCCESS_TEXT)
	{
		PRWorkListItemsResponse.QueryWorklistPRApprRes.PurchaseRequisition = [];
		var j = 0 ;
		for (var i in PRWorkListItems)
		{
			/*
			winston.log ("========== START Of [" + i + "] record ==========") ;
			winston.log ("PRWorkListItems["+i+"].NOTIFICATIONID :: " + PRWorkListItems[i].NOTIFICATIONID) ;
			//winston.log ("PRWorkListItems["+i+"].ITEMKEY :: " + PRWorkListItems[i].ITEMKEY) ;
			winston.log ("PRWorkListItems["+i+"].REQUISITIONHEADERID :: " + PRWorkListItems[i].REQUISITIONHEADERID) ;
			winston.log ("PRWorkListItems["+i+"].REQUISITIONNUMBER :: " + PRWorkListItems[i].REQUISITIONNUMBER) ;
			winston.log ("PRWorkListItems["+i+"].DESCRIPTION :: " + PRWorkListItems[i].DESCRIPTION) ;
			winston.log ("PRWorkListItems["+i+"].Amount :: " + PRWorkListItems[i].Amount) ;
			//winston.log ("PRWorkListItems["+i+"].MESSAGENAME :: " + PRWorkListItems[i].MESSAGENAME) ;
			winston.log ("PRWorkListItems["+i+"].STATUS :: " + PRWorkListItems[i].STATUS) ;
			winston.log ("PRWorkListItems["+i+"].APPROVALREQUESTEDDATE :: " + PRWorkListItems[i].APPROVALREQUESTEDDATE) ;
			winston.log ("PRWorkListItems["+i+"].APPROVEDDATE :: " + PRWorkListItems[i].APPROVEDDATE) ;
			winston.log ("PRWorkListItems["+i+"].APPROVALREQUESTEDBY :: " + PRWorkListItems[i].APPROVALREQUESTEDBY) ;
			//winston.log ("PRWorkListItems["+i+"].EMERGENCYPONUM :: " + PRWorkListItems[i].EMERGENCYPONUM) ;
			winston.log ("PRWorkListItems["+i+"].APPROVEREMPLOYEENUMBER :: " + PRWorkListItems[i].APPROVEREMPLOYEENUMBER) ;
			//winston.log ("PRWorkListItems["+i+"].FROMUSER :: " + PRWorkListItems[i].FROMUSER) ;
			winston.log ("PRWorkListItems["+i+"].TOUSER :: " + PRWorkListItems[i].TOUSER) ;
			winston.log ("PRWorkListItems["+i+"].REQUESTOR :: " + PRWorkListItems[i].REQUESTOR) ;
			//winston.log ("PRWorkListItems["+i+"].REQUESTOREMPLOYEENUMBER :: " + PRWorkListItems[i].REQUESTOREMPLOYEENUMBER) ;
			winston.log ("========== END of the record ==========\n");
			*/
						
			if (PRWorkListItems[i].STATUS == "Awaiting Approval") // Take only that records for which the status is waiting for approval
			{
				PR = new Object () ;
				PR.NOTIFICATIONID = PRWorkListItems[i].NOTIFICATIONID;
				//PR.ITEMKEY = PRWorkListItems[i].ITEMKEY;
				PR.REQUISITIONHEADERID = PRWorkListItems[i].REQUISITIONHEADERID;
				PR.REQUISITIONNUMBER = PRWorkListItems[i].REQUISITIONNUMBER;
				PR.DESCRIPTION = PRWorkListItems[i].DESCRIPTION;
				PR.Amount = PRWorkListItems[i].Amount;
				PR.CURRENCYCODE = PRWorkListItems[i].CURRENCYCODE;
				
				/* Temproray change to support currency code in the node code till the time it is not supported in sync tool */
				var amountStr = PRWorkListItems[i].Amount;
				winston.log ("debug", "KAWALTESTING the amount str from db is" + amountStr) ;
				if(amountStr)
				{
					amountStr = amountStr.trim() ;
					var mySplitResult = amountStr.split(" ");
					PR.Amount = mySplitResult[0] ;
					if (mySplitResult[1])
						PR.CURRENCYCODE = mySplitResult[1] ;
					winston.log ("debug", "KAWALTESTING the Amount is" + PR.Amount) ;
					winston.log ("debug", "KAWALTESTING the CURRENCYCODE is" + PR.CURRENCYCODE) ;
				}
				/* Temporary changes for currency till here */
				
				//PR.Amount = PRWorkListItems[i].Amount;
				//PR.CURRENCYCODE = PRWorkListItems[i].CURRENCYCODE;
				//PR.MESSAGENAME = PRWorkListItems[i].MESSAGENAME;
				PR.STATUS = PRWorkListItems[i].STATUS;   
				PR.APPROVALREQUESTEDDATE = PRWorkListItems[i].APPROVALREQUESTEDDATE;
				PR.APPROVEDDATE = PRWorkListItems[i].APPROVEDDATE;
				PR.APPROVALREQUESTEDBY = PRWorkListItems[i].APPROVALREQUESTEDBY;
				//PR.EMERGENCYPONUM = PRWorkListItems[i].EMERGENCYPONUM;
				PR.APPROVEREMPLOYEENUMBER = PRWorkListItems[i].APPROVEREMPLOYEENUMBER;
				//PR.FROMUSER = PRWorkListItems[i].FROMUSER;
				PR.TOUSER = PRWorkListItems[i].TOUSER;

				var modRequestor = (PRWorkListItems[i].REQUESTOR).substring (0, 20) ;
				//var modRequestor = (PRWorkListItems[i].REQUESTOR;).substring (0, 20) ;

				//winston.log ("silly", "Mod requestor is : " + modRequestor) ;
				var reqToTitle = modRequestor.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
				//winston.log ("silly", "reqToTitle requestor is : " + reqToTitle) ;
				
				PR.REQUESTOR = reqToTitle ;
				//PR.REQUESTOR = PRWorkListItems[i].REQUESTOR;
				//PR.REQUESTOREMPLOYEENUMBER = PRWorkListItems[i].REQUESTOREMPLOYEENUMBER;
				PRWorkListItemsResponse.QueryWorklistPRApprRes.PurchaseRequisition [j++] = PR ;
			}
		}
	}
	callback (PRWorkListItemsResponse) ;
}


function getAuthenticationResponse (Tid, statusCode, statusText, sessionID, userid, callback)
{
	winston.log ("silly", "Request for Tid ::" + Tid) ;
	winston.log ("silly", "Status Code is ::" + statusCode) ;
	winston.log ("silly", "Status Text is ::" + statusText) ;

	var AuthenticationResponse = new Object () ;
	AuthenticationResponse.AuthenticateUserRes = new Object () ;
	AuthenticationResponse.AuthenticateUserRes.Tid = Tid ;
	AuthenticationResponse.AuthenticateUserRes.SessionTokenId = sessionID ;
	AuthenticationResponse.AuthenticateUserRes.USERID = userid ;
	
	AuthenticationResponse.AuthenticateUserRes.Status = new Object () ;
	AuthenticationResponse.AuthenticateUserRes.Status.Code = statusCode ;
	AuthenticationResponse.AuthenticateUserRes.Status.Text = statusText ;
	
	callback (AuthenticationResponse) ;
}

/* Description : The function forms the QueryHistoryItemsResponse 
*  for the data which is fetched from the ERP system. 
*/
function getQueryHistoryItemsRes (Tid, statusCode, statusText, PRHistoryItems, callback)
{
	winston.log ("silly", "Request for Tid ::" + Tid) ;
	winston.log ("silly", "Status Code is ::" + statusCode) ;
	winston.log ("silly", "Status Text is ::" + statusText) ;

	var PRHistoryItemsResponse = new Object () ;
	PRHistoryItemsResponse.QueryPRHistoryRes = new Object () ;
	PRHistoryItemsResponse.QueryPRHistoryRes.Tid = Tid ;
	
	PRHistoryItemsResponse.QueryPRHistoryRes.Status = new Object () ;
	PRHistoryItemsResponse.QueryPRHistoryRes.Status.Code = statusCode ;
	PRHistoryItemsResponse.QueryPRHistoryRes.Status.Text = statusText ;
	
	winston.log ("silly", "status code is ::" + statusCode) ;
	if (statusCode == define.REQ_SUCCESS_TEXT)
	{
		PRHistoryItemsResponse.QueryPRHistoryRes.PurchaseRequisition = [];
		var j = 0 ;
		for (var i in PRHistoryItems)
		{
			/* 
			winston.log ("========== START Of [" + i + "] record ==========") ;
			winston.log ("PRHistoryItems["+i+"].NOTIFICATIONID :: " + PRHistoryItems[i].NOTIFICATIONID) ;
			//winston.log ("PRHistoryItems["+i+"].ITEMKEY :: " + PRHistoryItems[i].ITEMKEY) ;
			winston.log ("PRHistoryItems["+i+"].REQUISITIONHEADERID :: " + PRHistoryItems[i].REQUISITIONHEADERID) ;
			winston.log ("PRHistoryItems["+i+"].REQUISITIONNUMBER :: " + PRHistoryItems[i].REQUISITIONNUMBER) ;
			winston.log ("PRHistoryItems["+i+"].DESCRIPTION :: " + PRHistoryItems[i].DESCRIPTION) ;
			winston.log ("PRHistoryItems["+i+"].Amount :: " + PRHistoryItems[i].Amount) ;
			//winston.log ("PRHistoryItems["+i+"].MESSAGENAME :: " + PRHistoryItems[i].MESSAGENAME) ;
			winston.log ("PRHistoryItems["+i+"].STATUS :: " + PRHistoryItems[i].STATUS) ;
			winston.log ("PRHistoryItems["+i+"].APPROVALREQUESTEDDATE :: " + PRHistoryItems[i].APPROVALREQUESTEDDATE) ;
			winston.log ("PRHistoryItems["+i+"].APPROVEDDATE :: " + PRHistoryItems[i].APPROVEDDATE) ;
			winston.log ("PRHistoryItems["+i+"].APPROVALREQUESTEDBY :: " + PRHistoryItems[i].APPROVALREQUESTEDBY) ;
			//winston.log ("PRHistoryItems["+i+"].EMERGENCYPONUM :: " + PRHistoryItems[i].EMERGENCYPONUM) ;
			winston.log ("PRHistoryItems["+i+"].APPROVEREMPLOYEENUMBER :: " + PRHistoryItems[i].APPROVEREMPLOYEENUMBER) ;
			//winston.log ("PRHistoryItems["+i+"].FROMUSER :: " + PRHistoryItems[i].FROMUSER) ;
			winston.log ("PRHistoryItems["+i+"].TOUSER :: " + PRHistoryItems[i].TOUSER) ;
			winston.log ("PRHistoryItems["+i+"].REQUESTOR :: " + PRHistoryItems[i].REQUESTOR) ;
			//winston.log ("PRHistoryItems["+i+"].REQUESTOREMPLOYEENUMBER :: " + PRHistoryItems[i].REQUESTOREMPLOYEENUMBER) ;
			winston.log ("========== END of the record ==========\n");
			*/
						
			if (PRHistoryItems[i].STATUS != "Awaiting Approval") // Take the records for which the status is other than Awaiting approval
			{
				PR = new Object () ;
				PR.NOTIFICATIONID = PRHistoryItems[i].NOTIFICATIONID;
				//PR.ITEMKEY = PRHistoryItems[i].ITEMKEY;
				PR.REQUISITIONHEADERID = PRHistoryItems[i].REQUISITIONHEADERID;
				PR.REQUISITIONNUMBER = PRHistoryItems[i].REQUISITIONNUMBER;
				PR.DESCRIPTION = PRHistoryItems[i].DESCRIPTION;
				PR.Amount = PRHistoryItems[i].Amount;
				PR.CURRENCYCODE = PRHistoryItems[i].CURRENCYCODE;
				
				/* Temproray change to support currency code in the node code till the time it is not supported in sync tool */
				var amountStr = PRHistoryItems[i].Amount;
				winston.log ("debug", "KAWALTESTING the amount str from db is" + amountStr) ;
				if(amountStr)
				{
					amountStr = amountStr.trim() ;
					var mySplitResult = amountStr.split(" ");
					PR.Amount = mySplitResult[0] ;
					if (mySplitResult[1])
						PR.CURRENCYCODE = mySplitResult[1] ;
					winston.log ("debug", "KAWALTESTING the Amount is" + PR.Amount) ;
					winston.log ("debug", "KAWALTESTING the CURRENCYCODE is" + PR.CURRENCYCODE) ;
				}
				/* Temporary changes for currency till here */
				
				
				
				//PR.MESSAGENAME = PRHistoryItems[i].MESSAGENAME;
				PR.STATUS = PRHistoryItems[i].STATUS;   
				// KAWAL-COMMENTS-FIX FROM HERE
				var comments = PR.STATUS ;

				var tempcomments = comments ;
				var startIndex = tempcomments.indexOf (" ") ;
				var endIndex = tempcomments.indexOf(" :", startIndex+1) ;

				if (startIndex > 0 && endIndex > 0)
				{
					comments = tempcomments.substring (startIndex, endIndex) ;
					comments = comments.trim() ;
				}
				console.log ("The comments is [" + comments + "]") ;
				PR.DESCRIPTION = comments ;

				// KAWAL-COMMENTS-FIX TILL HERE
				PR.APPROVALREQUESTEDDATE = PRHistoryItems[i].APPROVALREQUESTEDDATE;
				PR.APPROVEDDATE = PRHistoryItems[i].APPROVEDDATE;
				PR.APPROVALREQUESTEDBY = PRHistoryItems[i].APPROVALREQUESTEDBY;
				//PR.EMERGENCYPONUM = PRHistoryItems[i].EMERGENCYPONUM;
				PR.APPROVEREMPLOYEENUMBER = PRHistoryItems[i].APPROVEREMPLOYEENUMBER;
				//PR.FROMUSER = PRHistoryItems[i].FROMUSER;
				//PR.TOUSER = PRHistoryItems[i].TOUSER;

				var modRequestor = (PRHistoryItems[i].TOUSER).substring (0, 20) ;
				var reqToTitle = modRequestor.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
				PR.TOUSER = reqToTitle ;

				PR.REQUESTOR = PRHistoryItems[i].REQUESTOR;
				//PR.REQUESTOREMPLOYEENUMBER = PRHistoryItems[i].REQUESTOREMPLOYEENUMBER;
				PRHistoryItemsResponse.QueryPRHistoryRes.PurchaseRequisition [j++] = PR ;
			}
		}
	}
	callback (PRHistoryItemsResponse) ;
}

function getPRDetailedInfoResponse (Tid, statusCode, statusText, PRDetailedInfoItems, callback)
{
	winston.log ("silly", "Request for Tid ::" + Tid) ;
	winston.log ("silly", "Status Code is ::" + statusCode) ;
	winston.log ("silly", "Status Text is ::" + statusText) ;

	var PRDetailedInfoResponse = new Object () ;
	PRDetailedInfoResponse.QueryPRDetailedInfoRes = new Object () ;
	PRDetailedInfoResponse.QueryPRDetailedInfoRes.Tid = Tid ;
	
	PRDetailedInfoResponse.QueryPRDetailedInfoRes.Status = new Object () ;
	PRDetailedInfoResponse.QueryPRDetailedInfoRes.Status.Code = statusCode ;
	PRDetailedInfoResponse.QueryPRDetailedInfoRes.Status.Text = statusText ;
	
	winston.log ("silly", "status code is ::" + statusCode) ;
	if (statusCode == define.REQ_SUCCESS_TEXT)
	{
		PRDetailedInfoResponse.QueryPRDetailedInfoRes.PRDetailedInfo = [];
		var j = 0 ;
		for (var i in PRDetailedInfoItems)
		{
					
			if (PRDetailedInfoItems[i].STATUS != "Awaiting Approval") // Take the records for which the status is other than Awaiting approval
			{
				PR = new Object () ;
				PR.REQUISITIONHEADERID = PRDetailedInfoItems[i].REQUISITIONHEADERID;
				PR.REQUISITIONLINEID = PRDetailedInfoItems[i].REQUISITIONLINEID;
				PR.LINENUM = PRDetailedInfoItems[i].LINENUM;
				PR.DESCRIPTION = PRDetailedInfoItems[i].DESCRIPTION;
				PR.QUANTITY = PRDetailedInfoItems[i].QUANTITY;
				PR.UNITPRICE = PRDetailedInfoItems[i].UNITPRICE;
				PR.CURRENCYCODE = PRDetailedInfoItems[i].CURRENCYCODE;

				if (!(PR.CURRENCYCODE) || PR.CURRENCYCODE == "")
					PR.CURRENCYCODE = "USD" ;
				winston.log ("debug", "PR.CURRENCYCODE is [" + PR.CURRENCYCODE + "]..") ;
				PRDetailedInfoResponse.QueryPRDetailedInfoRes.PRDetailedInfo [j++] = PR ;
			}
		}
	}
	callback (PRDetailedInfoResponse) ;
}


function getLogoutUserRes(Tid, statusCode, statusText, sessionID, callback)
{
	winston.log ("silly", "Request for Tid ::" + Tid) ;
	winston.log ("silly", "Status Code is ::" + statusCode) ;
	winston.log ("silly", "Status Text is ::" + statusText) ;

	var LogoutUserResponse = new Object () ;
	LogoutUserResponse.LogoutUserRes = new Object () ;
	LogoutUserResponse.LogoutUserRes.Tid = Tid ;
	LogoutUserResponse.LogoutUserRes.SessionTokenId = sessionID ;
	
	LogoutUserResponse.LogoutUserRes.Status = new Object () ;
	LogoutUserResponse.LogoutUserRes.Status.Code = statusCode ;
	LogoutUserResponse.LogoutUserRes.Status.Text = statusText ;
	
	callback (LogoutUserResponse) ;
}

function getWorkListDetailsRes(Tid, statusCode, statusText, sessionID, callback)
{
	winston.log ("silly", "Request for Tid ::" + Tid) ;
	winston.log ("silly", "Status Code is ::" + statusCode) ;
	winston.log ("silly", "Status Text is ::" + statusText) ;

	var WorkListDetailsResponse = new Object () ;
	WorkListDetailsResponse.WorkListDetailsRes = new Object () ;
	WorkListDetailsResponse.WorkListDetailsRes.Tid = Tid ;
	WorkListDetailsResponse.WorkListDetailsRes.SessionTokenId = sessionID ;
	
	WorkListDetailsResponse.WorkListDetailsRes.Status = new Object () ;
	WorkListDetailsResponse.WorkListDetailsRes.Status.Code = statusCode ;
	WorkListDetailsResponse.WorkListDetailsRes.Status.Text = statusText ;
	
	callback (WorkListDetailsResponse) ;
}


function getRegisterAppRes(Tid, statusCode, statusText, sessionID, callback)
{
	winston.log ("silly", "Request for Tid ::" + Tid) ;
	winston.log ("silly", "Status Code is ::" + statusCode) ;
	winston.log ("silly", "Status Text is ::" + statusText) ;

	var RegisterAppResponse = new Object () ;
	RegisterAppResponse.RegisterAppRes = new Object () ;
	RegisterAppResponse.RegisterAppRes.Tid = Tid ;
	RegisterAppResponse.RegisterAppRes.SessionTokenId = sessionID ;
	
	RegisterAppResponse.RegisterAppRes.Status = new Object () ;
	RegisterAppResponse.RegisterAppRes.Status.Code = statusCode ;
	RegisterAppResponse.RegisterAppRes.Status.Text = statusText ;
	
	callback (RegisterAppResponse) ;
}

function getUnRegisterAppRes(Tid, statusCode, statusText, sessionID, callback)
{
	winston.log ("silly", "Request for Tid ::" + Tid) ;
	winston.log ("silly", "Status Code is ::" + statusCode) ;
	winston.log ("silly", "Status Text is ::" + statusText) ;

	var UnRegisterAppResponse = new Object () ;
	UnRegisterAppResponse.UnRegisterAppRes = new Object () ;
	UnRegisterAppResponse.UnRegisterAppRes.Tid = Tid ;
	UnRegisterAppResponse.UnRegisterAppRes.SessionTokenId = sessionID ;
	
	UnRegisterAppResponse.UnRegisterAppRes.Status = new Object () ;
	UnRegisterAppResponse.UnRegisterAppRes.Status.Code = statusCode ;
	UnRegisterAppResponse.UnRegisterAppRes.Status.Text = statusText ;
	
	callback (UnRegisterAppResponse) ;
}


function getPRApprovedItemsResponse(Tid, statusCode, statusText, notID, callback)
{
	winston.log ("silly", "Request for Tid ::" + Tid) ;
	winston.log ("silly", "Status Code is ::" + statusCode) ;
	winston.log ("silly", "Status Text is ::" + statusText) ;

	var PRApprovedItemsResponse = new Object () ;
	PRApprovedItemsResponse.PRApproveItemRes = new Object () ;
	PRApprovedItemsResponse.PRApproveItemRes.Tid = Tid ;
	
	PRApprovedItemsResponse.PRApproveItemRes.Status = new Object () ;
	PRApprovedItemsResponse.PRApproveItemRes.Status.Code = statusCode;
	PRApprovedItemsResponse.PRApproveItemRes.Status.Text = statusText;

	PRApprovedItemsResponse.NOTIFICATIONID = notID;
	
	callback (PRApprovedItemsResponse) ;
}


function getPRRejectItemsResponse(Tid, statusCode, statusText, notID, callback)
{
	winston.log ("silly", "Request for Tid ::" + Tid) ;
	winston.log ("silly", "Status Code is ::" + statusCode) ;
	winston.log ("silly", "Status Text is ::" + statusText) ;

	var PRRejectItemsResponse = new Object () ;
	PRRejectItemsResponse.PRRejectItemRes = new Object () ;
	PRRejectItemsResponse.PRRejectItemRes.Tid = Tid ;
	
	PRRejectItemsResponse.PRRejectItemRes.Status = new Object () ;
	PRRejectItemsResponse.PRRejectItemRes.Status.Code = statusCode;
	PRRejectItemsResponse.PRRejectItemRes.Status.Text = statusText;

	PRRejectItemsResponse.NOTIFICATIONID = notID;
	
	callback (PRRejectItemsResponse) ;
}

/* IE Expense Report Responses */

/* Description : The function forms the IEWorkListItemsResponse 
*  for the data which is fetched from the ERP system. 
*/
function getIEWorkListItemResponse (Tid, statusCode, statusText, IEWorkListItems, callback)
{
	winston.log ("silly", "Request for Tid ::" + Tid) ;
	winston.log ("silly", "Status Code is ::" + statusCode) ;
	winston.log ("silly", "Status Text is ::" + statusText) ;

	var IEWorkListItemsResponse = new Object () ;
	IEWorkListItemsResponse.QueryWorklistIEApprRes = new Object () ;
	IEWorkListItemsResponse.QueryWorklistIEApprRes.Tid = Tid ;
	
	IEWorkListItemsResponse.QueryWorklistIEApprRes.Status = new Object () ;
	IEWorkListItemsResponse.QueryWorklistIEApprRes.Status.Code = statusCode ;
	IEWorkListItemsResponse.QueryWorklistIEApprRes.Status.Text = statusText ;
	
	winston.log ("silly", "status code is ::" + statusCode) ;
	if (statusCode == define.REQ_SUCCESS_TEXT)
	{
		IEWorkListItemsResponse.QueryWorklistIEApprRes.IExpenseReport = [];
		var j = 0 ;
		for (var i in IEWorkListItems)
		{
			/*
			winston.log ("========== START Of [" + i + "] record ==========") ;
			winston.log ("IEWorkListItems["+i+"].NOTIFICATIONID :: " + IEWorkListItems[i].NOTIFICATIONID) ;
			winston.log ("========== END of the record ==========\n");
			*/
						
			if (IEWorkListItems[i].STATUS == "Awaiting Approval") // Take only that records for which the status is waiting for approval
			{
				IE = new Object () ;
				IE.NOTIFICATIONID = IEWorkListItems[i].NOTIFICATIONID;				
				IE.REPORTHEADERID = IEWorkListItems[i].REPORTHEADERID;
				IE.IEXPENSENUMBER = IEWorkListItems[i].IEXPENSENUMBER;
				IE.DESCRIPTION = IEWorkListItems[i].DESCRIPTION;
				IE.AMOUNT = IEWorkListItems[i].AMOUNT;
				IE.CURRENCYCODE = IEWorkListItems[i].CURRENCYCODE;	
				
				/* Temproray change to support currency code in the node code till the time it is not supported in sync tool */
				var amountStr = IEWorkListItems[i].AMOUNT;
				winston.log ("debug", "KAWALTESTING the amount str from db is" + amountStr) ;
				if(amountStr)
				{
					amountStr = amountStr.trim() ;
					var mySplitResult = amountStr.split(" ");
					IE.AMOUNT = mySplitResult[0] ;
					if (mySplitResult[1])
						IE.CURRENCYCODE = mySplitResult[1] ;
					winston.log ("debug", "KAWALTESTING the Amount is" + IE.AMOUNT) ;
					winston.log ("debug", "KAWALTESTING the CURRENCYCODE is" + IE.CURRENCYCODE) ;
				}
				/* Temporary changes for currency till here */
				
				IE.REPORTSUBMITTEDDATE = IEWorkListItems[i].REPORTSUBMITTEDDATE;
				IE.APPROVALREQUESTEDDATE = IEWorkListItems[i].APPROVALREQUESTEDDATE;				
				IE.APPROVALREQUESTEDBY = IEWorkListItems[i].APPROVALREQUESTEDBY;
				IE.APPROVEDDATE = IEWorkListItems[i].APPROVEDDATE;
				IE.APPROVEREMPLOYEENUMBER = IEWorkListItems[i].APPROVEREMPLOYEENUMBER;
				IE.TOUSER = IEWorkListItems[i].TOUSER;
				IE.REQUESTOR = IEWorkListItems[i].REQUESTOR;
				IE.STATUS = IEWorkListItems[i].STATUS;   								
				IE.COSTCENTER = IEWorkListItems[i].COSTCENTER;
				var modRequestor = (IEWorkListItems[i].REQUESTOR).substring (0, 20) ;				
				var reqToTitle = modRequestor.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
				IE.REQUESTOR = reqToTitle ;				
				IEWorkListItemsResponse.QueryWorklistIEApprRes.IExpenseReport [j++] = IE ;
			}
		}
	}
	callback (IEWorkListItemsResponse) ;
}


/* Description : The function forms the QueryIEHistoryItemsRes 
*  for the data which is fetched from the ERP system. 
*/
function getQueryIEHistoryItemsRes(Tid, statusCode, statusText, IEHistoryItems, callback)
{
	winston.log ("silly", "Request for Tid ::" + Tid) ;
	winston.log ("silly", "Status Code is ::" + statusCode) ;
	winston.log ("silly", "Status Text is ::" + statusText) ;

	var IEHistoryItemsResponse = new Object () ;
	IEHistoryItemsResponse.QueryIEHistoryItemsRes = new Object () ;
	IEHistoryItemsResponse.QueryIEHistoryItemsRes.Tid = Tid ;
	
	IEHistoryItemsResponse.QueryIEHistoryItemsRes.Status = new Object () ;
	IEHistoryItemsResponse.QueryIEHistoryItemsRes.Status.Code = statusCode ;
	IEHistoryItemsResponse.QueryIEHistoryItemsRes.Status.Text = statusText ;
	
	winston.log ("silly", "status code is ::" + statusCode) ;
	if (statusCode == define.REQ_SUCCESS_TEXT)
	{
		IEHistoryItemsResponse.QueryIEHistoryItemsRes.IEHistoryItemsInfo = [];
		var j = 0 ;
		for (var i in IEHistoryItems)
		{
			/* 
			winston.log ("========== START Of [" + i + "] record ==========") ;
			winston.log ("IEHistoryItems["+i+"].NOTIFICATIONID :: " + IEHistoryItems[i].NOTIFICATIONID) ;		
			winston.log ("========== END of the record ==========\n");
			*/
						
			if (IEHistoryItems[i].STATUS != "Awaiting Approval") // Take the records for which the status is other than Awaiting approval
			{
				IE = new Object () ;
				IE.NOTIFICATIONID = IEHistoryItems[i].NOTIFICATIONID;				
				IE.REPORTHEADERID = IEHistoryItems[i].REPORTHEADERID;
				IE.IEXPENSENUMBER = IEHistoryItems[i].IEXPENSENUMBER;
				IE.DESCRIPTION = IEHistoryItems[i].DESCRIPTION;												
				IE.APPROVEDDATE = IEHistoryItems[i].APPROVEDDATE;
				IE.APPROVEREMPLOYEENUMBER = IEHistoryItems[i].APPROVEREMPLOYEENUMBER;				
				var modToUser = (IEHistoryItems[i].TOUSER).substring (0, 20) ;
				var lowerCaseToUser = modToUser.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
				IE.TOUSER = lowerCaseToUser ;								
				IE.STATUS = IEHistoryItems[i].STATUS;   							
				IEHistoryItemsResponse.QueryIEHistoryItemsRes.IEHistoryItemsInfo [j++] = IE ;
			}
		}
	}
	callback (IEHistoryItemsResponse) ;
}

function getIEDetailedInfoResponse(Tid, statusCode, statusText, IEDetailedInfoItems, callback)
{
	winston.log ("silly", "Request for Tid ::" + Tid) ;
	winston.log ("silly", "Status Code is ::" + statusCode) ;
	winston.log ("silly", "Status Text is ::" + statusText) ;

	var IEDetailedInfoResponse = new Object () ;
	IEDetailedInfoResponse.QueryIEDetailedInfoRes = new Object () ;
	IEDetailedInfoResponse.QueryIEDetailedInfoRes.Tid = Tid ;
	
	IEDetailedInfoResponse.QueryIEDetailedInfoRes.Status = new Object () ;
	IEDetailedInfoResponse.QueryIEDetailedInfoRes.Status.Code = statusCode ;
	IEDetailedInfoResponse.QueryIEDetailedInfoRes.Status.Text = statusText ;
	
	winston.log ("silly", "status code is ::" + statusCode) ;
	if (statusCode == define.REQ_SUCCESS_TEXT)
	{
		IEDetailedInfoResponse.QueryIEDetailedInfoRes.IEDetailedInfo = [];
		var j = 0 ;
		for (var i in IEDetailedInfoItems)
		{
			/*
			winston.log ("========== START Of [" + i + "] record ==========") ;
			//winston.log ("IEDetailedInfoItems["+i+"].ROWID   :: " + IEDetailedInfoItems[i].ROWID) ;			
			winston.log ("========== END of the record ==========\n");
			*/
			//console.log('EDetailedInfoItems[i].STATUS' + IEDetailedInfoItems[i].STATUS);
			if (IEDetailedInfoItems[i].STATUS != "Awaiting Approval") // Take the records for which the status is other than Awaiting approval
			{
				IE = new Object () ;	
				IE.REPORTHEADERID = IEDetailedInfoItems[i].REPORTHEADERID;
				IE.NOTIFICATIONID = IEDetailedInfoItems[i].NOTIFICATIONID;
				IE.DISTRIBUTIONLINENUMBER = IEDetailedInfoItems[i].DISTRIBUTIONLINENUMBER;
				IE.DESCRIPTION = IEDetailedInfoItems[i].DESCRIPTION;
				IE.AMOUNT = IEDetailedInfoItems[i].AMOUNT;
				IE.CURRENCYCODE = IEDetailedInfoItems[i].CURRENCYCODE;
				if (!(IE.CURRENCYCODE) || IE.CURRENCYCODE == "")
					IE.CURRENCYCODE = "USD" ;
				console.log ("Hey... IE.CURRENCYCODE is ["+ IE.CURRENCYCODE + "]..") ;
				
				/* Temproray change to support currency code in the node code till the time it is not supported in sync tool */
				var amountStr = IEDetailedInfoItems[i].AMOUNT;
				winston.log ("debug", "KAWALTESTING the amount str from db is" + amountStr) ;
				if(amountStr)
				{
					amountStr = amountStr.trim() ;
					var mySplitResult = amountStr.split(" ");
					IE.AMOUNT = mySplitResult[0] ;
					if (mySplitResult[1])
						IE.CURRENCYCODE = mySplitResult[1] ;
					winston.log ("debug", "KAWALTESTING the Amount is" + IE.AMOUNT) ;
					winston.log ("debug", "KAWALTESTING the CURRENCYCODE is" + IE.CURRENCYCODE) ;
				}
				/* Temporary changes for currency till here */
			
				IE.GLACCOUNT = IEDetailedInfoItems[i].GLACCOUNT;
				IE.JUSTIFICATION = IEDetailedInfoItems[i].JUSTIFICATION;
				IEDetailedInfoResponse.QueryIEDetailedInfoRes.IEDetailedInfo [j++] = IE ;
			}
		}
	}
	callback (IEDetailedInfoResponse) ;
}

/* JE Journal Entry Responses */

/* Description : The function forms the JEWorkListItemsResponse 
*  for the data which is fetched from the ERP system. 
*/
function getJEWorkListItemResponse (Tid, statusCode, statusText, JEWorkListItems, callback)
{
	winston.log ("silly", "Request for Tid ::" + Tid) ;
	winston.log ("silly", "Status Code is ::" + statusCode) ;
	winston.log ("silly", "Status Text is ::" + statusText) ;

	var JEWorkListItemsResponse = new Object () ;
	JEWorkListItemsResponse.QueryWorklistJERes = new Object () ;
	JEWorkListItemsResponse.QueryWorklistJERes.Tid = Tid ;
	
	JEWorkListItemsResponse.QueryWorklistJERes.Status = new Object () ;
	JEWorkListItemsResponse.QueryWorklistJERes.Status.Code = statusCode ;
	JEWorkListItemsResponse.QueryWorklistJERes.Status.Text = statusText ;
	
	winston.log ("silly", "status code is ::" + statusCode) ;
	if (statusCode == define.REQ_SUCCESS_TEXT)
	{
		JEWorkListItemsResponse.QueryWorklistJERes.JournalEntry = [];
		var j = 0 ;
		for (var i in JEWorkListItems)
		{
			if (JEWorkListItems[i].STATUS == "Awaiting Approval") // Take only that records for which the status is waiting for approval
			{
				JE = new Object () ;
				JE.NOTIFICATIONID = JEWorkListItems[i].NOTIFICATIONID;				
				JE.ITEMKEY = JEWorkListItems[i].ITEMKEY;
				JE.MESSAGENAME = JEWorkListItems[i].MESSAGENAME;
				JE.STATUS = JEWorkListItems[i].STATUS;												
				JE.APPROVALREQUESTEDDATE = JEWorkListItems[i].APPROVALREQUESTEDDATE;				
				JE.APPROVEDDATE = JEWorkListItems[i].APPROVEDDATE;
				JE.RESPONDERID = JEWorkListItems[i].RESPONDERID;
				JE.JEBATCHNAME = JEWorkListItems[i].JEBATCHNAME; //Description of JE Item
				JE.FROMUSER = JEWorkListItems[i].FROMUSER;				
				JE.TOUSER = JEWorkListItems[i].TOUSER;   								
				JEWorkListItemsResponse.QueryWorklistJERes.JournalEntry [j++] = JE ;
			}
		}
	}
	callback (JEWorkListItemsResponse) ;
}


/* Make the routines availble to others too */
exports.getPRWorkListItemResponse=getPRWorkListItemResponse ;
exports.getAuthenticationResponse=getAuthenticationResponse ;
exports.getQueryHistoryItemsRes=getQueryHistoryItemsRes;
exports.getPRDetailedInfoResponse = getPRDetailedInfoResponse;
exports.getLogoutUserRes = getLogoutUserRes;
exports.getWorkListDetailsRes = getWorkListDetailsRes;
exports.getRegisterAppRes = getRegisterAppRes;
exports.getUnRegisterAppRes = getUnRegisterAppRes;


exports.getPRApprovedItemsResponse = getPRApprovedItemsResponse;
exports.getPRRejectItemsResponse = getPRRejectItemsResponse;
/* IE Expense Report Exports */
exports.getIEWorkListItemResponse = getIEWorkListItemResponse;
exports.getQueryIEHistoryItemsRes = getQueryIEHistoryItemsRes;
exports.getIEDetailedInfoResponse = getIEDetailedInfoResponse;
/* JE  Journal Entry Exports */
exports.getJEWorkListItemResponse = getJEWorkListItemResponse;

