/**
 * Copyright 2012-2013 Electronic Arts, Inc. 
 */
/**
 * Check whether Database is supported in the browser and Create tables for the application. 
 */
function initComponents() {
    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        try {
            if (!window.openDatabase) {
                alert('Databases are not supported in this browser');
            } else {
                var shortName = 'emApprove';
                var version = '1.0';
                var displayName = 'emApprove';
                var maxSize = 5242880;
                EmApprove = openDatabase(shortName, version, displayName, maxSize);
                createTables();
                checkTables();
            }
        } catch (e) {
            if (e == 2) {
                // Version number mismatch.
                console.log("Invalid database version.");
            } else {
                console.log("Unknown error " + e + ".");
            }
            return;
        }
    }
}
/**
 * Check the network. 
 */
function check_network() {
    var networkState = navigator.connection;
    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.NONE] = 'No network connection';
    return states[networkState];
}
/**
 * On logging to a different user we should drop tables using this function.
 */
function dropTables() {
    EmApprove.transaction(function (transaction) {
        transaction.executeSql('DROP TABLE worklist;', [], nullDataHandler,
        errorHandler);
    });
    EmApprove.transaction(function (transaction) {
        transaction.executeSql('DROP TABLE ERworklist;', [], nullDataHandler,
        errorHandler);
    });
}
/**
 * Creating tables worklist, POworklist and ERworklist.
 */
function createTables() {
    EmApprove.transaction(function (transaction) {
        /**
         * *************************************************Work list Values table
         * ******************************************************
         */
        transaction.executeSql('CREATE TABLE IF NOT EXISTS worklist(id INTEGER PRIMARY KEY AUTOINCREMENT ,TID nvarchar NULL ,RECORDHEADERID nvarchar UNIQUE NOT NULL,FROMUSER nvarchar NULL,NOTIFICATIONID nvarchar NULL,DESCRIPTION nvarchar NULL, APPROVALREQUESTEDDATE nvarchar NULL,Amount nvarchar NULL,MESSAGENAME nvarchar NULL,APPROVALREQUESTEDBY nvarchar NULL,APPROVEREMPLOYEENUMBER nvarchar NULL,APPROVEDDATE nvarchar NULL,TOUSER nvarchar NULL,STATUS nvarchar NULL,INDIVIDUALSCOSTCENTER nvarchar NULL,RECORDNUMBER INTEGER NULL,WORKTYPE nvarchar);', [], nullDataHandler, errorHandler);
    });
    EmApprove.transaction(function (transaction) {
        /**
         * *************************************************Work list Values table
         * ******************************************************
         */
        transaction.executeSql('CREATE TABLE IF NOT EXISTS ERworklist(id INTEGER PRIMARY KEY AUTOINCREMENT ,TID nvarchar NULL ,RECORDHEADERID nvarchar UNIQUE NOT NULL,FROMUSER nvarchar NULL,NOTIFICATIONID nvarchar NULL,DESCRIPTION nvarchar NULL, APPROVALREQUESTEDDATE nvarchar NULL,Amount nvarchar NULL,MESSAGENAME nvarchar NULL,APPROVALREQUESTEDBY nvarchar NULL,APPROVEREMPLOYEENUMBER nvarchar NULL,APPROVEDDATE nvarchar NULL,TOUSER nvarchar NULL,STATUS nvarchar NULL,INDIVIDUALSCOSTCENTER nvarchar NULL,RECORDNUMBER INTEGER NULL,WORKTYPE nvarchar);', [], nullDataHandler, errorHandler);
    });
}
/**
 * Handles the errors occured while SQL transactions. 
 */
function errorHandler(transaction, error) {
    if (error.code == 1) {
        // DB Table already exists
    } else {
        // Error is a human-readable string.
        console.log('Oops.  Error was ' + error.message + ' (Code ' + error.code + ')');
    }
    return false;
}
/**
 * This function will be called when the SQL transactions succeeded.
 */
function nullDataHandler() {
    console.log("SQL Query Succeeded");
}
/**
 * Inserting the response from the backend to WebSQL Database. 
 */
function insertWorklist(INDEX,LENGTH,TID, REQUISITIONHEADERID, REQUESTOR, NOTIFICATIONID, DESCRIPTION, APPROVALREQUESTEDDATE, Amount, MESSAGENAME, APPROVALREQUESTEDBY, APPROVEREMPLOYEENUMBER, REQUISITIONNUMBER) {
    EmApprove.transaction(function (transaction) {
        transaction.executeSql("INSERT INTO worklist(TID,RECORDHEADERID,FROMUSER,NOTIFICATIONID,DESCRIPTION,APPROVALREQUESTEDDATE,Amount,MESSAGENAME,APPROVALREQUESTEDBY,APPROVEREMPLOYEENUMBER,RECORDNUMBER,WORKTYPE) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)", [TID, REQUISITIONHEADERID, REQUESTOR, NOTIFICATIONID, DESCRIPTION, APPROVALREQUESTEDDATE, Amount, MESSAGENAME, APPROVALREQUESTEDBY, APPROVEREMPLOYEENUMBER, REQUISITIONNUMBER, 'PR'],
		 function (transaction, results) {
		 if(INDEX+1==LENGTH){
		 Unmask();
		console.log(results);}
		}, function (transaction, error) {
		if(INDEX+1==LENGTH){
		Unmask();
            console.log(error.message);}
        });
    });
}
/**
 * Inserting the response from the backend to WebSQL Database. 
 */
function insertErWorklist(INDEX,LENGTH,TID, REPORTHEADERID, REQUESTOR, NOTIFICATIONID, DESCRIPTION, APPROVALREQUESTEDDATE, Amount, APPROVALREQUESTEDBY, APPROVEREMPLOYEENUMBER, APPROVEDDATE, TOUSER, STATUS, INDIVIDUALSCOSTCENTER, IEXPENSENUMBER) {
    EmApprove.transaction(function (transaction) {
        transaction.executeSql("INSERT INTO ERworklist(TID,RECORDHEADERID,FROMUSER,NOTIFICATIONID,DESCRIPTION,APPROVALREQUESTEDDATE,Amount,APPROVALREQUESTEDBY,APPROVEREMPLOYEENUMBER,APPROVEDDATE,TOUSER,STATUS,INDIVIDUALSCOSTCENTER,RECORDNUMBER,WORKTYPE) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [TID, REPORTHEADERID, REQUESTOR, NOTIFICATIONID, DESCRIPTION, APPROVALREQUESTEDDATE, Amount, APPROVALREQUESTEDBY, APPROVEREMPLOYEENUMBER, APPROVEDDATE, TOUSER, STATUS, INDIVIDUALSCOSTCENTER, IEXPENSENUMBER, 'ER'],
    
	  function (transaction, results) {
		 if(INDEX+1==LENGTH){
		 Unmask();
		console.log(results);}
		}, function (transaction, error) {
		
            if(INDEX+1==LENGTH){
			Unmask();
            console.log(error.message);}
        });
	
	});
}