//endsssvar historyStore;
var prdetailStore;
var worklistStore;
var PRworklistStore;
var POworklistStore;
var ERworklistStore;
var erdetailStore;
var erhistoryStore;
var showlistStore;
var sessionTokenID;
var userID;
var nameValue ;
var passwordValue ;
var ApprovalComments;
var url;
var bar;
var tabselection;
var DeviceName;
var Platform;
var UniqueID;
var Version;
var buttonfinder;
//added for approve and reject
var activetab;
var mainex;
var mainmask;
var approvedOrNot;
var storyContent;
var showviewtitle;
var categoryid=0;
var signontoggle=false;
//var prontoggle=false;
//var erontoggle=false;
//var reqRequistionNumber;
/////////
// added for checking show/hide of the panels in the category screen
var iser_shown = false;
var ispo_shown = false;
var ispr_shown = false;
var queryvalue = 
{
    "Tid": "123456",
    "SessionTokenId" : localStorage.getItem('sessionToken')
	//"REQUISITIONNUMBER" : "1104046015"
};
var selectedrecord;

var sample="";
 var currency = 
			{ 
				USD: '&#36;',
				GBP: '&#163;',
				JPY: '&#165;',
				EUR: '&#128;'
			   }
var titleTopToolbar = "Worklist - Start Date";			   
Ext.define('eaApprove.controller.Application', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            main: 'mainview',
            editButton: '#editButton',
			approveButton:'#approveButton',
			approveButton1:'#approveButton1',
			approveButton2:'#approveButton2',
			approveCommentButton:'#approveCommentButton',
			approveCommentButton1:'#approveCommentButton1',
            contacts: '#contactslist',
            morelist: '#morelist',
			contacts1: '#contactslistdue',
			prlist: '#prlist',
			polist: '#polist',
			erlist: '#erlist',			
			history:'history',
			prdetail:'prdetail',
            showContact: 'contact-show',
			settings:'#toggle1',
			opurchaserequisition: '#pr',
			opurchaseorder: '#po',
			oexpensereport: '#expense',
			
			
			showContact: '#listItem',
            editContact: 'contact-edit',
            saveButton: '#saveButton',
			
			
			approve:'approve',
			//added for approve and reject
			approvecomment:'approvecomment',
			rejectButton:'#rejectButton',
			rejectButton1:'#rejectButton1',
			rejectButton2:'#rejectButton2',
			rejectCommentButton:'#rejectCommentButton',
			reject:'reject',
			rejectcomment:'rejectcomment',
			rejectMainButton:'#rejectMainButton',
			
			approveMainButton:'#approveMainButton',
			
			approveDoneButton:'#approveDoneButton',
			rejectDoneButton:'#rejectDoneButton'
			
			///////////////ends
        },
        
        control: {
            main: {
                push: 'onMainPush',
                pop: 'onMainPop'
            },
            editButton: {
                tap: 'onContactEdit'
            },
			
			approveButton: {
                onApproveClick: 'onApproveAction'
            },
			approveButton1: {
                onApproveClick: 'onApproveAction'
            },
			approveButton2: {
                onApproveClick: 'onApproveAction'
            },
			approveCommentButton: {
                onApproveCommentsClick: 'onApproveCommentsAction'
            },
			approveCommentButton1: {
                onApproveCommentsClick: 'onApproveCommentsAction'
            },
			//added for approve and reject
			rejectButton: {
                onRejectClick: 'onRejectAction'
            },
			rejectButton1: {
                onRejectClick: 'onRejectAction'
            },
			rejectButton2: {
                onRejectClick: 'onRejectAction'
            },
			rejectCommentButton: {
                onRejectCommentsClick: 'onRejectCommentsAction'
            },
			rejectMainButton:{
                onRejectMainClick:'onRejectMainACtion'
			},
			approveMainButton:{
                onApproveMainClick:'onApproveMainACtion'
			},
			approveDoneButton:{
                onApproveDoneClick:'onApproveDoneAction'
			},
			rejectDoneButton:{
                onRejectDoneClick:'onRejectDoneAction'
			},
			/////ends
			settings:{
                onmyclick:'loginAuthentication',
                onLogout:'logOut'
			},
            
			opurchaserequisition:{
				 showpurchaserequisition:'showPurchaseRequisition',
				 hidepurchaserequisition:'hidePurchaseRequisition'
			},

			opurchaseorder:{
				showpurchaseorder:'showPurchaseOrder',
				hidepurchaseorder:'hidePurchaseOrder'
			},

			oexpensereport:{
				showexpensereport:'showExpenseReport',
				hideexpensereport:'hideExpenseReport'
			},
			
			showContact:{
                itemtap:'onListItem'
			},
            contacts: {
                itemtap: 'onContactSelect',
				itemtaphold: 'showOverlay'
            },
            morelist: {
            	itemtap: 'onMoreList'
            },
			contacts1: {
                itemtap: 'onContactSelect',
				itemtaphold: 'showOverlay'
            },
            prlist:{
            	itemtap: 'onContactSelect',
				itemtaphold: 'showOverlay'
            },
            polist:{
            	itemtap: 'onContactSelect'
            },
            erlist:{
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
    
	
	
	
	loginAuthentication:function(options)
	{	console.log(options);
        	//alert('how many times' + options);
		mainmask="";
		mainmask=this.getMain();
		var regEmailID = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		var urlReg= /^(((http|ftp|https):\/\/)|www\.)[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#!]*[\w\-\@?^=%&amp;/~\+#])?/;
		//added for approve and reject
		//alert(localStorage.getItem('username')+'in application');
		
		if(localStorage.getItem('username')){
		
		    if(localStorage.getItem('username')!=Ext.getCmp('username').getValue()){
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
		if (urlReg.test(url) == false) 
		{
			Ext.getCmp('toggle1').setValue(0);
			Ext.Msg.alert('Login Failed', 'Please use correct login credentials and try again', Ext.emptyFn);
			//loginService(nameValue, passwordValue,url);
			return (false);
		}
		//Validation for Email ID
		else if (regEmailID.test(nameValue) == false) 
		{
			Ext.getCmp('toggle1').setValue(0);
			alert('Invalid Email Address');		
			return (false);
		}
		else if((nameValue == "")||(passwordValue == ""))
		{
			Ext.getCmp('toggle1').setValue(0);
			alert('Enter a valid username and password');
		}
        
		else
		{
           
			if (check_network() == 'No network connection'||check_network() == 'Unknown connection')
			{
				alert('No network connection');	
			}else{
				//alert('loginservice');
			//loadDatabase();
				loginService(nameValue, passwordValue,url);	
               				
			}
		}
	},
	
 	logOut:function(options)
	{
        //localStorage.removeItem('username');
		logOutService(localStorage.getItem('sessionToken'),url);
	},
	
	
	
	showPurchaseRequisition:function(field, thumb, enabled,newValue,oldValue)
	{
        if (!this.PurchaseRequisition) {
            this.PurchaseRequisition = Ext.getCmp('ext-container-8');
        }
        localStorage.setItem('prontoggle',true);
		this.PurchaseRequisition.show();
		Ext.getCmp('ext-titlebar-3').addCls('subtoolbar_category');
		ispr_shown = true;
		
		//this.handleSettingsScenarios();
		//this.handleExpandCollapseScenarios();
	},

	hidePurchaseRequisition:function()
	{
        if (!this.PurchaseRequisition) {
            this.PurchaseRequisition = Ext.getCmp('ext-container-8');
        }
		 localStorage.setItem('prontoggle',false);
        this.PurchaseRequisition.hide();
        ispr_shown = false;

        //this.handleSettingsScenarios();
		//this.handleExpandCollapseScenarios();
	},

	showPurchaseOrder:function(options)
	{   
        if (!this.PurchaseOrder) {
            this.PurchaseOrder = Ext.getCmp('ext-container-5');
        }
		this.PurchaseOrder.show();
		Ext.getCmp('ext-titlebar-2').addCls('subtoolbar_category');
		ispo_shown = true;
		
        //this.handleSettingsScenarios();
		//this.handleExpandCollapseScenarios();
	},
	
	hidePurchaseOrder:function(options)
	{
        if (!this.PurchaseOrder) {
            this.PurchaseOrder = Ext.getCmp('ext-container-5');
        }
        this.PurchaseOrder.hide();
        ispo_shown = false;

        //this.handleSettingsScenarios();
		//this.handleExpandCollapseScenarios();
	},
	
	showExpenseReport:function(options)
	{
        if (!this.ExpenseReport) {
            this.ExpenseReport = Ext.getCmp('ext-container-2');
        }
		localStorage.setItem('erontoggle',true);
		this.ExpenseReport.show();
		Ext.getCmp('ext-titlebar-1').addCls('subtoolbar_category');
		iser_shown = true;
		
        //this.handleSettingsScenarios();
		//this.handleExpandCollapseScenarios();
	},

	hideExpenseReport:function(options)
	{
        if (!this.ExpenseReport) {
            this.ExpenseReport = Ext.getCmp('ext-container-2');
        }
		localStorage.setItem('erontoggle',false);
        this.ExpenseReport.hide();
        iser_shown = false;
        
        //this.handleSettingsScenarios();
		//this.handleExpandCollapseScenarios();
	},
	
	onApproveAction:function(options){
       
        if (!this.approve) {
            this.approve = Ext.create('eaApprove.view.contact.ReportItems');
        }
		
			
			
		this.getMain().add(this.approve);
		this.approve.show();
        
	},
	
	//added for approve and reject
	onRejectAction:function(options){
        
        if (!this.reject) {
            this.reject = Ext.create('eaApprove.view.contact.ReportItemsReject');
        }
		//alert('sdfdfsdf');
		this.getMain().add(this.reject);
		this.reject.show();
        
	},
    
	
	onRejectMainACtion:function(options){
        
        
		//alert(selectedrecord.data.NOTIFICATIONID);
		
		var _obj={"PRRejectItemReq": 
            {
                "Tid": Math.floor(Math.random()*9000) + 1000,
                "SessionTokenId" : localStorage.getItem('sessionToken'),
                "NOTIFICATIONID" : selectedrecord.data.NOTIFICATIONID,
                "RejectionComments" : ""	
            }
        };
        //console.log(_obj);
        
        rejectRequest(_obj);
        
        
    },
    onRejectDoneAction:function(options){
        
        var RejectionComments=Ext.getCmp('rejectText').getValue();
        //alert(selectedrecord.data.NOTIFICATIONID);
        var _obj={"PRRejectItemReq": 
            {
                "Tid": Math.floor(Math.random()*9000) + 1000,
                "SessionTokenId" : localStorage.getItem('sessionToken'),
                "NOTIFICATIONID" : selectedrecord.data.NOTIFICATIONID,
                "RejectionComments" : RejectionComments	
            }
        };
        //console.log(_obj);
        
        rejectRequest(_obj);
        
        
        
    },											 
    
    onApproveDoneAction:function(options){
        
        ApprovalComments=Ext.getCmp('approveText').getValue();
        //alert(selectedrecord.data.NOTIFICATIONID);
        //alert(selectedrecord.data.NOTIFICATIONID);
        
        if(buttonfinder=="approve"){
            var _obj={"PRApproveItemReq": 
                {
                    "Tid": Math.floor(Math.random()*9000) + 1000,
                    "SessionTokenId" : localStorage.getItem('sessionToken'),
                    "NOTIFICATIONID" : selectedrecord.data.NOTIFICATIONID,
                    "ApprovalComments" : ApprovalComments	
                }
            };
            
            approveRequest(_obj);	 
        }else
        {
            var _obj={"PRRejectItemReq": 
                {
                    "Tid": Math.floor(Math.random()*9000) + 1000,
                    "SessionTokenId" : localStorage.getItem('sessionToken'),
                    "NOTIFICATIONID" : selectedrecord.data.NOTIFICATIONID,
                    "RejectionComments" : ApprovalComments	
                }
            };
            
            rejectRequest(_obj);
            
            
        }			 
        //alert(_obj);
        
        
        
        
        
        
    },									 
    onApproveMainACtion:function(options){
        
        
		
		
		var _obj={"PRApproveItemReq": 
            {
                "Tid": Math.floor(Math.random()*9000) + 1000,
                "SessionTokenId" : localStorage.getItem('sessionToken'),
                "NOTIFICATIONID" : selectedrecord.data.NOTIFICATIONID,
                "ApprovalComments" : ""	
            }
        };
        // console.log(_obj);
        
	    approveRequest(_obj);
        
        
    },
	//endsss								  
	onApproveCommentsAction:function(options){
        //alert("came ");
        if (!this.approveComment) {
            this.approveComment = Ext.create('eaApprove.view.contact.ApproveCmts');
        }
		Ext.getCmp('mainview').getNavigationBar().hide();
		this.getMain().add(this.approveComment);
		this.approveComment.show();
		
		// this.getMain().push(this.approveComment);
        
	},
	
	//added for approve and reject
	onRejectCommentsAction:function(options){
        
        if (!this.rejectComment) {
            this.rejectComment = Ext.create('eaApprove.view.contact.RejectCmts');
        }
		Ext.getCmp('mainview').getNavigationBar().hide();
		this.getMain().add(this.rejectComment);
		this.rejectComment.show();
		
		// this.getMain().push(this.rejectComment);
        
	},
	//ends
	onListItem:function(list, index, node, record){
		
        bar = Ext.getCmp('mainview').getNavigationBar();
        bar.setDefaultBackButtonText('Back');
        console.log('list');
        console.log(selectedrecord.data.REQUISITIONHEADERID);
        console.log(index);
        if(approvedOrNot==false){
        	
		if(index==0){
            //alert('I am Prdeails' );
            
            if (!this.prdetail) {
                this.prdetail = Ext.create('eaApprove.view.contact.Prdetail');
            }
            //alert('Url is' + url);
           if (check_network() == 'No network connection'||check_network() == 'Unknown connection')
				{
        	        alert("network");
					alert('No network connection');	
				}else{
				if(selectedrecord.data.WORKTYPE=='PR'){
			this.prdetail.setTitle('Requisition Items');	
		purchasedetail(url,localStorage.getItem('sessionToken'),selectedrecord.data.RECORDHEADERID);
		            }else if(selectedrecord.data.WORKTYPE=='ER'){
			this.prdetail.setTitle('Report Items');		
		ERpurchasedetail(url,localStorage.getItem('sessionToken'),selectedrecord.data.RECORDHEADERID);			
					}
			
            // Bind the record onto the show Purchase detail view
         
        	  
            record =prdetailStore;
            this.prdetail.setRecord(record);
            
            // Push the show Purchase detail view into the navigation view
            this.getMain().push(this.prdetail);
				}        
		}else if(index==1){
            //alert('I am history screen');
            if (!this.history) {
                this.history = Ext.create('eaApprove.view.contact.History');
            }
            //alert('selectedrecord.data.REQUISITIONNUMBER' + selectedrecord.data.REQUISITIONNUMBER);
            if (check_network() == 'No network connection'||check_network() == 'Unknown connection')
				{
					alert('No network connection');	
				}else{
					if(selectedrecord.data.WORKTYPE=='PR'){
					
		historydetail(url,localStorage.getItem('sessionToken'),selectedrecord.data.RECORDNUMBER);		
				     }
					  else if(selectedrecord.data.WORKTYPE=='ER'){
					  
	   ERhistorydetail(url,localStorage.getItem('sessionToken'),selectedrecord.data.RECORDNUMBER);
					  }
            // Bind the record onto the show History view
          
            record = historyStore;
            this.history.setRecord(record);
            
            // Push the show History view into the navigation view
            //this.getMain().query('#navBar')[0].titleComponent.setWidth(100);
            this.getMain().push(this.history);
				}	      
		}
	}
	},
    onMainPush: function(view, item) {
        //alert('HI');
        var editButton = this.getEditButton();
        
        if (item.xtype == "contacts") {
            this.showEditButton();
        } else {
            //alert('hi.....');
            this.hideEditButton();
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
    
    
    
    onContactSelect: function(list, index, node, record) {
	    //alert("came inside");
		if(!this.itemTapHold){
		mainex="";
		mainex=this.getMain();
		mainmask="";
		mainmask=this.getMain();
		url=localStorage.getItem('urlValue');
		
		selectedrecord=record;
		//alert(selectedrecord.data.WORKTYPE);
		approvedOrNot=false;
		showlistStore.removeAll();
		if (!this.showContact) {
            this.showContact = Ext.create('eaApprove.view.contact.Show');
        }
		if(selectedrecord.data.WORKTYPE=='PR'){
		
		this.showContact.setTitle("Requisition");
		var prlistitems=[];
		prlistitems=['Purchase Requisition Details' ,'History'];
		
		for(var i=0;i<prlistitems.length;i++)
		showlistStore.add({
		 title: prlistitems[i] ,
		});
		   purchasedetail(url,localStorage.getItem('sessionToken'),selectedrecord.data.RECORDHEADERID);
		   	historydetail(url,localStorage.getItem('sessionToken'),selectedrecord.data.RECORDNUMBER);
		} 
		else if(selectedrecord.data.WORKTYPE=='ER'){
		this.showContact.setTitle("Report");
		var erlistitems=[];
		erlistitems=['Expense Report Details' ,'History'];
		
		for(var i=0;i<erlistitems.length;i++)
		showlistStore.add({
		 title: erlistitems[i] ,
		});
		ERpurchasedetail(url,localStorage.getItem('sessionToken'),selectedrecord.data.RECORDHEADERID);
		 ERhistorydetail(url,localStorage.getItem('sessionToken'),selectedrecord.data.RECORDNUMBER);
		}        
        
        // Bind the record onto the show contact view
        this.showContact.setRecord(record);
       
		
		
        // Push the show contact view into the navigation view
        this.getMain().push(this.showContact);
		}else{
		this.itemTapHold = false;
		}
    },
    
	showOverlay : function(list, idx, target, record, evt){
	
	this.itemTapHold = true;
	                var overlay = new Ext.Panel({
                    floating: true,
                    modal: true,
                    centered: true,
                    hideOnMaskTap: true,
                    showAnimation: {
                    	type:'popIn',
                    	duration:250,
                    	easing:'ease-out'
                    },
                    hideAnimation: {
                    	type:'popOut',
                    	duration:250,
                    	easing:'ease-out'
                    },
                    //width: Ext.platform.isPhone ? 260 : 400,
                    //height: Ext.platform.isPhone ? 220 : 400,
                    width: 250,
                    height: 80,
                    styleHtmlContent: true,
                    //dockedItems: overlayTb,
                    scroll: 'horizontal',
                    contentEl: 'lipsum',
                    html: '<div><p style=\"font-weight:bold;color:#C5C5C5;font-size:12px;\">'+record.raw.DESCRIPTION+'</p></div>',
                    cls: 'htmlcontent'
                }); // for var overlay 
                    overlay.showBy(target);

	},
	
	
	
    onMoreList: function(list, idx, target, record,
			evt){
    	//loadDatabase();
		
        //(if (target.id) {
    	if(idx==0){
            this.settings = Ext.create('eaApprove.view.Settings');
            this.getMain().push(this.settings);		
        }else if (idx==1){
        	this.about = Ext.create('eaApprove.view.About');
        	this.getMain().push(this.about);		
        } 
        	
        
        // Bind the record onto the edit contact view
        //this.editContact.setRecord(this.getShowContact().getRecord());
        
        
    },
    
    onContactEdit: function() {
        if (!this.editContact) {
            this.editContact = Ext.create('eaApprove.view.contact.Edit');
        }
        
        // Bind the record onto the edit contact view
        this.editContact.setRecord(this.getShowContact().getRecord());
        
        this.getMain().push(this.editContact);
    },
    
    onContactChange: function() {
        this.showSaveButton();
    },
    
    onContactSave: function() {
        var record = this.getEditContact().saveRecord();
        
        this.getShowContact().updateRecord(record);
        
        this.getMain().pop();
    },
    
    showEditButton: function() {
        var editButton = this.getEditButton();
        editButton.show();
        
    },
    
    hideEditButton: function() {
        var editButton = this.getEditButton();
		editButton.hide();
        
    },
    
    showSaveButton: function() {
        var saveButton = this.getSaveButton();
        
        if (!saveButton.isHidden()) {
            return;
        }
        
        saveButton.show();
    },
    
    hideSaveButton: function() {
        var saveButton = this.getSaveButton();
        
        if (saveButton.isHidden()) {
            return;
        }
        
        saveButton.hide();
    },
	
	init: function() {
        
        //  var main = Ext.getCmp('mainview').getNavigationBar();
        
        
        
        //main.getNavigationBar().setDefaultBackButtonText(null);
        //  main.getNavigationBar().setTitle(this.appTitle);
		
    },
	
	launch: function () {
	    //showEditButton();  
		var storyContent;
		worklistStore = Ext.getStore("Worklists");
		worklistStore.load();
		PRworklistStore = Ext.getStore("PRWorklists");
		PRworklistStore.load();
		POworklistStore = Ext.getStore("POWorklists");
		POworklistStore.load();
		ERworklistStore = Ext.getStore("ERWorklists");
		ERworklistStore.load();
		showlistStore=Ext.getStore("Showlists");
		showlistStore.load();
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

function loginService(username,password,url){
    //alert(username);
    //alert(url);
    //alert(password);
	//worklistrequest(url,'Abcd12345');
	 var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
		    button1[0].disable();
	mainmask.mask({ xtype: 'loadmask',message:'Please Wait' });
	var ajax = new XMLHttpRequest();
	var _object = {
		username : username,
		password: password
		
	};
	DeviceName = device.name;
    Platform = device.platform;
    UniqueID = device.uuid; 
    Version = device.version;
	var obj=
    {
        "Tid": Math.floor(Math.random()*9000) + 1000,
        
        "username": username,
        "password": password,
        "SessionTokenId" : "",        
        "DeviceInfo":
        {
            "DeviceName": DeviceName,
            "DeviceVersion": Version,
            "UniqueDeviceID": UniqueID, 
            //"UniqueDeviceID": "ZZZ", 
            "Platform" : Platform       
            
        }
    };
	
	var object = {
        AuthenticateUserReq:obj,
	};
	
	ajax.open('POST',url, true);
	ajax.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
	ajax.setRequestHeader('Access-Control-Allow-Origin', '*');
	ajax.send(JSON.stringify(object));
	//alert(JSON.stringify(object));
	
	ajax.onreadystatechange = function() {
		//alert(ajax.status);
		_oonreadystatechange(ajax);
		
	}
	
	var _oonreadystatechange = function(ajax, optss) {
		//console.log(ajax.status);
		//alert(ajax.readyState);
		if (ajax.readyState == '4') {
		//alert(ajax.status);
			if (ajax.status == '200') {
			   
				
                var data = JSON.parse(ajax.responseText);
                //alert(data);
				
                if(data.AuthenticateUserRes.Status.Code=='200')
                {
                    sessionTokenID = data.AuthenticateUserRes.SessionTokenId;
                    localStorage.setItem('sessionToken', sessionTokenID);
                    userID = data.AuthenticateUserRes.USERID;
                    document.getElementById('loginstatus').innerHTML="LOGGED ON";
                    localStorage.setItem('userid', userID);
                   signontoggle=true;
                   if (check_network() == 'No network connection'||check_network() == 'Unknown connection')
			{
				Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);	
			}else{
			
			worklistrequest(url,localStorage.getItem('sessionToken'));	
            ERworklistrequest(url,localStorage.getItem('sessionToken'));		
			WorklistDetailsReqProcess(url,localStorage.getItem('sessionToken'))	;
			  var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
		    button1[0].enable();
			 mainmask.unmask();
			}	
				}
				else if(data.AuthenticateUserRes.Status.Code=='402')  //Invalid user
				{
					alert('Invalid username or password. Try again');
					var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
		    button1[0].enable();
			          document.getElementById('loginstatus').innerHTML="LOGGED OFF";
					 mainmask.unmask();
				}
				else if(data.AuthenticateUserRes.Status.Code=='401')  //Invaid Session due to session timeout
				{
					loginService(nameValue, passwordValue,url);
					var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
		    button1[0].enable();
					 mainmask.unmask();
				}
              
			}  
			else if(ajax.status == '502'){
				Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
				Ext.getCmp('toggle1').setValue(0);
				var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
		    button1[0].enable();
			  document.getElementById('loginstatus').innerHTML="LOGGED OFF";
				mainmask.unmask();
				
				
				} 
                else if(ajax.status == '0'){
				Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
				Ext.getCmp('toggle1').setValue(0);
				var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
		    button1[0].enable();
			  document.getElementById('loginstatus').innerHTML="LOGGED OFF";
				mainmask.unmask();
				
				
				} 				
		}
	};
}

function logOutService(sessionToken,url){
	//url ='http://10.232.155.69:8888/ea-erp';
	url = localStorage.getItem('urlValue');
	var ajax = new XMLHttpRequest();
	var _object = {
        "Tid": Math.floor(Math.random()*9000) + 1000,
        
        "SessionTokenId" : sessionToken,    
	};
    
	var object = {
        LogoutUserReq:_object,
	};
	mainmask.mask({ xtype: 'loadmask',message:'' });
	ajax.open('POST',url, true);
	ajax.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
	ajax.setRequestHeader('Access-Control-Allow-Origin', '*');
	ajax.send(JSON.stringify(object));
	//alert(JSON.stringify(object));
	ajax.onreadystatechange = function() {
		//alert(ajax.status);
		_oonreadystatechange(ajax);
		
	}
	var _oonreadystatechange = function(ajax, optss) {
		//console.log(ajax.status);
		if (ajax.readyState == '4') {
			if (ajax.status == '200') {
                var data = JSON.parse(ajax.responseText);
                //alert(data);
                if(data.LogoutUserRes.Status.Code=='200')
                {
                   document.getElementById('loginstatus').innerHTML="LOGGED OFF";
					mainmask.unmask();
				}
				mainmask.unmask();
			} 
		}
	};
}




//Code for Worklist Details
function WorklistDetailsReqProcess(url,sessionTokenID)
{
	//alert('WorklistDetailsReqProcess Called');
	url = localStorage.getItem('urlValue');
	var ajax = new XMLHttpRequest();
	var _object = {
        "Tid": Math.floor(Math.random()*9000) + 1000,
        
        "SessionTokenId" : sessionTokenID,
        "PRSupport" : "1",
        "POSupport": "0",
        "ExpenseSupport" : "0",
        "TradePromotionsupport" : "0"	
	};
	
	var object = {
        WorkListDetailsReq:_object,
	};
    
	ajax.open('POST',url, true); //Kawal change
	ajax.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
	ajax.setRequestHeader('Access-Control-Allow-Origin', '*');
	ajax.send(JSON.stringify(object));
	ajax.onreadystatechange = function() {
		_oonreadystatechange(ajax);
	}
	var _oonreadystatechange = function(ajax, optss) {
		console.log(ajax.status);
		if (ajax.readyState == '4') 
		{
			if (ajax.status == '200') 
			{
				var data = JSON.parse(ajax.responseText);
                //	alert(data);
				if(data.WorkListDetailsRes.Status.Code=='200')
				{			
					//alert('Success in storing worklist details');					
				}
			} 
		}
	};
}

//added for approve and reject
function autorefresh()
{
	setTimeout(function(){worklistrequest(localStorage.getItem('urlValue'),localStorage.getItem('sessionToken'))},600000);
    setTimeout(function(){ERworklistrequest(localStorage.getItem('urlValue'),localStorage.getItem('sessionToken'))},600000);
	}
//ends

function worklistrequest(url,sessionTokenID)
{
    
	
    url = localStorage.getItem('urlValue');
	var ajax = new XMLHttpRequest();
	var _object = {
        "Tid": Math.floor(Math.random()*9000) + 1000,
        
		"SessionTokenId" :sessionTokenID
    };
	
	var object = {
        QueryWorklistPRReq:_object
	};
	
	//ajax.open('POST', 'http://127.0.0.1:8888/ea-erp', true);
	ajax.open('POST',url, true); //Kawal change
	//ajax.open('POST','respose.json', true);
	ajax.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
	ajax.setRequestHeader('Access-Control-Allow-Origin', '*');
	ajax.send(JSON.stringify(object));
	//alert(JSON.stringify(object));
	ajax.onreadystatechange = function() 
	{
		_oonreadystatechange(ajax);
	}
	var _oonreadystatechange = function(ajax, optss) 
	{		
		if (ajax.readyState == '4') {
			if (ajax.status == '200') 
			{
				var data = JSON.parse(ajax.responseText);
				if(data.QueryWorklistPRApprRes.Status.Code==='200')
				{	
               			/*if(data.QueryWorklistPRApprRes.PurchaseRequisition.length==0){
					 mainmask.unmask();
					 }*/
					//else{
					
					
					for ( var i = 0; i < data.QueryWorklistPRApprRes.PurchaseRequisition.length; i++) 
					{						
						//console.log(data.QueryWorklistPRApprRes.PurchaseRequisition[i].REQUISITIONNUMBER);
						var currencycode = data.QueryWorklistPRApprRes.PurchaseRequisition[i].CURRENCYCODE;
		//var currencycode = 'USD';
		var amountWithCurrencyCode =  currency[currencycode] + ' ' + data.QueryWorklistPRApprRes.PurchaseRequisition[i].Amount;
						
						
						insertWorklist(
						data.QueryWorklistPRApprRes.Tid,//added for approve and reject
						data.QueryWorklistPRApprRes.PurchaseRequisition[i].REQUISITIONHEADERID,
						data.QueryWorklistPRApprRes.PurchaseRequisition[i].REQUESTOR,
						data.QueryWorklistPRApprRes.PurchaseRequisition[i].NOTIFICATIONID,//added for approve and reject
						data.QueryWorklistPRApprRes.PurchaseRequisition[i].DESCRIPTION,
						data.QueryWorklistPRApprRes.PurchaseRequisition[i].APPROVALREQUESTEDDATE,
						//data.QueryWorklistPRApprRes.PurchaseRequisition[i].Amount,
						amountWithCurrencyCode,
						data.QueryWorklistPRApprRes.PurchaseRequisition[i].MESSAGENAME,
						data.QueryWorklistPRApprRes.PurchaseRequisition[i].APPROVALREQUESTEDBY,
						data.QueryWorklistPRApprRes.PurchaseRequisition[i].APPROVEREMPLOYEENUMBER,
						data.QueryWorklistPRApprRes.PurchaseRequisition[i].REQUISITIONNUMBER);		
						/*worklistStore.add({
                         REQUISITIONNUMBER : data.QueryWorklistPRApprRes.PurchaseRequisition[i].REQUISITIONNUMBER
                         });*/
						/*if(i==data.QueryWorklistPRApprRes.PurchaseRequisition.length){	
						mainmask.unmask();  
					       } */
						 
					}

                  // }					
                    //autorefresh();//added for auto refresh
				}
			    //reqheaderID = localStorage.setItemK('requestheaderid',
                else if(data.QueryWorklistPRApprRes.Status.Code=='401')  //Invaid Session due to session timeout
				{
					loginService(nameValue, passwordValue,url);	
					
				}
				//mainmask.unmask();
			} 
		}
	};
	
}

function POworklistrequest(url,sessionTokenID)
{
    //alert(sessionTokenID);
    // alert(url);
    url = localStorage.getItem('urlValue');
	var ajax = new XMLHttpRequest();
	var _object = {
        "Tid": Math.floor(Math.random()*9000) + 1000,
        
		"SessionTokenId" :sessionTokenID
    };
	
	var object = {
        QueryWorklistPRReq:_object
	};
	
	//ajax.open('POST', 'http://127.0.0.1:8888/ea-erp', true);
	
	ajax.open('POST',url, true); //Kawal change
	//ajax.open('POST','respose.json', true);
	ajax.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
	ajax.setRequestHeader('Access-Control-Allow-Origin', '*');
	ajax.send(JSON.stringify(object));
	//alert(JSON.stringify(object));
	ajax.onreadystatechange = function() 
	{
		_oonreadystatechange(ajax);
	}
	var _oonreadystatechange = function(ajax, optss) 
	{		
		if (ajax.readyState == '4') {
			if (ajax.status == '200') 
			{
				var data = JSON.parse(ajax.responseText);
				if(data.QueryWorklistPRApprRes.Status.Code==='200')
				{		
					console.log(data);
					
					for ( var i = 0; i < data.QueryWorklistPRApprRes.PurchaseRequisition.length; i++) 
					{						
						//console.log(data.QueryWorklistPRApprRes.PurchaseRequisition[i].REQUISITIONNUMBER);
						
						
						
						insertPoWorklist(
						data.QueryWorklistPRApprRes.Tid,//added for approve and reject
						data.QueryWorklistPRApprRes.PurchaseRequisition[i].REQUISITIONHEADERID,
						data.QueryWorklistPRApprRes.PurchaseRequisition[i].REQUESTOR,
						data.QueryWorklistPRApprRes.PurchaseRequisition[i].NOTIFICATIONID,//added for approve and reject
						data.QueryWorklistPRApprRes.PurchaseRequisition[i].DESCRIPTION,
						data.QueryWorklistPRApprRes.PurchaseRequisition[i].APPROVALREQUESTEDDATE,
						data.QueryWorklistPRApprRes.PurchaseRequisition[i].Amount,
						data.QueryWorklistPRApprRes.PurchaseRequisition[i].MESSAGENAME,
						data.QueryWorklistPRApprRes.PurchaseRequisition[i].APPROVALREQUESTEDBY,
						data.QueryWorklistPRApprRes.PurchaseRequisition[i].APPROVEREMPLOYEENUMBER,
						data.QueryWorklistPRApprRes.PurchaseRequisition[i].REQUISITIONNUMBER);		
						/*worklistStore.add({
                         REQUISITIONNUMBER : data.QueryWorklistPRApprRes.PurchaseRequisition[i].REQUISITIONNUMBER
                         });*/
					}
                   
                   					
                   // autorefresh();//added for auto refresh
				}
			    //reqheaderID = localStorage.setItemK('requestheaderid',
                else if(data.QueryWorklistPRApprRes.Status.Code=='401')  //Invaid Session due to session timeout
				{
					loginService(nameValue, passwordValue,url);	
					
				}
				//mainmask.unmask();
			} 
		}
	};
}
function ERworklistrequest(url,sessionTokenID)
{
   
    // alert(url);
    url = localStorage.getItem('urlValue');
	var ajax = new XMLHttpRequest();
	var _object = {
        "Tid": Math.floor(Math.random()*9000) + 1000,
        
		"SessionTokenId" :sessionTokenID
    };
	
	var object = {
        QueryWorklistIEReq:_object
	};
	//console.log(object);
	//ajax.open('POST', 'http://127.0.0.1:8888/ea-erp', true);
	
	ajax.open('POST',url, true); //Kawal change
	//ajax.open('POST','respose.json', true);
	ajax.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
	ajax.setRequestHeader('Access-Control-Allow-Origin', '*');
	ajax.send(JSON.stringify(object));
	//alert(JSON.stringify(object));
	ajax.onreadystatechange = function() 
	{
		_oonreadystatechange(ajax);
	}
	var _oonreadystatechange = function(ajax, optss) 
	{		
		if (ajax.readyState == '4') {
			if (ajax.status == '200') 
			{
				var data = JSON.parse(ajax.responseText);
				if(data.QueryWorklistIEApprRes.Status.Code==='200')
				{		
				
				     /*if(data.QueryWorklistIEApprRes.IExpenseReport.length==0){
					 mainmask.unmask();
					 }*/
					 //else{
					for ( var i = 0; i < data.QueryWorklistIEApprRes.IExpenseReport.length; i++) 
					{						
						var amountWithoutCommas
						 amountWithoutCommas = data.QueryWorklistIEApprRes.IExpenseReport[i].AMOUNT;
						 
   		 
               amountWithoutCommas = parseFloat(amountWithoutCommas).toFixed(2);
               //alert(amountWithoutCommas);
                 amountWithoutCommas += '';
                  var x = amountWithoutCommas.split('.');
                 var x1 = x[0];
                 var x2 = x.length > 1 ? '.' + x[1] : '';
                var rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1)) {
                      x1 = x1.replace(rgx, '$1' + ',' + '$2');
                       }
                 //   var amountWithCommas = x1 + x2+" "+amountWithoutCommas[1];
				 
				 var currencycode = data.QueryWorklistIEApprRes.IExpenseReport[i].CURRENCYCODE;
		//var currencycode = 'USD';
		var amountWithCommas =  currency[currencycode] + ' ' + x1 + x2;
						
				  
					
						insertErWorklist(
						data.QueryWorklistIEApprRes.Tid,//added for approve and reject
						data.QueryWorklistIEApprRes.IExpenseReport[i].REPORTHEADERID,
						data.QueryWorklistIEApprRes.IExpenseReport[i].REQUESTOR,
						data.QueryWorklistIEApprRes.IExpenseReport[i].NOTIFICATIONID,//added for approve and reject
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
						
					/*if(i==data.QueryWorklistIEApprRes.IExpenseReport.length){	
						mainmask.unmask();  
					                                            }	*/
                       }
                     // }					   
                   // autorefresh();//added for auto refresh
				}
			    //reqheaderID = localStorage.setItemK('requestheaderid',
                else if(data.QueryWorklistIEApprRes.Status.Code=='401')  //Invaid Session due to session timeout
				{
					loginService(nameValue, passwordValue,url);	
					
				}
				//mainmask.unmask();
			} 
		}
	};
}
function historydetail(url,sessionTokenID,requestRequistionNumber)
{
	var ajax = new XMLHttpRequest();
	url = localStorage.getItem('urlValue');
	
	var _object = {
        "Tid": Math.floor(Math.random()*9000) + 1000,
        
		"SessionTokenId" :sessionTokenID,
		"REQUISITIONNUMBER" : requestRequistionNumber //"REQUISITIONNUMBER" : "1104048413"  for user ID 128557  //"REQUISITIONNUMBER" : "1104046994" for UserID 116401    //"REQUISITIONNUMBER": "1104046932" for user ID 104857
    };
	
	var object = {
        QueryHistoryItemsReq:_object
	};
	//alert("url is " + url);
	//alert(url);
	ajax.open('POST',url, true);
	//ajax.open('POST','history.json', true);
	ajax.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
	ajax.setRequestHeader('Access-Control-Allow-Origin', '*');
	ajax.send(JSON.stringify(object));
	//alert(JSON.stringify(object));
	ajax.onreadystatechange = function() {
		_oonreadystatechange(ajax);
	}
	//mainmask.mask({ xtype: 'loadmask',message:'' });
	//290354	 Ext.getCmp('rejectButton2').setDisabled(true);
       //    Ext.getCmp('approveButton2').setDisabled(true);
			 var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
		    button1[0].disable();
	var _oonreadystatechange = function(ajax, optss) 
	{	
		historyStore.removeAll();
		
		if (ajax.readyState == 4) 
		{
			
			if (ajax.status == 200) 
			{
				var data = JSON.parse(ajax.responseText);
				console.log(data);
				
				
		//		 Ext.getCmp('rejectButton2').setDisabled(false);
   	     //       Ext.getCmp('approveButton2').setDisabled(false);
				 var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
			
			button1[0].enable();
				if(data.QueryPRHistoryRes.Status.Code==='200')
				{
				    
                    if(data.QueryPRHistoryRes.PurchaseRequisition.length===0)
                    {
                        //Ext.getCmp('historytitle').show();
                        //Ext.getCmp('historytitle').setTitle('No History items');
                        //Ext.getCmp('historytoolbar').hide();
                        
					}
					else
					{
                        //Ext.getCmp('historytitle').setTitle('');
                        //Ext.getCmp('historytoolbar').show();
					}
                    
					for ( var i = 0; i < data.QueryPRHistoryRes.PurchaseRequisition.length; i++) 
					{				
                        
						historyStore.add(
						{
							REQUISITIONHEADERID:data.QueryPRHistoryRes.PurchaseRequisition[i].REQUISITIONHEADERID,
							REQUESTOR: data.QueryPRHistoryRes.PurchaseRequisition[i].REQUESTOR,
							APPROVEREMPLOYEENUMBER: data.QueryPRHistoryRes.PurchaseRequisition[i].APPROVEREMPLOYEENUMBER,
							DESCRIPTION:commentellipses(data.QueryPRHistoryRes.PurchaseRequisition[i].DESCRIPTION),
							APPROVALREQUESTEDDATE:formatteddatefunction(data.QueryPRHistoryRes.PurchaseRequisition[i].APPROVALREQUESTEDDATE),
							Amount:data.QueryPRHistoryRes.PurchaseRequisition[i].Amount,
							MESSAGENAME:data.QueryPRHistoryRes.PurchaseRequisition[i].MESSAGENAME,
							APPROVALREQUESTEDBY:data.QueryPRHistoryRes.PurchaseRequisition[i].APPROVALREQUESTEDBY,
							APPROVEDDATE:formatteddatefunction(data.QueryPRHistoryRes.PurchaseRequisition[i].APPROVEDDATE),
							TOUSER:data.QueryPRHistoryRes.PurchaseRequisition[i].TOUSER,
						});
					}
					
				}				
				else if(data.QueryPRHistoryRes.Status.Code=='401')  //Invaid Session due to session timeout
				{
					if (check_network() == 'No network connection'||check_network() == 'Unknown connection')
					{
						alert('No network connection');	
					}else{
					loginService(nameValue, passwordValue,url);
					historydetail(url,localStorage.getItem('sessionToken'),selectedrecord.data.RECORDNUMBER);
					}	
					
				}	
				mainmask.unmask();
			} 
			else if(ajax.status == '502'){
				Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
			//	 Ext.getCmp('rejectButton2').setDisabled(true);
   	       //     Ext.getCmp('approveButton2').setDisabled(true);
				 var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
			
			    button1[0].enable();
				mainmask.unmask();
				
				
				}  else if(ajax.status == '0'){
				Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
			//	 Ext.getCmp('rejectButton2').setDisabled(true);
   	        //    Ext.getCmp('approveButton2').setDisabled(true);
				 var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
			
			    button1[0].enable();
				mainmask.unmask();
				
				
				} 	
				else if(ajax.status == '404'){
					Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
			//		 Ext.getCmp('rejectButton2').setDisabled(true);
	   	     //       Ext.getCmp('approveButton2').setDisabled(true);
					 var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
				
				    button1[0].enable();
					mainmask.unmask();
					
					
					} 	
				else if(ajax.status == '500'){
					Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
			//		 Ext.getCmp('rejectButton2').setDisabled(true);
	   	       //     Ext.getCmp('approveButton2').setDisabled(true);
					 var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
				
				    button1[0].enable();
					mainmask.unmask();
					
					
					} 	
		} 
	};
}

function ERhistorydetail(url,sessionTokenID,requestRequistionNumber)
{
	var ajax = new XMLHttpRequest();
	url = localStorage.getItem('urlValue');
	//alert(requestRequistionNumber);
	var _object = {
        "Tid": Math.floor(Math.random()*9000) + 1000,
        
		"SessionTokenId" :sessionTokenID,
		"IEXPENSENUMBER" : requestRequistionNumber 
    };
	
	var object = {
        QueryIEHistoryItemsReq:_object
	};
	//alert("url is " + url);
	//alert(url);
	ajax.open('POST',url, true);
	//ajax.open('POST','history.json', true);
	ajax.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
	ajax.setRequestHeader('Access-Control-Allow-Origin', '*');
	ajax.send(JSON.stringify(object));
	//alert(JSON.stringify(object));
	ajax.onreadystatechange = function() {
		_oonreadystatechange(ajax);
	}
	//mainmask.mask({ xtype: 'loadmask',message:'' });
	// Ext.getCmp('rejectButton2').setDisabled(true);
       //    Ext.getCmp('approveButton2').setDisabled(true);
			 var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
		    button1[0].disable();
	var _oonreadystatechange = function(ajax, optss) 
	{	
		erhistoryStore.removeAll();
		
		if (ajax.readyState == 4) 
		{
			
			if (ajax.status == 200) 
			{
				var data = JSON.parse(ajax.responseText);
				console.log(data);
				
				
		//		 Ext.getCmp('rejectButton2').setDisabled(false);
   	      //      Ext.getCmp('approveButton2').setDisabled(false);
				 var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
			
			button1[0].enable();
				if(data.QueryIEHistoryItemsRes.Status.Code==='200')
				{
				    
                    if(data.QueryIEHistoryItemsRes.IEHistoryItemsInfo.length===0)
                    {
                        Ext.getCmp('historylist').show();
                        Ext.getCmp('historylist').setTitle('No History items');
                        //Ext.getCmp('historytoolbar').hide();
                        
					}
					else
					{
                        Ext.getCmp('historylist').setTitle('');
                        //Ext.getCmp('historytoolbar').show();
					}
                    
					 for ( var i = 0; i < data.QueryIEHistoryItemsRes.IEHistoryItemsInfo.length; i++) 
					{				
                         
						
						
						erhistoryStore.add(
						{
							REPORTHEADERID:data.QueryIEHistoryItemsRes.IEHistoryItemsInfo[i].REPORTHEADERID,
							NOTIFICATIONID: data.QueryIEHistoryItemsRes.IEHistoryItemsInfo[i].NOTIFICATIONID,
							APPROVEREMPLOYEENUMBER: data.QueryIEHistoryItemsRes.IEHistoryItemsInfo[i].APPROVEREMPLOYEENUMBER,
							STATUS:data.QueryIEHistoryItemsRes.IEHistoryItemsInfo[i].STATUS,
							TOUSER:data.QueryIEHistoryItemsRes.IEHistoryItemsInfo[i].TOUSER,
							IEXPENSENUMBER:data.QueryIEHistoryItemsRes.IEHistoryItemsInfo[i].IEXPENSENUMBER,
					    	APPROVEDDATE:formatteddatefunction(data.QueryIEHistoryItemsRes.IEHistoryItemsInfo[i].APPROVEDDATE),
							DESCRIPTION:commentellipses(data.QueryIEHistoryItemsRes.IEHistoryItemsInfo[i].DESCRIPTION),
						   
						});
					} 
					
					console.log(erhistoryStore);
				}				
				else if(data.QueryPRHistoryRes.Status.Code=='401')  //Invaid Session due to session timeout
				{
					if (check_network() == 'No network connection'||check_network() == 'Unknown connection')
					{
						alert('No network connection');	
					}else{
					loginService(nameValue, passwordValue,url);
					ERhistorydetail(url,localStorage.getItem('sessionToken'),selectedrecord.data.RECORDNUMBER);
					}	
					
				}	
				mainmask.unmask();
			} 
			else if(ajax.status == '502'){
				Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
			//	 Ext.getCmp('rejectButton2').setDisabled(true);
   	       //     Ext.getCmp('approveButton2').setDisabled(true);
				 var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
			
			    button1[0].enable();
				mainmask.unmask();
				
				
				}  else if(ajax.status == '0'){
				Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
			//	 Ext.getCmp('rejectButton2').setDisabled(true);
   	           // Ext.getCmp('approveButton2').setDisabled(true);
				 var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
			
			    button1[0].enable();
				mainmask.unmask();
				
				
				} 	
				else if(ajax.status == '404'){
					Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
				//	 Ext.getCmp('rejectButton2').setDisabled(true);
	   	        //    Ext.getCmp('approveButton2').setDisabled(true);
					 var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
				
				    button1[0].enable();
					mainmask.unmask();
					
					
					} 	
				else if(ajax.status == '500'){
					Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
				//	 Ext.getCmp('rejectButton2').setDisabled(true);
	   	         //   Ext.getCmp('approveButton2').setDisabled(true);
					 var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
				
				    button1[0].enable();
					mainmask.unmask();
					
					
					} 	
		} 
	};
}
function purchasedetail(url,sessionTokenID,requestheaderID){
    
    //alert ('url is ' + url) ;
    url = localStorage.getItem('urlValue');
	var ajax = new XMLHttpRequest();
	
	var _object = {
        "Tid": Math.floor(Math.random()*9000) + 1000,
        
		"SessionTokenId" : sessionTokenID,
		"REQUISITIONHEADERID": requestheaderID //user ID 128557  //"REQUISITIONHEADERID": "266138" for user 143593      //"REQUISITIONHEADERID": "266079" for user 136772		
	};
	
	
	var object = {
        QueryPRDetailedInfoReq:_object
	};
	
	//ajax.open('POST', 'respose.json', true);
	ajax.open('POST',url, true); //Kawal change
	//ajax.open('POST','prdetail.json', true); 
	ajax.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
	ajax.setRequestHeader('Access-Control-Allow-Origin', '*');
	ajax.send(JSON.stringify(object));
	//alert(JSON.stringify(object));
	ajax.onreadystatechange = function() {
		_oonreadystatechange(ajax);
	}
	mainmask.mask({ xtype: 'loadmask',message:'' });
	 //Ext.getCmp('rejectButton1').setDisabled(true);
          //  Ext.getCmp('approveButton1').setDisabled(true);
			 var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
		    button1[0].disable();
			
	var _oonreadystatechange = function(ajax, optss) {
        //alert(ajax.status);
		 prdetailStore.removeAll();
		
		if (ajax.readyState == 4) {
			
			if (ajax.status == 200) {
                //alert('I am success');
                //alert(data.QueryPRDetailedInfoRes.PRDetailedInfo);
				 //Ext.getCmp('rejectButton1').setDisabled(false);
   	           // Ext.getCmp('approveButton1').setDisabled(false);
				 var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
			    button1[0].enable();
                var data = JSON.parse(ajax.responseText);
                //console.log(data);
				
                if(data.QueryPRDetailedInfoRes.Status.Code==='200')
                {
                  
                    //var PRDetailedInfoRes = JSON.stringify(data.QueryPRDetailedInfoRes);
                    //alert(PRDetailedInfoRes);			
                    for ( var i = 0; i < data.QueryPRDetailedInfoRes.PRDetailedInfo.length; i++) 
                    {				
                        var unit=data.QueryPRDetailedInfoRes.PRDetailedInfo[i].UNITPRICE;
                        
                        var unitprice;
                        
                        if(unit.indexOf('.')==-1){
                            
                            unitprice=parseFloat(data.QueryPRDetailedInfoRes.PRDetailedInfo[i].UNITPRICE).toFixed(2);
                        }	else
                        {
                            unitprice=parseFloat(data.QueryPRDetailedInfoRes.PRDetailedInfo[i].UNITPRICE);  
                        }		
                        
                        var currencycode = data.QueryPRDetailedInfoRes.PRDetailedInfo[i].CURRENCYCODE;
                        //var currencycode = 'USD';
                        var amountWithCommas =  currency[currencycode] + ' ' + unitprice;
                        
                        prdetailStore.add(
                        {				
                            REQUISITIONHEADERID:data.QueryPRDetailedInfoRes.PRDetailedInfo[i].REQUISITIONHEADERID,
                            FROMUSER: data.QueryPRDetailedInfoRes.PRDetailedInfo[i].FROMUSER,
                            ITEMDESCRIPTION:commentellipses(data.QueryPRDetailedInfoRes.PRDetailedInfo[i].DESCRIPTION),
                            LINETYPE:data.QueryPRDetailedInfoRes.PRDetailedInfo[i].LINETYPE,
                            UNITPRICE:amountWithCommas,
                            LASTUPDATEDATE:data.QueryPRDetailedInfoRes.PRDetailedInfo[i].LASTUPDATEDATE,
                            QUANTITY:data.QueryPRDetailedInfoRes.PRDetailedInfo[i].QUANTITY,
                            LASTUPDATELOGIN:data.QueryPRDetailedInfoRes.PRDetailedInfo[i].LASTUPDATELOGIN,
                            REQUESTOR:data.QueryPRDetailedInfoRes.PRDetailedInfo[i].REQUESTOR
                        });
                    }
                  console.log(prdetailStore);
                }else if(data.QueryPRHistoryRes.Status.Code=='401')  //Invaid Session due to session timeout
				{
					if (check_network() == 'No network connection'||check_network() == 'Unknown connection')
					{
						alert('No network connection');	
					}else{
					loginService(nameValue, passwordValue,url);
					purchasedetail(url,localStorage.getItem('sessionToken'),selectedrecord.data.REQUISITIONHEADERID)
					}	
					
				}	
                mainmask.unmask();
			}  
			else if(ajax.status == '502'){
				Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
				 //Ext.getCmp('rejectButton1').setDisabled(true);
   	           // Ext.getCmp('approveButton1').setDisabled(true);
				 var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
			    button1[0].enable();
				mainmask.unmask();
				
				
				}  else if(ajax.status == '0'){
				Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
				// Ext.getCmp('rejectButton1').setDisabled(true);
   	           // Ext.getCmp('approveButton1').setDisabled(true);
				 var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
			    button1[0].enable();
				mainmask.unmask();
				
				
				} 	
				else if(ajax.status == '404'){
					Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
					// Ext.getCmp('rejectButton1').setDisabled(true);
	   	           // Ext.getCmp('approveButton1').setDisabled(true);
					 var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
				    button1[0].enable();
					mainmask.unmask();
					
					
					}
				else if(ajax.status == '500'){
					Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
					// Ext.getCmp('rejectButton1').setDisabled(true);
	   	           // Ext.getCmp('approveButton1').setDisabled(true);
					 var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
				    button1[0].enable();
					mainmask.unmask();
					
					
					}
		}
	};
}

function ERpurchasedetail(url,sessionTokenID,reportheaderID){
    
    //alert ('url is ' + url) ;
    url = localStorage.getItem('urlValue');
	var ajax = new XMLHttpRequest();
	
	var _object = {
        "Tid": Math.floor(Math.random()*9000) + 1000,
        
		"SessionTokenId" : sessionTokenID,
		"REPORTHEADERID": reportheaderID //user ID 128557  //"REQUISITIONHEADERID": "266138" for user 143593      //"REQUISITIONHEADERID": "266079" for user 136772		
	};
	
	
	var object = {
        QueryIEDetailedInfoReq:_object
	};
	
	//ajax.open('POST', 'respose.json', true);
	ajax.open('POST',url, true); //Kawal change
	//ajax.open('POST','prdetail.json', true); 
	ajax.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
	ajax.setRequestHeader('Access-Control-Allow-Origin', '*');
	ajax.send(JSON.stringify(object));
	//alert(JSON.stringify(object));
	ajax.onreadystatechange = function() {
		_oonreadystatechange(ajax);
	}
	mainmask.mask({ xtype: 'loadmask',message:'' });
	// Ext.getCmp('rejectButton1').setDisabled(true);
           // Ext.getCmp('approveButton1').setDisabled(true);
			 var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
		    button1[0].disable();
			
	var _oonreadystatechange = function(ajax, optss) {
        //alert(ajax.status);
		 erdetailStore.removeAll();
		
		if (ajax.readyState == 4) {
			
			if (ajax.status == 200) {
                //alert('I am success');
                
				
				// Ext.getCmp('rejectButton1').setDisabled(false);
   	          //  Ext.getCmp('approveButton1').setDisabled(false);
				 var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
			    button1[0].enable();
                var data = JSON.parse(ajax.responseText);
                //console.log(data);
				
                if(data.QueryIEDetailedInfoRes.Status.Code==='200')
                {
                   
                    	
                    for ( var i = 0; i < data.QueryIEDetailedInfoRes.IEDetailedInfo.length; i++) 
                    {				
                                       
                       	
                    	var amountWithoutCommas;
                        amountWithoutCommas = data.QueryIEDetailedInfoRes.IEDetailedInfo[i].AMOUNT;
  		 
              amountWithoutCommas = parseFloat(amountWithoutCommas[0]).toFixed(2);
              //alert(amountWithoutCommas);
                amountWithoutCommas+= '';
                 var x = amountWithoutCommas.split('.');
                var x1 = x[0];
                var x2 = x.length > 1 ? '.' + x[1] : '';
               var rgx = /(\d+)(\d{3})/;
               while (rgx.test(x1)) {
                     x1 = x1.replace(rgx, '$1' + ',' + '$2');
                      }
							 //var amountWithCommas = x1 + x2+" " + amountWithoutCommas[1];
				 
				 
                        var currencycode = data.QueryIEDetailedInfoRes.IEDetailedInfo[i].CURRENCYCODE;
                        //var currencycode = 'USD';
                        var amountWithCommas =  currency[currencycode] + ' ' + x1 + x2;
                        
                        
                        erdetailStore.add(
                        {				
                            REPORTHEADERID:data.QueryIEDetailedInfoRes.IEDetailedInfo[i].REPORTHEADERID,
                            CURRENCYCODE: data.QueryIEDetailedInfoRes.IEDetailedInfo[i].CURRENCYCODE,
                            DESCRIPTION:commentellipses(data.QueryIEDetailedInfoRes.IEDetailedInfo[i].DESCRIPTION),
                            DISTRIBUTIONLINENUMBER:data.QueryIEDetailedInfoRes.IEDetailedInfo[i].DISTRIBUTIONLINENUMBER,
                            UNITPRICE:amountWithCommas,
                            JUSTIFICATION:data.QueryIEDetailedInfoRes.IEDetailedInfo[i].JUSTIFICATION,
                           // APPROVEDDATE:formatteddatefunction(data.QueryIEDetailedInfoRes.IEDetailedInfo[i].APPROVEDDATE),
                            GLACCOUNT:data.QueryIEDetailedInfoRes.IEDetailedInfo[i].GLACCOUNT,
                            NOTIFICATIONID:data.QueryIEDetailedInfoRes.IEDetailedInfo[i].NOTIFICATIONID
                        });
                    }
					 
                  console.log(erdetailStore);
                }else if(data.QueryPRHistoryRes.Status.Code=='401')  //Invaid Session due to session timeout
				{
					if (check_network() == 'No network connection'||check_network() == 'Unknown connection')
					{
						alert('No network connection');	
					}else{
					loginService(nameValue, passwordValue,url);
					ERpurchasedetail(url,localStorage.getItem('sessionToken'),selectedrecord.data.REQUISITIONHEADERID)
					}	
					
				}	
                mainmask.unmask();
			}  
			else if(ajax.status == '502'){
				Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
				// Ext.getCmp('rejectButton1').setDisabled(true);
   	           // Ext.getCmp('approveButton1').setDisabled(true);
				 var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
			    button1[0].enable();
				mainmask.unmask();
				
				
				}  else if(ajax.status == '0'){
				Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
				// Ext.getCmp('rejectButton1').setDisabled(true);
   	           // Ext.getCmp('approveButton1').setDisabled(true);
				 var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
			    button1[0].enable();
				mainmask.unmask();
				
				
				} 	
				else if(ajax.status == '404'){
					Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
				//	 Ext.getCmp('rejectButton1').setDisabled(true);
	   	        //    Ext.getCmp('approveButton1').setDisabled(true);
					 var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
				    button1[0].enable();
					mainmask.unmask();
					
					
					}
				else if(ajax.status == '500'){
					Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
				//	 Ext.getCmp('rejectButton1').setDisabled(true);
	   	         //   Ext.getCmp('approveButton1').setDisabled(true);
					 var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
				    button1[0].enable();
					mainmask.unmask();
					
					
					}
		}
	};
}

//added for approve and reject
function rejectRequest(obj){
    
    url = localStorage.getItem('urlValue');
    
	var ajax = new XMLHttpRequest();
	ajax.open('POST', url, true);
	ajax.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
	ajax.setRequestHeader('Access-Control-Allow-Origin', '*');
	ajax.send(JSON.stringify(obj));
	//alert(JSON.stringify(obj));
	ajax.onreadystatechange = function() {
		_oonreadystatechange(ajax);
	}
	mainmask.mask({ xtype: 'loadmask',message:'' });
	var _oonreadystatechange = function(ajax, optss) {
		
		if (ajax.readyState == '4') {
			if (ajax.status == '200') {
                var data = JSON.parse(ajax.responseText);
                if(data.PRRejectItemRes.Status.Code=='200')
                {
                    
                    console.log(data.NOTIFICATIONID);
                    console.log(data)
					if(selectedrecord.data.WORKTYPE=='PR'){
                    EmApprove
                    .transaction(function(transaction) {
                        transaction
						.executeSql(
                        "DELETE FROM worklist where NOTIFICATIONID=?",[data.NOTIFICATIONID],
                        function(transaction, results) {console.log(results);
                            worklistrequest_database(activetab);
                             PRworklistrequest_database();
                            
                            approvedOrNot=true;
                            mainex.pop();
                        },function(transaction, error) {
                            console.log(error.message);
                            
                        });
                    });
                    }
                    if(selectedrecord.data.WORKTYPE=='ER'){
                    	
                    EmApprove
                    .transaction(function(transaction) {
                        transaction
						.executeSql(
                        "DELETE FROM ERworklist where NOTIFICATIONID=?",[data.NOTIFICATIONID],
                        function(transaction, results) {console.log(results);
                            worklistrequest_database(activetab);
                           
					ERworklistrequest_database();
                            
                            approvedOrNot=true;
                            mainex.pop();
                        },function(transaction, error) {
                            console.log(error.message);
                            
                        });
                    });
                    }
                }
                else
                {
                    alert(data.PRRejectItemRes.Status.Text);
                   
                }
                mainmask.unmask();
			}  
			else if(ajax.status == '502'){
				Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
				
				mainmask.unmask();
				
				
				}  else if(ajax.status == '0'){
				Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
			
				mainmask.unmask();
				
				
				} 
				else if(ajax.status == '404'){
					Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
				
					mainmask.unmask();
					
					
					} 	
				else if(ajax.status == '500'){
					Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
				
					mainmask.unmask();
					
					
					} 	
		}
	};
}

function approveRequest(obj){
    //alert(obj);
    //approvedOrNot=true;
    url = localStorage.getItem('urlValue');
    
	var ajax = new XMLHttpRequest();
	ajax.open('POST', url , true);
	ajax.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
	ajax.setRequestHeader('Access-Control-Allow-Origin', '*');
	ajax.send(JSON.stringify(obj));
	
	ajax.onreadystatechange = function() {
		_oonreadystatechange(ajax);
	}
	mainmask.mask({ xtype: 'loadmask',message:'' });
	var _oonreadystatechange = function(ajax, optss) {
		
		if (ajax.readyState == '4') {
			if (ajax.status == '200') {
                var data = JSON.parse(ajax.responseText);
                console.log(data.NOTIFICATIONID);
				console.log(data)
				
                if(data.PRApproveItemRes.Status.Code=='200')
                {
                    
                    console.log(data.NOTIFICATIONID);
                    console.log(data)
                   if(selectedrecord.data.WORKTYPE=='PR'){
                    EmApprove
                    .transaction(function(transaction) {
                        transaction
						.executeSql(
                        "DELETE FROM worklist where NOTIFICATIONID=?",[data.NOTIFICATIONID],
                        function(transaction, results) {console.log(results);
                            worklistrequest_database(activetab);
                             PRworklistrequest_database();
                            approvedOrNot=true;
                            mainex.pop();
                            
                        },function(transaction, error) {
                            console.log(error.message);
                            
                        });
                    });
                    }
                    if(selectedrecord.data.WORKTYPE=='ER'){
                    EmApprove
                    .transaction(function(transaction) {
                        transaction
						.executeSql(
                        "DELETE FROM ERworklist where NOTIFICATIONID=?",[data.NOTIFICATIONID],
                        function(transaction, results) {console.log(results);
                            worklistrequest_database(activetab);
                           
					ERworklistrequest_database();
                            approvedOrNot=true;
                            mainex.pop();
                           
                        },function(transaction, error) {
                            console.log(error.message);
                            
                        });
                    });
                    }
                     
                   
                }
                else
                {
                    alert(data.PRApproveItemRes.Status.Text);
                   
                }
				 mainmask.unmask();
			}  
			else if(ajax.status == '502'){
				Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
				
				mainmask.unmask();
				
				
				}  else if(ajax.status == '0'){
				Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
				
				mainmask.unmask();
				
				
				} 
				else if(ajax.status == '404'){
					Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
				
					mainmask.unmask();
					
					
					} 	
				else if(ajax.status == '500'){
					Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
				
					mainmask.unmask();
					
					
					} 
		}
	};
}


function worklistrequest_database(string) {
 
    var ApproverEmployeeNumber = localStorage.getItem('userid');
    var queryString;
	 var rows =[];
                var row=null;
    if(string === 'Start Date')
    queryString = 'APPROVALREQUESTEDDATE';
    else
    queryString = 'APPROVALREQUESTEDBY';
	var query;
	if(localStorage.getItem('prontoggle')=="true"){
	query="SELECT * FROM worklist where APPROVEREMPLOYEENUMBER = " + ApproverEmployeeNumber+";" ;
	}
	if(localStorage.getItem('erontoggle')=="true"){
	query="SELECT * FROM ERworklist where APPROVEREMPLOYEENUMBER = " + ApproverEmployeeNumber+";" ;
	}
	if(localStorage.getItem('erontoggle')=="true"&&localStorage.getItem('prontoggle')=="true"){
	query="SELECT * FROM worklist UNION ALL SELECT * FROM ERworklist" ;
	}
	
	EmApprove
    .transaction(function(transaction) {
	
	 worklistStore.removeAll();
	
        transaction
        .executeSql(
        // "SELECT * FROM worklist where APPROVEREMPLOYEENUMBER = " + ApproverEmployeeNumber + " order by    substr("+queryString+",7) ||substr("+queryString+",4,2)||substr("+queryString+",1,2)"+ " desc;",
        query ,	
        
        [],
        
        function(transaction, results) {
           
            if (results.rows.length != 0) {
               
                //worklistStore.removeAll();
                for ( var i = 0; i < results.rows.length; i++) {
                    row = results.rows.item(i);
                    console.log(results.rows.item(i)['IEXPENSENUMBER']);
                    rows.push({
                        "APPROVALREQUESTEDDATE_sort": new Date(results.rows.item(i).APPROVALREQUESTEDDATE),
                        
                        "APPROVALREQUESTEDBY_sort": new Date(results.rows.item(i).APPROVALREQUESTEDBY),
                        
                        
                        "RECORDHEADERID":results.rows.item(i)['RECORDHEADERID'],
                        "FROMUSER": results.rows.item(i)['FROMUSER'],
                        "NOTIFICATIONID":results.rows.item(i)['NOTIFICATIONID'],
                        "DESCRIPTION":commentellipses(results.rows.item(i)['DESCRIPTION']),
                        "Amount":results.rows.item(i)['Amount'],
                        "APPROVALREQUESTEDDATE":results.rows.item(i)['APPROVALREQUESTEDDATE'],
                        "MESSAGENAME":results.rows.item(i)['MESSAGENAME'],
                        "APPROVALREQUESTEDBY":results.rows.item(i)['APPROVALREQUESTEDBY'],
                        "APPROVEREMPLOYEENUMBER":results.rows.item(i)['APPROVEREMPLOYEENUMBER'],
                        "REQUISITIONNUMBER":results.rows.item(i)['REQUISITIONNUMBER'],
                        "FULLAPPROVALREQUESTEDDATE":formatteddatefunction(results.rows.item(i)['APPROVALREQUESTEDDATE']),
                        "FULLAPPROVALREQUESTEDBY":formatteddatefunction(results.rows.item(i)['APPROVALREQUESTEDBY']),
                        "WORKTYPE":results.rows.item(i)['WORKTYPE'],
                        "RECORDNUMBER":results.rows.item(i)['RECORDNUMBER'],
                        "INDIVIDUALSCOSTCENTER":results.rows.item(i)['INDIVIDUALSCOSTCENTER'],
                    });
                }
                rows.sort(function (a, b) {
                    if(string === 'Start Date'){
                        var ascending = b.APPROVALREQUESTEDDATE_sort.getTime() - a.APPROVALREQUESTEDDATE_sort.getTime();
                        // descending = b.APPROVALREQUESTEDDATE_sort.getTime() - a.APPROVALREQUESTEDDATE_sort.getTime();
                    }else{
                        var ascending = b.APPROVALREQUESTEDBY_sort.getTime() - a.APPROVALREQUESTEDBY_sort.getTime();
                        // descending = b.APPROVALREQUESTEDBY_sort.getTime() - a.APPROVALREQUESTEDBY_sort.getTime();
                    }
                    return ascending;
                });
                console.log(rows);
                for ( var i = 0; i < rows.length; i++) {
                    row = rows[i];
                    //console.log('I am at DB model ' +row['APPROVALREQUESTEDDATE']);
                    //console.log(formatteddatefunction(row['APPROVALREQUESTEDDATE']));
					var RESPCTIVEDESCRIPTION="";
					console.log(row['WORKTYPE']);
                   if(row['WORKTYPE']=='PR'){
	                      RESPCTIVEDESCRIPTION="PR for "+row['DESCRIPTION'];
	                             }
	               if(row['WORKTYPE']=='ER'){
	                       RESPCTIVEDESCRIPTION="IE for "+row['DESCRIPTION'];
	                             }                    
                   
				   worklistStore
                    .add({
                        TID:row['TID'],
                        RECORDHEADERID:row['RECORDHEADERID'],
                        FROMUSER: row['FROMUSER'],
                        NOTIFICATIONID:row['NOTIFICATIONID'],
                        DESCRIPTION:commentellipses(row['DESCRIPTION']),
						RESPCTIVEDESCRIPTION:RESPCTIVEDESCRIPTION,
                        Amount:row['Amount'],
                        APPROVALREQUESTEDDATE:worklistdatefunction(row['APPROVALREQUESTEDDATE']),
                        MESSAGENAME:row['MESSAGENAME'],
                        APPROVALREQUESTEDBY:worklistdatefunction(row['APPROVALREQUESTEDBY']),
                        APPROVEREMPLOYEENUMBER:row['APPROVEREMPLOYEENUMBER'],
                        //REQUISITIONNUMBER:row['REQUISITIONNUMBER'],
                        FULLAPPROVALREQUESTEDDATE:formatteddatefunction(row['APPROVALREQUESTEDDATE']),
                        FULLAPPROVALREQUESTEDBY:formatteddatefunction(row['APPROVALREQUESTEDBY']),
						WORKTYPE:row['WORKTYPE'],
						RECORDNUMBER:row['RECORDNUMBER'],
						INDIVIDUALSCOSTCENTER:row['INDIVIDUALSCOSTCENTER'],
                    });
                }
                
            }
            console.log(worklistStore);	
            if(worklistStore.getCount()==0){
                
                alert('No approvals pending');
                
            }else{
                
            }
            autorefresh();
        }, function(transaction, error) {
            console.log(error.message);
            
        });
		
    });
    //checkTables();
	
	
}

function PRworklistrequest_database() {
    //alert(ispr_shown);
    var ApproverEmployeeNumber = localStorage.getItem('userid');
    var queryString;
	 var rows =[];
                var row=null;
    
	var query;
	//alert(Ext.getCmp('pr').getValue());
	if(localStorage.getItem('prontoggle')=="true"){
	query="SELECT * FROM worklist where APPROVEREMPLOYEENUMBER = " + ApproverEmployeeNumber+";" ;
	}
	
	
	
	EmApprove
    .transaction(function(transaction) {
 PRworklistStore.removeAll();
        transaction
        .executeSql(
        // "SELECT * FROM worklist where APPROVEREMPLOYEENUMBER = " + ApproverEmployeeNumber + " order by    substr("+queryString+",7) ||substr("+queryString+",4,2)||substr("+queryString+",1,2)"+ " desc;",
        query ,	
        
        [],
        
        function(transaction, results) {
           
            if (results.rows.length != 0) {
               
                //worklistStore.removeAll();
                for ( var i = 0; i < results.rows.length; i++) {
                    row = results.rows.item(i);
                   console.log(row['DESCRIPTION']);
				   
					var RESPCTIVEDESCRIPTION="";
					console.log(row['WORKTYPE']);
                   if(row['WORKTYPE']=='PR'){
	                      RESPCTIVEDESCRIPTION="PR for "+row['DESCRIPTION'];
	                             }
	               if(row['WORKTYPE']=='ER'){
	                       RESPCTIVEDESCRIPTION="IE for "+row['DESCRIPTION'];
	                             }                    
				   
				   PRworklistStore
                    .add({
                        TID:row['Tid'],
                        RECORDHEADERID:row['RECORDHEADERID'],
                        FROMUSER: row['FROMUSER'],
                        NOTIFICATIONID:row['NOTIFICATIONID'],
                        //RESPCTIVEDESCRIPTION:commentellipses(row['DESCRIPTION']),
						DESCRIPTION:commentellipses(row['DESCRIPTION']),
						RESPCTIVEDESCRIPTION:RESPCTIVEDESCRIPTION,
                        Amount:row['Amount'],
                        APPROVALREQUESTEDDATE:worklistdatefunction(row['APPROVALREQUESTEDDATE']),
                        MESSAGENAME:row['MESSAGENAME'],
                        APPROVALREQUESTEDBY:worklistdatefunction(row['APPROVALREQUESTEDBY']),
                        APPROVEREMPLOYEENUMBER:row['APPROVEREMPLOYEENUMBER'],
                        RECORDNUMBER:row['RECORDNUMBER'],
                        FULLAPPROVALREQUESTEDDATE:formatteddatefunction(row['APPROVALREQUESTEDDATE']),
                        FULLAPPROVALREQUESTEDBY:formatteddatefunction(row['APPROVALREQUESTEDBY']),
                        WORKTYPE:'PR',
						
					}); 
                }
   
            }
            console.log(PRworklistStore);
            
            if (!this.PurchaseRequisition) {
                this.PurchaseRequisition = Ext.getCmp('ext-container-8');
            }
           
            if(PRworklistStore.getCount()==0){
                this.PurchaseRequisition.hide();
                ispr_shown = false;
            	alert('No approvals pending in PR');
            }else{
        		this.PurchaseRequisition.show();
        		Ext.getCmp('ext-titlebar-3').addCls('subtoolbar_category');
        		ispr_shown = true;  
Ext.getCmp('categorybadge3').setBadgeText(PRworklistStore.getCount());				
            }

           
        }, function(transaction, error) {
            console.log(error.message);
            
        });
		
    });
    //checkTables();
	
}

function ERworklistrequest_database() {
    //alert(ispr_shown);
    var ApproverEmployeeNumber = localStorage.getItem('userid');
    var queryString;
	 var rows =[];
                var row=null;
    
	var query;
	if(localStorage.getItem('erontoggle')=="true"){
	query="SELECT * FROM ERworklist where APPROVEREMPLOYEENUMBER = " + ApproverEmployeeNumber+";";
	}
	
	
	
	EmApprove
    .transaction(function(transaction) {
 ERworklistStore.removeAll();
        transaction
        .executeSql(
        // "SELECT * FROM worklist where APPROVEREMPLOYEENUMBER = " + ApproverEmployeeNumber + " order by    substr("+queryString+",7) ||substr("+queryString+",4,2)||substr("+queryString+",1,2)"+ " desc;",
        query ,	
        
        [],
        
        function(transaction, results) {
           
            if (results.rows.length != 0) {
               
                //worklistStore.removeAll();
                for ( var i = 0; i < results.rows.length; i++) {
                    row = results.rows.item(i);
                   console.log(row['DESCRIPTION']);
				   
					var RESPCTIVEDESCRIPTION="";
					console.log(row['WORKTYPE']);
                   if(row['WORKTYPE']=='PR'){
	                      RESPCTIVEDESCRIPTION="PR for "+row['DESCRIPTION'];
	                             }
	               if(row['WORKTYPE']=='ER'){
	                       RESPCTIVEDESCRIPTION="IE for "+row['DESCRIPTION'];
	                             }                    
				   
				   ERworklistStore
                    .add({
                        TID:row['Tid'],
                        RECORDHEADERID:row['RECORDHEADERID'],
                        FROMUSER: row['FROMUSER'],
                        NOTIFICATIONID:row['NOTIFICATIONID'],
						DESCRIPTION:commentellipses(row['DESCRIPTION']),
                        RESPCTIVEDESCRIPTION:RESPCTIVEDESCRIPTION,
                        Amount:row['Amount'],
                        APPROVALREQUESTEDDATE:worklistdatefunction(row['APPROVALREQUESTEDDATE']),
                        STATUS:row['STATUS'],
						INDIVIDUALSCOSTCENTER:row['INDIVIDUALSCOSTCENTER'],
                        APPROVALREQUESTEDBY:worklistdatefunction(row['APPROVALREQUESTEDBY']),
                        APPROVEREMPLOYEENUMBER:row['APPROVEREMPLOYEENUMBER'],
                        RECORDNUMBER:row['RECORDNUMBER'],
                        FULLAPPROVALREQUESTEDDATE:formatteddatefunction(row['APPROVALREQUESTEDDATE']),
                        FULLAPPROVALREQUESTEDBY:formatteddatefunction(row['APPROVALREQUESTEDBY']),
                        WORKTYPE:'ER',
					}); 
                }
   
            }
              console.log(ERworklistStore);
            
            if (!this.ExpenseReport) {
                this.ExpenseReport = Ext.getCmp('ext-container-2');
            }
            	
            if(ERworklistStore.getCount()==0){
            	this.ExpenseReport.hide();
            	iser_shown = false;
                alert('No approvals pending in IE');
                
            }else{
        		this.ExpenseReport.show();
        		Ext.getCmp('ext-titlebar-1').addCls('subtoolbar_category');
        		iser_shown = true;
				Ext.getCmp('categorybadge1').setBadgeText(ERworklistStore.getCount());
            }
           
        }, function(transaction, error) {
            console.log(error.message);
            
        });
		
    });
    //checkTables();
	
}
function formatteddatefunction(dates){
    var datearray=[];
    datearray=dates.split(" ");
    var formatteddate=datearray[1]+" "+datearray[2]+", "+datearray[3];	
    //console.log(formatteddate);	
    return formatteddate;
    
    
}	

function worklistdatefunction(dates){
    var datearray=[];
    //alert("workklist");
    datearray=dates.split(" ");
    var formatteddate=datearray[1]+" "+datearray[2];	
    //console.log(formatteddate);	
    return formatteddate;
    
    
}	

function checkTables(){
    EmApprove
    .transaction(function(transaction) {
        transaction
        .executeSql(
        "SELECT * FROM worklist ;",
        [],
        function(transaction, results) {
            
            if(results.rows.length!=0){
                tabselection=true;
                console.log(tabselection);
				ispr_shown=true;
			 
				
				
                Ext.getCmp('mytabsview').setActiveItem(0);
                
                
            }
            else
            {
			  
                if(localStorage.getItem('prontoggle')==null||localStorage.getItem('prontoggle')=='null'||localStorage.getItem('prontoggle')==''){
				
				localStorage.setItem('prontoggle',false);
				localStorage.setItem('erontoggle',false);
				
				}
                bar = Ext.getCmp('mainview').getNavigationBar();
                bar.titleComponent.setTitle("More");
                
            }
            
        },
        function(transaction, error) {
            console.log(error.message);
            
        });
    });
	
	EmApprove
    .transaction(function(transaction) {
        transaction
        .executeSql(
        "SELECT * FROM ERworklist ;",
        [],
        function(transaction, results) {
            
            if(results.rows.length!=0){
                
				
				iser_shown=true;
				
				//Ext.getCmp('expense').setValue(1);
                Ext.getCmp('mytabsview').setActiveItem(0);
                
                
            }
            else
            {
                
                bar = Ext.getCmp('mainview').getNavigationBar();
                bar.titleComponent.setTitle("More");
                
            }
            
        },
        function(transaction, error) {
            console.log(error.message);
            
        });
    });
    
}

function commentellipses(comments)
{
   
    
	
   
    if(comments.length>40)
    {
               
        var str1=comments.substring(0,40)+"...";
        return str1;
    }
    else
    {
        return comments;
    }
}

//endsss