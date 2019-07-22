$(function(){

     //验证用户名
    var isUserName=false;
    $(".sign_txt").blur(function(){
        // var _username = this.value;
        var reg= /1[34578]\d{9}/g;
        if(reg.test($('.sign_txt').val())){
            $(".login_username_i").html("");
            isUserName=true;
        }else{
            $(".login_username_i").html("你的用户名格式有误，请重新输入");
            $(".login_username_i").css("color","#EE4242");
        }
    })

    //验证密码
    var isPassWord=false;
    $("#login-password").blur(function(){
        //password
        var regPassWord=/^[a-z0-9_-]{6,16}$/;
        if(regPassWord.test($("#login-password").val())){
            $(".login_password_i").html("");
            isPassWord=true;
        }else{
            $(".login_password_i").html("密码格式有误");
            $(".login_password_i").css({"color":"red"});
        }
    })

    // 验证验证码
    var isYanzheng=false;
    $("#signup-verify-code").blur(function(){
        if($("#signup-verify-code").val().toLowerCase()==$("#p1").text().toLowerCase()){
            $(".login_yanzhengma_i").html("");
            isYanzheng=true;
        }else{
            $(".login_yanzhengma_i").html("验证码输入错误");
            $(".login_yanzhengma_i").css({"color":"red"});
        }
    });




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

    //点击登录按钮
    $("#log_in").click(function(){
        var telphone = $("#login-username").val();
        var password = md5($("#login-password").val());
        if(isUserName&&isPassWord&&isYanzheng) {
             $.post('/zwyzPro/login/', {telphone:telphone, password:password}, function (response) {
                 if (response.status == 1){
                    location.href="/zwyzPro/index/"
                }
                else{
                     alert(response.msg);
                 }
             
             })}

        else {
            alert("输入有误,请重新登录!");
            return false

        }
        })

})
