Ext.define("eaApprove.view.contact.ApproveCmts", {
extend: 'Ext.Container',
xtype: 'approveWithComments',
id: 'approveWithComments',

 requires: [
	    
		
        ],

config: {
	 
	  top: '0',
	  left: '0',
	  height:'100%',
	  width:'100%',
	  //baseCls: 'x-report-background',
	  border: '0',
		        layout:{
				                type:'hbox',
				                align:'stretch'
				                
	                },
	                
	                items: [{docked: 'top',
            			 xtype: 'toolbar',
            			 title: 'Comments',
            			 align: 'center',
            			 //style: 'background-color:black',
            			 items:[
						 {
				        xtype: 'button',
				        text: 'Back',
						ui:'back',
						//id:'approveDoneButton',
				        
						
						handler:function(){
					
							Ext.getCmp('mainview').getNavigationBar().show();
						Ext.getCmp('approveWithComments').hide();
						}
				       
				        },
						 {
						    xtype:'spacer',
						 
						 },
            			 ] // items inside toolbar
            			 
            			 }, // toolbar
						 {
							xtype: 'panel',
							id:'bluebackground',
							cls:'commentsbluebackground',
							height:'100%',
							width:'100%',
            			 items:[{ 
                    		  xtype: 'textareafield',
                    		 // label: 'Comments',
							 id:'approveText',
                             height:'100%',
							maxLength:'200',
                              width: '100%',
							  clearIcon:false,
				 },// comments
				 
				             		 {
				        xtype: 'button',
				        text: 'Submit',
						id:'approveDoneButton',
						top: '214px',
						width: '135px',
						left: '109px',
						handler:function(){
						
						if (check_network() == 'No network connection'||check_network() == 'Unknown connection')
						{
							alert('No network connection');	
						}else{
							this.fireEvent('onApproveDoneClick', this);
							Ext.getCmp('mainview').getNavigationBar().show();
							Ext.getCmp('approveWithComments').hide();	
						} //else
						
						} // handler
				       
				        } // xtype

				 
				 
						 ],
						 
						 },// bluebackground panel
						 
						 
            			 
	                 	] // very 1st items variable

	 


	}, // config
		
     listeners: {
                
		}
});