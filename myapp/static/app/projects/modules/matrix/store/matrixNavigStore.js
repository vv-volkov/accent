Ext.define('matrix.store.matrixNavigStore',{
    extend:'Ext.data.TreeStore',
    model:'matrix.model.matrixNavigModel',
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
        id:'./myapp/static/app/projects/modules/matrix/'
    }
});