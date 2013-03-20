Ext.define('eaApprove.model.Worklist', {
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
			{name:'MESSAGENAME',type:'string'},
			{name:'APPROVALREQUESTEDBY',type:'string'},
			{name:'REQUISITIONNUMBER',type:'string'},
			{ name: 'FULLAPPROVALREQUESTEDDATE', type: 'string' },
			{name:'FULLAPPROVALREQUESTEDBY',type:'string'},
			{name:'WORKTYPE',type:'string'},
			{name:'RECORDNUMBER',type:'string'},
			{name:'INDIVIDUALSCOSTCENTER',type:'string'},
        ]
    }
	
	
	
});
