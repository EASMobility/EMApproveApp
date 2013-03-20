Ext.define('eaApprove.view.Worklists', {
    extend: 'Ext.Container',
    xtype: 'contacts',
    requires: [
       		'eaApprove.view.Overlay',
                  ],
    config: {

		items:[
				{
		xtype:'list',
       // cls: 'x-list-show',
		//onItemDisclosure:true,
        store: 'Worklists',
		id:'contactslist',
		cls:'worklistbackground',
		height: '80%',
		  
						itemTpl: ["<div><table  class=\"listtable\" ><tr><td valign=\"top\" width=\"95%\" ><div class=\"td1\"> <b>{RESPCTIVEDESCRIPTION}</b></div></td></tr></table><table  width=\"95%\"><tr><td valign=\"top\"  width=\"95%\" colspan=\"3\" style=\"color:#ffffff;font-size:19px;font-weight:normal\" ><b>{Amount} </b></td><td rowspan=\"2\"><img src=\"resources/images/NextArrow.png\" style=\"width: 15px;height:15px\" /></td></tr><tr class=\"td2\"><td valign=\"top\"  width=\"21%\">Start Date</td><td valign=\"top\" width=\"21%\">Due Date</td><td valign=\"top\" width=\"51%\">From</td></tr></table><table  width=\"95%\"><tr style=\"color:#C7E3FF;font-size:14px;\"><td valign=\"top\"   width=\"20%\">{APPROVALREQUESTEDDATE}</td><td width=\"20%\" valign=\"top\">{APPROVALREQUESTEDBY}</td><td width=\"55%\" valign=\"top\">{FROMUSER}</td></tr></table></div>"],	
		

		}, // for xtype list
		], // items
    }, // config
	
	
});


