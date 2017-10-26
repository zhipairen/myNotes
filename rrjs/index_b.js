/**
 * Created by developer on 2016/10/11.
 */
$(function() {
    textCounter = function(field, counter, maxlimit) {
        var charcnt = field.value.length;
        if (charcnt > maxlimit) {
            field.value = field.value.substring(0, maxlimit);
        } else {
            document.getElementById(counter).innerHTML = charcnt + "/80个字";
        }
    }; //实时更新备注字数提示
    //首页定位 开始
    $("#position").click(function() {
        $(".masks,.alertAddr").css({ "display": "block" });
        setTimeout(function() {
            $(".alertAddr").css({ "opacity": "1", "top": ".88rem" });
        }, 1);
    });
    $(".selectArea div").click(function() {
        $(this).siblings().removeClass("bgColorf2");
        $(this).addClass("bgColorf2");
        $("#addrText").html($(".bgColorf2").html());
        // console.log("定位：" + $(".bgColorf2").html());
        //150毫秒后执行此动作
        setTimeout(function() {
            hideAddr();
        }, 100);
    });
    $(".masks").on("click", hideAddr);

    function hideAddr() {
        $(".selectArea div").removeClass("bgColorf2");
        $(".alertAddr").css({ "display": "none", "opacity": "1", "top": ".6rem" });
        $(".masks").css({ "display": "none" });
        $(".triangle").css({ "border-bottom": ".14rem solid #fff" });
    }
    $(".selectArea .select1").click(function() {
        $(".triangle").css({ "border-bottom": ".14rem solid #f2f2f2" });
    });
    //首页定位 结束
    $('.share_urls').click(function(){
            $(this).css({"display":"none"});
        });
    getDistrictList = function() {
        var getDistrictListJson = { "level": 1 },
            getDistrictListUrl = { path: "/PlatApi/GetDistrictList" };
        rrcw.requestSuccess(getDistrictListJson, getDistrictListUrl, function(req) {
            var districtList = '';
            if (req.Status == 0) {
                var data = req.Data;
                //定位数据
            }
        })
    };

    //商品类型tabs选项卡上加载
    getProductType = function() {
        var getProductTypeJson = {},
            getProductTypeUrl = {
                  path: "/PlatApi/GetProductTypeList"
            };
        rrcw.requestSuccess(getProductTypeJson, getProductTypeUrl, function(req) {
            var productStr = '';
            if (req.Status == 0) {
                var data = req.Data;
                $.each(data, function(i, product) {
                    productStr += ' <li>' + product.Name + '</li>';
                });
                $('.tabs>ul li').first().after(productStr);
            }
        })
    };


    //首页banner轮播图加载
    //路径驼峰式命名：path+Url
    index = function() {
        var bannerJson = {}, //post数据
            bannerUrl = {
                  path: "/PlatApi/GetBannerList"
            };
        rrcw.requestSuccess(bannerJson, bannerUrl, function(req) {
            var htmlStr = "";
            if (req.Status != 0) {
                return;
            }
            var data = req.Data;
            if (data.length) {
                // 设置href
                for (var i = 0, len = data.length; i < len; i++) {
                    htmlStr += "<li class='swiper-slide'>" +
                        "<a href='" + data[i].LinkPath + "' >" +
                        "<img src='" + data[i].PicPath + "'/>" +
                        "</a></li>";
                }
            } else {
                return;
            }
            $(".swiper-wrapper").html(htmlStr);
            //轮播图
            var bannerSwiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                loop: true, //循环播放
                autoplay: 3000,
                autoplayDisableOnInteraction: false, //滑动之后可继续自动轮播
                observer: true, //修改swiper自己或子元素时，自动初始化swiper
                observeParents: true //修改swiper的父元素时，自动初始化swiper
            });

        });
    };
    //加载用户基本信息  重要
    getUserBasicInfo = function() { //第一次加载微信信息，第二次加载修改的信息并保存本地
        var getUserInfoJson = {
                "user_type": 0,
                "id": rrcw.defaults.userid
            },
            getUserInfoUrl = {
                  path: "/PlatApi/GetUserInfo"
            };
        rrcw.requestSuccess(getUserInfoJson, getUserInfoUrl, function(req) {
            if (req.Status == 0) {
                var data = req.Data;
                var sex;
                if (!data) {
                    return;
                }
                if (data.Sex == 'null') {
                    sex = 'null'
                } else {
                    sex = data.Sex ? '1' : '0';
                }
                var BUser = {
                    'name': data.Name,
                    'loginId': data.LoginId,
                    'id': data.Id, //用户标识 user_id和id一样
                    'mobilePhone': data.Phone,
                    'email': data.Email,
                    'userType': data.UserType, //用户类型 0 b或 1 c
                    'openId': data.OpenId, //微信标识
                    'sex': data.Sex, // 用户性别
                    'icon': data.IconPath //用户微信头像
                };
                rrcw.localStorage.set('BUser', BUser); //Buser 本地存储用户基本信息
                //性别过滤   1男 0女 null为保密
            }
        });
    };
    getUserInfo = function() {
        var getUserInfoJson = {
                "user_type": 0,
                "id": rrcw.defaults.userid
            },
            getUserInfoUrl = {
                  path: "/PlatApi/GetUserInfo"
            };
        rrcw.requestSuccess(getUserInfoJson, getUserInfoUrl, function(req) {
            if (req.Status == 0) {
                var data = req.Data;
                var sex;
                if (!data) {
                    return;
                }
                if (data.Sex == 'null') {
                    sex = 'null'
                } else {
                    sex = data.Sex ? '1' : '0';
                }
                var BUser = {
                    'name': data.Name,
                    'loginId': data.LoginId,
                    'id': data.Id, //用户标识 user_id和id一样
                    'mobilePhone': data.Phone,
                    'email': data.Email,
                    'userType': data.UserType, //用户类型 0 b或 1 c
                    'openId': data.OpenId, //微信标识
                    'sex': data.Sex, // 用户性别
                    'icon': data.IconPath //用户微信头像
                };
                rrcw.localStorage.set('BUser', BUser); //Buser 本地存储用户基本信息
                //性别过滤   1男 0女 null为保密

                $('.name').text(data.Name);
                $('.sexAge').find('div').eq(0).attr('data-sex', sex);
                $('#telNum').html(data.Phone);
                $('#userIcon').attr('src', data.IconPath);
            } else {
                rrcw.GetTokenB();
            }
        })
    };
    //加载用户基本信息函数结束
    //获取商品列表
    getGoodsList = function(goodsType) {
        var goodsListJson = { "product_type_id": goodsType },
            goodsListUrl = {   path: "/PlatApi/GetGoodsList" };
        rrcw.requestSuccess(goodsListJson, goodsListUrl, function(req) {
            var goodsList = '',
                goodsBasicId = '';
            if (req.Status == 0) {
                var data = req.Data.Data;
                $.each(data, function(i, goods) {
                    var goodsInfo = {
                        "id": goods.Id,
                        "amount": goods.SalePrice
                    };
                    var pari;
                    if (goods.Unit== 0) {
                        pari = '月'
                    }else if(goods.Unit==1){
                        pari="季"
                    }else if(goods.Unit==2){
                        pari="年"
                    }else if(goods.Unit==3){
                        pari="次"
                    }
                    rrcw.localStorage.set('goods', goodsInfo);

                    goodsList += '<a href="taxFiling.html?goodsId=' + goods.Id + '&goodsType=' + goods.GoodsType + '"><article class="index"><figure> ' +
                        '<img src="' + goods.PicUrl + '"/></figure><section><i>' + rrcw.formatNum(goods.SalePrice) + '元/' + pari + '</i> ' +
                        '<h3>' + goods.Name + '</h3>' +
                        '<h4>' + goods.Tag + '</h4>' +
                        '<p>已有' + goods.SaleTimes + '家公司选择</p> ' +
                        '</section></article></a>';
                });
                $('.content').html(goodsList);
            }
        })
    };

    //商品详情展示  taxFiling.html
    goodsDetails = function() { //good_Type=1 个体商户 产品固定 不用分析总价
        var GoodId = rrcw.getUrlParam('goodsId'),
            goodsType = rrcw.getUrlParam('goodsType');
        var GoodsEnd = $('#goodsEnd');
        var goodDetailsJson = { "goods_id": GoodId },
            goodDetailsUrl = {   path: "/PlatApi/GetGoodsToProductList" };
        rrcw.requestSuccess(goodDetailsJson, goodDetailsUrl, function(req) {
            if (req.Status == 0) {
                var data = req.Data,
                    GoodAmount = data.goods.SalePrice,
                    GoodDetails = data.goods.Remark,
                     goods=data.goods;
                GoodsEnd.append(GoodDetails);
                var pari;
                if (goods.Unit== 0) {
                    pari = '月'
                }else if(goods.Unit==1){
                    pari="季"
                }else if(goods.Unit==2){
                    pari="年"
                }else if(goods.Unit==3){
                    pari="次"
                }
                GoodsEnd.next().find('div').eq(0).text(rrcw.formatNum(GoodAmount) + '元/' + pari);
                GoodsEnd.next().find('div').eq(0).addClass('money');
                $('#order').click(function() {
                    IsRegCompany1(GoodId,data);
                });
                $('.goodstitle').html(data.goods.Name);
            }
        });
    };
    IsRegCompany1=function (Id,data) {//是否是注册公司商品
        var IsRegCompanyJson = { "goodid": Id },
            IsRegCompanyUrl = {
                path: "/ThirdPeriod/IsRegCompany"
            };
        rrcw.requestSuccess(IsRegCompanyJson,IsRegCompanyUrl,function (req) {
            if(req.Status==0){
                var data1=req.Data;
                console.log('商品id及返回数据',Id,req);
                if(data1.IsRegCompany){
                    window.location.href = 'IndustryAndName.html?CompanyGoodsId='+Id;
                }else{
                    window.location.href = 'confirmOrder.html?confirmGoods=' + data.goods.Id + '&goodsType=' + data.goods.GoodsType;
                }
            }
        })
    };
    //确认订单页面 start
    //获取用户默认公司
    getDefaultCompany = function() {
        var getDefaultCompanyJson = { "user_id": rrcw.defaults.userid, "is_default": 1 },
            getDefaultCompanyUrl = {
                  path: "/PlatApi/GetUserRelateCompanyList"
            };
        var nowDate = (new Date()).pattern('yyyy/MM');
        $('#StartDate').val(nowDate);
        rrcw.requestSuccessAsyncFalse(getDefaultCompanyJson, getDefaultCompanyUrl, function(req) {
            if (req.Status == 0) {
                var data = req.Data[0];
                if (!data) {
                    return;
                }
                var taxationType = data.TaxationType == 2 ? '一般纳税人' : '小规模纳税人';
                var getDefaultCompany=$('#getDefaultCompany');
                var confirmTwop = $('#confirmOrder').find('li').eq(1).find('p');
                getDefaultCompany.parent().find('span').text(data.Name);
                getDefaultCompany.attr('defaultCompanyId', data.Id);
                getDefaultCompany.attr('defaultCompanyType', data.TaxationType);
                confirmTwop.text(taxationType);
            }
        });

    };
    //获取默认公司end
    //设置默认当前月份+1
    p = function(t) {
        return t < 10 ? '0' + t : t;
    };
    //若填写优惠码 失焦验证优惠码是否可用
    validationCode = function() {
        var code = $('#exchangeCode').val();
        var com = $('#commitOrder');
        var totalAmount = com.find('div').eq(0).attr('totalAmount'); //总金额
        if (!code) {
            $('#promoAmount').text('-￥' + 0);
            com.find('div').eq(0).text('待支付:' + totalAmount);
        }
        if (code) { //优惠码非空
            var codeJson = { "code": code },
                codeUrl = { path: "/PlatApi/GetPromoCodeInfo" };
            rrcw.requestSuccess(codeJson, codeUrl, function(req) {
                //layer.open({
                //    content: req.Message
                //    , time: 1
                //    , className: 'warning'
                //});
                if (req.Status == 0) { //验证优惠码是否使用过
                    var data = req.Data;
                    if (data.IsUsed) { //不可用提示
                        layer.open({
                            content: req.Message,
                            time: 2,
                            className: 'warning'
                        });
                    } //可用  待支付金额重新计算
                    var payReduce = com.find('div').eq(0).text().substr(4) - 0;
                    $('#promoAmount').text('-￥' + data.PromoAmount);
                    payReduce = payReduce - data.PromoAmount < 0 ? payReduce : payReduce - data.PromoAmount;
                    com.find('div').eq(0).text('待支付:' + rrcw.formatNum(payReduce));
                }
            });
        }
    };
    submitOrder = function() { //提交订单
        var commitOrder = $('#commitOrder');
        var bUserId = rrcw.defaults.userid, //用户标识
            totalAmount = commitOrder.find('div').eq(0).attr('totalAmount') - 0, //总金额
            goodsId = rrcw.getUrlParam('confirmGoods'), //商品id
            startDate = $('#StartDate').find('p').html(), //开始服务时间
            remark=$('textarea').val(),//备注
            serviceLimit = $("#productFeature").attr('limit') == 'null' ? 1 : $("#productFeature").attr('limit'), //服务期限
            code = $('#exchangeCode').val(), //优惠码
            promoAmount = $('#promoAmount').text().split('￥')[1] - 0, //优惠价格
            companyId = $('#getDefaultCompany').attr('defaultcompanyid'); //公司id
        if (startDate=="请选择") {
            rrcw.inputVal.notNull(startDate, '请选择开始服务时间');
        } else if (serviceLimit=='请选择') {
            rrcw.inputVal.notNull(serviceLimit, '请选择服务期限');
        } else if (!companyId) {
            layer.open({
                content: "请选择公司",
                time: 2,
                className: 'warning'
            });
            return;
        }
        var SubmiOrderJson = {
                "b_user_id": bUserId,
                "company_id": parseInt(companyId),
                "total_amount": totalAmount,
                "remark":remark,
                "goods_id": parseInt(goodsId),
                "service_limit": parseInt(serviceLimit),
                "start_date": startDate
            },
            SubmiOrderUrl = {
                  path: "/PlatApi/SubmiOrder"
            };
        if (!code || totalAmount < promoAmount || promoAmount <= 0) { //不填优惠码或优惠价大于待支付或者该优惠码不存在
            rrcw.requestSuccess(SubmiOrderJson, SubmiOrderUrl, function(req) {
                if (req.Status == 0) {
                    var data = req.Data; //确认订单成功之后 跳转支付页面
                    location.href = '/html/pay.html?confirmOrderID=' + data.Id;
                }else if(req.Status==203){
                    layer.open({
                       content:"该商品限购一次"
                       , time: 1.5
                       , className: 'warning'
                    });
                    return false;
                }
            });
        } else {
            //优惠码可用
            SubmiOrderJson.exchange_amount = promoAmount;
            SubmiOrderJson.code = code;
            rrcw.requestSuccess(SubmiOrderJson, SubmiOrderUrl, function(req) {
                if (req.Status == 0) {
                    var data = req.Data;
                    location.href = '/html/pay.html?confirmOrderID=' + data.Id;
                }else if(req.Status==203){
                    layer.open({
                        content:"该商品限购一次"
                        , time: 1.5
                        , className: 'warning'
                    });
                    return false;
                }
            }); //优惠码下单
        }
    };

    //提交订单   end
    //订单支付 start
    //加载支付页面,获取订单数据
    payOrderDetails = function() {
        var confirmOrderId = rrcw.getUrlParam('confirmOrderID');
        var orderDetailsJson = { "order_id": confirmOrderId },
            orderDetailsUrl = { path: "/PlatApi/GetOrderDetailList" };
        var pay = '';
        rrcw.requestSuccess(orderDetailsJson, orderDetailsUrl, function(req) {
            if (req.Status == 0) {
                var data = req.Data.order;
                pay = '<ul><li><label class="font_30">支付方式:</label><p class="font_26">&nbsp;&nbsp;微信支付</p>' +
                    '</li><li> <label class="font_30">订单编号:</label>' +
                    '<p class="font_26">&nbsp;&nbsp;' + data.Id + '</p>' +
                    ' </li> <li> <label class="font_30">产品名称:</label> ' +
                    '<p class="font_26">&nbsp;&nbsp;' + data.GoodsName + '</p> </li> <li> ' +
                    '<label class="font_30">订单金额:</label>' +
                    '<p class="money orange">&nbsp;&nbsp;' + rrcw.formatNum(data.TotalAmount) + '元</p></li><li>' +
                    '<label class="font_30">应付金额:</label>' +
                    '<p class="money orange">&nbsp;&nbsp;' + rrcw.formatNum(data.ShouldAmount) + '元</p></li>' +
                    '</ul><button onclick="callPay(paydata)" data-payBtn="' + data.Id + '" class="btnSuper" type="button">' +
                    '立即支付</button>';
                $('#pay').html(pay);
            }
        })
    };
    pay2OrderDetails = function() {
        var confirmOrderId = rrcw.getUrlParam('confirmOrderID');
        var orderDetailsJson = {
            "orderid": confirmOrderId,
            "userid":rrcw.defaults.userid
            },
            orderDetailsUrl = { path: "/ThirdPeriod/GetOrderDetail" };
        var pay = '';
        rrcw.requestSuccess(orderDetailsJson, orderDetailsUrl, function(req) {
            if (req.Status == 0) {
                var data = req.Data.OrderInfo;
                pay = '<ul><li><label class="font_30">支付方式:</label><p class="font_26">&nbsp;&nbsp;微信支付</p>' +
                    '</li><li> <label class="font_30">订单编号:</label>' +
                    '<p class="font_26">&nbsp;&nbsp;' + data.Id + '</p>' +
                    ' </li> <li> <label class="font_30">产品名称:</label> ' +
                    '<p class="font_26">&nbsp;&nbsp;' + req.Data.GoodName + '</p> </li> <li> ' +
                    '<label class="font_30">订单金额:</label>' +
                    '<p class="money orange">&nbsp;&nbsp;' + rrcw.formatNum(data.TotalAmount) + '元</p></li><li>' +
                    '<label class="font_30">应付金额:</label>' +
                    '<p class="money orange">&nbsp;&nbsp;' + rrcw.formatNum(data.PayableAmount) + '元</p></li>' +
                    '</ul><button onclick="callPay(paydata)" data-payBtn="' + data.Id + '" class="btnSuper" type="button">' +
                    '立即支付</button>';
                $('#pay2').html(pay);
            }
        })
    };
    paydata = {};
    payOrder = function() {
        var payOrderId = rrcw.getUrlParam('confirmOrderID');
        var data = {};
        var payOrderJson = {
                "b_user_id": rrcw.defaults.userid,
                "order_id": payOrderId,
                "channel_code": "1"
            },
            payOrderUrl = { path:"/PlatApi/PayOrder" };
        rrcw.requestSuccess(payOrderJson, payOrderUrl, function(req) {
            if (req.Status == 0) {
                paydata = req.Data;
                //callPay(paydata);
            }
            layer.open({
                content: "支付中...",
                time: 2,
                className: 'warning'
            });
        });
    }; //支付订单end
    pay2data = {};
    pay2Order = function() {
        var payOrderId = rrcw.getUrlParam('confirmOrderID');
        var data = {};
        var payOrderJson = {
                "buserid": rrcw.defaults.userid,
                "orderid": payOrderId
            },
            payOrderUrl = { path:"/ThirdPeriod/PayOrder" };
        rrcw.requestSuccess(payOrderJson, payOrderUrl, function(req) {
            if (req.Status == 0) {
                pay2data = req.Data;
                //callPay(paydata);
            }
            layer.open({
                content: "支付中...",
                time: 2,
                className: 'warning'
            });
        });
    }; //支付订单end
    callPay = function(res) {
        console.log('pay JSON', res);
        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        } else {
            onBridgeReady(res);
        }
    };

    onBridgeReady = function(r) {
        if (!r) {
            return;
        }
        json = {
            "appId": r.appId,
            "timeStamp": r.timeStamp,
            "nonceStr": r.nonceStr,
            "package": r.package,
            "signType": r.signType,
            "paySign": r.signature
        };
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', json,
            function(res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    window.location.href = "/html/orderSuccess.html?orderid=" + rrcw.getUrlParam('confirmOrderID');
                }
            }
        );
    };

    //下单模块结束  end
    //修改用户信息   start
    setUserInfo = function() {
        var setUser = $("#personInfo").find('input');
        var UserName = setUser.eq(0).val(),
            UserSex = $("input:radio:checked").val() || 0,
            UserEmail = setUser.eq(3).val();
        if (!UserName) {
            rrcw.inputVal.notNull(UserName, '姓名不能为空');
        } else if (!UserEmail) {
            rrcw.inputVal.notNull(UserEmail, '邮箱不能为空')
        } else {
            var setUserInfoJson = {
                    "id": rrcw.defaults.userid, //用户标识
                    "name": UserName,
                    "sex": UserSex, //1 男 0女
                    "email": UserEmail //后期可扩展密码、头像、昵称、身份证号、经度纬度等等
                },
                setUserInfoUrl = {  path:"/PlatApi/SetUserInfo" };
            rrcw.requestSuccess(setUserInfoJson, setUserInfoUrl, function(req) {
                if (req.Status == 0) {
                    layer.open({
                        type: 2,
                        content: '正在保存中',
                        time: 1.5,
                        end: function() {
                            window.location.href = '/html/my.html';
                        }
                    });
                }
            });
        }
    };
    //负责人信息 end
    //加载本地存储的个人信息
    getLocalPersonInfo = function() {
        console.log('本地用户信息', rrcw.localStorage.get('BUser'))
        var getUser = $("#personInfo").find('input');
        getUser.eq(0).val(rrcw.localStorage.get('BUser').name);
        getUser.eq(3).val(rrcw.localStorage.get('BUser').email);
        var sex = rrcw.localStorage.get('BUser').sex;
        if (sex == 'null') { //保密
            getUser.eq(2).removeClass('roundBlue');
            getUser.eq(1).removeClass('roundRed');
        } else if (sex) { //男生
            getUser.eq(1).removeClass('roundRed');
            getUser.eq(2).addClass('roundBlue');
        } else {
            getUser.eq(2).removeClass('roundBlue');
            getUser.eq(1).addClass('roundRed');
        }
    };

    //      公司信息保存     companyInfoSave.html   start
    //得到公司属性
    getCompanyProperty = function(j) {
        var GetCompanySizeJson = { "company_property_type": j },
            GetCompanySizeUrl = {  path:"/PlatApi/GetCompanyProperty" };
        rrcw.requestSuccess(GetCompanySizeJson, GetCompanySizeUrl, function(req) {
            var str = '';
            if (req.Status == 0) {
                var data = req.Data;
                var new_data=[];
                $.each(data, function(i, size) {
                    new_data.push({"key":size.Name,"display":size.Name});
                });
                mobScroll('#companyProperty',new_data);
            }
        })
    };
    getCompanySize = function(j) {
        var GetCompanySizeJson = { "company_property_type": j },
            GetCompanySizeUrl = { path:"/PlatApi/GetCompanyProperty" };
        rrcw.requestSuccessAsyncFalse(GetCompanySizeJson, GetCompanySizeUrl, function(req) {
              var new_data=[];
            if (req.Status == 0) {
                var data = req.Data;
                $.each(data, function(i, size) {
                       new_data.push({"key":size.Name,"display":size.Name});
                });
                mobScroll('#companySize',new_data);
            }
        })
    };
    mobScroll=function (content,data) {
        var scroll=mobiscroll.scroller(content,{
            theme:'ios',
            lang:'zh',
            display:'bottom',
            width:200,
            wheels:[
                [{
                    circular:false,
                    data:data
                }
                ]
            ],
            onSet:function(event,inst){
                $(content).find('p').text(event.valueText)
            }
        })
    };
    mobScrollPay=function (content,limit,data) {
        var scroll=mobiscroll.scroller(content,{
            theme:'ios',
            lang:'zh',
            display:'bottom',
            width:200,
            wheels:[
                [{
                    circular:false,
                    data:limit
                }
                ]
            ],
            onSet:function(event,inst){
                var limit=inst._tempWheelArray;
                 $(content).find('p').text(limit[0][1]);
                $(content).attr('limit',limit[0][0]);
                 updatePayIcon2(data,limit[0][0]);
            }
        })
    };
    mobDate=function(content){
        var now = new Date(),
            max = new Date(now.getFullYear() + 100, now.getMonth(), now.getDate());
        var instance = mobiscroll.date(content, {
            theme: 'ios',
            lang: 'zh',
            display: 'bottom',
            min:now,
            max: max,
            minWidth:160,
            dateFormat:'yy/mm',
            monthNames:['01','02','03','04','05','06','07','08','09','10','11','12'],
            onSet:function(event,inst){
                $(content).find('p').text(event.valueText)
            }
        });
    };
    TaxScroll2=function(TaxObj){
         TaxScroll={
            Set:['有限责任公司','有限公司'],//初始值
            SetIndex:[0,0],
            Data:[
                {label:'类型',data:[]},
                {label:'详细',data:[]}
            ],
            Tax:function () {
                for(j in TaxObj){
                    if(TaxObj[j].Name==this.Set[0]){
                        this.SetIndex[0]=j;
                    }
                    this.Data[0].data[j]={
                        "value":TaxObj[j].Code,
                        "display": TaxObj[j].Name
                    }
                }
                this.Details(this.SetIndex[0])
            },
            Details:function (TaxIndex) {
                this.Data[1].data=[];
                var row = TaxObj[TaxIndex].TwoLevel;
                for(i in row){
                    if(row[i]==this.Set[1]){
                        this.SetIndex[1] = i;
                    }
                    this.Data[1].data[i] = {
                        "value": i,
                        "display": row[i]
                    }
                }
            }
        };
        return TaxScroll;
    };
    TaxScroll2_2=function(TaxObj){
        TaxScroll_2={
            Set:['贸易类','商贸'],//初始值
            SetIndex:[0,0],
            Data:[
                {label:'类型',data:[]},
                {label:'详细',data:[]}
            ],
            Tax:function () {
                for(j in TaxObj){
                    if(TaxObj[j].Name==this.Set[0]){
                        this.SetIndex[0]=j;
                    }
                    this.Data[0].data[j]={
                        "value":TaxObj[j].Code,
                        "display": TaxObj[j].Name
                    }
                }
                this.Details(this.SetIndex[0])
            },
            Details:function (TaxIndex) {
                this.Data[1].data=[];
                var row = TaxObj[TaxIndex].TwoLevel;
                for(i in row){
                    if(row[i]==this.Set[1]){
                        this.SetIndex[1] = i;
                    }
                    this.Data[1].data[i] = {
                        "value": i ,
                        "key":row[i].Code,
                        "display": row[i].Name
                    }
                }
            }
        };
        return TaxScroll_2;
    };
    area=[
        {
            Data : [
                {label: '省份', data:[]},
                {label: '城市', data:[]},
                {label: '区县', data:[]}
            ]
        },
        {
            Data : [
                {label: '省份', data:[]},
                {label: '城市', data:[]},
                {label: '区县', data:[]}
            ]
        }
    ];
    companyOrderArea2=function(indexArea,index) {
        Area2 = {
            Province : function(province){
                for( k in province){
                    area[indexArea].Data[0].data[k] = {
                        "value" : k,
                        "key":province[k].Code,
                        "display" : province[k].Name
                    }
                }
                AreaAbout(indexArea,index,2,province[0].Code);//初始化数据
            },
            City : function(city1){
                //清空数据
                area[indexArea].Data[1].data = [];
               var city= city1.length==0?[{Code:'',Name:''}]:city1;//默认赋值
                for( i in city){
                    area[indexArea].Data[1].data[i] = {
                        "key":city[i].Code,
                        "value" : i,
                        "display" : city[i].Name
                    }
                }
                AreaAbout(indexArea,index,3,city[0].Code);//初始化数据
            },
            County : function(county){
                area[indexArea].Data[2].data = [];
                for( j in county){
                    area[indexArea].Data[2].data[j] = {
                        "value" : j,
                        "display": county[j].Name
                    }
                }
            }
        };
        return Area2;
    };
    mobScrollThree=function (indexArea,ind,content) {
        var areaD=area[indexArea];
        var demo = mobiscroll.scroller(content, {
            theme: 'ios',
            lang: 'zh',
            circular : false,
            height : 40,
            display: 'bottom',
            cssClass : "set-area",
            wheels : [areaD.Data],
            validate : function(data, inst){
                var arr = inst._tempWheelArray;
                var index = data.index,
                    values = data.values,
                    valid = [];
                var code1=inst.settings.wheels[0][0].data[arr[0]].key,
                    code2=inst.settings.wheels[0][1].data[arr[1]].key;
                if(index>=0){
                    if(index==0){
                       AreaAbout(indexArea,ind,2,code1);//更新数据
                        inst.changeWheel({
                            1 : areaD.Data[1],
                            2 : areaD.Data[2]
                        }, 1000);
                        valid = [values[0], 0, 0];
                    }
                    if(index==1){
                        AreaAbout(indexArea,ind,3,code2);//更新数据
                        inst.changeWheel({
                            2 : areaD.Data[2]
                        }, 1000);
                        valid = [values[0], values[1], 0];
                    }
                    if(index<2){
                        return {
                            valid : valid
                        }
                    }

                }
            },
            onSet: function (event, inst) {
                var arr = inst._tempWheelArray,
                    settings = inst.settings;
                 var output = settings.wheels[0][0].data[arr[0]].display + ","
                        + settings.wheels[0][1].data[arr[1]].display + ",";
                output += (settings.wheels[0][2].data.length > 0) ? settings.wheels[0][2].data[arr[2]].display : "";

                var address = settings.wheels[0][0].data[arr[0]].display.substr(0, 2);
                $(content).find("p").text(output);
                $('.companyFirst').find('.span4').val(address);
            }
        });
    };
    mobScrollTwo=function (obj,content) {//双列
        var demo = mobiscroll.scroller(content, {
            //showLabel: true,
            theme: 'ios',
            lang: 'zh',
            circular : false,
            height : 40,
            display: 'bottom',
            cssClass : "set-area",
            wheels: [ obj.Data],
            validate: function (data, inst) {
                var index = data.index,//操作哪一列的索引
                    values = data.values,
                    valid = [];
                if (index >= 0) {
                    //如果用户操作第一列.则更新数据
                    if (index == 0) {
                        obj.Details(values[0].charAt(0)-1); //更新数据
                        inst.changeWheel({
                            1:  obj.Data[1]
                        }, 1000);
                        valid = [values[0], 0];
                    }
                    if (index < 1) {
                        return {
                            valid: valid
                        }
                    }

                }
            },
            onSet: function (event, inst) {
                var arr = inst._tempWheelArray,
                    settings = inst.settings,
                    output1 = settings.wheels[0][0].data[arr[0].charAt(0)-1].display,
                    output2 = settings.wheels[0][1].data[arr[1]].display;
                if(content=='#reCompanyTax'){
                    $(content).find("p").text(output1);
                    $(content).attr({'data-TaxScrollIndex':settings.wheels[0][1].data[arr[1]].key});//索引
                    $('.companyFirst').find('.span3').val(output2);
                }else{
                    $(content).find("p").text(output2);
                    $('.companyFirst').find('.span2').val(output2);
                    $(content).attr({"data-TaxScroll2Two":settings.wheels[0][1].data[arr[1]].key});//两级索引
                    $(content).attr({"data-TaxScroll2Two2":settings.wheels[0][1].data[arr[1]].value});//两级数组索引
                    TaxScroll2Two2.index=settings.wheels[0][1].data[arr[1]].value;
                }
            }
        });
    };
    TaxScroll2Two2={index:0};
    //获取单个商品下的产品及实时更新待支付价格
    getGoodsToProductList2=function(){
        var updatePayId = parseInt(rrcw.getUrlParam('confirmGoods'));
        var updatePayJson = { "goods_id": updatePayId },
            updatePayUrl = { path: "/PlatApi/GetGoodsToProductList" };
        var productFeature=$('#productFeature');
        rrcw.requestSuccess(updatePayJson, updatePayUrl, function(req) {
            var val='',str='';
            if (req.Status == 0) {
                var data = req.Data;
                if (!data) {
                    return;
                }
                var product = data.list;
                var goodsType = data.goods.GoodsType;
                if (goodsType != 1) {
                    var features = product[0].ProductFeatures;
                    var new_data=[];
                    $.each(features, function(i, size) {
                        val += size.Value + ',';
                        str += size.Name + ',';
                        new_data.push({"value":[size.Value,size.Name],"display":size.Name});
                    });
                    mobScrollPay('#productFeature',new_data,data);
                    var defaultVal = val.split(',')[0],
                        defaultName = str.split(',')[0];
                    productFeature.find('p').text(defaultName);
                    productFeature.attr('limit',defaultVal);
                    updatePayIcon2(data,defaultVal);
                    productFeature.attr('data-productId', product[0].Id);
                } else {
                    productFeature.css({ 'display': 'none' });
                    productFeature.attr('limit', 1);
                     updatePayIcon2(data,1); //套餐待支付更新
                }

            }
        });
    };
    //实时更新待支付价格
    updatePayIcon2=function(data,serv){
        var updatePay = $('#commitOrder');
        var TaxationType = $('#getDefaultCompany').attr('defaultCompanyType');
        var products=data.list;
        var unitPrice1, unitPrice2, pay; //单价
        if (products.length == 1) { //商品根据纳税人种类TaxationType  1为小规模纳税人单价300，2为一般纳税人单价500
            if (products[0].ProductPrices.length > 0) {
                var type1 = products[0].ProductPrices[0].TaxationType;
                if (TaxationType == type1) { //小规模纳税人
                    unitPrice1 = products[0].ProductPrices[0].UnitPrice;
                    pay = unitPrice1 * serv;
                    updatePay.find('div').eq(0).find('span').text(rrcw.formatNum(pay));
                    updatePay.find('div').eq(0).attr('totalAmount', pay);
                } else { //else不可省略
                    unitPrice2 = products[0].ProductPrices[1].UnitPrice; //一般纳税人
                    pay = unitPrice2 * serv;
                    updatePay.find('div').eq(0).find('span').text(rrcw.formatNum(pay));
                    updatePay.find('div').eq(0).attr('totalAmount', pay);
                }
            } else { //一月记账 按月份算
                pay = data.goods.SalePrice * serv;
                updatePay.find('div').eq(0).find('span').text(rrcw.formatNum(pay));
                updatePay.find('div').eq(0).attr('totalAmount', pay);
            }
        } else { //个体工商户
            updatePay.find('div').eq(0).find('span').text(data.goods.SalePrice);
            updatePay.find('div').eq(0).attr('totalAmount', data.goods.SalePrice);
        }
    };
    //获取用户所在公司信息   myCompany.html   start   user_id从本地存储获取
    GetUserCompanyList = function() {
        var getUserCompanyJson = { "user_id": rrcw.defaults.userid },
            getUserCompanyUrl = {
                  path: "/PlatApi/GetUserRelateCompanyList"
            };
        var ulList = $('#getUserCompanyList');
        //ajax加载用户所在公司信息
        rrcw.requestSuccess(getUserCompanyJson, getUserCompanyUrl, function(req) {
            var companyList = "";

            if (req.Status != 0) {
                return;
            }
            var data = req.Data;
            $.each(data, function(i, company) { //加载列表函数  html5 data-*可存对象，记录数据,$.data只读
                var TaxationType = company.TaxationType == 1 ? "小规模纳税人" : "一般纳税人";
                var isDefault = company.IsDefault == true ? 1 : 0;
                companyList += '<li companyId="' + company.Id + '">' +
                    '<i class="choice" default="' + isDefault + '"></i><a href="companyInfo.html?id=' + company.Id + '"><section class="sheng">' +
                    '<h3 class="font_30">' + company.Name + '</h3>' +
                    '<p class="font_26">' + TaxationType + '</p>' +
                    '<p class="font_24">' + company.RegAddressInfo + '</p>' +
                    '</section></a>' +
                    '<aside><p onclick="changeCompanyInfo(this)" data-changeCompany="' + company.Id + '" class="font_26_2"><i class="smallIcon"></i>修改</p>' +
                    '<p onclick="delCompanyInfo(this)" class="font_26_2 confirm"><i class="smallIcon delete"></i>删除</p>' +
                    '</aside></li>';
            });
            ulList.html(companyList);
        });
    };

    changeCompanyInfo = function(com) {
        var param = $(com).attr('data-changeCompany');
        location.href = "companyInfoChange.html?changeCompany=" + param;

    }; //修改公司信息
    changeCompanyList = function() {
        var param = rrcw.getUrlParam('changeCompany');
        var companyJson = { "id": param, "user_id": rrcw.defaults.userid },
            companyInfoUrl = {
                  path: "/PlatApi/GetCompanyInfo"
            };
        rrcw.requestSuccess(companyJson, companyInfoUrl, function(req) {

            if (req.Status == 0) { //说明有data数据不为空
                var data = req.Data;
                var Taxation = data.TaxationType == 1 ? "小规模纳税人" : "一般纳税人"; //过滤公司税务类型
                var companyInfo = [data.Name, data.Scope, data.Industry, data.RegAddress, data.RegAddressInfo, data.BusAddress, data.BusAddressInfo, Taxation];
                $('#companyName1').val(companyInfo[0]);
                $('#companySize').find('p').text(companyInfo[1]);
                $('#companyProperty').find('p').text(companyInfo[2]);
                $('#selectAddress1').find('p').text(companyInfo[3]);
                $('#regAddress').val(companyInfo[4]);
                $('#selectAddress2').find('p').text(companyInfo[5]);
                $('#busAddress').val(companyInfo[6]);
                $('#companyTax').find('p').text(companyInfo[7]);
            }
        });
    };
    delCompanyInfo = function(a) { //点击删除post数据
        var compId = $(a).closest('li').attr('companyId');
        var DelCompanyInfoJson = { "id": compId, "user_id": rrcw.defaults.userid },
            DelCompanyInfoUrl = {  path: "/PlatApi/DelCompanyInfo" };
        layer.open({
            title: ['删除公司', 'font-size:.32rem;color:#515151;'],
            content: '确认删除该公司地址吗？',
            btn: ['删除', '取消'],
            time: 2,
            style: 'text-align:center; font-size:.30rem;color:#515151',
            yes: function() {
                rrcw.requestSuccess(DelCompanyInfoJson, DelCompanyInfoUrl, function(req) {

                    if (req.Status == 203) {
                        layer.open({
                            content: req.Message,
                            className: 'warning',
                            time: 1.5
                        });
                    } else if (req.Status == 0) {
                        GetUserCompanyList();
                    }

                });
            }

        })
    }; //end
    //勾选默认公司
    choiceDefaultCompany = function(defaultCompanyId) {
        var setCompanyDefaultJson = {
                "id": defaultCompanyId,
                "is_default": 1,
                "user_id": rrcw.defaults.userid
            },
            setCompanyDefaultUrl = {
                  path: "/PlatApi/SetCompanyInfo"
            };
        rrcw.requestSuccess(setCompanyDefaultJson, setCompanyDefaultUrl, function(req) {
            if (!req.Status) {
                return false;
            }
        })
    };
    //读取公司信息
    //公司信息   companyInfo.html  start
    readCompanyInfo = function() {
        var param = rrcw.getUrlParam('id');
        var companyJson = { "id": param },
            companyInfoUrl = {
                  path: "/PlatApi/GetCompanyInfo"
            };
        rrcw.requestSuccess(companyJson, companyInfoUrl, function(req) {
            console.log('公司信息', req);
            if (req.Status == 0) { //说明有data数据不为空
                var data = req.Data;
                var Taxation = data.TaxationType == 1 ? "小规模纳税人" : "一般纳税人";
                var companyInfo = [data.Name, data.Scope, data.Industry, data.RegAddress, data.RegAddressInfo, data.BusAddress, data.BusAddressInfo, Taxation];
                //过滤公司税务类型
                var companyInfoList = $('#companyInfo ul li').find('p');
                for (var i = 0, len = companyInfo.length; i < len; i++) {
                    companyInfoList.eq(i).text(companyInfo[i]);
                }
            }

        });
    };
    //公司信息  end
    checkBtn = function(val, prop1, prop2, state) {
        var str = val.replace(/^\s$/g, '');
        var txtReg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
        if (str == '' || str == null) {
            layer.open({
                content: prop1,
                className: 'warning',
                time: 1.5
            });
            state = false;
        } else if (!txtReg.test(str)) {
            layer.open({
                content: prop2,
                className: 'warning',
                time: 1.5
            });
            state = false;
        }
        state = true;
        return {
            status: state
        }
    };

    // 保存公司信息  start
    setCompanyInfo = function() { //点击保存 post数据给后台
        var companyName1 = $('#companyName1').val(),
            companySize = $('#companySize').find('p').html(), //公司规模
            companyIndustry = $('#companyProperty').find('p').html(), //公司行业
            regAddress1 = $('#selectAddress1').find('p').html(), //注册地址
            regAddress2 = $('#regAddress').val(), //注册详细地址
            busAddress1 = $('#selectAddress2').find('p').html(), //经营地址
            busAddress2 = $('#busAddress').val(),
            taxProperty = $('#companyTax').find('p').html() == '请选择' ? '' : $('#companyTax').find('p').html() == '小规模纳税人' ? 1 : 2; //税务性质
        var changeCompanyID = rrcw.getUrlParam('changeCompany');
        var companyname = companyName1.replace(/\s|\xA0/g, "");
        var txtReg = /^[\(\)\（\）\-\u4e00-\u9fa5_a-zA-Z0-9]+$/;
        if (!companyName1) {
            rrcw.inputVal.notNull(companyName1, '公司名称不能为空');
        } else if (companySize=="请选择") {
            rrcw.inputVal.notNull(companySize, '公司规模不能为空');
        } else if (companyIndustry=="请选择") {
            rrcw.inputVal.notNull(companyIndustry, '公司行业不能为空');
        } else if (regAddress1=="请选择") {
            rrcw.inputVal.notNull(regAddress1, '注册地址不能为空');
        } else if (!regAddress2) {
            rrcw.inputVal.notNull(regAddress2, '注册详细地址不能为空');
        } else if (busAddress1=="请选择") {
            rrcw.inputVal.notNull(busAddress1, '经营地址不能为空');
        } else if (!busAddress2) {
            rrcw.inputVal.notNull(busAddress2, '经营详细地址不能为空');
        } else if (!taxProperty) {
            rrcw.inputVal.notNull(taxProperty, '公司税务性质请选择');
        }
        else if (!txtReg.test(companyname)) {
            layer.open({
                content: '公司全称含有特殊字符',
                className: 'warning',
                time: 1.5
            });
            return false;
        } else if (!txtReg.test(regAddress2.replace(/\s|\xA0/g, ""))) {
            layer.open({
                content: '注册详细地址含有特殊字符',
                className: 'warning',
                time: 1.5
            });
            return false;
        }
        else if (!txtReg.test(busAddress2.replace(/\s|\xA0/g, ""))) {
            layer.open({
                content: '经营详细地址含有特殊字符',
                className: 'warning',
                time: 1.5
            });
            return false;
        } else {
            var provice, city, area;
            var AddressArr = regAddress1.replace(/\s/g, ',').split(',');
            if (AddressArr.length == 3) {
                provice = AddressArr[0];
                city = AddressArr[1];
                area = AddressArr[2];
            } else {
                provice = AddressArr[0];
                city = AddressArr[0];
                area = AddressArr[1];
            }

            var setCompanyJson = {
                    "name": companyName1,
                    "scope": companySize,
                    "industry": companyIndustry,
                    "reg_address": regAddress1,
                    "reg_address_info": regAddress2,
                    "provice": provice,
                    "city": city,
                    "area": area,
                    "bus_address": busAddress1,
                    "bus_address_info": busAddress2,
                    "taxation_type": taxProperty,
                    "contacts": rrcw.localStorage.get('BUser').name,
                    "phone": rrcw.localStorage.get('BUser').mobilePhone,
                    "email": rrcw.localStorage.get('BUser').email,
                    "remark": null,
                    "user_id": rrcw.defaults.userid,
                    "is_default": 1
                },
                SetCompanyUrl = {  path: "/PlatApi/SetCompanyInfo"};
            if (!changeCompanyID) {
                rrcw.requestSuccess(setCompanyJson, SetCompanyUrl, function(req) {
                    var data = req.Data;
                    if (req.Status == 0) { //保存数据成功
                     //   console.log('保存公司',data);
                        layer.open({
                            content: '保存成功',
                            className: 'warning',
                            time: 1,
                            end: function () {
                                  location.href = document.referrer;
                            }
                        });
                    } else {
                        layer.open({
                            content: req.Message,
                            className: 'warning',
                            time: 1 //2秒后自动关闭
                        });
                    }
                }); //ajax end
            } else {
                setCompanyJson.id = changeCompanyID;
                rrcw.requestSuccess(setCompanyJson, SetCompanyUrl, function(req) {
                    var data=req.Data;
                    if (req.Status == 0) { //保存数据成功

                            layer.open({
                                content: '修改成功',
                                className: 'warning',
                                time: 1,
                                end: function () {
                                    location.href = document.referrer
                                }
                            });
                    } else {
                        layer.open({
                            content: req.Message,
                            className: 'warning',
                            time: 1 //2秒后自动关闭
                        });
                    }
                }); //ajax end
            }
        }
        //
    };
    //保存公司信息  end
    //我的订单模块   start
    //  订单中心   orderCore.html  start
    //order_status=-1初始 0 交易完成 1 待确认 2 抢单中 3 执行中 4 取消  不带状态或状态为其他值时加载全部订单，令 -2为加载全部
    var flag=false;//防止 多次点击重复追加元素
    getOrderList = function(orderStatus,context) {
        var getOrderListJson = {
                "b_user_id": rrcw.defaults.userid,
                "order_status": orderStatus
            },
            getOrderListUrl = {   path: "/PlatApi/GetOrderList" };
        rrcw.requestSuccess(getOrderListJson, getOrderListUrl, function(req) {
            var OrderList = '';
            var now = new Date().getTime();
            var orderArr = [],
                NoPay = [],
                TimeOut = [], //未支付订单超时
                Service = [], //服务中
                PayFinish = [], //已付款
                Finish = [];
            if (req.Status == 0) {
                var data = req.Data.Data;
                //对超时订单排序
                for (var i = 0, len = data.length; i < len; i++) {
                    if (data[i].CommitStatus == -1) {
                        var creat = rrcw.getTime(data[i].CreatedDate) + 59 * 60 * 1000; //创建时间加59分钟
                        if (creat > now) {
                            NoPay.push(data[i]);
                        } else {
                            TimeOut.push(data[i]);
                        }
                    } else if (data[i].OrderStatus == 3) {
                        Service.push(data[i]);
                    } else if (data[i].OrderStatus == 0) {
                        Finish.push(data[i]);
                    } else {
                        PayFinish.push(data[i]);
                    }
                }
                orderArr = orderArr.concat(NoPay, PayFinish, Service, Finish, TimeOut); //正确排序后的订单
                console.log('排序订单', orderArr);
                $.each(orderArr, function (k, order) {
                    var notPay = (order.CommitStatus == -1) ? '未支付' : order.OrderStatus == 3 ? '服务中' : order.OrderStatus == 0 ? '已完成' : order.OrderStatus == 5 ? '已终止' : '已付款';
                    var fontColor = order.CommitStatus == -1 ? 'orange' : 'blue';
                    if (order.CommitStatus == 0) {
                        fontColor = 'blue';
                    }
                    var payBtn = order.CommitStatus == -1 ? 'true' : 'false';
                    var payText = order.OrderStatus == -1 && order.CommitStatus == -1 ? '立即支付' : '重新下单';
                    var CuserName = order.OrderStatus == 3 || order.OrderStatus == 0 ? order.CUesrName || '等待财税师' : '等待中';
                    var CuserIcon = order.OrderStatus == 3 || order.OrderStatus == 0 ? (order.CIconPath || 'static/images/B_images/person.png') : 'static/images/B_images/person.png';
                    //个人基本信息从本地存储中读取
                    var Count = order.DetailCount,
                        gohtml; //业务订单数
                    if (Count == 1) {
                        var BusniessId = order.Id + '-0';
                        gohtml = 'orderDetails.html?orderDetailsId=' + BusniessId + '&goodsid=' + order.GoodsId;
                    } else {
                        gohtml = 'orderBusiness.html?orderDetailsId=' + order.Id;
                    }
                    var startTime = rrcw.splitTime(order.StartDate),
                        endTime = rrcw.splitTime(order.EndDate) || '',
                        limitName = order.LimitName == "互联网个体工商户" ? "年" : order.LimitName,
                        createTime = rrcw.getTime(order.CreatedDate) + 59 * 60 * 1000; //对创建订单的时间戳加59分钟
                    // goodsInfo=orderGood
                    OrderList += '<li><div class="orderCoreDiv"><img src="' + CuserIcon + '"><p>' + CuserName + '</p>' +
                        '</div><a href=' + gohtml + '>' +
                        '<section><h3><span class="inLineFlex"><i  class="sheng_16">' + order.GoodsName + '</i>' + limitName + '</span><span class="' + fontColor + ' right font_26 timeOut">' + notPay + '</span></h3> ' +
                        '<p>订单编号:&nbsp;&nbsp;' + order.Id + '</p> ' +
                        '<p>服务时间:&nbsp;&nbsp;' + startTime + '-' + endTime + '</p><p>订单总额:&nbsp;&nbsp;<span class="orange money">￥' + rrcw.formatNum(order.ShouldAmount) + '</span>' +
                        '</p></section></a><a class="payNow" data-confirmGoods="' + order.GoodsId + '" href="pay.html?confirmOrderID=' + order.Id + '" data-payStatus ="' + payBtn + '">' + payText + '</a>' +
                        '<small class="timeclick" data-countDown="' + createTime + '" data-littleTime="' + payBtn + '"></small>' +
                        '</li>';
                });
                if (orderStatus == -2) {

                    $(context).html(OrderList);
                    function onlyOne() {
                        if(!flag) {
                            $(context).find('li').each(function (i, e) {
                                var status = $(this).children('small.timeclick').attr('data-littleTime');
                                var t = $(this).children('small.timeclick').attr('data-countDown');
                                if (status == 'true') {
                                    t = rrcw.GetAllData(t - 0);
                                    rrcw.countDown(e, t, function (msg, close) {
                                        $(e).children('small.timeclick').html(msg, close);
                                        if (close == 0) { //倒计时关闭 标识
                                            $(e).children('a.payNow').html('重新下单');
                                            $(e).children('a.timeOut').css({color: '#ff6633'});
                                            $(e).children('a.payNow').attr('href', 'confirmOrder.html?confirmGoods=' + $(e).children('a.payNow').attr('data-confirmGoods'));
                                            $(context).append($(e)); //将支付超时的移动到ul末尾
                                            return false;
                                        }
                                    });
                                }
                            }); //倒计时
                        }
                        flag=true;
                    }
                    onlyOne();
                }else if(orderStatus==3){
                    $(context).html(OrderList);
                }else if(orderStatus==0){
                    $(context).html(OrderList);
                }
            }
        });
    };
    // 获取订单明细
    getOrderDetails = function() {
        var order_id = rrcw.getUrlParam('orderDetailsId');
        var orderDetailListJson = { "order_id": order_id },
            orderDetailListUrl = {   path: "/PlatApi/GetOrderDetailList" };
        rrcw.requestSuccess(orderDetailListJson, orderDetailListUrl, function(req) {
            console.log('支付订单明细', req);
            var orderDetail = '',
                businessOrders = '';
            if (req.Status == 0) {
                var order = req.Data.order,
                    busniessOrder = req.Data.list;
                var startTime = rrcw.splitTime(order.StartDate),
                    limitName = order.LimitName == "互联网个体工商户" ? "年" : order.LimitName,
                    shouldAmount = '￥' + rrcw.formatNum(order.ShouldAmount),
                    endTime = rrcw.splitTime(order.EndDate);
                orderDetail = '<h3 class="font_30">' + order.GoodsName + ' &nbsp;&nbsp;' + limitName + '<span class="money orange right">' + shouldAmount + '</span></h3>' +
                    '<p class="font_26">服务时间:' + startTime + '-' + endTime + '</p>' +
                    '<p class="font_26 pb-20">' + order.CompanyName + '</p>';
                $('#mainOrder').html(orderDetail);
                $.each(busniessOrder, function(i, list) {
                    var status = list.OrderStatus;
                    var phone = status == -1 ? '' : (status == 3 || status == 0 ? (list.CPhone == null ? '4008083568' : list.CPhone) : '4008083568'); //财税师没填写号码或人人财务电话
                    var orderSplitStatus = status == -1 ? '未开始' : status == 3 ? '服务中' : status == 0 ? '已完成' : '已付款',
                        statusBool = status == -1 ? 'true' : 'false';
                    var CuserName = list.CUesrName,
                        Info = order.GoodsId + ',' + list.Id;
                    cUserName = status == -1 ? '等待财税师' : status == 3 || status == 0 ? (CuserName == null ? '财税师' : CuserName) : '财税师';
                    businessOrders += '<section onclick="getBusOrderDetail(this)" data-busniessOrderId=' + Info + ' class="pt_08"><p class="font_26 co51 left_32">' + list.ProductName + '&nbsp;' + limitName + '</p>' +
                        '<p class="font_26 co51 contast"><span>' +
                        '<i class="findOrder right-08"></i><span class="sheng_0">订单编号:&nbsp;' + list.Id + '</span></span><a href="tel:' + phone + '" class="btn1 right" data-busniessStatus=' + statusBool + '>联系财税师</a></p>' +
                        '<p class="font_24 co51 left_32">' + cUserName + '&nbsp;<span class="orange">为您服务中</span></p></section>';
                    $('#businessOrder').html(businessOrders);
                })
            }
        })
    };
    getBusOrderDetail = function(a) {
        var busOrderInfo = $(a).attr('data-busniessOrderId').split(',');
        window.location.href = '/html/orderDetails.html?orderDetailsId=' + busOrderInfo[1] + '&goodsid=' + busOrderInfo[0];
    };
    //获取业务订单明细 start
    //订单拆分状态   orderSplitStatus=-1 初始 0 服务中 1 C端提交(单子做好了) ==2 B端确认(多余) 3 c端完成 4风控审核 5已收款 6终止
    getBusinessOrderDetail = function() {
        var busorderId = rrcw.getUrlParam('orderDetailsId'),
            goodsId = rrcw.getUrlParam('goodsid');
        var BusinessOrderJson = { "order_detail_id": busorderId },
            BusinessOrderUrl = {   path: "/PlatApi/GetOrderDetailInfo" };
        console.log('BusinessOrderJson', BusinessOrderJson);
        rrcw.requestSuccess(BusinessOrderJson, BusinessOrderUrl, function(req) {
            console.log('业务订单明细', req, goodsId);
            var orderDetails = '',
                OrderSplitList = '';
            if (req.Status == 0) {
                var Order = req.Data.detail;
                var status1 = Order.OrderStatus,
                    status1Bool = status1 == -1 &&Order.CommitStatus==-1? 'true' : 'false';
                var CuserName = Order.CUesrName,
                    cPhone = Order.CPhone;
                var shouldAmount = '￥' + rrcw.formatNum(Order.ShouldAmount);
                var startTime = rrcw.splitTime(Order.StartDate),
                    endTime = rrcw.splitTime(Order.EndDate),
                    createTime = rrcw.getTime(Order.CreatedDate) + 59 * 60 * 1000, //对创建订单的时间戳加59分钟
                    limitName = Order.LimitName || '',
                    companyname = Order.CompanyName || '';
                var phone = status1 == -1 ? '' : (status1 == 3 || status1 == 0 ? (cPhone == null ? '4008083568' : cPhone) : '4008083568'); //财税师没填写号码或人人财务电话
                var cUserName = status1 == -1 ? '等待财税师' : (status1 == 3 || status1 == 0 ? (CuserName == null ? '财税师' : CuserName) : '等待财税师');
                var btnTxt = status1 == -1 ? '立即支付' : status1 == 3 || status1 == 0 ? '联系财税师' : status1==4?"重新下单":"联系客服";
                var severtxt = status1 == -1 ? '' : status1 == 0 ? '已完成服务' : '为您服务中';
                orderDetails = '<h3 class="font_30">' + Order.ProductName + '&nbsp;&nbsp;' + limitName + '<span class="money orange right">' + shouldAmount + '</span></h3>' +
                    '<p class="font_26">服务时间:' + startTime + '-' + endTime + '</p> ' +
                    '<p class="font_26">' + companyname + '<small class="countDownTwo" data-times="' + status1Bool + '"></small></p> ' +
                    '<p class="font_24 co51">' + cUserName + '&nbsp;<span class="orange">' + severtxt +
                    '</span><a id="reload" class="btn1 right reload">' + btnTxt + '</a></p>';
                $('#orderDetails').html(orderDetails);
                if (status1 == -1) {
                    $('#orderDetails').find('a.reload').attr('href', 'pay.html?confirmOrderID=' + Order.OrderId);
                } else  if(status1==4){//取消
                    $('#orderDetails').find('a.reload').attr('href', 'confirmOrder.html?confirmGoods=' + goodsId);
                }
                else {
                    $('#orderDetails').find('a.reload').attr('href', 'tel:' + phone);
                }

                $('#orderDetails').each(function(i, e) {
                    var time = rrcw.GetAllData(createTime - 0);
                    if (status1Bool == 'true') {
                        rrcw.countDown(e, time, function(msg, close) {
                            $(e).find('small.countDownTwo').html(msg, close);
                            if (close == 0) { //倒计时关闭 标识
                                $(e).find('a.reload').html('重新下单');
                                $(e).find('a.reload').attr('href', 'confirmOrder.html?confirmGoods=' + goodsId);
                            }
                        });
                    }
                }); //倒计时
                var List = req.Data.split;
                $.each(List, function(k, list) {
                    var status = list.OrderStatus;
                    var orderSplitStatus = status == -1 ? '未开始' : status == 0 ? '服务中' : status == 1 ? '待确认' : status==7?"已终止":"已完成",
                        statusBool = status == 1 ? 'true' : 'false';
                    var classStatus = status == -1 ? 'orange' : status == 0 || 1 ? 'blue' : 'co51';
                    var serviceDate = (list.ServiceDate + '').substr(0, 4) + '/' + (list.ServiceDate + '').substr(4, 2);
                    OrderSplitList += '<li><p><i class="findOrder"></i>订单编号:&nbsp;' + list.Id + '</p>' +
                        '<div><p>开始日期:&nbsp;' + serviceDate + '</p> ' +
                        '<p>状态:&nbsp;<span class="' + classStatus + '">' + orderSplitStatus + '</span>' +
                        '</p><p data-splitStatus="' + statusBool + '">' +
                        '*七天后自动确认' +
                        '</p><button onclick="changeStatus(this)" data-splitId="' + list.Id + '" data-confirmBtn="' + statusBool + '">' +
                        '确&nbsp;认</button></div></li>';
                });
                $('#orderSplitList').html(OrderSplitList); //拆分订单列表
            }
        })
    }; //end
    //设置拆分订单状态  start
    changeStatus = function(a) {
        var splitID = $(a).attr('data-splitId');
        var setOrderSplitStatusJson = {
                "b_user_id": rrcw.defaults.userid,
                "order_split_id": splitID,
                "order_status": 3 //c端完成
            },
            setOrderSplitStatusUrl = {   path: "/PlatApi/SetOrderSplitStatus" };
        rrcw.requestSuccess(setOrderSplitStatusJson, setOrderSplitStatusUrl, function(req) {
            if (req.Status == 0) { //拆分订单状态设置成功后，刷新拆分订单
                getBusinessOrderDetail();
            }
        })
    };
    //我的订单模块   end
    //我的发票模块  start
    //获取申请发票列表  applyInvoice.html  start
    getUserInvoiceList = function() {
        var getUserInvoiceListJson = {
                'b_user_id': rrcw.defaults.userid,
                //  "order_status":0//订单状态
                "commit_status": 0, //支付状态
                "invoice_status": -1 //发票状态
            },
            getUserInvoiceListUrl = {   path: "/PlatApi/GetOrderList" };

        function splitTime(time) {
            if (!time) {
                return null;
            }
            var time1 = parseInt(time.split('(')[1].split(')')[0]);
            return new Date(time1).pattern('yyyy/MM');
        }
        rrcw.requestSuccess(getUserInvoiceListJson, getUserInvoiceListUrl, function(req) {
            var InvoiceList = '';
            console.log('可申请发票的订单', req);
            if (req.Status != 0) {
                layer.open({
                    content: '加载失败',
                    time: 2,
                    className:'warning'
                })
            } else {
                var data = req.Data.Data;
                if (data) {
                    $.each(data, function(i, invoice) {
                        var startTime = splitTime(invoice.StartDate),
                            endTime = splitTime(invoice.EndDate);
                        var createTime = parseInt(invoice.CreatedDate.split('(')[1].split(')')[0]),
                            nowTime = new Date(createTime).pattern('yyyy/MM/dd hh:mm'); //对时间戳进行处理
                        //把需要的数据存在一个字符串之后再存在一个属性里
                        var invoiceInfoStr = invoice.Id + "," + invoice.Name + "," + invoice.BusAddressInfo +
                            "," + invoice.ShouldAmount + "," + invoice.CUesrName + "," + invoice.Remark + "," + invoice.companyName;
                        InvoiceList += ' <li><section><p class="font_24 co51 flex">' +
                            '<i class="findOrder"></i>' + invoice.Id + '</p>' +
                            '<h3 class="font_30 top_8">' + invoice.GoodsName + '&nbsp;' + invoice.LimitName + '</h3>' +
                            '<p class="font_26">服务时间:&nbsp;' + startTime + '-' + endTime + '</p>' +
                            '<p class="font_26 flexMiddle">实付金额:&nbsp;<span class="orange money">￥' + invoice.ActualAmount + '</span></p>' +
                            '</section><aside>' +
                            '<p class="font_24 top_0 co51">' + nowTime + '' +
                            '</p><p data-InvoiceAmount="' + invoice.ActualAmount + '"><i data-orderId="' + invoice.Id + '" class="choice findChoice2 right_0">' +
                            '</i></p></aside></li>';
                    });
                    $('#invoiceList').html(InvoiceList);
                }
            }
        });
    };
    //var amountArr=[];
    Array.prototype.sum = function() {
        for (var sum = i = 0; i < this.length; i++) sum += this[i];
        return sum
    }; //循环计算总价
    $('#invoiceList').on('click', '.choice', function() { //选择开票,可以选择多个或者只选择一个
        if ($(this).hasClass('findChoice')) { //若已选修改为不选
            $(this).removeClass('findChoice');
            $(this).addClass('findChoice2');
            //var downAmount= $(this).parent('p').attr('data-InvoiceAmount')-0;
            //amountArr.push(-downAmount);
            //var downTotalAmount=Math.round(amountArr.sum()*100)/100;
            //$('.allMoney').find('p').eq(1).html('￥'+downTotalAmount);
        } else {
            $('i.choice').not('[class="findChoice2"]').addClass('findChoice2'); //只选中一个
            $(this).removeClass('findChoice2');
            $(this).addClass('findChoice');
            var InvoiceAmount = $(this).parent('p').attr('data-InvoiceAmount') - 0;
            // amountArr.push(InvoiceAmount);
            //  var toatlAmount=amountArr.sum();
            $('.allMoney').find('p').eq(1).html('￥' + Math.round(InvoiceAmount * 100) / 100);
            //把当前选中的orderId赋值给href
            $('#applyInvoice').attr('href', 'openInvoice.html?orderId=' + $(this).attr("data-orderId") + ''); //
        }
        //保存数据传给下个页面
    });
    //end
    //申请开票   openInvoice.html  start
    getInvoiceDetails = function() {
        var invoiceId = rrcw.getUrlParam('orderId');
        var getOrderDetailJson = { "order_id": invoiceId },
            getOrderDetailUrl = {   path: "/PlatApi/GetOrderDetailList" };
        var openInvoice = $('#openInvoice');
        var openInvoiceP = openInvoice.find('p');
        rrcw.requestSuccess(getOrderDetailJson, getOrderDetailUrl, function(req) {
            console.log('开发票', req);
            if (req.Status == 0) {
                var data = req.Data.order;
                openInvoiceP.eq(0).text('￥' + data.ShouldAmount);
                openInvoiceP.eq(4).text('￥' + data.ShouldAmount);
                openInvoiceP.eq(2).text(data.CompanyName);
                openInvoice.find('input').val(data.Remark); //备注
                $('#openInvoiceBtn').attr('data-invoice', data.Id + "," + data.CompanyName + "," + data.ShouldAmount + "," + data.Remark)
            }
        })
    };
    openUserInvoice = function() {
        var invoiceArr = $('#openInvoiceBtn').attr('data-invoice').split(',');
         var InvoiceRemark=$('#InvoiceRemark').val();//发票备注
        var address2= $('#defaultAddress').text();//配送地址

        if(!address2){
            layer.open({
                content: '请填写配送地址',
                className:'warning',
                time: 2
            });
            return false;
        }else {
            var Consignee = $('#defaultAddress').attr('Consignee').split(','); //收货人姓名及电话
            var SetUserInvoiceInfoJson = {
                    "user_id": rrcw.defaults.userid,
                    "order_id": invoiceArr[0],
                    "name": invoiceArr[1],
                    "invoice_type": 0, //发票类型
                    "invoice_amount": invoiceArr[2] - 0,
                    "actual_amount": invoiceArr[2] - 0,
                    "contacts": Consignee[0],
                    "phone": Consignee[1],
                    "address": address2,
                    "remark": InvoiceRemark
                },
                SetUserInvoiceInfoUrl = {
                      path: "/PlatApi/SetUserInvoiceInfo"
                };
                rrcw.requestSuccess(SetUserInvoiceInfoJson, SetUserInvoiceInfoUrl, function (req) {
                    if (req.Status == 0) {
                        var data = req.Data;
                         window.location.href = "/html/invoiceHistroy.html";
                    }
                });
        }
    };
    //开票历史
    //发票状态 -1已申请 1 已受理 2已配送 3 已作废 4 已完成
    invoiceHistory = function() {
        var invoiceHistoryJson = {
                "user_id": rrcw.defaults.userid,
                "page_index": 1,
                "page_size": 10
            },
            invoiceHistoryUrl = {
                  path: "/PlatApi/GetUserInvoiceList"
            };
        rrcw.requestSuccess(invoiceHistoryJson, invoiceHistoryUrl, function(req) {
            var invoiceHistory = '';
            if (req.Status == 0) {
                var data = req.Data.Data;
                $.each(data, function(i, history) {
                    var Status = history.InvoiceStatus;
                    var InvoiceStatus = Status == -1 ? '未受理' :Status==0?'已完成':Status==1?'已受理':Status==2?'已配送':'已作废';
                    invoiceHistory += ' <li class="bottom_20"><section>' +
                        '<h3 class="font_30">' + history.Name + '</h3>' +
                        '<h3 class="font_30 sheng">' + history.Address + '</h3><p class="font_26">' + history.Contacts + '</p>' +
                        '<p class="font_24">' + history.Phone + '</p></section> ' +
                        '<aside class="textRight"><p class="money orange top_0 left-30">￥' + history.InvoiceAmount + '</p>' +
                        '<p class="font_30 blue solve">' + InvoiceStatus + '</p></aside></li>';
                });
                $('#invoiceHistory').html(invoiceHistory);
            }
        })
    };
    //获取默认地址,并且获取收货人姓名及电话
    getDefaultAddress = function() {
        var getDefaultAddressJson = { "user_id": rrcw.defaults.userid, "is_default": 1 },
            getDefaultAddressUrl = {
                  path: "/PlatApi/GetUserAddressList"
            };
        rrcw.requestSuccess(getDefaultAddressJson, getDefaultAddressUrl, function(req) {
            if (req.Status == 0) {
                var data = req.Data[0];
                if (!data) {
                    return;
                }
                $('#defaultAddress').text(data.Provice + data.City + data.Area + data.Address);
                $('#defaultAddress').attr('Consignee', data.Name + ',' + data.Mobile);
            }
        });

    }; //获取默认地址
    //获取用户地址  expressAddress.html start
    getUserAddressList = function() {
        var addressList = $('#userAddressList');
        var GetUserAddressListJson = {
                'user_id': rrcw.defaults.userid
            },
            GetUserAddressListUrl = {
                  path: "/PlatApi/GetUserAddressList"
            };
        rrcw.requestSuccess(GetUserAddressListJson, GetUserAddressListUrl, function(req) {
            var userAddressList = '';
            if (req.Status == 0) {
                var data = req.Data;
                $.each(data, function(i, address) {
                    var isDefault = address.IsDefault == true ? 1 : 0;
                    userAddressList += ' <li class="bottom_20" addressId="' + address.Id + '"><i class="choice" default="' + isDefault + '"></i>' +
                        '<section class="sheng-45"><h3 class="font_30 sheng-45">' + address.Provice + address.City + address.Area + address.Address + '</h3>' +
                        '<p class="font_26 sheng-45">' + address.Name + '</p>' +
                        '<p class="font_24">' + address.Mobile + '</p>' +
                        '</section>' +
                        '<aside><p onclick=" changeAddressInfo(this)" data-changeAddress="' + address.Id + '" class="font_30 top_24"><i class="smallIcon"></i>修改</p></a>' +
                        '<p onclick="delAddressInfo(this)" class="font_30 confirm"><i  class="smallIcon delete"></i>删除</p>' +
                        '</aside></li>';
                });
                addressList.html(userAddressList);
            }
        });
    };
    //列表加载成功
    //勾选默认地址
    choiceDefaultAddress = function(defaultAddressId) {
        var setAddressDefaultJson = {
                "id": defaultAddressId,
                "is_default": 1,
                "user_id": rrcw.defaults.userid
            },
            setAddressDefaultUrl = {
                  path: "/PlatApi/SetUserAddressInfo"
            };
        rrcw.requestSuccess(setAddressDefaultJson, setAddressDefaultUrl, function(req) {
            if (!req.Status) {
                return;
            }
        })
    };
    delAddressInfo = function(b) { //点击删除post数据
        var addressId = $(b).closest('li').attr('addressId');
        var DelUserAddressInfoJson = { 'id': addressId }, //地址标识  $(this).id
            DelUserAddressInfoUrl = {   path: "/PlatApi/DelUserAddressInfo" };
        layer.open({
            title: ['删除地址', 'font-size:.32rem;color:#515151;'],
            content: '确认删除该快递地址吗？',
            btn: ['删除', '取消'],
            time: 2,
            style: 'text-align:center; font-size:.30rem;color:#515151',
            yes: function() {
                rrcw.requestSuccess(DelUserAddressInfoJson, DelUserAddressInfoUrl, function(req) {

                    if (req.Status == 203) {
                        layer.open({
                            content: req.Message,
                            className: 'warning',
                            time: 1.5
                        });
                    } else if (req.Status == 0) {
                        var data = req.Data;
                        getUserAddressList(); //刷新
                    }
                });
            }
        })

    }; //end
    //删除地址信息  end
    //修改地址信息  start
    changeAddressInfo = function(b) {
        var param1 = $(b).attr('data-changeAddress');
        location.href = "expressAddressChange.html?changeAddress=" + param1;
    };
    changeAddressList = function() {
        var param1 = rrcw.getUrlParam('changeAddress');
        if (!param1) { //修改不显示
            return;
        }
        var addressJson = {
                "id": param1,
                "user_id": rrcw.defaults.userid
            },
            addressUrl = {
                  path: "/PlatApi/GetUserAddressList"
            };
        rrcw.requestSuccess(addressJson, addressUrl, function(req) {
            if (req.Status == 0) {
                var data = req.Data[0];
                if (data == '' || data == 'null' || data == null) {
                    return;
                }
                var addressInfo = [data.Name, data.Mobile, data.Provice, data.City, data.Area, data.Address];
                $('#consigneeName').val(addressInfo[0]);
                $('#phoneMobile').val(addressInfo[1]);
                $('#userAddress').find('p').text(addressInfo[2] + " " + addressInfo[3] + " " + addressInfo[4]);
                $('#jutiAddress').val(addressInfo[5]);
            } else {
                layer.open({
                    content: req.Message,
                    time: 1,
                    className: 'warning'
                })
            }
        });
    };

    //保存地址信息 expressAddressAdd.html  start
    //ajax保存地址信息
    SetUserAddressInfo = function() {
        var ConsigneeName = $('#consigneeName').val(),
            iphoneMobile = $('#phoneMobile').val(),
            UserAddress = $('#userAddress').find('p').text(),
            jutiAddress = $('#jutiAddress').val();
        var addressParam = rrcw.getUrlParam('changeAddress');
        var txtReg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
        var telReg = /^1\d{10}$/;
        if (!ConsigneeName) {
            rrcw.inputVal.notNull(ConsigneeName, '姓名不能为空');
        } else if (!iphoneMobile) {
            rrcw.inputVal.notNull(iphoneMobile, '手机号不能为空');
        } else if (UserAddress=="请选择") {
            rrcw.inputVal.notNull(UserAddress, '地址不能为空');
        } else if (!jutiAddress) {
            rrcw.inputVal.notNull(jutiAddress, '详细地址不能为空');
        } else if (!txtReg.test(ConsigneeName.replace(/\s|\xA0/g, ""))) {
            layer.open({
                content: '姓名有特殊字符，请修改',
                className: 'warning',
                time: 1.5
            });
            return false;
        } else if (!telReg.test(iphoneMobile.replace(/\s|\xA0/g, ""))) {
            layer.open({
                content: '手机号格式错误，请修改',
                className: 'warning',
                time: 1.5
            });
            return false;
        } else if (!txtReg.test(jutiAddress.replace(/\s|\xA0/g, ""))) {
            layer.open({
                content: '详细地址有特殊字符，请修改',
                className: 'warning',
                time: 1.5
            });
            return false;
        } else {
            var provice, city, area;
            var AddressArr = UserAddress.replace(/\s/g, ',').split(',');
            if (AddressArr.length == 3) {
                provice = AddressArr[0];
                city = AddressArr[1];
                area = AddressArr[2];
            } else {
                provice = AddressArr[0];
                city = AddressArr[0];
                area = AddressArr[1];
            }
            var setUserAddressInfoJson = {
                    'user_id': rrcw.defaults.userid,
                    "name": ConsigneeName,
                    "mobile": iphoneMobile,
                    "provice": provice,
                    "city": city,
                    "area": area,
                    "address": jutiAddress,
                    "is_default": 1
                },
                setUserAddressInfoUrl = {   path: "/PlatApi/setUserAddressInfo" };
            if (!addressParam) { //直接点新增
                rrcw.requestSuccess(setUserAddressInfoJson, setUserAddressInfoUrl, function(req) {
                    if (req.Status == 0) { //保存信息成功
                        var data = req.Data;
                        layer.open({
                            content: '保存成功',
                            className: 'warning',
                            time: 1.5,
                            end: function() {
                                //跳转父页面，并刷新新页面
                                 location.href = document.referrer;
                            }
                        });
                    }
                }); //ajax  end
            } else { //点击修改传递了id
                setUserAddressInfoJson.id = addressParam;
                rrcw.requestSuccess(setUserAddressInfoJson, setUserAddressInfoUrl, function(req) {
                    if (req.Status == 0) { //保存信息成功
                        var data = req.Data;
                        layer.open({
                            content: '修改成功',
                            className: 'warning',
                            time: 1.5,
                            end: function() {
                                location.href = document.referrer;
                            }
                        });
                    }
                }); //ajax  end
            }
        }
    }; //end
    //保存地址信息   end
    //注册模块  start
    //注册页面手机号失焦验证,如果if(checkMobile())提示框会闪退------bug
    //layer插件封装在函数里再调用为什么会闪退
    checkMobile = function(val) { //手机失焦 正则提示
        var telReg = /^1\d{10}$/;
        if (!val) {
            return;
        }
        if (!telReg.test(val)) {
            layer.open({
                content: '手机号格式错误，请修改',
                className: 'warning',
                time: 1.5
            });
            return false;
        }
    };

    checkCode=function (val) {
        var telReg =  /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
        if (!val) {
            return;
        }
        if (!telReg.test(val)) {
            layer.open({
                content: '身份证格式错误，请修改',
                className: 'warning',
                time: 1.5
            });
            return false;
        }
    };

    checkStock=function (val) {
        var reg=/^\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}$|^100(\.0{1,2}){0,1}$/;
        if (!val) {
            return;
        }
        if (val !=0 && !reg.test(val)) {
            layer.open({
                content: '股权比例在0-100之间',
                className: 'warning',
                time: 1.5
            });
            return false;
        }
    };
    checkTxt = function(val) { //内容失焦 正则判断
        var str = val.replace(/\s|\xA0/g, ""); //清除所有空格或转行符
        var txtReg = /^[\(\)\（\）\-\u4e00-\u9fa5_a-zA-Z0-9]+$/;
        if (!val) {
            return false
        }
        if (!txtReg.test(str)) {
            layer.open({
                content: '含有特殊字符,请修改',
                className: 'warning',
                time: 1.5
            });
            return false;
        }
    };
    checkEmail = function(val) { //邮箱失焦及正则判断
        var emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!val) {
            return;
        }
        if (!emailReg.test(val)) {
            layer.open({
                content: '邮箱格式不正确',
                className: 'warning',
                time: 1.5
            });
            return false;
        }
    };


    SmsSend = function(mobile, fn) {
        var mobileJson = {
                "mobile": mobile,
                "code_type": 1, //1 注册 2 其他
                "user_type": 0
            },
            mobileUrl = {   path: "/PlatApi/SmsSend" };
        rrcw.requestSuccess(mobileJson, mobileUrl, function(req) {
            console.log("发送短信：",req);
            if (req.Status == 203) { //提示手机号已注册
                layer.open({
                    content: req.Message,
                    className: 'warning',
                    time: 1.5
                });
            } else if (req.Status == 0) {
                fn();
                layer.open({
                    content: "短信验证码已发送",
                    className: 'warning',
                    time: 1.5
                });
            } else if (req.Status != 203 && req.Status != 0) {
                layer.open({
                    content: '发送失败',
                    className: 'warning',
                    time: 1.5
                });
            }
        });
    };
    register = function() { //用户注册
        var mobileVal = $('#mobile').val(),
            codeVal = $('#code').val();
        var openid = rrcw.defaults.openid;
        var RegisterJson = { 'user_type': 0, 'mobile': mobileVal, 'openid': openid, 'code': codeVal },
            RegisterUrl = {   path: "/PlatApi/UserRegister" };
        if (mobileVal == '') {
            layer.open({
                content: '手机号不能为空',
                className: 'warning',
                time: 1.5
            });
            return;
        } else if (codeVal == '') {
            layer.open({
                content: '验证码不能为空',
                className: 'warning',
                time: 1.5
            });
            return;
        }
        rrcw.requestSuccess(RegisterJson, RegisterUrl, function(req) {
            console.log('注册：', req);
            if (req.Status == 203) {
                layer.open({
                    content: req.Message,
                    className: 'warning',
                    time: 2
                });
            } else if(req.Status==301){
                layer.open({
                    content: '验证码错误',
                    className: 'warning',
                    time: 2
                });
                return false;
            }else if (req.Status == 0) {
                var data = req.Data;
                if (!data.LoginId) {
                    layer.open({
                        content: '注册失败',
                        className: 'warning',
                        time: 2
                    });
                    return false;
                }  else {
                    rrcw.defaults.userid = data.UserId;
                    rrcw.localStorage.set('wechatB', rrcw.defaults);
                    layer.open({
                        content: '注册成功',
                        className: 'warning',
                        time: 2,
                        end: function() {
                            //跳转页面
                            window.location.href = document.referrer;
                        }
                    }); //注册成功

                } //end
            }
        });
    }; //手机号校验
    //解除绑定手机号，重新绑定
    unBundlingPhone = function() {
        var newmobileVal = $('#newMobile').val(),
            newcodeVal = $('#newcode').val();
        var openid = rrcw.defaults.openid;
        var unDundlingJson = { 'user_type': 0, 'mobile': newmobileVal, 'openid': openid, 'code': newcodeVal },
            unDundlingUrl = {   path: "/PlatApi/UnBindUser" };
        console.log('用户openid', openid);
        if (newmobileVal == '') {
            layer.open({
                content: '手机号不能为空',
                className: 'warning',
                time: 1.5
            });
            return;
        } else if (newcodeVal == '') {
            layer.open({
                content: '验证码不能为空',
                className: 'warning',
                time: 1.5
            });
            return;
        }
        rrcw.requestSuccess(unDundlingJson, unDundlingUrl, function(req) {
            console.log('解绑', req);
            if (req.Status == 301) {
                layer.open({
                    content: req.Message,
                    className: 'warning',
                    time: 2
                });
            } else if (req.Status == 0) {
                var data = req.Data;
                if (!data.LoginId) {
                    layer.open({
                        content: '解绑失败',
                        className: 'warning',
                        time: 2
                    });
                    return false;
                } else {
                    rrcw.defaults.userid = data.UserId;
                    rrcw.localStorage.set('wechatB', rrcw.defaults);
                    layer.open({
                        content: '解绑成功',
                        className: 'warning',
                        time: 2,
                        end: function() {
                            //跳转页面
                            window.location.href = '/html/my.html';
                        }
                    }); //注册成功

                } //end    
            }

        });
    };

    //注册模块结束
    //分享好友

    //路由跳转
    from = function(a) {
        var that = a;
        var parent = rrcw.getUrlParam('fromConfirm'),
            goodsid = rrcw.getUrlParam('goodsId');
        var orderid = rrcw.getUrlParam('mainOrder'),
            parent2 = rrcw.getUrlParam('fromOpen');
        if (parent == 'true') {
            $(that).attr('href', 'confirmOrder.html?confirmGoods=' + goodsid);
        } else if (parent2 == 'true') {
            $(that).attr('href', 'openInvoice.html?orderId=' + orderid);
        } else {
            $(that).attr('href', 'my.html')
        }

    };
    //注册公司  第三期
    GenerateOrder = function(goodCompanyId,upDataObj) {//创建订单
        var GenerateOrderJson = {
                "buserid": rrcw.defaults.userid,
                "goodsid": goodCompanyId-0,
                "registeraddress":upDataObj.address
            },
            GenerateOrderUrl = {
                path: "/ThirdPeriod/GenerateOrder"
            };
        rrcw.requestSuccess(GenerateOrderJson, GenerateOrderUrl, function (req) {
            console.log('创建订单',req);
            if(req.Status==0){
                var data=req.Data;
                upDataObj.CompanyOrderId=data.OrderId;
              //  upDataObj.ReCompanyId=data.CompanyId;
               rrcw.localStorage.set('updateCompanyObj', upDataObj);
                console.log('更新公司信息json2', rrcw.localStorage.get('updateCompanyObj'));
                var scopeIndex=(upDataObj.ownedindustry+'').substr(1);
                var obj1={
                    url:'RegisteredLand.html?CompanyOrderStatus=1&seecompanyScope=&CompanyOrderId='+data.OrderId+'&companyscopeIndex='+scopeIndex
                };
                UpdateCompanyInfo(obj1);
            }
        })
    };
    setCompanyInfoOrder=function () {//保存注册公司订单
        var TaxScroll2Index=$('#ownedindustry').attr('data-TaxScroll2Two'),
            companyTypeIndex=$('#reCompanyTax').attr('data-TaxScrollIndex'),
            seeCompanyScope=$('#setCompanyInfoOne').attr('data-seecompanyScope');
        var CompanyOrderStatus2=rrcw.getUrlParam('CompanyOrderStatus'),
            companyOrderId=rrcw.getUrlParam('CompanyOrderId'),
            companyGoodId=rrcw.getUrlParam('CompanyGoodsId');//注册公司商品id

        var name='',
            address=$('#selectAddress3').find('p').html(),
            companytype=$('#reCompanyTax').find('p').html(),
            ownedin=$('#ownedindustry').find('p').html();
        var companyName0= $('.IndustryP').find('p').length,
            companyNameText=$('.IndustryP').text();
        $('div.IndustryP').find('p').each(function () {
            var text=$(this).text();
            if(text.charAt(1)=='.'){
                text=text.split('.')[1];
            }
            text=text.replace(/[\r\n]+[ ]+/g,"");
            name+=text+',';
        });
        if (address=="请选择") {
            rrcw.inputVal.notNull(address, '注册地址不能为空');
        } else if (companytype=="请选择") {
            rrcw.inputVal.notNull(companytype, '公司类型不能为空');
        }else if(ownedin=="请选择"){
            rrcw.inputVal.notNull(ownedin, '所属行业不能为空');
        }else if(!companyNameText || companyName0==0){
            rrcw.inputVal.notNull('', '请添加公司名称');
        }else {
            var companyscopeIndex=TaxScroll2Index.substr(1,1)+ TaxScroll2Two2.index;//经营范围三级索引
            if(CompanyOrderStatus2!=4){
                var obj1={
                    "url":'RegisteredLand.html?companyscopeIndex='+companyscopeIndex+'&companyScope='+seeCompanyScope+'&CompanyOrderStatus='+CompanyOrderStatus2+'&CompanyOrderId='+companyOrderId
                    ,"registeramount":$(this).attr('RegisterMoney2') || 0,
                    "companyscope":seeCompanyScope
                };
            }else{
                obj1={
                    "url":'orderCore2.html',
                    "registeramount":$(this).attr('RegisterMoney2') || 0,
                    "companyscope":seeCompanyScope,
                    "orderStatus":4//核名失败
                };
            }
            var updateCompanyObj1 = {
                "CompanyOrderId": rrcw.getUrlParam('CompanyOrderId'),
                // "ReCompanyId": rrcw.getUrlParam('ReCompanyId'),
                "address": address,
                "ownedtype": TaxScroll2Index.substr(0,2) - 0,
                "ownedindustry": TaxScroll2Index - 0,
                "companytype":companyTypeIndex.substr(0,2)-0,
                "CompanyType1":companyTypeIndex-0,
                "companyname": name.substring(0,name.length-1),
                "remark": $('textarea.nameBei').val()
            };
            rrcw.localStorage.set('updateCompanyObj', updateCompanyObj1);
            if(!companyGoodId){//商品id不存在，订单存在
                UpdateCompanyInfo(obj1);
            }else{
                GenerateOrder(companyGoodId,updateCompanyObj1);//创建订单
            }

        }
    };
    UpdateCompanyInfo=function (obj) {//更新公司信息
        var updateCompanyObj=rrcw.localStorage.get('updateCompanyObj');
       var updateCompanyInfoJson={
           // "id":updateCompanyObj.ReCompanyId-0,
           "buserid": rrcw.defaults.userid,
           "paymentorder":updateCompanyObj.CompanyOrderId,
           "registeraddress":updateCompanyObj.address,
           "companyscope":obj.companyscope || '',
           "companytype":updateCompanyObj.companytype-0 || 11,//注册公司类型 1 2 3
           "ownedindustry":updateCompanyObj.ownedindustry,//所属行业
           "ownedtype":updateCompanyObj.ownedtype,//所属大类
           "CompanyType1":updateCompanyObj.CompanyType1,
           "registeramount":obj.registeramount-0 || 0,
           "companyname":updateCompanyObj.companyname,
           "realcompanyname":'',
           "remark":updateCompanyObj.remark
       }, updateCompanyInfoUrl={
               path: "/ThirdPeriod/UpdateCompanyiInfo"
           } ;
        console.log('更新公司的json',updateCompanyInfoJson);
       rrcw.requestSuccess(updateCompanyInfoJson,updateCompanyInfoUrl, function (req) {
           console.log('更新公司的ajax',req);
           if(req.Status==0){
              if(obj.orderStatus==4){
                   VerifyNameAgain(updateCompanyObj.CompanyOrderId,updateCompanyObj.companyname);//再次核名
               }else if(obj.url){
                   window.location.href=obj.url;
               }else{
                   return false;
              }
           }
       })
    };

    subCompanyOrder=function(orderId,type){//提交注册公司订单,注册公司  极速 普通
        var stockTotal=0;
        var subCompanyOrderJson = {
                "buserid": rrcw.defaults.userid,
                "id":orderId,
                "remark":$('textarea.BeiZhu2').val()
            },
            subCompanyOrderUrl = {
                path: "/ThirdPeriod/UpdateOrder"
            };
        $('span.stockSpan').each(function () {
            stockTotal=stockTotal+($(this).text()-0);
        });
        if(stockTotal==100){
            rrcw.requestSuccess(subCompanyOrderJson,subCompanyOrderUrl,function (req) {
                if(req.Status==0){
                    if(type==65){
                         window.location.href='pay2.html?confirmOrderID='+orderId;
                    }else{
                        window.location.href='orderSuccess2.html';
                    }

                }
            })
        }else{
            layer.open({
                content: '股权总和必须为100%',
                className: 'warning',
                time: 1.5
            });
            return false;
        }

    };
    StockRightAdd=function () {//股权增加
        var updateCompanyObj = rrcw.localStorage.get('updateCompanyObj'),
            powers = $('#ShareHolder').find('p').html(),
            ShareHolderName = $('#ShareHolderName').val(),
            ShareHolderMobile = $('#ShareHolderMobile').val(),
            ShareHolderCode = $('#ShareHolderCode').val(),
            stakeratio = $('#stakeratio').val();
        var ShareholderInfo=JSON.parse(rrcw.getUrlParam('ShareholderInfos'));
        var txtReg = /^[\(\)\（\）\-\u4e00-\u9fa5_a-zA-Z0-9]+$/;
        var telReg = /^1\d{10}$/;
        var CodeReg =  /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
        var codeReg=/^\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}$|^100(\.0{1,2}){0,1}$/;
        if (!ShareHolderName) {
            rrcw.inputVal.notNull(ShareHolderName, '姓名不能为空');
        } else if (powers == "请选择") {
            rrcw.inputVal.notNull(powers, '职权不能为空');
        } else if (!ShareHolderMobile) {
            rrcw.inputVal.notNull(ShareHolderMobile, '联系方式不能为空');
        } else if (!ShareHolderCode) {
            rrcw.inputVal.notNull(ShareHolderCode, '身份证号不能为空');
        } else if (!stakeratio) {
            rrcw.inputVal.notNull(stakeratio, '持股比例不能为空');
        } else if (!txtReg.test(ShareHolderName.replace(/\s|\xA0/g, ""))) {
            layer.open({
                content: '姓名含有特殊字符',
                className: 'warning',
                time: 1.5
            });
            return false;
        } else if(!telReg.test(ShareHolderMobile.replace(/\s|\xA0/g, ""))){
            layer.open({
                content: '手机格式不对',
                className: 'warning',
                time: 1.5
            });
            return false;
        }else if(!CodeReg.test(ShareHolderCode.replace(/\s|\xA0/g, ""))){
            layer.open({
                content: '身份证号格式不对',
                className: 'warning',
                time: 1.5
            });
            return false;
        }
        else {
            var powerNo, againIDCardNo = 0, againPower = 0, againPower1 = 0;
            switch (powers) {
                case "法人":
                    powerNo = "1";
                    break;
                case "监事" :
                    powerNo = "2";
                    break;
                default:
                    powerNo = "3";
            }
            $.each(ShareholderInfo, function (i, info) {
                if (info.IDCardNo == ShareHolderCode) {
                    againIDCardNo++;
                }
                if (info.Powers == 2 && info.Powers == powerNo) {
                    againPower++;
                }
                if (info.Powers == 1 && info.Powers == powerNo) {
                    againPower1++;
                }
            });

            if (againIDCardNo > 0) {
                layer.open({
                    content: '该身份证号已存在，请修改',
                    className: 'warning',
                    time: 1 //2秒后自动关闭
                });
                return false;
            } else if( stakeratio!=0 && !codeReg.test(stakeratio.replace(/\s|\xA0/g, "")) ){
                layer.open({
                    content: '股权比例在0-100之间',
                    className: 'warning',
                    time: 1 //2秒后自动关闭
                });
                return false;
            } else if (againPower > 0) {
                layer.open({
                    content: '监事已添加过，请另选',
                    className: 'warning',
                    time: 1 //2秒后自动关闭
                });
                return false;
            } else if (againPower1 > 0) {
                layer.open({
                    content: '法人已添加过，请另选',
                    className: 'warning',
                    time: 1 //2秒后自动关闭
                });
                return false;
            } else {
                var StockRightAddJson = {
                        "buserid": rrcw.defaults.userid,
                        "paymentorder": updateCompanyObj.CompanyOrderId,
                        // "companyid": updateCompanyObj.ReCompanyId - 0,
                        "powers": powerNo,
                        "name": ShareHolderName,
                        "mobile": ShareHolderMobile,
                        "idcardno": ShareHolderCode,
                        "companyname": updateCompanyObj.companyname,
                        "stakeratio": stakeratio - 0
                    },
                    StockRightAddUrl = {
                        path: "/ThirdPeriod/StockRightAdd"
                    };
                rrcw.requestSuccess(StockRightAddJson, StockRightAddUrl, function (req) {
                    if (req.Status == 0) {
                        layer.open({
                            content: '保存成功',
                            className: 'warning',
                            time: 1,
                            end: function () {
                                location.href = document.referrer;
                            }
                        });
                    } else {
                        layer.open({
                            content: req.Message,
                            className: 'warning',
                            time: 1 //2秒后自动关闭
                        });
                        return false;
                    }
                })
            }
        }
    };
    delStockInfo = function(a) { //点击删除股权
        var StockId = $(a).closest('tr').attr('data-stockId');
        var updateCompanyObj = rrcw.localStorage.get('updateCompanyObj');
        var delStockInfoJson = {
                "id": StockId-0,
                "buserid": rrcw.defaults.userid,
                "paymentorder":updateCompanyObj.CompanyOrderId
                //"companyid":updateCompanyObj.ReCompanyId - 0
            },
            delStockInfoUrl = {  path: "/ThirdPeriod/StockRightDelete" };
        layer.open({
            title: ['删除股东', 'font-size:.32rem;color:#515151;'],
            content: '确认删除该股东信息吗？',
            btn: ['删除', '取消'],
            time: 2,
            style: 'text-align:center; font-size:.30rem;color:#515151',
            yes: function() {
                rrcw.requestSuccess(delStockInfoJson, delStockInfoUrl, function(req){
                    if (req.Status == 203) {
                        layer.open({
                            content: req.Message,
                            className: 'warning',
                            time: 1.5
                        });
                    } else if (req.Status == 0) {
                        GetOrderDetailInfo();
                    }
                });
            }

        })
    }; //end
    changeStockInfo=function (a) {//股权信息更新
        var StockId = $(a).closest('tr').attr('data-stockId');
        var updateCompanyObj = rrcw.localStorage.get('updateCompanyObj');
        var delStockInfoJson = {
                "id": StockId-0,
                "buserid": rrcw.defaults.userid,
                "paymentorder":updateCompanyObj.CompanyOrderId,
                // "companyid":updateCompanyObj.ReCompanyId - 0,
                "stakeratio":$(a).text()-0
            },
            delStockInfoUrl = {  path: "/ThirdPeriod/StockRightUpdate" };
        rrcw.requestSuccess(delStockInfoJson,delStockInfoUrl,function (req) {
            console.log('股权更新json',delStockInfoJson);
            console.log('股权更新ajax',req);
            if(req.Status==0){
                // layer.open({
                //     content:"更新成功",
                //     className: 'warning',
                //     time: 1.5
                // });
                return false;
            }
        })
    };
    GetOrderDetailInfo=function () {//支付订单详情信息1
        var updateCompanyObj = rrcw.localStorage.get('updateCompanyObj');
        var GetOrderDetailJson = {
                "userid": rrcw.defaults.userid,
                "orderid": updateCompanyObj.CompanyOrderId
            },
            GetOrderDetailUrl = {
                path: "/ThirdPeriod/GetOrderDetail"
            };
        rrcw.requestSuccessAsyncFalse(GetOrderDetailJson,GetOrderDetailUrl,function (req) {
            console.log('支付订单详情信息ajax',req);
            console.log('支付订单详情信息json',GetOrderDetailJson);
            if(req.Status==0){
                var data=req.Data;
                var stocks='';
                $('#registeramount2').val((data.RegComInfo.RegisterAmount||''));
                $('#commitCompanyOrder').find('span.money').html(rrcw.formatMoney(data.OrderInfo.PayableAmount));
                var StocksInfo=data.StockRightinfo;
                $.each(StocksInfo,function (i,stockInfo) {
                    var powers=stockInfo.Powers;
                     var   powersTxt=powers==1?'法':powers==2?'监':'股';
                     var IDCode=stockInfo.IDCardNo.substr(0,4)+'****'+stockInfo.IDCardNo.substr(stockInfo.IDCardNo.length-4,4);
                    stocks+=' <tr data-powers="'+powers+'"  data-stockId="'+stockInfo.Id+'"><td class="seeCol font_26">('+powersTxt+')</td>' +
                        '<td ><span class="sheng_1">'+stockInfo.Name+'</span></td>' +
                        '<td>'+IDCode+'</td>' +
                        '<td><span onblur="changeStockInfo(this)" contenteditable="true"  class="stockSpan" style="outline: 0">'+stockInfo.StakeRatio+'</span><span class="font_26">%</span></td> ' +
                        '<td onclick="delStockInfo(this)" class="seeCol seeTxt font_26">删除</td></tr>';
                });
                $('#stockInfoTbody').html(stocks).attr('data-companyType',data.RegComInfo.CompanyType);//公司类型属性
                if(data.OrderInfo.RegisterType==65){//极速
                    $('#submitOrder2').attr('data-CompanyOrderType',65).text('提交订单');
                }else{
                    $('#submitOrder2').attr('data-CompanyOrderType',64).text('提交订单');
                }
                var len=data.StockRightinfo.length,
                    shareInfo=[];
                if(len<1){
                    shareInfo.push({'StakeRatio':0,'IDCardNo':0,'Powers':''});
                }else{
                    for(var k=0;k<len;k++){
                        shareInfo.push({'StakeRatio':data.StockRightinfo[k].StakeRatio,'IDCardNo':data.StockRightinfo[k].IDCardNo,'Powers':data.StockRightinfo[k].Powers})
                    }
                }
                $('#addShareholderInfo').click(function () {
                    window.location.href='ShareholderInfo.html?ShareholderInfos='+JSON.stringify(shareInfo);
                });
            }
        })
    };
      NAMEArr=[];
    GetCompanyBasicInfo=function () {//行业与名称  等等已填写的信息  再次核名
        var CompanyOrderId = rrcw.getUrlParam('CompanyOrderId'),
            CompanyOrderStatus=rrcw.getUrlParam('CompanyOrderStatus');
        var GetCompanyBasicJson = {
                "userid": rrcw.defaults.userid,
                "orderid": CompanyOrderId
            },
            GetCompanyBasicUrl = {
                path: "/ThirdPeriod/GetOrderDetail"
            };
        rrcw.requestSuccessAsyncFalse(GetCompanyBasicJson,GetCompanyBasicUrl,function (req) {
            console.log('行业与名称页面信息',req);
                if(req.Status==0){
                    var RegComInfo=req.Data.RegComInfo;//注册公司信息
                  //  if(CompanyOrderStatus==2 || CompanyOrderStatus==4){//待完善 再次核名
                        var companyNameArr=(RegComInfo.CompanyName||'').split(','),
                            nameStr='';
                  //  NAMEArr1.name.concat(companyNameArr);数组追加另一个数组
                   // Array.prototype.push.apply(NAMEArr, companyNameArr);
                        var $companyFirst= $('.companyFirst');
                        $('#selectAddress3').find('p').html(RegComInfo.RegisterAddress);
                        $('#reCompanyTax').attr('data-TaxScrollIndex',RegComInfo.CompanyType1).find('p').html(req.Data.CompanyTypeName);
                        $('#ownedindustry').attr({'data-TaxScroll2Two':RegComInfo.OwnedIndustry}).find('p').html(req.Data.OwnedIndustry);
                         companyNameArr =skipEmptyElementForArray(companyNameArr);
                    $companyFirst.find('.span2').val(req.Data.OwnedIndustry);
                    $companyFirst.find('.span3').val(req.Data.CompanyType1Name);
                    $companyFirst.find('.span4').val((RegComInfo.RegisterAddress||'').split(',')[0].substr(0,2));
                    var companyNameArr2=[];
                    for(var m=0,lenM=companyNameArr.length;m<lenM;m++){
                        if(companyNameArr[m]!='undefined'){
                            companyNameArr2.push(companyNameArr[m])
                        }
                    }
                       for(var i=0,len1=companyNameArr2.length;i<len1;i++){
                           nameStr+='<p><span>'+(i+1)+'.</span>'+companyNameArr2[i]+'</p>';
                       }
                       if(CompanyOrderStatus==4){
                           nameStr='';//清空
                       }
                    $('.IndustryP').append(nameStr);
                        $('textarea.nameBei').val(RegComInfo.Remark||'');
                        $('#setCompanyInfoOne').attr({'data-seecompanyScope':(RegComInfo.CompanyScope||''),'RegisterMoney2':RegComInfo.RegisterAmount});
                    $('#setCompanyInfo2').attr('RegisterMoney',RegComInfo.RegisterAmount);
                    }
               // }
        });
    };
    function skipEmptyElementForArray(arr){//数组去空
        var a = [];
        $.each(arr,function(i,v){
            var data = $.trim(v);
            if('' != data){
                a.push(data);
            }
        });
        return a;
    }
    GetOrderDetailInfo2=function () {//支付订单详情信息页面
        var CompanyOrderId = rrcw.getUrlParam('companyOrderId');
        var GetOrderDetailJson = {
                "userid": rrcw.defaults.userid,
                "orderid": CompanyOrderId
            },
            GetOrderDetailUrl = {
                path: "/ThirdPeriod/GetOrderDetail"
            };
        rrcw.requestSuccess(GetOrderDetailJson,GetOrderDetailUrl,function (req) {
            console.log('支付订单详情信息2ajax',req);
            console.log('支付订单详情信息2json',GetOrderDetailJson);
            if(req.Status==0){
                var OrderInfo=req.Data.OrderInfo,
                    RegComInfo=req.Data.RegComInfo,
                    CUserInfo=req.Data.CuserInfo,
                    WFInfo=req.Data.WFInfo;
                var startTime = splitTimeYMD(OrderInfo.StartDate)||'',
                    endTime = splitTimeYMD(OrderInfo.EndDate) || '',
                    money2=rrcw.formatNum(OrderInfo.PayableAmount );
                  var cName=CUserInfo.FinanceName||'等待服务者',
                      cMobilePhone=CUserInfo.FinanceMobile||'4008083568',
                      cServerTxt=OrderInfo.Status==5?'已完成服务':'为您服务',
                      verifyNamesu=WFInfo[1].Status==1?'': '(待核)',
                      companyName=WFInfo[1].Status==1?RegComInfo.RealCompanyName:(RegComInfo.CompanyName||'').split(',')[0];
            var companyOrderDetail='<h3 class="font_30">'+req.Data.GoodName+'<span class="money orange right">￥'+money2+'</span></h3>' +
                '<p class="font_26">服务时间:&nbsp;'+startTime+'-'+endTime+'</p>'+
                '<p class="font_26">'+companyName+'<span class="orange">&nbsp;'+verifyNamesu+'</span></p>' +
                '<p class="font_26">'+cName+'&nbsp;<span class="orange">'+cServerTxt+'</span>' +
                '<a href="tel:'+cMobilePhone+'" class="btn1 right reload">联系服务者</a></p>';
            $('.companyOrderDetail').html(companyOrderDetail);
//阶段表格
                var statusTxt2,statusColor;
            $.each(WFInfo,function (i,wf) {
                var CompleteTime=splitTimeYMD(wf.StageCompleteTime),
                    onTime=wf.IsOnTime,
                    status=wf.Status,
                    Stagenum=wf.StageNo;
               if(status==2){
                   statusTxt2='失败';
                   statusColor='errCol';
               }else if(status==1 && onTime){
                   statusTxt2='完成';
                   statusColor='finCol';
               }else if(status==1 && !onTime){
                   statusTxt2='完成';
                   statusColor='midCol';
               } else if(status==3){//未开始
                   statusTxt2='未开始';
                   statusColor='col99';
               }
               var trArr= $('#serversStatus').find('tr');
               if(i<3){
                   if(status==3){
                       trArr.eq(i).find('td').eq(3).css({'display':'none'});
                   }
                       trArr.eq(i).find('td').eq(1).addClass(statusColor).text(CompleteTime);
                       trArr.eq(i).find('td').eq(2).addClass(statusColor).text(statusTxt2);
                       trArr.eq(i).find('td').eq(3).attr('data-WFStatusAndNum', status + '' + Stagenum);//阶段的状态及序列号

               }else{
                   trArr.eq(i).find('td').eq(1).addClass(statusColor).text(CompleteTime);
                   trArr.eq(i).find('td').eq(2).addClass(statusColor).text(statusTxt2);
               }
            });
   //去支付 按钮 及 确认完成按钮
            if(OrderInfo.RegisterType==64){//64 普通  65 极速
                    //营业执照完成(去支付按钮)
                    if(WFInfo[2].Status==1&&OrderInfo.PayStatus==1){
                        $('.twoBtn').append('<a  class="btn companyOrderDetailBtn">去支付</a>');
                        $('.companyOrderDetailBtn').attr('href','pay2.html?confirmOrderID='+OrderInfo.Id);
                        $('.seeCompanyOrderDetails').removeClass('btnSuper').addClass('btn').css({'margin-right':'.93rem'});
                    }

            }else{//极速注册
                if(OrderInfo.PayStatus==2 &&OrderInfo.Status==2){ //极速注册 付款中加 待完善
                    $('.twoBtn').append('<a  class="btn companyOrderDetailBtn">确认支付</a>');
                    $('.companyOrderDetailBtn').attr('href','pay2.html?confirmOrderID='+OrderInfo.Id);
                    $('.seeCompanyOrderDetails').removeClass('btnSuper').addClass('btn').css({'margin-right':'.93rem'});
                }else{
                    $('.companyOrderDetailBtn').css({'display':'none'});
                }
            }
        if(OrderInfo.Status==9){//待确认
            var last=rrcw.getTime(OrderInfo.LastModified)||'';
            $('.seeCompanyOrderDetails').removeClass('btnSuper').addClass('btn').css({'margin-right':'.93rem'});
            $('.twoBtn').append(' <button type="button" id="SureAccomplishOrder" data-companyOrderId="'+OrderInfo.Id+'" onclick="SureAccomplishOrder1(this)" class="btn Finished">确认完成</button>'
               );//确认完成按钮
            CountDownAbout(last);
        }
            }
        })
    };
    DelayaApplyLog=function () {//延期日志
        var CompanyOrderId2 = rrcw.getUrlParam('companyOrderId');
        var DelayaApplyLogJson = {
                "userid": rrcw.defaults.userid,
                "orderid": CompanyOrderId2
            },
            DelayaApplyLogUrl = {
                path: "/ThirdPeriod/DelayaApplyLogB"
            };
        rrcw.requestSuccess(DelayaApplyLogJson,DelayaApplyLogUrl,function (req) {
            console.log('延期日志',req);
            if(req.Status==0){
                var data=req.Data,ApplyLog='';
                if(data.length==0){
                    $('#DelayaApplyLogT').html('');
                }else{
                    $('#DelayaApplyLogT').append(' <section class="left_20"><table style="width: 6.9rem;text-align: left">' +
                        '<thead class="co51 font_30"><tr> <th>延期记录</th></tr></thead>' +
                        '<tbody class="col99 font_28" > <tr id="DelayaApplyLogTBody" class="co51 font_30"><td>申请时间</td><td>申请时长</td><td>延期阶段</td><td>申请理由</td></tr>' +
                        '</tbody></table></section>');
                    $.each(data,function (i,delay) {
                        var CreatedDate=splitTimeYMD2(delay.CreatedDate),
                            StageId=delay.StageId;
                        var  applyText=StageId==1?'材料收集':StageId==2?'核名':StageId==3?'营业执照':StageId==4?'交付物审核':StageId==5?'交付物交付':'办结';
                        ApplyLog+='<tr><td>'+CreatedDate+'</td>' +
                            '<td>'+delay.ExtensionDay+'天</td>' +
                            '<td>'+applyText+'</td>' +
                            '<td class="sheng_1">'+delay.Remark+'</td></tr>';
                    });
                    $('#DelayaApplyLogTBody').after(ApplyLog);
                }
            }
        })
    };
    CountDownAbout=function (last) {//倒计时天数
        var CountDownAboutUrl = {
                path: "/ThirdPeriod/CountDownAbout"
            };
        rrcw.requestSuccess('',CountDownAboutUrl,function (req) {
            if(req.Status==0){
                var data=req.Data;
                var now=rrcw.getTime(data.NowTime)||'';
                var day=parseInt((last-now)/(1000*60*60*24))+(data.DaySpan-0);
                if(day>=0){//7天内
                    $('#SureAccomplishOrder').after('<p class="Finished"><small class="errCol">*'+day+'天自动确认</small></p>')
                        .next('p').css({"margin-left":"2.93rem","font-size":"0.18rem"})
                }else{
                    $('.twoBtn').html('');
                }
            }
        })
    };
    companyOrderDetails=function () {//注册公司订单详情
        var CompanyOrderId = rrcw.getUrlParam('companyOrderId');
        var GetOrderDetailJson2 = {
                "userid": rrcw.defaults.userid,
                "orderid": CompanyOrderId
            },
            GetOrderDetailUrl2 = {
                path: "/ThirdPeriod/GetOrderDetail"
            };
        rrcw.requestSuccess(GetOrderDetailJson2,GetOrderDetailUrl2,function (req) {
            if(req.Status==0){
                var regComInfo=req.Data.RegComInfo,
                    StocksInfo=req.Data.StockRightinfo;
                var companyNameList=(regComInfo.CompanyName || '').split(',');
                nameArr = skipEmptyElementForArray(companyNameList);
                var verifyList = '',stocks='';
                for (var i = 0, len = nameArr.length; i < len; i++) {
                    verifyList += '<li>' + nameArr[i] + '</li>';
                }
                $(".beiXuan").css({'font-size':'.3rem'}).html(verifyList)
                    .append(' <li class="nuclearBei font_30"><label>名称备注:</label>&nbsp;' +
                        '<input readonly type="text" class="font_30_3" value="' + regComInfo.Remark + '"/></li>')
                    .find('li.nuclearBei').css({'height':'.8rem','line-height':'.8rem'}).prev().addClass('nuclearBottom2');
        $('.selectAddress3').html(regComInfo.RegisterAddress);
        $('.reCompanyTax').find('span').html(regComInfo.CompanyScope);
                $.each(StocksInfo,function (i,stockInfo) {
                    var powers=stockInfo.Powers;
                    var   powersTxt=powers==1?'法':powers==2?'监':'股';
                    stocks+=' <tr data-powers="'+powers+'"  data-stockId="'+stockInfo.Id+'"><td class="seeCol font_26">('+powersTxt+')</td>' +
                        '<td ><span class="sheng_0">'+stockInfo.Name+'</span></td>' +
                        '<td><span class="sheng_0">'+stockInfo.IDCardNo+'</span></td>' +
                        '<td><span>'+stockInfo.StakeRatio+'</span><span class="font_26">%</span></td> ' +
                        '</tr>';
                });
                $('#stockInfoTbody2').html(stocks);
                $('.keHuBei').find('span').eq(1).html('&nbsp;'+req.Data.OrderInfo.Remark)

            }
        })
    };
    seeWFInfo=function (StatusAndNum) {//跳转前三个阶段的详情页面
        var CompanyOrderId = rrcw.getUrlParam('companyOrderId');
        if(!StatusAndNum){return}
        window.location.href='orderDetails_serverImage.html?companyOrderId='+CompanyOrderId+'&WFStatus='+StatusAndNum.charAt(0)+'&StageNo='+StatusAndNum.charAt(1);
    };
    seeWFInfoDetails=function () {//查看阶段详情
        var CompanyOrderId = rrcw.getUrlParam('companyOrderId'),
            WfStatus=rrcw.getUrlParam('WFStatus'),
            WFNum=rrcw.getUrlParam('StageNo');
        var GetOrderDetailJson = {
                "userid": rrcw.defaults.userid,
                "orderid": CompanyOrderId
            },
            GetOrderDetailUrl = {
                path: "/ThirdPeriod/GetOrderDetail"
            };
        rrcw.requestSuccess(GetOrderDetailJson,GetOrderDetailUrl,function (req) {
            console.log('查看阶段详情ajax',req);
            if (req.Status == 0) {
                var OrderInfo = req.Data.OrderInfo,
                    RegComInfo = req.Data.RegComInfo,
                    CUserInfo = req.Data.CuserInfo,
                    WFInfo = req.Data.WFInfo;
                var startTime = splitTimeYMD(OrderInfo.StartDate) || '',
                    endTime = splitTimeYMD(OrderInfo.EndDate) || '',
                    money2 = rrcw.formatNum(OrderInfo.PayableAmount );
                var cName = CUserInfo.FinanceName || '等待服务者',
                    cMobilePhone = CUserInfo.FinanceMobile || '4008083568',
                    cServerTxt = OrderInfo.Status == 5 ? '已完成服务' : '为您服务',
                    verifyNamesu=WFInfo[1].Status==1?'': '(待核)',
                companyName=WFInfo[1].Status==1?RegComInfo.RealCompanyName:(RegComInfo.CompanyName||'').split(',')[0];
                var companyOrderDetail='<h3 class="font_30">'+req.Data.GoodName+'<span class="money orange right">￥'+money2+'</span></h3>' +
                    '<p class="font_26">服务时间:&nbsp;'+startTime+'-'+endTime+'</p>' +
                    '<p class="font_26">'+companyName+'<span class="orange">&nbsp;'+verifyNamesu+'</span></p>' +
                    '<p class="font_26">'+cName+'&nbsp;<span class="orange">'+cServerTxt+'</span>' +
                    '<a href="tel:'+cMobilePhone+'" class="btn1 right reload">联系服务者</a></p>';
                $('.companyOrderDetail').html(companyOrderDetail);
              //查看材料收集及营业执照的信息
                var NUM;
                if(WFNum==1||WFNum==3){
                  $('.stage1AndStage3').css({'display':'block'});
                  $('.VerifyNameErr').css({'display':'none'});
                  $('.VerifyNameSu').css({'display':'none'});
                  $('.VerifyNameBtn').css({'display':'none'});
                  if(WFNum==1){
                      NUM=0;
                  }else{
                      NUM=2;
                  }
                  if(WfStatus==1){//阶段1||3成功
                      $('.serverImage').append('<img src="'+WFInfo[NUM].StageThumImage+'" alt="成功上传的照片">').click(function () {
                          window.location.href = "showImage.html?imgsrc=" + WFInfo[NUM].StageImage;
                      });
                      $('.stage13Bei').val(WFInfo[NUM].StageRemark || '');
                  }else{
                      $('.serverImage').css({'align-items':'center'}).append('<i class="serverImageI"><img src="static/images/B_images/loadImg.png"></i>');
                  }
                }else if(WFNum==2 && WfStatus==1  ){//核名成功
                    $('.stage1AndStage3').css({'display':'none'});
                    $('.VerifyNameErr').css({'display':'none'});
                    $('.VerifyNameSu').css({'display':'block'});
                    $('.VerifyNameBtn').css({'display':'none'});
                    $('.realCompanyName').html(RegComInfo.RealCompanyName|| '');
                    $('.serverImage2').append('<img src="'+WFInfo[1].StageThumImage+'" alt="成功上传的照片">').click(function () {
                        window.location.href = "showImage.html?imgsrc=" + WFInfo[1].StageImage;
                    });
                    $('.stagesBei').val(WFInfo[1].StageRemark || '');
                    VerifyNameHistory(1);
                }else if(WFNum==2 && WfStatus==2){//核名失败
                    $('.stage1AndStage3').css({'display':'none'});
                    $('.VerifyNameErr').css({'display':'block'});
                    $('.VerifyNameSu').css({'display':'none'});
                    $('.VerifyNameBtn').css({'display':'block'}).find('button').click(function(){
                      window.location.href='IndustryAndName.html?CompanyOrderId='+OrderInfo.Id+'&CompanyOrderStatus='+OrderInfo.Status;
                    });
                    VerifyNameHistory(0);
                }
            }
        });
    };
    VerifyNameHistory=function (VerifyNum) {//获取核名历史 1代表 通过 0 失败
        var CompanyOrderId = rrcw.getUrlParam('companyOrderId');
        var VerifyNameHistoryJson = {
                "userid": rrcw.defaults.userid,
                "orderid": CompanyOrderId
            },
            VerifyNameHistoryUrl = {
                path: "/ThirdPeriod/VerifyNameHistory"
            };
        rrcw.requestSuccess(VerifyNameHistoryJson,VerifyNameHistoryUrl,function (req) {
            console.log('获取核名历史', req);
            if (req.Status == 0) {
                var data = req.Data,
                    len1=data.length;
                $nuclearHistoryUl = $('.nuclearHistoryList');
                if (len1 == 1 && VerifyNum == 0) {
                    var errName1='';
                    var errNameArr1=skipEmptyElementForArray(data[len1-1].CompanyName.split(','));
                    for(var m=0,lenErr1=errNameArr1.length;m<lenErr1;m++){
                        errName1+='<li>' + errNameArr1[m] + '</li>';
                    }
                    $('.VerifyNameErr1 >ul').html(errName1);
                }else{
                    var j;
                    if(VerifyNum == 0){
                        j=1;
                    }else{
                        j=0;
                    }
                    for(j;j<len1;j++){
                        var nameArr = data[j].CompanyName.split(',');
                        nameArr = skipEmptyElementForArray(nameArr);
                       var errNameArr=skipEmptyElementForArray(data[0].CompanyName.split(','));
                        $nuclearHistoryUl.append(' <div class="nuclearHistory" id="nuclearHistory'+j+'"><h3 class="font_30">核名历史&nbsp;&nbsp;&nbsp;' + splitTimeYMD(data[j].CreatedDate) + '</h3><ul></ul></div>');
                        var verifyList = '',errName='';
                        for(var k=0,lenErr=errNameArr.length;k<lenErr;k++){
                            errName+='<li>' + errNameArr[k] + '</li>';
                        }
                        $('.VerifyNameErr1 >ul').html(errName);
                        for (var i = 0, len = nameArr.length; i < len; i++) {
                            verifyList += '<li class="sheng_0">' + nameArr[i] + '</li>';
                        }
                        $("#nuclearHistory"+j+" ul").append(verifyList)
                            .append(' <li class="nuclearBei"><label>财税师备注:</label>' +
                            '<input readonly type="text" value="' + data[j].Remark + '" placeholder="备注"/></li>')
                            .find('li.nuclearBei').prev().addClass('nuclearBottom');
                    }
                }

            }
        })
    };
    VerifyNameAgain=function (orderId,name) {//再次核名
        var VerifyNameAgainJson = {
                "userid": rrcw.defaults.userid,
                "orderid": orderId,
                "companyname":name
            },
            VerifyNameAgainUrl = {
                path: "/ThirdPeriod/VerifyNameAgain"
            };
        rrcw.requestSuccess(VerifyNameAgainJson,VerifyNameAgainUrl,function (req) {
            if(req.Status==0){
               window.location.href='orderCore2.html'
            }
        })
    };

    getCompanyOrderList=function (content,status) {//注册公司订单列表
        var CompanyOrderListJson={
            "userid": rrcw.defaults.userid,
            "pageindex": 1,
            "pagesize": 50,
            "orderstatus": status
        },CompanyOrderListUrl={
            path: "/ThirdPeriod/GetOrderList"
        };

        rrcw.requestSuccess(CompanyOrderListJson,CompanyOrderListUrl,function (req) {
            console.log('列表',req);
            if(req.Status==0){
                var data=req.Data.List;
                var companyOrders='',goHtml;
                var $progressBar;

                $.each(data,function (i,companyOrder) {
                    var baseInfo=companyOrder.BaseInfo;
                    var status=baseInfo.Status;
                    var StatusPross = new Array(6);
                    var IsOnTime = new Array(6);
                    var payBtn,payTxt;
                    var  statusTxt = (status == 1) ? '未开始': status == 3 ? '已下单' : status == 4 ? '服务中' : status==6?'已终止':status==9?'待确认':status==10?'已取消':'已完成';
                   if(status==9){
                       payBtn = 'true';
                       payTxt='确认完成';
                   }
                    else if(baseInfo.RegisterType==64&&status!=6){//64普通 65极速
                            if(companyOrder.StageInfo[2].Status==1&&baseInfo.PayStatus==1){
                                payBtn = 'true';
                                payTxt='去支付';
                            }else{
                                payBtn = 'false';

                            }
                    }else if(baseInfo.RegisterType==65&&status!=6){//极速
                        if(baseInfo.PayStatus==2 && status==2){//待完善付款中
                            payBtn = 'true';
                            payTxt='确认支付';
                            statusTxt='待支付'
                        }else{
                            payBtn = 'false';
                        }
                    }else{
                        payBtn = 'false';
                    }
                    if(baseInfo.RegisterType==64 && status==2){//待完善
                        statusTxt='待完善';
                        goHtml= 'IndustryAndName.html?CompanyOrderId='+baseInfo.Id+'&CompanyOrderStatus='+status;
                    }else if(baseInfo.RegisterType==65 && baseInfo.PayStatus==1 && status==2){
                        statusTxt='待完善';
                        goHtml= 'IndustryAndName.html?CompanyOrderId='+baseInfo.Id+'&CompanyOrderStatus='+status;
                    }else {
                        goHtml= 'orderDatails_server.html?companyOrderId='+baseInfo.Id;
                    }
                    if(content=="#companyOrderList4"){
                        $progressBar= "progressBarDivs_4"+i;
                    }else if(content=="#companyOrderList5"){
                        $progressBar= "progressBarDivs_5"+i;
                    }else{
                        $progressBar= "progressBarDivs"+i;
                    }

                    var CUserName =status==1|| status == 4 || status == 5 || status == 9 ? baseInfo.CName || '等待财税师' : '等待中';
                    var CUserIcon =status==1 || status == 4 || status == 5 || status == 9 ? (baseInfo.CIconPath || 'static/images/B_images/person.png') : 'static/images/B_images/person.png';
                    var startTime = splitTimeYMD(baseInfo.StartDate)||'',
                        endTime = splitTimeYMD(baseInfo.EndDate) || '',
                        money=rrcw.formatNum(baseInfo.PayableAmount);
                    companyOrders=' <li><div class="orderCoreDiv"><img src="'+CUserIcon+'"><p>'+CUserName+'</p></div>' +
                        '<a href="'+goHtml+'"><section><h3><span class="inLineFlex"><i>'+baseInfo.GoodName+'</i></span><span class="seeCol right font_26">'+statusTxt+'</span></h3>' +
                        '<p>订单编号:&nbsp;&nbsp;'+baseInfo.Id+'</p>' +
                        '<p>服务时间:&nbsp;&nbsp;'+startTime+'-'+endTime+'</p><p>订单总额:&nbsp;&nbsp;<span class="orange money">￥'+money+'</span></p></section></a> ' +
                        '<a class="payNow top_17" data-companyorderStatus="'+status+'" data-companyOrderId="'+baseInfo.Id+'" onclick="SureAccomplishOrder(this)" href="pay2.html?confirmOrderID=' + baseInfo.Id + '" data-payStatus ="'+payBtn+'">'+payTxt+'</a><article class="progressBarDivs">' +
                        '<div id="'+$progressBar+'" class="progressBarDiv"><div class="progressText"><div class="text text2">核名</div><div class="text text4">交付物审核</div><div class="text text6">办结</div></div><div class="progressBar"><div class="circle circle1"></div><div class="bar bar1"></div><div class="circle circle2"></div><div class="bar bar2"></div><div class="circle circle3"></div><div class="bar bar3"></div><div class="circle circle4"></div><div class="bar bar4"></div><div class="circle circle5"></div><div class="bar bar5"></div><div class="successDiv"></div></div><div class="progressText"><div class="text text1">材料收集</div><div class="text text3">营业执照</div><div class="text text5">交付物交付</div></div></article></li>';
                    $(content).append(companyOrders);
                    if(status!=6&&companyOrder.StageInfo.length>0) {
                        var m = 0;
                        for (m = 0; m < 6; m++) {
                            StatusPross[m] = companyOrder.StageInfo[m].Status;
                            IsOnTime[m] = companyOrder.StageInfo[m].IsOnTime;
                            if (StatusPross[m] == 1) {//成功
                                IsOnTime[m] == true ? $("#"+$progressBar).find(".circle" + (m + 1)).addClass("green1") : $("#"+$progressBar).find(".circle" + (m + 1)).addClass("orange1");
                                $("#"+$progressBar).find(" .bar" + (m + 1)).removeClass("greenTo1").addClass("greenAll");
                            } else if ((StatusPross[m] == 2 || StatusPross[m] == 3) && StatusPross[m - 1] == 1) {//从左往右检索Status数组，找出第一个“3”所属的阶段，为该阶段的上一阶段的div.bar设置渐变样式。
                                $("#"+$progressBar).find(".bar" + m).removeClass("greenAll").addClass("greenTo1");
                            }
                        }
                        if ($("#"+$progressBar).find(" .bar5").hasClass("greenAll")) {
                            $(this).removeClass("greenTo1");
                            $("#"+$progressBar).find(" .progressBar .successDiv").css("background-image", "url(../html/static/images/c/successOn.png)");
                        }
                    }
                });

            }
        })

    };

    SureAccomplishOrder1=function (a) {
        var SureAccomplishOrderJson={
            "buserid": rrcw.defaults.userid,
            "id": $(a).attr('data-companyOrderId')
        },SureAccomplishOrderUrl={
            path: "/ThirdPeriod/SureAccomplishOrder"
        };

        rrcw.requestSuccess(SureAccomplishOrderJson,SureAccomplishOrderUrl,function (req) {
                if(req.Status==0){
                    $('.twoBtn').html('');
                    GetOrderDetailInfo2();//刷新页面
                }
            });

    };
    SureAccomplishOrder=function (a) {//B端提交订单完成
        var SureAccomplishOrderJson={
            "buserid": rrcw.defaults.userid,
            "id": $(a).attr('data-companyOrderId')
        },SureAccomplishOrderUrl={
            path: "/ThirdPeriod/SureAccomplishOrder"
        };
        if($(a).attr('data-companyorderStatus')==9){//待确认
            $(a).attr('href','');
            rrcw.requestSuccess(SureAccomplishOrderJson,SureAccomplishOrderUrl,function (req) {
                if(req.Status==0){
                    getCompanyOrderList();
                }
            });
        }else{
            return false;
        }

    };
    splitTimeYMD= function(time){//时间处理年月日
        if(typeof time=='string'){
            var time1=parseInt(time.split('(')[1].split(')')[0]);
            return new Date(time1).pattern('yyyy/MM/dd');
        }
        return null;
    };
    splitTimeYMD2= function(time){//时间处理年月日
        if(typeof time=='string'){
            var time1=parseInt(time.split('(')[1].split(')')[0]);
            return new Date(time1).pattern('yy/MM/dd');
        }
        return null;
    };
    CompanyAbout=function (index) {//公司信息范围（所属行业）及 索引
        var CompanyAboutUrl={
            path: "/ThirdPeriod/CompanyAbout"
        };
        rrcw.requestSuccess('',CompanyAboutUrl,function (req) {
            console.log('所属行业',req);
            if(req.Status==0){
                if(!index){
                    TaxScroll2_2(req.Data).Tax();
                    mobScrollTwo(TaxScroll_2,'#ownedindustry');
                }else{
                   var scopeStr='';
                   $.each(req.Data[index.substr(0,1)-1].TwoLevel[index.substr(1)-0].ThreeLevel,function (i,scope1) {
                       var Name=scope1.Name.split(';');
                       for(var k=0,len=Name.length;k<10;k++){
                          var random=Math.floor(Math.random()*len);
                           scopeStr+=Name[random]+','
                       }
                   });
                  $('.scopeBei').val(scopeStr.substring(0,scopeStr.length-1));
                }
            }
        })
    };
    ComTypeAbout=function () {//公司类型
        var CompanyAboutUrl={
            path: "/ThirdPeriod/ComTypeAbout"
        };
        rrcw.requestSuccess('',CompanyAboutUrl,function (req) {
            console.log('公司类型',req);
            if(req.Status==0){
                    TaxScroll2_2(req.Data).Tax();
                    mobScrollTwo(TaxScroll_2,'#reCompanyTax');
            }
        })
    };
    /*
    * 省市区
    * params：
    * index 一期 三期索引
    * level:省市区级数索引
    * code:父级code码
    * indexArea:area对象索引
    * el：do,
    *
    * */
    AreaAbout=function (indexArea,index,level,code,el) {
        var AreaAboutUrl,AreaAboutJson;
        if(index==1){
            AreaAboutUrl={
                path: "/PlatApi/GetDistrict"
            };
                AreaAboutJson={
                    "level":level,
                    "parentId":code
                };
        }else{
            AreaAboutUrl={
                path: "/ThirdPeriod/AreaAbout"
            };
            AreaAboutJson={
                "level":level-0,
                "parentid":code-0
            };
        }
        rrcw.requestSuccessAsyncFalse(AreaAboutJson,AreaAboutUrl,function (req) {
            if(req.Status==0){
                if(level==1){
                    companyOrderArea2(indexArea,index).Province(req.Data);
                    mobScrollThree(indexArea,index,el);
                }else if(level==2){
                     companyOrderArea2(indexArea,index).City(req.Data);
                }else{
                    companyOrderArea2(indexArea,index).County(req.Data);
                }
            }
        })
    };


});
