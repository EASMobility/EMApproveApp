Ext.define('eaApprove.view.contact.History', {
    extend: 'Ext.Container',
    xtype: 'historys',
	
    config: {
	title:'Worklist',
	width:'100%',
height:'85%',
	items:[
	
		 {
		 xtype:'toolbar',
		 height:'2.0em',
		 docked:'top',
		 cls:'subtoolbar',
		 id:'detailhid',
		 title: {
                            title: '',
                            style: {
                                'text-align': 'center',
								'font-size': '1.0em',
								
                            }
                        },
		
		
						
                    },
			{
                        xtype: 'title',
						//height:"2%",
						id:'historylist',
						title: '',
						cls:'historyemptyfont'
                    },
		{
		xtype:'list',
		//height: '81%', //height: '80%',
        //cls: 'x-show-prdetails',
        store: 'Historys',
		id:'prhistoryview',
		cls:'historybody',
		
         itemTpl: [
		   /* '<div > <b class="sideheadfont">Approved by:</b>  {REQUESTOR}  </div>',
			 '<div > <b class="sideheadfont">Approved Date:</b>  {APPROVALREQUESTEDDATE}   </div>',
			 '<div > <b class="sideheadfont">Comments:</b>  ApprovalComments </div>'  */
			 '<div><table width="100%"  cellspacing="1"><tbody><tr><td  width="40%" valign="top"  class="sideheadfont">Approved By </td><td class="sidebody">{TOUSER}</td></tr><tr><td  width="40%"  valign="top"  class="sideheadfont">Approved Date</td><td class="sidebody">{APPROVEDDATE}</td></tr><tr><td  width="40%"  valign="top"  class="sideheadfont">Comments </td><td class="sidebodycomments">{DESCRIPTION} </td></tr></tbody></table></div>'
        ].join('') 
		},
		{
		xtype:'list',
		//height: '81%', //height: '80%',
        //cls: 'x-show-prdetails',
        store: 'ERhistorys',
		id:'erhistoryview',
		cls:'historybody',
		
         itemTpl: [
		   /* '<div > <b class="sideheadfont">Approved by:</b>  {REQUESTOR}  </div>',
			 '<div > <b class="sideheadfont">Approved Date:</b>  {APPROVALREQUESTEDDATE}   </div>',
			 '<div > <b class="sideheadfont">Comments:</b>  ApprovalComments </div>'  */
			 '<div><table width="100%"  cellspacing="1"><tbody><tr><td  width="40%" valign="top"  class="sideheadfont">Approved By </td><td class="sidebody">{TOUSER}</td></tr><tr><td  width="40%"  valign="top"  class="sideheadfont">Approved Date</td><td class="sidebody">{APPROVEDDATE}</td></tr><tr><td  width="40%"  valign="top"  class="sideheadfont">Comments </td><td class="sidebodycomments">{DESCRIPTION} </td></tr></tbody></table></div>'
        ].join('') 
		},
		{
	
	//docked:'bottom',
	xtype:'toolbar',
	docked:'bottom',
	cls:'toolbar',
	id:'historytoolbar',
	
	items:[{
	xtype:'button',
			//ui:'action',
			ui:'confirm',
			text:'Approve',
			id:'approveButton2',
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
			//ui:'action',
			ui:'decline',
			text:'Reject',
			id:'rejectButton2',
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
		],
	
    },
	initialize: function() {
 	 	
    				
    	 this.on('painted', this.sethistoryformat);       
    	 },
	sethistoryformat: function() {
	    
	     if(selectedrecord.data.WORKTYPE=='PR'){	
		 Ext.getCmp('detailhid').setTitle("Purchase History");
	        Ext.getCmp('erhistoryview').setHidden(true);
			Ext.getCmp('prhistoryview').setHidden(false);
	       }
	      if(selectedrecord.data.WORKTYPE=='ER'){
	     Ext.getCmp('detailhid').setTitle("Report History");
		    Ext.getCmp('prhistoryview').setHidden(true);
			Ext.getCmp('erhistoryview').setHidden(false);
		   }
	},
});
