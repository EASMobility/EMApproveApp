/**
 * Copyright 2012-2013 Electronic Arts, Inc. 
 */
/* Purchase Requisition Worklists field model values to be filled within the store */
Ext.define('eaApprove.store.PRWorklists', {
    extend: 'Ext.data.Store',
    config: {
        model: 'eaApprove.model.PRWorklist',
        autoLoad: true,
    }
});