function loadDatabase() {
    //alert("dbs");
    
	 document.addEventListener("deviceready", onDeviceReady, false);
    
	//Ext.getCmp('name').setValue("hemendra bisoi");
	//Ext.getCmp('name').setValue("basanta kumar");
	//Ext.getCmp('password').setValue("password");
	function onDeviceReady() {
        //alert('deviceready');
		//navigator.network.isReachable("_http://10.226.112.12:80", reachableCallback, {});
           //checkConnection();
		   //check_network();
	}

	try {
		if (!window.openDatabase) {
			alert('Databases are not supported in this browser');
		} else {
			var shortName = 'emApprove';
			var version = '1.0';
			var displayName = 'emApprove';
			var maxSize = 5242880;
			EmApprove = openDatabase(shortName, version, displayName, maxSize);
		//	alert("Database Created");
			createTables();
			 checkTables();
			//dropTables();
			// dropYourTable();
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

function check_network() {
    var networkState = navigator.connection;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';

  //confirm('Connection type:\n ' + states[networkState]);
    
    return  states[networkState];
}
function dropTables(){

EmApprove.transaction(function(transaction) {

		transaction.executeSql('DROP TABLE worklist;', [], nullDataHandler,
				errorHandler);
});
EmApprove.transaction(function(transaction) {

		transaction.executeSql('DROP TABLE ERworklist;', [], nullDataHandler,
				errorHandler);
});
}


function createTables(){

			EmApprove.transaction(function(transaction) {
				/**
				 * *************************************************Work list Values table
				 * ******************************************************
				 */
				transaction
						.executeSql(
								'CREATE TABLE IF NOT EXISTS worklist(id INTEGER PRIMARY KEY AUTOINCREMENT ,TID nvarchar NULL ,RECORDHEADERID nvarchar UNIQUE NOT NULL,FROMUSER nvarchar NULL,NOTIFICATIONID nvarchar NULL,DESCRIPTION nvarchar NULL, APPROVALREQUESTEDDATE nvarchar NULL,Amount nvarchar NULL,MESSAGENAME nvarchar NULL,APPROVALREQUESTEDBY nvarchar NULL,APPROVEREMPLOYEENUMBER nvarchar NULL,APPROVEDDATE nvarchar NULL,TOUSER nvarchar NULL,STATUS nvarchar NULL,INDIVIDUALSCOSTCENTER nvarchar NULL,RECORDNUMBER INTEGER NULL,WORKTYPE nvarchar);',
								[], nullDataHandler, errorHandler);
			});
			
			EmApprove.transaction(function(transaction) {
				/**
				 * *************************************************Work list Values table
				 * ******************************************************
				 */
				transaction
						.executeSql(
								'CREATE TABLE IF NOT EXISTS POworklist(id INTEGER PRIMARY KEY AUTOINCREMENT ,TID nvarchar NULL ,POREQUISITIONHEADERID nvarchar UNIQUE NOT NULL,POFROMUSER nvarchar NULL,PONOTIFICATIONID nvarchar NULL,PODESCRIPTION nvarchar NULL, POAPPROVALREQUESTEDDATE nvarchar NULL,POAmount INTEGER NULL,POMESSAGENAME nvarchar NULL,POAPPROVALREQUESTEDBY nvarchar NULL,POAPPROVEREMPLOYEENUMBER nvarchar NULL,POREQUISITIONNUMBER INTEGER NULL,WORKTYPE nvarchar);',
								[], nullDataHandler, errorHandler);
			});
			
			EmApprove.transaction(function(transaction) {
				/**
				 * *************************************************Work list Values table
				 * ******************************************************
				 */
				transaction
						.executeSql(
								'CREATE TABLE IF NOT EXISTS ERworklist(id INTEGER PRIMARY KEY AUTOINCREMENT ,TID nvarchar NULL ,RECORDHEADERID nvarchar UNIQUE NOT NULL,FROMUSER nvarchar NULL,NOTIFICATIONID nvarchar NULL,DESCRIPTION nvarchar NULL, APPROVALREQUESTEDDATE nvarchar NULL,Amount nvarchar NULL,MESSAGENAME nvarchar NULL,APPROVALREQUESTEDBY nvarchar NULL,APPROVEREMPLOYEENUMBER nvarchar NULL,APPROVEDDATE nvarchar NULL,TOUSER nvarchar NULL,STATUS nvarchar NULL,INDIVIDUALSCOSTCENTER nvarchar NULL,RECORDNUMBER INTEGER NULL,WORKTYPE nvarchar);',
								[], nullDataHandler, errorHandler);
			});
}

function errorHandler(transaction, error) {
	if (error.code == 1) {
		// DB Table already exists
	} else {
		// Error is a human-readable string.
		console.log('Oops.  Error was ' + error.message + ' (Code '
				+ error.code + ')');
	}
	return false;
}

function nullDataHandler() {
	console.log("SQL Query Succeeded");
}

function insertWorklist(TID,REQUISITIONHEADERID,REQUESTOR,NOTIFICATIONID,DESCRIPTION,APPROVALREQUESTEDDATE, Amount, MESSAGENAME,APPROVALREQUESTEDBY,APPROVEREMPLOYEENUMBER,REQUISITIONNUMBER) {
	EmApprove
			.transaction(function(transaction) {
				transaction
						.executeSql(
								"INSERT INTO worklist(TID,RECORDHEADERID,FROMUSER,NOTIFICATIONID,DESCRIPTION,APPROVALREQUESTEDDATE,Amount,MESSAGENAME,APPROVALREQUESTEDBY,APPROVEREMPLOYEENUMBER,RECORDNUMBER,WORKTYPE) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
								[ TID,REQUISITIONHEADERID,REQUESTOR,NOTIFICATIONID,DESCRIPTION,APPROVALREQUESTEDDATE, Amount,MESSAGENAME,APPROVALREQUESTEDBY,APPROVEREMPLOYEENUMBER,REQUISITIONNUMBER,'PR']);
			});
			
}

function insertPoWorklist(TID,REQUISITIONHEADERID,REQUESTOR,NOTIFICATIONID,DESCRIPTION,APPROVALREQUESTEDDATE, Amount, MESSAGENAME,APPROVALREQUESTEDBY,APPROVEREMPLOYEENUMBER,REQUISITIONNUMBER) {
	EmApprove
			.transaction(function(transaction) {
			
				transaction
						.executeSql(
								"INSERT INTO POworklist(TID,POREQUISITIONHEADERID,POFROMUSER,PONOTIFICATIONID,PODESCRIPTION, POAPPROVALREQUESTEDDATE,POAmount,POMESSAGENAME,POAPPROVALREQUESTEDBY,POAPPROVEREMPLOYEENUMBER,POREQUISITIONNUMBER) VALUES(?,?,?,?,?,?,?,?,?,?,?)",
								[ TID,REQUISITIONHEADERID,REQUESTOR,NOTIFICATIONID,DESCRIPTION,APPROVALREQUESTEDDATE, Amount,MESSAGENAME,APPROVALREQUESTEDBY,APPROVEREMPLOYEENUMBER,REQUISITIONNUMBER]);
			});
			
}

function insertErWorklist(TID,REPORTHEADERID,REQUESTOR,NOTIFICATIONID,DESCRIPTION,APPROVALREQUESTEDDATE, Amount,APPROVALREQUESTEDBY,APPROVEREMPLOYEENUMBER,APPROVEDDATE,TOUSER,STATUS,INDIVIDUALSCOSTCENTER,IEXPENSENUMBER) {
	
	 EmApprove
			.transaction(function(transaction) {
				transaction
						.executeSql(
								"INSERT INTO ERworklist(TID,RECORDHEADERID,FROMUSER,NOTIFICATIONID,DESCRIPTION,APPROVALREQUESTEDDATE,Amount,APPROVALREQUESTEDBY,APPROVEREMPLOYEENUMBER,APPROVEDDATE,TOUSER,STATUS,INDIVIDUALSCOSTCENTER,RECORDNUMBER,WORKTYPE) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
								[ TID,REPORTHEADERID,REQUESTOR,NOTIFICATIONID,DESCRIPTION,APPROVALREQUESTEDDATE, Amount,APPROVALREQUESTEDBY,APPROVEREMPLOYEENUMBER,APPROVEDDATE,TOUSER,STATUS,INDIVIDUALSCOSTCENTER,IEXPENSENUMBER,'ER']);
			});	
			
}
