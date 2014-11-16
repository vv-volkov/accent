Ext.Loader.setConfig({enabled:true, disableCaching:true});

Ext.Loader.setPath('Ext.ux','/static/ext-5.0.1/examples/ux');

Ext.require(['Ext.ux.TabReorderer','Ext.ux.BoxReorderer','Ext.ux.TabCloseMenu']);

Ext.application({
    name:'databases',
    appFolder:'/static/app/pages',
    requires:[
        'Ext.container.Viewport',
        'Ext.layout.container.Border'
    ],
    controllers:['DatabaseStrucController'],
    autoCreateViewport:false,
    launch:function(){
        Ext.create('Ext.container.Viewport',{
            layout:'border',
            items:[{
                region:'west',
                layout:'fit',
                width:260,
                collapsible:true,
                collapseMode:'mini',
                split:true,
                autoScroll:true,
                items:[{
                    xtype:'databasetree'
                }]
            },{
                region:'center',
                xtype:'tabpanel',
                layout:'fit'
            }]
        });
    }
});