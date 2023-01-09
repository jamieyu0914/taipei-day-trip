from flask import Flask 
from flask import request 
from flask import Response
from flask import redirect 
from flask import render_template
from flask import make_response 
from flask import session
from flask import jsonify
from fastapi import FastAPI
from mysql.connector import Error
from mysql.connector import pooling
import json
import requests
import jwt
import time
import datetime
from dotenv import load_dotenv
import os

load_dotenv()


DATABASE_NAME = os.getenv("DATABASE_NAME")
DATABASE_USER = os.getenv("DATABASE_USER")
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")




connection_pool = pooling.MySQLConnectionPool(pool_name="my_connection_pool",
                                                pool_size=5,
                                                pool_reset_session=True,
                                                host='localhost',
                                                database=DATABASE_NAME,
                                                user=DATABASE_USER,
                                                password=DATABASE_PASSWORD)
app = FastAPI()

app=Flask(__name__,
    static_folder="public",
    static_url_path="/") #建立 Application 物件)
app.secret_key="any string but secret" #設定 Session 的密鑰    
app.config["JSON_AS_ASCII"]=False
app.config["JSON_SORT_KEYS"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")
@app.route("/api/attraction", methods=["GET"])
def api_attraction(): 
    page = request.args.get("page","")#分頁
    keyword = request.args.get("keyword","")
    print(keyword)
    print(page)
    if(page == ""):
        page = 0 #minimum: 0  
    
    nextPage = int(page)+1
    nums = (int(page)*12)
    print(nums) 
     
    keyword2 = "%"+f"{keyword}"+"%"
    print(keyword2)   

    if(keyword == ""):
        keyword == "*"
        keyword2 == "*"

    sql = "SELECT attractions_list.id, attractions_list.name, attractions_list.category, attractions_list.description, attractions_list.address, attractions_list.transport, attractions_list.mrt, attractions_list.lat, attractions_list.lng, merge_images_list.links FROM attractions_list INNER JOIN merge_images_list ON merge_images_list.attractions_id=attractions_list.id WHERE category= %s OR name LIKE %s LIMIT %s,12;" #SQL指令 
    val = (str(keyword), str(keyword2), nums)

    try:
        # Get connection object from a pool
        connection_object = connection_pool.get_connection() #連線物件 commit時 需要使用
        cursor = connection_object.cursor()
        #print("MySQL connection is opened")
        cursor.execute(sql,val)
        myresult = cursor.fetchall()
        x=""
        results = []
        for x in myresult:
            id = x[0]
            name = x[1]
            category = x[2]
            description = x[3]
            a = x[4].split(" ")[0]+x[4].split(" ")[1]
            address = a+x[4].split(" ")[1]+x[4].split(" ")[2]
            transport = x[5]
            mrt = x[6]
            lat = x[7]
            lng = x[8]
            links = x[9].split(',')    
            result = {
                    "id":int(id),
                    "name":str(name),
                    "category":str(category),
                    "description":str(description),
                    "address":str(address),
                    "transport":str(transport),
                    "mrt":str(mrt),
                    "lat":float(lat),
                    "lng":float(lng),
                    "images":links
                    }
            results.append(result)

        #最後一頁判別
        sql = "SELECT * , merge_images_list.links FROM attractions_list INNER JOIN merge_images_list ON merge_images_list.attractions_id=attractions_list.id WHERE category= %s OR name LIKE %s LIMIT %s,12;" #SQL指令 
        val = (str(keyword), str(keyword2), nums+12) #查詢下一頁結果
        cursor.execute(sql,val) 
        result = cursor.fetchall()
        if result == []:
            nextPage = None   
            
    except Error as e:
        #print("Error while connecting to MySQL using Connection pool ", e)
        return (jsonify({"error":True, "message": "伺服器內部錯誤"})),500
    finally:
        # closing database connection.    
        cursor.close()
        connection_object.close()
        #print("MySQL connection is closed")
        print("DONE!")

    return jsonify({
            "nextPage":nextPage,
            "data": results
            }     ), 200  

@app.route("/api/attraction/<attractionId>")
def attractionId(attractionId):

        if (int(attractionId) <= 0):
            return (jsonify({"error":True, "message": "景點編號不正確"})),400
         

        Numbers = str(attractionId)
        print(Numbers)
        sql = "SELECT attractions_list.id, attractions_list.name, attractions_list.category, attractions_list.description, attractions_list.address, attractions_list.transport, attractions_list.mrt, attractions_list.lat, attractions_list.lng, merge_images_list.links FROM attractions_list INNER JOIN merge_images_list ON merge_images_list.attractions_id=attractions_list.id WHERE attractions_list.id = %s limit 1;" #SQL指令 
        val = (Numbers, )
        try:
            # Get connection object from a pool
            connection_object = connection_pool.get_connection() #連線物件 commit時 需要使用
            cursor = connection_object.cursor()
            #print("MySQL connection is opened")
            cursor.execute(sql,val)
            myresult = cursor.fetchall()
            #print(myresult)
            if (myresult == []):
                return (jsonify({"error":True, "message": "此編號未存在資料"})),400

            x=''
            for x in myresult:
                id = x[0]
                name = x[1]
                category = x[2]
                description = x[3]
                a = x[4].split(" ")[0]+x[4].split(" ")[1]
                address = a+x[4].split(" ")[1]+x[4].split(" ")[2]
                transport = x[5]
                mrt = x[6]
                lat = x[7]
                lng = x[8]
                links = x[9].split(',')  
            result={
                    "data":{
                        "id":int(id),
                        "name":str(name),
                        "category":str(category),
                        "description":str(description),
                        "address":str(address),
                        "transport":str(transport),
                        "mrt":str(mrt),
                        "lat":float(lat),
                        "lng":float(lng),
                        "images":links
                        }
                    }              
        except Error as e:
            print("Error while connecting to MySQL using Connection pool ", e)
            return (jsonify({"error":True, "message": "伺服器內部錯誤"})),500
        finally:
            # closing database connection.    
            cursor.close()
            connection_object.close()
            #print("MySQL connection is closed")
            print("DONE!")
        return (jsonify(result)),200 

@app.route("/api/categories")
def categories():

       
        sql = "SELECT distinct category FROM attractions_list;" #SQL指令 
    
        try:
            # Get connection object from a pool
            connection_object = connection_pool.get_connection() #連線物件 commit時 需要使用
            cursor = connection_object.cursor()
            #print("MySQL connection is opened")
            cursor.execute(sql,)
            myresult = cursor.fetchall()
            x=''
            results =[]
            for x in myresult:
                categories = x[0]
                results.append(categories)
                    
            rows = cursor.rowcount #得出結果列數
            print(rows)     
        except Error as e:
            print("Error while connecting to MySQL using Connection pool ", e)
            return (jsonify({"error":True, "message": "伺服器內部錯誤"})),500
        finally:
            # closing database connection.    
            cursor.close()
            connection_object.close()
            #print("MySQL connection is closed")
            print("DONE!")
        return (jsonify({"data":results})),200 






            

app.run(port=3000, debug=True)
