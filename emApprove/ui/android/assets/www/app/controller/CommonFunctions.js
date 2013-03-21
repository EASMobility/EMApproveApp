/**
 * Copyright 2012-2013 Electronic Arts, Inc. 
 */
/*
  Used to call the worklist request functions in periodic times.
 */
function autorefreshcall(){
setTimeout(function () {
        autorefresh()
    }, 360000);

} 
 
function autorefresh() {
console.log("autorefresh");
    clearautorefesh=setInterval(function () {
        worklistrequest(localStorage.getItem('urlValue'), localStorage.getItem('sessionToken'),false);
		ERworklistrequest(localStorage.getItem('urlValue'), localStorage.getItem('sessionToken'),false);
    }, 360000);
   
}
/*
  Used to format date in "month date,year"
 */
function formatteddatefunction(dates) {
    var datearray = [];
    datearray = dates.split(" ");
    var formatteddate = datearray[1] + " " + datearray[2] + ", " + datearray[3];
    return formatteddate;
}
/*
 Used to format date in "month date"
 */
function worklistdatefunction(dates) {
    var datearray = [];
    datearray = dates.split(" ");
    var formatteddate = datearray[1] + " " + datearray[2];
    return formatteddate;
}
/*
  To know whether table is empty or not on load of application
 */
function checkTables() {
    EmApprove.transaction(function (transaction) {
                          transaction.executeSql("SELECT * FROM worklist ;", [],
                                                 
                                                 function (transaction, results) {
                                                 if (results.rows.length != 0) {
                                                 tabselection = true;
                                                 ispr_shown = true;
                                                 Ext.getCmp('mytabsview').setActiveItem(0);
                                                 } else {
                                                 if (localStorage.getItem('prontoggle') == null || localStorage.getItem('prontoggle') == 'null' || localStorage.getItem('prontoggle') == '') {
                                                 localStorage.setItem('prontoggle', false);
                                                 localStorage.setItem('erontoggle', false);
                                                 }
                                                 
                                                 }
                                                 },
                                                 
                                                 function (transaction, error) {
                                                 console.log(error.message);
                                                 });
                          });
    EmApprove.transaction(function (transaction) {
                          transaction.executeSql("SELECT * FROM ERworklist ;", [],
                                                 
                                                 function (transaction, results) {
                                                 if (results.rows.length != 0) {
                                                 iser_shown = true;
                                                 Ext.getCmp('mytabsview').setActiveItem(0);
                                                 } else {
                                                 
                                                 }
                                                 },
                                                 
                                                 function (transaction, error) {
                                                 console.log(error.message);
                                                 });
                          });
}
/*
  If the comments exceeds 40 characters we need to include "...".This function is used for that purpose. 
 */
function commentellipses(comments) {
    if (comments.length > 40) {
        var str1 = comments.substring(0, 40) + "...";
        return str1;
    } else {
        return comments;
    }
}
/**
 * In the Lines page for IE, we need to include the GL with proper spacing. This function is used for that purpose. 
 */
function glbreak(glaccount) {
    var gla = glaccount;
    if (gla.length > 29) {
        if (gla.charAt(29) == ".") {
            var str = gla.substring(0, 30) + " " + gla.substring(30, gla.length);
        } else {
            var str2, str = "";
            str2 = gla.substring(0, 30).lastIndexOf(".");
            var str = gla.substring(0, str2 + 1) + " " + gla.substring(str2 + 1, gla.length);
        }
    }
    return str;
}

/*function to show load mask when transaction page loads */
function Mask(msg) {
    Ext.Viewport.mask({
        xtype: 'loadmask',
        message: msg
     });
    
}
/*function to hide load  mask  */
function Unmask() {
    Ext.Viewport.unmask(); 
}

function loadURL(url){
    navigator.app.loadUrl(url, { openExternal:true });
    return false;
} 
