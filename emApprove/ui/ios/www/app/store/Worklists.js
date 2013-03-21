/**
 * Copyright 2012-2013 Electronic Arts, Inc. 
 */
/* Worklists field model values to be filled within the store */
Ext.define('eaApprove.store.Worklists', {
    extend: 'Ext.data.Store',
    config: {
        model: 'eaApprove.model.Worklist',
        autoLoad: true,
    }
});