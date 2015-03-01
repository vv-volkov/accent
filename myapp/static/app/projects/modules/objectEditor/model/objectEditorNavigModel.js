Ext.define('objectEditor.model.objectEditorNavigModel',{
    extend:'Ext.data.Model',
    idProperty:'id',
    fields:[{name:'text'},{name:'id'},{name:'id_parent'},{name:'leaf',type:'bool'},{name:'iconCls'}]
})