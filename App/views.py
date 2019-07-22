import hashlib
import random
import uuid
import requests
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect, reverse
from App.forms import RegisterForm
from App.models import *
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from App.alipay.alipay import AliPay


# 首页
def index(request):
    mainshows = Goods.objects.filter(category_id=3001)
    telphone = ''
    user_id = request.session.get('user_id')
    users = User.objects.filter(id=user_id)
    if users.exists():
        telphone = users.first().telphone
    return render(request, 'index.html', {'telphone': telphone, 'mainshow': mainshows.first()})


# 首页-carousel
def carousel(request):
    carousel_list = Carousel.objects.all()
    data = [{'id': imgobj.id, 'img': imgobj.img} for imgobj in carousel_list]
    return JsonResponse(data, safe=False)


# 首页-mainshow
def mainshow(request):
    mainshow_list = Goods.objects.filter(category_id=3001)
    data = [{
        'id': imgobj.id,
        'price': imgobj.price,
        'img': imgobj.img,
        'discount': imgobj.discount,
        'text': imgobj.text
    } for imgobj in mainshow_list]
    return JsonResponse(data, safe=False)


# 首页-newgoods
def newgoods(request):
    newgoods_list = Goods.objects.filter(category_id=3002)
    data = [{
        'id': imgobj.id,
        'img': imgobj.img,
        'discount': imgobj.discount,
        'text': imgobj.text,
        'price': imgobj.price,
        'origin_price': imgobj.origin_price
    } for imgobj in newgoods_list]
    return JsonResponse(data, safe=False)


# 注册
def register(request):
    data = {
        'status': 1,
        'msg': 'ok'
    }
    if request.method == 'GET':
        return render(request, 'register.html')
    if request.method == 'POST':
        telphone = request.POST.get('telphone')
        password = request.POST.get('password')
        user = User()
        user.telphone = telphone
        user.password = my_md5(password)
        user.save()
        return JsonResponse(data)


# 注册-用户名验证
def is_register(request):
    data = {
        'status': 1,
        'msg': 'ok'
    }
    if request.method == 'GET':
        telphone = request.GET.get('telphone')
        users = User.objects.filter(telphone=telphone)
        if users.exists():
            data['status'] = 0
            data['msg'] = '该手机号码已被注册'
        return JsonResponse(data)


#  注册--发送手机验证码
def send_msg(requset):
    data = {
        'status': 1,
        'msg': 'ok'
    }
    if requset.method == 'GET':
        is_send = int(requset.GET.get('is_send'))
        telphone = str(requset.GET.get('telphone'))
        if is_send == 1:
            vocode = send(telphone)
            print(vocode)
            data['telphone_vode'] = vocode
    else:
        data['status'] = -1
        data['msg'] = '请求方法错误'
    return JsonResponse(data)


# 注册--生成手机随机验证码
def gen_vcode():
    vcode = ''
    for i in range(6):
        vcode += str(random.randint(0, 9))
    return vcode


# 注册--发送手机验证码
def send(phone):
    vocode = gen_vcode()
    print(vocode)
    url = "https://open.ucpaas.com/ol/sms/sendsms"
    data = {
        'sid': '8ca9329e49ab2de12ff69e6927df3f3c',
        'token': 'b36328db797846849a8dfc00edaa4501',
        'appid': '8999560a53f9417bb256a84f1ce8528b',
        'templateid': '482125',
        'param': vocode,
        'mobile': phone,
    }
    response = requests.post(url, json=data)
    return vocode


# 用户登录
def login(request):
    
    if request.method == 'GET':
        return render(request, 'login.html')
    if request.method == 'POST':
        data = {
        'status': 1,
        'msg': 'ok'
    }
        telphone = request.POST.get('telphone')
        password = request.POST.get('password')
        users = User.objects.filter(telphone=telphone, password=my_md5(password))
        if users.exists():
            request.session['user_id'] = users.first().id
        else:
            data['status'] = 0
            data['msg'] = '用户名或密码错误,请检查后输入!'
        return JsonResponse(data)


# 退出登录
def logout(request):
    del request.session['user_id']
    return redirect(reverse('App:index'))


# md5加密
def my_md5(telphone):
    m = hashlib.md5()
    m.update(telphone.encode())
    return m.hexdigest()


# 购物车
def goodcar(request):
    if request.method == 'GET':
        return render(request, 'goodcar.html', {'telphone': request.user.telphone})
    if request.method == 'POST':
        data = [{'goods_id': cart.goods_id,
                 'num': cart.num,
                 'img': cart.goods.img,
                 'text': cart.goods.text,
                 'price': cart.goods.price.split('￥')[-1],
                 'is_select': cart.is_select
                 } for cart in Cart.objects.filter(user_id=request.user.id)]
        return JsonResponse(data, safe=False)


# 购物车 商品总数
def goods_num(request):
    data = {'totalnum': 0}
    if request.method == 'GET':
        user_id = int(request.user.id)
        carts = Cart.objects.filter(user_id=user_id, is_select=True)
        total_num = 0
        if carts.exists():
            for cart in carts:
                total_num += cart.num
            data['totalnum'] = total_num
        return JsonResponse(data)


# 购物车 总价格
def total_goods_price(request):
    data = {'status': 1, 'msg': '无选择商品'}
    if request.method == 'GET':
        user_id = int(request.user.id)
        carts = Cart.objects.filter(user_id=user_id, is_select=True)
        if carts.exists():
            data = [{'num': cart.num, 'price': cart.goods.price.split('￥')[-1]} for cart in carts]
        return JsonResponse(data, safe=False)


# 购物车 -
def reduce_goods(request):
    data = {
        'status': 1,
        'msg': 'ok'
    }
    if request.method == 'GET':
        goods_id = int(request.GET.get('goods_id'))
        user_id = int(request.user.id)
        carts = Cart.objects.filter(goods_id=goods_id, user_id=user_id)
        if carts.exists():
            cart = carts.first()
            if cart.num <= 1:
                cart.num = 1
            else:
                cart.num -= 1
            data['num'] = cart.num
            data['goodsprice'] = cart.goods.price.split('￥')[-1]
            cart.save()
        else:
            data['status'] = -1
            data['msg'] = '商品未找到'
    else:
        data['status'] = -2
        data['msg'] = '请求方式错误'
    return JsonResponse(data)


# 购物车 +
def add_goods(request):
    data = {
        'status': 1,
        'msg': 'ok'
    }
    if request.method == 'GET':
        goods_id = int(request.GET.get('goods_id'))
        user_id = int(request.user.id)
        carts = Cart.objects.filter(goods_id=goods_id, user_id=user_id)
        if carts.exists():
            cart = carts.first()
            cart.num += 1
            data['num'] = cart.num
            data['goodsprice'] = cart.goods.price.split('￥')[-1]
            cart.save()
        else:
            data['status'] = -1
            data['msg'] = '商品未找到'
    else:
        data['status'] = -2
        data['msg'] = '请求方式错误'
    return JsonResponse(data)


# 购物车 勾选
def select_goods(request):
    data = {
        'status': 1,
        'msg': 'ok'
    }
    if request.method == 'GET':
        goods_id = int(request.GET.get('goods_id'))
        user_id = int(request.user.id)
        carts = Cart.objects.filter(goods_id=goods_id, user_id=user_id)
        if carts.exists():
            cart = carts.first()
            cart.is_select = not cart.is_select
            cart.save()
            data['is_select'] = cart.is_select
        else:
            data['status'] = -1
            data['msg'] = '选择失败'

    else:
        data['status'] = -2
        data['msg'] = '请求方式错误'
    return JsonResponse(data)


# 购物车 单条删除
def del_goods(request):
    data = {
        'status': 1,
        'msg': 'ok'
    }
    if request.method == 'GET':
        goods_id = int(request.GET.get('goods_id'))
        user_id = int(request.user.id)
        carts = Cart.objects.filter(goods_id=goods_id, user_id=user_id)
        if carts.exists():
            carts.first().delete()
        else:
            data['status'] = -1
            data['msg'] = '删除失败'
    else:
        data['status'] = -2
        data['msg'] = '请求方式错误'
    return JsonResponse(data)


# 购物车 全部删除
def del_all_goods(request):
    data = {
        'status': 1,
        'msg': 'ok'
    }
    if request.method == 'GET':
        user_id = int(request.user.id)
        carts = Cart.objects.filter(user_id=user_id)
        if carts.exists():
            carts.delete()
        else:
            data['status'] = -1
            data['msg'] = '购物车已清空'
    else:
        data['status'] = -2
        data['msg'] = '请求方式错误'
    return JsonResponse(data)


# 购物车 复选删除
def del_false_goods(request):
    data = {
        'status': 1,
        'msg': 'ok'
    }
    if request.method == 'GET':
        user_id = request.user.id
        # user_id = int(request.user.id)
        carts = Cart.objects.filter(user_id=user_id, is_select=True)
        if carts.exists():
            carts.delete()
        else:
            data['status'] = -1
            data['msg'] = '请选择要删除的商品'
    else:
        data['status'] = -2
        data['msg'] = '请求方式有误'
    return JsonResponse(data)


# 加入购物车
def addcar(request):
    data = {
        'status': 1,
        'msg': 'ok'
    }
    if request.method == 'GET':
        goods_id = int(request.GET.get('goods_id'))
        num = int(request.GET.get('num'))
        user_id = int(request.user.id)
        carts = Cart.objects.filter(goods_id=goods_id, user_id=user_id)
        if carts.exists():
            cart = carts.first()
            cart.num += num
            cart.save()
        else:
            cart = Cart()
            cart.user_id = user_id
            cart.goods_id = goods_id
            cart.num = num
            cart.save()
    else:
        data['status'] = -1
        data['msg'] = '加入购物车失败'
    return JsonResponse(data)


# 生成订单
def entry_order(request):
    data = {
        'status': 1,
        'msg': 'ok'
    }
    if request.method == 'GET':
        carts = Cart.objects.filter(user_id=request.user.id, is_select=True)
        if not carts.exists():
            data['status'] = 0
            data['msg'] = '您未选择任何商品'
        order = Order()
        order.user_id = request.user.id
        order.order_id = my_md5(str(create_order_num()))
        order.save()
        data['orderid'] = order.id
        total_price = 0
        counts = 0
        for cart in carts:
            counts += 1
            total_price += cart.num * float(cart.goods.price.split('￥')[-1])
            ordergoods = OrderGoods()
            ordergoods.order_id = order.id
            ordergoods.goods_id = cart.goods_id
            ordergoods.num = cart.num
            ordergoods.save()
        order.order_price = total_price
        print(order.order_price)
        if counts == 1:
            if carts.first().num == 1:
                order.order_price += 5
                print(order.order_price)
        order.save()
        carts.delete()
        return JsonResponse(data)


# 订单
def order(request, orderid):
    if request.method == 'GET':
        telphone = ''
        user_id = request.session.get('user_id')
        users = User.objects.filter(id=user_id)
        if users.exists():
            telphone = users.first().telphone
        order = Order.objects.filter(id=int(orderid)).first()
        return render(request, 'order.html', {'order': order, 'telphone': telphone})

    if request.method == 'POST':
        order_id = request.POST.get('orderid')
        ordergoods = OrderGoods.objects.filter(order_id=order_id)
        data = [{
            'num': ordergood.num,
            'img': Goods.objects.filter(id=ordergood.goods_id).first().img,
            'text': Goods.objects.filter(id=ordergood.goods_id).first().text,
            'price': Goods.objects.filter(id=ordergood.goods_id).first().price.split('￥')[-1],
        } for ordergood in ordergoods]
        return JsonResponse(data, safe=False)


# 生成订单随机码
def create_order_num():
    uid = uuid.uuid4()
    return uid


# 支付
def pay(request):
    if request.method == 'POST':
        orderid = request.POST.get('orderid')
        order_id = request.POST.get('order_id')
        goods_total_price = request.POST.get('goods_total_price')
        # 传递参数初始化支付宝
        alipay = AliPay(
            appid='2016100100640375',  # 设置签约的appid
            app_notify_url="http://127.0.0.1:8000/notify/",  # "http://projectsedus.com/",  # 异步支付通知url
            app_private_key_path=r"App/alipay/yingyong_si_yao.txt",  # 设置应用私钥
            alipay_public_key_path=r"App/alipay/zhifubao_gong_yao.txt",  # 支付宝的公钥，验证支付宝回传消息使用，不是你自己的公钥,
            debug=True,  # 默认False,            # 设置是否是沙箱环境，True是沙箱环境
            return_url="/zwyzPro/result/" + orderid + "/",
            # "http://47.92.87.172:8000/"  # 同步支付通知url
        )
        # 传递参数执行支付类里的direct_pay方法，返回签名后的支付参数
        url = alipay.direct_pay(
            subject=orderid,  # 订单名称
            # 订单号生成，一般是当前时间(精确到秒)+用户ID+随机数
            out_trade_no=order_id,  # 订单号
            total_amount=goods_total_price,  # 支付金额
            return_url="/zwyzPro/result/" + orderid + "/"  # 支付成功后，跳转url
        )

        # 将支付后的支付参数，拼接到支付网关
        # 注意：下面支付网关是沙箱环境，最终签名后组成支付宝的url请求
        re_url = "https://openapi.alipaydev.com/gateway.do?{data}".format(data=url)
        return JsonResponse({'re_url': re_url})


# 支付成功修改订单状态
def result(request, orderid):
    order = Order.objects.filter(id=int(orderid)).first()
    order.order_status = 1
    order.save()
    return redirect(reverse('App:index'))


# 口红列表
def list(request):
    telphone = ''
    user_id = request.session.get('user_id')
    users = User.objects.filter(id=user_id)
    if users.exists():
        telphone = users.first().telphone
    return render(request, 'list.html', {'telphone': telphone})


# 口红列表数据接口
def lipstick(request):
    lipstick_list = Goods.objects.filter(category_id='3003')
    data = [{
        'id': imgobj.id,
        'img': imgobj.img,
        'text': imgobj.text,
        'price': imgobj.price,
        'origin_price': imgobj.origin_price
    } for imgobj in lipstick_list]
    return JsonResponse(data, safe=False)


# 商品详情
def detail(request, goodsid):
    if request.method == 'GET':
        telphone = ''
        user_id = request.session.get('user_id')
        users = User.objects.filter(id=user_id)
        if users.exists():
            telphone = users.first().telphone
        goods = Goods.objects.filter(id=goodsid).first()
        price = goods.price.split('￥')[-1]
        return render(request, 'detail.html', {'goods': goods, 'price': price, 'telphone': telphone})
    data = {
        'status': 1,
        'msg': 'ok'
    }
    if request.method == 'POST':
        goods = Goods.objects.filter(id=goodsid)
        if goods.exists():
            pass
        else:
            data['status'] = -1
            data['msg'] = '没有该产品'
    else:
        data['status'] = -2
        data['msg'] = '请求方式错误'
    return JsonResponse(data)
