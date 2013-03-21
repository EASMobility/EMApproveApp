/**
 * Copyright 2012-2013 Electronic Arts, Inc. 
 */
/* Dialog which should be displayed on click of Reject button */
Ext.define("eaApprove.view.contact.ReportItemsReject", {
    extend: 'Ext.Panel',
    alias: 'widget.reportItemsViewReject',
    id: 'reportItemsViewReject',
    requires: ['eaApprove.view.contact.ApproveCmts'],
    config: {
        top: '75',
        floating: true,
        modal: true,
        baseCls: 'x-report-background',
        // Content of Reject Dialog
        items: [{
            html: '<div class="Approvecls">Reject</div>',
        }, {
            html: '<div class="actioncls">Are you sure you wish to Reject this item?</div>',
        }, {
            xtype: 'button',
            text: 'Reject',
            id: 'rejectMainButton',
            cls: 'subbutton',
            handler: function () {
                if (check_network() == 'No network connection' || check_network() == 'Unknown connection') {
                    alert('No network connection');
                } else {
                    this.fireEvent('onRejectMainClick', this);
                  
                    Ext.getCmp('reportItemsViewReject').hide();
                }
            }
        }, {
            xtype: 'button',
            text: 'Reject With Comments',
            id: 'approveCommentButton1',
            cls: 'subbutton',
            handler: function () {
                this.fireEvent('onApproveCommentsClick', this);
                Ext.getCmp('approveText').setValue(' ');
               
                buttonfinder = "reject";
                Ext.getCmp('reportItemsViewReject').hide();
            }
        }, {
            xtype: 'button',
            text: 'Cancel',
            cls: 'subbuttoncancel',
            handler: function () {
               
                Ext.getCmp('reportItemsViewReject').hide();
            }
        }, {
            html: '<div style="height:10px;"><br></div>',
        }]
    },
    listeners: {}
});