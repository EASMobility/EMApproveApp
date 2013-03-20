Ext
		.define(
				'eaApprove.view.Category',
				{
					extend : 'Ext.Container',
					xtype : 'category',
					id : 'category12',
					height: '100%',
					config : {

						items : [
								{
									hidden : true,
									height : '50%',
									//id:'ExpenseReportContainer',										
									layout : 'fit',
									items : [ {
										xtype : 'list',
										height: '85%',
										scrollable : {
											direction : 'vertical',
											directionLock : true
										},
										title : 'Expense Reports',
										store : 'ERWorklists',
										id : 'erlist',
										cls:'categorylist',
										/*itemTpl : [ "<div><table  class=\"listtable\" ><tr><td valign=\"top\" width=\"100%\" ><div class=\"td1\"> <b style=\"font-weight:normal\"> IE for {RESPECTIVEDESCRIPTION}</b> </div></td><td rowspan=\"4\"><img src=\"resources/images/NextArrow.png\" style=\"width: 15px;height:15px\" /></td></tr><tr><td valign=\"top\" class=\"wrap-style\" width=\"95%\"><b style=\"font-weight:normal\"> {Amount} </b></td></tr><tr><td valign=\"top\" class=\"td2\"  width=\"95%\">Start&nbsp;Date&nbsp;&nbsp&nbsp;Due&nbsp;Date&nbsp;&nbsp;&nbsp;&nbsp;From</td></tr><tr><td valign=\"top\"  style=\"color:#C7E3FF;font-size:14px;\" width=\"95%\">{APPROVALREQUESTEDDATE}&nbsp;&nbsp;&nbsp;{APPROVALREQUESTEDBY}&nbsp;&nbsp;&nbsp;&nbsp;{FROMUSER}</td></tr></table></div>" ],*/
										
		                           itemTpl: ["<span><table  class=\"listtable\"  width=\"95%\" ><tr><td valign=\"top\" width=\"95%\" ><div class=\"td1\"> <b> {RESPCTIVEDESCRIPTION}</b></div></td></tr></table><table  width=\"95%\"><tr><td valign=\"top\"  width=\"95%\" colspan=\"3\" style=\"color:#ffffff;font-size:19px;font-weight:normal\" ><b> {Amount} </b></td></td></tr><tr class=\"td2\"><td valign=\"top\"  width=\"18%\">Start Date</td><td valign=\"top\" width=\"18%\">Due Date</td><td valign=\"top\" width=\"49%\">From</td></tr></table><table  width=\"95%\"><tr style=\"color:#C7E3FF;font-size:14px;\"><td valign=\"top\"   width=\"18%\">{APPROVALREQUESTEDDATE}</td><td width=\"18%\" valign=\"top\">{APPROVALREQUESTEDBY}</td><td width=\"49%\" valign=\"top\">{FROMUSER}</td></tr></table></span><span><img class=\"secondviewarrowcategory\" src=\"resources/images/NextArrow.png\" /></span>"],
										
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
										itemTpl : [ "<div><table  class=\"listtable\" ><tr><td valign=\"top\" width=\"95%\" ><div class=\"td1\"> <b style=\"font-weight:normal\"> PO for {RESPECTIVEDESCRIPTION}</b> </div></td><td rowspan=\"4\"><img src=\"resources/images/NextArrow.png\" style=\"width: 15px;height:15px\" /></td></tr><tr><td valign=\"top\" class=\"wrap-style\" width=\"95%\"><b style=\"font-weight:normal\"> {Amount} </b></td></tr><tr><td valign=\"top\" class=\"td2\"  width=\"95%\">Start Date: {APPROVALREQUESTEDDATE}, Due Date: {APPROVALREQUESTEDBY}</td></tr><tr><td valign=\"top\"  style=\"color:#C7E3FF;font-size:14px;\" width=\"95%\">From: {FROMUSER}</td></tr></table></div>" ],

									} ]
								},
								{

									height : '50%',
									layout : 'fit',
									//id:'PurchaseRequisitionContainer',
									hidden : true,
									items : [ {
										xtype : 'list',
										height : '85%',
										scrollable : {
											direction : 'vertical',
											directionLock : true
										},
										title : 'Purchase Requisitions',
										store : 'PRWorklists',
										id : 'prlist',
										cls:'categorylist',
										//itemTpl : [ "<div><table  class=\"listtable\" ><tr><td valign=\"top\" width=\"100%\" ><div class=\"td1\"> <b style=\"font-weight:normal\"> PR for {RESPECTIVEDESCRIPTION}</b> </div></td><td rowspan=\"4\"><img src=\"resources/images/NextArrow.png\" style=\"width: 15px;height:15px\" /></td></tr><tr><td valign=\"top\" class=\"wrap-style\" width=\"95%\"><b style=\"font-weight:normal\"> {Amount} </b></td></tr><tr><td valign=\"top\" class=\"td2\"  width=\"95%\">Start&nbsp;Date&nbsp;&nbsp;&nbsp;Due&nbsp;Date&nbsp;&nbsp;&nbsp;&nbsp;From</td></tr><tr><td valign=\"top\"  style=\"color:#C7E3FF;font-size:14px;\" width=\"95%\">{APPROVALREQUESTEDDATE}&nbsp;&nbsp;&nbsp;{APPROVALREQUESTEDBY}&nbsp;&nbsp;&nbsp;&nbsp;{FROMUSER}</td></tr></table></div>" ],
										
		            itemTpl: ["<span><table  class=\"listtable\"  width=\"95%\" ><tr><td valign=\"top\" width=\"95%\" ><div class=\"td1\"> <b> {RESPCTIVEDESCRIPTION}</b></div></td></tr></table><table  width=\"95%\"><tr><td valign=\"top\"  width=\"95%\" colspan=\"3\" style=\"color:#ffffff;font-size:19px;font-weight:normal\" ><b> {Amount} </b></td></tr><tr class=\"td2\"><td valign=\"top\"  width=\"18%\">Start Date</td><td valign=\"top\" width=\"18%\">Due Date</td><td valign=\"top\" width=\"49%\">From</td></tr></table><table  width=\"95%\"><tr style=\"color:#C7E3FF;font-size:14px;\"><td valign=\"top\"   width=\"18%\">{APPROVALREQUESTEDDATE}</td><td width=\"18%\" valign=\"top\">{APPROVALREQUESTEDBY}</td><td width=\"49%\" valign=\"top\">{FROMUSER}</td></tr></table></span><span><img class=\"secondviewarrowcategory\" src=\"resources/images/NextArrow.png\" /></span>"],
										
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
