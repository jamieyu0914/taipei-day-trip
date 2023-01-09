from flask import Blueprint
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

orders_bp = Blueprint('orders',__name__)

@orders_bp.route("/api/orders", methods=["POST"])
def orderpost():

    JWT_cookie=request.cookies.get("token")
    decode=jwt.decode(JWT_cookie, "secret", algorithms=['HS256'])
    print(decode)

    Partner_Key = "partner_Fq50uDShbqf8YWInMnLzCHBBLVKxD4wSehFJIhYWXgHgoG7SQuy2RBFs"

    userid = decode['id']
    username = decode['name']
    useremail = decode['email']
    print(userid, username,useremail)

    post = request.get_json()
    prime = post["prime"]
    order_price = post["order"]["price"]
    order_trip = post["order"]["trip"]["attraction"]["id"]
    contact_name = post["contact"]["name"]
    contact_email = post["contact"]["email"]
    contact_phone = post["contact"]["phone"]
    # time = post["time"]
    # price = post["price"]
    # print(attractionId, date, time, price)
    # print(post)
    print(order_trip)
    print("HELOOOOOOOOOOOOO")

    if(userid =="" or username =="" or useremail == ""): #驗證失敗
        return (jsonify({
                "error": True,
                "message": "未登入系統，拒絕存取"
                })),403

    sql = "SELECT id, member_id FROM booking_list WHERE member_id=%s AND payment is NULL;" #SQL指令 核對訂單編號
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
        bookingid = x[0]         
    except Error as e:
        print("Error while connecting to MySQL using Connection pool ", e)
    finally:
        # closing database connection.    
        cursor.close()
        connection_object.close()
    print("MySQL connection is closed")         

    sql = "SELECT * FROM orders_list WHERE booking_id=%s AND member_id=%s ;" #SQL指令 檢查使用者訂單付款資料
    val = (str(bookingid), str(userid))
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
            print("HIIIIIIIIIIIYA")
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
    print("檢查先前的付款紀錄")
    if  (x !=""):#有付款紀錄:
        print("已經付款")
        today = datetime.date.today()
        print(today)
        ordersid = str(today)+"-TPEM-"+str(userid)+str(contact_phone)[7:10]+str(order_trip)+str(bookingid)
        print(contact_phone)
        print(ordersid)
        return (jsonify({
            "error": True,
            "message": "先前已付款",
            "ordersid": ordersid
            })),200
    elif (x ==""):#未有付款紀錄  
        print("未付款")       
        url="https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
        body={
            "prime": prime,
                "partner_key": Partner_Key,
                "merchant_id": "jamieyu0914_CTBC",
                "details":"TapPay Test",
                "amount": order_price,
            "cardholder":{
                "name": contact_name,
                "email": contact_email,
                "phone_number": contact_phone,
        },
            "remember": True
        }
        headers={
            "Content-Type": "application/json",
            "x-api-key": Partner_Key
        }
        tappay_result=requests.post(url, json=body, headers=headers)
        print("Tappay 回傳結果：", tappay_result.text)
        the_tappay_result=json.loads(tappay_result.text)
        if the_tappay_result['status']==0:
            message="付款成功"
            print("已付款")
            today = datetime.date.today()
            print(today)
            ordersid = str(today)+"-TPEM-"+str(userid)+str(contact_phone)[7:10]+str(order_trip)+str(bookingid)
            print(contact_phone)
            print(ordersid)
            sql = "INSERT INTO orders_list (orders_id, booking_id, member_id,  price, contactname, contactemail, contactphone) VALUES (%s, %s, %s, %s, %s, %s, %s);" #SQL指令 新增資料
            val = (str(ordersid), str(bookingid), str(userid), str(order_price), str(contact_name), str(contact_email), str(contact_phone))
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
                print("完成訂購")

            payment = "checked"    
            sql = "UPDATE booking_list SET payment = %s WHERE id = %s;" #SQL指令 新增資料
            val = (str(payment), str(bookingid))
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
                print("完成訂購")    
        else:
            message="付款失敗"
        result={
                "data": {
                    "number": ordersid,
                    "payment": {
                        "status": the_tappay_result['status'],
                        "message": message
                        }
                    }
                }
        response=make_response(result, 200)
        return response  

@orders_bp.route("/api/orders/<orderNumber>")
def orderNumber(orderNumber):

    JWT_cookie=request.cookies.get("token")
    decode=jwt.decode(JWT_cookie, "secret", algorithms=['HS256'])
    print(decode)

    userid = decode['id']
    username = decode['name']
    useremail = decode['email']
    print(userid, username,useremail)

    if(userid =="" or username =="" or useremail == ""): #驗證失敗
        return (jsonify({
                "error": True,
                "message": "未登入系統，拒絕存取"
                })),403

    Numbers = str(orderNumber)
    print(Numbers)
    sql = "SELECT * FROM orders_list  INNER JOIN booking_list ON booking_list.id=orders_list.booking_id WHERE orders_id = %s limit 1;" #SQL指令 
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
            number = x[1]
            price = x[4]
            contactname = x[5]
            contactemail = x[6]
            contactphone = x[7]
            attractionId = x[11]
            date = x[12]
            time = x[13]
            print(x)  
    except Error as e:
        print("Error while connecting to MySQL using Connection pool ", e)
        return (jsonify({"error":True, "message": "伺服器內部錯誤"})),500
    finally:
        # closing database connection.    
        cursor.close()
        connection_object.close()
        #print("MySQL connection is closed")
        print("DONE!")

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
    if (x == ""):
        result={
        "data":None}
    else:
        links = x[0].split(',')
        image = links[0]

        result={
                "data": {
                    "number": number,
                    "price": price,
                    "trip": {
                    "attraction": {
                        "id": attractionId ,
                        "name": name,
                        "address": address,
                        "image": image
                    },
                    "date": date,
                    "time": time
                    },
                    "contact": {
                    "name": contactname,
                    "email": contactemail,
                    "phone": contactphone
                    },
                    "status": 1
                }
                }            
    return (jsonify(result)),200             

