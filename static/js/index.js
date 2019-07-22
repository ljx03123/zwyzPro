 /*--------------今日头条倒计时----------------*/
$(function(){ 
			    show();
			}); 
			 
function show(){
			    var time_start = new Date().getTime(); //设定当前时间
			    var time_end =  new Date("2016/10/15 00:00:00").getTime(); //设定目标时间
			    // 计算时间差 
			    var time_distance = time_end - time_start; 
			    // 天
			    var int_day = Math.floor(time_distance/86400000) 
			    time_distance -= int_day * 86400000; 
			    // 时
			    var int_hour = Math.floor(time_distance/3600000) 
			    time_distance -= int_hour * 3600000; 
			    // 分
			    var int_minute = Math.floor(time_distance/60000) 
			    time_distance -= int_minute * 60000; 
			    // 秒 
			    var int_second = Math.floor(time_distance/1000) 
			    // 时分秒为单数时、前面加零 
			    if(int_day < 10){ 
			        int_day = "0" + int_day; 
			    } 
			    if(int_hour < 10){ 
			        int_hour = "0" + int_hour; 
			    } 
			    if(int_minute < 10){ 
			        int_minute = "0" + int_minute; 
			    } 
			    if(int_second < 10){
			        int_second = "0" + int_second; 
			    } 
			    // 显示时间 
			    $(".time_d").html(int_day); 
			    $(".time_h").html(int_hour); 
			    $(".time_m").html(int_minute); 
			    $(".time_s").html(int_second); 
			    // 设置定时器
			    setTimeout("show()",1000); 
			}
			
//===================顶部图片=========================
$(function(){
	$(".span2").on('click', function(){
		$(".top-img").animate({"height":"300px"});
        $(".topbanner_big").css({"display":"block"});
        $(".topbanner_small").css({"display":"none"});
        $(".span1").css({"display":"block"});
        $(".span2").css({"display":"none"});

	})
	$(".span1").on('click', function(){
		$(".top-img").animate({"height":"100px"},function(){
            $(".topbanner_small").css({"display":"block"});
            $(".topbanner_big").css({"display":"none"});
            $(".span2").css({"display":"block"});
            $(".span1").css({"display":"none"});
        });

	})
})

//===================侧边栏楼梯==========================
$(function(){

    $(window).scroll(function(){
        var top=$(window).scrollTop();
        var nav=$(".side_nav")

        if (top>=500) {
            nav.fadeIn({"dispaly":"block"},1000);
        }else{
            nav.fadeOut({"dispaly":"none"},1000);
        }

    })
})
//=============================轮播图======================
$(function(){
    $.get("/zwyzPro/carousel/", function(data) {
        for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            var img = obj.img; //img
            var id = obj.id; //id

            //将创建的节点添加到页面上
            $(".f-img").append("<li><img src=" + img + " /></li>");
            $(".f_btn").append("<li></li>");

            //初始化把第一个li的样式变成选中状态
            if (i == 0) {
                $(".f_btn li").addClass("active");
            }
        }
        //开启自动轮播
        lunbo();
    });

    function lunbo(){
        var $playimages = $(".playimages");
        var $fimg = $(".f-img");
        var $fbtn = $(".f_btn");

        var i = 0;
        var len = $fimg.children('li').length;
        var timer = setInterval(animation,3000);
        //初始化
        show();
        function show(){
            if(i == len){
                i = 0;
            }
            if(i < 0){
                i = len - 1;
            }
            $fimg.children("li").eq(i).animate({opacity:1}).siblings().animate({opacity:0});
            $fbtn.children("li").eq(i).addClass("active").siblings().removeClass("active");
        }

        function animation(){
            i ++;
            show();
        }
        //鼠标移入停止轮播，鼠标移出开始轮播
        $playimages.on("mouseenter",function(){
            clearInterval(timer);
        }).on("mouseleave",function(){
            timer = setInterval(animation,3000);
        })
        //点击小图标切换
        $fbtn.on("click","li",function(){
            i = $(this).index();
            show();
        })
    }

 //===========================今日头条=====================
    $.get("/zwyzPro/mainshow/", function(data) {
        for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            var img = obj.img; //img
            var goodsId = obj.id; //id
            var discount = obj.discount;
            var text = obj.text;
            $(".m_list_cname").eq(i).append("<a><span>"+discount+"</span>"+text+"</a>");
            $(".m_list_img").eq(i).append("<a class='mianshow_img' id="+goodsId+"><img src=" + img + " /></a>");
            // $(".mlcb_btn fr").eq(i).attr("id", goodsId)
            // $(".mlcb_btn fr").eq(i).attr("id", goodsId)
        }
        fn()

        $(document).on('click',  '.mianshow_img', function () {
                let goodsid = $(this).attr('id')
                console.log(goodsid)
                $.post('/zwyzPro/detail/'+goodsid+'/', {'goodsid': goodsid}, function (response) {
                    console.log(response)
                    if(response.status == 1) {
                        location.href = '/zwyzPro/detail/' + goodsid + '/'
                    }
                    else {
                        alert(response.msg)
                        return false
                    }
                })
            })
    });
    
   

 //===================小知推荐轮播=========================
    var _list = $(".rec-box-list");
    var _li = $(".rec-box-list .rec-box-list2");
    _li.first().clone().appendTo(_list);
    var size =$(".rec-box-list .rec-box-list2").length;
    // console.log(size); //5

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
            _list.css("left",-(size-1)*1100); //瞬间移动到第五张图
            i = size -2; //即将移动到第4张图（i=3）
        }
        //如果超出右边界
        if( i>=size ){
            _list.css("left",0); //瞬间移动到第一张图（非动画）
            i = 1; //即将移动到第二张图（）
        }
        //动画移动
        _list.stop().animate({left:-i*1100},500);
    }

//==================品牌切换========================
    var indexCurrent = 0;
    var $navBtn = $('.brand_b_nav');
    var $navBtnLi = $navBtn.find('li');
    var $tabPage = $navBtn.next().find('.brand_bc_page');
    function tabMove(obj, index){
        obj.find('li').eq(index).addClass('bbn_current').siblings().removeClass('bbn_current');
        obj.next().find('.brand_bc_page').eq(index).show().siblings().hide();
    };
    $tabPage.eq(0).show();
    $navBtnLi.on('mouseenter',function(){
        indexCurrent = $(this).index();
        tabMove($navBtn,indexCurrent);
    })

    $('.bbc_leftbtn').on('click',function(){
        indexCurrent--;
        if(indexCurrent < 0){
            indexCurrent = 3;
        }
        tabMove($navBtn,indexCurrent);
    })

    $('.bbc_rightbtn').on('click',function(){
        indexCurrent++;
        if(indexCurrent > $('.brand_b_nav li').length-1){
            indexCurrent = 0;
        }
        tabMove($navBtn,indexCurrent);
    })

//========================今日新品详情=================================
    $.get("/zwyzPro/newgoods/", function(data) {
        for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            var img = obj.img;
            var id = obj.id;
            var discount = obj.discount;
            var price = obj.price.replace("￥", "");
            var del = obj.origin_price;
            var text = obj.text;

            //将创建的节点添加到页面上
            var _list = "<li><div class='evegoods'><div class='goods-img' id=" + id + "><img id='myimg' src=" + img + " /></div><div class='good-introduce'><p><span>" + discount + "</span>" + text + "</p></div><div class='buy-box'><div class='good-price'><span>" + price + "</span><del>" + del + "</del></div><div class='good-car'><p class='put-cart' id=" + id + ">加入购物车</p></div></div><div class='countdown'><p class='sale_tip_time'><span>距团购结束<span class='time_d'></span>天<span class='time_h'></span>小时<span class='time_m'></span>分<span class='time_s'></span>秒</span></p><p class='sale_tip_count'><span>409人已购买</span></p></div></div></li>";
            $("#grounpGoods").append(_list);


        }
    })

    $(document).on('click',  '.goods-img', function () {
                let goodsid = $(this).attr('id')
                console.log(goodsid)
                $.post('/zwyzPro/detail/'+goodsid+'/', {'goodsid': goodsid}, function (response) {
                    console.log(response)
                    if(response.status == 1) {
                        location.href = '/zwyzPro/detail/' + goodsid + '/'
                    }
                    else {
                        alert(response.msg)
                        return false
                    }
                })
            })


 })




 //===============点击top回到顶部=========================
 $(function(){
     $("#sidebar_top").click(function(){
         $("body").animate({
             scrollTop:0
         },100);
     })
 })



 // 加入购物车
 $(function(){
	$('body').on('click','.put-cart',function(){
	var goods_id = $(this).attr("id");
	$.get('/zwyzPro/addcar/', {goods_id:goods_id, num:1}, function (response) {
	    console.log(response)
		if(response.status == 1){
			alert('加入购物车成功');
            fn();
	    }
		else if(response.status == -1) {
			alert(response.msg)
            return false
		}
		else{
			location.href = '/zwyzPro/login/'
		}
    })
 });
});






 //===================侧边栏购物车===========================
 //点击加入购物车侧边栏数量改变
function fn() {
        //结算数量
        $.get('/zwyzPro/goodsnum/', function (response) {
            var num = response.totalnum;
            $('.sshopcar_amout').text(num);
        });
        }




