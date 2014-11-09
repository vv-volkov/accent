from django.conf.urls import url

from myapp import views

urlpatterns = [
    url(r'^$',views.index, name='index'),
    url(r'^dynamics',views.dynamics),
    url(r'^folderstruc',views.folderstruc),
    url(r'^loadcontenttotab',views.loadcontenttotab),
    url(r'^createFile',views.createFile),
    url(r'^createFolder',views.createFolder),
    url(r'^removeFile',views.removeFile),
    url(r'^removeFolder',views.removeFolder),
    url(r'^renameFileFolder',views.renameFileFolder),
    url(r'^saveSourceCode',views.saveSourceCode),
    url(r'^code',views.code),
    url(r'^moveFileFolder',views.moveFileFolder),
    url(r'^gitStatus',views.gitStatus),
    url(r'^gitAdd',views.gitAdd),
    url(r'^gitmodified',views.gitmodified),
    url(r'^gitPush',views.gitPush),
    url(r'^databases',views.databases),
    url(r'^databaseparams',views.databaseparams),
    url(r'^testconnection',views.testconnection),  
    url(r'^databasetables',views.databasetables),   
    url(r'^databasetablelist',views.databasetablelist),
]