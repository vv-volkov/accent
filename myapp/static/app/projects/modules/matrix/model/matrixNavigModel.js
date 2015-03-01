Ext.define('matrix.model.matrixNavigModel',{
    extend:'Ext.data.Model',
    idProperty:'id',
    fields:[{name:'text'},{name:'id'},{name:'id_parent'},{name:'leaf',type:'bool'},{name:'iconCls'}]
})