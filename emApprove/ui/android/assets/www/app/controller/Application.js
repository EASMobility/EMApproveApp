/**
 * Copyright 2012-2013 Electronic Arts, Inc.
 */
/**
 *  Application.js file intializes controller,variables, config variables.
 */
var prdetailStore;
var worklistStore;
var PRworklistStore;
var ERworklistStore;
var erdetailStore;
var erhistoryStore;
var sessionTokenID;
var userID;
var nameValue;
var passwordValue;
var ApprovalComments;
var url;
var bar;
var tabselection;
var DeviceName;
var Platform;
var UniqueID;
var Version;
var buttonfinder;
var activetab;
var approvedOrNot;
var showviewtitle;
var categoryid = 0;
var signontoggle = false;
var iser_shown = false;
var ispo_shown = false;
var ispr_shown = false;
var settingscount = 0;
var abtcount = 0;
var devTokenFromIOS="";
var queryvalue = {
    "Tid": "123456",
    "SessionTokenId": localStorage.getItem('sessionToken')
};
var selectedrecord;
var RequestType;
var sample = "";
var clearautorefesh;
Ext.define('eaApprove.controller.Application', {
           extend: 'Ext.app.Controller',
           config: {
           refs: {
           main: 'mainview',
           editButton: '#editButton',
           approveButton: '#approveButton',
           approveCommentButton: '#approveCommentButton',
           approveCommentButton1: '#approveCommentButton1',
           contacts: '#contactslist',
           morelist: '#morelist',
           contacts1: '#contactslistdue',
           prlist: '#prlist',
           polist: '#polist',
           erlist: '#erlist',
           history: 'history',
           prdetail: 'prdetail',
           showContactView: 'secondview',
           secondviewback:'#secondviewback',
           settingsviewback:'#settingsviewback',
           aboutviewback:'#aboutviewback',
           commentsback:'#commentsback',
           settings: '#toggle1',
           opurchaserequisition: '#pr',
           opurchaseorder: '#po',
           oexpensereport: '#expense',
           approve: 'approve',
           approvecomment: 'approvecomment',
           rejectButton: '#rejectButton',
           reject: 'reject',
           rejectcomment: 'rejectcomment',
           rejectMainButton: '#rejectMainButton',
           approveMainButton: '#approveMainButton',
           approveDoneButton: '#approveDoneButton',
           settingsView:'settings',
           aboutView:'about',
           ApproveCmts:'approvecmts'
           },
           control: {
           // main: {
           // push: 'onMainPush',
           // pop: 'onMainPop'
           // },
           secondviewback:{
           
           onSecondViewBack:'onSecondViewBackAction'
           },
           settingsviewback:{
           
           onSettingsViewBack:'onSecondViewBackAction'
           },
           aboutviewback:{
           
           onAboutViewBack:'onSecondViewBackAction'
           },
           commentsback:{
           
           onCommentViewBack:'onCommentViewBackAction'
           },
           approveButton: {
           onApproveClick: 'onApproveAction'
           },
           approveCommentButton: {
           onApproveCommentsClick: 'onApproveCommentsAction'
           },
           approveCommentButton1: {
           onApproveCommentsClick: 'onApproveCommentsAction'
           },
           rejectButton: {
           onRejectClick: 'onRejectAction'
           },
           rejectMainButton: {
           onRejectMainClick: 'onRejectMainACtion'
           },
           approveMainButton: {
           onApproveMainClick: 'onApproveMainACtion'
           },
           approveDoneButton: {
           onApproveDoneClick: 'onApproveDoneAction'
           },
           rejectDoneButton: {
           onRejectDoneClick: 'onRejectDoneAction'
           },
           settings: {
           onmyclick: 'loginAuthentication',
           onLogout: 'logOut'
           },
           opurchaserequisition: {
           showpurchaserequisition: 'showPurchaseRequisition',
           hidepurchaserequisition: 'hidePurchaseRequisition'
           },
           opurchaseorder: {
           showpurchaseorder: 'showPurchaseOrder',
           hidepurchaseorder: 'hidePurchaseOrder'
           },
           oexpensereport: {
           showexpensereport: 'showExpenseReport',
           hideexpensereport: 'hideExpenseReport'
           },
           showContact: {
           itemtap: 'onListItem'
           },
           contacts: {
           itemtap: 'onContactSelect',
           itemtaphold: 'showOverlay'
           },
           morelist: {
           itemsingletap: 'onMoreList'
           },
           contacts1: {
           itemtap: 'onContactSelect',
           itemtaphold: 'showOverlay'
           },
           prlist: {
           itemtap: 'onContactSelect',
           itemtaphold: 'showOverlay'
           },
           polist: {
           itemtap: 'onContactSelect'
           },
           erlist: {
           itemtap: 'onContactSelect',
           itemtaphold: 'showOverlay'
           },
           saveButton: {
           tap: 'onContactSave'
           },
           editContact: {
           change: 'onContactChange'
           }
           }
           },
           /*This function used for authenicating user credentials and url for further proceedings*/
           slideLeftTransition: { type: 'slide', direction: 'left' },
           slideRightTransition: { type: 'slide', direction: 'right' },
           
           loginAuthentication: function (options) {
           var regEmailID = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
           var urlReg = /^(((http|ftp|https):\/\/)|www\.)[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#!]*[\w\-\@?^=%&amp;/~\+#])?/;
           if (localStorage.getItem('username')) {
           if (localStorage.getItem('username') != Ext.getCmp('username').getValue()) {
           //Ext.getCmp('pr').setValue(0);
           //Ext.getCmp('expense').setValue(0);
           dropTables();
           createTables();
           }
           }
           nameValue = Ext.getCmp('username').getValue();
           localStorage.setItem('username', nameValue);
           passwordValue = Ext.getCmp('password').getValue();
           localStorage.setItem('password', passwordValue);
           url = Ext.getCmp('url').getValue();
           localStorage.setItem('urlValue', Ext.getCmp('url').getValue());
           DeviceName = device.name;
           Platform = device.platform;
           UniqueID = device.uuid;
           Version = device.version;
           //Validation for URL
           if (urlReg.test(url) == false) {
           Ext.getCmp('toggle1').setValue(0);
           Ext.Msg.alert('Login Failed', 'Please use correct login credentials and try again', Ext.emptyFn);
           //loginService(nameValue, passwordValue,url);
           return (false);
           }
           //Validation for Email ID
           else if (regEmailID.test(nameValue) == false)
            {
			Ext.getCmp('toggle1').setValue(0);
			Ext.Msg.alert('Login Failed', 'Invalid email address', Ext.emptyFn);
			return (false);
            }
           else if ((nameValue == "") || (passwordValue == "")) {
           Ext.getCmp('toggle1').setValue(0);
           Ext.Msg.alert('Login Failed', 'Please use correct login credentials and try again', Ext.emptyFn);
           } else {
           if (check_network() == 'No network connection' || check_network() == 'Unknown connection') {
           Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
           } else {
           loginService(nameValue, passwordValue, localStorage.getItem('urlValue'));
           }
           }
           },
           /*This function call when sign-on toggled of by the user */
           logOut: function (options) {
           logOutService(localStorage.getItem('sessionToken'), localStorage.getItem('urlValue'));
           },
           /*This function show PurchaseRequisition item in category view*/
           showPurchaseRequisition: function (field, thumb, enabled, newValue, oldValue) {
           if (!this.PurchaseRequisition) {
           this.PurchaseRequisition = Ext.getCmp('PurchaseRequisitionContainer');
           }
           localStorage.setItem('prontoggle', true);
           this.PurchaseRequisition.show();
           // Ext.getCmp('categorytitle3').addCls('subtoolbar_category');
           ispr_shown = true;
           },
           /*This function hide PurchaseRequisition item in category view*/
           hidePurchaseRequisition: function () {
           if (!this.PurchaseRequisition) {
           this.PurchaseRequisition = Ext.getCmp('PurchaseRequisitionContainer');
           }
           localStorage.setItem('prontoggle', false);
           this.PurchaseRequisition.hide();
           ispr_shown = false;
           },
           /*This function show ExpenseReport item in category view*/
           showExpenseReport: function (options) {
           if (!this.ExpenseReport) {
           this.ExpenseReport = Ext.getCmp('ExpenseReportContainer');
           }
           localStorage.setItem('erontoggle', true);
           this.ExpenseReport.show();
           iser_shown = true;
           },
           /*This function hide ExpenseReport item in category view*/
           hideExpenseReport: function (options) {
           if (!this.ExpenseReport) {
           this.ExpenseReport = Ext.getCmp('ExpenseReportContainer');
           }
           localStorage.setItem('erontoggle', false);
           this.ExpenseReport.hide();
           iser_shown = false;
           },
           
           /*This will called when Reject button  clicked in Details view, it will show ReportItemsReject View */
           onRejectAction: function (options) {
           if(!this.approveoverlay){
           
           this.approveoverlay=Ext.Viewport.add({
                                                xtype:'panel',
                                                top: '28%',
                                                floating: true,
                                                modal: true,
                                                baseCls: 'x-report-background',
                                                id: 'reportItemsViewReject',
                                                // Content of Reject Dialog
                                                items: [{
                                                        html: '<div class="Approvecls">Reject</div>',
                                                        }, {
                                                        html: '<div class="actioncls">Are you sure you wish to Reject this item?</div>',
                                                        }, {
                                                        xtype: 'button',
                                                        text: 'Reject',
                                                        id: 'rejectMainButton',
                                                        cls: 'subbutton',
                                                        handler: function () {
                                                        if (check_network() == 'No network connection' || check_network() == 'Unknown connection') {
                                                        alert('No network connection');
                                                        } else {
                                                        this.fireEvent('onRejectMainClick', this);
                                                        
                                                        Ext.getCmp('reportItemsViewReject').hide();
                                                        }
                                                        }
                                                        }, {
                                                        xtype: 'button',
                                                        text: 'Reject With Comments',
                                                        id: 'approveCommentButton1',
                                                        cls: 'subbutton',
                                                        handler: function () {
                                                        this.fireEvent('onApproveCommentsClick', this);
                                                        Ext.getCmp('approveText').setValue(' ');
                                                        
                                                        buttonfinder = "reject";
                                                        Ext.getCmp('reportItemsViewReject').hide();
                                                        }
                                                        }, {
                                                        xtype: 'button',
                                                        text: 'Cancel',
                                                        cls: 'subbuttoncancel',
                                                        handler: function () {
                                                        
                                                        Ext.getCmp('reportItemsViewReject').hide();
                                                        }
                                                        }, {
                                                        html: '<div style="height:10px;"><br></div>',
                                                        }]
                                                
                                                
                                                
                                                });
           }
           this.approveoverlay.show();
           
           },
           /*This will called when Approve button  clicked in Details view, it will show ReportItems View */
           onApproveAction: function (options) {
           if(!this.overlay){
           
           this.overlay=Ext.Viewport.add({
                                         
                                         xtype:'panel',
                                         top: '28%',
                                         floating: true,
                                         modal: true,
                                         baseCls: 'x-report-background',
                                         id: 'reportItemsView',
                                         baseCls: 'x-report-background',
                                         // Content of Approve Dialog
                                         items: [{
                                                 html: '<div class="Approvecls">Approve</div>',
                                                 }, {
                                                 html: '<div class="actioncls">Are you sure you wish to Approve this item?</div>',
                                                 }, {
                                                 xtype: 'button',
                                                 text: 'Approve',
                                                 id: 'approveMainButton',
                                                 cls: 'subbutton',
                                                 handler: function () {
                                                 if (check_network() == 'No network connection' || check_network() == 'Unknown connection') {
                                                 alert('No network connection');
                                                 } else {
                                                 this.fireEvent('onApproveMainClick', this);
                                                 Ext.getCmp('reportItemsView').hide();
                                                 
                                                 }
                                                 }
                                                 }, {
                                                 xtype: 'button',
                                                 text: 'Approve With Comments',
                                                 id: 'approveCommentButton',
                                                 cls: 'subbutton',
                                                 handler: function () {
                                                 this.fireEvent('onApproveCommentsClick', this);
                                                 Ext.getCmp('approveText').setValue(' ');
                                                 
                                                 buttonfinder = "approve";
                                                 Ext.getCmp('reportItemsView').hide();
                                                 }
                                                 }, {
                                                 xtype: 'button',
                                                 text: 'Cancel',
                                                 id: 'appcancel',
                                                 cls: 'subbuttoncancel',
                                                 handler: function () {
                                                 
                                                 Ext.getCmp('reportItemsView').hide();
                                                 }
                                                 }, {
                                                 html: '<div style="height:10px;"><br></div>',
                                                 }]
                                         
                                         
                                         
                                         
                                         
                                         });
           }
           this.overlay.show();
           },
           /*This will called when user rejected particular item */
           onRejectMainACtion: function (options) {
           var _obj = {
           "PRRejectItemReq": {
           "Tid": Math.floor(Math.random() * 9000) + 1000,
           "SessionTokenId": localStorage.getItem('sessionToken'),
           "NOTIFICATIONID": selectedrecord.data.NOTIFICATIONID,
           "RejectionComments": "",
           "RequestType": RequestType
           }
           };
           //console.log(_obj);
           rejectRequest(_obj,this);
           },
           /*This will called when user approved or rejected particular item with comments*/
           onApproveDoneAction: function (options) {
           ApprovalComments = Ext.getCmp('approveText').getValue();
           if (buttonfinder == "approve") {
           var _obj = {
           "PRApproveItemReq": {
           "Tid": Math.floor(Math.random() * 9000) + 1000,
           "SessionTokenId": localStorage.getItem('sessionToken'),
           "NOTIFICATIONID": selectedrecord.data.NOTIFICATIONID,
           "ApprovalComments": ApprovalComments,
           "RequestType": RequestType
           }
           };
           approveRequest(_obj,this);
           } else {
           var _obj = {
           "PRRejectItemReq": {
           "Tid": Math.floor(Math.random() * 9000) + 1000,
           "SessionTokenId": localStorage.getItem('sessionToken'),
           "NOTIFICATIONID": selectedrecord.data.NOTIFICATIONID,
           "RejectionComments": ApprovalComments,
           "RequestType": RequestType
           }
           };
           rejectRequest(_obj,this);
           }
           },
           /*This will called when ReportItems Approve button is clicked */
           onApproveMainACtion: function (options) {
           var _obj = {
           "PRApproveItemReq": {
           "Tid": Math.floor(Math.random() * 9000) + 1000,
           "SessionTokenId": localStorage.getItem('sessionToken'),
           "NOTIFICATIONID": selectedrecord.data.NOTIFICATIONID,
           "ApprovalComments": "",
           "RequestType": RequestType
           }
           };
           // console.log(_obj);
           approveRequest(_obj,this);
           },
           /*This will called when Approve with comments button clicked, Added for showing comments view */
           onApproveCommentsAction: function (options) {
           
           Ext.Viewport.animateActiveItem(this.getApproveCmts(), this.slideLeftTransition);
           },
           /*This will called when Reject with comments button clicked, Added for showing comments view */
           onRejectCommentsAction: function (options) {
           if (!this.rejectComment) {
           this.rejectComment = Ext.create('eaApprove.view.contact.RejectCmts');
           }
           
           this.getMain().add(this.rejectComment);
           this.rejectComment.show();
           // this.getMain().push(this.rejectComment);
           },
           onMainPush: function (view, item) {
           // var editButton = this.getEditButton();
           if (item.xtype == "contacts") {
           //this.showEditButton();
           } else {
           //this.hideEditButton();
           }
           },
           /*   onMainPop: function(view, item) {
            alert('hi pop' + item.xtype);
            if (item.xtype == "contact-show") {
            alert('hi pop');
            this.showEditButton();
            } else {
            this.hideEditButton();
            }
            }, */
           /*This will called when user tapped on item in worklist, it will redirect to the Details view*/
           onContactSelect: function (list, index, node, record) {
           if (!this.itemTapHold) {
           url = localStorage.getItem('urlValue');
           selectedrecord = record;
           approvedOrNot = false;
           
           if (selectedrecord.data.WORKTYPE == 'PR') {
           RequestType = "PR";
           //this.showContact.setTitle("Requisition");
           Ext.getCmp('secondviewtoolbar').setTitle("Requisition");
           purchasedetail(url, localStorage.getItem('sessionToken'), selectedrecord.data.RECORDHEADERID);
           historydetail(url, localStorage.getItem('sessionToken'), selectedrecord.data.RECORDNUMBER);
           } else if (selectedrecord.data.WORKTYPE == 'ER') {
           RequestType = "IE";
           // this.showContact.setTitle("Report");
           Ext.getCmp('secondviewtoolbar').setTitle("Report");
           ERpurchasedetail(url, localStorage.getItem('sessionToken'), selectedrecord.data.RECORDHEADERID);
           ERhistorydetail(url, localStorage.getItem('sessionToken'), selectedrecord.data.RECORDNUMBER);
           }
           // Bind the record onto the show contact view
           
           var showview = this.getShowContactView();
           showview.setRecord(record); // load() is deprecated.
           Ext.Viewport.animateActiveItem(showview, this.slideLeftTransition);
           } else {
           this.itemTapHold = false;
           }
           },
           /*This will called when long hold happened on a item in worklist, it will show complete description in overlay*/
           showOverlay: function (list, idx, target, record, evt) {
           this.itemTapHold = true;
           var overlay = new Ext.Panel({
                                       floating: true,
                                       modal: true,
                                       centered: true,
                                       hideOnMaskTap: true,
                                       showAnimation: {
                                       type: 'popIn',
                                       duration: 250,
                                       easing: 'ease-out'
                                       },
                                       hideAnimation: {
                                       type: 'popOut',
                                       duration: 250,
                                       easing: 'ease-out'
                                       },
                                       //width: Ext.platform.isPhone ? 260 : 400,
                                       //height: Ext.platform.isPhone ? 220 : 400,
                                       width: 250,
                                       height: 80,
                                       styleHtmlContent: true,
                                       //dockedItems: overlayTb,
                                       scroll: 'horizontal',
                                       contentEl: 'lipsum',
                                       html: '<div><p style=\"font-weight:bold;color:#C5C5C5;font-size:12px;\">' + commentellipses(record.raw.DESCRIPTION) + '</p></div>',
                                       cls: 'htmlcontent'
                                       }); // for var overlay 
           overlay.showBy(target);
           },
           /*onMoreList will call when click happened on either "Settings" or "About" item*/
           onMoreList: function (list, idx, target, record, evt) {
           settingscount++;
           abtcount++;
           if (idx == 0) {
           if (settingscount == 1) {
           Ext.Viewport.animateActiveItem(this.getSettingsView(), this.slideLeftTransition);
           }
           } else if (idx == 1) {
           if (abtcount == 1) {
           Ext.Viewport.animateActiveItem(this.getAboutView(), this.slideLeftTransition);
           }
           }
           },
           onSecondViewBackAction:function () {
           settingscount=0;
           abtcount=0;
           
           Ext.Viewport.animateActiveItem(this.getMain(), this.slideRightTransition);
           
           },
           onCommentViewBackAction:function () {
           
           Ext.Viewport.animateActiveItem(this.getShowContactView(), this.slideRightTransition);
           
           },
           init: function () {},
           /*This will call when application launched*/
           launch: function () {
		   var NotificationCalled = window.regID.getNotificationCalledFlag();
		   if(NotificationCalled == "True")
		{
			
			worklistrequest(url,localStorage.getItem('sessionToken'),true);	
            ERworklistrequest(url,localStorage.getItem('sessionToken'),true);	
		}
           worklistStore = Ext.getStore("Worklists");
           worklistStore.load();
           PRworklistStore = Ext.getStore("PRWorklists");
           PRworklistStore.load();
           ERworklistStore = Ext.getStore("ERWorklists");
           ERworklistStore.load();
           historyStore = Ext.getStore("Historys");
           historyStore.load();
           erhistoryStore = Ext.getStore("ERhistorys");
           erhistoryStore.load();
           prdetailStore = Ext.getStore("Prdetails");
           prdetailStore.load();
           erdetailStore = Ext.getStore("Erdetails");
           erdetailStore.load();
           }
           
           });
