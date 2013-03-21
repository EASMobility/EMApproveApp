/**
 * Copyright 2012-2013 Electronic Arts, Inc. 
 */
/* It will be displaying Details panel, Lines panel and History panel. */
Ext.define('eaApprove.view.Secondview', {
    extend: 'Ext.Container',
    alias: 'widget.secondview',
    id: 'showbackground',
    //requires: ['eaApprove.view.ReportItems'],
    config: {
        /*width: '100%',
        height: '100%',*/
        title: '',
        items: [
		{
		   xtype:'toolbar',
		   id:'secondviewtoolbar',
		   docked:'top',
		   items:[
		   {
		       xtype:'button',
		       ui:'back',
		       id:'secondviewback',
			   text:'Worklist',
		        handler: function () {
                    
                    this.fireEvent('onSecondViewBack', this);
                },
			}	
		   ]
		},{
            xtype: 'panel',
            id: 'HeaderHTML',
            cls: 'HeaderHTMLposition'
        }, {
            xtype: 'panel',
            id: 'HeaderHTML1',
            cls: 'HeaderHTMLposition1'
        }, {
            xtype: 'carousel',
            cls: 'darkbluecarousel',
            items: [{
                //details panle for PR and IE  
                xtype: 'panel',
                id: 'textbox',
                //width: '100%',
               // cls: 'x-show-contact_new',
                tpl: ['<div id="paneltpl"></div>'].join('')
            }, {
                //lines panel for PR and IE    
                xtype: 'panel',
                id: 'panel2',
                items: [{
                    xtype: 'title',
                    title: 'Lines',
                    id: 'detailstitlecolor1',
                    cls: 'detailstitlecolor1'
                }, {
                    xtype: 'list',
                    //cls: 'x-show-prdetails',
                    cls: 'prlinesbgcolor',
                    id: 'prlistview',
                    store: 'Prdetails',
                    height: '74%',
                    itemTpl: ['<table class="linetableheight" width="100%"><tbody><tr><td class="tablelefttdstyle" width="24%">Description</td><td class="dotformat" width="71%">{ITEMDESCRIPTION}</td></tr><tr><td class="tablelefttdstyle" width="24%">Quantity</td><td class="tablerightdstyle" width="71%">{QUANTITY}</td></tr><tr><td class="tablelefttdstyle" width="24%">Unit Price</td><td   class="tablerightdstyle" width="71%">{UNITPRICE}</td></tr><tr><td class="tablelefttdstyle" width="24%">A/C Code</td><td   class="tablerightdstyle" width="71%">{ACCOUNTCODE}</td></tr></tbody></table>'].join('')
                }, {
                    xtype: 'list',
                    //cls: 'x-show-erdetails',
                    cls: 'prlinesbgcolor',
                    id: 'erlistview',
                    store: 'Erdetails',
                    height: '74%',
                    itemTpl: ['<table class="linetableheight" width="100%" ><tr><td class="tablelefttdstyle" width="24%">Amount</td><td class="tablerightdstyle" width="71%">{UNITPRICE}</td></tr><tr><td class="tablelefttdstyle" width="24%">Description</td><td class="dotformat" width="71%">{DESCRIPTION}</td></tr><tr><td class="tablelefttdstyle" width="24%">Justification</td><td class="tablerightdstyle" width="71%">{JUSTIFICATION}</td></tr><tr><td class="tablelefttdstyle" width="24%">GL</td><td class="tablerightdglstyle" width="71%">{GLACCOUNT}</td></tr></table>'].join('')
                }, ]
            }, {
                //History panel for PR and IE	 
                xtype: 'panel',
                id: 'panel3',
                items: [{
                    xtype: 'title',
                    title: 'History',
                    id: 'detailstitlecolor2',
                    cls: 'detailstitlecolor1'
                }, {
                    xtype: 'list',
                    height: '78%',
                    //cls: 'x-show-prdetails',
                    store: 'Historys',
                    id: 'prhistoryview',
                    cls: 'prlinesbgcolor',
                    itemTpl: ['<div><table width="100%" class="linetableheight" cellspacing="1"><tbody><tr><td  width="40%" valign="top"  class="tablehistorylefttdstyle">Approved By </td><td class="tablehistoryrightdstyle">{TOUSER}</td></tr><tr><td  width="40%"  valign="top"  class="tablehistorylefttdstyle">Approved Date</td><td class="tablehistoryrightdstyle">{APPROVEDDATE}</td></tr><tr><td  width="40%"  valign="top"  class="tablehistorylefttdstyle">Comments </td><td class="tablehistoryrightdstyle">{DESCRIPTION} </td></tr></tbody></table></div>'].join('')
                }, {
                    xtype: 'list',
                    height: '78%',
                    //cls: 'x-show-prdetails',
                    store: 'ERhistorys',
                    id: 'erhistoryview',
                    cls: 'prlinesbgcolor',
                    itemTpl: ['<div><table width="100%"  class="linetableheight" cellspacing="1"><tbody><tr><td  width="40%" valign="top"  class="tablehistorylefttdstyle">Approved By </td><td class="tablehistoryrightdstyle">{TOUSER}</td></tr><tr><td  width="40%"  valign="top"  class="tablehistorylefttdstyle">Approved Date</td><td class="tablehistoryrightdstyle">{APPROVEDDATE}</td></tr><tr><td  width="40%"  valign="top"  class="tablehistorylefttdstyle">Comments </td><td class="tablehistoryrightdstyle">{DESCRIPTION} </td></tr></tbody></table></div>'].join('')
                }, ]
            }],
        }, {
            xtype: 'panel',
            //docked:'bottom',
            id: 'buttonpanel',
            cls: 'prdtoolbar',
            layout: {
                type: 'hbox',
                align: 'stretch',
            },
            items: [
            //added for approve and reject
            {
                xtype: 'button',
                ui: 'action',
                text: '&nbspReject&nbsp',
                id: 'rejectButton',
                ui: 'decline',
                handler: function () {
                    
                    this.fireEvent('onRejectClick', this);
					  
					
					
                },
            }, {
                xtype: 'spacer'
            }, {
                xtype: 'button',
                ui: 'action',
                text: '&nbsp&nbspApprove&nbsp&nbsp',
                id: 'approveButton',
                ui: 'confirm',
                handler: function () {
                   
                    this.fireEvent('onApproveClick', this);
					  
                },
            }, ]
        }, ],
        record: null
    },
    initialize: function () {
        this.on('painted', this.setvalidation);
    },
    setvalidation: function () {
        if (selectedrecord.data.WORKTYPE == 'PR') {
            document.getElementById('HeaderHTML').innerHTML = '<div class="whitecolordescription">' + selectedrecord.data.RESPCTIVEDESCRIPTION + '</div><br/>';
            document.getElementById('HeaderHTML1').innerHTML = '<span class="headinglabel">Requisition ID &nbsp;&nbsp;' + '</span><span class="whitecolorvalue">' + selectedrecord.data.RECORDNUMBER + '</span><br/>';
            document.getElementById('paneltpl').innerHTML = '';
            /* Details */
            document.getElementById('paneltpl').innerHTML = '<div class="detailstitlecolor">Details</div>';
            document.getElementById('paneltpl').innerHTML += '<hr class="firsthrstyle">';
            document.getElementById('paneltpl').innerHTML += '<table class="detailtableheight"><tbody><tr><td class="tablelefttdstyle">Description </td><td class="tablerightdstyle">' + selectedrecord.data.DESCRIPTION + '</td></tr><tr><td class="tablelefttdstyle">From </td><td class="tablerightdstyle">' + selectedrecord.data.FROMUSER + '</td></tr><tr><td class="tablelefttdstyle">Start Date </td><td class="tablerightdstyle">' + selectedrecord.data.FULLAPPROVALREQUESTEDDATE + '</td></tr><tr><td class="tablelefttdstyle">Due Date </td><td class="tablerightdstyle">' + selectedrecord.data.FULLAPPROVALREQUESTEDBY + '</td></tr>' + '<tr><td class="tablelefttdstyle">Amount </td><td class="tablerightdstyle">' + selectedrecord.data.Amount + '</td></tr></tbody></table>';
        }
        if (selectedrecord.data.WORKTYPE == 'ER') {
            document.getElementById('HeaderHTML').innerHTML = '<div class="whitecolordescription">' + selectedrecord.data.RESPCTIVEDESCRIPTION + '</div><br/>';
            document.getElementById('HeaderHTML1').innerHTML = '<span class="headinglabel">Report ID &nbsp;&nbsp;' + '</span><span class="whitecolorvalue">' + selectedrecord.data.RECORDNUMBER + '</span><br/>';
            document.getElementById('paneltpl').innerHTML = '';
            /* Details */
            document.getElementById('paneltpl').innerHTML = '<div class="detailstitlecolor">Details</div>';
            document.getElementById('paneltpl').innerHTML += '<hr class="firsthrstyle">';
            document.getElementById('paneltpl').innerHTML += '<table class="detailtableheight"><tbody><tr><td class="tablelefttdstyle">From </td><td class="tablerightdstyle">' + selectedrecord.data.FROMUSER + '</td></tr><tr><td class="tablelefttdstyle">Purpose </td><td class="tablerightdstyle">' + selectedrecord.data.DESCRIPTION + '</td></tr><tr><td class="tablelefttdstyle">Start Date </td><td class="tablerightdstyle">' + selectedrecord.data.FULLAPPROVALREQUESTEDDATE + '</td></tr><tr><td class="tablelefttdstyle">Due Date </td><td class="tablerightdstyle">' + selectedrecord.data.FULLAPPROVALREQUESTEDBY + '</td></tr>' + '<tr><td class="tablelefttdstyle">Amount </td><td class="tablerightdstyle">' + selectedrecord.data.Amount + '</td></tr><tr><td class="tablelefttdstyle">Cost Center </td><td  class="tablerightdstyle">' + selectedrecord.data.INDIVIDUALSCOSTCENTER + '</td></tr></tbody></table>';
        }
      
        if (selectedrecord.data.WORKTYPE == 'PR') {
            //Ext.getCmp('prdetailhid').setTitle("Purchase Requisition Details");
            Ext.getCmp('erlistview').setHidden(true);
            Ext.getCmp('prlistview').setHidden(false);
            Ext.getCmp('erhistoryview').setHidden(true);
            Ext.getCmp('prhistoryview').setHidden(false);
        }
        if (selectedrecord.data.WORKTYPE == 'ER') {
            // Ext.getCmp('prdetailhid').setTitle("Expense Report Details");
            Ext.getCmp('prlistview').setHidden(true);
            Ext.getCmp('erlistview').setHidden(false);
            Ext.getCmp('prhistoryview').setHidden(true);
            Ext.getCmp('erhistoryview').setHidden(false);
        }
    },
    updateRecord: function (newRecord) {
        if (newRecord) {
            this.down('#textbox').setData(newRecord.data);
        }
    },
});