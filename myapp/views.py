#--coding: utf-8
from __future__ import unicode_literals
from django.shortcuts import render
from django.http import HttpResponse
from django.template import RequestContext, Context, loader
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from django.core.context_processors import csrf
from django.views.decorators.csrf import csrf_exempt
from subprocess import *
import os
import json
import codecs
import shutil
import string
import pyodbc
import pypyodbc
import jsonpickle
import re
import MySQLdb
import StringIO
import base64
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
from mpl_toolkits.mplot3d import Axes3D
from matplotlib import cm
import myapp.static.app.shared.fortran.fortran as fort


repoDir = '.'

def index(request):
    template = loader.get_template('myapp/index.html')
    context = RequestContext(request,{})
    return HttpResponse(template.render(context))

def projects(request):
    program = request.GET['program']
    template = loader.get_template('myapp/projects.html')
    context = Context({'program':program})
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
            if ext == ".css":
                el['iconCls'] = 'css'
            elif ext == ".js":
                el['iconCls'] = 'js'
            elif ext == ".py" or ext == ".pyc":
                el['iconCls'] = 'py'
            elif ext == ".f90":
                el['iconCls'] = 'f90'
            elif ext == ".html":
                el['iconCls'] = 'html'
            elif ext == ".sql":
                el['iconCls'] = 'sql'
            elif ext == ".gif":
                el['iconCls'] = 'gif'
            elif ext == ".png":
                el['iconCls'] = 'png'
            elif ext == ".jpeg":
                el['iconCls'] = 'jpeg'	    
            if os.path.isdir(el['id']):
                el['leaf'] = "false"
            else:
                el['leaf'] = "true"
            output.append(el)
    return output

def folderstruc(request):
    return HttpResponse(json.dumps(path_to_dict(request.GET['node'])), content_type="application/json")

def loadcontenttotab(request):
    path = request.GET['filename']
    ext = os.path.splitext(path)[1]
    head, filename = os.path.split(path)
    if ext == '.gif' or ext == '.png' or ext == '.jpeg':
        template = loader.get_template('myapp/viewimage.html')
    else:
        template = loader.get_template('myapp/sourcecode.html')
    context = Context({'path':path,'ext':ext,'static':'/static/app/img/','filename':filename})
    return HttpResponse(template.render(context))

def code(request):
    filename = request.GET['filename']
    handle = open(filename,'r+')
    sourcecode = handle.read()
    ext = os.path.splitext(filename)[1]
    mode = "htmlmixed"
    if ext == ".sql":
        mode = "text/x-sql"
    elif ext == ".js":
        mode = "javascript"
    elif ext == ".py":
        mode = "python"
    elif ext == ".f90":
        mode = "fortran"
    elif ext == ".css":
        mode = "css" 
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
    cnx = pyodbc.connect("DRIVER=FreeTDS;SERVER=192.168.56.1;PORT=1433;DATABASE=accounting_empty_db;UID=sa;PWD=pGOKTOXrO2k;TDS_Version=7.0;ClientCharset=UTF8;")
    return HttpResponse('{"success":true}', content_type="application/json")
  
def databasetables(request):
    template = loader.get_template('myapp/databasetables.html')
    context = Context()
    return HttpResponse(template.render(context))
  
def databasetablelist(request):
    cnx = pyodbc.connect("DRIVER=FreeTDS;SERVER=192.168.56.1;PORT=1433;DATABASE=accounting_empty_db;UID=sa;PWD=pGOKTOXrO2k;TDS_Version=7.0;ClientCharset=UTF8;")
    cursor = cnx.cursor()
    cursor.execute("SELECT distinct TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_CATALOG='accounting_empty_db';")
    output = []
    for x in cursor:
        output.append({'table':x[0]})
    return HttpResponse(json.dumps(output))

@csrf_exempt
def getDbObj(request):
    database = request.POST['database']
    table = request.POST['table']
    row = request.POST['row']
    cnx = pyodbc.connect("DRIVER=FreeTDS;SERVER=192.168.56.1;PORT=1433;DATABASE=accounting_empty_db;UID=sa;PWD=pGOKTOXrO2k;TDS_Version=7.0;ClientCharset=UTF8;")
    cursor = cnx.cursor()
    cursor.execute("SELECT COLUMN_NAME FROM accounting_empty_db.INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME=?",table)
    output = []
    for x in cursor:
        output.append({'xtype':'textfield','width':'100%','labelWidth':'50%','labelSeparator':'','fieldLabel':x[0],'name':x[0]})
    return HttpResponse(json.dumps(output))
  
def tabledata(request):
    database = request.GET['database']
    table = request.GET['table']
    row = request.GET['row']
    template = loader.get_template('myapp/tabledata.html')
    context = Context({'database':database,'table':table,'row':row})
    return HttpResponse(template.render(context))
  
def tablecolumns(request):
    database = request.GET['database']
    table = request.GET['table']
    row = request.GET['row']
    
    cnx = pyodbc.connect("DRIVER=FreeTDS;SERVER=192.168.56.1;PORT=1433;DATABASE=accounting_empty_db;UID=sa;PWD=pGOKTOXrO2k;TDS_Version=7.0;ClientCharset=UTF8;")
    cursor = cnx.cursor()
    cursor.execute("SELECT COLUMN_NAME FROM accounting_empty_db.INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME=?",table)
    output = []
    for x in cursor:
        output.append({'header':x[0],'name':x[0],'dataIndex':x[0],'type':'string'})
    return HttpResponse(json.dumps(output))
  
  
def tablegrid(request):
    database = request.GET['database']
    table = request.GET['table']
    row = request.GET['row']  
    page = request.GET['page']
    start = request.GET['start']
    limit = int(start) + int(request.GET['limit'])
        
    cnx = pyodbc.connect("DRIVER=FreeTDS;SERVER=192.168.56.1;PORT=1433;DATABASE=accounting_empty_db;UID=sa;PWD=pGOKTOXrO2k;TDS_Version=7.0;ClientCharset=UTF8;")
    cursor = cnx.cursor()
    
    cursor.execute("SELECT COLUMN_NAME FROM accounting_empty_db.INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME=?",table)
    columns = []
    for row in cursor:
        columns.append(row[0])
    attrs = ', '.join("[%s]" % w for w in columns)
    
    query = "SELECT * FROM ( SELECT %s, ROW_NUMBER() OVER(ORDER BY [%s]) AS row FROM %s ) AS A WHERE A.row >= %s AND A.row <= %s" % (attrs, columns[0], table, start, limit)
    cursor.execute(query.encode('utf-8'))
    data = []
    for row in cursor:
        data.append(dict(zip(columns, row)))
    
    total = 0
    query = "SELECT COUNT(*) FROM %s" % table
    cursor.execute(query.encode('utf-8'))
    for row in cursor:
        total = row[0]
      
    output = '{total:'+str(total)
    output += ',items:'
    output += jsonpickle.encode(data,unpicklable=False)
    #json.dumps(data, cls=DjangoJSONEncoder)
    output += '}'
    
    return HttpResponse(output)
  
def databasequery(request):
    template = loader.get_template('myapp/databasequery.html')
    context = RequestContext(request,{})
    return HttpResponse(template.render(context))

@csrf_exempt
def gettablefields(request):
    query = request.POST['query']
    cnx = pyodbc.connect("DRIVER=FreeTDS;SERVER=192.168.56.1;PORT=1433;DATABASE=accounting_empty_db;UID=sa;PWD=pGOKTOXrO2k;TDS_Version=7.0;ClientCharset=UTF8;")
    cursor = cnx.cursor()
    cursor.execute(query.encode('utf-8'))
    col_names = ['{0}'.format(desc[0].decode('utf-8')) for desc in cursor.description]
    data = []
    for col in col_names:
        data.append({"name":col,"header":col,"dataIndex":col,"type":"string"})
        
    output = '{"success":true,"message":'
    output += jsonpickle.encode(data,unpicklable=False)
    output += '}'
    return HttpResponse(output, content_type="application/json")

@csrf_exempt
def dynamicdatatable(request):
    query = request.POST['query']
    query = u'{}'.format(query)  
    #page = request.POST['page']
    #start = request.POST['start']
    #limit = int(start) + int(request.POST['limit'])
        
    cnx = pyodbc.connect("DRIVER=FreeTDS;SERVER=192.168.56.1;PORT=1433;DATABASE=accounting_empty_db;UID=sa;PWD=pGOKTOXrO2k;TDS_Version=7.0;ClientCharset=UTF8;")
    cursor = cnx.cursor()
    cursor.execute(query.encode('utf-8'))
    columns = ['{0}'.format(desc[0].decode('utf-8')) for desc in cursor.description]
    #'{0}'.format(desc[0].decode('cp1251'))
    #attrs = ', '.join("[%s]" % w for w in columns)
    data = []
    total = 0
    for row in cursor:
        data.append(dict(zip(columns, row)))   
        total = total + 1
    
    output = '{total:'+str(total)
    output += ',items:'
    output += jsonpickle.encode(data)
    output += '}'
    
    return HttpResponse(output)

@csrf_exempt
def saveMatchAttr(request):
    output = {}
    for k, v in request.POST.iteritems():
        if v != "":
            output[k] = v
    
    db = MySQLdb.connect("localhost","root","root","test" )
    cursor = db.cursor()
    cursor.execute(u"SELECT COUNT(*) AS CNT FROM srcdst WHERE TABLESRC = %s AND TABLEDST = %s".encode('utf-8') , (output['TABLESRC'], output['TABLEDST']))
    res = cursor.fetchone()
    total_rows = res[0]    
    if total_rows == 0:
        cursor.execute("INSERT INTO srcdst (TABLESRC, TABLEDST, VAL) values (%s, %s, %s)" , (output['TABLESRC'], output['TABLEDST'], jsonpickle.encode(output)))
    else:
        cursor.execute("UPDATE srcdst SET VAL =  %s WHERE TABLESRC = %s AND TABLEDST = %s" , (jsonpickle.encode(output), output['TABLESRC'], output['TABLEDST']))
    db.commit()
    
    return HttpResponse('{"success":true}', content_type="application/json")
  
def matchvals(request):
    table = request.GET['table']
    db = MySQLdb.connect("localhost","root","root","test" )
    cursor = db.cursor()
    cursor.execute(u"SELECT VAL FROM srcdst WHERE TABLESRC = %s",(table))
    res = cursor.fetchall()
    db.commit()
    return HttpResponse(jsonpickle.encode([res[0][0]]))
    
def exportdata(request):
    tablesrc = request.GET['tablesrc']
    db = MySQLdb.connect("localhost","root","root","test" )
    cursor1 = db.cursor()
    cursor1.execute(u"SELECT TABLEDST, VAL FROM srcdst WHERE TABLESRC = %s".encode('utf-8') , (tablesrc))
    res = cursor1.fetchall()
    db.commit()  
    tabledst = res[0][0]
    val = res[0][1]
    kv = json.loads(val)
    kv.pop("TABLEDST", None)
    kv.pop("TABLESRC", None)
    attrsSrc = ', '.join("%s" % w for w in kv.keys())
    attrsDst = ', '.join("%s" % w for w in kv.values())
    ss = ', '.join('%s' for w in kv.values())
    
    cnx = pyodbc.connect("DRIVER=FreeTDS;SERVER=192.168.56.1;PORT=1433;DATABASE=accounting_empty_db;UID=sa;PWD=pGOKTOXrO2k;TDS_Version=7.0;ClientCharset=UTF8;")
    cursor2 = cnx.cursor()
    cursor2.execute("SELECT %s FROM %s" % (attrsSrc, tablesrc))
    output = []
    for row in cursor2:
        queryPrep = "INSERT INTO %s (%s) values (%s)" % (tabledst,attrsDst, ss)
        query = row.values()
    
    
    #fd = open('test.txt', 'w')
    #fd.write(jsonpickle.encode(query))
    
    return HttpResponse()
  
def compilefortran(request):
    savedPath = os.getcwd()
    path = request.GET['path']
    head, filename = os.path.split(path)
    folder = os.path.dirname(path) 
    filenameShort, ext = os.path.splitext(filename)
    os.chdir(folder)
    check_output(['f2py','-m',filenameShort,'-c',filename])
    os.chdir(savedPath)
    return HttpResponse()
  
def givens(request):
    template = loader.get_template('myapp/givens.html')
    context = RequestContext(request,{})
    return HttpResponse(template.render(context))
  
def program(request):
    program = request.GET['program']
    template = loader.get_template('myapp/program.html')
    context = Context({'program':program})
    return HttpResponse(template.render(context))
  
def lineCurve2D(request):
    tp = request.GET['tp']
    x = np.linspace(-10, 10, 50)
    y = np.linspace(-10, 10, 50)
    x,y = np.meshgrid(x, y)
    z = x**2 + 3*y**2 + x*y - 5*x + 3*y
    fig = plt.figure()
    if (tp == "1"):
        ax = fig.add_subplot(111)
        plt.contour(x,y,z,20)
        ax.set_xlabel("X")
        ax.set_ylabel("Y")
    elif (tp == "2"):
        ax = fig.add_subplot(111,projection='3d')
        ax.plot_surface(x,y,z,rstride=2,cstride=2,cmap=cm.jet)
        ax.set_xlabel("X")
        ax.set_ylabel("Y")
        ax.set_zlabel("Z")
    canvas = FigureCanvas(fig) 
    out = StringIO.StringIO()
    canvas.print_png(out)
    res = base64.b64encode(out.getvalue())
    obj = {'src':res}
    plt.close(fig)
    return HttpResponse(json.dumps(obj), content_type="application/json")  
  
def optimize(request):
    x0 = request.GET['x0']
    y0 = request.GET['y0']
    delta = request.GET['delta']
    theta = request.GET['theta']
    method = request.GET['method']
    if method != "1":
        method = 0
    method = int(method)
    fort.graddescent(x0, y0, delta, theta, method)
    f = open('plotdata.txt','r+')
    x_coord = []
    y_coord = []
    for line in f:
        x,y = string.split(line)
        x_coord.append(float(x))
        y_coord.append(float(y))
    xstar = float(x)
    ystar = float(y)
    x = np.linspace(-10, 10, 50)
    y = np.linspace(-10, 10, 50)
    x,y = np.meshgrid(x, y)
    z = x**2 + 3*y**2 + x*y - 5*x + 3*y
    fig = plt.figure()
    ax = fig.add_subplot(111)
    plt.contour(x,y,z,20)
    plt.plot(x_coord,y_coord)
    plt.plot([xstar], [ystar], marker='o', color='r')
    ax.set_xlabel("X")
    ax.set_ylabel("Y")
    canvas = FigureCanvas(fig) 
    out = StringIO.StringIO()
    canvas.print_png(out)
    res = base64.b64encode(out.getvalue())
    qstar = xstar**2 + 3*ystar**2 + xstar*ystar - 5*xstar + 3*ystar
    obj = {'xstar':xstar,'ystar':ystar,'qstar':qstar,'src':res}
    plt.close(fig)    
    return HttpResponse(json.dumps(obj), content_type="application/json")
  
def modules(request):
    module = request.GET['module']
    template = loader.get_template('myapp/module.html')
    context = Context({'module':module})
    return HttpResponse(template.render(context))
  
def addModule(request):
    module = request.GET['module']
    tempRoot = 'myapp/static/app/projects/modules/template/'
    for root, subFolders, files in os.walk(tempRoot):
        newfolder = root.replace('template',module)
        if not os.path.exists(newfolder):
            os.makedirs(newfolder)
            for f in files:
                newfile = f.replace('template',module)
                newfilePath = newfolder + '/' + newfile
                os.open(newfilePath, os.O_CREAT)
                shutil.copyfile(root+'/'+f,newfilePath)                
                with open(newfilePath) as f:
                    sourcecode = re.sub(r'template',module,f.read().decode('utf-8'))                    
                with open(newfilePath,'w') as f:
                    f.write(sourcecode.encode('utf-8'))                     
    return HttpResponse()

@csrf_exempt  
def addDb(request):
    return HttpResponse('{"success":true}', content_type="application/json") 



