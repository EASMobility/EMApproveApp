/**
 * Copyright 2012-2013 Electronic Arts, Inc. 
 */
/* Creating More tab panel items */
Ext.define(
    'eaApprove.view.More', {
    extend: 'Ext.Container',
    alias: 'widget.more',
    requires: ['eaApprove.view.Settings',
        'eaApprove.view.About'],
    config: {
        // Settings item and About item.
        items: [{
            id: 'morelist',
            xtype: 'list',
            cls: 'morebackground',
            itemTpl: ["<table  class=\"listtable\" >" + "<tr>" + "<td valign=\"top\" width=\"95%\" >" + "<div class=\"td1\"> <b>{title}</b> " + "</div>" + "</td>" + "<td rowspan=\"4\">" + "<img src=\"resources/images/NextArrow.png\" style=\"width: 15px;height:15px\" />" + "</td>" + "</tr>" + "</table>"],
            data: [{
                title: 'Settings'
            }, {
                title: 'About'
            }], // data
        } // items
        ]
        // items
    }
    // config

});