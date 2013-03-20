Ext.define("eaApprove.view.contact.RejectCmts", {
extend: 'Ext.Container',
xtype: 'rejectWithComments',
id: 'rejectWithComments',

 requires: [
	    
		
        ],

config: {
	 
	
		        layout:{
				                type:'hbox',
				                align:'stretch'
				                
	                },
	                
	                items: [{docked: 'top',
            			 xtype: 'toolbar',
            			
            			 title: 'Comments',
            			 align: 'center',
            			
            			 items:[
						  {
						    xtype:'spacer',
						 
						 },
						 {
						    xtype:'spacer',
						 
						 },
            		 {
				        xtype: 'button',
				        text: 'Done',
						id:'rejectDoneButton',
				      
				       
						handler:function(){
						this.fireEvent('onRejectDoneClick', this);
							Ext.getCmp('mainview').getNavigationBar().show();
						Ext.getCmp('rejectWithComments').hide();
						}
				       
				        }
				 	         
            			 ]
            			 
            			 },
            			 { 
                    		  xtype: 'textareafield',
                    		 // label: 'Comments',
							 id:'rejectText',
                              height:'100%',
                              width: '100%',
				 },
            			 
	                 	]

	 


	},
		
     listeners: {
                
		}
});