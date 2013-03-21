/**
 * Copyright 2012-2013 Electronic Arts, Inc. 
 */
/* Dialog which should be displayed on click of Approve button */
Ext.define("eaApprove.view.contact.ReportItems", {
    extend: 'Ext.Panel',
    xtype: 'reportItemsView',
    id: 'reportItemsView',
    requires: ['eaApprove.view.contact.ApproveCmts'],
    config: {
        top: '75',
        floating: true,
        modal: true,
        baseCls: 'x-report-background',
        // Content of Approve Dialog
        items: [{
            html: '<div class="Approvecls">Approve</div>',
        }, {
            html: '<div class="actioncls">Are you sure you wish to Approve this item?</div>',
        }, {
            xtype: 'button',
            text: 'Approve',
            id: 'approveMainButton',
            cls: 'subbutton',
            handler: function () {
                if (check_network() == 'No network connection' || check_network() == 'Unknown connection') {
                    alert('No network connection');
                } else {
                    this.fireEvent('onApproveMainClick', this);
                    Ext.getCmp('mainview').getNavigationBar().disable();
                    var button1 = Ext.getCmp('mainview').getNavigationBar().query('button');
                    button1[0].enable();
                    Ext.getCmp('reportItemsView').hide();
                }
            }
        }, {
            xtype: 'button',
            text: 'Approve With Comments',
            id: 'approveCommentButton',
            cls: 'subbutton',
            handler: function () {
                this.fireEvent('onApproveCommentsClick', this);
                Ext.getCmp('approveText').setValue(' ');
                var button2 = Ext.getCmp('mainview').getNavigationBar().query('button');
                button2[0].enable();
                buttonfinder = "approve";
                Ext.getCmp('reportItemsView').hide();
            }
        }, {
            xtype: 'button',
            text: 'Cancel',
            id: 'appcancel',
            cls: 'subbuttoncancel',
            handler: function () {
                var button4 = Ext.getCmp('mainview').getNavigationBar().query('button');
                button4[0].enable();
                Ext.getCmp('reportItemsView').hide();
            }
        }, {
            html: '<div style="height:10px;"><br></div>',
        }]
    },
    listeners: {}
});