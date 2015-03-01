"""
System setup

"""
import json
import MySQLdb
from pprint import pprint

def init():
    """
    Read configuration files and make initial dependencies
    """
    Init = json.load(open('init.json','r'))
    Data = json.load(open('data.json','r'))
    Mapping  = json.load(open('mappings.json','r'))
    
    for table in Init['tables']:
        if table['name'] in Data['create']:
            createBefore = Data['create'][table['name']]
            createResult = dict()
            mapAttr = Mapping[table['id_db']]
            for attr in createBefore:
                if attr in createBefore:
                    createResult[attr] = mapAttr[createBefore[attr]]  
            if(len(createResult)):
                createTable(table['id_db'],table['name'],createResult)

def createTable(id_db,tableName,tableDict):
    """
    Create a new table or collection     
    """
    Init = json.load(open('init.json','r'))
    if id_db == "0":
        for dbs in Init['databases']:
            if dbs['id'] == "0":
                db = MySQLdb.connect(dbs['ip'],dbs['user'],dbs['password'],dbs['name'])
                cursor = db.cursor()     
                createStr = ""
                for attr in tableDict:
                    createStr += "," + attr + " " + tableDict[attr]
                createStr = "CREATE TABLE " + tableName + "(" +createStr[1:] + ")"
                cursor.execute(createStr)
        

if __name__ == "__main__":
    init()