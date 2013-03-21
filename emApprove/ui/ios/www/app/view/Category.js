/**
 * Copyright 2012-2013 Electronic Arts, Inc. 
 */
/* Worklist displayed under Category section */
Ext.define('eaApprove.view.Category', {
    extend: 'Ext.Container',
    alias: 'widget.category',
    id: 'category12',
    //height: '110%',
    cls: 'worklistbackground',
    config: {
        items: [{
            // Expense Report
            hidden: true,
            height: '50%',
            layout: 'fit',
			id:'ExpenseReportContainer',
            items: [{
                xtype: 'list',
                height: '79%',
                scrollable: {
                    direction: 'vertical',
                    directionLock: true
                },
                title: 'Expense Reports',
                store: 'ERWorklists',
                id: 'erlist',
                cls: 'categorylist',
                itemTpl: ["<div><table  class=\"listtable\"  width=\"100%\" ><tr><td valign=\"top\" width=\"100%\" ><div class=\"td1\"> <b> {RESPCTIVEDESCRIPTION}</b></div></td></tr></table><table  width=\"100%\"><tr><td valign=\"top\"  width=\"100%\" colspan=\"3\" style=\"color:#ffffff;font-size:19px;font-weight:normal\" ><b> {Amount} </b></td><td rowspan=\"2\"><img src=\"resources/images/NextArrow.png\" style=\"width: 15px;height:15px\" /></td></tr><tr class=\"td2\"><td valign=\"top\"  width=\"23%\">Start Date</td><td valign=\"top\" width=\"23%\">Due Date</td><td valign=\"top\" width=\"54%\">From</td></tr></table><table  width=\"95%\"><tr style=\"color:#C7E3FF;font-size:14px;\"><td valign=\"top\"   width=\"22.96%\">{APPROVALREQUESTEDDATE}</td><td width=\"23%\" valign=\"top\">{APPROVALREQUESTEDBY}</td><td width=\"54%\" valign=\"top\">{FROMUSER}</td></tr></table></div>"],
            }] // items
        }, {
            // Purchase Requisition	
            height: '50%',
            layout: 'fit',
            id:'PurchaseRequisitionContainer',
            hidden: true,
            items: [{
                xtype: 'list',
                height: '80%',
                scrollable: {
                    direction: 'vertical',
                    directionLock: true
                },
                title: 'Purchase Requisitions',
                store: 'PRWorklists',
                id: 'prlist',
                cls: 'categorylist',
                itemTpl: ["<div><table  class=\"listtable\"  width=\"100%\" ><tr><td valign=\"top\" width=\"100%\" ><div class=\"td1\"> <b> {RESPCTIVEDESCRIPTION}</b></div></td></tr></table><table  width=\"100%\"><tr><td valign=\"top\"  width=\"100%\" colspan=\"3\" style=\"color:#ffffff;font-size:19px;font-weight:normal\" ><b> {Amount} </b></td><td rowspan=\"2\"><img src=\"resources/images/NextArrow.png\" style=\"width: 15px;height:15px\" /></td></tr><tr class=\"td2\"><td valign=\"top\"  width=\"23%\">Start Date</td><td valign=\"top\" width=\"23%\">Due Date</td><td valign=\"top\" width=\"54%\">From</td></tr></table><table  width=\"95%\"><tr style=\"color:#C7E3FF;font-size:14px;\"><td valign=\"top\"   width=\"22.96%\">{APPROVALREQUESTEDDATE}</td><td width=\"23%\" valign=\"top\">{APPROVALREQUESTEDBY}</td><td width=\"54%\" valign=\"top\">{FROMUSER}</td></tr></table></div>"],
            }] // for items
        }, ]
    },
});