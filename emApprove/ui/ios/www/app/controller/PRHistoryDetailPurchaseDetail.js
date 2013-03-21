/**
 * Copyright 2012-2013 Electronic Arts, Inc. 
 */

/**
 * PRHistoryDetailPurchaseDetail.js holding purchasedetail(),historydetail() functions, These will make an ajax call when 
 * PurchaseRequisition item got pressed in worklist.
 */

/* This function called when PurchaseRequisition item got pressed, It will make ajax call and get PRDetailedInfo 
   for particular item.
   
*/
function purchasedetail(url, sessionTokenID, requestheaderID) {
   var httpRequest = new XMLHttpRequest();
    var _object = {
        "Tid": Math.floor(Math.random() * 9000) + 1000,
        "SessionTokenId": sessionTokenID,
        "REQUISITIONHEADERID": requestheaderID
    };
    var object = {
        QueryPRDetailedInfoReq: _object
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
        prdetailStore.removeAll();
        if (httpRequest.readyState == 4) {
            if (httpRequest.status == '200') {
               
                var data = JSON.parse(httpRequest.responseText);
                if (data.QueryPRDetailedInfoRes.Status.Code === '200') {
                    for (var i = 0; i < data.QueryPRDetailedInfoRes.PRDetailedInfo.length; i++) {
                        var amountWithoutCommas;
                        amountWithoutCommas = data.QueryPRDetailedInfoRes.PRDetailedInfo[i].UNITPRICE;
                        amountWithoutCommas = parseFloat(amountWithoutCommas).toFixed(2);
                        amountWithoutCommas += '';
                        var x = amountWithoutCommas.split('.');
                        var x1 = x[0];
                        var x2 = x.length > 1 ? '.' + x[1] : '';
                        var rgx = /(\d+)(\d{3})/;
                        while (rgx.test(x1)) {
                            x1 = x1.replace(rgx, '$1' + ',' + '$2');
                        }
                       
                        var amountWithCommas =x1 + x2+" "+data.QueryPRDetailedInfoRes.PRDetailedInfo[i].CURRENCYCODE;
                        prdetailStore.add({
                            REQUISITIONHEADERID: data.QueryPRDetailedInfoRes.PRDetailedInfo[i].REQUISITIONHEADERID,
                            REQUISITIONLINEID: data.QueryPRDetailedInfoRes.PRDetailedInfo[i].REQUISITIONLINEID,
                            ITEMDESCRIPTION: commentellipses(data.QueryPRDetailedInfoRes.PRDetailedInfo[i].DESCRIPTION),
                            LINENUM: data.QueryPRDetailedInfoRes.PRDetailedInfo[i].LINENUM,
                            UNITPRICE: amountWithCommas,
                            LASTUPDATEDATE: data.QueryPRDetailedInfoRes.PRDetailedInfo[i].LASTUPDATEDATE,
                            QUANTITY: data.QueryPRDetailedInfoRes.PRDetailedInfo[i].QUANTITY,
							ACCOUNTCODE: glbreak(data.QueryPRDetailedInfoRes.PRDetailedInfo[i].ACCOUNTCODE)
                            
                        });
                    }
                } else if (data.QueryPRDetailedInfoRes.Status.Code == '401') //Invalid Session due to session timeout
                {
                    if (check_network() == 'No network connection' || check_network() == 'Unknown connection') {
                        Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
                    } else {
                        loginService(nameValue, passwordValue, url);
                        purchasedetail(url, localStorage.getItem('sessionToken'), selectedrecord.data.REQUISITIONHEADERID)
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
/* This function called when PurchaseRequisition item got pressed, It will make ajax call and get PRHistoryInfo 
   for particular item.
   
*/
function historydetail(url, sessionTokenID, requestRequistionNumber) {
    var httpRequest = new XMLHttpRequest();
    var _object = {
        "Tid": Math.floor(Math.random() * 9000) + 1000,
        "SessionTokenId": sessionTokenID,
        "REQUISITIONNUMBER": requestRequistionNumber
    };
    var object = {
        QueryHistoryItemsReq: _object
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
        historyStore.removeAll();
        if (httpRequest.readyState == 4) {
            if (httpRequest.status == '200') {
                var data = JSON.parse(httpRequest.responseText);
                             
                if (data.QueryPRHistoryRes.Status.Code === '200') {
                    for (var i = 0; i < data.QueryPRHistoryRes.PurchaseRequisition.length; i++) {
                        historyStore.add({
                            REQUISITIONHEADERID: data.QueryPRHistoryRes.PurchaseRequisition[i].REQUISITIONHEADERID,
                            REQUESTOR: data.QueryPRHistoryRes.PurchaseRequisition[i].REQUESTOR,
                            APPROVEREMPLOYEENUMBER: data.QueryPRHistoryRes.PurchaseRequisition[i].APPROVEREMPLOYEENUMBER,
                            DESCRIPTION: commentellipses(data.QueryPRHistoryRes.PurchaseRequisition[i].DESCRIPTION),
                            APPROVALREQUESTEDDATE: formatteddatefunction(data.QueryPRHistoryRes.PurchaseRequisition[i].APPROVALREQUESTEDDATE),
                            Amount: data.QueryPRHistoryRes.PurchaseRequisition[i].Amount,
                            MESSAGENAME: data.QueryPRHistoryRes.PurchaseRequisition[i].MESSAGENAME,
                            APPROVALREQUESTEDBY: data.QueryPRHistoryRes.PurchaseRequisition[i].APPROVALREQUESTEDBY,
                            APPROVEDDATE: formatteddatefunction(data.QueryPRHistoryRes.PurchaseRequisition[i].APPROVEDDATE),
                            TOUSER: data.QueryPRHistoryRes.PurchaseRequisition[i].TOUSER,
                        });
                    }
                } else if (data.QueryPRHistoryRes.Status.Code == '401') //Invaid Session due to session timeout
                {
                    if (check_network() == 'No network connection' || check_network() == 'Unknown connection') {
                        Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
                    } else {
                        loginService(nameValue, passwordValue, url);
                        historydetail(url, localStorage.getItem('sessionToken'), selectedrecord.data.RECORDNUMBER);
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