/**
 * Created by developer on 2016/10/11.
 */
if (!window.rrcw) window.rrcw = {};
(function ($) {
    rrcw.defaults = {

        url: 'http://api-int.i-caiwu.com',
       // url: 'http://api.i-caiwu.com',
        token: '',
        openid:'',
        userid:''
    };
    rrcw.defaultsC= {
        url: 'http://api-int.i-caiwu.com',
        //url: 'http://api.i-caiwu.com',
        token: '',
        openid:'',
        userid:''
    };
    // https://api-int.i-caiwu.cn
//本地存储
  rrcw.localStorage={
//存储一个键值对到localStorage中去
//key 键名 value 键值(可以为对象) CTime 缓存时间，单位s
    set:function(key,value,cTime){
        var cValue={};
        cValue.data=value;
        if(cTime&& parseInt(cTime)>0) cValue.expire=(new Date().getTime()/1000)+cTime;//设置缓存时间
        else cValue.expire=0;
        window.localStorage.setItem(key,JSON.stringify(cValue));
    },
//从localStorage中获取键值对，注意：如果值过期了，则返回null
    get:function(key){
        try{
            var rst=JSON.parse(window.localStorage.getItem(key));
            if(!rst) rst=null;
//缓存过期判断
            else if(rst.expire>0 && rst.expire<=(new Date().getTime()/1000)) rst=null;
            else rst=rst.data;
        }
        catch(errcw){
            var rst=null;}
        return rst;
    },
//删除一个数据
    del:function(key){
        window.localStorage.removeItem(key);},
//清空localStorage
    clear:function(key){
        window.localStorage.clear();}
};

    rrcw.start = function () {
        if(rrcw.localStorage.get('wechatB'))
        {
            rrcw.defaults.userid=rrcw.localStorage.get('wechatB').userid;
            rrcw.defaults.token=rrcw.localStorage.get('wechatB').token;
            rrcw.defaults.openid=rrcw.localStorage.get('wechatB').openid;
        }
    };
    rrcw.start();
    rrcw.startC= function () {
        if(rrcw.localStorage.get('wechatC'))
        {
            rrcw.defaultsC.userid=rrcw.localStorage.get('wechatC').userid;
            rrcw.defaultsC.token=rrcw.localStorage.get('wechatC').token;
            rrcw.defaultsC.openid=rrcw.localStorage.get('wechatC').openid;
        }
    };
    rrcw.startC();
    //字符串格式化操作
    rrcw.StringFormat = function () {
        if (arguments.length == 0)
            return null;
        var str = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
            str = str.replace(re, arguments[i]);
        }
        return str;
    };

//跨域ajax请求函数 url设为一个对象，命名方法  驼峰式 path+Url
    rrcw.requestSuccess = function(json,url,success) {
        var token=rrcw.localStorage.get('wechatB').token,
            path= url.path,//路径
            posturl= rrcw.defaults.url+path+"?token="+token;
        $.ajax({
            url: posturl,
            type: "POST",
            dataType: 'json',
            data: json,
            timeout: 5000,
            success: success,
            error: function(xhr) {
                console.log("请求出错(请检查相关度网络状况.)",xhr);
            }
        })
    };
    rrcw.requestSuccessC = function(json,url,success) {
        var token=rrcw.localStorage.get('wechatC').token,
            path= url.path,//路径
            posturl= rrcw.defaultsC.url+path+"?token="+token;
        $.ajax({
            url: posturl,
            type: "POST",
            dataType: 'json',
            data: json,
            timeout: 5000,
            success: success,
            error: function(xhr) {
                console.log("请求出错(请检查相关度网络状况.)",xhr);
            }
        })
    };
    rrcw.requestSuccessAsyncFalse = function(json,url, success) {//B端同步
        var token=rrcw.localStorage.get('wechatB').token,
            path= url.path,//路径
            posturl=rrcw.defaults.url+path+"?token="+token;

        $.ajax({
            url: posturl,
            type: "POST",
            async: false,
            dataType: 'json',
            data: json,
            timeout: 5000,
            success: success,
            error: function(xhr) {
                console.log("请求出错(请检查相关度网络状况.)",xhr);
            }
        })
    };
    rrcw.requestSuccessCAsyncFalse = function(json,url, success) {//C端同步
        var token=rrcw.localStorage.get('wechatC').token,
            path= url.path,//路径
            posturl=rrcw.defaultsC.url+path+"?token="+token;

        $.ajax({
            url: posturl,
            type: "POST",
            async: false,
            dataType: 'json',
            data: json,
            timeout: 5000,
            success: success,
            error: function(xhr) {
                console.log("请求出错(请检查相关度网络状况.)",xhr);
            }
        })
    };
rrcw.go404= function (s) {
    if(!s){location.href="../../404error.html"}
};
    rrcw.IsRegisterB= function () {
         var openid = rrcw.getUrlParam('openid');
        if(!openid){
            if(rrcw.localStorage.get('wechatB'))
            {
                openid=rrcw.localStorage.get('wechatB').openid;
            }
        }
        rrcw.go404(openid);
        rrcw.IsRegister(openid);
    };
    //验证用户是否注册
    rrcw.IsRegister=function(openid) {
        var isRegisterJson = {'openid':openid},
            isRegisterUrl = {path: "/PlatApi/IsRegister"};
        rrcw.requestSuccessAsyncFalse(isRegisterJson, isRegisterUrl, function (req) {
            if (req.Status == 0) {
                var data = req.Data;//若没有注册前去注册，若已注册继续操作
                if(!data.IsRegister){
                    window.location.href = '/html/register.html';
                }
                rrcw.defaults.userid = data.User.Id;
                rrcw.localStorage.set('wechatB',rrcw.defaults);
            }
        });
    };
    rrcw.GetUserid=function(openid) {
        var posturl = rrcw.defaults.url + "/WechatApi/GetWechatUser?token=" + rrcw.defaults.token;
        var isRegisterJson = {'openid': openid};
        $.ajax({
            url: posturl,
            type: "POST",
            dataType: 'json',
            data: isRegisterJson,
            timeout: 5000,
            success: function (req) {
                console.log('微信用户信息',req);
                if (req.Status == 0) {
                    var data = req.Data;//若没有注册前去注册，若已注册继续操作
                    //my.html加载信息   性别保密
                    var sex = data.Sex,
                       mobile=data.Mobile||'';
                    $('.name').text(data.Nickname2);
                    $('#userIcon').attr('src', data.Picurl);
                    $('.sexAge').find('div').eq(0).attr('data-sex', sex);
                    $('.tel').html(mobile);
                    rrcw.defaults.userid = data.UserId;
                    rrcw.localStorage.set('wechatB', rrcw.defaults);
                    var BUser={
                        "name":data.Nickname2,
                        "sex":sex,
                        "email":data.Email||''
                    };
                    rrcw.localStorage.set('BUser',BUser);//将微信用户信息存储
                }
            },
            error: function (xhr) {
                console.log("请求出错(请检查相关度网络状况.)", xhr);
            }
        })
    };
    rrcw.GetUseridC = function(openid) {
        if(!openid)return;
        var posturl = rrcw.defaultsC.url + "/WechatApi/GetWechatUser?token=" + rrcw.defaultsC.token;
        var Json = {'openid': openid};
        $.ajax({
            url: posturl,
            type: "POST",
            dataType: 'json',
            data: Json,
            timeout: 5000,
            success: function (req) {
                if (req.Status == 0) {//加载微信用户的基本信息
                    var data = req.Data;
                    /*console.log("common:",data);
                    var nickname2 = data.Nickname2;
                    $('#CName').html(nickname2);*/
                    $('#CUserIcon').attr('src', data.Picurl);
                    rrcw.defaultsC.userid = data.UserId;
                    rrcw.localStorage.set('wechatC', rrcw.defaultsC);
                }
            },
            error: function (xhr) {
                console.log("请求出错(请检查相关度网络状况.)", xhr);
            }
        })
    };

    rrcw.GetTokenB= function () {
        var openid = rrcw.getUrlParam('openid');
        if(!openid){
            if(rrcw.localStorage.get('wechatB'))
            {
                openid=rrcw.localStorage.get('wechatB').openid;
            }
        }
        console.log('openid',openid);
        rrcw.go404(openid);
        rrcw.GetToken(openid);
        rrcw.GetUserid(openid);

    };
    rrcw.GetTokenC= function () {
        var openid = rrcw.getUrlParam('openid');
        if(!openid){
            if(rrcw.localStorage.get('wechatC'))
            {
                openid=rrcw.localStorage.get('wechatC').openid;
            }
        }
        rrcw.go404(openid);
        rrcw.GetTokenCD(openid);
        rrcw.GetUseridC(openid);

    };
    rrcw.GetTokenCD=function(openid) {//得到c端token
       var posturl = rrcw.defaultsC.url+"/WechatApi/GetToken?openid="+openid;
        $.ajax({
            url: posturl,
            type: "POST",
            async: false,
            dataType: 'json',
            data: '',
            timeout: 5000,
            success: function (ref) {
                var token = ref.Data;
                //if(!token){
                //    window.location.href = "404error.html";
                //    return;
                //}
                rrcw.defaultsC.token = token;
                rrcw.defaultsC.openid = openid;
                //存放到本地
                rrcw.localStorage.set('wechatC',rrcw.defaultsC);
            },
            error: function(xhr) {
                console.log("请求出错(请检查相关度网络状况.)",xhr);
            }
        })
    };
    //根据openid得到B端token
    rrcw.GetToken=function(openid) {
       var posturl = rrcw.defaults.url+"/WechatApi/GetToken?openid="+openid;
        $.ajax({
            url: posturl,
            type: "POST",
            async: false,
            dataType: 'json',
            data: '',
            timeout: 5000,
            success: function (ref) {
                var token = ref.Data;
                //if(!token){
                //    window.location.href = "404error.html";
                //    return;
                //}
                rrcw.defaults.token = token;
                rrcw.defaults.openid = openid;
                //存放到本地
                rrcw.localStorage.set('wechatB',rrcw.defaults);
            },
            error: function(xhr) {
                console.log("请求出错(请检查相关度网络状况.)",xhr);
            }
        })
    };
rrcw.splitTime= function(time){//时间处理
        if(typeof time=='string'){
            var time1=parseInt(time.split('(')[1].split(')')[0]);
            return new Date(time1).pattern('yyyy/MM');
        }
        return null;
    };

 rrcw.getTime= function (time) {
     if(typeof time=='string'){
         return parseInt(time.split('(')[1].split(')')[0]);
     }
     return null;
 };
    rrcw.countDown=function (e,time, fn) {//倒计时 ios和安卓上Date对象行为不一致 -应转化为/
        var startTime=new Date();
        var maxtime = (new Date(time)-startTime)/ 1000;
        var msg,close;
        if(startTime>time){
            return;
        }
        var timer=setInterval(function () {
            if (maxtime >= 0) {
                var mm = parseInt(maxtime / 60 % 60,10);//计算剩余的分钟数
                var ss = parseInt(maxtime % 60, 10);//计算剩余的秒数
                mm = rrcw.checkTime(mm);
                ss = rrcw.checkTime(ss);
                msg ="支付剩余时间:&nbsp;&nbsp;"+mm + ":" + ss ;
                close=1;
                fn(msg,close);
                --maxtime;
            }
            else {
                clearInterval(timer);
                close=0;
                fn('', close)
            }
        }, 1000);
    };
   rrcw.checkTime=function (i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    };
    /** * date时间过滤，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
    可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
        Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
    * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
    * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
    * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
    * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
        * (new Date()).pattern('yyyy/MM')  ==>2016/12
        * 时间戳time  var date=new Date(time);
    */
    Date.prototype.pattern=function(fmt) {
            var o = {
                "M+" : this.getMonth()+1, //月份
                "d+" : this.getDate(), //日
                "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
                "H+" : this.getHours(), //小时
                "m+" : this.getMinutes(), //分
                "s+" : this.getSeconds(), //秒
                "q+" : Math.floor((this.getMonth()+3)/3), //季度
                "S" : this.getMilliseconds() //毫秒
            };
            var week = {
                "0" : "/u65e5",
                "1" : "/u4e00",
                "2" : "/u4e8c",
                "3" : "/u4e09",
                "4" : "/u56db",
                "5" : "/u4e94",
                "6" : "/u516d"
            };
            if(/(y+)/.test(fmt)){
                fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
            }
            if(/(E+)/.test(fmt)){
                fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
            }
            for(var k in o){
                if(new RegExp("("+ k +")").test(fmt)){
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                }
            }
            return fmt;
        };

    //时间yyyy/MM/dd   所有浏览器都支持 yyyy/MM/dd模式  yyyy-MM-dd ios下不支持
    rrcw.GetAllData = function(time){
        if(!time){return}
        return new Date(time).pattern('yyyy/MM/dd HH:mm:ss');
    };

//inputVal  检查input的值是否为空 notNull方法并提示  regCheck正则检验并提示
    rrcw.inputVal={
        //非空检查，并弹出提示信息
        notNull:function(str,prop){//str  input中输入的内容   prop  弹出提示框的内容
            if(str==''||str==null ||str=='请选择'){
                layer.open({
                    content:prop,
                    className: 'warning',
                    time: 1.5
                });
                return false ;
            }
            return true;
        },
        regCheck: function (str1,prop) {
         var str1 = str1.replace(/^\s$/g, '');//清空所有空格
        var txtReg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
        if (!txtReg.test(str1)) {
            layer.open({
                content: prop,
                className: 'warning',
                time: 1.5
            });
            return false;
        }
        return true;
    }
};


    rrcw.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURI(r[2]);
        }
        return "";
    };
    //格式化金额
    rrcw.formatMoney = function (amount) {
        amount = parseFloat((amount + "").replace(/[^\d\.-]/g, "")).toFixed(2) + "";//“2”代表精确到小数点后面“两”位
        var left = amount.split(".")[0].split("").reverse(),
            right = amount.split(".")[1];
        t = "";
        for (var i=0; i<left.length; i++) {
            t+=left[i]+((i+1)%3==0&&(i+1)!=left.length?",":"");
        }
        var money = t.split("").reverse().join("")+"."+right;
        if(money.indexOf("-,")>-1){
            money ="-" + money.split("-,")[1];
        }
        return money;
    };
    rrcw.formatNum = function (num) {
        return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    };
})(jQuery);