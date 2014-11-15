Ext.define('myapp.view.Viewport',{
    extend:'Ext.container.Viewport',
    layout:'fit',
    initComponent:function(){
        Ext.apply(this,{
            layout:{
                type:'border'
            },
            items:[{
                region:'north',
                xtype:'toolbar',
                itemId:'topMenu',
                ui:'footer',
                padding:'2 4 2 4',
                height:74,
                bodyStyle:'background-color:#DEECFC',
                border:0,  
                plugins:Ext.create('Ext.ux.BoxReorderer',{}),
                listeners:{
                    beforerender:function(){
                        loadTopMenu(this);
                    }
                }
            },{
                region:'center',
                xtype:'tabpanel',
                layout:'fit',
                itemId:'topTab',
                plugins:['tabreorderer',
                    Ext.create('Ext.ux.TabCloseMenu',{
                        closeTabText:'Закрыть вкладку',   
                        closeOthersTabsText:'Закрыть другие вкладки',
                        closeAllTabsText:'Закрыть все вкладки',
                        extraItemsTail:['-',{
                            text:'Обновить вкладку',
                            icon:'/static/app/img/refresh.png',
                            handler:function(){
                                var tab=Ext.ComponentQuery.query('#topTab')[0].getActiveTab();
                                if(tab.src||tab.contentEl) tab.contentEl.contentDocument.location.reload(true);                                     
                            }
                        },{
                            text:'Во весь экран',
                            icon:'/static/app/img/fullscreen.png',
                            handler:function(){
                                //var tab=Ext.ComponentQuery.query('#topTab')[0].getActiveTab();
                                //if(tab.src||tab.contentEl) tab.contentEl.contentDocument.location.reload(blank);  
                            }
                        }]
                    })
                ]                
            }]
        });
        this.callParent(arguments);
    }
});
function loadTopMenu(me){
    /* Функция загрузки основного меню системы */
    Ext.Ajax.request({
        url:'/static/app/json/topMenu.json',
        method:'GET',
        success:function(res,req){
            var data=Ext.decode(res.responseText,1);
            me.add(data);
        }
    })
}
