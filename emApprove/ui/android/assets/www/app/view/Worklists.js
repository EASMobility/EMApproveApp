Ext.define('eaApprove.view.Worklists', {
    extend: 'Ext.Container',
    xtype: 'contacts',
    requires: [
       		'eaApprove.view.Overlay',
                  ],
    config: {

		items:[
		/* {
		 xtype:'toolbar',
		 height:'2.0em',
		 cls:'subtoolbar',
		
		 title: {
                            title: 'Purchase Requisition',
                            style: {
                                'text-align': 'center',
								'font-size': '1.0em',
								
                            }
                        },
		
		},*/
		{
		xtype:'list',
       // cls: 'x-list-show',
		//onItemDisclosure:true,
        store: 'Worklists',
		id:'contactslist',
		cls:'worklistbackground',
		height: '80%',
		//title:'Worklist',
         //itemTpl: ["<div><table  class=\"listtable\" ><tr><td valign=\"top\" width=\"95%\" ><div class=\"td1\"> <b>{RESPCTIVEDESCRIPTION}</b> </div></td><td rowspan=\"4\"><img src=\"resources/images/arrow@2x.png\" style=\"width: 15px;height:15px\" /></td></tr><tr><td valign=\"top\" class=\"wrap-style font-color-white\" width=\"95%\"><b> {Amount} </b></td></tr><tr><td valign=\"top\" class=\"td2\"  width=\"95%\">Start Date: {APPROVALREQUESTEDDATE}, Due Date: {APPROVALREQUESTEDBY}</td></tr><tr><td valign=\"top\"  style=\"color:#6D7B8D;font-size:13px;\" width=\"95%\">From: {FROMUSER}</td></tr></table></div>"
              /* '<div class="wrap-style"> <b> PR for {DESCRIPTION} </b> </div>',
			 '<div class="wrap-style"> <b> {Amount} </b> </div>',
			 '<div>  </div>',
			 '<div style="color:grey;" > Begin Date: {APPROVALREQUESTEDDATE }    Due Date: {APPROVALREQUESTEDBY}</div>',
			 '<div class="x-list-show_bottom" style="color:grey;">From User: {FROMUSER}</div>'  */
		/*itemTpl: ["<div>" +
		          	"<table  class=\"listtable\" >" +
		          		"<tr>" +
		          			"<td valign=\"top\" width=\"95%\" >" +
		          				"<div class=\"td1\"> <b>{RESPCTIVEDESCRIPTION}</b> " +
		          				"</div>" +
		          			"</td>" +
		          			"<td rowspan=\"4\">" +
		          				"<img src=\"resources/images/arrow@2x.png\" style=\"width: 15px;height:15px\" />" +
		          			"</td>" +
		          		"</tr>" +
		          		"<tr>" +
		          			"<td valign=\"top\" class=\"wrap-style font-color-white\" width=\"95%\">" +
		          				"<b> {Amount} </b>" +
		          			"</td>" +
		          		"</tr>" +
		          		"<tr>" +
		          			"<td valign=\"top\" class=\"td2\"  width=\"95%\">" +
		          				"Start Date: {APPROVALREQUESTEDDATE}, Due Date: {APPROVALREQUESTEDBY}" +
		          			"</td>" +
		          		"</tr>" +
		          		"<tr>" +
		          			"<td valign=\"top\"  style=\"color:#6D7B8D;font-size:13px;\" width=\"95%\">" +
		          				"From: {FROMUSER}" +
		          			"</td>" +
		          		"</tr>" +
		          	"</table>" +
		          "</div>"*/			  
		/*itemTpl: ["<div><table class=\"listtable\"><tr><td valign=\"top\" width=\"95%\" ><div class=\"td1\"> <b style=\"font-weight:normal\">{RESPCTIVEDESCRIPTION}</b></div></td><td rowspan=\"4\"><img src=\"resources/images/NextArrow.png\" style=\"width: 15px;height:15px\" /></td></tr><tr><td valign=\"top\" class=\"wrap-style font-color-white\" width=\"95%\"><b style=\"font-weight:normal\"> {Amount} </b></td></tr><tr><td valign=\"top\" class=\"td2\"  width=\"95%\">Start&nbsp;Date&nbsp;&nbsp;&nbsp;&nbsp;Due&nbsp;Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;From</td></tr><tr><td valign=\"top\"  style=\"color:#C7E3FF;font-size:14px;\" width=\"95%\">{APPROVALREQUESTEDDATE}&nbsp;&nbsp;&nbsp;&nbsp;{APPROVALREQUESTEDBY}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{FROMUSER}</td></tr></table></div>"] ,*/

						/*itemTpl: ["<div><table  class=\"listtable\" ><tr><td valign=\"top\" width=\"95%\" ><div class=\"td1\"> <b> {RESPCTIVEDESCRIPTION}</b></div></td></tr></table><table  width=\"95%\"><tr><td valign=\"top\"  width=\"95%\" colspan=\"3\" style=\"color:#ffffff;font-size:19px;font-weight:normal\" ><b>{Amount} </b></td><td rowspan=\"2\"><img src=\"resources/images/NextArrow.png\" style=\"width: 15px;height:15px\" /></td></tr><tr class=\"td2\"><td valign=\"top\"  width=\"21%\">Start Date</td><td valign=\"top\" width=\"21%\">Due Date</td><td valign=\"top\" width=\"51%\">From</td></tr></table><table  width=\"95%\"><tr style=\"color:#C7E3FF;font-size:14px;\"><td valign=\"top\"   width=\"20%\">{APPROVALREQUESTEDDATE}</td><td width=\"20%\" valign=\"top\">{APPROVALREQUESTEDBY}</td><td width=\"55%\" valign=\"top\">{FROMUSER}</td></tr></table></div>"],	*/
						
						itemTpl: ["<span><table  class=\"listtable\" ><tr><td valign=\"top\" width=\"95%\" ><div class=\"td1\"> <b> {RESPCTIVEDESCRIPTION}</b></div></td></tr></table><table  width=\"95%\"><tr><td valign=\"top\"  width=\"95%\" colspan=\"3\" style=\"color:#ffffff;font-size:19px;font-weight:normal\" ><b>{Amount} </b></td></td></tr><tr class=\"td2\"><td valign=\"top\"  width=\"18%\">Start Date</td><td valign=\"top\" width=\"18%\">Due Date</td><td valign=\"top\" width=\"49%\">From</td></tr></table><table  width=\"95%\"><tr style=\"color:#C7E3FF;font-size:14px;\"><td valign=\"top\"   width=\"18%\">{APPROVALREQUESTEDDATE}</td><td width=\"18%\" valign=\"top\">{APPROVALREQUESTEDBY}</td><td width=\"49%\" valign=\"top\">{FROMUSER}</td></tr></table></span><span><img class=\"secondviewarrow\" src=\"resources/images/NextArrow.png\" /></span>"],	

		
		
		/*listeners: {
            /*itemtaphold: function (list, idx, target, record, evt) {

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
               
            } // for itemtaphold function
		}, // for listeners*/

		}, // for xtype list
		], // items
    }, // config
	
	
});


