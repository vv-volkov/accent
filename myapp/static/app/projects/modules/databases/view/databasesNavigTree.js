Ext.define('databases.view.databasesNavigTree',{
    extend:'Ext.tree.Panel',
    store:'databasesNavigStore',
    alias:'widget.databasesnavigtree',
    rootVisible:false,
    border:false,
    dockedItems:[{
        xtype:'toolbar',
        itemId:'foldertbar',
        items:[{
            xtype:'button',
            icon:'/static/app/img/refresh.png',
            tooltip:'Обновить дерево',
            itemId:'refresh'
        },'-',{
            xtype:'button',
            icon:'/static/app/img/add.png',
            tooltip:'Добавить',
            width:32,
            menu:{
                xtype:'menu',
                items:[{
                    text:'Добавить тип',
                    itemId:'addType'
                },{
                    text:'Добавить источник',
                    itemId:'addDb'
                }]
            }
        }]
    }]
});