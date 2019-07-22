
//=================商品首页列表展开收起===============
$(function(){
	var flag = true; //定义一个标识， flag = true的时候，触发点击事件
	$(".lbm_fcbtn_one").click(function(){
	    if(flag){
			$('.iscroll_contbox_one').css("height","200");
			$(this).find('span').html('收起');
			flag = false;
	    }else {
			$('.iscroll_contbox_one').css("height","75");
			$(this).find('span').html('展开');
			flag = true;
		}
	})
	$(".lbm_fcbtn_two").click(function(){
		if(flag){
			$('.iscroll_contbox_two').css("height","200");
			$(this).find('span').html('收起');
			flag = false;
		}else {
			$('.iscroll_contbox_two').css("height","75");
			$(this).find('span').html('展开');
			flag = true;
		}
	})
})

//=================列表详情=================
$(function(){
	 $.get("/zwyzPro/lipstick/", function(data) {
        for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            var img = obj.img;
            var goodsid = obj.id;
            var price = obj.price;
            var del = obj.origin_price;
            var text = obj.text;

            //将创建的节点添加到页面上
            // href=detail.html?"+id+"
            var _list= "<li><div class='goods_img' id="+goodsid+"><a ><img src="+img+" /></a> </div><div class='goods_price'><p class='pro_name'><a href='detail.html'>"+text+"</a></p><p class='now_price'><i>￥</i><span class='price_day'>"+price+"</span><del>"+del+"</del></p><p class='buy_btn'><a class='put-cart'  id="+goodsid+">加入购物车</a></p></div></li>";
            $("#bfd_show_fu").append(_list);
            fn()

			 $(document).on('click',  '.goods_img', function () {
                let goodsid = $(this).attr('id')
                $.post('/zwyzPro/detail/'+goodsid+'/', {'goodsid': goodsid}, function (response) {
                    if(response.status == 1) {
                        location.href = '/zwyzPro/detail/' + goodsid + '/'
                    }
                    else {
                        alert(response.msg)
                        return false
                    }
                })
            })
        }

    });

});
$(function(){
	$('body').on('click','.put-cart',function(){
	var goods_id = $(this).attr("id");
	$.get('/zwyzPro/addcar/', {goods_id:goods_id, num:1}, function (response) {
		if(response.status == 1){
			alert('加入购物车成功')
            fn()
		}
		else if(response.status == -1) {
			alert(response.msg)
		}
		else{
			location.href = '/zwyzPro/login/'
		}
    })
 });
});

//点击加入购物车侧边栏数量改变
function fn() {
        //结算数量
        $.get('/zwyzPro/goodsnum/', function (response) {
            var num = response.totalnum;
            $('.sshopcar_amout').text(num);
        });
        }

//===============点击top回到顶部=========================
$(function(){
	$("#sidebar_top").click(function(){
		$("body").animate({
			scrollTop:0
		},100);
	})
})

//==================侧边栏鼠标滑过=================
$(function(){
	$('.sidebar_item').hover(function(){
		$(this).find($(".sitem_btn")).css("background-color","#00c8ff");
	},function(){
		$(this).find($(".sitem_btn")).css("background-color","#6c6c6c");
	})

	$('#sidebar_login').hover(function(){
		$(this).find('div').fadeIn();
	},function(){
		$(this).find('div').stop(true,true).fadeOut();
	});

	$('#sidebar_collect').hover(function(){
		$(this).find('div').fadeIn();
	},function(){
		$(this).find('div').stop(true,true).fadeOut();
	});

	$('#sidebar_foot').hover(function(){
		$(this).find('div').fadeIn();
	},function(){
		$(this).find('div').stop(true,true).fadeOut();
	});

	$('#sidebar_servers').hover(function(){
		$(this).find('div').fadeIn();
	},function(){
		$(this).find('div').stop(true,true).fadeOut();
	});
})


//===================侧边栏购物车================


//=========================点击加入购物车动画效果=============
$(function(){

	var offset = $(".sitem_btnbg").offset();  //结束的地方的元素
	$('body').on('click','.put-cart',function(event){   //是$(".addcar")这个元素点击促发的 开始动画的位置就是这个元素的位置为起点
		var addcar = $(this);
		var imgSrc = addcar.parent().parent().siblings().find('img').attr('src');
		var flyer = $('<img class="u-flyer" src="' + imgSrc + '">');
		flyer.fly({
			//飞的起始位置
			start: {
				left: event.clientX,
				top: event.pageY - $(window).scrollTop()
			},
			//飞的结束位置
			end: {
				left: offset.left,
				top: offset.top,
				height:0
				//width:10
			},
			onEnd: function () {
				flyer.remove()
			}
		});

	})

})

























