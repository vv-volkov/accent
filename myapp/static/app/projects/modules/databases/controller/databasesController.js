Ext.define('databases.controller.databasesController',{
    extend:'Ext.app.Controller',
    models:['databasesNavigModel'],
    stores:['databasesNavigStore'],
    views:['databasesNavigTree'],
    init:function(){
        this.control({
            'databasesnavigtree':{
                itemclick:function (view,rec,item,index,eventObj){
                    if(rec.get('leaf')){
                        var tabpanel=view.up('viewport').down('tabpanel'),flag=true,i=0;
                        tabpanel.items.each(function(el){
                            if(el.src==rec.get('id')){
                                flag=false;
                                tabpanel.setActiveTab(i);
                            }
                            i++;
                        });
                        if(flag) createTabIframe(view,'/myapp/dbparams/?database='+rec.get('id'),rec.get('text'),'',rec.get('iconCls'));
                    }  
                },
                itemcontextmenu:function(view,rec,node,index,eventObj){
                    eventObj.stopEvent();
                    if(rec.get('leaf')){
                        Ext.create('Ext.menu.Menu', {
                            items:[{
                                text:'Параметры',
                                handler:function(){
                                  
                                }
                            },{
                                text:'Таблицы',
                                handler:function(){
                                
                                }
                            },{
                                text:'Инструкции',
                                handler:function(){
                                
                                }
                            },{
                                text:'Написать запрос',
                                handler:function(){
                                
                                }
                            }]
                        }).showAt(eventObj.getXY());
                    }
                }
            },
            'databasesnavigtree button[itemId=refresh]':{
                click:this.refresh 
            },
            'databasesnavigtree menuitem[itemId=addDb]':{
                click:this.addDb
            },
            'databasesnavigtree menuitem[itemId=addType]':{
                click:this.addType
            }
        })
    },
    refresh:function(btn){
        btn.up('panel').store.load();
    },
    addType:function(btn){
        addDb(btn,1);
    },
    addDb:function(btn){
        addDb(btn,2);
    }
});