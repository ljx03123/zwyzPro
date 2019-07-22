from django.db import models


# 轮播图库
class Carousel(models.Model):
    img = models.CharField(max_length=255)

# 主展示商品
class Mainshow(models.Model):
    img = models.CharField(max_length=255)
    discount = models.CharField(max_length=30)
    text = models.CharField(max_length=255)
    price = models.CharField(max_length=30)
    category_id = models.CharField(max_length=20, default=3001)



# 新品
class Newgoods(models.Model):
    img = models.CharField(max_length=255)
    discount = models.CharField(max_length=30)
    text = models.CharField(max_length=255)
    price = models.CharField(max_length=30)
    origin_price = models.CharField(max_length=30)
    category_id = models.CharField(max_length=20, default=3002)



# 口红
class Lipstick(models.Model):
    img = models.CharField(max_length=255)
    price = models.CharField(max_length=30)
    origin_price = models.CharField(max_length=30)
    text = models.CharField(max_length=255)
    category_id = models.CharField(max_length=20, default=3003)

# 所有商品
class Goods(models.Model):
    img = models.CharField(max_length=255)
    price = models.CharField(max_length=30)
    text = models.CharField(max_length=255)
    origin_price = models.CharField(max_length=30)
    discount = models.CharField(max_length=30)
    category_id = models.CharField(max_length=20)

# 用户表
class User(models.Model):
    telphone = models.CharField(max_length=11, unique=True)
    password = models.CharField(max_length=100)

# 用户---商品的关系: 多对多
# 购物车(相当于用户--商品的中间表)
class Cart(models.Model):
    user = models.ForeignKey(User)
    goods = models.ForeignKey(Goods)
    num = models.IntegerField(default=1)
    is_select = models.BooleanField(default=True)

# 用户--订单: 1对多关系
# 订单
class Order(models.Model):
    order_id = models.CharField(max_length=50, unique=True)
    order_create = models.DateTimeField(auto_now_add=True)
    # 订单状态: 0表示未支付, 1表示待收货, 2表示待评价, 3表示已退款
    order_status = models.IntegerField(default=0)
    order_price = models.FloatField(default=0)
    user = models.ForeignKey(User)

# 订单--商品的中间表
class OrderGoods(models.Model):
    order = models.ForeignKey(Order)
    goods = models.ForeignKey(Goods)
    num = models.IntegerField()      # 商品数量


# 用户--收货信息: 1对多关系
# 收货信息


#　用户--收藏：　1对多关系
# 收藏表
