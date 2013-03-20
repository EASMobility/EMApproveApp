Ext.define("eaApprove.view.contact.ReportItemsReject", {
extend: 'Ext.Panel',
xtype: 'reportItemsViewReject',
id: 'reportItemsViewReject',

 requires: [
	    'eaApprove.view.contact.RejectCmts'
		
        ],

config: {
	 
	  top: '140',
	 
	 floating: true,
modal: true,
	 
	
	  baseCls: 'x-report-background',
	                
	                items: [
            			{
                        html:'<div class="Approvecls">Reject</div>',
						
                    },
					{
                        html:'<div class="actioncls">Are you sure you wish to Reject this item?</div>',
						
                    },
            			 { 
            			 	   xtype: 'button',
				 	   text: 'Reject',
					   id:'rejectMainButton',
					   cls:'subbutton',
				 	  // height:'40',
				 	 //  width: '360',
				 	  // ui: 'round',
				 	 
				 	   
				 	   handler:function(){
				 		  if (check_network() == 'No network connection'||check_network() == 'Unknown connection')
							{
								alert('No network connection');	
							}else{			  
				this.fireEvent('onRejectMainClick', this);
						//console.log(Ext.getCmp('mainview'));
							var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
							button1[0].enable();	
							  Ext.getCmp('reportItemsViewReject').hide();
												  
							    }
							}
				 	  }, 
					  {
				 	         xtype: 'button',
							  text: 'Reject With Comments',
							 id:'approveCommentButton1',
				 	      cls:'subbutton',
				 	      //  width: '360',
				 	         //ui: 'round',
							 handler:function(){
							  
				this.fireEvent('onApproveCommentsClick', this);
				Ext.getCmp('approveText').setValue(' ');
						var button2 = Ext.getCmp('mainview').getNavigationBar().query('button');
			
			button2[0].enable();
			buttonfinder="reject";
							  Ext.getCmp('reportItemsViewReject').hide();	 
							  
							  
							 }
				                 }, 
								 {
				 	         xtype: 'button',
				 	         text: 'Cancel',
				 	       cls:'subbuttoncancel',
				 	       //  width: '360',
				 	        // ui: 'round',
							 handler:function(){
							 var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
							button1[0].enable();
							 Ext.getCmp('reportItemsViewReject').hide();
								
							 }
				 	         
				 	         },
							  {
							 html:'<div style="height:10px;"><br></div>',
							 
							 }
				 	         
	                 	]

	 


	},
		
     listeners: {
                
		}
});