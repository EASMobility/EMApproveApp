/**
 * Copyright 2012-2013 Electronic Arts, Inc. 
 */
/**
 * WorklistRequest.js holding worklistrequest(), It is used for showing the worklist details in StartDate/Duedate view
 */
/*This function sort the worklist details with respect to StartDate/DueDate and also it will show worklist details with respect to 
  PurchaseRequisition and ExpenseReport toggle button ON/OFF*/

function worklistrequest_database(string) {
    var ApproverEmployeeNumber = localStorage.getItem('userid');
    var queryString;
    var rows = [];
    var row = null;
    if (string === 'Start Date') queryString = 'APPROVALREQUESTEDDATE';
    else queryString = 'APPROVALREQUESTEDBY';
    var query;
    if (localStorage.getItem('prontoggle') == "true") {
        query = "SELECT * FROM worklist where APPROVEREMPLOYEENUMBER = " + ApproverEmployeeNumber + ";";
    }
    if (localStorage.getItem('erontoggle') == "true") {
        query = "SELECT * FROM ERworklist where APPROVEREMPLOYEENUMBER = " + ApproverEmployeeNumber + ";";
    }
    if (localStorage.getItem('erontoggle') == "true" && localStorage.getItem('prontoggle') == "true") {
        query = "SELECT * FROM worklist UNION ALL SELECT * FROM ERworklist";
    }
    EmApprove.transaction(function (transaction) {
        worklistStore.removeAll();
        transaction.executeSql(
        query, [],

        function (transaction, results) {
            if (results.rows.length != 0) {
                for (var i = 0; i < results.rows.length; i++) {
                    row = results.rows.item(i);
                    rows.push({
                        "APPROVALREQUESTEDDATE_sort": new Date(results.rows.item(i).APPROVALREQUESTEDDATE),
                        "APPROVALREQUESTEDBY_sort": new Date(results.rows.item(i).APPROVALREQUESTEDBY),
                        "RECORDHEADERID": results.rows.item(i)['RECORDHEADERID'],
                        "FROMUSER": results.rows.item(i)['FROMUSER'],
                        "NOTIFICATIONID": results.rows.item(i)['NOTIFICATIONID'],
                        "DESCRIPTION": results.rows.item(i)['DESCRIPTION'],
                        "Amount": results.rows.item(i)['Amount'],
                        "APPROVALREQUESTEDDATE": results.rows.item(i)['APPROVALREQUESTEDDATE'],
                        "MESSAGENAME": results.rows.item(i)['MESSAGENAME'],
                        "APPROVALREQUESTEDBY": results.rows.item(i)['APPROVALREQUESTEDBY'],
                        "APPROVEREMPLOYEENUMBER": results.rows.item(i)['APPROVEREMPLOYEENUMBER'],
                        "REQUISITIONNUMBER": results.rows.item(i)['REQUISITIONNUMBER'],
                        "FULLAPPROVALREQUESTEDDATE": formatteddatefunction(results.rows.item(i)['APPROVALREQUESTEDDATE']),
                        "FULLAPPROVALREQUESTEDBY": formatteddatefunction(results.rows.item(i)['APPROVALREQUESTEDBY']),
                        "WORKTYPE": results.rows.item(i)['WORKTYPE'],
                        "RECORDNUMBER": results.rows.item(i)['RECORDNUMBER'],
                        "INDIVIDUALSCOSTCENTER": results.rows.item(i)['INDIVIDUALSCOSTCENTER'],
                    });
                }
                rows.sort(function (a, b) {
                    if (string === 'Start Date') {
                        var ascending = b.APPROVALREQUESTEDDATE_sort.getTime() - a.APPROVALREQUESTEDDATE_sort.getTime();
                    } else {
                        var ascending = b.APPROVALREQUESTEDBY_sort.getTime() - a.APPROVALREQUESTEDBY_sort.getTime();
                    }
                    return ascending;
                });
                for (var i = 0; i < rows.length; i++) {
                    row = rows[i];
                    var RESPCTIVEDESCRIPTION = "";
                    if (row['WORKTYPE'] == 'PR') {
                        RESPCTIVEDESCRIPTION = "PR for " + commentellipses(row['DESCRIPTION']);
                    }
                    if (row['WORKTYPE'] == 'ER') {
                        RESPCTIVEDESCRIPTION = "IE for " + commentellipses(row['DESCRIPTION']);
                    }
                    worklistStore.add({
                        TID: row['TID'],
                        RECORDHEADERID: row['RECORDHEADERID'],
                        FROMUSER: row['FROMUSER'],
                        NOTIFICATIONID: row['NOTIFICATIONID'],
                        DESCRIPTION: row['DESCRIPTION'],
                        RESPCTIVEDESCRIPTION: RESPCTIVEDESCRIPTION,
                        Amount: row['Amount'],
                        APPROVALREQUESTEDDATE: worklistdatefunction(row['APPROVALREQUESTEDDATE']),
                        MESSAGENAME: row['MESSAGENAME'],
                        APPROVALREQUESTEDBY: worklistdatefunction(row['APPROVALREQUESTEDBY']),
                        APPROVEREMPLOYEENUMBER: row['APPROVEREMPLOYEENUMBER'],
                        FULLAPPROVALREQUESTEDDATE: formatteddatefunction(row['APPROVALREQUESTEDDATE']),
                        FULLAPPROVALREQUESTEDBY: formatteddatefunction(row['APPROVALREQUESTEDBY']),
                        WORKTYPE: row['WORKTYPE'],
                        RECORDNUMBER: row['RECORDNUMBER'],
                        INDIVIDUALSCOSTCENTER: row['INDIVIDUALSCOSTCENTER'],
                    });
                }
            }
            if (worklistStore.getCount() == 0) {
                Ext.Msg.alert('Worklist', 'No approvals pending', Ext.emptyFn);
            } else {}
            //autorefresh();
        }, function (transaction, error) {
            console.log(error.message);
        });
    });
}