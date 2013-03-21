/**
 * Copyright 2012-2013 Electronic Arts, Inc. 
 */

/** 
 * categoryWorklistRequestDatabase.js holding PRworklistrequest_database(),ERworklistrequest_database(), It is used for selecting worklist details from tables and to keep in respective stores for Category Tab Panel
 */

/*This function will called when Category Tab Panel clicked, It will retreive worklist details from worklist table and store it in PRworklistStore Store
 */
function PRworklistrequest_database() {
    var ApproverEmployeeNumber = localStorage.getItem('userid');
    var queryString;
    var rows = [];
    var row = null;
    var query;
    if (localStorage.getItem('prontoggle') == "true") {
        query = "SELECT * FROM worklist where APPROVEREMPLOYEENUMBER = " + ApproverEmployeeNumber + ";";
    }
    EmApprove.transaction(function (transaction) {
        PRworklistStore.removeAll();
        transaction.executeSql(
         query, [],

        function (transaction, results) {
            if (results.rows.length != 0) {
                for (var i = 0; i < results.rows.length; i++) {
                    row = results.rows.item(i);
                    if (row['WORKTYPE'] == 'PR') {
                        RESPCTIVEDESCRIPTION = "PR for " + commentellipses(row['DESCRIPTION']);
                    }
                    if (row['WORKTYPE'] == 'ER') {
                        RESPCTIVEDESCRIPTION = "IE for " + commentellipses(row['DESCRIPTION']);
                    }
					
                    PRworklistStore.add({
                        TID: row['Tid'],
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
                        RECORDNUMBER: row['RECORDNUMBER'],
                        FULLAPPROVALREQUESTEDDATE: formatteddatefunction(row['APPROVALREQUESTEDDATE']),
                        FULLAPPROVALREQUESTEDBY: formatteddatefunction(row['APPROVALREQUESTEDBY']),
                        WORKTYPE: 'PR',
                    });
                }
            }
            if (!this.PurchaseRequisition) {
                this.PurchaseRequisition = Ext.getCmp('PurchaseRequisitionContainer');
            }
            if (PRworklistStore.getCount() == 0) {
                this.PurchaseRequisition.hide();
                ispr_shown = false;
                Ext.Msg.alert('Worklist', 'No approvals pending in PR', Ext.emptyFn);
            } else {
                this.PurchaseRequisition.show();
                ispr_shown = true;
                Ext.getCmp('categorybadge2').setBadgeText(PRworklistStore.getCount());
            }
        }, function (transaction, error) {
            console.log(error.message);
        });
    });
}
/*This function will be called when Category Tab Panel clicked, It wiil retreive worklist details from worklist table and store it in PRworklistStore Store
 */
function ERworklistrequest_database() {
    var ApproverEmployeeNumber = localStorage.getItem('userid');
    var queryString;
    var rows = [];
    var row = null;
    var query;
    if (localStorage.getItem('erontoggle') == "true") {
        query = "SELECT * FROM ERworklist where APPROVEREMPLOYEENUMBER = " + ApproverEmployeeNumber + ";";
    }
    EmApprove.transaction(function (transaction) {
        ERworklistStore.removeAll();
        transaction.executeSql(
        query, [],

        function (transaction, results) {
            if (results.rows.length != 0) {
                for (var i = 0; i < results.rows.length; i++) {
                    row = results.rows.item(i);
                    var RESPCTIVEDESCRIPTION = "";
                    if (row['WORKTYPE'] == 'PR') {
                        RESPCTIVEDESCRIPTION = "PR for " + commentellipses(row['DESCRIPTION']);
                    }
                    if (row['WORKTYPE'] == 'ER') {
                        RESPCTIVEDESCRIPTION = "IE for " + commentellipses(row['DESCRIPTION']);
                    }
                    ERworklistStore.add({
                        TID: row['Tid'],
                        RECORDHEADERID: row['RECORDHEADERID'],
                        FROMUSER: row['FROMUSER'],
                        NOTIFICATIONID: row['NOTIFICATIONID'],
                        DESCRIPTION: row['DESCRIPTION'],
                        RESPCTIVEDESCRIPTION: RESPCTIVEDESCRIPTION,
                        Amount: row['Amount'],
                        APPROVALREQUESTEDDATE: worklistdatefunction(row['APPROVALREQUESTEDDATE']),
                        STATUS: row['STATUS'],
                        INDIVIDUALSCOSTCENTER: row['INDIVIDUALSCOSTCENTER'],
                        APPROVALREQUESTEDBY: worklistdatefunction(row['APPROVALREQUESTEDBY']),
                        APPROVEREMPLOYEENUMBER: row['APPROVEREMPLOYEENUMBER'],
                        RECORDNUMBER: row['RECORDNUMBER'],
                        FULLAPPROVALREQUESTEDDATE: formatteddatefunction(row['APPROVALREQUESTEDDATE']),
                        FULLAPPROVALREQUESTEDBY: formatteddatefunction(row['APPROVALREQUESTEDBY']),
                        WORKTYPE: 'ER',
                    });
                }
            }
            if (!this.ExpenseReport) {
                this.ExpenseReport = Ext.getCmp('ExpenseReportContainer');
            }
            if (ERworklistStore.getCount() == 0) {
                this.ExpenseReport.hide();
                iser_shown = false;
                Ext.Msg.alert('Worklist', 'No approvals pending in IE', Ext.emptyFn);
            } else {
                this.ExpenseReport.show();
                iser_shown = true;
                Ext.getCmp('categorybadge1').setBadgeText(ERworklistStore.getCount());
            }
        }, function (transaction, error) {
            console.log(error.message);
        });
    });
}