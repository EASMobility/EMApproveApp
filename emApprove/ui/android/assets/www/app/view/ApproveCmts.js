/**
 * Copyright 2012-2013 Electronic Arts, Inc. 
 */
/* Creating views for Approval / Reject with Comments panel */
Ext.define("eaApprove.view.ApproveCmts", {
    extend: 'Ext.Container',
    alias: 'widget.approvecmts',
    id: 'approveWithComments',
    requires: [],
    config: {
       
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        // Black Gradient Toolbar
        items: [{
            docked: 'top',
            xtype: 'toolbar',
            title: 'Comments',
            align: 'center',
            //style: 'background-color:black',
            items: [{
                // Back button
                xtype: 'button',
                text: 'Back',
                ui: 'back',
				id:'commentsback',
                handler: function () {
                  
                       this.fireEvent('onCommentViewBack', this);
                }
            }, {
                xtype: 'spacer',
            }, ] // items inside toolbar
        }, // toolbar
        {
            // Panel which includes Text area and Submit button.
            xtype: 'panel',
            id: 'bluebackground',
            cls: 'commentsbluebackground',
            height: '100%',
            width: '100%',
            items: [{
                xtype: 'textareafield',
                // label: 'Comments',
                id: 'approveText',
                height: '100%',
                maxLength: '200',
                width: '100%',
                clearIcon: false,
            }, // comments
            {
                xtype: 'button',
                text: 'Submit',
                id: 'approveDoneButton',
                top: '224px',
                width: '135px',
                height: '45',
                left: '31%',
                handler: function () {
                    if (check_network() == 'No network connection' || check_network() == 'Unknown connection') {
                        alert('No network connection');
                    } else {
                        this.fireEvent('onApproveDoneClick', this);
                      
                       
                    } //else
                } // handler
            } // xtype
            ],
        }, // bluebackground panel
        ] // very 1st items variable
    }, // config
    listeners: {}
});