from flask import Flask 
from flask import request 
from flask import Response
from flask import redirect 
from flask import render_template 
from flask import session
from flask import jsonify
from mysql.connector import Error
from mysql.connector import pooling
from mysql.connector import Error
from mysql.connector import pooling
import json


connection_pool = pooling.MySQLConnectionPool(pool_name="my_connection_pool",
                                                pool_size=5,
                                                pool_reset_session=True,
                                                host='localhost',
                                                database='taipei_trip',
                                                user='root',
                                                password='m6ao3ao3')

app=Flask(__name__,
    static_folder="public",
    static_url_path="/") #建立 Application 物件)
app.config["JSON_AS_ASCII"]=False
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
def api_attraction(): #要取得的分頁，每頁 12 筆資料
    page = request.args.get("page","")
    nextPage = int(page)+1
    input = request.args.get("input","")
    print(input)
    if(page == ''):
        page = 0 #minimum: 0  
    if(input == ""):
        input == "*"
    else:
        sql = "SELECT attractions_list.id, attractions_list.name, attractions_list.category, attractions_list.description, attractions_list.address, attractions_list.transport, attractions_list.mrt, attractions_list.lat, attractions_list.lng, images_list.link FROM attractions_list INNER JOIN images_list ON images_list.attractions_id=attractions_list.id WHERE category=%s;" #SQL指令 是否有對應的帳號、密碼
        val = (input,)
        try:
			# Get connection object from a pool
            connection_object = connection_pool.get_connection() #連線物件 commit時 需要使用
            cursor = connection_object.cursor()
            #print("MySQL connection is opened")
            cursor.execute(sql,val)
            myresult = cursor.fetchall()
            x=""
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
                link = x[9]    
                #print(x)
        except Error as e:
            print("Error while connecting to MySQL using Connection pool ", e)
        finally:
            # closing database connection.    
            cursor.close()
            connection_object.close()
            #print("MySQL connection is closed")
            print("DONE!")     
            return jsonify({
                "nextPage":int(nextPage),
            	"data":[{
            		"id":int(id),
		            "name":str(name),
		            "category":str(category),
                    "description":str(description),
                    "address":str(address),
                    "transport":str(transport),
                    "mrt":str(mrt),
                    "lat":float(lat),
                    "lng":float(lng),
                    "images":[str(link)]
		            }]
	            }     )


app.run(port=3000)
