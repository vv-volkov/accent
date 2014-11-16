from django.conf.urls import url

from myapp import views

urlpatterns = [
    url(r'^$',views.index, name='index'),
    url(r'^projects/',views.projects),
    url(r'^folderstruc/',views.folderstruc),
    url(r'^loadcontenttotab/',views.loadcontenttotab),
    url(r'^createFile/',views.createFile),
    url(r'^createFolder/',views.createFolder),
    url(r'^removeFile/',views.removeFile),
    url(r'^removeFolder/',views.removeFolder),
    url(r'^renameFileFolder/',views.renameFileFolder),
    url(r'^saveSourceCode/',views.saveSourceCode),
    url(r'^code/',views.code),
    url(r'^moveFileFolder/',views.moveFileFolder),
    url(r'^gitStatus/',views.gitStatus),
    url(r'^gitAdd/',views.gitAdd),
    url(r'^gitmodified/',views.gitmodified),
    url(r'^gitPush/',views.gitPush),
    url(r'^databases/',views.databases),
    url(r'^databaseparams/',views.databaseparams),
    url(r'^testconnection/',views.testconnection),  
    url(r'^databasetables/',views.databasetables),   
    url(r'^databasetablelist/',views.databasetablelist),
    url(r'^getDbObj/',views.getDbObj),  
    url(r'^tabledata/',views.tabledata),  
    url(r'^tablecolumns/',views.tablecolumns), 
    url(r'^tablegrid/',views.tablegrid),
    url(r'^databasequery/',views.databasequery), 
    url(r'^gettablefields/',views.gettablefields), 
    url(r'^dynamicdatatable/',views.dynamicdatatable),
    url(r'^saveMatchAttr/',views.saveMatchAttr),
    url(r'^matchvals/',views.matchvals), 
    url(r'^exportdata/',views.exportdata),  
    url(r'^compilefortran/',views.compilefortran), 
    url(r'^givens/',views.givens),
    url(r'^program/',views.program), 
    url(r'^lineCurve2D/',views.lineCurve2D),
]
