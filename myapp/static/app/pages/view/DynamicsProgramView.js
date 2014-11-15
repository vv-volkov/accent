Ext.define('dynamics.view.DynamicsProgramView',{
    extend:'Ext.form.Panel',
    alias:'widget.dynamicsprog',
    layout:'border',
    border:false,
    defaults:{
        border:false
    },
    items:[{
        region:'west',
        xtype:'panel',
        width:'40%',
        preventHeader:true,
        collapsible:true,
        collapseMode:'mini',
        split:true,
        layout:'border',
        defaults:{
            autoScroll:true,
            collapsible:true,
            height:'50%'
        },
        items:[{
            region:'north',
            title:'Математическая модель',
            contentEl:'math'
        },{
            region:'center',
            xtype:'form',
            title:'Настройка',  
            bodyStyle:'padding:4px;',
            items:[{
                xtype:'fieldset',
                title:'Параметры',
                layout:'column',
                defaults:{
                    margin:'2 0 2 0'
                },
                items:[{
                    xtype:'label',
                    contentEl:'z0',
                    columnWidth:'0.2'
                },{
                    xtype:'numberfield',
                    columnWidth:'0.8',
                    value:'1.5'
                },{
                    xtype:'label',
                    contentEl:'R',
                    columnWidth:'0.2'
                },{
                    xtype:'numberfield',
                    columnWidth:'0.8',
                    value:'0.3'
                },{
                    xtype:'label',
                    contentEl:'q',
                    columnWidth:'0.2'
                },{
                    xtype:'numberfield',
                    columnWidth:'0.8',
                    value:'5'
                }]
            }],
            dockedItems:[{
                xtype:'toolbar',
                dock:'bottom',
                ui:'footer',
                items:[{
                    xtype:'button',
                    text:'Обновить',
                    icon:'/static/app/img/refresh.png',
                    handler:function(){
                        this.up('form').getForm().reset();
                    }
                },{
                    xtype:'button',
                    text:'Рассчитать',
                    icon:'/static/app/img/chart_line.png',
                    handler:function(){
                    
                    }
                }]
            }]
        }]
    },{
        region:'center',
        xtype:'panel',
        title:'Графики и диаграммы',
        width:'60%'
    }]
})