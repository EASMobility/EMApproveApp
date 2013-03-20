/* var queryvalue = 
  {
    "Tid": "123456",
    "SessionTokenId" : sessionTokenID,
	 "REQUISITIONNUMBER": "1104046008"
  }; */
Ext.define('eaApprove.store.Historys', {
    extend: 'Ext.data.Store',
	storeId: 'gruppoStore',
    config: {
        model: 'eaApprove.model.History',
        autoLoad: true,
     /*  proxy: {
            type: 'ajax',
			actionMethods : {
			read : 'POST'
			},
              url:'http://10.226.112.12:80/ea-erp',
			
			extraParams:{
			QueryHistoryItemsReq:queryvalue
					
			},
			writer: {
			type : 'json',
			encodeRequest: true
			},
			reader: {
            type: 'json',
            rootProperty: 'QueryPRHistoryRes.PurchaseRequisition'
        }
        }  */
        
		

    }
});
