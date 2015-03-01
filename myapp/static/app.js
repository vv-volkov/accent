Ext.Loader.setConfig({enabled:true, disableCaching:true});

Ext.Loader.setPath('Ext.ux','/static/ext-5.0.1/examples/ux');

Ext.require(['Ext.ux.TabReorderer','Ext.ux.BoxReorderer']);

Ext.application({
    name:'myapp',
    appFolder:'/static/app',
    requires:[
        'Ext.container.Viewport',
        'Ext.layout.container.Border'
    ],
    autoCreateViewport:true
});