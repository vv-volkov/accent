/* Hello world! */
Ext.Loader.setConfig({enabled:true, disableCaching:true});

Ext.Loader.setPath('Ext.ux','/static/ext-5.0.1/examples/ux');

Ext.require(['Ext.ux.TabReorderer','Ext.ux.BoxReorderer','Ext.ux.TabCloseMenu']);

Ext.application({
    name:'dynamics',
    appFolder:'/static/app/pages',
    requires:[
        'Ext.container.Viewport',
        'Ext.layout.container.Border'
    ],
    controllers:['FolderStrucController'],
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
                    xtype:'foldertree'
                }]            
            },{
                region:'center',
                xtype:'tabpanel',
                layout:'fit',
                itemId:'customTabPanel',
                plugins:['tabreorderer',
                    Ext.create('Ext.ux.TabCloseMenu',{
                        closeTabText:'Закрыть вкладку',   
                        closeOthersTabsText:'Закрыть другие вкладки',
                        closeAllTabsText:'Закрыть все вкладки',
                        extraItemsTail:['-',{
                            text:'Обновить вкладку',
                            icon:'/static/app/img/refresh.png',
                            handler:function(){
                                var tab=Ext.ComponentQuery.query('#customTabPanel')[0].getActiveTab();
                                if(tab.src||tab.contentEl)tab.contentEl.contentDocument.location.reload(true);                                
                            }
                        }]
                    })
                ], 
                items:[{
                    title:'Программа',
                    closable:false,
                    icon:'/static/app/img/run.png',
                    layout:'fit',
                    items:[{
                        xtype:'dynamicsprog'
                    }]
                },{
                    title:'Описание. Шаблон',
                    closable:false
                },{
                    title:'Описание. Документ',
                    closable:false
                }]
            }]
        });
    }
});