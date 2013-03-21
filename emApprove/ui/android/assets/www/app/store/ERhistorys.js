/**
 * Copyright 2012-2013 Electronic Arts, Inc. 
 */
/* ER Historys fields model value to be filled within the store */
Ext.define('eaApprove.store.ERhistorys', {
    extend: 'Ext.data.Store',
    storeId: 'gruppoStore',
    config: {
        model: 'eaApprove.model.ERhistory',
        autoLoad: true,
    }
});