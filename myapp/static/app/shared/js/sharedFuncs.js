function createTabIframe(me,src,txt,icon,iconCls){
    var topTab=me.up('viewport').down('tabpanel'),
    query=src.substring(src.indexOf('?')+1).split('&'),
    params={},
    temp;
    iframe=document.createElement('iframe');
    iframe.setAttribute('frameborder',0);
    iframe.setAttribute('scrolling','no');
    iframe.setAttribute('style','border:0px none;width:100%;height:100%;');
    iframe.setAttribute('src',src);
    for(var i=0;i<query.length;i++){
        temp=query[i].split('=');
        params[temp[0]]=temp[1]
    }
    var newTab=topTab.add({'title':txt,'tooltip':txt,'icon':(icon!=undefined)?icon:'','iconCls':(iconCls!=undefined)?iconCls:'','closable':true,'layout':'fit',src:params['filename'],contentEl:iframe});
    topTab.setActiveTab(newTab);
    return newTab;
}
function ajaxRequest(url,method,args,callback){
    Ext.Ajax.request({
        url:url,
        method:method,
        success:function(res,req){
            if(callback!=undefined)callback(args,res);
        }
    });
}
function createFileFolder(me,tp){
  Ext.MessageBox.show({
      title:'Название '+((tp==1)?'файла':'директории'),
      msg:'',
      buttons:Ext.MessageBox.OKCANCEL,
      prompt:true,
      fn:function(btn,txt,cBoxes){
          if(btn=='ok'&&txt!=""){
              //1. Если не выбрано ни одного файла в дереве, кладем в корень модуля
              //2. Если выбран файл, то кладем в ту же категорию, в которой он лежит
              //3. Если выбрана директория, то кладем в нее
              var node=me.getSelectionModel().getSelection()[0],id="",id_parent="";
              if(node){
                  if(node.get('leaf')){
                      id=node.get('id_parent');
                      node=node.parentNode;
                  }
                  else id=node.get('id');
              }
              else {
                  node=me.getRootNode();
                  id=node.get('id');
              }
              id_parent=id;
              id+='/'+txt;
              var newNode={'text':txt,'id':id,'iconCls':fileextension(txt),'id_parent':id_parent,'leaf':((tp==1)?true:false)},
              args={'node':node,'newNode':newNode};
              ajaxRequest('/myapp/create'+((tp==1)?'File/':'Folder/')+'?filename='+id,'GET',args,function(){
                  args['node'].insertBefore(args['newNode'],args['node'].firstChild);
              });
           }
       }
   });
}
function removeFileFolder(me,tp){
    var node=me.getSelectionModel().getSelection()[0];
    if(node&&node.get('leaf')&&tp==2){
        Ext.Msg.alert('Внимание','Необходимо выбрать директорию');
    }
    else if(node&&!node.get('leaf')&&tp==1){
        Ext.Msg.alert('Внимание','Необходимо выбрать файл');
    }
    else if(node){
        Ext.MessageBox.show({
            title:'Подтвердите',
            msg:'Вы уверены, что хотите удалить?',
            buttons:Ext.MessageBox.OKCANCEL,
            fn:function(btn){
                if(btn=='ok'){
                    if(tp==1){
                        var tabpanel=me.up('viewport').down('tabpanel');
                        tabpanel.items.each(function(el){
                            if(el.src==node.get('id')){
                                el.destroy();
                                tabpanel.setActiveTab(0);
                            }
                        });
                    }
                    var args={'node':node};
                    ajaxRequest('/myapp/remove'+((tp==1)?'File/':'Folder/')+'?filename='+node.get('id'),'GET',args,function(){
                        args['node'].remove();
                    });                    
                }
            }
        });
    }
    else {
        Ext.Msg.alert('Внимание','Необходимо выбрать '+((tp==1)?'файл':'директорию'));
    }
}
function renameFileFolder(me,tp){
    var node=me.getSelectionModel().getSelection()[0],newname="";
    if(node&&node.get('leaf')&&tp==2){
        Ext.Msg.alert('Внимание','Необходимо выбрать директорию');
    }
    else if(node&&!node.get('leaf')&&tp==1){
        Ext.Msg.alert('Внимание','Необходимо выбрать файл');
    }
    else if(node){
        Ext.MessageBox.show({
            title:'Название '+((tp==1)?'файла':'директории'),
            msg:'',
            buttons:Ext.MessageBox.OKCANCEL,
            prompt:true,
            fn:function(btn,txt,cBoxes){
                 if(btn=='ok'&&txt!=""){
                    newname=node.get('id_parent')+'/'+txt;
                    if(tp==1){
                        var tabpanel=me.up('viewport').down('tabpanel');
                        tabpanel.items.each(function(el){
                            if(el.src==node.get('id')){
				                el.setTitle(txt);
                                el.src=newname;
                            }
                        });
                    }
                    var newNode={'text':txt,'id':newname,'id_parent':node.get('id_parent'),'leaf':((tp==1)?true:false)},
                    args={'node':node,'parentNode':node.parentNode,'newNode':newNode};
                    ajaxRequest('/myapp/renameFileFolder/?oldname='+node.get('id')+'&newname='+newname,'GET',args,function(){
                        args['node'].remove();
                        args['parentNode'].insertBefore(args['newNode'],args['parentNode'].firstChild);
                    });
                 }
             }
        });
    }
    else {
        Ext.Msg.alert('Внимание','Необходимо выбрать '+((tp==1)?'файл':'директорию'));
    }
}
function reloadFolderTree(treeStore,node){
    treeStore.setRootNode(node);
    treeStore.load();
}
function moveFileFolder(src,dest,filename){
    ajaxRequest('/myapp/moveFileFolder/?src='+src+'&dest='+dest+'/'+filename,'GET',{},function(){});
}
function doGitStatus(me,txt){
    createTabIframe(me,'/myapp/gitStatus',txt);
}
function doGitPush(me){
    mymask=new Ext.LoadMask(me.up('viewport').down('panel'),{msg:'Операция выполняется'});
    mymask.show();
    args={'mask':mymask};
    ajaxRequest('/myapp/gitPush/','GET',args,function(){
        args['mask'].destroy();
        Ext.Msg.alert('Внимание','Операция выполнена');    
    });
}
function doGitPull(me,txt){
    ajaxRequest('/myapp/gitPull/','GET',{},function(){});
}
function createWindowFormAction(parentObj,offset,txt,dbObj,args,icon,method,saveBtn,callbackcreate,callbacksave){
    var width=parentObj.height*1.6;
    Ext.create('Ext.window.Window',{
        title:txt,
        width:width,
        height:parentObj.height,
        modal:true,
        closable:true,
        items:[],
        layout:'fit',
	    icon:(icon&&(icon!=undefined))?icon:'',
        itemId:'openWindow',
        listeners:{
            render:function(){
                //Если не статическая форма, а объект БД
                var me=this;
                if(dbObj){
                    Ext.Ajax.request({
                        url:'/myapp/getDbObj/',
                        method:'POST',
                        params:args,
                        success:function(res,req){
                            var json=Ext.decode(res.responseText,1);                            
                            Ext.Ajax.request({
                                url:'/myapp/matchvals/?table='+args['table'],
                                method:'GET',
                                success:function(res,req){
                                    var vals=Ext.decode(res.responseText,1);
                                    frm=Ext.create('Ext.form.Panel',{
                                        border:false,
                                        bodyStyle:'padding:4px;background:url(/static/app/img/bgo.png)',
                                        autoScroll:true,
                                        defaults:{
                                            anchor:'100%'
                                        },
                                       items:json,
                                       itemId:'openForm',
                                       submitEmptyText:false,
                                       standardSubmit:false,
                                       listeners:{
                                           beforerender:function(){
                                               callbackcreate();
                                               rendercard(this);  
                                               if(vals&&vals!=""&&vals!=null){
                                                   this.getForm().setValues(JSON.parse(vals));
                                                   //alert();
                                               }
                                          }
                                       }
                                   });
                                   me.add(frm); 
                                }
                            });
                            
                        }
                    });
                }
            }
        },
        buttons:[{
            text:'Сохранить',
            icon:'/static/app/img/save.png',
            handler:function(){
                callbacksave()
            },
            listeners:{
                render:function(){
                    if(!saveBtn) this.destroy();
                }
            }
        },{
            text:'Закрыть',
            icon:'/static/app/img/close.png',
            handler:function(){
                this.up('window').destroy();
            }
        }]
    }).show();
}
function fileextension(filename){
    return filename.substring(filename.lastIndexOf('.')+1)
}
function rendercard(frm){
    frm.suspendLayouts();
    var i=0;
    frm.getForm().getFields().each(function(field){
        if(!field.hidden){
            if((i%2)==0)field.addCls('formnostripe')
            else field.addCls('formstripe')
            i++;
        }
    });
    frm.resumeLayouts();
}
function formSubmit(items,url,callback){
    var frm=Ext.create('Ext.form.Panel',{
            method:'POST',
            standardSubmit:false,
            items:items
         });                               
    frm.getForm().submit({url:url,success:function(form,action){
        callback()
    }});
}
function getTableFields(items,query,url,panel,callback){
    var frm=Ext.create('Ext.form.Panel',{
            method:'POST',
            standardSubmit:false,
            items:items
         });                               
    frm.getForm().submit({url:url,success:function(form,action){
        panel.items.each(function(item){
            item.destroy();
        });
        Ext.create('Ext.data.JsonStore',{
            autoLoad:true,
            storeId:'gridtable',
            fields:action.result.message,
            //leadingBufferZone:300,
            //pageSize:100,
            proxy:{
                type:'ajax',
                url:'/myapp/dynamicdatatable/',
                actionMethods:{
                    read:'POST'
                },
                reader:{
                    type:'json',
                    root:'items',
                    totalProperty:'total'
                },
                extraParams:{query:query}
            }
        }); 
        var grid=Ext.create('Ext.grid.Panel',{
            border:false,
            store:Ext.data.StoreManager.lookup('gridtable'),
            columns:action.result.message,
            columnLines:true,
            selModel:Ext.create('Ext.selection.CheckboxModel',{mode:'MULTI'})
        });
        panel.add(grid);
    }});
}
function savecontent(if_alert,callback){
    var cw=document.getElementById("iframedata").contentWindow,
    val=cw.getCodeMirrorValue(),
    path=cw.getPath(),
    items=[{xtype:'textarea',name:'sourcecode',value:val},{xtype:'textfield',name:'path',value:path}];
    formSubmit(items,'/myapp/saveSourceCode/',function(){
        if(if_alert) Ext.MessageBox.show({
            title:'Внимание',
            msg:'Действия выполнены',
            closable:true,
            buttons:Ext.Msg.OK
        });
        callback();
    });
}
function compilefortran(path,p){
    var mymask=new Ext.LoadMask({msg:'Выполняется компиляция',target:p});
    mymask.show();
    Ext.Ajax.request({
        url:'/myapp/compilefortran/?path='+path,
        method:'GET',
        success:function(res,req){
            mymask.destroy();   
            Ext.MessageBox.show({
                title:'Внимание',
                msg:'Компиляция завершена',
                closable:true,
                buttons:Ext.Msg.OK
            });
        }
    });
}
function lineCurve2D(me,tp){
    if(tp==1) var plotId='#LineCurve2D';
    else if(tp==2) var plotId='#Surface3D';
    var mymask=new Ext.LoadMask({msg:'Происходит построение...',target:me.down(plotId)});
    mymask.show();
    Ext.Ajax.request({
        url:'/myapp/lineCurve2D/?tp='+tp,
        method:'GET',
        success:function(res,req){            
            var image = Ext.decode(res.responseText,1),
            plot=me.down(plotId);
            plot.items.each(function(el){
                el.destroy();
            });
            var wd=me.down(plotId).getWidth()-20,
                ht=me.down(plotId).getHeight()-20;
            plot.add({xtype:'panel',height:ht,wisth:wd, html:'<img src="data:image/png;base64, '+image.src+'" width="'+wd+'px" height="'+ht+'px" style="width:'+wd+'px;height:'+ht+'px"/>'});         
            mymask.destroy();
        }
    });
}
function optimize(me){
    var x0=me.down('#x0').getValue(),y0=me.down('#y0').getValue(),
        delta=me.down('#delta').getValue(),theta=me.down('#theta').getValue(),
        method=me.down('#method').getValue();
    var mymask=new Ext.LoadMask({msg:'Происходит построение...',target:me.down('#Map2D')});
    mymask.show();
    Ext.Ajax.request({
        url:'/myapp/optimize/?x0='+x0+'&y0='+y0+'&delta='+delta+'&theta='+theta+'&method='+method,
        method:'GET',
        success:function(res,req){
            var image = Ext.decode(res.responseText,1),
            plot=me.down('#Map2D');
            plot.items.each(function(el){
                el.destroy();
            });
            var wd=me.down('#Map2D').getWidth()-20,
                ht=me.down('#Map2D').getHeight()-20;
            plot.add({xtype:'panel',height:ht,wisth:wd, html:'<img src="data:image/png;base64, '+image.src+'" width="'+wd+'px" height="'+ht+'px" style="width:'+wd+'px;height:'+ht+'px"/>'});         
            mymask.destroy();
            me.down('form').getForm().setValues(image)
        }
    });
}



