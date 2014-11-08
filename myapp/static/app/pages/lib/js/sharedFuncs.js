function createTabIframe(me,src,txt){
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
    var newTab=topTab.add({'title':txt,'closable':true,'layout':'fit',src:params['filename'],contentEl:iframe});
    topTab.setActiveTab(newTab);
}
function ajaxRequest(url,method,args,callback){
    Ext.Ajax.request({
        url:url,
        method:method,
        success:function(res,req){
            if(callback!=undefined)callback(args);
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
              var newNode={'text':txt,'id':id,'id_parent':id_parent,'leaf':((tp==1)?true:false)},
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
function doGitPush(me,txt){
    alert("Try to push!!!");
}
function doGitPull(me,txt){
    alert("Try to pull!!!");
}







