Ext.define('init.store.FolderStrucStore',{
    extend:'Ext.data.TreeStore',
    model:'init.model.FolderStrucModel',
    autoLoad:true,
    proxy:{
        type:'ajax',
        url:'/myapp/folderstruc'
    },
    snapshot:{
        text:'',
        expanded:true,
        id:'./myapp/'
    },
    root:{
        text:'',
        expanded:true,
        id:'./myapp/static/app/projects/'
    }
})