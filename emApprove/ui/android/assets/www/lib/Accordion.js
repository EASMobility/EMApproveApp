Ext.define('ux.layout.Accordion', {
    extend: 'Ext.layout.Default',
    alias: 'layout.accordion',
    requires: ['Ext.TitleBar'],
    itemCls: Ext.baseCSSPrefix + 'layout-accordion-item',
    itemAnimCls: Ext.baseCSSPrefix + 'layout-accordion-item-anim',
    itemArrowCls: Ext.baseCSSPrefix + 'accordion-arrow',
    itemArrowExpandedCls: Ext.baseCSSPrefix + 'accordion-arrow-expanded',
    config: {
        expandedItem: null,
        mode: 'SINGLE'
    },
    constructor: function (container) {
        this.callParent(arguments);
        if (this.getMode() === 'SINGLE') {
            container.on('show', 'checkMode', this, {
                single: true
            });
        } else {
            container.on('show', 'checkMultiMode', this, {
                single: true
            });
        }
    },
    checkMode: function (container) {
        var items = container.getInnerItems(),
            i = 0,
            iNum = items.length,
            item, lastItem;
        for (; i < iNum; i++) {
            item = items[i];
            if (!item.collapsed) {
                if (lastItem) {
                    this.collapse(lastItem);
                }
                lastItem = item;
            }
        }
    },
    checkMultiMode: function (container) {
        var items = container.getInnerItems(),
            iNum = items.length - 1;
        this.lastItem = items[iNum];
        //this.accitems=[];
        //this.accitems[0] = items[0];
        //this.accitems[1] = items[1];
        //this.accitems[2] = items[iNum];
    },
    insertItem: function (item, index) {
        var me = this;
        me.callParent([item, index]);
        if (item.isInnerItem()) {
            categoryid++;
            var titleDock = item.titleDock = item.insert(0, {
                xtype: 'titlebar',
                docked: 'top',
                title: this.getTitle(index),
                cls: 'categorytitle',
                id: 'categorytitle' + categoryid,
                items: [{
                    xtype: 'button',
                    id: 'categorybadge' + categoryid,
                    cls: 'categorybadge',
                    badgeCls: 'x-badge redRoundCircle',
                    badgeText: '3',
                    align: 'right',
                    //ui :'confirm'
                }, {
                    cls: me.itemArrowCls,
                    ui: 'plain',
                    align: 'right',
                    scope: me,
                    handler: 'handleToggleButton'
                }]
            }),
                arrowBtn = item.arrowButton = titleDock.down('button[cls=' + me.itemArrowCls + ']');
            item.addCls(me.itemCls);
            arrowBtn.addCls(me.itemArrowExpandedCls);
            item.on('painted', function () {
                item.addCls(me.itemAnimCls);
            }, me, {
                single: true
            });
            //item.collapsed=true;
            if (item.collapsed) {
                item.on('painted', 'collapse', me, {
                    single: true
                });
            } else if (me.getMode() === 'SINGLE') {
                me.setExpandedItem(item);
            }
        }
    },
    handleToggleButton: function (btn) {
        var component = btn.up('titlebar').up('component');
        this.toggleCollapse(component);
    },
    toggleCollapse: function (component) {
        /* for(var i=0;i<3;i++){
	if(this.accitems[i].id!=component.id)
	  if(this.accitems[i].collapsed==false){
	 this['collapse'](this.accitems[i]);
	    }
		
		
	}*/
        this[component.collapsed ? 'expand' : 'collapse'](component);
    },
    collapse: function (component) {
        if (component.isInnerItem() && !(this.getMode() === 'SINGLE' && this.getExpandedItem() === component)) {
            var titleDock = component.titleDock,
                titleHeight = titleDock.element.getHeight();
            component.fullHeight = component.element.getHeight();
            component.setHeight(titleHeight);
            if (component.id == 'ExpenseReportContainer') {
                Ext.getCmp('erlist').hide();
                Ext.getCmp('erlist').addCls('minimised_ercontainer2');
            } else if (component.id == 'PurchaseRequisitionContainer') {
                Ext.getCmp('prlist').hide();
                Ext.getCmp('prlist').addCls('minimised_prcontainer8');
            }
            /*
               alert("Ext.getCmp('polist').hidden = "+Ext.getCmp('polist').hidden)
               alert("Ext.getCmp('erlist').hidden = "+Ext.getCmp('erlist').hidden)
               //if(component)
               if(Ext.getCmp('polist').hidden && Ext.getCmp('erlist').hidden)
            	   {
            	   component.setHeight(47);
            	   }
               
               Ext.getCmp('ext-component-9').setHeight(0);*/
            //this.PurchaseOrder = Ext.getCmp('ext-container-5');
            //this.PurchaseOrder.setHeight(0);
            component.collapsed = true;
            component.arrowButton.removeCls(this.itemArrowExpandedCls);
        }
    },
    expand: function (component) {
        if (component.isInnerItem()) {
            if (this.getMode() === 'SINGLE') {
                var expanded = this.getExpandedItem();
                this.setExpandedItem(component);
                this.collapse(expanded);
            }
            component.setHeight(component.fullHeight);
            component.collapsed = false;
            component.arrowButton.addCls(this.itemArrowExpandedCls);
            if (component.id == 'ExpenseReportContainer') {
                Ext.getCmp('erlist').show();
                Ext.getCmp('erlist').addCls('minimised_ercontainer2');
            } else if (component.id == 'PurchaseRequisitionContainer') {
                Ext.getCmp('prlist').show();
                Ext.getCmp('prlist').addCls('minimised_prcontainer8');
            }
        }
    },
    handleExpandCollapseScenarios: function () {
        
    },
    getTitle: function (index) {
        switch (index) {
            case 0:
                return "Expense Report";
            case 1:
                return "Purchase Requisition";
            default:
                return "Test";
        }
    }
});