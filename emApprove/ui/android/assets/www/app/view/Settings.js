Ext.define('eaApprove.view.Settings', {
    extend: 'Ext.Container',
	requires:['Ext.Panel',
	'Ext.MessageBox',
	],
    xtype: 'settings',
	//id:'settingsbackground',
config:{
        title: 'Settings',
        
        styleHtmlContent: true,
		scrollable: {
        direction: 'vertical'
    },

    layout:{
        type: 'vbox',

        },
	
    items: [
	
	
        {
		
       xtype: 'panel',
	   cls:'loginformpanel',
	   style : 'font-size:16px;',
       //iconCls: 'add',
		
					items : [
								{
								id:'user title',
								html:'<div id="worklistSet">User Credentials</div>'
								},
								{
								   layout:{
								     type:'hbox',
								     align:'stretch'
								   },
								 items:[
								 {
								 
								 html:'<div id="userlabel">Username</div>'
								 
								 },
								 
								 
								 {
									xtype : 'textfield',
									id : 'username',
									cls:'username',
									
									//value:'131329',
									value:'EAMailAddress',
									maxLength:'50',
									
									clearIcon:false,
									//placeHolder:'EAMailAddress',
									
									}
									]
								},
								{
									layout:{
								     type:'hbox',
								     align:'stretch'
								   },
								 items:[
								 {
								 
								 html:'<div id="userlabel">Password</div>'
								 
								 },
									
									
									{xtype : 'passwordfield',
									name : 'password',
									id : 'password',
									//label : 'Password',
									value:'Welcome',
									maxLength:'20',
									//labelWidth: '54%',
									clearIcon:false,
									//placeHolder:'******'
									}
									]
								},
								{	/*layout:{
								     type:'hbox',
								     align:'stretch'
								   },
								 items:[
								 {
								 
								 html:'<div id="userlabel">Sign-On</div>'
								 
								 },{*/xtype: 'togglefield',
								    //cls : 'rightAligned',
									name: 'signon',
									labelWidth: '52%',
									label:'Sign-On',
									id:'toggle1',
									listeners: {
							
								 change: function(field, thumb, enabled,newValue,oldValue) {
							
								 if(newValue ===1){
								 this.fireEvent('onmyclick', this);
								
								 }
								 else{
								  this.fireEvent('onLogout', this);
								
								 }
								}
								 }
								/* }
								 ]*/
								
								
								},
								{
								
								 html:'<div id="loginstatus" class="loginstatus">LOGGED OFF </div>'
								},
															
								]
		},
		
		
		{
		
       xtype: 'panel',
	   cls:'loginformpanel1',
       //iconCls: 'add',
		
					items : [
								{
								
								 html:'<div id="worklistSet"> Worklist</div>'
								},
								
								
								
								{	
								   /*layout:{
								     type:'hbox',
								     align:'stretch'
								   },
								   style:'margin-top: -2%;',
								 items:[
								 {
								 
								 html:'<div id="prlabel">Purchase Requisition</div>'
								 
								 },{*/
								
								
								    xtype: 'togglefield',
							       	//cls : 'rightAligned',
									name: 'pr',
									id:'pr',
									label: 'Purchase Requisition',
									labelWidth: '52%',
									
									//disabled:'true',
									//top:'10%',
									//cls : 'x-toggle',	
									listeners: {
										 change: function(field, thumb, enabled,newValue,oldValue) {
										
										 if(newValue ===1){
											
										    this.fireEvent('showpurchaserequisition', this);
										 }
										 else {
										  
											 this.fireEvent('hidepurchaserequisition', this);
										 }
										
										}
										
										
										}	,
                                  /*  }
                                  ],	*/								
								},
								{	
								   /* layout:{
								     type:'hbox',
								     align:'stretch'
								   },
								   style:'margin-top: -2%;',
								 items:[
								 {
								 
								 html:'<div id="prlabel">Expense Reports</div>'
								 
								 },{*/
								
								
								    xtype: 'togglefield',
									//cls : 'rightAligned',
									name: 'expense',
									id:'expense',
									label: 'Expense Reports',
									//disabled:'true',
									labelWidth: '52%',
									
									listeners: {
										 change: function(field, thumb, enabled,newValue,oldValue) {
										 if(newValue ===1){
										  
											 this.fireEvent('showexpensereport', this);
										 }
										 else{
										  
											 this.fireEvent('hideexpensereport', this);
										 }
										}
										
										
										}	
                                   /* },
                                   ]	*/								
									
								},
								{	
								 /* layout:{
								     type:'hbox',
								     align:'stretch'
								   },
								   style:'margin-top: -2%;',
								 items:[
								 {
								 
								 html:'<div id="prlabel">Journal Entry</div>'
								 
								 },{*/
								
								    xtype: 'togglefield',
									//cls : 'rightAligned',
									name: 'po',
									id:'po',
									label: 'Journal Entry',
									disabled:'true',
									labelWidth: '52%',
									listeners: {
										 change: function(field, thumb, enabled,newValue,oldValue) {
										 if(newValue ===1){
											 this.fireEvent('showpurchaseorder', this);
										 }
										 else{
											 this.fireEvent('hidepurchaseorder', this);
										 }
										}
										
										
										}	
                                   /*  },
                                    ]	*/								 
									
								},
								{	
								   /* layout:{
								     type:'hbox',
								     align:'stretch'
								   },
								   style:'margin-top: -2%;',
								 items:[
								 {
								 
								 html:'<div id="prlabel">Claims</div>'
								 
								 },{*/
								
								    xtype: 'togglefield',
									//cls : 'rightAligned',
									name: 'cl',
									id:'cl',
									label: 'Claims',
									disabled:'true',
									labelWidth: '52%',
									listeners: {
									
										 change: function(field, thumb, enabled,newValue,oldValue) {
										 if(newValue ===1){
											 this.fireEvent('showpurchaseorder', this);
										 }
										 else{
											 this.fireEvent('hidepurchaseorder', this);
										 }
										}
										
										
										},
                                  /*  }
                                   ]	*/								
									
								},
								{
								  html:'<div class="urlclass">Endpoint URL</div>'
								},
								{
									xtype : 'textfield',																	
									id : 'url',
									label : '',														
									labelWidth: '50%',
                                    clearIcon:false,									
									value:'http://entmobilityts.ea.com:8888/ea-erp',		
                                    //value:'http://10.226.112.12:80/ea-erp',
									//value:'http://10.232.155.69:8888/ea-erp',
									//value:'http://10.255.56.102:888/ea-erp',
									
									maxLength:77,
									/*listeners : 
									{
										focus : function() 
										{								
											Ext.getCmp('cmsoverlay').show();
										}
									},*/

									
									
								},
								]
		},
		
       
								
		/*{	
			xtype:'panel',
			floating : true,
			//scroll: 'vertical',
			modal : true,
			cls: 'bodyformpanel',
			centered : true,
			pack : 'center',
			id : 'cmsoverlay',
		//	styleHtmlContent : true,
			hidden:true,
			hideOnMaskTap : true,	
			items : [
			{
			xtype:'textfield',
			id:'textfieldurl',
			}
			]
		},*/
    ]},		

    updateRecord: function(newRecord) 
	{
        if (newRecord) {
            this.down('#content').setData(newRecord.data);
			this.down('#textbox').setData(newRecord.data);
			//this.down('#content2').setData(newRecord.data);

         
        }
    },
	
	initialize: function() 
	{	
       	 this.on('painted', this.setUsername);       
    },
		 
	setUsername: function() 
	{	//alert("hiiiii");
		//alert('Setusername ' + localStorage.getItem('username'));
		
		
		if((localStorage.getItem('username') == null) || (localStorage.getItem('username') == '') || (localStorage.getItem('password') == '') || (localStorage.getItem('urlValue')) == '')
		{
			Ext.getCmp('username').setValue('EA email address');
		}
		else
		{
				
			Ext.getCmp('username').setValue(localStorage.getItem('username'));
			Ext.getCmp('password').setValue(localStorage.getItem('password'));
			Ext.getCmp('url').setValue(localStorage.getItem('urlValue'));		
			
			if(signontoggle){
			Ext.getCmp('toggle1').setValue(1);
			document.getElementById('loginstatus').innerHTML="LOGGED ON";
			}
		
			if(localStorage.getItem('prontoggle')=="true"){
		
			Ext.getCmp('pr').setValue(1);
			
			}else{
			Ext.getCmp('pr').setValue(0);
			}
			
			if(localStorage.getItem('erontoggle')=="true"){
			
			Ext.getCmp('expense').setValue(1);
			
			}else{
			Ext.getCmp('expense').setValue(0);
			}
		
	    }
		bar = Ext.getCmp('mainview').getNavigationBar();
    		   bar.setDefaultBackButtonText('Back');
		
	}
});


