Ext
		.define(
				'eaApprove.view.Category',
				{
					extend : 'Ext.Container',
					xtype : 'category',
					id : 'category12',
					//height: '110%',
					cls:'worklistbackground',
					config : {

						items : [
								{
									hidden : true,
									height : '50%',
									//id:'ExpenseReportContainer',										
									layout : 'fit',
									items : [ {
										xtype : 'list',
										height: '79%',
										scrollable : {
											direction : 'vertical',
											directionLock : true
										},
										title : 'Expense Reports',
										store : 'ERWorklists',
										id : 'erlist',
										cls:'categorylist',
										//itemTpl : [ "<div><table  class=\"listtable\" ><tr><td valign=\"top\" width=\"100%\" ><div class=\"td1\"> <b style=\"font-weight:normal\"> IE for {DESCRIPTION}</b> </div></td><td rowspan=\"4\"><img src=\"resources/images/NextArrow.png\" style=\"width: 15px;height:15px\" /></td></tr><tr><td valign=\"top\" class=\"wrap-style\" width=\"95%\"><b style=\"font-weight:normal\"> {Amount} </b></td></tr><tr><td valign=\"top\" class=\"td2\"  width=\"95%\">StartDate&nbsp;&nbsp;&nbsp;&nbsp;DueDate&nbsp;&nbsp;&nbsp;&nbsp;From</td></tr><tr><td valign=\"top\"  style=\"color:#C7E3FF;font-size:14px;\" width=\"95%\">{APPROVALREQUESTEDDATE}&nbsp;&nbsp;&nbsp;{APPROVALREQUESTEDBY}&nbsp;&nbsp;&nbsp;{FROMUSER}</td></tr></table></div>" ],
		                           itemTpl: ["<div><table  class=\"listtable\"  width=\"100%\" ><tr><td valign=\"top\" width=\"100%\" ><div class=\"td1\"> <b> {RESPCTIVEDESCRIPTION}</b></div></td></tr></table><table  width=\"100%\"><tr><td valign=\"top\"  width=\"100%\" colspan=\"3\" style=\"color:#ffffff;font-size:19px;font-weight:normal\" ><b> {Amount} </b></td><td rowspan=\"2\"><img src=\"resources/images/NextArrow.png\" style=\"width: 15px;height:15px\" /></td></tr><tr class=\"td2\"><td valign=\"top\"  width=\"23%\">Start Date</td><td valign=\"top\" width=\"23%\">Due Date</td><td valign=\"top\" width=\"54%\">From</td></tr></table><table  width=\"95%\"><tr style=\"color:#C7E3FF;font-size:14px;\"><td valign=\"top\"   width=\"22.96%\">{APPROVALREQUESTEDDATE}</td><td width=\"23%\" valign=\"top\">{APPROVALREQUESTEDBY}</td><td width=\"54%\" valign=\"top\">{FROMUSER}</td></tr></table></div>"],
		
		listeners: {
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
               
            } // for itemtaphold function */
		}, // for listeners
									} ] // items

								},
								{
									height : '20%',
									//id:'PurchaseOrderContainer',
									layout : 'fit',
									hidden : true,
									items : [ {
										xtype : 'list',
										height: '15%',
										scrollable : {
											direction : 'vertical',
											directionLock : true
										},
										title : 'Purchase Orders',
										store : 'POWorklists',
										id : 'polist',
										itemTpl : [ "<div><table  class=\"listtable\" ><tr><td valign=\"top\" width=\"100%\" ><div class=\"td1\"> <b style=\"font-weight:normal\"> PO for {DESCRIPTION}</b> </div></td><td rowspan=\"4\"><img src=\"resources/images/NextArrow.png\" style=\"width: 15px;height:15px\" /></td></tr><tr><td valign=\"top\" class=\"wrap-style\" width=\"95%\"><b style=\"font-weight:normal\"> {Amount} </b></td></tr><tr><td valign=\"top\" class=\"td2\"  width=\"95%\">Start Date: {APPROVALREQUESTEDDATE}, Due Date: {APPROVALREQUESTEDBY}</td></tr><tr><td valign=\"top\"  style=\"color:#C7E3FF;font-size:14px;\" width=\"95%\">From: {FROMUSER}</td></tr></table></div>" ],

									} ]
								},
								{

									height : '50%',
									layout : 'fit',
									//id:'PurchaseRequisitionContainer',
									hidden : true,
									items : [ {
										xtype : 'list',
										height : '80%',
										scrollable : {
											direction : 'vertical',
											directionLock : true
										},
										title : 'Purchase Requisitions',
										store : 'PRWorklists',
										id : 'prlist',
										cls:'categorylist',
									//	itemTpl : [ "<div><table  class=\"listtable\" ><tr><td valign=\"top\" width=\"100%\" ><div class=\"td1\"> <b style=\"font-weight:normal\"> PR for {DESCRIPTION}</b> </div></td><td rowspan=\"4\"><img src=\"resources/images/NextArrow.png\" style=\"width: 15px;height:15px\" /></td></tr><tr><td valign=\"top\" class=\"wrap-style\" width=\"95%\"><b style=\"font-weight:normal\"> {Amount} </b></td></tr><tr><td valign=\"top\" class=\"td2\"  width=\"95%\">StartDate&nbsp;&nbsp;&nbsp;&nbsp;DueDate&nbsp;&nbsp;&nbsp;&nbsp;From</td></tr><tr><td valign=\"top\"  style=\"color:#C7E3FF;font-size:14px;\" width=\"95%\">{APPROVALREQUESTEDDATE}&nbsp;&nbsp;&nbsp;{APPROVALREQUESTEDBY}&nbsp;&nbsp;&nbsp;{FROMUSER}</td></tr></table></div>" ],
		            itemTpl: ["<div><table  class=\"listtable\"  width=\"100%\" ><tr><td valign=\"top\" width=\"100%\" ><div class=\"td1\"> <b> {RESPCTIVEDESCRIPTION}</b></div></td></tr></table><table  width=\"100%\"><tr><td valign=\"top\"  width=\"100%\" colspan=\"3\" style=\"color:#ffffff;font-size:19px;font-weight:normal\" ><b> {Amount} </b></td><td rowspan=\"2\"><img src=\"resources/images/NextArrow.png\" style=\"width: 15px;height:15px\" /></td></tr><tr class=\"td2\"><td valign=\"top\"  width=\"23%\">Start Date</td><td valign=\"top\" width=\"23%\">Due Date</td><td valign=\"top\" width=\"54%\">From</td></tr></table><table  width=\"95%\"><tr style=\"color:#C7E3FF;font-size:14px;\"><td valign=\"top\"   width=\"22.96%\">{APPROVALREQUESTEDDATE}</td><td width=\"23%\" valign=\"top\">{APPROVALREQUESTEDBY}</td><td width=\"54%\" valign=\"top\">{FROMUSER}</td></tr></table></div>"],
		
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
		}, // for listeners */
									} ] // for items

								},
						]
					},
					
		 
		
					 
				});
