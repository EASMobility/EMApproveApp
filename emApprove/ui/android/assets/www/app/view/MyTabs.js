/**
 * Copyright 2012-2013 Electronic Arts, Inc. 
 */
/* Creating Landing screen Tab panel contents */
Ext.define("eaApprove.view.MyTabs", {
    extend: 'Ext.tab.Panel',
    alias: 'widget.mytabsview',
    id: 'mytabsview',
    requires: ['eaApprove.view.Worklistsdue', 'eaApprove.view.Worklists', 'eaApprove.view.Settings', 'eaApprove.view.More', 'eaApprove.view.About', 'eaApprove.view.Category' ],
    config: {
        width: '100%',
        height: '116%',
        tabBarPosition: 'top',
        activeItem: 3,
        items: [
        // Start Date, Due Date, Category and More.
        {
            xtype: 'contacts',
            title: '<img id="startDateId" class="startDateDeSelSize" src="resources/images/StartDate_DeSelected01.png"/>',
            name: 'Start Date',
        }, {
            xtype: 'contactsdue',
            title: '<img id="dueDateId" class="dueDateDeSelSize" src="resources/images/DueDate_DeSelected01.png"/>',
            name: 'Due Date',
        }, {
            xtype: 'category',
            title: '<img id="categoryId" class="categoryDeSelSize" src="resources/images/Category_DeSelected01.png"/>',
            name: 'Category',
            layout: {
                type: 'accordion',
                mode: 'MULTI'
            },
        }, {
            xtype: 'more',
            title: '<img id="moreId" class="moreSelSize" src="resources/images/More_Selected01.png"/>',
            name: 'More',
        }, ],
        listeners: {
            activeitemchange: function (tabPanel, tab, oldTab) {
                var startDateOption = document.getElementById('startDateId');
                var dueDateOption = document.getElementById('dueDateId');
                var categoryOption = document.getElementById('categoryId');
                var moreOption = document.getElementById('moreId');
               // bar = Ext.getCmp('mainview').getNavigationBar();
                activetab = tab.config.name;
                if (tab.config.name === 'Start Date') {
                    startDateOption.src = 'resources/images/StartDate_Selected01.png';
                    dueDateOption.src = 'resources/images/DueDate_DeSelected01.png';
                    categoryOption.src = 'resources/images/Category_DeSelected01.png'
                    moreOption.src = 'resources/images/More_DeSelected01.png';
                    startDateOption.className = 'startDateSelSize';
                    dueDateOption.className = 'dueDateDeSelSize';
                    categoryOption.className = 'categoryDeSelSize'
                    moreOption.className = 'moreDeSelSize';
                   // bar.titleComponent.setTitle('Worklist - Start Date');
                    titleTopToolbar = 'Worklist - Start Date';
					Ext.getCmp('maintoolbar').setTitle('Worklist - Start Date');
                    worklistrequest_database('Start Date');
                } else if (tab.config.name === 'Due Date') {
                    startDateOption.src = 'resources/images/StartDate_DeSelected01.png';
                    dueDateOption.src = 'resources/images/DueDate_Selected01.png';
                    categoryOption.src = 'resources/images/Category_DeSelected01.png'
                    moreOption.src = 'resources/images/More_DeSelected01.png';
                    startDateOption.className = 'startDateDeSelSize';
                    dueDateOption.className = 'dueDateSelSize';
                    categoryOption.className = 'categoryDeSelSize'
                    moreOption.className = 'moreDeSelSize';
                   // bar.titleComponent.setTitle('Worklist - Due Date');
                    titleTopToolbar = 'Worklist - Due Date';
					Ext.getCmp('maintoolbar').setTitle('Worklist - Due Date');
                    worklistrequest_database('Due Date');
                }  else if (tab.config.name === 'Category') {
                    startDateOption.src = 'resources/images/StartDate_DeSelected01.png';
                    dueDateOption.src = 'resources/images/DueDate_DeSelected01.png';
                    categoryOption.src = 'resources/images/Category_Selected01.png'
                    moreOption.src = 'resources/images/More_DeSelected01.png';
                    startDateOption.className = 'startDateDeSelSize';
                    dueDateOption.className = 'dueDateDeSelSize';
                    categoryOption.className = 'categorySelSize'
                    moreOption.className = 'moreDeSelSize';
					
                  //  bar.titleComponent.setTitle('Category');
                    titleTopToolbar = 'Category';
					Ext.getCmp('maintoolbar').setTitle('Category');
                    PRworklistrequest_database();
                    ERworklistrequest_database();
                } else if (tab.config.name === 'More') {
                    startDateOption.src = 'resources/images/StartDate_DeSelected01.png';
                    dueDateOption.src = 'resources/images/DueDate_DeSelected01.png';
                    categoryOption.src = 'resources/images/Category_DeSelected01.png'
                    moreOption.src = 'resources/images/More_Selected01.png';
                    startDateOption.className = 'startDateDeSelSize';
                    dueDateOption.className = 'dueDateDeSelSize';
                    categoryOption.className = 'categoryDeSelSize'
                    moreOption.className = 'moreSelSize';
                   // bar.titleComponent.setTitle("More");
                    titleTopToolbar = 'More';
					Ext.getCmp('maintoolbar').setTitle('More');
                }
            },
        }, // listeners
    },
    indicator: false
});