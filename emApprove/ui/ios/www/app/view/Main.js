/**
 * Copyright 2012-2013 Electronic Arts, Inc. 
 */
/* First view calling from the application */
Ext.define('eaApprove.view.Main', {
    extend: "Ext.Container",
    alias: 'widget.mainview',
    id: 'mainview',
  
    initialize: function () {

        this.callParent(arguments);

        var topToolbar = {
            xtype: "toolbar",
            title: 'More',
            docked: "top",
            id:"maintoolbar",
        };

     	
		 var notestabpanel = {
            xtype: "maintabview",
			tabBarPosition: 'top',
			id: 'maintabview',
			 activeItem: 3,
	
			 };
        this.add([topToolbar,notestabpanel]);
    },
    config: {
        layout: {
            type: 'fit'
        } 
    }
});