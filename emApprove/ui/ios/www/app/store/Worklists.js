
Ext.define('eaApprove.store.Worklists', {
    extend: 'Ext.data.Store',

    config: {
        model: 'eaApprove.model.Worklist',
        autoLoad: true,
	/* 	proxy: {
            type: 'ajax',
			actionMethods : {
			read : 'POST'
			},
            url:'http://10.226.112.12:80/ea-erp',
			
			extraParams:{
			QueryWorklistPRReq:queryvalue
					
			},
			writer: {
			type : 'json',
			encodeRequest: true
			},
			reader: {
            type: 'json',
            rootProperty: 'QueryWorklistPRApprRes.PurchaseRequisition'
        }
        }  */
    }
});