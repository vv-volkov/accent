"""
System setup

"""
import json
import MySQLdb
from pymongo import MongoClient
import psycopg2
import pyodbc
import couchdb
from bson.objectid import ObjectId

def init():
    """
    Read configuration files and make initial setup
    """
    Init = json.load(open('init.json','r'))
    Data = json.load(open('data.json','r'))
    Mapping  = json.load(open('mappings.json','r'))
    Loc = json.load(open('./locale/lang-'+Init['locale']+'.json','r'))
    for table in Init['tables']:
        if table['name'] in Data['create']:
            commit('create',table['name'],table['id_db'],Init,Data,Mapping,Loc)
        if table['name'] in Data['insert']:
            commit('insert',table['name'],table['id_db'],Init,Data,Mapping,Loc)    

def commit(action,tableName,id_db,Init,Data,Mapping,Loc):
    """
    Trigger creation or insertion of data
    """
    before = Data[action][tableName]
    result = dict()
    mapAttr = Mapping[id_db]
    if action == 'create':
        for attr in before:
            if before[attr] in mapAttr: 
                result[attr] = mapAttr[before[attr]] 
        createInsert('create',tableName,id_db,result,Init)
    elif action == 'insert':
        for attr in before:
            for v in attr:
                if attr[v] in mapAttr:
                    result[v] = mapAttr[attr[v]]
                elif attr[v] in Loc:
                    result[v] = Loc[attr[v]]
                else:
                    result[v] = attr[v]
            createInsert('insert',tableName,id_db,result,Init)  
            
def createInsert(action,tableName,id_db,tableDict,Init):
    """
    Commit create or insert statement
    """
    if id_db == "0":
        db = connect(id_db,Init)
        cursor = db.cursor()
        sql = prepareSql(action,tableName,tableDict,'%s')
        if action == 'create':
            cursor.execute(sql)
        elif action == 'insert':
            cursor.execute(sql,tuple(tableDict.values()))
        db.commit()
    elif id_db == "1":
        db = connect(id_db,Init)
        if action == 'insert':          
            tableDict['_id'] = ObjectId()
            db[tableName].insert(tableDict)
    elif id_db == "2":
        db = connect(id_db,Init)
        cursor = db.cursor()
        sql = prepareSql(action,tableName,tableDict,'?')
        if action == 'create':
            cursor.execute(sql)
        elif action == 'insert':
            cursor.execute("SET IDENTITY_INSERT "+tableName+" ON")
            cursor.execute(sql,tuple(tableDict.values()))
            cursor.execute("SET IDENTITY_INSERT "+tableName+" OFF")
        db.commit()
    elif id_db == "3":
        db = connect(id_db,Init)
        cursor = db.cursor()
        autoIncrement = False
        sql,autoIncrement = preparePostgreSql(action,tableName,tableDict,autoIncrement)
        if action == 'create':
            if autoIncrement:
                cursor.execute("CREATE SEQUENCE auto_id_"+tableName)
            cursor.execute(sql)  
        elif action == 'insert':
            cursor.execute(sql,tuple(tableDict.values()))
        db.commit()
    elif id_db == "4":
        db = connect(id_db,Init)
        if action == 'insert':          
            tableDict['type'] = tableName
            db.save(tableDict)

def preparePostgreSql(action,tableName,tableDict,autoIncrement):
    """
    Prepare sql statement for Postgre database
    """
    attrs = ""
    values = ""
    if action == 'insert':
        for v in tableDict.keys():
            attrs += "," + v
            values += ",%s" 
        sql = u"INSERT INTO "+tableName+" ("+attrs[1:]+") VALUES("+values[1:]+")"
    elif action == 'create':
        for attr in tableDict:
            if tableDict[attr] == "auto_increment":
                autoIncrement = True
                values += "," + attr + " integer NOT NULL DEFAULT nextval('auto_id_"+tableName+"')"
            else:
                values += "," + attr + " " + tableDict[attr]
        sql = "CREATE TABLE " + tableName + "(" +values[1:] + ")"
    return (sql, autoIncrement)
    
    
def prepareSql(action,tableName,tableDict,placeHolder):
    """
    Prepare sql statement
    """
    attrs = ""
    values = ""
    if action == 'insert':
        for v in tableDict.keys():
            attrs += "," + v
            values += "," +placeHolder
        sql = u"INSERT INTO "+tableName+" ("+attrs[1:]+") VALUES("+values[1:]+")"
    elif action == 'create':        
        for attr in tableDict:
            values += "," + attr + " " + tableDict[attr]
        sql = "CREATE TABLE " + tableName + "(" +values[1:] + ")"
    return sql
  
def connect(id_db,Init):
    """
    Connect to a database
    """
    for dbs in Init['databases']:
        if id_db == "0" and dbs['id'] == "0":
            db = MySQLdb.connect(dbs['ip'],dbs['user'],dbs['password'],dbs['name'])            
        elif id_db == "1" and dbs['id'] == "1":
            client = MongoClient(dbs['ip'],int(dbs['port']))
            db = client[dbs['name']]
        elif id_db == "2" and dbs['id'] == "2":
            db = pyodbc.connect("DRIVER=FreeTDS;SERVER="+dbs['ip']+";PORT="+dbs['port']+";DATABASE="+dbs['name']+";UID="+dbs['user']+";PWD="+dbs['password']+";TDS_Version=7.0;ClientCharset=UTF8;")
        elif id_db == "3" and dbs['id'] == "3":
            db = psycopg2.connect(host=dbs['ip'],dbname=dbs['name'],user=dbs['user'],password=dbs['password'])
        elif id_db == "4" and dbs['id'] == "4":
            client = couchdb.Server('http://'+dbs['user']+':'+dbs['password']+'@'+dbs['ip']+':'+dbs['port']+'/')
            db = client[dbs['name']]
    return db
  
if __name__ == "__main__":
    init()