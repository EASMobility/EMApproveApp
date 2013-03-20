Ext.define("eaApprove.view.contact.ReportItems", {
extend: 'Ext.Panel',
xtype: 'reportItemsView',
id: 'reportItemsView',


 requires: [
	    'eaApprove.view.contact.ApproveCmts'
		
        ],

config: {
	   top: '75',
	 
	 floating: true,
modal: true,
	 
	
	  baseCls: 'x-report-background',
	 
		       
	                
	                items: [
					{
                        html:'<div class="Approvecls">Approve</div>',
						
                    },
					{
                        html:'<div class="actioncls">Are you sure you wish to Approve this item?</div>',
						
                    },
            			
            			 { 
            			 	   xtype: 'button',
							  text: 'Approve',
					  id:'approveMainButton',		   
				 	    cls:'subbutton',
				 	 // height:'40',
					  //align: 'center',
				 	 // width: '360',
				 	   //ui: 'round',
				 	 
				 	   
				 	    handler:function(){
				 	    	if (check_network() == 'No network connection'||check_network() == 'Unknown connection')
							{
								alert('No network connection');	
							}else{  
				this.fireEvent('onApproveMainClick', this);
				Ext.getCmp('mainview').getNavigationBar().disable();
						//console.log(Ext.getCmp('mainview'));
						 var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
			//alert(button1);
			button1[0].enable();
			                 	
							  Ext.getCmp('reportItemsView').hide();	 
							    }
							 }
				 	  }, 
					  
					  {
				 	         xtype: 'button',
							  text: 'Approve With Comments',
							 id:'approveCommentButton',
							 cls:'subbutton',
				 	      // height:'40',
				 	      //  width: '360',
				 	         //ui: 'round',
							 handler:function(){
							  
				this.fireEvent('onApproveCommentsClick', this);
						//console.log(Ext.getCmp('mainview'));
						//alert("hiiiiii");
						Ext.getCmp('approveText').setValue(' ');
						 var button2 = Ext.getCmp('mainview').getNavigationBar().query('button');
			//alert(button2);
			button2[0].enable();
			    buttonfinder="approve";            		
							  Ext.getCmp('reportItemsView').hide();	 
							 
							 }
				                 },	
								 
								 
								 {
				 	         xtype: 'button',
				 	         text: 'Cancel',
							id:'appcancel',
							cls:'subbuttoncancel',
				 	        //height:'40',
				 	      // width: '360',
				 	        // ui: 'round',
							 handler:function(){
							var button4 = Ext.getCmp('mainview').getNavigationBar().query('button');
			//alert(button4);
			button4[0].enable();
                            			
							 Ext.getCmp('reportItemsView').hide();
							
							// Ext.getCmp('mainview').getNavigationBar().enable();
							 
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