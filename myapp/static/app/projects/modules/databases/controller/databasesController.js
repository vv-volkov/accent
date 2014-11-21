Ext.define('databases.controller.databasesController',{
    extend:'Ext.app.Controller',
    models:['databasesNavigModel'],
    stores:['databasesNavigStore'],
    views:['databasesNavigTree'],
    init:function(){
        this.control({
            'databasesnavigtree':{
                itemclick:function (view,rec,item,index,eventObj){
                    
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
            'databasesnavigtree button[itemId=add]':{
                click:this.add
            }
        })
    },
    refresh:function(btn){
        btn.up('panel').store.load();
    },
    add:function(btn){
        addDb(btn);
    }
});