Ext.define('template.controller.templateController',{
    extend:'Ext.app.Controller',
    models:['templateNavigModel'],
    stores:['templateNavigStore'],
    views:['templateNavigTree'],
    init:function(){
        this.control({
            'templatenavigtree':{
                itemclick:function (view,rec,item,index,eventObj){
                    if(rec.get('leaf')){
                        var tabpanel=view.up('viewport').down('tabpanel'),flag=true,i=0;
                        tabpanel.items.each(function(el){
                            if(el.src==rec.get('id')){
                                flag=false;
                                tabpanel.setActiveTab(i);
                            }
                            i++;
                        });
                        if(flag) createTabIframe(view,'/myapp/loadcontenttotab/?filename='+rec.get('id'),rec.get('text'),'',rec.get('iconCls'));
                    }
                }
            },
            'templatenavigtree button[itemId=refresh]':{
                click:this.refresh 
            }
        })
    },
    refresh:function(btn){
        btn.up('panel').store.load();
    }
});