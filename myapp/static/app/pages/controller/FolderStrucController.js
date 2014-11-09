Ext.define('dynamics.controller.FolderStrucController',{
    extend:'Ext.app.Controller',
    models:['FolderStrucModel'],
    stores:['FolderStrucStore'],
    views:['FolderStrucView','DynamicsProgramView'],
    init:function(){
        this.control({
            'foldertree':{
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
                        if(flag) createTabIframe(view,'/myapp/loadcontenttotab/?filename='+rec.get('id'),rec.get('text'));
                    }
                },
                itemmove:function(item,oldParent,newParent,index,eOpts){
                    if(item.get('id_parent')!=newParent.get('id'))
                        moveFileFolder(item.get('id'),newParent.get('id'),item.get('text'));
                }
            },
            'foldertree button[itemId=refresh]':{
                click:this.refresh
            },
            'foldertree menuitem[itemId=addFile]':{
                click:this.addFile
            },
            'foldertree menuitem[itemId=addFolder]':{
                click:this.addFolder
            },
            'foldertree menuitem[itemId=renameFile]':{
                click:this.renameFile
            },
            'foldertree menuitem[itemId=renameFolder]':{
                click:this.renameFolder
            },
            'foldertree menuitem[itemId=removeFile]':{
                click:this.removeFile
            },
            'foldertree menuitem[itemId=removeFolder]':{
                click:this.removeFolder
            },
            'foldertree menuitem[itemId=refreshCurrent]':{
                click:this.refreshCurrent
            },
            'foldertree menuitem[itemId=refreshAll]':{
                click:this.refreshAll
            },           
            'foldertree menuitem[itemId=gitStatus]':{
                click:this.gitStatus
            },
            'foldertree menuitem[itemId=gitPush]':{
                click:this.gitPush
            },
            'foldertree menuitem[itemId=gitPull]':{
                click:this.gitPull
            },
            'foldertree menu':{
                mouseleave:function(menu){
                    menu.hide();
                }
            }
        });
    },
    refresh:function(btn){
        btn.up('panel').store.load();
    },
    addFile:function(menuitem){
        createFileFolder(menuitem.up('button').up('panel'),1);
    },
    addFolder:function(menuitem){
        createFileFolder(menuitem.up('button').up('panel'),2);
    },
    renameFile:function(menuitem){
        renameFileFolder(menuitem.up('button').up('panel'),1);
    },
    renameFolder:function(menuitem){
        renameFileFolder(menuitem.up('button').up('panel'),2);
    },
    removeFile:function(menuitem){
        removeFileFolder(menuitem.up('button').up('panel'),1);
    },
    removeFolder:function(menuitem){
        removeFileFolder(menuitem.up('button').up('panel'),2);
    },
    refreshCurrent:function(menuitem){
        var treeStore=menuitem.up('button').up('panel').store,
        node={expanded:true,id:'./myapp/static/app/pages'};
        reloadFolderTree(treeStore,node);
    },
    refreshAll:function(menuitem){
        var treeStore=menuitem.up('button').up('panel').store,
        node={expanded:true,id:'./myapp/'};
        reloadFolderTree(treeStore,node);
    },
    gitStatus:function(menuitem){
        doGitStatus(menuitem,menuitem.text);
    },
    gitPush:function(menuitem){
        doGitPush(menuitem,menuitem.text);
    },
    gitPull:function(menuitem){
        doGitPull(menuitem,menuitem.text);
    }
});

