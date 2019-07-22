from json import  load

with open(r'../static/json/toutiao.json', 'r',  encoding='utf-8') as f:
    json_list = load(f)     # 解析Json
    for lipstick in json_list:
        print("insert into App_goods(img,text,discount,origin_price, category_id,price)" + " values('"'%s'"','"'%s'"','"'%s'"','"'%s'"','"'%s'"','"'%s'"')"%(lipstick['img'], lipstick['text'],lipstick['discount'],'',3001,25)+';')




