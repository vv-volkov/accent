Ext.define('objectEditor.view.objectEditorNavigTree',{
    extend:'Ext.tree.Panel',
    store:'objectEditorNavigStore',
    alias:'widget.objectEditornavigtree',
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
        	iconCls:'icon-save',
            tooltip:Loc.save
        },'-',{
            iconCls:'icon-refresh',
            tooltip:Loc.refresh
        },'-',{
            iconCls:'icon-addobject',
            tooltip:Loc.addobject
        },'',{
            iconCls:'icon-addfieldset',
            tooltip:Loc.addfieldset
        },'',{
            iconCls:'icon-addfield',
            tooltip:Loc.addfield
        },'-',{
            iconCls:'icon-addsubobject',
            tooltip:Loc.addsubobject
        },'',{
            iconCls:'icon-addclone',
            tooltip:Loc.addclone
        },'-',{
            iconCls:'icon-moveup',
            tooltip:Loc.moveup
        },{
            iconCls:'icon-movedown',
            tooltip:Loc.movedown
        },'-',{
            iconCls:'icon-delete',
            tooltip:Loc.delete
        }]
    }]
});