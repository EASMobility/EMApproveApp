Ext.define('eaApprove.model.Prdetail', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
              { name: 'id', type: 'int' },
            { name: 'REQUISITIONHEADERID', type: 'string' },
            { name: 'ITEMDESCRIPTION', type: 'string' },
			{ name: 'LINETYPE', type: 'string' },
			{ name: 'LASTUPDATEDATE', type: 'string' },
			{ name: 'QUANTITY', type: 'int' },
			{name:'LASTUPDATELOGIN',type:'string'},
			{name:'REQUESTOR',type:'string'},
			{name:'UNITPRICE',type:'string'},
			{name:'CURRENCYCODE',type:'string'}
        ]
    }
	
});