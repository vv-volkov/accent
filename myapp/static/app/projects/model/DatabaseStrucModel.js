Ext.define('databases.model.DatabaseStrucModel',{
    extend:'Ext.data.Model',
    idProperty:'id',
    fields:[{name:'text'},{name:'id'},{name:'id_parent'},{name:'leaf',type:'bool'},{name:'server'},{name:'database'},{name:'port'},{name:'user'},{name:'password'}]
})