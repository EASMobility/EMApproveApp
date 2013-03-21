/**
 * Copyright 2012-2013 Electronic Arts, Inc. 
 */
/* Historys field model value to be filled within the store */
Ext.define('eaApprove.store.Historys', {
    extend: 'Ext.data.Store',
    storeId: 'gruppoStore',
    config: {
        model: 'eaApprove.model.History',
        autoLoad: true,
    }
});