/**
 * Copyright 2012-2013 Electronic Arts, Inc. 
 */

/**
 * WorklistRequest.js holding worklistrequest(),ERworklistrequest() functions which are used for getting the worklist details  of PurchaseRequisition and IExpenseReport with ajax calls
 */

/*This function is used to get the worklist details for PurchaseRequisition and store them in "worklist" SQL Database
 */

function worklistrequest(url, sessionTokenID,maskstatus) {
    var httpRequest = new XMLHttpRequest();
    var _object = {
        "Tid": Math.floor(Math.random() * 9000) + 1000,
        "SessionTokenId": sessionTokenID
    };
    var object = {
        QueryWorklistPRReq: _object
    };
	if(maskstatus){
	console.log(maskstatus);
	Mask('Please Wait');
	}
    httpRequest.open('POST', url, true);
    httpRequest.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
    httpRequest.setRequestHeader('Access-Control-Allow-Origin', '*');
    httpRequest.send(JSON.stringify(object));
    httpRequest.onreadystatechange = function () {
        _oonreadystatechange(httpRequest);
    }
    var _oonreadystatechange = function (httpRequest, optss) {
        if (httpRequest.readyState == '4') {
            if (httpRequest.status == '200') {
                var data = JSON.parse(httpRequest.responseText);
                if (data.QueryWorklistPRApprRes.Status.Code === '200') {
                    for (var i = 0; i < data.QueryWorklistPRApprRes.PurchaseRequisition.length; i++) {
                      
                        var amountWithCurrencyCode = data.QueryWorklistPRApprRes.PurchaseRequisition[i].Amount+" "+data.QueryWorklistPRApprRes.PurchaseRequisition[i].CURRENCYCODE;
                        insertWorklist(
						i,
						data.QueryWorklistPRApprRes.PurchaseRequisition.length,
                        data.QueryWorklistPRApprRes.Tid,
                        data.QueryWorklistPRApprRes.PurchaseRequisition[i].REQUISITIONHEADERID,
                        data.QueryWorklistPRApprRes.PurchaseRequisition[i].REQUESTOR,
                        data.QueryWorklistPRApprRes.PurchaseRequisition[i].NOTIFICATIONID,
                        data.QueryWorklistPRApprRes.PurchaseRequisition[i].DESCRIPTION,
                        data.QueryWorklistPRApprRes.PurchaseRequisition[i].APPROVALREQUESTEDDATE,
                        amountWithCurrencyCode,
                        data.QueryWorklistPRApprRes.PurchaseRequisition[i].MESSAGENAME,
                        data.QueryWorklistPRApprRes.PurchaseRequisition[i].APPROVALREQUESTEDBY,
                        data.QueryWorklistPRApprRes.PurchaseRequisition[i].APPROVEREMPLOYEENUMBER,
                        data.QueryWorklistPRApprRes.PurchaseRequisition[i].REQUISITIONNUMBER);
                    }
                    if(data.QueryWorklistPRApprRes.PurchaseRequisition.length==0){
                        Unmask();
                    }
                } else if (data.QueryWorklistPRApprRes.Status.Code == '401') //Invalid Session due to session timeout
                {
                    loginService(nameValue, passwordValue, url);
                }
            }
            else{
                Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
                Unmask();
                
            }
        }
    };
}
/*This function is used to get the worklist details for IExpenseReport and store them in "ERworklist" SQL Database*/
function ERworklistrequest(url, sessionTokenID,maskstatus) {
    var httpRequest = new XMLHttpRequest();
    var _object = {
        "Tid": Math.floor(Math.random() * 9000) + 1000,
        "SessionTokenId": sessionTokenID
    };
    var object = {
        QueryWorklistIEReq: _object
    };
	if(maskstatus){
	console.log(maskstatus);
	Mask('Please Wait');
	}
    httpRequest.open('POST', url, true);
    httpRequest.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
    httpRequest.setRequestHeader('Access-Control-Allow-Origin', '*');
    httpRequest.send(JSON.stringify(object));
    
    httpRequest.onreadystatechange = function () {
        _oonreadystatechange(httpRequest);
    }
    
    var _oonreadystatechange = function (httpRequest, optss) {
        if (httpRequest.readyState == '4') {
            if (httpRequest.status == '200') {
                var data = JSON.parse(httpRequest.responseText);
                if (data.QueryWorklistIEApprRes.Status.Code === '200') {
                    for (var i = 0; i < data.QueryWorklistIEApprRes.IExpenseReport.length; i++) {
                        var amountWithoutCommas
                        amountWithoutCommas = data.QueryWorklistIEApprRes.IExpenseReport[i].AMOUNT;
                        amountWithoutCommas = parseFloat(amountWithoutCommas).toFixed(2);
                        amountWithoutCommas += '';
                        var x = amountWithoutCommas.split('.');
                        var x1 = x[0];
                        var x2 = x.length > 1 ? '.' + x[1] : '';
                        var rgx = /(\d+)(\d{3})/;
                        while (rgx.test(x1)) {
                            x1 = x1.replace(rgx, '$1' + ',' + '$2');
                        }
                       
                        var amountWithCommas =x1 + x2+" "+data.QueryWorklistIEApprRes.IExpenseReport[i].CURRENCYCODE;
                        insertErWorklist(
						i,
						data.QueryWorklistIEApprRes.IExpenseReport.length,
                        data.QueryWorklistIEApprRes.Tid,
                        data.QueryWorklistIEApprRes.IExpenseReport[i].REPORTHEADERID,
                        data.QueryWorklistIEApprRes.IExpenseReport[i].REQUESTOR,
                        data.QueryWorklistIEApprRes.IExpenseReport[i].NOTIFICATIONID,
                        data.QueryWorklistIEApprRes.IExpenseReport[i].DESCRIPTION,
                        data.QueryWorklistIEApprRes.IExpenseReport[i].APPROVALREQUESTEDDATE,
                        amountWithCommas,
                        data.QueryWorklistIEApprRes.IExpenseReport[i].APPROVALREQUESTEDBY,
                        data.QueryWorklistIEApprRes.IExpenseReport[i].APPROVEREMPLOYEENUMBER,
                        data.QueryWorklistIEApprRes.IExpenseReport[i].APPROVEDDATE,
                        data.QueryWorklistIEApprRes.IExpenseReport[i].TOUSER,
                        data.QueryWorklistIEApprRes.IExpenseReport[i].STATUS,
                        data.QueryWorklistIEApprRes.IExpenseReport[i].COSTCENTER,
                        data.QueryWorklistIEApprRes.IExpenseReport[i].IEXPENSENUMBER);
                    }
                    if(data.QueryWorklistIEApprRes.IExpenseReport.length==0){
                        Unmask();
                    }
					
                } else if (data.QueryWorklistIEApprRes.Status.Code == '401') //Invalid Session due to session timeout
                {
                    loginService(nameValue, passwordValue, url);
                }
            }else {
                Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
                Unmask();
                
            } 
        }
    };
}