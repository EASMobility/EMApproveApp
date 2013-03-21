
var applicationInstance ;
Ext.application({
    name: 'eaApprove',

    phoneStartupScreen: 'resources/loading/Homescreen.jpg',
    tabletStartupScreen: 'resources/loading/Homescreen~ipad.jpg',

    glossOnIcon: false,
    icon: {
        57: 'resources/icons/icon.png',
        72: 'resources/icons/icon@72.png',
        114: 'resources/icons/icon@2x.png',
        144: 'resources/icons/icon@114.png'
    },

    models: ['Worklist','History','Prdetail','PRWorklist','ERWorklist','Erdetail','ERhistory' ],
    stores: ['Worklists','Historys','Prdetails','PRWorklists','ERWorklists','Erdetails','ERhistorys' ],
   
    controllers: ['Application'],
     views: ["Main","MyTabs","Category","Worklists","Worklistsdue","More","Settings","Secondview","About","ApproveCmts"],
	 
    launch: function() {
        var Main = {
            xtype: "mainview"
        };
		var Secondview={
		    xtype: "secondview"
		};
		
		var Settings={
		     xtype: "settings"
		};
		var About={
		     xtype: "about"
		};
		var ApproveCmts={
		     xtype: "approvecmts"
		};
		applicationInstance = this.getApplication();
		 Ext.Viewport.add([Main,Secondview,Settings,About,ApproveCmts]);
    }
});
