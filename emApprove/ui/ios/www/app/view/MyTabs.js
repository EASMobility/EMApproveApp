Ext.define("eaApprove.view.MyTabs", {
extend: 'Ext.tab.Panel',

xtype: 'mytabsview',
id:'mytabsview',
 requires: [
		'eaApprove.view.Worklistsdue',
	    'eaApprove.view.Worklists',
		'eaApprove.view.Settings',
		'eaApprove.view.More',
		'eaApprove.view.About',
		'eaApprove.view.Category',
        'eaApprove.view.contact.Show',
		
        ],
config: {
width:'100%',
height:'110%',
tabBarPosition: 'top',
activeItem:3,
//indicator: false,
items: [
{
xtype: 'contacts',
//title: '<span class="startDate"/>',
//html:'<img class="" src="resources/images/StartDate_DeSelected02.png"/>',
title: '<img id="startDateId" class="startDateDeSelSize" src="resources/images/StartDate_DeSelected01.png"/>',
//title: '<img class="icn" src="resources/images/startDate_ico.png"/>',
name:'Start Date',
//title: 'Start Date',
//cls:'startDate'
//iconCls: 'startDate'
//iconCls: '<img src="resources/images/StartDate_DeSelected01.png"/>'
},
{
xtype: 'contactsdue',
//title: '<img class="icn" src="resources/images/DueDate_Selected02.png"/>',
//title: '<img class="icn" src="resources/images/dueDate_ico.png"/>',
title: '<img id="dueDateId" class="dueDateDeSelSize" src="resources/images/DueDate_DeSelected01.png"/>',
name:'Due Date',
//title: 'Due Date',
//id: 'Due Date',
//iconCls: 'dueDate'
//iconCls: '<img src="resources/images/DueDate_DeSelected02.png"/>'
},         

{
xtype: 'category',
//title: '<img class="icn" src="resources/images/Category_DeSelected02.png"/>',
//title: '<img class="icn" src="resources/images/category_ico.png"/>',
title: '<img id="categoryId" class="categoryDeSelSize" src="resources/images/Category_DeSelected01.png"/>',
name:'Category',
//id: 'Category',
//iconCls: 'add',
layout     : {
    type : 'accordion',
    mode : 'MULTI'
},
//scrollable : 'vertical'
//disabled: true,
//disabledCls: null
//iconCls: '<img src="resources/images/Category_DeSelected02.png"/>'
},

{
	//xtype: 'settings',
	xtype: 'more',
	//title: 'More',
	//title: '<img class="icn" src="resources/images/More_DeSelected02.png"/>',
	title: '<img id="moreId" class="moreSelSize" src="resources/images/More_Selected01.png"/>',
	name:'More',
	//title: 'Settings',
	//id: 'settings',
	//iconCls: 'settings'
	//iconCls: '<img src="resources/images/More_DeSelected02.png"/>'
	},


/*{
xtype: 'settings',
title: '<img class="icn" src="resources/images/settings_ico.png"/>',
//title: '<img class="icn" src="resources/images/settings_ico.png"/><br/>Settings',
name:'Settings'
//title: 'Settings',
//id: 'settings',
//iconCls: 'settings'
},*/
/*{
xtype: 'About',
name:'About',
title: '<img class="icn" src="resources/images/about_ico.png"/>'
//title: '<img class="icn" src="resources/images/about_ico.png"/><br/>About'	
//title: 'About',
//id: 'About',
//iconCls: 'about'
},*/
],
     listeners: {
                activeitemchange: function (tabPanel, tab, oldTab) {
                    //alert('Current tab: ' + tab.config.title);
                	
                	var startDateOption = document.getElementById('startDateId');
                	var dueDateOption = document.getElementById('dueDateId');
                	var categoryOption = document.getElementById('categoryId');
                	var moreOption = document.getElementById('moreId');
                	
                                                  bar = Ext.getCmp('mainview').getNavigationBar();
                                                                        //bar.backButton.setIconCls('home');
                                                //bar.backButton.setIconMask(true);
               // bar.backButton.setUi('plain');
                //bar.backButton.setText('');
               // bar.setDefaultBackButtonText('Worklist');    
                                                  activetab=tab.config.name;
                                                            if(tab.config.name==='Start Date'){
                                                            	
                                                            
	
                                                            	startDateOption.src = 'resources/images/StartDate_Selected01.png';
                                                            	dueDateOption.src = 'resources/images/DueDate_DeSelected01.png';
                                                            	categoryOption.src = 'resources/images/Category_DeSelected01.png'
                                                            	moreOption.src = 'resources/images/More_DeSelected01.png';
                                                            	
                                                            	startDateOption.className = 'startDateSelSize';
                                                            	dueDateOption.className = 'dueDateDeSelSize';
                                                            	categoryOption.className = 'categoryDeSelSize'
                                                            	moreOption.className = 'moreDeSelSize';

                                                            	bar.titleComponent.setTitle('Worklist - Start Date');
																	titleTopToolbar = 'Worklist - Start Date';
                                                //if(localStorage.getItem('sessionToken')!=null && localStorage.getItem('userid')){
                                                                        //alert('hi session....');
                                                            //alert(localStorage.getItem('sessionToken'));
                                                            worklistrequest_database('Start Date');
                                                //          }                                                          
                                                            }else if(tab.config.name==='Due Date'){

                                                            	startDateOption.src = 'resources/images/StartDate_DeSelected01.png';
                                                            	dueDateOption.src = 'resources/images/DueDate_Selected01.png';
                                                            	categoryOption.src = 'resources/images/Category_DeSelected01.png'
                                                            	moreOption.src = 'resources/images/More_DeSelected01.png';
                                                            	
                                                            	startDateOption.className = 'startDateDeSelSize';
                                                            	dueDateOption.className = 'dueDateSelSize';
                                                            	categoryOption.className = 'categoryDeSelSize'
                                                            	moreOption.className = 'moreDeSelSize';
                                                            	
                                                            bar.titleComponent.setTitle('Worklist - Due Date');
																titleTopToolbar = 'Worklist - Due Date';
                                                                                                
                                                            //          if(localStorage.getItem('sessionToken')!=null && localStorage.getItem('userid'){
                                                            //          alert('hi session....');
                                                            console.log(localStorage.getItem('sessionToken'));
                                                            worklistrequest_database('Due Date');
                                                            //}
                                                            }
                                                            
                                                            else if(tab.config.name==='Settings'){
                                                            
                                                            bar.titleComponent.setTitle(tab.config.name);
															titleTopToolbar = tab.config.name;
                                                            //alert(Ext.getCmp('mainview').getNavigationBar().title);
                                                            }else if(tab.config.name==='Category'){
                                                            	
                                                            	startDateOption.src = 'resources/images/StartDate_DeSelected01.png';
                                                            	dueDateOption.src = 'resources/images/DueDate_DeSelected01.png';
                                                            	categoryOption.src = 'resources/images/Category_Selected01.png'
                                                            	moreOption.src = 'resources/images/More_DeSelected01.png';
                                                            	
                                                            	startDateOption.className = 'startDateDeSelSize';
                                                            	dueDateOption.className = 'dueDateDeSelSize';
                                                            	categoryOption.className = 'categorySelSize'
                                                            	moreOption.className = 'moreDeSelSize';
                                                            	
                                                            	
					bar.titleComponent.setTitle('Category');
					titleTopToolbar = 'Category';
					PRworklistrequest_database();
					ERworklistrequest_database() ;
					
                                                            }else if(tab.config.name==='About'){
                                                            
                                                            bar.titleComponent.setTitle(tab.config.name);
															titleTopToolbar = 'About';
                                                            //alert(Ext.getCmp('mainview').getNavigationBar().title);
                                                            }else if(tab.config.name==='More'){

                                                            	startDateOption.src = 'resources/images/StartDate_DeSelected01.png';
                                                            	dueDateOption.src = 'resources/images/DueDate_DeSelected01.png';
                                                            	categoryOption.src = 'resources/images/Category_DeSelected01.png'
                                                            	moreOption.src = 'resources/images/More_Selected01.png';
                                                            	
                                                            	startDateOption.className = 'startDateDeSelSize';
                                                            	dueDateOption.className = 'dueDateDeSelSize';
                                                            	categoryOption.className = 'categoryDeSelSize'
                                                            	moreOption.className = 'moreSelSize';
                                                            	
                                                            	bar.titleComponent.setTitle("More");
																titleTopToolbar = 'More';
                                                            }
                },
                        
            }, // listeners
			
    	
                                                                        
}, indicator:false

});
