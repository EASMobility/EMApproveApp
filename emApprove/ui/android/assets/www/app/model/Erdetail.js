Ext.define('eaApprove.model.Erdetail', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
              { name: 'id', type: 'int' },
            { name: 'REPORTHEADERID', type: 'string' },
            { name: 'DESCRIPTION', type: 'string' },
			{ name: 'NOTIFICATIONID', type: 'string' },
			{ name: 'JUSTIFICATION', type: 'string' },
			{ name: 'DISTRIBUTIONLINENUMBER', type: 'string' },
			{name:'CURRENCYCODE',type:'string'},
			{name:'GLACCOUNT',type:'string'},
			{name:'UNITPRICE',type:'string'},
			{name:'APPROVEDDATE',type:'string'}
        ]
    }
	
});