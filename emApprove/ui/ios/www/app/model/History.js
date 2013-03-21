/**
 * Copyright 2012-2013 Electronic Arts, Inc. 
 */
/* Purchase Requisition History field details based on the node server response */
Ext.define('eaApprove.model.History', {
    extend: 'Ext.data.Model',
    config: {
        fields: [{
            name: 'id',
            type: 'int'
        }, {
            name: 'REQUISITIONHEADERID',
            type: 'string'
        }, {
            name: 'FROMUSER',
            type: 'string'
        }, {
            name: 'DESCRIPTION',
            type: 'string'
        }, {
            name: 'APPROVALREQUESTEDDATE',
            type: 'string'
        }, {
            name: 'Amount',
            type: 'string'
        }, {
            name: 'MESSAGENAME',
            type: 'string'
        }, {
            name: 'APPROVALREQUESTEDBY',
            type: 'string'
        }, {
            name: 'APPROVEREMPLOYEENUMBER',
            type: 'string'
        }, {
            name: 'REQUESTOR',
            type: 'string'
        }, {
            name: 'APPROVEDDATE',
            type: 'string'
        }, {
            name: 'TOUSER',
            type: 'string'
        }, ]
    }
});