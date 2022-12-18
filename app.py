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
import jwt
import time



connection_pool = pooling.MySQLConnectionPool(pool_name="my_connection_pool",
                                                pool_size=5,
                                                pool_reset_session=True,
                                                host='localhost',
                                                database='taipei_trip',
                                                user='root',
                                                password='m6ao3ao3')
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

@app.route("/api/user", methods=["POST"])
def signup():

    #註冊一個新一個新的會員
    post = request.get_json()
    name = post["name"]
    email = post["email"]
    password = post["password"]
    # print(name, email, password)

    if(name =="" or email == "" or password == ""): #驗證失敗
        return (jsonify({
                "error": True,
                "message": "註冊失敗，請輸入姓名、電子郵件與密碼"
                })),400

    sql = "SELECT email FROM member_list WHERE email=%s" #SQL指令 檢查是否有重複的帳號 (email)
    val = (email,)
    try:
        # Get connection object from a pool
        connection_object = connection_pool.get_connection() #連線物件 commit時 需要使用
        cursor = connection_object.cursor()
        print("MySQL connection is opened")
        cursor.execute(sql, val)
        myresult = cursor.fetchall()
        x=""
        for x in myresult:
            print(x)
    except Error as e:
        print("Error while connecting to MySQL using Connection pool ", e)
    finally:
        # closing database connection.    
        cursor.close()
        connection_object.close()
    print("MySQL connection is closed")       
    if (x != ""):#註冊失敗
        return (jsonify({
                "error": True,
                "message": "註冊失敗，重複的 Email"
                })),400
    else:#註冊成功

        sql = "INSERT INTO member_list (name, email, password) VALUES (%s, %s, %s)" #SQL指令 新增資料
        val = (name, email, password)
        try:
            # Get connection object from a pool
            connection_object = connection_pool.get_connection() #連線物件 commit時 需要使用
            cursor = connection_object.cursor()
            print("MySQL connection is opened")
            cursor.execute(sql, val)
            connection_object.commit()
        except Error as e:
            print("Error while connecting to MySQL using Connection pool ", e)
            return (jsonify({
                "error": True,
                "message": "伺服器內部錯誤"
                })),500
        finally:
            # closing database connection.    
            cursor.close()
            connection_object.close()
            print("MySQL connection is closed")            
            print("新帳號註冊")
            return (jsonify({
                    "ok": True
                    })),200

@app.route("/api/user/auth", methods=["GET"])
def signinget():

    get_token = request.cookies.get("token")
    decoded_token = jwt.decode(get_token, "secret", algorithms=['HS256'])
    print(decoded_token)

    id = decoded_token["id"]
    name = decoded_token["name"]
    email = decoded_token["email"]
    print(id, name,email)

    sql = "SELECT * FROM member_list WHERE id=%s and name=%s and email=%s" #SQL指令 是否有對應的帳號、密碼
    val = (id, name, email)
    try:
        # Get connection object from a pool
        connection_object = connection_pool.get_connection() #連線物件 commit時 需要使用
        cursor = connection_object.cursor()
        print("MySQL connection is opened")
        cursor.execute(sql, val) 
        myresult = cursor.fetchall()
        x=""
        for x in myresult:
            print(x)
    except Error as e:
            print("Error while connecting to MySQL using Connection pool ", e)
            return (jsonify({
                "login": None,
                "message": "未登入，伺服器內部錯誤"
                }))
    finally:
        # closing database connection.    
        cursor.close()
        connection_object.close()
        print("MySQL connection is closed") 
    if (x == ""):#驗證失敗
        return (jsonify({
                "login": None,
                "message": "未登入，驗證失敗"
                }))
    else: #驗證成功
        print("帳號登入")
        id=x[0] #使用者編號
        name=x[1] #姓名
        email=x[2] #電子郵件
        return (jsonify({
                    "login": True
                    }))    

@app.route("/api/user/auth", methods=["PUT"])
def signinput():

    put = request.get_json()
    email = put["email"]
    password = put["password"]

    if(email == "" or password == ""): #驗證失敗
        return (jsonify({
                "error": True,
                "message": "登入失敗，請輸入電子郵件與密碼"
                })),400

    sql = "SELECT * FROM member_list WHERE email=%s and password=%s" #SQL指令 是否有對應的帳號、密碼
    val = (email, password)
    try:
        # Get connection object from a pool
        connection_object = connection_pool.get_connection() #連線物件 commit時 需要使用
        cursor = connection_object.cursor()
        print("MySQL connection is opened")
        cursor.execute(sql, val) 
        myresult = cursor.fetchall()
        x=""
        for x in myresult:
            print(x)
    except Error as e:
            print("Error while connecting to MySQL using Connection pool ", e)
            return (jsonify({
                "error": True,
                "message": "伺服器內部錯誤"
                })),500
    finally:
        # closing database connection.    
        cursor.close()
        connection_object.close()
        print("MySQL connection is closed")           
    if (x == ""):#驗證失敗
        return (jsonify({
                "error": True,
                "message": "登入失敗，帳號或密碼錯誤"
                })),400
    else: #驗證成功 
        print("帳號登入")
        id=x[0] #使用者編號
        name=x[1] #姓名
        email=x[2] #電子郵件
        password=x[3] #密碼
        print(id, name, email, password)

        #JWT
        key = "secret"
        encoded = jwt.encode({"id": id, "name": name, "email": email}, key, algorithm="HS256")
        print(encoded)

        response=make_response({"ok": True}, 200)
        response.set_cookie(key='token', value=encoded, expires=time.time()+60*60*24*7)
        # print(time())

        decoded = jwt.decode(encoded, "secret", algorithms=["HS256"])  
        print(decoded)

        return response
  
@app.route("/api/user/auth", methods=["DELETE"])
def signout():

    delete = request.get_json()
    id = delete["id"]
    name = delete["name"]
    email = delete["email"]

    sql = "SELECT * FROM member_list WHERE id=%s and name=%s and email=%s" #SQL指令 是否有對應的帳號、密碼
    val = (id, name, email)
    try:
        # Get connection object from a pool
        connection_object = connection_pool.get_connection() #連線物件 commit時 需要使用
        cursor = connection_object.cursor()
        print("MySQL connection is opened")
        cursor.execute(sql, val) 
        myresult = cursor.fetchall()
        x=""
        for x in myresult:
            print(x)
    except Error as e:
            print("Error while connecting to MySQL using Connection pool ", e)
            return (jsonify({
                "error": True,
                "message": "伺服器內部錯誤"
                })),500
    finally:
        # closing database connection.    
        cursor.close()
        connection_object.close()
        print("MySQL connection is closed")           
    if (x == ""):#驗證失敗
        return (jsonify({
                "error": True,
                "message":"驗證錯誤"
                })),400
    else: #驗證成功 

        print("帳號登出")
        id=x[0] #使用者編號
        name=x[1] #姓名
        email=x[2] #電子郵件

        response=make_response({"ok": True}, 200)
        response.set_cookie(key='token', value='') #delete
        


        return response

@app.route("/api/booking", methods=["GET"])
def bookingget():

    userid = request.args.get("user[id]","")
    username = request.args.get("user[name]","")
    useremail = request.args.get("user[email]","")
    print(userid, username,useremail)

    if(userid =="" or username =="" or useremail == ""): #驗證失敗
        return (jsonify({
                "error": True,
                "message": "未登入系統，拒絕存取"
                })),403

    sql = "SELECT * FROM booking_list WHERE member_id=%s;" #SQL指令 
    val = (str(userid),)
    try:
        # Get connection object from a pool
        connection_object = connection_pool.get_connection() #連線物件 commit時 需要使用
        cursor = connection_object.cursor()
        print("MySQL connection is opened")
        cursor.execute(sql, val)
        myresult = cursor.fetchall()
        x=""
        for x in myresult:
            print(x)
    except Error as e:
        print("Error while connecting to MySQL using Connection pool ", e)
    finally:
        # closing database connection.    
        cursor.close()
        connection_object.close()
        rows=cursor.rowcount
        print(rows)
        if(rows == 0):
            print("這是空的噢！")
            return (jsonify({
                "ok":None
                })),200    

        print("HIIIIIIIIIII")
    print("MySQL connection is closed")
    # print(rows) #總筆數
    print(x) #最新一筆的訂單

    attractionId = x[2]
    print(attractionId)

    date = x[3]
    print(date)

    time = x[4]
    print(time)

    price = x[5]
    print(price)

    sql = "SELECT name, address FROM attractions_list WHERE id=%s;" #SQL指令 
    val = (str(attractionId),)
    try:
        # Get connection object from a pool
        connection_object = connection_pool.get_connection() #連線物件 commit時 需要使用
        cursor = connection_object.cursor()
        print("MySQL connection is opened")
        cursor.execute(sql, val)
        myresult = cursor.fetchall()
        x=""
        for x in myresult:
            print(x)
    except Error as e:
        print("Error while connecting to MySQL using Connection pool ", e)
    finally:
        # closing database connection.    
        cursor.close()
        connection_object.close()
        rows=cursor.rowcount
    print("MySQL connection is closed")
    # print(x[0]) #景點名稱
    # print(x[1]) #景點地址

    name = x[0]
    print(name)
    a = x[1].split(" ")[0]+x[1].split(" ")[1]
    address = a+x[1].split(" ")[1]+x[1].split(" ")[2]
    print(address)

    sql = "SELECT links FROM merge_images_list where attractions_id=%s;" #SQL指令 
    val = (str(attractionId),)
    try:
        # Get connection object from a pool
        connection_object = connection_pool.get_connection() #連線物件 commit時 需要使用
        cursor = connection_object.cursor()
        print("MySQL connection is opened")
        cursor.execute(sql, val)
        myresult = cursor.fetchall()
        x=""
        for x in myresult:
            print(x)
    except Error as e:
        print("Error while connecting to MySQL using Connection pool ", e)
    finally:
        # closing database connection.    
        cursor.close()
        connection_object.close()
    print("MySQL connection is closed")

    links = x[0].split(',')
    image = links[0]

    return (jsonify({
  "data": {
    "attraction": {
      "id": attractionId,
      "name": name,
      "address": address,
      "image": image
    },
    "date": date,
    "time": time,
    "price": price
  }
})),200 
          
@app.route("/api/booking", methods=["POST"])
def bookingpost():

    JWT_cookie=request.cookies.get("token")
    decode=jwt.decode(JWT_cookie, "secret", algorithms=['HS256'])
    print(decode)

    userid = decode['id']
    username = decode['name']
    useremail = decode['email']
    print(userid, username,useremail)

    post = request.get_json()
    attractionId = post["attractionId"]
    date = post["date"]
    time = post["time"]
    price = post["price"]
    print(attractionId, date, time, price)

    if(userid =="" or username =="" or useremail == ""): #驗證失敗
        return (jsonify({
                "error": True,
                "message": "未登入系統，拒絕存取"
                })),403

    sql = "SELECT member_id, attraction_id, booking_date, booking_time FROM booking_list WHERE member_id=%s AND attraction_id=%s AND booking_date=%s AND booking_time=%s;" #SQL指令 檢查是否有重複的預約行程
    val = (str(userid), str(attractionId), str(date), str(time))
    try:
        # Get connection object from a pool
        connection_object = connection_pool.get_connection() #連線物件 commit時 需要使用
        cursor = connection_object.cursor()
        print("MySQL connection is opened")
        cursor.execute(sql, val)
        myresult = cursor.fetchall()
        x=""
        for x in myresult:
            print(x)
    except Error as e:
        print("Error while connecting to MySQL using Connection pool ", e)
    finally:
        # closing database connection.    
        cursor.close()
        connection_object.close()
    print("MySQL connection is closed")       
    if (x !=""):#預定失敗
        return (jsonify({
                "error": True,
                "message": "建立失敗，重複的行程"
                })),400
    else:#預定成功
        sql = "INSERT INTO booking_list (member_id, attraction_id, booking_date, booking_time, price) VALUES (%s, %s, %s, %s, %s);" #SQL指令 新增資料
        val = (str(userid), str(attractionId), str(date), str(time), str(price))
        try:
            # Get connection object from a pool
            connection_object = connection_pool.get_connection() #連線物件 commit時 需要使用
            cursor = connection_object.cursor()
            print("MySQL connection is opened")
            cursor.execute(sql, val)
            connection_object.commit()
        except Error as e:
            print("Error while connecting to MySQL using Connection pool ", e)
            return (jsonify({
                "error": True,
                "message": "伺服器內部錯誤"
                })),500
        finally:
            # closing database connection.    
            cursor.close()
            connection_object.close()
            print("MySQL connection is closed")            
            print("建立新的預定行程")
    
    return (jsonify({"ok": True})),200    

@app.route("/api/booking", methods=["DELETE"])
def bookingdelete():

    post = request.get_json()
    userid = post["user"]["id"]
    username = post["user"]["name"]
    useremail = post["user"]["email"]
    print(userid, username,useremail)

    if(userid =="" or username =="" or useremail == ""): #驗證失敗
        return (jsonify({
                "error": True,
                "message": "未登入系統，拒絕存取"
                })),403

    sql = "SELECT * FROM booking_list WHERE member_id=%s;" #SQL指令 
    val = (str(userid),)
    try:
        # Get connection object from a pool
        connection_object = connection_pool.get_connection() #連線物件 commit時 需要使用
        cursor = connection_object.cursor()
        print("MySQL connection is opened")
        cursor.execute(sql, val)
        myresult = cursor.fetchall()
        x=""
        for x in myresult:
            print(x)
    except Error as e:
        print("Error while connecting to MySQL using Connection pool ", e)
    finally:
        # closing database connection.    
        cursor.close()
        connection_object.close()
        rows=cursor.rowcount
    print("MySQL connection is closed")
    # print(rows) #總筆數
    print(x) #最新一筆的訂單

    bookingId = x[0]
    print(bookingId)

    sql = "DELETE FROM booking_list WHERE id=%s AND member_id=%s;" #SQL指令 
    val = (str(bookingId), str(userid))
    try:
        # Get connection object from a pool
        connection_object = connection_pool.get_connection() #連線物件 commit時 需要使用
        cursor = connection_object.cursor()
        print("MySQL connection is opened")
        cursor.execute(sql, val)
        myresult = cursor.fetchall()
        x=""
        for x in myresult:
            print(x)
        connection_object.commit()    
    except Error as e:
        print("Error while connecting to MySQL using Connection pool ", e)
    finally:
        # closing database connection.    
        cursor.close()
        connection_object.close()
    print("MySQL connection is closed")
    print("已刪除訂單")

    return (jsonify({"ok": True})),200
    
    

            

app.run(port=3000, debug=True)
