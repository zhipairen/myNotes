$(function() {
    var wxdata=
    {
        "b": [

            {
                "pathHtml": "index",
                "title": "人人财务——互联网+财务服务平台",
                "desc": "人人财务，全国领先的互联网财务服务平台。",
                "link": "http://mp.weixin.qq.com/s/PaElT0REpYHCWW9lOTNUlg",
                "imgurl": "http://b.i-caiwu.com/html/static/images/B_images/rrcwlogo.png"

            },
            {
                "pathHtml": "defaultB",
                "title": "人人财务——互联网+财务服务平台",
                "desc": "人人财务，全国领先的互联网财务服务平台。",
                "link": "http://mp.weixin.qq.com/s/PaElT0REpYHCWW9lOTNUlg",
                "imgurl": "http://b.i-caiwu.com/html/static/images/B_images/rrcwlogo.png"

            }
        ],
        "c": [

            {
                "pathHtml": "index",
                "title": "会计证的新玩法——加入人人财务财税师",
                "desc": "拿上你的会计证，到这里赚钱、学习、交朋友！！！",
                "link": "http://mp.weixin.qq.com/s/x3hWWdfOiXIvXCBM0nQv1g",
                "imgurl": "http://c.i-caiwu.com/html/static/images/B_images/rrcwlogo.png"

            },

            {

                "pathHtml": "defaultB",
                "title": "会计证的新玩法——加入人人财务财税师",
                "desc": "拿上你的会计证，到这里赚钱、学习、交朋友！！！",
                "link": "http://mp.weixin.qq.com/s/x3hWWdfOiXIvXCBM0nQv1g",
                "imgurl": "http://c.i-caiwu.com/html/static/images/B_images/rrcwlogo.png"

            }

        ]
    };

    var currentUrl=window.location.href;//完整url
    //var portName=window.location.host;//域名
    var params=window.location.search;//？之后的参数部分
    var pathName= window.location.pathname;//?之前文件地址
    var pathHtml= pathName.split('/'),
        pathH=pathHtml[pathHtml.length-1].split('.')[0];//页面html
    var jdata = eval(wxdata);
    var shareJson={},token,type;
    var cside= pathH.substring(0,2);
    if(cside.toLowerCase()!="c_"){//b端
        token = rrcw.localStorage.get('wechatB').token;
        type=0;
         $.each(jdata.b,function (i,wxB) {
                if(wxB.pathHtml==pathH){
                    shareJson=wxB;
                    return false;
                }else{//取默认
                    shareJson=wxB;
                }
         });
     }else{
        token = rrcw.localStorage.get('wechatC').token;
       type=1;
        $.each(jdata.c,function (i,wxC) {
            if(wxC.pathHtml==pathH){
                shareJson=wxC;
                return false;
            }else{//取默认
                shareJson=wxC;
            }
        });

    }
    getWXShareTime = function (typ,url) {
        var SetShareJson = {
                "client":typ,
                "current_url":url,
                "type": "jsapi"
            },
            SetShareUrl = {
                path: '/wechatapi/getjssdk'
            };

        requestWechatapiSuccess(SetShareJson, SetShareUrl, function (req) {
            if (req.Status == 0) {
                var data = req.Data;
                wx.config({
                    debug:false,
                    appId:data.appId,
                    timestamp: data.unixstamp,
                    nonceStr: data.nonceStr,
                    signature: data.signature,
                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
                });

                wx.ready(function () {

                    wx.onMenuShareTimeline({
                        title: shareJson.title,
                        link: shareJson.link,
                        imgUrl: shareJson.imgurl,
                        success: function () {
                        },
                        cancel: function () {
                        }
                    });
                    wx.onMenuShareAppMessage({
                        title: shareJson.title,
                        desc: shareJson.desc,
                        link: shareJson.link,
                        imgUrl: shareJson.imgurl,
                        type: 'link',
                        dataUrl: '',
                        success: function () {
                        },
                        cancel: function () {
                        }
                    });
                });

            }
            //TODO
            if(req.Status=="202") {
                if (typ == 0) {
                    rrcw.GetTokenB();
                }
                if (typ == 1) {
                    rrcw.GetTokenC();
                }
                location.reload();
            }
        });
    };
    requestWechatapiSuccess = function (json,url,success) {//B端同步
           var path = url.path,//路径
            posturl = rrcw.defaults.url + path + "?token=" + token;
        $.ajax({
            url: posturl,
            type: "POST",
            async: true,
            dataType:'json',
            data: json,
            timeout: 5000,
            success: success,
            error: function (xhr) {
                console.log("请求出错(请检查相关度网络状况.)", xhr);
            }
        })
    };
    getWXShareTime(type,currentUrl);
});