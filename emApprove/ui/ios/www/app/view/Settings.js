/**
 * Copyright 2012-2013 Electronic Arts, Inc. 
 */
/* Creating Settings page contents like User Credentials, Worklist and Endpoint URL */
Ext.define('eaApprove.view.Settings', {
    extend: 'Ext.Container',
    requires: ['Ext.Panel',
        'Ext.MessageBox', ],
    alias: 'widget.settings',
    //id:'settingsbackground',
    config: {
        title: 'Settings',

        styleHtmlContent: true,
        scrollable: {
            direction: 'vertical'
        },

        layout: {
            type: 'vbox',

        },

        items: [
         {
		   xtype:'toolbar',
		   id:'settingsviewtoolbar',
		   docked:'top',
		   title:'Settings',
		   items:[
		   {
		       xtype:'button',
		       ui:'back',
		       id:'settingsviewback',
			   text:'Back',
		        handler: function () {
                    
                    this.fireEvent('onSettingsViewBack', this);
                },
			}	
		   ]
		},

        {

            xtype: 'panel',
            cls: 'loginformpanel',
            style: 'font-size:16px;',


            items: [{
                id: 'user title',
                html: '<div id="worklistSet">User Credentials</div>'
            }, {
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [{

                    html: '<div id="userlabel">Username</div>'

                },


                {
                    xtype: 'textfield',
                    id: 'username',
                    cls: 'username',

                    //value:'131329',
                    value: 'EAMailAddress',
                    maxLength: '50',

                    clearIcon: false,
                    //placeHolder:'EAMailAddress',

                }]
            }, {
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [{

                    html: '<div id="userlabel">Password</div>'

                },


                {
                    xtype: 'passwordfield',
                    name: 'password',
                    id: 'password',
                    //label : 'Password',
                    value: 'Welcome',
                    maxLength: '20',
                    //labelWidth: '54%',
                    clearIcon: false,
                    //placeHolder:'******'
                }]
            }, {
                xtype: 'togglefield',
                //cls : 'rightAligned',
                name: 'signon',
                labelWidth: '53%',
                label: 'Sign-On',
                id: 'toggle1',
                listeners: {

                    change: function (field, thumb, enabled, newValue, oldValue) {

                        if (newValue === 1) {
                            this.fireEvent('onmyclick', this);

                        } else {
                            this.fireEvent('onLogout', this);

                        }
                    }
                }


            }, {

                html: '<div id="loginstatus" class="loginstatus">LOGGED OFF </div>'
            },

            ]
        },


        {

            xtype: 'panel',
            cls: 'loginformpanel1',


            items: [{

                html: '<div id="worklistSet"> Worklist</div>'
            },



            {


                xtype: 'togglefield',
                name: 'pr',
                id: 'pr',
                label: 'Purchase Requisition',
                labelWidth: '53%',
                //value: 1,

                listeners: {
                    change: function (field, thumb, enabled, newValue, oldValue) {

                        if (newValue === 1) {

                            this.fireEvent('showpurchaserequisition', this);
                        } else {

                            this.fireEvent('hidepurchaserequisition', this);
                        }

                    }


                },

            }, {


                xtype: 'togglefield',
                //cls : 'rightAligned',
                name: 'expense',
                id: 'expense',
                label: 'Expense Reports',
                //disabled:'true',
                labelWidth: '53%',
                //value: 1,
                listeners: {
                    change: function (field, thumb, enabled, newValue, oldValue) {
                        if (newValue === 1) {

                            this.fireEvent('showexpensereport', this);
                        } else {

                            this.fireEvent('hideexpensereport', this);
                        }
                    }


                }


            }, {

                xtype: 'togglefield',
                //cls : 'rightAligned',
                name: 'po',
                id: 'po',
                label: 'Journal Entry',
                disabled: 'true',
                labelWidth: '53%',
                listeners: {
                    change: function (field, thumb, enabled, newValue, oldValue) {
                        if (newValue === 1) {
                            this.fireEvent('showpurchaseorder', this);
                        } else {
                            this.fireEvent('hidepurchaseorder', this);
                        }
                    }


                }


            }, {

                xtype: 'togglefield',
                //cls : 'rightAligned',
                name: 'cl',
                id: 'cl',
                label: 'Claims',
                disabled: 'true',
                labelWidth: '53%',
                listeners: {

                    change: function (field, thumb, enabled, newValue, oldValue) {
                        if (newValue === 1) {
                            this.fireEvent('showpurchaseorder', this);
                        } else {
                            this.fireEvent('hidepurchaseorder', this);
                        }
                    }


                },


            }, {
                html: '<div class="urlclass">Endpoint URL</div>'
            }, {
                xtype: 'textfield',
                id: 'url',
                label: '',
                labelWidth: '50%',
                clearIcon: false,
                value: 'http://entmobilityts.ea.com:8888/ea-erp',
                //value:'http://10.226.112.12:80/ea-erp',
                //value:'http://10.232.155.69:8888/ea-erp',
                //value:'http://10.255.56.102:888/ea-erp',

                maxLength: 77,


            }, ]
        },




        ]
    },

    updateRecord: function (newRecord) {
        if (newRecord) {

        }
    },

    initialize: function () {
        this.on('painted', this.setUsername);
    },

    setUsername: function () {

        if ((localStorage.getItem('username') == null) || (localStorage.getItem('username') == '') || (localStorage.getItem('password') == '') || (localStorage.getItem('urlValue')) == '') {
            Ext.getCmp('username').setValue('EA email address');
        } else {

            Ext.getCmp('username').setValue(localStorage.getItem('username'));
            Ext.getCmp('password').setValue(localStorage.getItem('password'));
            Ext.getCmp('url').setValue(localStorage.getItem('urlValue'));

            if (signontoggle) {
                Ext.getCmp('toggle1').setValue(1);
                document.getElementById('loginstatus').innerHTML = "LOGGED ON";
            }

            if (localStorage.getItem('prontoggle') == "true") {

                Ext.getCmp('pr').setValue(1);

            } else {
                Ext.getCmp('pr').setValue(0);
            }

            if (localStorage.getItem('erontoggle') == "true") {

                Ext.getCmp('expense').setValue(1);

            } else {
                Ext.getCmp('expense').setValue(0);
            }

        }
    
     

    }
});