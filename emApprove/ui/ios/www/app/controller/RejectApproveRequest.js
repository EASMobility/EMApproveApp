/**
 * Copyright 2012-2013 Electronic Arts, Inc. 
 */
/**
 * RejectApproveRequest.js holding rejectRequest(),approveRequest() functions
 */

/*
  Make an AJAX call once user rejected an item either with or without comments, this function will remove particular
  item from the Table using Notification ID which was got as an reponse.
 */

function rejectRequest(obj,parent) {
	var httpRequest = new XMLHttpRequest();
    url = localStorage.getItem('urlValue');
    httpRequest.open('POST', url, true);
    httpRequest.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
    httpRequest.setRequestHeader('Access-Control-Allow-Origin', '*');
    httpRequest.send(JSON.stringify(obj));
    httpRequest.onreadystatechange = function () {
        _oonreadystatechange(httpRequest);
    }
   Mask("");
    var _oonreadystatechange = function (httpRequest, optss) {
        if (httpRequest.readyState == '4') {
            if (httpRequest.status == '200') {
                var data = JSON.parse(httpRequest.responseText);
                if (data.PRRejectItemRes.Status.Code == '200') {
                    if (selectedrecord.data.WORKTYPE == 'PR') {
					
                        EmApprove.transaction(function (transaction) {
                            transaction.executeSql("DELETE FROM worklist where NOTIFICATIONID=?", [data.NOTIFICATIONID],

                            function (transaction, results) {
                                console.log(results);
                                worklistrequest_database(activetab);
                                PRworklistrequest_database();
                                approvedOrNot = true;
								pop(parent);
                            }, function (transaction, error) {
                                console.log(error.message);
                            });
                        });
                    }
                    if (selectedrecord.data.WORKTYPE == 'ER') {
                        EmApprove.transaction(function (transaction) {
                            transaction.executeSql("DELETE FROM ERworklist where NOTIFICATIONID=?", [data.NOTIFICATIONID],

                            function (transaction, results) {
                                console.log(results);
                                worklistrequest_database(activetab);
                                ERworklistrequest_database();
                                approvedOrNot = true;
								pop(parent);
                            }, function (transaction, error) {
                                console.log(error.message);
                            });
                        });
                    }
                } else {
                    alert(data.PRRejectItemRes.Status.Text);
                }
               
            } else{
                Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
                 Unmask();
            }
        }
    };
}
/*
  Make an AJAX call once user approved an item either with or without comments, this function will remove particular
  item from the Table using Notification ID which was got as an reponse.
 */
function approveRequest(obj,parent) {
    var httpRequest = new XMLHttpRequest();
    url = localStorage.getItem('urlValue');
    httpRequest.open('POST', url, true);
    httpRequest.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
    httpRequest.setRequestHeader('Access-Control-Allow-Origin', '*');
    httpRequest.send(JSON.stringify(obj));
    
    httpRequest.onreadystatechange = function () {
        _oonreadystatechange(httpRequest);
    }
    Mask("");
    var _oonreadystatechange = function (httpRequest, optss) {
        if (httpRequest.readyState == '4') {
            if (httpRequest.status == '200') {
                var data = JSON.parse(httpRequest.responseText);
                if (data.PRApproveItemRes.Status.Code == '200') {
                    if (selectedrecord.data.WORKTYPE == 'PR') {
                        EmApprove.transaction(function (transaction) {
                            transaction.executeSql("DELETE FROM worklist where NOTIFICATIONID=?", [data.NOTIFICATIONID],

                            function (transaction, results) {
                                console.log(results);
                                worklistrequest_database(activetab);
                                PRworklistrequest_database();
                                approvedOrNot = true;
								pop(parent);
                            }, function (transaction, error) {
                                console.log(error.message);
                            });
                        });
                    }
                    if (selectedrecord.data.WORKTYPE == 'ER') {
                        EmApprove.transaction(function (transaction) {
                            transaction.executeSql("DELETE FROM ERworklist where NOTIFICATIONID=?", [data.NOTIFICATIONID],

                            function (transaction, results) {
                                console.log(results);
                                worklistrequest_database(activetab);
                                ERworklistrequest_database();
                                approvedOrNot = true;
								pop(parent);
                            }, function (transaction, error) {
                                console.log(error.message);
                            });
                        });
                    }
                } else {
                    alert(data.PRApproveItemRes.Status.Text);
                }
               
            } else{
                Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
                   Unmask();
            }
        }
    };
}

function pop(parent){

Ext.Viewport.animateActiveItem(parent.getMain(), parent.slideRightTransition);
     Unmask();
}