//===================小知推荐轮播=========================
$(function(){
    var _list = $(".rec-box-list");
    var _li = $(".rec-box-list .rec-box-list2");
    _li.first().clone().appendTo(_list);
    var size =$(".rec-box-list .rec-box-list2").length;
    //console.log(size); //5

    var i = 0;
//上一页
    $(".page-left").click(function(){
        i--;
        move();
    });
//下一页
    $(".page-right").click(function(){
        i++;
        move();
    });

    function move(){
        //如果超出左边界
        if(i<0){
            _list.css("left",-(size-1)*960); //瞬间移动到第五张图
            i = size -2; //即将移动到第4张图（i=3）
        }
        //如果超出右边界
        if( i>=size ){
            _list.css("left",0); //瞬间移动到第一张图（非动画）
            i = 1; //即将移动到第二张图（）
        }
        //动画移动
        _list.stop().animate({left:-i*960},500);
    }
})


//========================购物车======================
$(function(){
    $.post('/zwyzPro/goodcar/', function (response) {
            for (var i = 0; i < response.length; i++) {
                var obj = response[i];
                var goodsImg = obj.img;
                var goodsId = obj.goods_id;
                var goodsPrice = parseFloat(obj.price);
                var goodsText = obj.text;
                var num=  parseInt(obj.num);
                var totalPrice = num*goodsPrice;
                var is_select = obj.is_select;
                //将创建的节点添加到页面上
                if (is_select){
                    var _tr = "<tr class='group' data-id="+goodsId+"><td class='table_item_name mycart_listpro_show'><input class='table_item_check' type='checkbox' id="+goodsId+" checked><div class='mycart_selpro'><p class='selpro_img'><a target='_blank' href=''><img src="+goodsImg+" /></a></p><div class='selpro_info'><p class='selpro_name'><a target='_blank' href=''>"+goodsText+"</a></p></div></div></td><td class='table_item_price'><p>￥<span>"+goodsPrice+"</span></p></td><td class='table_item_amount'><div class='table_item_amoutbox'><p class='header_ginfo_amount' id="+goodsId+"><span class='decrease_num h_amout_down' id="+goodsId+"></span><input type='text' value="+num+"><span class='increase_num h_amout_up' id="+goodsId+"></span></p></div></td><td class='table_item_allpay'><p>"+totalPrice+"</p></td><td class='table_item_integral'><p>"+goodsPrice+"</p></td><td class='table_item_operate'><p><a class='item-buy-delete'  href='' id="+totalPrice+">删除</a><a href='' class='p_favorite'>收藏</a></p></td></tr>"
                }
                else {
                    var _tr = "<tr class='group' data-id="+goodsId+"><td class='table_item_name mycart_listpro_show'><input class='table_item_check' type='checkbox' id="+goodsId+"><div class='mycart_selpro'><p class='selpro_img'><a target='_blank' href=''><img src="+goodsImg+" /></a></p><div class='selpro_info'><p class='selpro_name'><a target='_blank' href=''>"+goodsText+"</a></p></div></div></td><td class='table_item_price'><p>￥<span>"+goodsPrice+"</span></p></td><td class='table_item_amount'><div class='table_item_amoutbox'><p class='header_ginfo_amount' id="+goodsId+"><span class='decrease_num h_amout_down' id="+goodsId+"></span><input type='text' value="+num+"><span class='increase_num h_amout_up' id="+goodsId+"></span></p></div></td><td class='table_item_allpay'><p>"+totalPrice+"</p></td><td class='table_item_integral'><p>"+goodsPrice+"</p></td><td class='table_item_operate'><p><a class='item-buy-delete'  href='' id="+totalPrice+">删除</a><a href='' class='p_favorite'>收藏</a></p></td></tr>"
                }
                $("._tbody").append(_tr);
            }
    })
 });

//===================购物车功能实现========================
$(function(){
    function fn() {
        //结算数量
        $.get('/zwyzPro/goodsnum/', function (response) {
            var num = response.totalnum;
            $(".myallinfo_allamount").find('i').html(num);
        });

        //结算价格
        $.get('/zwyzPro/totalgoodsprice/', function (response) {
                var total_price = 0;
            if (response.status) {
            }
             else {
                for (var i = 0; i < response.length; i++) {
                    var obj = response[i];
                    var goodsPrice = parseFloat(obj.price);
                    var num = parseInt(obj.num);
                    total_price += num * goodsPrice;
                }
                }
                $(".myallinfo_allpay").find('em').html(total_price);
        })
    }
        fn()

    // // 点击勾选
	$('body').on('click','.table_item_check',function(){
            var goods_id = $(this).attr('id');
            console.log(goods_id);
            $.get('/zwyzPro/selectgoods/',{goods_id:goods_id},  function (response) {
                console.log(response);
                if (response.status == 1){
                    if (response.is_select){
                        $('.table_item_check').prop(checked=true)
                    }
                    else{
                        $('.table_item_check').prop(checked=false)
                    }
                    fn()
                }
                else{
                    alert(response.msg)
                }
            })
    });

    //点击删除购物车
    $('body').on('click','.item-buy-delete',function(){
        var goods_id = $(this).attr('id');
            $.get('/zwyzPro/delgoods/',{goods_id:goods_id},  function (response) {
                if (response.status == 1){
                    $(this).parent().parent().parent().remove();
                    fn();
                }
                else{
                    alert(response.msg);
                }
            });
    });

    //清空购物车
    $(".qingkong").click(function(){
        that = $(this);
        $.get('/zwyzPro/delallgoods/', function (response) {
            if (response.status == 1){
                $(that).parents($(".group")).remove();
            }
            else{
                alert(response.msg);
                return false
            }
        });
    });

    //添加计算功能
    //点击减号
     $('body').on('click','.header_ginfo_amount span:first-child',function(){
         that = $(this);
        var goods_id = $(this).attr('id');
            $.get('/zwyzPro/reducegoods/',{goods_id:goods_id},  function (response) {
                console.log(response);
                if (response.status == 1){
                    var num = parseInt(response.num)
                    var goodsprice = parseFloat(response.goodsprice)
                    console.log(num * goodsprice)
                    $(that).siblings("input").val(num);
                    $(that).parents('.table_item_amount').siblings('.table_item_allpay').find('p').html(num * goodsprice)
                    fn()
                }
                else{
                    alert(response.msg)
                }
            })
    });

    //点击加号
    $('body').on('click','.header_ginfo_amount span:last-child',function(){
         that = $(this);
        var goods_id = $(this).attr('id');
        console.log(goods_id)
            $.get('/zwyzPro/addgoods/',{goods_id:goods_id},  function (response) {
                console.log(response);
                if (response.status == 1){
                    var num = parseInt(response.num)
                    var goodsprice = parseFloat(response.goodsprice)
                    $(that).siblings("input").val(num);
                    $(that).parents('.table_item_amount').siblings('.table_item_allpay').find('p').html(num * goodsprice)
                    fn()
                }
                else{
                    alert(response.msg)
                }
            })
    });


    //=================批量删除================
   $(document).on("click",".shanchu",function(e){
            e.preventDefault();
   	$.get('/zwyzPro/delfalsegoods/', function (response) {
   	    console.log(response);
            if (response.status == 1) {
                $(":checkbox").each(function () {
                    if ($(this).prop('checked')) {
                        $(this).parents('tr').remove();
                        fn()
                    }
                })
            }
            else{
                alert(response.msg);
            }
        });
    });

$('.myallinfo_gopaybtn').click(function () {
    $.get('/zwyzPro/entryorder/', function (response) {
        console.log(response);
        if (response.status == 1){
            location.href = "/zwyzPro/order/" +response.orderid + '/'
            return false
        }
        else if (response.status == 0){
            alert(response.msg)
            return false
        }
    })
})
})


