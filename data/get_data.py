#抓取 台北市政府提供景點公開資料 
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


jsonFile = open('taipei-attractions.json','r')
data = json.load(jsonFile)
results = data['result']['results']
#print(result)

nums = (len(results)) #取得資料數量
array=[]
for i in range(0,nums):
    attractions=results[i]
    id = str(attractions["_id"]) #景點編號
    #print(str(id))
    name = str(attractions["name"]) #景點名稱
    #print(str(name))
    category = str(attractions["CAT"]) #景點分類
    #print(str(category))
    description = str(attractions["description"]) #景點描述
    #print(str(description))
    address = str(attractions["address"]) #景點地址
    #print(str(address))
    transport = str(attractions["direction"]) #景點交通
    #print(str(transport))
    mrt = str(attractions["MRT"]) #景點捷運
    #print(str(mrt))
    lat = str(attractions["latitude"]) #景點緯度
    #print(str(lat))
    lng = str(attractions["longitude"]) #景點經度
    #print(str(lng))
    file = str(attractions["file"]) #從檔案連結中
    #print(file)

    #資料庫上傳景點資料
    sql = "INSERT INTO attractions_list (id, name, category, description, address, transport, mrt, lat, lng) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
    val = (id, name, category, description, address, transport, mrt, lat, lng)
    try:
        # Get connection object from a pool
        connection_object = connection_pool.get_connection() #連線物件 commit時 需要使用
        cursor = connection_object.cursor()
        #print("MySQL connection is opened")
        cursor.execute(sql, val)
        connection_object.commit()
    except Error as e:
        print("Error while connecting to MySQL using Connection pool ", e)
    finally:
        # closing database connection.    
        cursor.close()
        connection_object.close()
    #print("MySQL connection is closed")
print("DONE!")                 


#處理圖片資料
for j in range(0,1):
    print(id)
    nums = (len(attractions["file"].split("https"))) #取得圖片數量
    #print(nums)
    for k in range(1,nums):
        a = attractions["file"].split("https")[k] #分隔後將第k張圖片連結存入 a 陣列
        file_link = "https"+a
        number = str(k)
        if (file_link.find('.jpg')>0 or file_link.find('.JPG')>0 or file_link.find('.png')>0 or file_link.find('.PNG')>0): #過濾資料中，不是 JPG 或 PNG 的檔案
                #資料庫上傳景點圖片
            sql = "INSERT INTO images_list (attractions_id, link) VALUES (%s, %s)"
            val = (id, file_link)
            try:
                # Get connection object from a pool
                connection_object = connection_pool.get_connection() #連線物件 commit時 需要使用
                cursor = connection_object.cursor()
                #print("MySQL connection is opened")
                cursor.execute(sql, val)
                connection_object.commit()
            except Error as e:
                print("Error while connecting to MySQL using Connection pool ", e)
            finally:
                # closing database connection.    
                cursor.close()
                connection_object.close()
            #print("MySQL connection is closed")
        print("DONE!")         


   
    
            
      


