Ext.define('databases.controller.DatabaseStrucController',{
    extend:'Ext.app.Controller',
    models:['DatabaseStrucModel'],
    stores:['DatabaseStrucStore'],
    views:['DatabaseStrucView'],
    init:function(){
        this.control({
            'databasetree button[itemId=refresh]':{
                click:this.refresh
            }
        })
    },
    refresh:function(btn){
        btn.up('panel').store.load();
    }
})