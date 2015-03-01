Ext.define('init.view.FolderStrucView',{
    extend:'Ext.tree.Panel',
    store:'FolderStrucStore',
    alias:'widget.foldertree',
    rootVisible:false,
    border:false,
    viewConfig:{
        plugins:{
            ptype:'treeviewdragdrop',
            enableDrag:true
        }
    },
    dockedItems:[{
        xtype:'toolbar',
        itemId:'foldertbar',
        items:[{
            xtype:'button',
            icon:'/static/app/img/refresh.png',
            tooltip:'Обновить дерево файлов',
            itemId:'refresh'
        },'-',{
            xtype:'button',
            icon:'/static/app/img/add.png',
            tooltip:'Добавить',
            width:32,
            menu:{
                xtype:'menu',
                items:[{
                    text:'Добавить файл',
                    icon:'/static/app/img/page.png',
                    itemId:'addFile'
                },{
                    text:'Добавить директорию',
                    icon:'/static/app/img/folder.png',
                    itemId:'addFolder'
                },'-',{
                    text:'Добавить модуль',
                    itemId:'addModule'
                }]
            }
        },'',{
            xtype:'button',
            icon:'/static/app/img/puzzle.png',
            tooltip:'Изменить',
            width:32,
            menu:{
                xtype:'menu',
                items:[{
                    text:'Изменить имя файла',
                    icon:'/static/app/img/page.png',
                    itemId:'renameFile'
                },{
                    text:'Изменить имя директории',
                    icon:'/static/app/img/folder.png',
                    itemId:'renameFolder'
                }]
            }
        },'',{
            xtype:'button',
            icon:'/static/app/img/remove.png',
            tooltip:'Удалить',
            width:32,
            menu:{
                xtype:'menu',
                items:[{
                    text:'Удалить файл',
                    icon:'/static/app/img/remove_page.png',
                    itemId:'removeFile'
                },{
                    text:'Удалить директорию',
                    icon:'/static/app/img/remove_folder.png',
                    itemId:'removeFolder'
                }]
            }
        },'-',{
            xtype:'button',
            icon:'/static/app/img/folder_tree.png',
            tooltip:'Файловая структура',
            width:32,
            menu:{
                xtype:'menu',
                items:[{
                    text:'Проекты',
                    itemId:'refreshCurrent'
                },{
                    text:'Вся система',
                    itemId:'refreshAll'
                }]
            }
        },'',{
            xtype:'button',
            icon:'/static/app/img/git.png',
            tooltip:'Cинхронизация с сервером',
            width:32,
            menu:{
                xtype:'menu',
                items:[{
                    text:'Статус',
                    itemId:'gitStatus'
                },{
                    text:'Передать на сервер',
                    itemId:'gitPush'
                },{
                    text:'Получить с сервера',
                    itemId:'gitPull'
                }]
            }
        }]
    }]
});




