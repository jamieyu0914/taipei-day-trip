#抓取 台北市政府提供景點公開資料 

import json
jsonFile = open('taipei-attractions.json','r')
data = json.load(jsonFile)
results = data['result']['results']
#print(result)

nums = (len(results)) #取得資料數量
array=[]
for i in range(0,nums):
    attractions=results[i]
    id = attractions["_id"] #景點編號
    #print(str(id))
    name = attractions["name"] #景點名稱
    #print(str(name))
    category = attractions["CAT"] #景點分類
    #print(str(category))
    description = attractions["description"] #景點描述
    #print(str(description))
    address = attractions["address"] #景點地址
    #print(str(address))
    transport = attractions["direction"] #景點交通
    #print(str(transport))
    mrt = attractions["MRT"] #景點捷運
    #print(str(mrt))
    lat = attractions["latitude"] #景點緯度
    #print(str(lat))
    lng = attractions["longitude"] #景點經度
    #print(str(lng))
    
    file = attractions["file"] #從檔案連結中
    #print(file)



    for j in range(0,1):
        print(id)
        nums = (len(attractions["file"].split("https"))) #取得圖片數量
        #print(nums)
        for k in range(1,nums):
            a = attractions["file"].split("https")[k] #分隔後將第k張圖片連結存入 a 陣列
            jpg_firstfile = "https"+a
            number = str(k)
            print(number+'--'+jpg_firstfile)
            
      



    # for j in range(0,nums):
    #     print(id)

    #     if(file.find('.jpg')): #尋找副檔名為.jpg結尾的連結
    #         #print(file.find('.jpg'))
    #         a = attractions["file"].split("jpg")[0] #分隔後將第一張圖片連結存入 a 陣列
    #         jpg_firstfile = a+"jpg"
    #         print("1--"+jpg_firstfile)
    #         if(a.find('.jpg')>0): 
    #             b = attractions["file"].split("jpg")[1] #分隔後將第二張圖片連結存入 b 陣列
    #             jpg_secondfile = b+"jpg"
    #             print("2--"+jpg_secondfile) 
    #             c = attractions["file"].split("jpg")[2] #分隔後將第三張圖片連結存入 c 陣列
    #             jpg_thirdfile = c+"jpg"
    #             print("3--"+jpg_thirdfile) 
    #         if(a.find('.JPG')>0): #尋找尚有多個副檔名為.JPG結尾的連結
    #             #print(a.find('.JPG'))
    #             b = a.split('.JPG')[0] #分隔後將第一張圖片連結存入 b 陣列
    #             JPG_firstfile = b+".JPG"
    #             c = a.split('.JPG')[1] #分隔後將第二張圖片連結存入 c 陣列
    #             JPG_secondfile = c+".JPG"
    #             print("4--"+JPG_firstfile)
    #             print("5--"+JPG_secondfile)
      
               

           
         

    #data = [{"id":id,"name":str(name),"category":str(category),"description":str(description),"ddress":str(address),"transport":str(transport),"mrt":str(mrt),"lat":lat,"lng":lng,"img":[str(firstfile)]}]
    # array.append(data)   

    # print(data)  

# # import csv
# # # 開啟輸出的 CSV 檔案
# # with open('output.csv', 'w', newline='') as csvfile:
# # # 建立 CSV 檔寫入器
# #     writer = csv.writer(csvfile)
# #     writer.writerows(array)# 寫入一列資料
    
