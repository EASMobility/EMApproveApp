Ext.define('eaApprove.view.contact.Show', {
    extend: 'Ext.Container',
    xtype: 'contact-show',
	id:'showbackground',
	requires: [
	     'eaApprove.view.contact.History',
		 'eaApprove.view.contact.Prdetail',
		 'eaApprove.view.contact.ReportItems',
        ],
    config: {
	width:'100%',
height:'100%',
               title: '',
			   
      
	//baseCls:'x-show-contact_background',
 	/* scrollable: {
        direction: 'vertical'
    },  
        items: [
	
				
		{ 
		xtype:'toolbar',
		 height:'2.0em',
		 docked:'top',
		 cls:'subtoolbar',
		 id:'prhid',
		 title: {
                            title: '',
							id:'subprhid',
                            style: {
                                'text-align': 'center',
								'font-size': '1.0em',
								
                            }
                        }, 
		
		
						
                    },
					
		
			
			{
			     xtype:'panel',
                id: 'textbox',
				//width: '100%',
					  
				cls: 'x-show-contact_new',
				
				tpl:[
				'<div id="paneltpl"></div>' 
				].join('')										

				},
			{	xtype:'panel',
		height:'2%',
		cls:'detailpanel',
        html:'<div> Details</div>'
		},
			{
               id: 'content2',
				xtype:'list',
				id:'listItem',
				cls: 'x-show-contact_bottom',
				store:'Showlists',
				scrollable:false,
				itemTpl: [ '<div>','<table>',
							'<tr><td valign="top" width="100%" class="fonttest">{title}</td><td width="25%"><img alt="" src="resources/images/arrow.png" style="width: 10px;height:10px" /></td></tr>',
 							'</table></div>'],
				
					listeners: {
                }
					
					
               
            },
		
			{
              //  id: 'content2',
			  //baseCls:'x-show-toolbar',
				xtype:'toolbar',
				docked:'bottom',
				cls:'prdtoolbar',
			items:[
			//added for approve and reject
			{xtype:'button',
			ui:'action',
			text:'&nbspApprove&nbsp',
			id:'approveButton',
			ui:'confirm',
			handler:function(){
			var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
			button1[0].disable();
			this.fireEvent('onApproveClick', this);
			},
			
			},
			{xtype:'spacer'},
			{xtype:'button',
			ui:'action',
			text:'&nbsp&nbsp&nbspReject&nbsp&nbsp&nbsp',
			id:'rejectButton',
			ui:'decline',
			handler:function(){
			var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
			button1[0].disable();
			this.fireEvent('onRejectClick', this);
			},
			},
			]
               
            },
			
			
        ],
		*/
		
	items: [
	{
		xtype:'panel',
		id:'HeaderHTML',
		cls:'HeaderHTMLposition'
	},
	{
		xtype:'panel',
		id:'HeaderHTML1',
		cls:'HeaderHTMLposition1'
	},
	{
        xtype:'carousel',
		cls:'darkbluecarousel',
		 items: [
        {
            //html : 'Item 1',
           xtype:'panel',
                id: 'textbox',
				//width: '100%',
					  
				cls: 'x-show-contact_new',
				
				tpl:[
				'<div id="paneltpl"></div>' 
				].join('')
        },
        {
            xtype:'panel',
			id:'panel2',
			items:[
			{
			  xtype:'title',
			  title:'Lines',
			  id:'detailstitlecolor1',
			  cls:'detailstitlecolor1'
			},
           {
        xtype:'list',
		//cls: 'x-show-prdetails',
		cls:'prlinesbgcolor',
		id:'prlistview',
        store: 'Prdetails',
		
		height: '74%',
         itemTpl: [
             /*'<div class="dotformat"><b>{ITEMDESCRIPTION}</b></div><div class="prdetailfont4">Qty: {QUANTITY}, Unit Price: {UNITPRICE} USD</div>'*/
			 '<table class="linetableheight"><tbody><tr><td class="tablelefttdstyle">Description</td><td class="dotformat">{ITEMDESCRIPTION}</td></tr><tr><td class="tablelefttdstyle">Quantity</td><td class="tablerightdstyle">{QUANTITY}</td></tr><tr><td class="tablelefttdstyle">Unit Price</td><td   class="tablerightdstyle">{UNITPRICE}</td></tr></tbody></table>'
			 
        ].join('') 
    },
	{
        xtype:'list',
		//cls: 'x-show-erdetails',
		cls:'prlinesbgcolor',
		id:'erlistview',
        store: 'Erdetails',
		
		height: '74%',
         itemTpl: [
             /*'<div class="prdetailfont5"><b>Amount: {UNITPRICE}</b></div><div class="dotformat">{DESCRIPTION}</div><div class="prdetailfont5">Justification:{JUSTIFICATION}</div><div class="hyphenate">GL:{GLACCOUNT}</div>'*/		 
			 '<table class="linetableheight"><tr><td class="tablelefttdstyle">Amount</td><td class="tablerightdstyle">{UNITPRICE}</td></tr><tr><td class="tablelefttdstyle">Description</td><td class="dotformat">{DESCRIPTION}</td></tr><tr><td class="tablelefttdstyle">Justification</td><td class="tablerightdstyle">{JUSTIFICATION}</td></tr><tr><td class="tablelefttdstyle">GL</td><td class="tablerightdglstyle">{GLACCOUNT}</td></tr></table>'
			 
        ].join('') 
    },]
        },
     { 
		xtype:'panel',
			id:'panel3',
			items:[
           	 {
                       xtype:'title',
			  title:'History',
			  id:'detailstitlecolor2',
			  cls:'detailstitlecolor1'
                    }, 
		{
		xtype:'list',
		height: '78%', 
        //cls: 'x-show-prdetails',
        store: 'Historys',
		id:'prhistoryview',
		cls:'prlinesbgcolor',
		
         itemTpl: [
		   /* '<div > <b class="sideheadfont">Approved by:</b>  {REQUESTOR}  </div>',
			 '<div > <b class="sideheadfont">Approved Date:</b>  {APPROVALREQUESTEDDATE}   </div>',
			 '<div > <b class="sideheadfont">Comments:</b>  ApprovalComments </div>'  */
			 '<div><table width="100%" class="linetableheight" cellspacing="1"><tbody><tr><td  width="40%" valign="top"  class="tablehistorylefttdstyle">Approved By </td><td class="tablehistoryrightdstyle">{TOUSER}</td></tr><tr><td  width="40%"  valign="top"  class="tablehistorylefttdstyle">Approved Date</td><td class="tablehistoryrightdstyle">{APPROVEDDATE}</td></tr><tr><td  width="40%"  valign="top"  class="tablehistorylefttdstyle">Comments </td><td class="tablehistoryrightdstyle">{DESCRIPTION} </td></tr></tbody></table></div>'
        ].join('') 
		},
		{
		xtype:'list',
		height: '78%', 
        //cls: 'x-show-prdetails',
        store: 'ERhistorys',
		id:'erhistoryview',
		cls:'prlinesbgcolor',
		
         itemTpl: [
		   /* '<div > <b class="sideheadfont">Approved by:</b>  {REQUESTOR}  </div>',
			 '<div > <b class="sideheadfont">Approved Date:</b>  {APPROVALREQUESTEDDATE}   </div>',
			 '<div > <b class="sideheadfont">Comments:</b>  ApprovalComments </div>'  */
			 '<div><table width="100%"  class="linetableheight" cellspacing="1"><tbody><tr><td  width="40%" valign="top"  class="tablehistorylefttdstyle">Approved By </td><td class="tablehistoryrightdstyle">{TOUSER}</td></tr><tr><td  width="40%"  valign="top"  class="tablehistorylefttdstyle">Approved Date</td><td class="tablehistoryrightdstyle">{APPROVEDDATE}</td></tr><tr><td  width="40%"  valign="top"  class="tablehistorylefttdstyle">Comments </td><td class="tablehistoryrightdstyle">{DESCRIPTION} </td></tr></tbody></table></div>'
        ].join('') 
		},
		]
      }
    ],
	},
	  {
              //  id: 'content2',
			  //baseCls:'x-show-toolbar',
				xtype:'panel',
				//docked:'bottom',
				id:'buttonpanel',
				cls:'prdtoolbar',
				layout:{
				 
				 type:'hbox',
				 align:'stretch',
				},
			items:[
			//added for approve and reject
			{xtype:'button',
			ui:'action',
			text:'&nbspReject&nbsp',
			id:'rejectButton',
			ui:'decline',
			handler:function(){
			var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
			button1[0].disable();
			this.fireEvent('onRejectClick', this);
			},
			
			},
			{xtype:'spacer'},
			{xtype:'button',
			ui:'action',
			text:'&nbsp&nbspApprove&nbsp&nbsp',
			id:'approveButton',
			ui:'confirm',
			handler:function(){
			var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
			button1[0].disable();
			this.fireEvent('onApproveClick', this);
			},
			},
			]
               
            },
	
    ],
        record: null

    },
		
     initialize: function() {
 	 	
    				
    	 this.on('painted', this.setvalidation);       
    	 },
    	
    	 setvalidation: function() {
    	    
		if(selectedrecord.data.WORKTYPE=='PR'){	
		
		// Ext.getCmp('prhid').setTitle("Requisition ID"+" "+selectedrecord.data.RECORDNUMBER);
		
		document.getElementById('HeaderHTML').innerHTML='<div class="whitecolordescription">' + selectedrecord.data.RESPCTIVEDESCRIPTION + '</div><br/>';
		document.getElementById('HeaderHTML1').innerHTML='<span class="headinglabel">Requisition ID &nbsp;&nbsp;' + '</span><span class="whitecolorvalue">' + selectedrecord.data.RECORDNUMBER + '</span><br/>';
		
		/*document.getElementById('paneltpl').innerHTML='';
		document.getElementById('paneltpl').innerHTML+= '<table border-radius:"0.4em" width="100%" height="100%" class=""><tbody><tr><td width ="34%" valign="top" class="prdsideheadfont">From </td><td class="prdsidevaluefont">'+selectedrecord.data.FROMUSER+'</td></tr><tr><td width ="34%" valign="top" class="prdsideheadfont">Description </td><td class="prdsidevaluefont" id="firstcell">'+selectedrecord.data.DESCRIPTION+'</td></tr><tr><td width ="34%" valign="top" class="prdsideheadfont">Start Date </td><td class="prdsidevaluefont">'+selectedrecord.data.FULLAPPROVALREQUESTEDDATE+'</td></tr><tr><td width ="34%"  valign="top" class="prdsideheadfont" ">Due Date </td><td class="prdsidevaluefont">'+selectedrecord.data.FULLAPPROVALREQUESTEDBY+'</td></tr>'+
	   '<tr><td width ="34%" valign="top" class="prdsideheadfont">Amount </td><td class="prdsidevaluefont">'+selectedrecord.data.Amount+'</td></tr></tbody></table>';*/
	   
	   
   		document.getElementById('paneltpl').innerHTML='';

		/* Details */
		document.getElementById('paneltpl').innerHTML='<div class="detailstitlecolor">Details</div>';	   
		document.getElementById('paneltpl').innerHTML+='<hr class="firsthrstyle">';
			
		document.getElementById('paneltpl').innerHTML+= '<table class="detailtableheight"><tbody><tr><td class="tablelefttdstyle">Description </td><td class="dotformat">'+selectedrecord.data.DESCRIPTION+'</td></tr><tr><td class="tablelefttdstyle">From </td><td class="tablerightdstyle">'+selectedrecord.data.FROMUSER+'</td></tr><tr><td class="tablelefttdstyle">Start Date </td><td class="tablerightdstyle">'+selectedrecord.data.FULLAPPROVALREQUESTEDDATE+'</td></tr><tr><td class="tablelefttdstyle">Due Date </td><td class="tablerightdstyle">'+selectedrecord.data.FULLAPPROVALREQUESTEDBY+'</td></tr>'+
	   '<tr><td class="tablelefttdstyle">Amount </td><td class="tablerightdstyle">'+selectedrecord.data.Amount+'</td></tr></tbody></table>';
	   
	   /* Lines */
	   //document.getElementById('panel2html').innerHTML='<div class="detailstitlecolor">Lines</div>';
	   //document.getElementById('panel2html').innerHTML+='<hr class="firsthrstyle">';

	   }   
		if(selectedrecord.data.WORKTYPE=='ER'){	
		 //Ext.getCmp('prhid').setTitle("Report ID"+" "+selectedrecord.data.RECORDNUMBER);

		document.getElementById('HeaderHTML').innerHTML='<div class="whitecolordescription">' + selectedrecord.data.RESPCTIVEDESCRIPTION + '</div><br/>';
		document.getElementById('HeaderHTML1').innerHTML='<span class="headinglabel">Report ID &nbsp;&nbsp;' + '</span><span class="whitecolorvalue">' + selectedrecord.data.RECORDNUMBER + '</span><br/>';

		/*document.getElementById('paneltpl').innerHTML='';
		document.getElementById('paneltpl').innerHTML= '<table border-radius:"0.4em" width="100%" height="100%" class=""><tbody><tr><td width ="34%" valign="top" class="prdsideheadfont">From </td><td class="prdsidevaluefont">'+selectedrecord.data.FROMUSER+'</td></tr><tr><td width ="34%" valign="top" class="prdsideheadfont">Purpose </td><td class="prdsidevaluefont" id="firstcell">'+selectedrecord.data.DESCRIPTION+'</td></tr><tr><td width ="34%" valign="top" class="prdsideheadfont">Start Date </td><td class="prdsidevaluefont">'+selectedrecord.data.FULLAPPROVALREQUESTEDDATE+'</td></tr><tr><td width ="34%"  valign="top" class="prdsideheadfont" ">Due Date </td><td class="prdsidevaluefont">'+selectedrecord.data.FULLAPPROVALREQUESTEDBY+'</td></tr>'+
	   '<tr><td width ="34%" valign="top" class="prdsideheadfont">Amount </td><td class="prdsidevaluefont">'+selectedrecord.data.Amount+'</td></tr><tr><td width ="34%" valign="top" class="prdsideheadfont">Cost Center </td><td class="prdsidevaluefont">'+selectedrecord.data.INDIVIDUALSCOSTCENTER+'</td></tr></tbody></table>';*/
	   
		document.getElementById('paneltpl').innerHTML='';

	   /* Details */
		document.getElementById('paneltpl').innerHTML='<div class="detailstitlecolor">Details</div>';	 
		document.getElementById('paneltpl').innerHTML+='<hr class="firsthrstyle">';
	   
		document.getElementById('paneltpl').innerHTML+= '<table class="detailtableheight"><tbody><tr><td class="tablelefttdstyle">From </td><td class="tablerightdstyle">'+selectedrecord.data.FROMUSER+'</td></tr><tr><td class="tablelefttdstyle">Purpose </td><td class="dotformat">'+selectedrecord.data.DESCRIPTION+'</td></tr><tr><td class="tablelefttdstyle">Start Date </td><td class="tablerightdstyle">'+selectedrecord.data.FULLAPPROVALREQUESTEDDATE+'</td></tr><tr><td class="tablelefttdstyle">Due Date </td><td class="tablerightdstyle">'+selectedrecord.data.FULLAPPROVALREQUESTEDBY+'</td></tr>'+
	   '<tr><td class="tablelefttdstyle">Amount </td><td class="tablerightdstyle">'+selectedrecord.data.Amount+'</td></tr><tr><td class="tablelefttdstyle">Cost Center </td><td  class="tablerightdstyle">'+selectedrecord.data.INDIVIDUALSCOSTCENTER+'</td></tr></tbody></table>';
	   
	   /* Lines */
	   //document.getElementById('panel2html').innerHTML='<div class="detailstitlecolor">Lines</div>';
	   //document.getElementById('panel2html').innerHTML+='<hr class="firsthrstyle">';
	   
	   } 	
			bar = Ext.getCmp('mainview').getNavigationBar();
    		   bar.setDefaultBackButtonText('Worklist');
    		
    		/* if(approvedOrNot==true){
    			 Ext.getCmp('rejectButton').setDisabled(true);
    	   Ext.getCmp('approveButton').setDisabled(true);	}else
    	   {
    	    Ext.getCmp('rejectButton').setDisabled(false);
    	   Ext.getCmp('approveButton').setDisabled(false);
    	   
    	   }*/
		   
		   if(selectedrecord.data.WORKTYPE=='PR'){	
		  //Ext.getCmp('prdetailhid').setTitle("Purchase Requisition Details");
	        Ext.getCmp('erlistview').setHidden(true);
			Ext.getCmp('prlistview').setHidden(false);
			 Ext.getCmp('erhistoryview').setHidden(true);
			Ext.getCmp('prhistoryview').setHidden(false);
	       }
	      if(selectedrecord.data.WORKTYPE=='ER'){
	    // Ext.getCmp('prdetailhid').setTitle("Expense Report Details");
		    Ext.getCmp('prlistview').setHidden(true);
			Ext.getCmp('erlistview').setHidden(false);
			 Ext.getCmp('prhistoryview').setHidden(true);
			Ext.getCmp('erhistoryview').setHidden(false);
		   }
		   
		   
    	 } ,
		  updateRecord: function(newRecord) {
	
        if (newRecord) {
          
			this.down('#textbox').setData(newRecord.data);
			//this.down('#content2').setData(newRecord.data);
			//this.down('#content3').setData(newRecord.data);
       
        }
    },
});
