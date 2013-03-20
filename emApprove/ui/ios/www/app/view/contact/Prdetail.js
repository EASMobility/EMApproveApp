
 Ext.define('eaApprove.view.contact.Prdetail', {
    extend: 'Ext.Container',
    xtype: 'prdetail',
    title:'Requisition Items',
	
    config: {
	title: '',
	width:'100%',
height:'85%',
	items:[
	  
	{ xtype:'toolbar',
		 height:'2.0em',
		  docked:'top',
		 cls:'subtoolbar',
		 id:'prdetailhid',
		 title: {
                            title: '',
                            style: {
                                'text-align': 'center',
								'font-size': '1.0em',
								
                            }
                        },
		
		
						
                    },
	{
        xtype:'list',
		//cls: 'x-show-prdetails',
		id:'prlistview',
        store: 'Prdetails',
		
		//height: '81%',
         itemTpl: [
             '<div class="dotformat"><b>{ITEMDESCRIPTION}</b></div><div class="prdetailfont4">Qty: {QUANTITY}, Unit Price: {UNITPRICE} USD</div>'
			 
        ].join('') 
    },
	{
        xtype:'list',
		//cls: 'x-show-prdetails',
		id:'erlistview',
        store: 'Erdetails',
		
		//height: '81%',
         itemTpl: [
             '<div class="prdetailfont5"><b>Amount: {UNITPRICE}</b></div><div class="dotformat">{DESCRIPTION}</div><div class="prdetailfont5">Justification:{JUSTIFICATION}</div><div class="hyphenate">GL:{GLACCOUNT}</div>'
			 
        ].join('') 
    },
	 {
	
	//docked:'bottom',
	xtype:'toolbar',
	cls:'toolbar',
	docked:'bottom',
	items:[{
	xtype:'button',
			
			text:'Approve',
			ui:'confirm',
			id:'approveButton1',
			cls:'approveButton',
			handler:function(){
			buttonfinder="approve";
			var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
			button1[0].disable();
			this.fireEvent('onApproveClick', this);
		}
	},
	{xtype:'spacer'},
			{xtype:'button',
			ui:'decline',
			text:'Reject',
			id:'rejectButton1',
			cls:'rejectButton',
			handler:function(){
			buttonfinder="reject";
			var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
			button1[0].disable();
			this.fireEvent('onRejectClick', this);
			},
			},
			//endssss
			/* {xtype:'spacer'},
			{xtype:'button',
			ui:'action',
			cls:'requestinfo',
			text:'Request More Info',
			} */
	
	] 
	} ,
	
	
	
	],},
     
	initialize: function() {
 	 	
    				
    	 this.on('painted', this.setprlistformat);       
    	 },
	setprlistformat: function() {
	    
	     if(selectedrecord.data.WORKTYPE=='PR'){	
		  Ext.getCmp('prdetailhid').setTitle("Purchase Requisition Details");
	        Ext.getCmp('erlistview').setHidden(true);
			Ext.getCmp('prlistview').setHidden(false);
	       }
	      if(selectedrecord.data.WORKTYPE=='ER'){
	     Ext.getCmp('prdetailhid').setTitle("Expense Report Details");
		    Ext.getCmp('prlistview').setHidden(true);
			Ext.getCmp('erlistview').setHidden(false);
		   }
	},
	 
});