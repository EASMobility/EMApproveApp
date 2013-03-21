/**
 * Copyright 2012-2013 Electronic Arts, Inc. 
 */
/* ER Worklists model values to be filled within the store */
Ext.define('eaApprove.store.ERWorklists', {
    extend: 'Ext.data.Store',
    config: {
        model: 'eaApprove.model.ERWorklist',
        autoLoad: true,
    }
});