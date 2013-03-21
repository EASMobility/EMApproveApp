/**
 * Copyright 2012-2013 Electronic Arts, Inc. 
 */
/* Purchase Requisition field details based on the node server response */
Ext.define('eaApprove.model.Prdetail', {
    extend: 'Ext.data.Model',
    config: {
        fields: [{
            name: 'id',
            type: 'int'
        }, {
            name: 'REQUISITIONHEADERID',
            type: 'string'
        }, {
            name: 'ITEMDESCRIPTION',
            type: 'string'
        }, {
            name: 'LINENUM',
            type: 'string'
        }, {
            name: 'QUANTITY',
            type: 'int'
        }, {
            name: 'REQUISITIONLINEID',
            type: 'string'
        }, {
            name: 'ACCOUNTCODE',
            type: 'string'
        }, {
            name: 'UNITPRICE',
            type: 'string'
        }, {
            name: 'CURRENCYCODE',
            type: 'string'
        }]
    }
});