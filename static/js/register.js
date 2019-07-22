$(function(){
    //正则验证
//用户名【手机号】
    var isUserName=false;
    $("#signup-mobile").blur(function(){
        var regUserName=/1[34578]\d{9}/g;
        if(regUserName.test($("#signup-mobile").val())){
            $(".error1").html("");
            $(".error1").css({"color":"green"});
            isUserName=true;
              var telphone = $("#signup-mobile").val();
         console.log(telphone);
        $.get('/zwyzPro/is_register/', {telphone:telphone}, function (response) {
            console.log(response);
            if (response.status == 1){
                // $('.is_register').html('此手机号码可注册').css('color', 'green')
            }
            else if(response.status == 0){
                $('.error1').html(response.msg).css('color', 'red')
            }
        });
        }else{
            $(".error1").html("手机格式有误，请重新输入!");
            $(".error1").css({"color":"red"});
        }


    });

    //密码
    var isPassWord=false;
    $("#signup-password").blur(function(){
        //password
        var regPassWord=/^[a-z0-9_-]{6,16}$/;
        if(regPassWord.test($("#signup-password").val())){
            $(".error2").html("");
            $(".error2").css({"color":"green"});
            isPassWord=true;
        }else{
            $(".error2").html("密码长度需6-16位字符");
            $(".error2").css({"color":"red"});
        }
    })
    //重复密码
    var isPassWord2=false;
    $("#signup-password-confirm").blur(function(){
        if($("#signup-password-confirm").val()==$("#signup-password").val()){
            $(".error3").html("");
            $(".error3").css({"color":"green"});
            isPassWord2=true;
        }else{
            $(".error3").html("两次输入的密码不匹配");
            $(".error3").css({"color":"red"});
        }
    });

    // 判断手机验证码
    $("#btn").click(function(){
        var telphone = $("#signup-mobile").val();
        if (telphone == ''){
            $('#btn').html('请填手机号码').css('color', 'white')
        }
        else {
            $.get('/zwyzPro/sendmsg/', { telphone:telphone, is_send:1}, function(response){
            console.log(response);
            if (response.status == 1){
                telphone_vode = response.telphone_vode;
                $('#btn').html('发送成功')
            }
            else if(response.status == 0){
                $('#btn').html('发送失败!').css('color', 'red')
            }
        })}

    });
    var istelphonevode=false;
    $("#telphone_vode").blur(function(){
        let user_vode = $('#telphone_vode').val();
            if (telphone_vode == user_vode){
                $(".error5").html("");
                istelphonevode=true
            }
            else {
                $('.error5').html('手机验证码错误!').css('color', 'red')
            }


 });

    //判断验证码
    var isYanzheng=false;
    $("#signup-verify-code").blur(function(){
        if($("#signup-verify-code").val().toLowerCase()==$("#p1").text().toLowerCase()){
            $(".error4").html("");
            isYanzheng=true;
        }else{
            $(".error4").html("验证码输入错误");
            $(".error4").css({"color":"red"});
        }
    });

    $("#signup-submit").click(function(e){
        e.preventDefault();
        var telphone = $("#signup-mobile").val();
        var password = md5($("#signup-password-confirm").val());
        if(isUserName&&isPassWord&&isPassWord2&&isYanzheng&&istelphonevode){
            $.post('/zwyzPro/register/', {telphone:telphone, password:password}, function (response) {
                if (response.status == 1){
                    location.href="/zwyzPro/login/"
                }
        })}
       else{
            alert("账号不合法，请重新注册");
        }
    });

    //验证码
    //生成随机验证码的ascII码
    function suiji(){
        var num=parseInt(Math.random()*123);
        if((num>=48&&num<=57)||(num>=65&&num<=90)||(num>=97&&num<=122)){
            return num;
        }else{
            return suiji();
        }
    }
    //生成验证码
    for(var i=0;i<4;i++){
        $("#p1").append($("<span>"+String.fromCharCode(suiji())+"</span>"));
        $("#p1 span").last().css("color",randomColor());
    };
    //点击验证码的框可以更换验证码
    $("#change_code").click(function(){
        $("#p1").html("");
        for(var i=0;i<4;i++){
            $("#p1").append($("<span>"+String.fromCharCode(suiji())+"</span>"));
            $("#p1 span").last().css("color",randomColor());
        };
    })
    //随机颜色函数
    function randomColor(){
        var res="rgb("+parseInt(Math.random()*256)+","+parseInt(Math.random()*256)
            +","+parseInt(Math.random()*256)+")";
        return res;
    }



})