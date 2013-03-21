/**
 * Copyright 2012-2013 Electronic Arts, Inc. 
 */
/* Expense Report History field details based on the node server response */
Ext.define('eaApprove.model.ERhistory', {
    extend: 'Ext.data.Model',
    config: {
        fields: [{
            name: 'id',
            type: 'int'
        }, {
            name: 'REPORTHEADERID',
            type: 'string'
        }, {
            name: 'NOTIFICATIONID',
            type: 'string'
        }, {
            name: 'APPROVEREMPLOYEENUMBER',
            type: 'string'
        }, {
            name: 'STATUS',
            type: 'string'
        }, {
            name: 'TOUSER',
            type: 'string'
        }, {
            name: 'IEXPENSENUMBER',
            type: 'string'
        }, {
            name: 'APPROVEDDATE',
            type: 'string'
        }, {
            name: 'DESCRIPTION',
            type: 'string'
        }, {
            name: 'AMOUNT',
            type: 'string'
        }, ]
    }
});