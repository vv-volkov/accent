Ext.define('databases.view.DatabaseStrucView',{
    extend:'Ext.tree.Panel',
    store:'DatabaseStrucStore',
    alias:'widget.databasetree',
    rootVisible:false,
    border:false,
    viewConfig:{
        plugins:{
            ptype:'treeviewdragdrop',
            enableDrag:true
        },
        listeners:{
            itemcontextmenu: function(view, r, node, index, e) {
                e.stopEvent();
                if(r.get('leaf')){
                    Ext.create('Ext.menu.Menu', {
                        items:[{
                            text:'Параметры',
                            handler:function(){
                                var tab=createTabIframe(view,'databaseparams/',r.get('text')+' :: Параметры'),
                                frm=new Ext.create('Ext.form.Panel',{
                                    bodyStyle:'padding:4px',
                                    border:false,
                                    method:'POST',
                                    standardSubmit:false,
                                    items:[{
                                        xtype:'textfield',
                                        name:'server',
                                        fieldLabel:'Сервер'
                                    },{
                                        xtype:'textfield',
                                        name:'database',
                                        fieldLabel:'База данных'
                                    },{
                                        xtype:'textfield',
                                        name:'port',
                                        fieldLabel:'Порт'
                                    },{
                                        xtype:'textfield',
                                        name:'user',
                                        fieldLabel:'Логин'
                                    },{
                                        xtype:'textfield',
                                        name:'password',
                                        fieldLabel:'Пароль'
                                    }],
                                    dockedItems:[{
                                        xtype:'toolbar',
                                        items:[{
                                            xtype:'button',
                                            icon:'/static/app/img/save.png',
                                            tooltip:'Сохранить'
                                        },'-',{
                                            xtype:'button',
                                            icon:'/static/app/img/network.png',
                                            tooltip:'Проверить подключение к базе',
                                            itemId:'network',
                                            handler:function(){
                                                this.up('form').getForm().submit({url:'/myapp/testconnection',success:function(form,action){
                                                     Ext.MessageBox.show({
                                                         title:'Внимание',
                                                         msg:'Подключение удалось',
                                                         closable:true,
                                                         buttons:Ext.Msg.OK
                                                     });
                                                }});
                                            }
                                        }]
                                    }],
                                    listeners:{
                                        beforerender:function(){
                                            var obj={"server":r.get('server'),"database":r.get('database'),"port":r.get('port'),"user":r.get('user'),"password":r.get('password')},
                                            json=Ext.decode(JSON.stringify(obj),1);
                                            this.getForm().setValues(json);
                                        }
                                    }
                                });                                
                                tab.add(frm)
                            }
                        },{
                            text:'Таблицы',
                            handler:function(){
                                var tab=createTabIframe(view,'databasetables/',r.get('text')+' :: Таблицы');
                            }
                        },{
                            text:'Инструкции',
                            handler:function(){
                            
                            }
                        },{
                            text:'Создать запрос',
                            handler:function(){
                                var tab=createTabIframe(view,'databasequery/',r.get('text')+' :: Запрос','/static/app/img/sql.png');   
                            }
                        }]
                    }).showAt(e.getXY());
               }
               return false;
            },
            itemclick:function(view, r, node, index, e){
                if(r.get('leaf')){
                    var tab=createTabIframe(view,'databasetables/',r.get('text')+' :: Таблицы');
                }
            }
        }
    },
    dockedItems:[{
        xtype:'toolbar',
        itemId:'foldertbar',
        items:[{
            xtype:'button',
            icon:'/static/app/img/refresh.png',
            tooltip:'Обновить дерево баз данных',
            itemId:'refresh'
        }]
    }]
})