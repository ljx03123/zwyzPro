//=======================订单======================
$(function(){
    var orderid = $('#pay').attr('orderid')
    var order_id = $('#pay').attr('order_id')
    $.post('/zwyzPro/order/0/', {'orderid':orderid}, function (response) {
         let total_num = 0
         goods_total_price = 0
            for (var i = 0; i < response.length; i++) {
                var obj = response[i];
                var goodsImg = obj.img;
                var goodsPrice = parseFloat(obj.price);
                var goodsText = obj.text;
                var num=  parseInt(obj.num);
                var totalPrice = num*goodsPrice;
                 total_num += num
                goods_total_price += totalPrice
                //将创建的节点添加到页面上
                var _tr = "<tr class='group'><td class='table_item_name mycart_listpro_show'><div class='mycart_selpro'><p class='selpro_img'><a target='_blank' href=''><img src="+goodsImg+" /></a></p><div class='selpro_info'><p class='selpro_name'><a target='_blank' href=''>"+goodsText+"</a></p></div></div></td><td class='table_item_price'><p>￥<span>"+goodsPrice+"</span></p></td><td class='table_item_amount'><div class='table_item_amoutbox'><span >"+num+"</span></div></td><td class='table_item_allpay'><p>"+totalPrice+"</p></td><td class='table_item_integral'><p>"+parseInt(totalPrice)+"</p></td><td class='table_item_operate'></td></tr>"

                $("._tbody").append(_tr);
                $(".myallinfo_allamount").find('i').html(total_num);
                $(".myallinfo_allpay").find('em').html(goods_total_price);
            }
            if(response.length == 1 ){
                if(response[0].num == 1) {
                    var _tr = "<tr class='group'><td class='table_item_name mycart_listpro_show'><div class='mycart_selpro'><p style='font-size:13px;'>运费<a target='_blank' href='' ></a></p><div class='selpro_info'><p class='selpro_name'><a target='_blank' href='' ></a></p></div></div></td><td class='table_item_price'><p><span></span></p></td><td class='table_item_amount'><div class='table_item_amoutbox'><span >1</span></div></td><td class='table_item_allpay'><p>5</p></td><td class='table_item_integral'><p></p></td><td class='table_item_operate'></td></tr>"
                    $("._tbody").append(_tr);
                    goods_total_price += 5
                    $(".myallinfo_allpay").find('em').html(goods_total_price);
                }
        }
    })

    $('#pay').click(function () {
        $.post('/zwyzPro/pay/', {'orderid': orderid, 'order_id':order_id, 'goods_total_price':goods_total_price}, function (response) {
            let re_url = response.re_url
            location.href = re_url

        })

        })

    })

