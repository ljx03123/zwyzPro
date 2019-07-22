from django.conf.urls import url

from .views import *

urlpatterns = [
    # 首页
    url(r'^index/', index, name='index'),
    # 首页-轮播图
    url(r'^carousel/', carousel, name='carousel'),
    # 首页主售产品
    url(r'^mainshow/', mainshow, name='mainshow'),
    # 首页新品
    url(r'^newgoods/', newgoods, name='newgoods'),

    # 登录
    url(r'^login/', login, name='login'),

    # 退出登录
    url(r'^logout/', logout, name='logout'),

    # 注册
    url(r'^register/', register, name='register'),
    url(r'^is_register/', is_register, name='is_register'),
    url(r'^sendmsg/', send_msg, name='sendmsg'),

    # 购物车
    url(r'^goodcar/', goodcar, name='goodcar'),
    url(r'^addcar/', addcar, name='addcar'),

    url(r'^goodsnum/', goods_num, name='goodsnum'),
    url(r'^totalgoodsprice/', total_goods_price, name='totalgoodsprice'),
    url(r'^reducegoods/', reduce_goods, name='reducegoods'),
    url(r'^addgoods/', add_goods, name='addgoods'),
    url(r'^selectgoods/', select_goods, name='selectgoods'),
    url(r'^delgoods/', del_goods, name='delgoods'),
    url(r'^delallgoods/', del_all_goods, name='delallgoods'),
    url(r'^delfalsegoods/', del_false_goods, name='delfalsegoods'),
    url(r'^entryorder/', entry_order, name='entryorder'),

    # 订单
    url(r'^order/(\w+)/', order, name='order'),

    # 支付
    url(r'^pay/', pay, name='pay'),
    url(r'^result/(\w+)/', result, name='result'),



    # 商品详情
    url(r'^detail/(\w+)/', detail, name='detail'),
    url(r'^list/', list, name='list'),

    # 口红列表
    url(r'^lipstick/', lipstick, name='lipstick'),

]