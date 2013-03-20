Ext.define('eaApprove.view.Main', {
    extend: 'Ext.navigation.View',
    xtype: 'mainview',
	id:'mainview',
    requires: [
		'eaApprove.view.MyTabs',
           ],

    config: {
     //   fullscreen: true,
		width:'100%',
		height:'93%',
		 	navigationBar : {
    docked : 'top',
	useTitleForBackButtonText:true,
    items : [
        {
					xtype:'button',
                    text: 'Settings',
                    align: 'left',
					id: 'editButton',
					hidden:'false',
                    hideAnimation: Ext.os.is.Android ? false : {
                        type: 'fadeOut',
                        duration: 200
                    },
                    showAnimation: Ext.os.is.Android ? false : {
                        type: 'fadeIn',
                        duration: 200
                    }
        }
    ]
},
	     items: [{
		 title:'More',
		 items:[
            { xtype: 'mytabsview' }
			]
        }] 
    },
	 onBackButtonTap: function() {
        this.pop();
		bar = Ext.getCmp('mainview').getNavigationBar();
		bar.titleComponent.setTitle(titleTopToolbar);
		//alert(titleTopToolbar);
		settingscount=0;
		abtcount=0;
        this.fireEvent('back', this);
    },

	
    	
});



