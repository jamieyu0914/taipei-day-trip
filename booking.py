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

booking_bp = Blueprint('booking',__name__)

@booking_bp.route("/api/booking", methods=["GET"])
def bookingget():

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

    sql = "SELECT * FROM booking_list where member_id=%s AND payment is NULL;" #SQL指令 
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
          
@booking_bp.route("/api/booking", methods=["POST"])
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
        sql = "SELECT * FROM booking_list WHERE member_id=%s AND attraction_id=%s AND booking_date=%s AND booking_time=%s;" #SQL指令 檢查使用者訂單資料
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
            return (jsonify({
                "error": True,
                "message": "伺服器內部錯誤"
                })),500
        finally:
            # closing database connection.    
            cursor.close()
            connection_object.close()
        print("MySQL connection is closed")            
        print("檢查先前的的預定行程")
        if (x ==""):#未有紀錄
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
        else:#先前有紀錄，覆蓋訂單    
            sql = "UPDATE booking_list SET attraction_id=%s, booking_date=%s, booking_time=%s, price=%s WHERE member_id=%s;" #SQL指令 更新資料
            val = (str(attractionId), str(date), str(time), str(price), str(userid))
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
                print("更新新的預定行程")
    return (jsonify({"ok": True})),200    

@booking_bp.route("/api/booking", methods=["DELETE"])
def bookingdelete():

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
