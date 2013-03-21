/**
 * Copyright 2012-2013 Electronic Arts, Inc. 
 */

/**
 * ERHistoryDetailPurchaseDetail.js holding ERpurchasedetail(),ERhistorydetail() functions, These will make an ajax call when IExpenseReport item got pressed in worklist.
 */

/* This function called when IExpenseReport item got pressed, It will make ajax call and get IEHistoryItemsInfo 
   for particular item.
   
*/
function ERhistorydetail(url, sessionTokenID, requestRequistionNumber) {
    var httpRequest = new XMLHttpRequest();
    var _object = {
        "Tid": Math.floor(Math.random() * 9000) + 1000,
        "SessionTokenId": sessionTokenID,
        "IEXPENSENUMBER": requestRequistionNumber
    };
    var object = {
        QueryIEHistoryItemsReq: _object
    };
	Mask("");
    httpRequest.open('POST', url, true);
    httpRequest.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
    httpRequest.setRequestHeader('Access-Control-Allow-Origin', '*');
    httpRequest.send(JSON.stringify(object));
    httpRequest.onreadystatechange = function () {
        _oonreadystatechange(httpRequest);
    }
  
    var _oonreadystatechange = function (httpRequest, optss) {
        erhistoryStore.removeAll();
        if (httpRequest.readyState == 4) {
            if (httpRequest.status == '200') {
                var data = JSON.parse(httpRequest.responseText);
              
                if (data.QueryIEHistoryItemsRes.Status.Code === '200') {
                    for (var i = 0; i < data.QueryIEHistoryItemsRes.IEHistoryItemsInfo.length; i++) {
                        erhistoryStore.add({
                            REPORTHEADERID: data.QueryIEHistoryItemsRes.IEHistoryItemsInfo[i].REPORTHEADERID,
                            NOTIFICATIONID: data.QueryIEHistoryItemsRes.IEHistoryItemsInfo[i].NOTIFICATIONID,
                            APPROVEREMPLOYEENUMBER: data.QueryIEHistoryItemsRes.IEHistoryItemsInfo[i].APPROVEREMPLOYEENUMBER,
                            STATUS: data.QueryIEHistoryItemsRes.IEHistoryItemsInfo[i].STATUS,
                            TOUSER: data.QueryIEHistoryItemsRes.IEHistoryItemsInfo[i].TOUSER,
                            IEXPENSENUMBER: data.QueryIEHistoryItemsRes.IEHistoryItemsInfo[i].IEXPENSENUMBER,
                            APPROVEDDATE: formatteddatefunction(data.QueryIEHistoryItemsRes.IEHistoryItemsInfo[i].APPROVEDDATE),
                            DESCRIPTION: commentellipses(data.QueryIEHistoryItemsRes.IEHistoryItemsInfo[i].DESCRIPTION),
                        });
                    }
                } else if (data.QueryIEHistoryItemsRes.Status.Code == '401') //Invalid Session due to session timeout
                {
                    if (check_network() == 'No network connection' || check_network() == 'Unknown connection') {
                        Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
                    } else {
                        loginService(nameValue, passwordValue, url);
                        ERhistorydetail(url, localStorage.getItem('sessionToken'), selectedrecord.data.RECORDNUMBER);
                    }
                }
               Unmask();
            } else {
                Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
                Unmask();
               
            }
        }
    };
}
/* This function called when IExpenseReport item got pressed, It will make ajax call and get IEDetailedInfo 
   for particular item.
   
*/
function ERpurchasedetail(url, sessionTokenID, reportheaderID) {
    var httpRequest = new XMLHttpRequest();
    var _object = {
        "Tid": Math.floor(Math.random() * 9000) + 1000,
        "SessionTokenId": sessionTokenID,
        "REPORTHEADERID": reportheaderID
    };
    var object = {
        QueryIEDetailedInfoReq: _object
    };
	Mask("");
    httpRequest.open('POST', url, true);
    httpRequest.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
    httpRequest.setRequestHeader('Access-Control-Allow-Origin', '*');
    httpRequest.send(JSON.stringify(object));
    httpRequest.onreadystatechange = function () {
        _oonreadystatechange(httpRequest);
    }
   
   
    var _oonreadystatechange = function (httpRequest, optss) {
        erdetailStore.removeAll();
        if (httpRequest.readyState == 4) {
            if (httpRequest.status == '200') {
               
                var data = JSON.parse(httpRequest.responseText);
                if (data.QueryIEDetailedInfoRes.Status.Code === '200') {
                    for (var i = 0; i < data.QueryIEDetailedInfoRes.IEDetailedInfo.length; i++) {
                        var amountWithoutCommas;
                        amountWithoutCommas = data.QueryIEDetailedInfoRes.IEDetailedInfo[i].AMOUNT;
                        amountWithoutCommas = parseFloat(amountWithoutCommas).toFixed(2);
                        amountWithoutCommas += '';
                        var x = amountWithoutCommas.split('.');
                        var x1 = x[0];
                        var x2 = x.length > 1 ? '.' + x[1] : '';
                        var rgx = /(\d+)(\d{3})/;
                        while (rgx.test(x1)) {
                            x1 = x1.replace(rgx, '$1' + ',' + '$2');
                        }
                        var amountWithCommas =x1 + x2+" "+data.QueryIEDetailedInfoRes.IEDetailedInfo[i].CURRENCYCODE;
                        erdetailStore.add({
                            REPORTHEADERID: data.QueryIEDetailedInfoRes.IEDetailedInfo[i].REPORTHEADERID,
                            CURRENCYCODE: data.QueryIEDetailedInfoRes.IEDetailedInfo[i].CURRENCYCODE,
                            DESCRIPTION: commentellipses(data.QueryIEDetailedInfoRes.IEDetailedInfo[i].DESCRIPTION),
                            DISTRIBUTIONLINENUMBER: data.QueryIEDetailedInfoRes.IEDetailedInfo[i].DISTRIBUTIONLINENUMBER,
                            UNITPRICE: amountWithCommas,
                            JUSTIFICATION: data.QueryIEDetailedInfoRes.IEDetailedInfo[i].JUSTIFICATION,
                            GLACCOUNT: glbreak(data.QueryIEDetailedInfoRes.IEDetailedInfo[i].GLACCOUNT),
                            NOTIFICATIONID: data.QueryIEDetailedInfoRes.IEDetailedInfo[i].NOTIFICATIONID
                        });
                    }
                } else if (data.QueryIEDetailedInfoRes.Status.Code == '401') //Invalid Session due to session timeout
                {
                    if (check_network() == 'No network connection' || check_network() == 'Unknown connection') {
                        Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
                    } else {
                        loginService(nameValue, passwordValue, url);
                        ERpurchasedetail(url, localStorage.getItem('sessionToken'), selectedrecord.data.REQUISITIONHEADERID)
                    }
                }
              Unmask();
            } else{
                Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
                Unmask();
              
            }
        }
    };
}