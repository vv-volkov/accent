Ext.define('databases.view.Viewport',{
    extend:'Ext.container.Viewport',
    layout:'fit',    
    initComponent:function(){
        Ext.apply(this,{
            layout:{
                type:'border'
            },
            items:[{
                region:'west',
                layout:'fit',
                width:280,
                collapsible:true,
                collapseMode:'mini',
                split:true,
                autoScroll:true,
                items:[{
                    xtype:'databasesnavigtree'
                }]
            },{
                region:'center',
                xtype:'tabpanel',
                layout:'fit',
                itemId:'topTab',
                plugins:['tabreorderer']                
            }]
        });
        this.callParent(arguments);
    }
});