#--coding: utf-8
from django.shortcuts import render
from django.http import HttpResponse
from django.template import RequestContext, Context, loader
from django.core import serializers
from django.core.context_processors import csrf
from django.views.decorators.csrf import csrf_exempt
from subprocess import *


import os
import json
import codecs
import shutil
import string
import pyodbc

repoDir = '.'

def index(request):
    template = loader.get_template('myapp/index.html')
    context = RequestContext(request,{})
    return HttpResponse(template.render(context))

def dynamics(request):
    template = loader.get_template('myapp/dynamics.html')
    context = RequestContext(request,{})
    return HttpResponse(template.render(context))

def path_to_dict(path):
    output = []
    for x in os.listdir(path):
        fullpath = os.path.join(path,x)
        ext = os.path.splitext(fullpath)[1]
        if ext != ".js~" and ext != ".py~" and ext != ".f90~" and ext != ".html~" and ext != ".pyc": 
            el=dict([("text",x)])
            el['id'] = fullpath
            el['id_parent'] = path        
            if ext == ".js":
                el['iconCls'] = 'javascript'
            elif ext == ".py" or ext == ".pyc":
                el['iconCls'] = 'python'
            elif ext == ".f90":
                el['iconCls'] = 'fortran'
            elif ext == ".html":
                el['iconCls'] = 'explorer'
            if os.path.isdir(el['id']):
                el['leaf'] = "false"
            else:
                el['leaf'] = "true"
            output.append(el)
    return output

def folderstruc(request):
    return HttpResponse(json.dumps(path_to_dict(request.GET['node'])), content_type="application/json")

def loadcontenttotab(request):
    template = loader.get_template('myapp/sourcecode.html')
    context = Context({'path':request.GET['filename']})
    return HttpResponse(template.render(context))

def code(request):
    filename = request.GET['filename']
    handle = open(filename,'r+')
    sourcecode = handle.read()
    ext = os.path.splitext(filename)[1]
    mode = "htmlmixed"
    if ext == ".js":
        mode = "javascript"
    elif ext == ".py":
        mode = "python"
    elif ext == ".f90":
        mode = "fortran"
    template = loader.get_template('myapp/code.html')
    context = Context({'sourcecode':sourcecode,'path':request.GET['filename'],'mode':mode})
    return HttpResponse(template.render(context))

def createFile(request):
    filename = request.GET['filename']
    if not os.path.exists(filename):
        os.open(filename, os.O_CREAT)
    return HttpResponse()

def createFolder(request):
    filename = request.GET['filename']
    if not os.path.exists(filename):
        os.makedirs(filename)
    return HttpResponse()

def removeFile(request):
    filename = request.GET['filename']
    if os.path.exists(filename) and os.path.isfile(filename):
        os.remove(filename)
    return HttpResponse()

def removeFolder(request):
    filename = request.GET['filename']
    if os.path.exists(filename) and os.path.isdir(filename):
        shutil.rmtree(filename)
    return HttpResponse()

def renameFileFolder(request):
    oldname = request.GET['oldname']
    newname = request.GET['newname']
    if os.path.exists(oldname):
        os.rename(oldname,newname)
    return HttpResponse()

@csrf_exempt
def saveSourceCode(request):
    path = request.POST['path']
    text = request.POST['sourcecode']
    fd = open(path, 'w')
    fd.write(text.encode('utf8'))
    return HttpResponse('{"success":true}', content_type="application/json")
  
def moveFileFolder(request):
    os.rename(request.GET['src'], request.GET['dest'])
    return HttpResponse('{"success":true}', content_type="application/json")
  
def command(x):
    return str(Popen(x.split(' '),stdout = PIPE).communicate()[0])
  
def gitStatus(request):
    template = loader.get_template('myapp/gitstatus.html')
    context = Context()
    return HttpResponse(template.render(context))

@csrf_exempt
def gitAdd(request):
    savedPath = os.getcwd()
    os.chdir(repoDir)
    msg = request.POST['msg']
    files = request.POST['filenames'].split(",")
    filename = ''
    for x in files:
        filename = x.replace('"','').replace('[','').replace(']','')
        check_output(['git', 'add', filename])
    check_output(['git', 'commit', '-m', msg])
    os.chdir(savedPath)
    return HttpResponse('{"success":true}', content_type="application/json")
  
def gitmodified(request):
    savedPath = os.getcwd()
    os.chdir(repoDir)
    status = command('git status --short').split('\n')
    output = []
    for x in status:
        if x != '' and ( x.startswith(' M ') or x.startswith('MM ') or x.startswith('M ') or x.startswith('M  ') or x.startswith('?? ')):
            output.append({'filename':x.replace('MM ','').replace(' M ','').replace('M ','').replace('M  ','').replace('?? ','')})  
    os.chdir(savedPath)
    return HttpResponse([output])
  
def gitPush(request):
    savedPath = os.getcwd()
    os.chdir(repoDir)
    check_output(['git', 'push'])
    os.chdir(savedPath)
    return HttpResponse()
  
def databases(request):
    template = loader.get_template('myapp/databases.html')
    context = RequestContext(request,{})
    return HttpResponse(template.render(context))
  
def databaseparams(request):
    return HttpResponse()
  
@csrf_exempt
def testconnection(request):
    cnx = pyodbc.connect("DRIVER=FreeTDS;SERVER=192.168.56.1;PORT=1433;DATABASE=test;UID=sa;PWD=pGOKTOXrO2k;TDS_Version=7.0;ClientCharset=UTF8;")
    return HttpResponse('{"success":true}', content_type="application/json")
    
  
  
  
  
  
