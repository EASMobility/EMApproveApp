/**
 * Copyright 2012-2013 Electronic Arts, Inc. 
 */
/* Purchase Report Details model values to be filled within the store */
Ext.define('eaApprove.store.Prdetails', {
    extend: 'Ext.data.Store',
    config: {
        model: 'eaApprove.model.Prdetail',
        autoLoad: true,
    }
});