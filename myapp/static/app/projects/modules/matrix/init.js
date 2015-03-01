Ext.Loader.setConfig({enabled:true, disableCaching:true});

Ext.Loader.setPath('Ext.ux','/static/ext-5.0.1/examples/ux');

Ext.require(['Ext.ux.TabReorderer','Ext.ux.BoxReorderer','Ext.ux.TabCloseMenu']);

Ext.application({
    name:'matrix',
    appFolder:'/static/app/projects/modules/matrix',
    requires:[
        'Ext.container.Viewport',
        'Ext.layout.container.Border'
    ],
    controllers:['matrixController'],
    autoCreateViewport:true
});
