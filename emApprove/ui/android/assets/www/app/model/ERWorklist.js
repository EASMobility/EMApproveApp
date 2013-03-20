Ext.define('eaApprove.model.ERWorklist', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
              { name: 'id', type: 'int' },
			  { name: 'TID', type: 'string' },
            { name: 'RECORDHEADERID', type: 'string' },
            { name: 'FROMUSER', type: 'string' },
			{ name: 'NOTIFICATIONID', type: 'string' },
			{ name: 'DESCRIPTION', type: 'string' },
			{ name: 'RESPCTIVEDESCRIPTION', type: 'string' },
			{ name: 'Amount', type: 'string' },
			{ name: 'APPROVALREQUESTEDDATE', type: 'string' },
			{name:'PAYMENTCURRENCYCODE',type:'string'},
			{name:'APPROVALREQUESTEDBY',type:'string'},
			{name:'RECORDNUMBER',type:'string'},
			{ name: 'FULLAPPROVALREQUESTEDDATE', type: 'string' },
			{name:'FULLAPPROVALREQUESTEDBY',type:'string'},
			{name:'APPROVEREMPLOYEENUMBER',type:'string'},
			{name:'APPROVEDDATE',type:'string'},
			{ name: 'STATUS', type: 'string' },
			{name:'INDIVIDUALSCOSTCENTER',type:'string'},
			
			
			{name:'WORKTYPE',type:'string'},
        ]
    }
	
	
	
});
