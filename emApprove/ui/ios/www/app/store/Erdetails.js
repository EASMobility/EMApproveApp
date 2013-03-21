/**
 * Copyright 2012-2013 Electronic Arts, Inc. 
 */
/* Expense Report Detail field model values to be filled within the store */
Ext.define('eaApprove.store.Erdetails', {
    extend: 'Ext.data.Store',
    config: {
        model: 'eaApprove.model.Erdetail',
        autoLoad: true,
    }
});