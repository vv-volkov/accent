/**
* Object Editor.
* The module is used to create new objects in the system
* and set their parameters.
*/
Ext.Loader.setConfig({enabled:true, disableCaching:true});

Ext.Loader.setPath('Ext.ux','/static/ext-5.0.1/examples/ux');

Ext.require(['Ext.ux.TabReorderer','Ext.ux.BoxReorderer','Ext.ux.TabCloseMenu']);

Ext.application({
    name:'objectEditor',
    appFolder:'/static/app/projects/modules/objectEditor',
    requires:[
        'Ext.container.Viewport',
        'Ext.layout.container.Border'
    ],
    controllers:['objectEditorController'],
    autoCreateViewport:true
});