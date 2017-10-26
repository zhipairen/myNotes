if (!window.renrenc) window.renrenc = {};
(function ($) {
    renrenc.IsNull = function(time)
    {
        if(time=="" || time == null){return ""}
    };

    //时间yyyy/MM/dd
    renrenc.GetData = function(time){
        if(time=="" || time == null){return ""}
        var time1=parseInt(time.split("(")[1].split(")")[0]);
        return new Date(time1).pattern("yyyy/MM/dd");
    };

    //时间yy/MM/dd
    renrenc.GetData1 = function(time){
        if(time=="" || time == null){return ""}
        var time1=parseInt(time.split("(")[1].split(")")[0]);
        return res = new Date(time1).pattern("yy/MM/dd");
    };

    //时间yyyy/MM
    renrenc.GetMonthd = function(time){
        if(time=="" || time == null){return ""}
        var time1=parseInt(time.split("(")[1].split(")")[0]);
        return new Date(time1).pattern("yyyy/MM");
    };

    //时间hh:mm
    renrenc.GetHour = function(time){
        if(time=="" || time == null){return ""}
        var time1=parseInt(time.split("(")[1].split(")")[0]);
        return new Date(time1).pattern("hh:mm");
    };

    //ios alert弹框出现URL
    window.alert = function(name){
        var iframe = document.createElement("IFRAME");
        iframe.style.display="none";
        iframe.setAttribute("src", "data:text/plain,");
        document.documentElement.appendChild(iframe);
        window.frames[0].window.alert(name);
        iframe.parentNode.removeChild(iframe);
    };

    /*2.51  C端抢单大厅(新)*/
    renrenc.GetQDOrderList = function () {
        var GetQDOrderListJson = {
                "order_status":2
            };
        var GetQDOrderListUrl = {
                path:"/PlatApi/GetOrderDetailListV2"
            };
        rrcw.requestSuccessC(GetQDOrderListJson, GetQDOrderListUrl, function (req) {
            console.log("C端抢单大厅(新)：",req);
            if (req.Status != 0) {
                return false;
            }
            var data = req.Data.Data;
            for(var i=0; i<data.length; i++){
                var datai = data[i];
                /*json = { "id":datai.CompanyId };
                url = { path:"/PlatApi/GetCompanyInfo" };*/
                var CreatedDate = datai.CreatedDate;
                var TotalAmount = rrcw.formatMoney(datai.TotalAmount);
                var data1 = "<div class='date'>{0}</div><div class='time'>{1}</div>";
                var li = "<li id='orderList' detail_id='{8}' class='orderList robList'><div class='top'><div class='left'><div class='leftThree companyName hidden'>{0}</div><div class='leftThree lifeCycle'><div class='key hidden' style='max-width:3.6rem;'>{1}</div><div class='value' style='margin-left:.2rem;'>{2}</div></div><div class='leftThree industry'><div class='key'>公司行业：</div><div class='value hidden' style='max-width:3.2rem;'>{3}</div></div></div><div class='right'><div class='rightThree dateAndTime'>{4}</div><div class='rightThree amountOfMoney'>￥{5}</div><div class='rightThree'><div class='robBtn' onclick='QiangDan(this);event.stopPropagation();' detail_id='{6}'>抢&nbsp;&nbsp;&nbsp;单</div></div></div></div><div class='bottom'><div class='businessAddress'><div class='keys'>经营地点：</div><div class='values'>{7}</div></div></div><div style='clear:both'></div></li>";
                data1 = rrcw.StringFormat(data1, renrenc.GetData(CreatedDate), renrenc.GetHour(CreatedDate));
                var DetailId = datai.Id;
                var CompanyName = datai.CompanyName;
                var ProductName = datai.ProductName;
                var LimitName = datai.LimitName;
                switch(LimitName){
                    case null:
                        LimitName = "";
                        break;
                    case "年":
                        LimitName = "一年";
                        break;
                    case "季":
                        LimitName = "季度";
                        break;
                }
                var Industry = datai.Industry;
                var BusAddressInfo = datai.BusAddressInfo;
                var lin = rrcw.StringFormat(li, CompanyName, ProductName, LimitName, Industry, data1, TotalAmount, DetailId, BusAddressInfo, DetailId);
                $("ul.orderUl").append(lin);
            }
            $("ul.orderUl").on("click","#orderList",function(){
                var order_id = $(this).attr("order_id");
                var detail_id = $(this).attr("detail_id");
                window.location.href = "c_orderDetails1.html?detail_id="+detail_id;
            });
        })
    };

    //C端用户抢单
    QiangDan = function (e) {
        var order_detail_id = $(e).attr("detail_id");
        var c_user_id = rrcw.defaultsC.userid;
        var QiangDanJson = {
                "c_user_id":c_user_id,
                "order_detail_id":order_detail_id
            };
        var QiangDanUrl = {
                path:"/PlatApi/GrabOrderV2"
            };
        rrcw.requestSuccessC(QiangDanJson, QiangDanUrl, function (req) {
            console.log("C端用户抢单：",req);
            if (req.Status != 0) {
                //alert("手慢了，订单已被抢走");
                //alert(req.Status);
                //window.location.reload();
            }else{
                alert("恭喜您！抢单成功");
                window.location.href="c_orderList1.html";
            }
        });
    };

    /*2.53	获取业务订单详情(新)*/
    renrenc.GetOrderDetailList = function () {
        var order_detail_id = rrcw.getUrlParam("detail_id");//业务订单Id
        var GetOrderDetailListJson = {
                "order_detail_id":order_detail_id
            };
        var GetOrderDetailListUrl = {
                path:"/PlatApi/GetOrderDetailInfo"
            };
        rrcw.requestSuccessC(GetOrderDetailListJson, GetOrderDetailListUrl, function (req) {
            console.log("获取拆分订单列表 (新)：",req);
            if (req.Status != 0) {
                return false;
            }
            var detail = req.Data.detail;
            var CompanyId = detail.CompanyId;
            var GetCompanyInfoJson = {
                    "id":CompanyId
                };
            var GetCompanyInfoUrl = {
                    path:"/PlatApi/GetCompanyInfo"
                };
            rrcw.requestSuccessC(GetCompanyInfoJson, GetCompanyInfoUrl, function (req) {
                console.log("获取公司信息：",req);
                if (req.Status != 0) {
                    return false;
                }
                var data = req.Data;
                var Id = detail.Id;//业务订单Id
                var CompanyName = detail.CompanyName;
                var ProductName = detail.ProductName;
                var LimitName = detail.LimitName;
                switch(LimitName){
                    case null:
                        LimitName = "";
                        break;
                    case "年":
                        LimitName = "一年";
                        break;
                    case "季":
                        LimitName = "季度";
                        break;
                }
                var TotalAmount = rrcw.formatMoney(detail.TotalAmount);
                var Scope = data.Scope;                         //公司规模
                var Industry = detail.Industry;                 //行业
                var RegAddressInfo = data.RegAddressInfo;       //注册地址
                var BusAddressInfo = detail.BusAddressInfo;     //经营地址
                var TaxationType = detail.TaxationType;         //纳税人种类
                var TaxationTypeName;
                switch(TaxationType){
                    case 1:
                        TaxationTypeName = "小规模纳税人";
                        break;
                    case 2:
                        TaxationTypeName = "一般纳税人";
                        break;
                }
                var order1 = "<li class='orderList top'><div class='left'><div class='leftThree companyName hidden'>{0}</div><div class='leftThree lifeCycle'><div class='keyShort1'>项目：</div><div class='value hidden' style='max-width:3.6rem;'>{1}</div></div><div class='leftThree industry'><div class='key'>服务时间：</div><div class='value'>{2}</div></div></div><div class='right'><div class='rightFour amountOfMoney'>￥{3}</div></div><div style='clear:both'></div></li><li class='orderList bottom'><div class='details'><div class='keys'>公司信息</div><div class='values'>&nbsp;</div></div><div class='details'><div class='keys'>公司规模：</div><div class='values'>{4}</div></div><div class='details'><div class='keys'>公司行业：</div><div class='values'>{5}</div></div><div class='details'><div class='keys'>注册地点：</div><div class='values hidden' style='max-width:5.3rem;'>{6}</div></div><div class='details'><div class='keys'>经营地点：</div><div class='values hidden' style='max-width:5.3rem;'>{7}</div></div><div class='details'><div class='keys'>公司性质：</div><div class='values'>{8}</div></div><div style='clear:both'></div></li>";
                order1 = rrcw.StringFormat(order1,CompanyName,ProductName,LimitName,TotalAmount,Scope,Industry,RegAddressInfo,BusAddressInfo,TaxationTypeName);
                $("ul.orderUl").append(order1);
            });
            $(".robBtnBig").attr("detail_id",order_detail_id);
        });
    };

    /*2.51  C端订单列表(新)*/
    renrenc.GetOrderList = function (status) {
        var GetOrderListJson = {
                "c_user_id":rrcw.defaultsC.userid,
                "order_status":status
            };
        var GetOrderListUrl = {
                path:"/PlatApi/GetOrderDetailListV2"
            };
        rrcw.requestSuccessC(GetOrderListJson, GetOrderListUrl, function (req) {
            console.log("C端订单列表(新):",req);
            if (req.Status != 0) {
                return false;
            }
            var data = req.Data.Data;
            for(var i=0; i<data.length; i++){
                var datai = data[i];
                var li = "<li class='orderList stateList' onclick='OrderClick(this);' order_id='{8}' detail_id='{9}' order_status='{10}'><div class='line'><div class='companyName floatLeft hidden' style='max-width:5.7rem;'>{0}</div><div class='{1} floatRight'>{2}</div></div><div class='line'><div class='floatLeft hidden' style='max-width:3.1rem;'>{3}</div><div class='floatLeft'>（{4}）</div><div class='floatLeft'>{5}</div></div><div class='line'><div class='floatLeft'>订单编号：</div><div class='floatLeft'>{6}</div></div><div class='line'><div class='floatLeft'>订单总额：</div><div class='state1 floatLeft weight'>￥{7}</div></div><div style='clear:both'></div></li>";
                // var li = "<li class='orderList stateList' onclick='OrderClick(this);' order_id='{8}' detail_id='{9}' order_status='{10}'><div class='line'><div class='companyName floatLeft hidden' style='max-width:5.7rem;'>{0}</div><div class='{1} floatRight'>{2}</div></div><div class='line'><div class='floatLeft hidden' style='max-width:3.1rem;'>{3}</div><div class='floatLeft'>（{4}）</div><div class='floatLeft'>{5}</div></div><div class='line'><div class='floatLeft'>订单编号：</div><div class='floatLeft'>{6}</div></div><div class='line'><div class='floatLeft'>订单总额：</div><div class='state1 floatLeft weight'>￥{7}</div></div><div class='progressBarDiv'><div class='progressText'><div class='text text2'>核名</div><div class='text text4'>交付物审核</div><div class='text text6'>办结</div></div><div class='progressBar'><div class='circle circle1'></div><div class='bar bar2'></div><div class='circle circle2'></div><div class='bar bar3'></div><div class='circle circle3'></div><div class='bar bar4'></div><div class='circle circle4'></div><div class='bar bar5'></div><div class='circle circle5'></div><div class='bar bar6'></div><div class='circle circle6'></div></div><div class='progressText'><div class='text text1'>材料收集</div><div class='text text3'>营业执照</div><div class='text text5'>交付物交付</div></div></div><div style='clear:both'></div></li>";
                var CompanyName = datai.CompanyName;
                var OrderStatus = datai.OrderStatus;
                var OrderStatusClass = "state" + OrderStatus;
                var OrderStatusName;
                switch(OrderStatus){
                    case -1:
                        OrderStatusName = "未开始";
                        break;
                    case 0:
                        OrderStatusName = "已完成";
                        break;
                    case 3:
                        OrderStatusName = "服务中";
                        break;
                    case 4:
                        OrderStatusName = "已取消";
                        break;
                    case 5:
                        OrderStatusName = "已终止";
                        break;
                }
                var ProductName = datai.ProductName;
                var DetailId = datai.Id;
                var OrderId = datai.OrderId;
                var TotalAmount = rrcw.formatMoney(datai.TotalAmount);
                var LimitName = datai.LimitName;
                var StartDate = renrenc.GetMonthd(datai.StartDate);
                var EndDate = renrenc.GetMonthd(datai.EndDate);

                var lin = rrcw.StringFormat(li, CompanyName, OrderStatusClass, OrderStatusName, ProductName, LimitName, StartDate + "-" + EndDate, DetailId, TotalAmount, OrderId, DetailId, OrderStatus);
                if(OrderStatus != 4){//隐藏已取消的业务订单
                    $("ul.orderUl").append(lin);
                }
            }
        })
    };

    //进度条函数
    function getProgress(e){
        // 测试数据
        // var Status = new Array(1,1,1,1,3,3);
        // var IsOnTime = new Array(true,false,false,true,true,true);
        var Status = new Array(6);
        var IsOnTime = new Array(6);
        for(var m=0; m<6; m++){
            Status[m] = e[m].Status;
            IsOnTime[m] = e[m].IsOnTime;
            console.log((m+1)+" --- "+Status[m]+" --- "+IsOnTime[m]);
            if(Status[m] == 1){//成功
                IsOnTime[m] == true?$(".circle"+(m+1)).addClass("green"):$(".circle"+(m+1)).addClass("orange");
                $(".bar"+(m+1)).removeClass("greenTo").addClass("greenAll");
            }else if((Status[m] == 2 || Status[m] == 3) && Status[m-1] == 1){//从左往右检索Status数组，找出第一个“3”所属的阶段，为该阶段的上一阶段的div.bar设置渐变样式。
                $(".bar"+m).removeClass("greenAll").addClass("greenTo");
            }
        }
        if($(".bar5").hasClass("greenAll")){
            $(this).removeClass("greenTo");
            $(".progressBarDiv .progressBar .successDiv").css("background-image","url(../html/static/images/c/successOn.png)");
        }
    }

    /*第三期 2.10  注册公司跳转的订单列表（c_regComOrderList.html）*/
    renrenc.GetRegComOrderList = function (status) {
        var GetRegComOrderListJson = {
                "userid": rrcw.defaultsC.userid,
                "pageindex": 1,
                "pagesize": 50,
                "orderstatus": status
            };
        var GetRegComOrderListUrl = {
                path:"/ThirdPeriod/GetOrderList2"
            };
        rrcw.requestSuccessC(GetRegComOrderListJson, GetRegComOrderListUrl, function (req) {
            console.log("注册公司跳转的订单列表:",req);
            if (req.Status != 0) {
                return false;
            }
            var list = req.Data.List;
            var BaseInfo = new Array(list.length);
            var StageInfo = new Array(list.length);
            var PayStatus = new Array(list.length);
            for(var i=0; i<list.length; i++){
                BaseInfo[i] = list[i].BaseInfo;
                StageInfo[i] = list[i].StageInfo;
                PayStatus[i] = BaseInfo[i].PayStatus;
                var CompanyName;
                if(BaseInfo[i].RealCompanyName){
                    CompanyName = BaseInfo[i].RealCompanyName;
                }else{
                    CompanyName = BaseInfo[i].CompanyName.split(",")[0] + "<span> (待核)</span>";
                }
                var GoodsName = BaseInfo[i].GoodName;
                var Status = BaseInfo[i].Status;
                var OrderStatusClass = "state" + Status;
                var OrderStatusName = "";
                switch(Status){
                    case 1:
                    case 2:
                    case 3:
                        OrderStatusName = "未开始";
                        break;
                    case 4:
                        OrderStatusName = "服务中";
                        break;
                    case 5:
                    case 7:
                        OrderStatusName = "已完成";
                        break;
                    case 6:
                        OrderStatusName = "已终止";
                        break;
                    case 8:
                        OrderStatusName = "已结算";
                        break;
                    case 9:
                        OrderStatusName = "待确认";
                        break;
                    case 10:
                        OrderStatusName = "已取消";
                        break;
                }

                var statusOfPay;
                if(StageInfo[i][2].Status == 1){
                    if(PayStatus[i] != 3){
                        statusOfPay = "等待客户付款";
                    }else{
                        statusOfPay = "客户已完成付款";
                    }
                }else{
                    statusOfPay = "";
                }

                var StartDate,EndDate;
                BaseInfo[i].StartDate == null ? StartDate = "" : StartDate = renrenc.GetMonthd(BaseInfo[i].StartDate)+"-";
                BaseInfo[i].EndDate == null ? EndDate = "" : EndDate = renrenc.GetMonthd(BaseInfo[i].EndDate);
                var Id = BaseInfo[i].Id;
                var TotalAmount = rrcw.formatMoney(BaseInfo[i].Amount);


                var li = "<li class='orderList stateList' onclick='RegComClick(this);' order_id='{8}'><div class='line'><div class='companyName floatLeft hidden' style='max-width:6.5rem;'>{0}</div><div class='{1} floatRight'>{2}</div></div><div class='line'><div class='floatLeft'>" + GoodsName + "：</div><div class='floatLeft'>{3}{4}</div></div><div class='line'><div class='floatLeft'>订单编号：</div><div class='floatLeft orderId'>{5}</div></div><div class='line'><div class='floatLeft'>订单总额：</div><div class='state1 floatLeft weight'>￥{6}</div><div class='state4 floatRight'>{7}</div></div><div id='progressBarDiv" + i + "' class='progressBarDiv'><div class='progressText'><div class='text text2'>核名</div><div class='text text4'>交付物审核</div><div class='text text6'>办结</div></div><div class='progressBar'><div class='circle circle1'></div><div class='bar bar1'></div><div class='circle circle2'></div><div class='bar bar2'></div><div class='circle circle3'></div><div class='bar bar3'></div><div class='circle circle4'></div><div class='bar bar4'></div><div class='circle circle5'></div><div class='bar bar5'></div><div class='successDiv'></div></div><div class='progressText'><div class='text text1'>材料收集</div><div class='text text3'>营业执照</div><div class='text text5'>交付物交付</div></div></div><div style='clear:both'></div></li>";
                var lin = rrcw.StringFormat(li, CompanyName, OrderStatusClass, OrderStatusName, StartDate, EndDate, Id, TotalAmount, statusOfPay, Id);
                // if(Status != 4){//隐藏已取消的业务订单
                    $("ul.orderUl").append(lin);
                // }
                console.log("\n"+CompanyName);
                var status = new Array(6);
                var IsOnTime = new Array(6);
                for(var m=0; m<6; m++){
                    status[m] = (StageInfo[i])[m].Status;
                    IsOnTime[m] = (StageInfo[i])[m].IsOnTime;
                    console.log((m+1)+" --- "+status[m]+" --- "+IsOnTime[m]);
                    if(status[m] == 1){//成功
                        IsOnTime[m] == true ? $("#progressBarDiv" + i + " .circle"+(m+1)).addClass("green") : $("#progressBarDiv" + i + " .circle"+(m+1)).addClass("orange");
                        $("#progressBarDiv" + i + " .bar"+(m+1)).removeClass("greenTo").addClass("greenAll");
                    }else if((status[m] == 2 || status[m] == 3) && status[m-1] == 1){//从左往右检索Status数组，找出第一个“3”所属的阶段，为该阶段的上一阶段的div.bar设置渐变样式。
                        $("#progressBarDiv" + i + " .bar"+m).removeClass("greenAll").addClass("greenTo");
                    }
                }
                if($("#progressBarDiv" + i + " .bar5").hasClass("greenAll")){
                    $(this).removeClass("greenTo");
                    $("#progressBarDiv" + i + " .progressBar .successDiv").css("background-image","url(../html/static/images/c/successOn.png)");
                }
            }
        })
    };

    //C端订单列表点击事件
    OrderClick = function (e) {
        var order_id = $(e).attr("order_id");
        var detail_id = $(e).attr("detail_id");
        var order_status = $(e).attr("order_status");
        location.href = "c_orderList2.html?order_id=" + order_id + "&detail_id=" + detail_id + "&order_status=" + order_status;
    };

    //C端(注册公司)订单列表点击事件
    RegComClick = function (e) {
        var order_id = $(e).attr("order_id");
        location.href = "c_orderDetails3.html?order_id=" + order_id;
    };

    //2.53	获取业务订单详情
    renrenc.GetOrderDetailInfo = function () {
        var detail_id = rrcw.getUrlParam("detail_id");
        var order_status = rrcw.getUrlParam("order_status");
        var GetOrderDetailInfoJson = {
                "order_detail_id":detail_id
            };
        var GetOrderDetailInfoUrl = {
                path:"/PlatApi/GetOrderDetailInfo"
            };
        rrcw.requestSuccessC(GetOrderDetailInfoJson, GetOrderDetailInfoUrl, function (req) {
            console.log("获取业务订单详情：",req);
            if (req.Status != 0) {
                return false;
            }
            var data = req.Data.split;
            for(var i=0; i<data.length; i++) {
                var datai = data[i];
                var li = "<li class='{0}' onclick=GetOrderSplitListClick(this) split_id='{3}'><div class='floatLeft'><div class='orderNum'></div><div class='value'>{1}</div></div><div class='floatRight'><div class='date'>{2}</div><div class='extend'><img src='static/images/c/extend.png' alt='>'/></div></div></li>";
                var SplitId = datai.Id;
                var OrderStatus = datai.OrderStatus;
                var OrderStatusClass;
                if(OrderStatus == 0){
                    OrderStatusClass = "colorred";
                }
                var ServiceDate = datai.ServiceDate.toString();//接口返回的日期是整型，将其转化成字符串
                var ServiceDate1 = ServiceDate.substring(0,4)+"/"+ServiceDate.substring(4);
                var lin = rrcw.StringFormat(li,OrderStatusClass,SplitId,ServiceDate1,SplitId);
                $("ul.liHeight100").append(lin);
            }
            if(order_status == 0 || order_status == 4 || order_status == 5){//这些状态（0已完成、4已取消、5已终止）的订单都不允许“取消订单”
                $(".cancelOrder").remove();
                $("header").append("<div class='right'></div>");
            }
        })
    };

    //C端获取订单明细列表点击事件
    GetOrderSplitListClick = function (e) {
        var split_id = $(e).attr("split_id");
        location.href = "c_orderDetails2.html?id=" + split_id;
    };

    /*2.49	C端用户取消订单（新）*/
    renrenc.CancelOrder = function () {
        var c_user_id = rrcw.defaultsC.userid,
            order_id = rrcw.getUrlParam("order_id"),
            order_detail_id = rrcw.getUrlParam("detail_id"),
            remark = $("#otherReason").val();
        var CancelOrderJson = {
                "c_user_id":c_user_id,
                "order_detail_id":order_detail_id,
                "remark":remark
            };
        var CancelOrderUrl = {
                path:"/PlatApi/CancelOrderV2"
            };
        rrcw.requestSuccessC(CancelOrderJson, CancelOrderUrl, function (req) {
            if (req.Status != 0) {
                alert("操作失败，无法取消订单！");
            }else{
                var SetOrderLogsJson = {
                        "user_id":c_user_id,
                        "order_id":order_id,
                        "order_log_type":1,
                        "remark":remark
                    };
                var SetOrderLogsUrl = {
                        path:"/PlatApi/SetOrderLogs"
                    };
                rrcw.requestSuccessC(SetOrderLogsJson, SetOrderLogsUrl, function (req) {
                    alert("取消订单成功！");
                    setTimeout(function () {
                        location.href = "c_orderList1.html";
                    },1000);
                });
            }
        })
    };

    /*2.12	修改用户信息*/

    //3、擅长领域
    renrenc.GetUserProperty3 = function () {
        var GetUserPropertyJson = {
                "user_property_type":3
            };
        var GetUserPropertyUrl = {
                path:"/PlatApi/GetUserProperty"
            };
        rrcw.requestSuccessC(GetUserPropertyJson,GetUserPropertyUrl,function (req) {
            if(req.Status==0){
                var data = req.Data;
                for(var i=0; i<data.length; i++){
                    var name = data[i].Name;
                    $("div.itemDiv").append("<div class='item'>" + name + " </div>");
                }
            }
        })
    };

    /*基本信息（1/3）*/
    renrenc.SetUserInfo1 = function() {
        var userId = rrcw.defaultsC.userid,//接收前一页面传来的userId
            name = $("#userName").val(),
            sex = Number($(".sexTrue").next(".sexVal").html()),
            email = $("#email").val(),
            selectAddr = $("#selectAddress").val().split(" "),
            addrDetails = $("#addressDetails").val(),
            advantage = $("#selectid").val();
        var SetUserInfoJson = {
                "id":userId,
                "name":name,
                "nick_name":name,
                "sex":sex,
                "email":email,
                "provice":selectAddr[0],
                "city":selectAddr[1],
                "area":selectAddr[2],
                "address_info":addrDetails,
                "scopes":advantage//擅长领域
            };
        var SetUserInfoUrl = {
                path:"/PlatApi/SetUserInfo"
            };
        rrcw.requestSuccessC(SetUserInfoJson,SetUserInfoUrl,function (req) {
            //console.log("返回信息", req);
            if(req.Status==0){
                window.location.href = "c_essentialInfo2.html?userId=" + userId;
            }
        });
    };

    /*上传图片*/
    renrenc.UploadFile = function(e) {
        var image = $(e).attr("src").split(",");
        if(!image){
            return false;
        }
        var UploadImageJson={
                "image_data":image[1]
            };
        var UploadImageUrl = {
                path:"/PlatApi/UploadImage"
            };
        rrcw.requestSuccessCAsyncFalse(UploadImageJson,UploadImageUrl,function (req) {//同步
            console.log("上传图片：",req);
            if(req.Status==0){
                //console.log("上传图片：",req);
                console.log($(e).attr("id"));
                $(e).attr("obj_id",req.Data.RawUrl);//赋值给obj_id

                //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                var userId = rrcw.defaultsC.userid;//接收前一页面传来的userId
                var totalPath = req.Data.RawUrl;
                var uploadImgJson;
                switch($(e).attr("id")){
                    case "img_a":
                        uploadImgJson = {"id":userId,"card_path_a":totalPath};
                        break;
                    case "img_b":
                        uploadImgJson = {"id":userId,"card_path_b":totalPath};
                        break;
                    case "img_c":
                        uploadImgJson = {"id":userId,"accountant_path":totalPath};
                        break;
                    case "img_d":
                        uploadImgJson = {"id":userId,"professional_path":totalPath};
                        break;
                }
                var uploadImgUrl = {
                        path:"/PlatApi/SetUserInfo"
                    };
                rrcw.requestSuccessC(uploadImgJson,uploadImgUrl,function (req) {
                    if(req.Status==0){
                        console.log($(e).prev().prev().children("input").attr("id")+"上传成功！");
                        $.ajax({
                            success:function loading(){
                                layer.open({
                                    type:2,
                                    content:"正在上传图片",
                                    time:1
                                });
                                window.location.reload();//刷新当前页面.
                            }
                        });
                    }
                });

                //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

            }
        });
    };

    /*删除图片*/
    renrenc.DeleteFile = function(e) {
        var userId = rrcw.defaultsC.userid;
        var SetUserInfoJson;
        switch(e){
            case "card_path_a":
                SetUserInfoJson = {"id":userId,"card_path_a":""};
                break;
            case "card_path_b":
                SetUserInfoJson = {"id":userId,"card_path_b":""};
                break;
            case "accountant_path":
                SetUserInfoJson = {"id":userId,"accountant_path":""};
                break;
            case "professional_path":
                SetUserInfoJson = {"id":userId,"professional_path":""};
                break;
        }
        var SetUserInfoUrl = {
                path:"/PlatApi/SetUserInfo"
            };
        rrcw.requestSuccessC(SetUserInfoJson,SetUserInfoUrl,function (req) {
            if(req.Status==0){
                console.log(e+"删除成功！");
                alert("删除成功！");
            }
        });
    };

    //4、工作年限
    renrenc.GetUserProperty = function (context,type) {
        var GetUserPropertyJson = {
                "user_property_type":type
            };
        var GetUserPropertyUrl = {
                path:"/PlatApi/GetUserProperty"
            };
        rrcw.requestSuccessC(GetUserPropertyJson,GetUserPropertyUrl,function (req) {
            var new_data = [];
            if(req.Status == 0){
                var data = req.Data;
                $.each(data, function (i,size) {
                    new_data.push({"key":size.Name,"display":size.Name});
                });
                c_mobScroll(context,new_data);
            }
        })
    };
    //5、延迟申请天数
    renrenc.GetExtensionDay = function () {
        c_mobScroll("#selectid7",["1天","2天","3天","4天","5天","6天","7天"]);
    };
    //6、注册公司候选企业名称
    renrenc.GetCompanyName = function () {
        var id = rrcw.getUrlParam("order_id");
        var GetOrderDetail2Json = {
                "userid": rrcw.defaultsC.userid,
                "orderid": id
            };
        var GetOrderDetail2Url = {
                path: "/ThirdPeriod/GetOrderDetail2"
            };
        rrcw.requestSuccessC(GetOrderDetail2Json,GetOrderDetail2Url,function (req) {
            if(req.Status == 0){
                var comNameSplit = req.Data.RegComInfo.CompanyName.split(",");
                for(var i=0; i<comNameSplit.length; i++){
                    if(comNameSplit[i] == "" || typeof(comNameSplit[i]) == "undefined"){
                        comNameSplit.splice(i,1);
                        i= i-1;
                    }
                }
                c_mobScroll("#selectid6",comNameSplit);
            }
        })
    };
    /*表单自动赋默认值*/
    renrenc.GetUserinfoValue = function() {
        var userId = rrcw.defaultsC.userid;
        var GetUserInfoJson = {
                "id":userId,
                "user_type":1
            };
        var GetUserInfoUrl = {
                path:"/PlatApi/GetUserInfo"
            };
        rrcw.requestSuccessC(GetUserInfoJson,GetUserInfoUrl,function (req) {
            if(req.Status==0) {
                console.log("自动赋值：",req);
                var data = req.Data;
                var extend = req.Extend;
                $("#userName").val(data.Name);
                data.Sex==true?$(".female").children(".sexIcon").addClass("femaleIcon sexTrue"):$(".male").children(".sexIcon").addClass("maleIcon sexTrue");
                $("#email").val(data.Email);
                $("#idNumber").val(data.Card);
                //$("#cardNumber").val(data.Remark);
                if(!extend){
                    return false;
                }
                $("#cardNumber").val(extend.AccountantNo);
                //$("#selectAddress").val(extend.Provice + " " + extend.City + " " + extend.Area);
                $("#selectAddress").val() == "null "?$("#selectAddress").val(""):$("#selectAddress").val(extend.Provice + " " + extend.City + " " + extend.Area);
                $("#addressDetails").val(extend.AddressInfo);
                $("#selectid").val(extend.Scopes);
                $("#selectid1").html(extend.Professional||"请选择");
                $("#selectid2").html(extend.Education||"请选择");
                $("#selectid4").html(extend.Worklimit||"请选择");

                //身份证正面照片+身份证反面照片+身份证扫描件+技术职称证书扫描件

                if(req.Extend.CardPathA){
                    var contenthtml1 = "<span class='card-upbox-btn-1 hide'><input type='file' name='pic' accept='image' id='card_path_a' class='uploadFileBtn'/><div class='uploadImgDiv'><div class='uploadImg1'><img src='static/images/c/uploadImg.png' alt=''/></div><div class='uploadImgText'>拍照上传</div></div></span><a href='javascript:;' class='card_del_a'><div class='deleteImgDiv'>删除</div></a><img id='img_a' src='' class='upload-card-img' obj_id=''>";
                    $("#card_upbox_a").html(contenthtml1);
                    $("#img_a").attr({"src":req.Extend.CardPathA,"obj_id":req.Extend.CardPathA});//赋值给obj_id
                }
                if(req.Extend.CardPathB){
                    var contenthtml2 = "<span class='card-upbox-btn-1 hide'><input type='file' name='pic' accept='image' id='card_path_b' class='uploadFileBtn'/><div class='uploadImgDiv'><div class='uploadImg1'><img src='static/images/c/uploadImg.png' alt=''/></div><div class='uploadImgText'>拍照上传</div></div></span><a href='javascript:;' class='card_del_b'><div class='deleteImgDiv'>删除</div></a><img id='img_b' src='' class='upload-card-img' obj_id=''>";
                    $("#card_upbox_b").html(contenthtml2);
                    $("#img_b").attr({"src":req.Extend.CardPathB,"obj_id":req.Extend.CardPathB});
                }
                if(req.Extend.AccountantPath){
                    var contenthtml3 = "<span class='card-upbox-btn-1 hide'><input type='file' name='pic' accept='image' id='card_path_c' class='uploadFileBtn'/><div class='uploadImgDiv'><div class='uploadImg1'><img src='static/images/c/uploadImg.png' alt=''/></div><div class='uploadImgText'>拍照上传</div></div></span><a href='javascript:;' class='card_del_c'><div class='deleteImgDiv'>删除</div></a><img id='img_c' src='' class='upload-card-img' obj_id=''>";
                    $("#card_upbox_c").html(contenthtml3);
                    $("#img_c").attr({"src":req.Extend.AccountantPath,"obj_id":req.Extend.AccountantPath});
                }
                if(req.Extend.ProfessionalPath){
                    var contenthtml4 = "<span class='card-upbox-btn-1 hide'><input type='file' name='pic' accept='image' id='card_path_d' class='uploadFileBtn'/><div class='uploadImgDiv'><div class='uploadImg1'><img src='static/images/c/uploadImg.png' alt=''/></div><div class='uploadImgText'>拍照上传</div></div></span><a href='javascript:;' class='card_del_d'><div class='deleteImgDiv'>删除</div></a><img id='img_d' src='' class='upload-card-img' obj_id=''>";
                    $("#card_upbox_d").html(contenthtml4);
                    $("#img_d").attr({"src":req.Extend.ProfessionalPath,"obj_id":req.Extend.ProfessionalPath});
                }


                if($("#card_upbox_a").length > 0){//判断当前页面是否是基本信息（2/3）
                    document.getElementById("card_path_a").addEventListener("change",readFile,false);
                    document.getElementById("card_path_b").addEventListener("change",readFile,false);
                    document.getElementById("card_path_c").addEventListener("change",readFile,false);
                }
                if($("#card_upbox_d").length > 0){//判断当前页面是否是基本信息（3/3）
                    document.getElementById("card_path_d").addEventListener("change",readFile,false);
                }

                function readFile(){
                    $.ajax({
                        success:function loading(){
                            layer.open({
                                type:2,
                                content:"正在上传图片",
                                time:1
                            });
                        }
                    });
                    var id = ($(this).attr("id"));
                    var file = this.files[0];
                    //这里判断一下类型，如果不是图片就返回，去掉就可以上传任意文件。
                    if(!/image\/\w+/.test(file.type)){
                        alert("请确保文件为图像类型");
                    }else{
                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = function(e){
                            $("#"+id).parent().next().next().attr("src",this.result).removeClass("hide");
                            $("#"+id).parent().next().removeClass("hide");
                            $("#"+id).parent().hide();
                            var image_data = this.result.split(",")[1];
                            renrenc.UploadFile($("#"+id).parent().next().next());
                            if(id == "card_path_d"){
                                var userId = rrcw.defaultsC.userid,
                                    professional = $("#selectid1").html(),
                                    education = $("#selectid2").html(),
                                    worklimit = $("#selectid4").html();
                                var SetUserInfoJson = {
                                    "id":userId,
                                    "professional":professional,               //技术职称
                                    "education":education,                     //最高学历
                                    "work_limit":worklimit                     //工作年限
                                };
                                var SetUserInfoUrl = {
                                    path:"/PlatApi/SetUserInfo"
                                };
                                rrcw.requestSuccessC(SetUserInfoJson,SetUserInfoUrl,function (req) {});
                            }
                        }
                    }
                }

                $(".card_del_a,.card_del_b,.card_del_c,.card_del_d").click(function(){
                    $(this).next().attr("src","").addClass("hide");
                    $(this).addClass("hide");
                    $(this).prev().removeClass("hide");
                    //renrenc.DeleteFile("card_path_a");
                    alert("删除成功！");
                });
            }
        });
    };

    renrenc.goToRegister = function(){
        if(!rrcw.defaultsC.userid){
            window.location.href="c_boundPhone.html";
        }
    };

    //根据状态跳转到不同页面
    renrenc.goTo = function(e){
        var userId = rrcw.defaultsC.userid;
        if(!userId){
            window.location.href = "c_checkIdentity.html";
        }
        switch (e) {
            case -1:
                //console.log("状态：初始");
                window.location.href = "c_essentialInfo1.html?userId=" + userId;
                break;
            case 0:
                //console.log("状态：完成注册");
                window.location.href = "c_completeRegistration.html?userId=" + userId;
                break;
            case 1:
                //console.log("状态：证件审核通过");
                window.location.href = "c_beingTest.html?userId=" + userId;
                break;
            case 2:
                //console.log("状态：证件审核未通过");
                window.location.href = "c_failCheck.html?userId=" + userId;
                break;
            case 3:
                //console.log("状态：考试通过");
                window.location.href = "c_beingTrain.html?userId=" + userId;
                break;
            case 4:
                //console.log("状态：考试未通过");
                window.location.href = "c_failTest.html?userId=" + userId;
                break;
            case 5:
                //console.log("状态：审批通过");
                window.location.href = "c_passTrain.html?userId=" + userId;
                break;
            case 6:
                //console.log("状态：审批未通过");
                window.location.href = "c_failTrain.html?userId=" + userId;
                break;
            default:
                window.location.href = "c_checkIdentity.html";
        }
    };

    /*2.13  获取用户信息*/
    renrenc.GetUserInfo = function() {
        var userId = rrcw.defaultsC.userid;
        var GetUserInfoJson = {
                "id":userId,
                "user_type":1
            };
        var GetUserInfoUrl = {
                path:"/PlatApi/GetUserInfo"
            };
        rrcw.requestSuccessC(GetUserInfoJson,GetUserInfoUrl,function (req) {
            if(req.Status==0) {
                //console.log(req);
                var user_status = req.Data.UserStatus;
                renrenc.goTo(user_status);
            }
        });
    };

    //解决后端推送（关于用户审核阶段）消息链接错误的问题
    renrenc.passTrainAutoRefresh = function() {
        var userId = rrcw.defaultsC.userid;
        var GetUserInfoJson = {
            "id": userId,
            "user_type": 1
        };
        var GetUserInfoUrl = {
            path: "/PlatApi/GetUserInfo"
        };
        rrcw.requestSuccessC(GetUserInfoJson, GetUserInfoUrl, function (req) {
            console.log("塑性通过：", req);
            if (req.Status == 0) {
                var user_status = req.Data.UserStatus;
                if (user_status != 5) {
                    renrenc.goTo(user_status);
                } else {
                    return false;
                }
            }
        });
    };

    //（获取）用户状态
    renrenc.GetUserStatus = function() {
        var userId = rrcw.defaultsC.userid;
        if(userId == null){
            return false;
        }else{
            var GetUserInfoJson = {
                    "id":userId,
                    "user_type":1
                };
            var GetUserInfoUrl = {
                    path:"/PlatApi/GetUserInfo"
                };
            rrcw.requestSuccessC(GetUserInfoJson,GetUserInfoUrl,function (req) {
                if(req.Status==0) {
                    var user_status = req.Data.UserStatus;
                    if(user_status != 5){
                        renrenc.goTo(user_status);
                    }
                }
            });
        }
    };


    /*2.14  获取用户工作经历*/
    renrenc.GetUserWorksList = function() {
        function splitTime(time){
            var time1=parseInt(time.split("(")[1].split(")")[0]);
            return new Date(time1).pattern("yyyy/MM");
        }
        var userId = rrcw.defaultsC.userid;
        var GetUserWorksListJson = {
                "user_id":userId
            };
        var GetUserWorksListUrl = {
                path:"/PlatApi/GetUserWorksList"
            };
        rrcw.requestSuccessC(GetUserWorksListJson,GetUserWorksListUrl,function (req) {
            if(req.Status==0) {
                //console.log("返回信息", req);
                var data = req.Data;
                var contenthtml = "";
                for(var i=0; i<data.length; i++){
                    var position = data[i].Position,
                        startDate = data[i].StartDate,
                        endDate = data[i].EndDate,
                        companyName = data[i].Name;
                    var startTime = splitTime(startDate),
                        endTime = splitTime(endDate),
                        id = data[i].Id;
                    contenthtml += "<li class='workExperienceLi'>" +
                        "<div class='information'>" +
                        "<div class='dotDiv'>" +
                        "<div class='dot'></div>" +
                        "</div>" +
                        "<div class='info'>" +
                        "<div class='info1'>" + position + "</div>" +
                        "<div class='info2'>" + startTime + "-" + endTime + "</div>" +
                        "<div class='info3'>" + companyName + "</div>" +
                        "</div>" +
                        "</div>" +
                        "<div class='operation'>" +
                        "<div id='updateExp' class='update' onclick='updateExperienceClick(this)' obj_id='" + id + "' obj_parameter='" + companyName + "," + position + "," + startTime + "," + endTime + "'>" +
                        "<div class='icon updateIcon'></div>" +
                        "<div class='text updateText'>修改</div>" +
                        "</div>" +
                        "<div class='delete deleteWorkExperience' onclick='deleteExperienceClick(this)' obj_id='" + id + "'>" +
                        "<div class='icon deleteIcon'></div>" +
                        "<div class='text deleteText'>删除</div>" +
                        "</div>" +
                        "</div>" +
                        "</li>";
                }
                $("ul.workExperienceUl").html(contenthtml);
            }
        });
    };

    //修改经历
    updateExperienceClick = function(e) {
        renrenc.SetUserInfo3FirstFour();//点击“修改”的时候把上面填入的“前四项”信息保存
        var userId = rrcw.defaultsC.userid,
            ids = $(e).attr("obj_id"),
            parameters = $(e).attr("obj_parameter");
        //删除用户工作经历
        renrenc.DelUserWorksInfo = function() {
            var DelUserWorksInfoJson = {
                    "id":ids
                };
            var DelUserWorksInfoUrl = {
                    path:"/PlatApi/DelUserWorksInfo"
                };
            rrcw.requestSuccessC(DelUserWorksInfoJson,DelUserWorksInfoUrl,function (req) {
                if(req.Status==0){
                    window.location.href = "c_workExperience.html?userId="+userId+"&id="+ids+"&parameters="+parameters+"&remark=update";
                }
            });
        };
        renrenc.DelUserWorksInfo();
    };

    //删除经历
    deleteExperienceClick = function(e) {
        var ids = $(e).attr("obj_id");
        //删除用户工作经历
        renrenc.DelUserWorksInfo = function() {
            var DelUserWorksInfoJson = {
                    "id":ids
                };
            var DelUserWorksInfoUrl = {
                    path:"/PlatApi/DelUserWorksInfo"
                };
            rrcw.requestSuccessC(DelUserWorksInfoJson,DelUserWorksInfoUrl,function (req) {
                if(req.Status==0){
                    alert("删除成功！");
                }
            });
        };
        renrenc.DelUserWorksInfo();
        $(e).parent().parent().remove();
    };

    /*2.15  添加(保存)用户工作经历*/
    renrenc.SetUserWorksInfo = function() {
        var userId = rrcw.defaultsC.userid,
            companyName = $("#companyName").val(),
            position = $("#position").val(),
            startDate = $("#selectDate1").val(),
            endDate = $("#selectDate2").val();
        var SetUserWorksInfoJson = {
                "user_id":userId,
                "name":companyName,
                "position":position,
                "start_date":startDate,
                "end_date":endDate
            };
        var SetUserWorksInfoUrl = {
                path:"/PlatApi/SetUserWorksInfo"
            };
        rrcw.requestSuccessC(SetUserWorksInfoJson,SetUserWorksInfoUrl,function (req) {
            if(req.Status==0) {
                //console.log("返回信息", req);
                alert("经历保存成功！");
                window.location.href = "c_essentialInfo3.html?userId=" + userId;
            }
        });
    };

    /*基本信息（3/3）*/
    renrenc.SetUserInfo3 = function() {
        $("#essentialInfo3Submit").attr("value","数据上传中，请稍候");
        var userId = rrcw.defaultsC.userid,
            professional = $("#selectid1").html(),
            //professional_path = $("#img_d").attr("obj_id"), //（此行代码可有可无，选好图片时已经上传过了）
            education = $("#selectid2").html(),
            worklimit = $("#selectid4").html();

        var SetUserInfoJson = {
                "id":userId,
                "professional":professional,               //技术职称
                //"professional_path":professional_path,     //技术职称证书扫描件（此行代码可有可无，选好图片时已经上传过了）
                "education":education,                     //最高学历
                "work_limit":worklimit,                    //工作年限
                "user_status":0                            //将状态改为注册成功
            };
        var SetUserInfoUrl = {
                path:"/PlatApi/SetUserInfo"
            };
        rrcw.requestSuccessC(SetUserInfoJson,SetUserInfoUrl,function (req) {
            if(req.Status==0) {
                window.location.href = "c_workExperience.html?userId=" + userId;
                window.location.href = "c_completeRegistration.html?userId=" + userId;
            }
        });
    };

    /*添加经历前先保存基本信息（3/3）的前四项*/
    renrenc.SetUserInfo3FirstFour = function() {
        var userId = rrcw.defaultsC.userid,
            professional = $("#selectid1").html(),
            //professional_path = $("#img_d").attr("obj_id"),     //（此行代码可有可无，选好图片时已经上传过了）
            education = $("#selectid2").html(),
            worklimit = $("#selectid4").html();
        var SetUserInfoJson = {
                "id":userId,
                "professional":professional,               //技术职称
                //"professional_path":professional_path,     //技术职称证书扫描件（此行代码可有可无，选好图片时已经上传过了）
                "education":education,                     //最高学历
                "work_limit":worklimit                     //工作年限
            };
        var SetUserInfoUrl = {
                path:"/PlatApi/SetUserInfo"
            };
        rrcw.requestSuccessC(SetUserInfoJson,SetUserInfoUrl,function (req) {
        });
    };

    /*c_myInformation.html修改信息*/
    renrenc.SetMyInfo = function() {
        var userId = rrcw.defaultsC.userid;
        var name = $("#CName1").val();
        if(name == ""){
            alert("请填写姓名");
            return false;
        }else if(!/^[\u4e00-\u9fa5]+$/.test(name)){
            alert("便于统一管理\n请输入中文姓名");
            return false;
        }else{
            var SetUserInfoJson = {
                "id":userId,
                "user_type":1,
                "name":name,
                "nick_name":name
            };
            var SetUserInfoUrl = {
                path:"/PlatApi/SetUserInfo"
            };
            rrcw.requestSuccessC(SetUserInfoJson,SetUserInfoUrl,function (req) {
                console.log("信息：",req);
                if(req.Status==0) {
                    alert("保存成功！");
                    window.location.href = "c_my.html";
                }
            });
        }
    };

    /*获取的信息*/
    renrenc.GetMyInfo = function() {
        var userId = rrcw.defaultsC.userid;
        var SetUserInfoJson = {
                "id":userId,
                "user_type":1
            };
        var SetUserInfoUrl = {
                path:"/PlatApi/GetUserInfo"
            };
        rrcw.requestSuccessC(SetUserInfoJson,SetUserInfoUrl,function (req) {
            console.log("信息：",req);
            if(req.Status==0) {
                var name = req.Data.Name;
                var picurl = req.Data.IconPath;
                $("#CName").html(name);
                $("#CUserIcon").attr("src", picurl);
            }
        });
    };

    //2.34	设置拆分订单状态
    renrenc.SetOrderSplitStatus = function () {
        var order_split_id = $("#ordersplitid").html(),
            userId = rrcw.defaultsC.userid;
        var SetOrderSplitStatusJson = {
                "order_split_id":order_split_id,       //拆分订单标识
                "c_user_id":userId,                    //C端用户标识
                "order_status":1                       //订单状态
            };
        var SetOrderSplitStatusUrl = {
                path:"/PlatApi/SetOrderSplitStatus"
            };
        rrcw.requestSuccessC(SetOrderSplitStatusJson, SetOrderSplitStatusUrl, function (req) {
            console.log("信息：",req);
            if(req.Status==0) {
                alert("提交成功！");
                window.location.href = "c_orderList1.html";
            }
        });
    };

    //C端获取拆分订单详细
    renrenc.GetOrderSplitDetail = function () {
        var split_id = rrcw.getUrlParam("id");
        var GetOrderSplitInfoJson = {
                "order_split_id":split_id
            };
        var GetOrderSplitInfoUrl = {
                path:"/PlatApi/GetOrderSplitInfo"
            };
        rrcw.requestSuccessC(GetOrderSplitInfoJson, GetOrderSplitInfoUrl, function (req) {
            console.log("C端获取拆分订单详细：",req);
            if(req.Status != 0) {
                return false;
            }
            var order = req.Data.order;
            var detail = req.Data.detail;
            var company = req.Data.company;
            var split = req.Data.split;
            //第一部分订单信息
            var OrderId = split.Id;
            var CompanyName = order.CompanyName;
            var GoodsName = order.GoodsName;
            var ServiceDate = split.ServiceDate.toString();
            var ServiceDate1 = ServiceDate.substring(0,4)+"/"+ServiceDate.substring(4);
            var TotalAmount = rrcw.formatMoney(split.TotalAmount);
            var OrderStatus = split.OrderStatus;
            var OrderStatusName;
            switch(OrderStatus){
                case -1:
                    OrderStatusName = "未开始";
                    break;
                case 0:
                    OrderStatusName = "服务中";
                    $("#orderDetails2Btn").css("display","block");
                    break;
                case 1:
                case 2:
                    OrderStatusName = "待确认";
                    break;
                case 3:
                case 4:
                case 8:
                    OrderStatusName = "已完成";
                    break;
                case 5:
                case 6:
                    OrderStatusName = "已结算";
                    break;
                case 7:
                    OrderStatusName = "已终止";
                    break;
            }
            var li1 = "<li class='orderList top'><div class='left'><div class='leftThree lifeCycle'><div class='orderNum'></div><div id='ordersplitid' class='value'>{0}</div></div><div class='leftThree companyName hidden'>{1}</div><div class='leftThree lifeCycle'><div class='keyShort1'>项目：</div><div class='value'>{2}</div></div></div><div class='right_1'><div class='alignRight dateSimple'>{3}</div><div class='alignRight amountOfMoney'>￥{4}</div><div class='alignRight beingServed'>{5}</div></div><div style='clear:both'></div></li>";
            var lin1 = rrcw.StringFormat(li1,OrderId,CompanyName,GoodsName,ServiceDate1,TotalAmount,OrderStatusName);
            $("ul.orderUl").append(lin1);

            //第二部分订单联系人
            company.Contacts == null?Contacts = "无":Contacts = company.Contacts;
            company.Phone == null?Phone = "无":Phone = company.Phone;
            var li2 ="<li class='orderList middle'><div class='details'><div class='keyShort2'>联系人：</div><div class='values'>{0}</div></div><div class='details'><div class='keys'>联系电话：</div><div class='values telNumber'><a href='tel:{1}'>{1}</a></div></div><div style='clear:both'></div></li>";
            var lin2 = rrcw.StringFormat(li2,Contacts,Phone);
            $("ul.orderUl").append(lin2);
            if(!company.Phone){
                $(".telNumber a").on("click",function(){
                    return false;
                });
            }

            //第三部分折分公司信息
            var CompanyInfo;
            if(detail.CUesrId == split.CUesrId){
                CompanyInfo = "<div class='values'>&nbsp;</div>";
                console.log("detail.CUesrId = split.CUesrId 指派给我服务的");
            }else{
                CompanyInfo="<div class='alignRight colorOrange fontSize20'>*非本人服务</div>";console.log("detail.CUesrId != split.CUesrId 别人服务的");
            }
            var Scope = company.Scope;
            var Industry = company.Industry;
            var RegAddressInfo = company.RegAddressInfo;
            var BusAddressInfo = company.BusAddressInfo;
            var TaxationType = company.TaxationType;
            var TaxationTypeName;
            switch(TaxationType){
                case 1:
                    TaxationTypeName = "小规模纳税人";
                    break;
                case 2:
                    TaxationTypeName = "一般纳税人";
                    break;
            }
            var li3 = "<li class='orderList bottom'>"+
            "<div class='details' style='display:block;height:.5rem;'><div class='keys'>公司信息</div>{0}</div>"+
            "<div class='details'><div class='keys'>公司规模：</div><div class='values'>{1}</div></div>"+
            "<div class='details'><div class='keys'>公司行业：</div><div class='values'>{2}</div></div>"+
            "<div class='details'><div class='keys'>注册地点：</div><div class='values hidden' style='max-width:5.3rem;'>{3}</div></div>"+
            "<div class='details'><div class='keys'>经营地点：</div><div class='values hidden' style='max-width:5.3rem;'>{4}</div></div>"+
            "<div class='details'><div class='keys'>公司性质：</div><div class='values'>{5}</div></div>"+
            "<div style='clear:both'></div>"+
            "</li>";
            var lin3 = rrcw.StringFormat(li3,CompanyInfo,Scope,Industry,RegAddressInfo,BusAddressInfo,TaxationTypeName);
            $("ul.orderUl").append(lin3);

            //第四部分结算
            if(OrderStatus == 5 && detail.CUesrId == split.CUesrId){
                var SettleAmount = rrcw.formatMoney(split.SettleAmount);
                var Remark = split.Remark=="" || split.Remark==null ? "" : split.Remark;
                var li4 = "<li class='orderList foot'>"+
                "<div class='details'><div class='keys'>结算金额：</div><div class='finalMoney'>￥{0}</div></div>"+
                "<div class='details'><div class='keyShort1'>备注：</div><div class='valuesLong'>{1}</div></div>"+
                "<div style='clear:both'></div>"+
                "</li>";
                var lin4 = rrcw.StringFormat(li4,SettleAmount,Remark);
                $("ul.orderUl").append(lin4);
            }

            /*if(OrderStatus == 3 || OrderStatus == 4){
                var order_id = split.OrderId;
                var SetOrderStatusJson = {
                        "order_id":order_id
                    };
                var SetOrderStatusUrl = {
                        path:"/PlatApi/SetOrderStatus"
                    };
                rrcw.requestSuccessC(SetOrderStatusJson, SetOrderStatusUrl, function (req) {
                    console.log("设置订单状态：",req);
                    if(req.Status != 0) {
                        return false;
                    }
                });
            }*/

        })
    };

    //C端获取注册公司订单详细
    renrenc.GetRegComOrderDetail = function () {
        var order_id = rrcw.getUrlParam("order_id");
        var GetOrderDetail2Json = {
                "userid":rrcw.defaultsC.userid,
                "orderid":order_id
            };
        var GetOrderDetail2Url = {
                path:"/ThirdPeriod/GetOrderDetail2"
            };
        rrcw.requestSuccessC(GetOrderDetail2Json, GetOrderDetail2Url, function (req) {
            console.log("C端获取注册公司订单详细：",req);
            if(req.Status != 0) {
                return false;
            }
            var BUserInfo = req.Data.BUserInfo;
            var OrderInfo = req.Data.OrderInfo;
            var RegComInfo = req.Data.RegComInfo;
            var WFInfo = req.Data.WFInfo;
            var PayStatus = req.Data.PayStatus;
            var Id = OrderInfo.Id;
            var CompanyName;
            if(RegComInfo.RealCompanyName){
                CompanyName = RegComInfo.RealCompanyName;
            }else{
                CompanyName = RegComInfo.CompanyName.split(",")[0] + "<span> (待核)</span>";
            }
            var GoodsName = req.Data.GoodName;
            var TotalAmount = rrcw.formatMoney(OrderInfo.Amount);
            var Status = OrderInfo.Status;
            var OrderStatusName = "";
            switch(Status){
                case 1:
                case 2:
                case 3:
                    OrderStatusName = "未开始";
                    break;
                case 4:
                    OrderStatusName = "服务中";
                    break;
                case 5:
                case 7:
                    OrderStatusName = "已完成";
                    break;
                case 6:
                    OrderStatusName = "已终止";
                    break;
                case 8:
                    OrderStatusName = "已结算";
                    break;
                case 9:
                    OrderStatusName = "待确认";
                    break;
                case 10:
                    OrderStatusName = "已取消";
                    break;
            }
            var statusOfPay;
            if(WFInfo[2].Status == 1){
                if(PayStatus != 3){
                    statusOfPay = "等待客户付款";
                }else{
                    statusOfPay = "客户已完成付款";
                }
            }else{
                statusOfPay = "";
            }
            var Name = BUserInfo.Name;
            var Phone = BUserInfo.Phone;
            var li = "<ul class='orderUl'><li class='orderList top'><div class='left'><div class='leftThree lifeCycle width560'><div class='orderNum'></div><div id='ordersplitid' class='value'>{0}</div></div><div class='leftThree companyName hidden'>{1}</div><div class='leftThree lifeCycle'><div class='keyShort1'>项目：</div><div class='value'>{2}</div></div></div><div class='right'><div class='alignRight beingServed'>{3}</div><div class='alignRight amountOfMoney'>￥{4}</div><div class='alignRight statusOfPay'>{5}</div></div><div style='clear:both'></div><div class='progressBarDiv'><div class='progressText'><div class='text text2'>核名</div><div class='text text4'>交付物审核</div><div class='text text6'>办结</div></div><div class='progressBar'><div class='circle circle1'></div><div class='bar bar1'></div><div class='circle circle2'></div><div class='bar bar2'></div><div class='circle circle3'></div><div class='bar bar3'></div><div class='circle circle4'></div><div class='bar bar4'></div><div class='circle circle5'></div><div class='bar bar5'></div><div class='successDiv'></div></div><div class='progressText'><div class='text text1'>材料收集</div><div class='text text3'>营业执照</div><div class='text text5'>交付物交付</div></div></div></li><li class='orderList middle'><div class='details'><div class='keyShort2'>联系人：</div><div class='values'>{6}</div></div><div class='details'><div class='keys'>联系电话：</div><div class='values telNumber'><a href='tel:{7}'>{7}</a></div></div><div style='clear:both'></div></li></ul><div class='btnsDiv'><div class='robBtn goClientInfo'>客户资料</div><div class='robBtn goWorkPro'>工作进度</div></div>";
            var lin = rrcw.StringFormat(li,Id,CompanyName,GoodsName,OrderStatusName,TotalAmount,statusOfPay,Name,Phone);
            $("article.orderDetails3Art").append(lin);
            getProgress(WFInfo);
            if(Status == 10){
                $(".goClientInfo,.goWorkPro").hide();
            }else{
                $(".orderDetails3Header .right").addClass("cancelOrder").html("取消订单");
            }
        })
    };

    $(".orderDetails3Header").on("click",".cancelOrder",function(){
        layer.open({
            title: ['取消订单', 'font-size:.3rem;color:#525252;'],
            content: '确认取消吗？',
            btn: ['确认', '取消'],
            time: 3,
            style: 'text-align:center;font-size:.28rem;color:#525252',
            yes: function() {
                $(".layui-m-layermain,.layui-m-layershade").hide();
                renrenc.CancelOrder2();
            }
        });
    });

    $(".orderDetails3Art").on("click",".goClientInfo",function(){
        window.location.href = "c_clientInformation.html?order_id=" + rrcw.getUrlParam("order_id");
    });

    $(".orderDetails3Art").on("click",".goWorkPro",function(){
        window.location.href = "c_workProgress.html?order_id=" + rrcw.getUrlParam("order_id");
    });


    //C端取消订单
    renrenc.CancelOrder2 = function () {
        var order_id = rrcw.getUrlParam("order_id");
        var GetOrderDetail2Json = {
                "cuserid":rrcw.defaultsC.userid,
                "id":order_id
            };
        var GetOrderDetail2Url = {
                path:"/ThirdPeriod/CancleOrder"
            };
        console.log(order_id);
        rrcw.requestSuccessC(GetOrderDetail2Json, GetOrderDetail2Url, function (req) {
            console.log("C端取消订单：",req);
            if(req.Status != 0) {
                return false;
            }else{
                alert("取消成功");
                window.location.href = "c_regComOrderList.html";
            }
        })
    };

    // 第三期项目多个页面共用的顶部模块，单独分离出来。
    function getTopInfo(e){
        var OrderInfo = e.Data.OrderInfo;
        var RegComInfo = e.Data.RegComInfo;
        var WFInfo = e.Data.WFInfo;
        var PayStatus = e.Data.PayStatus;
        var Id = OrderInfo.Id;
        var CompanyName;
        if(RegComInfo.RealCompanyName){
            CompanyName = RegComInfo.RealCompanyName;
        }else{
            CompanyName = RegComInfo.CompanyName.split(",")[0] + "<span> (待核)</span>";
        }
        var GoodsName = e.Data.GoodName;
        var TotalAmount = rrcw.formatMoney(OrderInfo.Amount);
        var statusOfPay;
        if(WFInfo[2].Status == 1){
            if(PayStatus != 3){
                statusOfPay = "等待客户付款";
            }else{
                statusOfPay = "客户已完成付款";
            }
        }else{
            statusOfPay = "";
        }
        var Status = OrderInfo.Status;
        var OrderStatusName = "";
        switch(Status){
            case 1:
            case 2:
            case 3:
                OrderStatusName = "未开始";
                break;
            case 4:
                OrderStatusName = "服务中";
                break;
            case 5:
            case 7:
                OrderStatusName = "已完成";
                break;
            case 6:
                OrderStatusName = "已终止";
                break;
            case 8:
                OrderStatusName = "已结算";
                break;
            case 9:
                OrderStatusName = "待确认";
                break;
            case 10:
                OrderStatusName = "已取消";
                break;
        }
        var li1 = "<li class='orderList top'><div class='left'><div class='leftThree lifeCycle width560'><div class='orderNum'></div><div id='ordersplitid' class='value'>{0}</div></div><div class='leftThree companyName hidden'>{1}</div><div class='leftThree lifeCycle'><div class='keyShort1'>项目：</div><div class='value'>{2}</div></div></div><div class='right'><div class='alignRight beingServed'>{3}</div><div class='alignRight amountOfMoney'>￥{4}</div><div class='alignRight statusOfPay'>{5}</div></div><div style='clear:both'></div></li>";
        var lin1 = rrcw.StringFormat(li1,Id,CompanyName,GoodsName,OrderStatusName,TotalAmount,statusOfPay);
        $("ul.orderUl").append(lin1);
    }

    // c_workProgress.html  调用业务订单详情接口
    renrenc.GetWorkProgress = function() {
        var order_id = rrcw.getUrlParam("order_id");
        var GetOrderDetail2Json = {
                "userid":rrcw.defaultsC.userid,
                "orderid":order_id
            };
        var GetOrderDetail2Url = {
                path:"/ThirdPeriod/GetOrderDetail2"
            };
        rrcw.requestSuccessC(GetOrderDetail2Json, GetOrderDetail2Url, function (req) {
            console.log("获取工作进度：", req);
            if (req.Status != 0) {
                return false;
            }
            var WFInfo = req.Data.WFInfo;
            var OrderInfo = req.Data.OrderInfo;
            $("#workProgressGoBack").attr("obj_id",OrderInfo.Id);
            // 第一部分
            getTopInfo(req);
            // 第二部分
            var li2 = "<li class='orderList workProgress'><div class='top'><div class='title'>工作进度</div><div class='delayBtn'>延迟申请</div></div><div class='bottom'><table><thead><tr><th class='th1'>服务名称</th><th class='th2'>截止时间</th><th class='th3'>完成时间</th><th class='th4'>状态</th><th class='th5'></th></tr></thead><tbody><tr><td>材料收集</td><td class='td0'>{0}</td><td class='td0'>{1}</td><td class='td0'>{12}</td><td class='flex' id='uploadData1' obj_src=''><div class='uploadIcon'></div>上传</td></tr><tr><td>核名</td><td class='td1'>{2}</td><td class='td1'>{3}</td><td class='td1'>{13}</td><td class='flex' id='uploadData2' obj_src='' obj_comName=''><div class='uploadIcon'></div>上传</td></tr><tr><td>营业执照</td><td class='td2'>{4}</td><td class='td2'>{5}</td><td class='td2'>{14}</td><td class='flex' id='uploadData3' obj_src=''><div class='uploadIcon'></div>上传</td></tr><tr><td>交付物审核</td><td class='td3'>{6}</td><td class='td3'>{7}</td><td class='td3'>{15}</td><td></td><td></td></tr><tr><td>交付物交付</td><td class='td4'>{8}</td><td class='td4'>{9}</td><td class='td4'>{16}</td><td></td><td></td></tr><tr><td>办结</td><td class='td5'>{10}</td><td class='td5'>{11}</td><td class='td5'>{17}</td><td></td><td></td></tr></tbody></table></div><div style='clear:both'></div></li>";
            var end = new Array(6);
            var complete = new Array(6);
            var IsOnTime = new Array(6);
            var status = new Array(6);
            var statusName = new Array(6);
            for(var i=0; i<WFInfo.length; i++){
                end[i] = renrenc.GetData1(WFInfo[i].StageEndTime);
                complete[i] = renrenc.GetData1(WFInfo[i].StageCompleteTime);
                IsOnTime[i] = WFInfo[i].IsOnTime;
                status[i] = WFInfo[i].Status;
                end[i] == ""?end[i] = "无":end[i];
                complete[i] == "" ? complete[i] = "无" : complete[i];
                switch(status[i]){
                    case 1:
                        statusName[i] = "完成";
                        break;
                    case 2:
                        statusName[i] = "失败";
                        break;
                    default:
                        statusName[i] = "无";
                }
            }
            var lin2 = rrcw.StringFormat(li2,end[0],complete[0],end[1],complete[1],end[2],complete[2],end[3],complete[3],end[4],complete[4],end[5],complete[5],statusName[0],statusName[1],statusName[2],statusName[3],statusName[4],statusName[5]);
            $("ul.orderUl").append(lin2);
            var CompanyName = req.Data.RegComInfo.CompanyName;
            $("#uploadData1").attr("obj_src",WFInfo[0].StageImage);
            $("#uploadData2").attr({"obj_src":WFInfo[1].StageImage,"obj_comName":CompanyName});//核名页面提交需要传CompanyName
            $("#uploadData3").attr("obj_src",WFInfo[2].StageImage);
            if(OrderInfo.Status < 4) {
                $("#workProgressBtn").show();
                $(".delayBtn").hide();
                $(".bottom .flex").hide();
            }else{
                $("#workProgressBtn").hide();
            }
            if(status[2]== 1){
                $(".delayBtn").hide();
            }
            if(status[5] == 1){
                $(".bottom .flex").hide();
            }
            for(var j=0; j<WFInfo.length; j++) {
                if(status[j] == 1){
                    $(".td"+j).addClass("complete");
                    IsOnTime[j] == true ? $(".td"+j).addClass("colorComplete") : $(".td"+j).addClass("colorDelay");
                }else if(status[j] == 2){
                    $(".td"+j).addClass("colorFail");
                }
            }
        })
    };


    $("#workProgressGoBack").on("click",function(){
        window.location.href = "c_orderDetails3.html?order_id=" + $(this).attr("obj_id");
    });

    $(".orderUl").on("click", ".delayBtn", function(){
        renrenc.ClickDelayBtn();
    }).on("click","#uploadData1",function(){
        var order_id = rrcw.getUrlParam("order_id");
        var obj_src = $(this).attr("obj_src");
        if(obj_src == undefined){
            window.location.href = "c_uploadData1.html?order_id=" + order_id;
        }else{
            window.location.href = "c_uploadData1.html?order_id=" + order_id + "&obj_src=" + obj_src;
        }
    }).on("click","#uploadData2",function(){
        if($(".bottom table .td0").hasClass("complete")){
            var order_id = rrcw.getUrlParam("order_id");
            var companyName = $(this).attr("obj_comName");
            var obj_src = $(this).attr("obj_src");
            if(obj_src == undefined){
                window.location.href = "c_uploadData2.html?order_id=" + order_id + "&companyName=" + companyName;
            }else{
                window.location.href = "c_uploadData2.html?order_id=" + order_id + "&obj_src=" + obj_src + "&companyName=" + companyName;
            }
        }else{
            alert("请先完成材料收集阶段！");
        }
    }).on("click","#uploadData3",function(){
        if($(".bottom table .td1").hasClass("complete")){
            var order_id = rrcw.getUrlParam("order_id");
            var obj_src = $(this).attr("obj_src");
            if(obj_src == undefined){
                window.location.href = "c_uploadData3.html?order_id=" + order_id;
            }else{
                window.location.href = "c_uploadData3.html?order_id=" + order_id + "&obj_src=" + obj_src;
            }
        }else{
            alert("请先完成核名阶段！");
        }
    });

    $("#workProgressBtn").on("click",function(){
        layer.open({
            title: ['开始服务', 'font-size:.3rem;color:#525252;'],
            content: '确认开始服务吗？',
            btn: ['确认', '取消'],
            time: 3,
            style: 'text-align:center;font-size:.28rem;color:#525252',
            yes: function() {
                $(".layui-m-layermain,.layui-m-layershade").hide();
                renrenc.SureService();
            }
        });
    });

    // c_workProgress.html  调用确认服务接口
    renrenc.SureService = function() {
        var order_id = rrcw.getUrlParam("order_id");
        var SureServiceJson = {
                "userid":rrcw.defaultsC.userid,
                "orderid":order_id
            };
        var SureServiceUrl = {
                path:"/ThirdPeriod/SureService"
            };
        rrcw.requestSuccessC(SureServiceJson, SureServiceUrl, function (req) {
            console.log("开始服务：", req);
            if (req.Status != 0) {
                alert(req.Message);
                return false;
            }else{
                layer.open({
                    type:2,
                    content:"",
                    time:.5,
                    end:function () {
                        window.location.reload();
                    }
                });
            }
        })
    };

    // c_workProgress.html  单击延迟申请按钮
    renrenc.ClickDelayBtn = function() {
        var order_id = rrcw.getUrlParam("order_id");
        var GetOrderDetail2Json = {
                "userid":rrcw.defaultsC.userid,
                "orderid":order_id
            };
        var GetOrderDetail2Url = {
                path:"/ThirdPeriod/GetOrderDetail2"
            };
        rrcw.requestSuccessC(GetOrderDetail2Json, GetOrderDetail2Url, function (req) {
            console.log("单击延迟申请按钮：", req);
            if (req.Status != 0) {
                return false;
            }
            var WFInfo = req.Data.WFInfo;
            var Status = new Array(6);
            if(WFInfo[0].Status == 3){
                window.location.href = "c_delayApply.html?order_id=" + order_id + "&stage=材料收集";
            }else{
                for(var i=0; i<WFInfo.length; i++){
                    Status[i] = WFInfo[i].Status;
                    if(Status[i] == 3 && Status[i-1] == 1){
                        var stageName;
                        switch(i){
                            case 0:
                                stageName = "材料收集";
                                break;
                            case 1:
                                stageName = "核名";
                                break;
                            case 2:
                                stageName = "营业执照";
                                break;
                            case 3:
                                stageName = "交付物审核";
                                break;
                            case 4:
                                stageName = "交付物交付";
                                break;
                            case 5:
                                stageName = "办结";
                                break;
                        }
                        window.location.href = "c_delayApply.html?order_id=" + order_id + "&stage=" + stageName;
                    }
                }
            }
        })
    };

    // c_delayApply.html   调用延期申请接口
    renrenc.DelayApply = function() {
        var order_id = rrcw.getUrlParam("order_id");
        var stage = rrcw.getUrlParam("stage");
        var GetOrderDetail2Json = {
                "userid":rrcw.defaultsC.userid,
                "orderid":order_id
            };
        var GetOrderDetail2Url = {
                path:"/ThirdPeriod/GetOrderDetail2"
            };
        rrcw.requestSuccessC(GetOrderDetail2Json, GetOrderDetail2Url, function (req) {
            console.log("获取第一部分：", req);
            if (req.Status != 0) {
                return false;
            }
            // 第一部分
            getTopInfo(req);
            // 第二部分
            var li2 = "<li class='orderList delayApply'><div class='top'><div class='title'>延迟阶段-<span class='stage'>" + stage + "</span></div></div><div class='selectDiv'><div>延迟时间</div><div><div class='val'><input id='selectid7' class='specialInput' type='text' readonly='readonly' name='input_area' placeholder='请选择'/></div><div class='extend'><img src='static/images/c/extend.png' alt='>'/></div></div></div><div class='textAreaDiv'><textarea name='' id='applyReason' class='applyReason noHighLight' placeholder='延迟原因：' cols='30' rows='10'></textarea></div><div style='clear:both'></div></li>";
            $("ul.orderUl").append(li2);
            renrenc.GetExtensionDay();
        });
        // 第三部分（获取延迟申请日志）
        var DelayaApplyLogJson = {
                "userid":rrcw.defaultsC.userid,
                "orderid":order_id
            };
        var DelayaApplyLogUrl = {
                path:"/ThirdPeriod/DelayaApplyLog"
            };
        rrcw.requestSuccessC(DelayaApplyLogJson, DelayaApplyLogUrl, function (req) {
            console.log("获取延迟申请日志：", req);
            if (req.Status != 0) {
                return false;
            }
            var data = req.Data;
            var CreatedDate = new Array(data.length);
            var ExtensionDay = new Array(data.length);
            var StageId = new Array(data.length);
            var StageName = new Array(data.length);
            var Remark = new Array(data.length);
            for(var i=0; i<data.length; i++){
                CreatedDate[i] = renrenc.GetData1(data[i].CreatedDate);
                ExtensionDay[i] = data[i].ExtensionDay;
                StageId[i] = data[i].StageId;
                switch(StageId[i]){
                    case 1:
                        StageName[i] = "材料收集";
                        break;
                    case 2:
                        StageName[i] = "核名";
                        break;
                    case 3:
                        StageName[i] = "营业执照";
                        break;
                    case 4:
                        StageName[i] = "交付物审核";
                        break;
                    case 5:
                        StageName[i] = "交付物交付";
                        break;
                    case 6:
                        StageName[i] = "办结";
                        break;
                }
                Remark[i] = data[i].Remark;
                var li3 = "<div class='content'><div>" + CreatedDate[i] + "</div><div>" + ExtensionDay[i] + "天</div><div>" + StageName[i] + "</div><div class='reason'>" + Remark[i] + "</div></div>";
                $(".applyRecord .contents").append(li3);
            }
        });

        $("#delayApplyBtn").on("click",function(){
            var delayday = $("#selectid7").val().substring(0,1);
            var reason = $("#applyReason").val();
            if(!delayday){
                alert("请选择延迟时间");
                return false;
            }else if(!reason){
                alert("请输入延迟原因");
                return false;
            }else{
                layer.open({
                    title: ['提交申请', 'font-size:.3rem;color:#525252;'],
                    content: '确认提交吗？',
                    btn: ['确认', '取消'],
                    time: 3,
                    style: 'text-align:center;font-size:.28rem;color:#525252',
                    yes: function() {
                        $(".layui-m-layermain,.layui-m-layershade").hide();

                        // 保存延迟申请记录
                        var DelayaApplyJson = {
                                "userid":rrcw.defaultsC.userid,
                                "orderid":order_id,
                                "delayday":delayday,
                                "reason":reason
                            };
                        var DelayaApplyUrl = {
                                path:"/ThirdPeriod/DelayaApply"
                            };
                        rrcw.requestSuccessC(DelayaApplyJson, DelayaApplyUrl, function (req) {
                            console.log("提交延期申请：", req);
                            if (req.Status == 0) {
                                console.log("提交成功！");
                                window.location.reload();
                            }
                        });
                    }
                });
            }
        });
    };

    // c_clientInformation.html  调用业务订单详情接口
    renrenc.GetClientInformation = function() {
        var order_id = rrcw.getUrlParam("order_id");
        var GetOrderDetail2Json = {
                "userid":rrcw.defaultsC.userid,
                "orderid":order_id
            };
        var GetOrderDetail2Url = {
                path:"/ThirdPeriod/GetOrderDetail2"
            };
        rrcw.requestSuccessC(GetOrderDetail2Json, GetOrderDetail2Url, function (req) {
            console.log("获取客户资料：", req);
            if (req.Status != 0) {
                return false;
            }
            var RegComInfo = req.Data.RegComInfo;
            var StockRightinfo = req.Data.StockRightinfo;
            var CompanyName = RegComInfo.CompanyName;
            var Remark1 = RegComInfo.Remark;
            var RegisterAddress = RegComInfo.RegisterAddress;
            var CompanyScope = RegComInfo.CompanyScope;

            var sLength = StockRightinfo.length;
            var Powers = new Array(sLength);
            var PowersName = new Array(sLength);
            var name = new Array(sLength);
            var IDCardNo = new Array(sLength);
            var stakeRatio = new Array(sLength);
            for(var s=0; s<sLength; s++){
                Powers[s] = StockRightinfo[s].Powers;
                switch(Powers[s]){
                    case 1:
                        PowersName[s] = "法";
                        break;
                    case 2:
                        PowersName[s] = "监";
                        break;
                    case 3:
                        PowersName[s] = "股";
                        break;
                }
                name[s] = StockRightinfo[s].Name;
                IDCardNo[s] = StockRightinfo[s].IDCardNo;
                stakeRatio[s] = rrcw.formatMoney(StockRightinfo[s].StakeRatio);
            }
            var Remark2 = req.Data.Remark;
            // 第一部分
            var comNameSplit = CompanyName.split(",");
            for(var i=0; i<comNameSplit.length; i++){
                if(comNameSplit[i] == "" || typeof(comNameSplit[i]) == "undefined"){
                    comNameSplit.splice(i,1);
                    i= i-1;
                }
            }
            for(var m=0; m<comNameSplit.length; m++){
                var li1 = "<li class='companyName'>" + comNameSplit[m] + "</li>";
                $("ul.companyNameUl").append(li1);
            }
            $(".clientInfoTop .remark span").html(Remark1);
            // 第二部分
            var li2 = "<div class='clientInfoMiddle'><div class='title'>注册地及经营范围</div><div class='regAddress'><div>注册地址</div><div>{0}</div></div><div class='BusinessScope'><div>经营范围</div><div class='hidden'>{1}</div></div></div>";
            var lin2 = rrcw.StringFormat(li2,RegisterAddress,CompanyScope);
            $(".clientInfoTop").after(lin2);
            // 第三部分
            for(var j=0; j<StockRightinfo.length; j++){
                var li3 = "<tr><td>(" + PowersName[j] + ")</td><td class='td2'>" + name[j] + "</td><td class='td3'>" + IDCardNo[j] + "</td><td>" + stakeRatio[j] + "%</td></tr>";
                $(".clientInfoBottom tbody").append(li3);
            }
            /*for(var k=0; k<$(".td3").length; k++){
                $(".td3").eq(k).html(
                    $(".td3").eq(k).html().substring(0,6) + "********" + $(".td3").eq(k).html().substring(14)
                );
            }*/
            $(".clientInfoBottom .remark span").html(Remark2);
        })
    };

    /*上传材料审核 开始*/

    renrenc.LoadUploadFile = function(stage){
        var order_id = rrcw.getUrlParam("order_id");
        var GetOrderDetail2Json = {
                "userid":rrcw.defaultsC.userid,
                "orderid":order_id
            };
        var GetOrderDetail2Url = {
                path:"/ThirdPeriod/GetOrderDetail2"
            };
        rrcw.requestSuccessC(GetOrderDetail2Json, GetOrderDetail2Url, function (req) {
            console.log("加载上传模块：", req);
            if (req.Status != 0) {
                return false;
            }
            var WFInfo = req.Data.WFInfo;
            if(WFInfo[1].Status == 3){
                $(".uploadData2Header .right").addClass("failDetermineName").html("核名失败");
            }
            var StageImage = new Array(6);//目前只有前三项
            var Status = new Array(6);
            var dataBaseThumUrl = new Array(6);
            for(var i=0; i<WFInfo.length; i++){
                StageImage[i] = WFInfo[i].StageImage;
                Status[i] = WFInfo[i].Status;
                dataBaseThumUrl[i] = WFInfo[i].StageThumImage;
            }
            $("#uploadRemark").val(WFInfo[stage-1].StageRemark);
            $(".uploadDataBtn").attr("obj_stage",stage);

            var imagerawurl = rrcw.getUrlParam("obj_src");
            var imagethumurl = rrcw.getUrlParam("obj_thumsrc");
            if(imagerawurl){
                if(dataBaseThumUrl[stage-1]){
                    console.log("图片取自后台");
                    var str1 = "<span class='card-upbox-btn-1 hide'><input type='file' name='pic' accept='image' id='data_path_" + stage + "' class='uploadFileBtn'/><div class='uploadImgDiv'><div class='uploadImg1'><img src='static/images/c/uploadImg.png' alt=''/></div><div class='uploadImgText'>拍照上传</div></div></span><a href='javascript:;' class='data_del_" + stage + "'><div class='deleteImgDiv'>删除</div></a><img id='img' src='' obj_src='' class='upload-card-img'>";
                    $("#data_upbox_" + stage).html(str1);
                    $("#img").attr({"src":dataBaseThumUrl[stage-1],"obj_src":imagerawurl});
                }else{
                    console.log("图片取自URL");
                    var str2 = "<span class='card-upbox-btn-1 hide'><input type='file' name='pic' accept='image' id='data_path_" + stage + "' class='uploadFileBtn'/><div class='uploadImgDiv'><div class='uploadImg1'><img src='static/images/c/uploadImg.png' alt=''/></div><div class='uploadImgText'>拍照上传</div></div></span><a href='javascript:;' class='data_del_" + stage + "'><div class='deleteImgDiv'>删除</div></a><img id='img' src='' obj_src='' class='upload-card-img'>";
                    $("#data_upbox_" + stage).html(str2);
                    $("#img").attr({"src":imagethumurl,"obj_src":imagerawurl});
                }
            }else{
                var sessionRawUrl = window.sessionStorage.getItem("rawUrl" + stage);
                var sessionThumUrl = window.sessionStorage.getItem("thumUrl" + stage);
                if(sessionRawUrl){
                    console.log("图片取自会话缓存");
                    var str3 = "<span class='card-upbox-btn-1 hide'><input type='file' name='pic' accept='image' id='data_path_" + stage + "' class='uploadFileBtn'/><div class='uploadImgDiv'><div class='uploadImg1'><img src='static/images/c/uploadImg.png' alt=''/></div><div class='uploadImgText'>拍照上传</div></div></span><a href='javascript:;' class='data_del_" + stage + "'><div class='deleteImgDiv'>删除</div></a><img id='img' src='' obj_src='' class='upload-card-img'>";
                    $("#data_upbox_" + stage).html(str3);
                    $("#img").attr({"src":sessionThumUrl,"obj_src":sessionRawUrl});
                }
            }

            document.getElementById("data_path_" + stage).addEventListener("change",readFile1,false);
            function readFile1(){
                $.ajax({
                    success:function loading(){
                        layer.open({
                            type:2,
                            content:"正在加载图片",
                            time:1
                        });
                    }
                });
                var id = ($(this).attr("id"));
                var file = this.files[0];
                //这里判断一下类型，如果不是图片就返回，去掉就可以上传任意文件。
                if(!/image\/\w+/.test(file.type)){
                    alert("请确保文件为图像类型");
                }else{
                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function(e){
                        $("#"+id).parent().next().next().attr("src",this.result).removeClass("hide");
                        $("#"+id).parent().next().removeClass("hide");
                        $("#"+id).parent().hide();
                        var image = $("#"+id).parent().next().next().attr("src").split(",");
                        if(!image){
                            return false;
                        }
                        var UploadImageJson={
                            "image_data":image[1]
                        };
                        var UploadImageUrl = {
                            path:"/PlatApi/UploadImage"
                        };
                        rrcw.requestSuccessCAsyncFalse(UploadImageJson,UploadImageUrl,function (req) {//同步
                            console.log("前端显示图片：", req);
                            if (req.Status == 0) {
                                var rawUrl = req.Data.RawUrl;
                                var thumUrl = req.Data.ThumUrl;
                                $("#img").attr("obj_src",rawUrl);
                                window.sessionStorage.setItem("rawUrl" + stage,rawUrl);
                                window.sessionStorage.setItem("thumUrl" + stage,thumUrl);
                                window.location.href = "c_uploadData" + stage + ".html?order_id=" + order_id;
                            }
                        });
                    }
                }
            }

            $(".data_del_1").click(function(){
                window.sessionStorage.removeItem("rawUrl1");
                window.sessionStorage.removeItem("thumUrl1");
                $(this).next().attr("src","").addClass("hide");
                $(this).addClass("hide");
                $(this).prev().removeClass("hide");
            });
            $(".data_del_2").click(function(){
                window.sessionStorage.removeItem("rawUrl2");
                window.sessionStorage.removeItem("thumUrl2");
                $(this).next().attr("src","").addClass("hide");
                $(this).addClass("hide");
                $(this).prev().removeClass("hide");
            });
            $(".data_del_3").click(function(){
                window.sessionStorage.removeItem("rawUrl3");
                window.sessionStorage.removeItem("thumUrl3");
                $(this).next().attr("src","").addClass("hide");
                $(this).addClass("hide");
                $(this).prev().removeClass("hide");
            });
        });
    };

    $(".uploadDataHeader .left").on("click",function(){
        var order_id = rrcw.getUrlParam("order_id");
        window.location.href = "c_workProgress.html?order_id=" + order_id;
    });
    $("#uploadDataBtn1").on("click",function(){
        renrenc.UploadData("c_workProgress",1);
    });
    /*$("#uploadDataBtn2").on("click",function(){
        renrenc.UploadData("c_determineName",2);
    });*/
    $("#uploadDataBtn2").on("click",function(){
        renrenc.toDetermineName();
    });
    $("#uploadDataBtn3").on("click",function(){
        renrenc.UploadData("c_workProgress",3);
    });
    $(".uploadData2Header .right").on("click",function() {
        layer.open({
            title: ['核名失败', 'font-size:.3rem;color:#525252;'],
            content: '确认提交吗？',
            btn: ['确认', '取消'],
            time: 3,
            style: 'text-align:center;font-size:.28rem;color:#525252',
            yes: function() {
                $(".layui-m-layermain,.layui-m-layershade").hide();
                var order_id = rrcw.getUrlParam("order_id");
                var companyName = rrcw.getUrlParam("companyName");
                var rawUrl = $("#img").attr("src");
                var thumUrl = "";
                var remark = $("#uploadRemark").val();
                var SubmitStageJson = {
                    "userid": rrcw.defaultsC.userid,
                    "orderid": order_id,
                    "imageurl": rawUrl,
                    "imagethumurl": thumUrl,
                    "status": 2,
                    "stage": 2,
                    "remark": remark,
                    "companyname": companyName
                };
                var SubmitStageUrl = {
                    path: "/ThirdPeriod/SubmitStage"
                };
                rrcw.requestSuccessC(SubmitStageJson, SubmitStageUrl, function (req) {
                    console.log("提交:", req);
                    if (req.Status != 0) {
                        alert(req.Message);
                    }else{
                        alert("提交成功！");
                        window.location.href = "c_workProgress.html?order_id=" + order_id;
                    }
                });
            }
        });
    });

    $("article").on("click",".upload-card-img",function(){
        var imgSrc = $(this).attr("obj_src");
        window.location.href = "c_showImage.html?imgsrc=" + imgSrc;
    });

    // 一、三阶段点击“提交”执行的函数
    renrenc.UploadData = function(m,n){
        var companyName = rrcw.getUrlParam("companyName");
        var thumUrl = $("#img").attr("src");
        var rawUrl = $("#img").attr("obj_src");
        var remark = $("#uploadRemark").val();
        var stage = $(".uploadDataBtn").attr("obj_stage");
        if(!thumUrl){
            alert("请上传图片");
        }else{
            layer.open({
                title: ['提交', 'font-size:.3rem;color:#525252;'],
                content: '确认提交吗？',
                btn: ['确认', '取消'],
                time: 5,
                style: 'text-align:center;font-size:.28rem;color:#525252',
                yes: function() {
                    $(".layui-m-layermain,.layui-m-layershade").hide();
                    var order_id = rrcw.getUrlParam("order_id");
                    var SubmitStageJson = {
                            "userid": rrcw.defaultsC.userid,
                            "orderid": order_id,
                            "imageurl": rawUrl,
                            "imagethumurl": thumUrl,
                            "status": 1,
                            "stage": stage,
                            "remark": remark,
                            "companyname": companyName
                        };
                    var SubmitStageUrl = {
                            path: "/ThirdPeriod/SubmitStage"
                        };
                    rrcw.requestSuccessC(SubmitStageJson, SubmitStageUrl, function (req) {
                        console.log("提交:", req);
                        if (req.Status != 0) {
                            alert(req.Message);
                        }else{
                            alert("提交成功！");
                            window.location.href = m+".html?order_id=" + order_id;
                            window.sessionStorage.removeItem("rawUrl" + n);
                            window.sessionStorage.removeItem("thumUrl" + n);
                        }
                    });
                }
            });
        }
    };

    //核名阶段提交的函数
    renrenc.toDetermineName = function(){
        var companyName = rrcw.getUrlParam("companyName");
        var thumUrl = $("#img").attr("src");
        var rawUrl = $("#img").attr("obj_src");
        var remark = $("#uploadRemark").val();
        var stage = $(".uploadDataBtn").attr("obj_stage");
        if(!thumUrl){
            alert("请上传图片");
        }else{
            layer.open({
                title: ['提交', 'font-size:.3rem;color:#525252;'],
                content: '确认提交吗？',
                btn: ['确认', '取消'],
                time: 5,
                style: 'text-align:center;font-size:.28rem;color:#525252',
                yes: function() {
                    $(".layui-m-layermain,.layui-m-layershade").hide();
                    var order_id = rrcw.getUrlParam("order_id");
                    window.location.href = "c_determineName.html?order_id=" + order_id + "&imageurl=" + rawUrl + "&imagethumurl=" + thumUrl + "&stage=" + stage + "&remark=" + remark + "&companyname=" + companyName;
                }
            });
        }
    };

    // 确定名称页面获取订单详细
    renrenc.DetermineName = function() {
        renrenc.GetCompanyName();
        var order_id = rrcw.getUrlParam("order_id");
        var imagerawurl = rrcw.getUrlParam("imageurl");
        var imagethumurl = rrcw.getUrlParam("imagethumurl");
        var GetOrderDetail2Json = {
                "userid": rrcw.defaultsC.userid,
                "orderid": order_id
            };
        var GetOrderDetail2Url = {
                path: "/ThirdPeriod/GetOrderDetail2"
            };
        rrcw.requestSuccessC(GetOrderDetail2Json, GetOrderDetail2Url, function (req) {
            console.log("获取订单详细：", req);
            if (req.Status != 0) {
                return false;
            }
            // 第一部分
            getTopInfo(req);
            var WFInfo = req.Data.WFInfo;
            if(WFInfo[1].StageImage){
                console.log("数据库里已经保存过此阶段的图片");
                $(".determineNameHeader .left").attr({"obj_orderId":order_id,"obj_src":WFInfo[1].StageImage,"obj_thumsrc":imagethumurl});
            }else{
                console.log("数据库里还没有保存过此阶段的图片");
                $(".determineNameHeader .left").attr({"obj_orderId":order_id,"obj_src":imagerawurl,"obj_thumsrc":imagethumurl});
            }

        });
    };
    $(".determineNameHeader .left").on("click",function(){
        var order_id = $(this).attr("obj_orderId");
        var imagerawurl = $(this).attr("obj_src");
        var imagethumurl = $(this).attr("obj_thumsrc");
        window.location.href = "c_uploadData2.html?order_id=" + order_id + "&obj_src=" + imagerawurl + "&obj_thumsrc=" + imagethumurl;

    });
    $("#selectid6").on("change",function(){
        $(".writeName").val($(this).val());
        return false;
    });
    $("#determineNameSubmit").on("click",function(){
        var val = $(".writeName").val();
        if(!val){
            alert("请输入已通过的企业名称");
        }else{
            layer.open({
                title: ['保存', 'font-size:.3rem;color:#525252;'],
                content: '确认保存吗？',
                btn: ['确认', '取消'],
                time: 5,
                style: 'text-align:center;font-size:.28rem;color:#525252',
                yes: function() {
                    $(".layui-m-layermain,.layui-m-layershade").hide();
                    var order_id = rrcw.getUrlParam("order_id");
                    var rawUrl = rrcw.getUrlParam("imageurl");
                    var thumUrl = rrcw.getUrlParam("imagethumurl");
                    var stage = rrcw.getUrlParam("stage");
                    var remark = rrcw.getUrlParam("remark");
                    var companyName = rrcw.getUrlParam("companyname");
                    var SubmitStageJson = {
                        "userid": rrcw.defaultsC.userid,
                        "orderid": order_id,
                        "imageurl": rawUrl,
                        "imagethumurl": thumUrl,
                        "status": 1,
                        "stage": stage,
                        "remark": remark,
                        "companyname": companyName
                    };
                    var SubmitStageUrl = {
                        path: "/ThirdPeriod/SubmitStage"
                    };
                    rrcw.requestSuccessC(SubmitStageJson, SubmitStageUrl, function (req) {
                        console.log("提交:", req);
                        if (req.Status != 0) {
                            alert(req.Message);
                        }else{
                            window.sessionStorage.removeItem("rawUrl2");
                            window.sessionStorage.removeItem("thumUrl2");
                            renrenc.SureRealComName();
                        }
                    });
                }
            });
        }
    });

    // 核名页面点击“保存”按钮
    renrenc.SureRealComName = function() {
        var order_id = rrcw.getUrlParam("order_id");
        var companyName = $(".writeName").val();
        var SureRealComNameJson = {
                "userid": rrcw.defaultsC.userid,
                "orderid": order_id,
                "realcomname": companyName
            };
        var SureRealComNameUrl = {
                path: "/ThirdPeriod/SureRealComName"
            };
        rrcw.requestSuccessC(SureRealComNameJson, SureRealComNameUrl, function (req) {
            console.log("点击保存:", req);
            if (req.Status != 0) {
                alert(req.Message);
            } else {
                alert("保存成功");
                window.location.href = "c_workProgress.html?order_id=" + order_id;
            }
        });
    };


    /*上传材料审核 结束*/


    /*2.38	获取用户资金*/
    renrenc.GetUserAssets = function() {
        var userId = rrcw.defaultsC.userid;
        var GetUserAssetsJson = {
                "user_id":userId
            };
        var GetUserAssetsUrl = {
                path:"/PlatApi/GetUserAssets"
            };
        rrcw.requestSuccessC(GetUserAssetsJson,GetUserAssetsUrl,function (req) {
            console.log("获取用户资金:",req);
            if(req.Status==0){
                var data = req.Data;
                if(data == null || data.Assets == 0){
                    $("#assets").html("￥0.00");
                    $("#assetsSmall").html("￥0.00");
                    $("#money").html("￥0.00");
                    $("#withdrawalsSubmit").css("background-color","#999").attr({"disabled":"disabled"});
                    $("#withdrawalAmount").attr("placeholder","余额为零，不能提现");
                }else{
                    var assets = rrcw.formatMoney(req.Data.Assets);
                    $("#assets").html("￥" + assets);
                    $("#assetsSmall").html("￥" + assets);
                    $("#money").html("￥" + assets);
                    $("#withdrawalAmount").attr("placeholder","最高额度￥" + assets);
                }
            }
        });
    };

    $("#withdrawalsSubmit").on("click", function(){
        var GetUserAssetsJson = {
                "user_id":rrcw.defaultsC.userid
            };
        var GetUserAssetsUrl = {
                path:"/PlatApi/GetUserAssets"
            };
        rrcw.requestSuccessC(GetUserAssetsJson,GetUserAssetsUrl,function (req) {
            if(req.Status==0){
                var data = req.Data;
                var assets = data.Assets;
                if($("#userName").val() == ""){
                    alert("请填写姓名");
                    return false;
                }else if(!/^[\u4e00-\u9fa5]+$/.test($("#userName").val())){
                    alert("便于统一管理\n请输入中文姓名");
                    return false;
                }else if($("#bankAccount").val() == ""){
                    alert("请填写账号");
                    return false;
                }else if(!/^[0-9]*$/.test($("#bankAccount").val())){
                    alert("账号格式不正确");
                    return false;
                }else if($("#withdrawalAmount").val() == ""){
                    alert("请填写提现金额");
                    return false;
                }else if($("#withdrawalAmount").val() > assets){
                    alert("最高额度￥"+ assets);
                    return false;
                }else if(!/^\d+(\.\d{1})?(\.\d{2})?$/.test($("#withdrawalAmount").val())){
                    alert("提现金额格式不正确(小数点后保留2位)");
                    return false;
                }else{
                    renrenc.SetWithdrawDetail();
                }
            }
        });
    });

    //账号
    $("#bankAccount").blur(function(){
        var reg =/^[0-9]*$/;
        var bankAccount = $(this).val();
        if(bankAccount==""){
            return false;
        }else if(!reg.test(bankAccount)){
            alert("账号格式不正确");
        }
    });
    //提现金额
    $("#withdrawalAmount").blur(function(){
        var reg =/^\d+(\.\d{1})?(\.\d{2})?$/;
        var withdrawalAmount = $(this).val();
        if(withdrawalAmount==""){
            return false;
        }else if(!reg.test(withdrawalAmount)){
            alert("提现金额格式不正确(小数点后保留2位)");
        }
    });

    /*2.39	获取收支记录列表*/
    renrenc.GetBalanceDetailList = function() {
        function splitTime1(time){
            var time1=parseInt(time.split("(")[1].split(")")[0]);
            return new Date(time1).pattern("yyyy/MM/dd");
        }
        function splitTime2(time){
            var time1=parseInt(time.split("(")[1].split(")")[0]);
            return new Date(time1).pattern("hh:mm");
        }
        var userId = rrcw.defaultsC.userid;
        var GetBalanceDetailListJson = {
                "user_id":userId,
                "blance_type":-2
            };
        var GetBalanceDetailListUrl = {
                path:"/PlatApi/GetBalanceDetailList"
            };
        rrcw.requestSuccessC(GetBalanceDetailListJson,GetBalanceDetailListUrl,function (req) {
            console.log("收支记录：",req);
            if(req.Status==0){
                var data = req.Data.Data;
                if(data.length == 0){
                    alert("无收支记录");
                    window.location.href = "c_incomeDetails.html";
                }else{
                    console.log(req);
                    var contenthtml = "";
                    for(var i=0; i<data.length; i++) {
                        var name = data[i].Name,
                            balanceType = data[i].BalanceType,
                            amount = rrcw.formatMoney(data[i].Amount),
                            createdDate = data[i].CreatedDate,
                            lastModified = data[i].LastModified,
                            createdTime = splitTime1(createdDate),
                            lastModifiedTime = splitTime2(lastModified);
                        var balance = "",
                            numTitle = "",
                            source = "";
                        balanceType == 1 ? balance = "-" :balance = "+";
                        balanceType == 1 ? numTitle = "卡号：" :numTitle = "订单号：";
                        balanceType == 1 ? source = data[i].Source :source = data[i].BillId;
                        contenthtml += "<li class='records'>" +
                        "<div class='top'>" +
                        "<div class='companyName floatLeft hidden'>" + name + "</div>" +
                        "<div class='money floatRight thin'>" + amount + "</div>" +
                        "</div>" +
                        "<div class='bottom'>" +
                        "<div class='left floatLeft'>" +
                        "<div class='floatLeft'>" + numTitle + "</div>" +
                        "<div class='floatLeft'>" + source + "</div>" +
                        "</div>" +
                        "<div class='right floatRight'>" +
                        "<div class='floatLeft'>"+createdTime+"</div>" +
                        "<div class='floatRight'>" + lastModifiedTime + "</div>" +
                        "</div>" +
                        "</div>" +
                        "</li>";
                    }
                    $("ul.IORecordsUl").html(contenthtml);
                }
            }
        });
    };

    /*2.40	获取银行列表*/
    renrenc.GetBankList = function () {
        var GetBankListJson = {
            };
        var GetBankListUrl = {
                path:"/PlatApi/GetBankList"
            };
        rrcw.requestSuccessC(GetBankListJson,GetBankListUrl,function (req) {
            if(req.Status==0){
                var data=req.Data[0];
                //console.log(data);
                $("#selectid5").html(data.Name).attr("obj_id",data.Id);
                renrenc.GetUserBankList();
            }
            var str;
            str = str.replace(/,$/gi,"");
            //去除逗号
            var bank = new Option(str,5);
        })
    };

    /*2.41	获取用户银行列表*/
    renrenc.GetUserBankList = function () {
        var userId = rrcw.defaultsC.userid;
        var GetUserBankListJson = {
                "user_id":userId
            };
        var GetUserBankListUrl = {
                path:"/PlatApi/GetUserBankList"
            };
        rrcw.requestSuccessC(GetUserBankListJson,GetUserBankListUrl,function (req) {
            if(req.Status==0){
                var bank = req.Data;
                $.each(bank, function (i,b) {
                    if(b.IsDefault==true){
                        $("#userName").val(b.AccountName);
                        $("#bankAccount").val(b.BankAccount);
                    }
                });
            }
        })
    };

    /*2.42	设置用户银行列表*/
    renrenc.SetUserBankInfo = function () {
        var userId = rrcw.defaultsC.userid;
        var account_name = $("#userName").val(),
            bank_account = $("#bankAccount").val(),
            bank_id = $("#selectid5").attr("obj_id"),
            bid = parseInt(bank_id);
        var SetUserBankInfoJson = {
                "user_id":userId,
                "bank_id":bid,
                "bank_account":bank_account,
                "account_name":account_name,
                "is_default":1
            };
        var SetUserBankInfoUrl = {
                path:"/PlatApi/SetUserBankInfo"
            };
        rrcw.requestSuccessCAsyncFalse(SetUserBankInfoJson,SetUserBankInfoUrl,function (req) {
            if(req.Status==0){
                var userBankId = req.Data.Id;
                //todo 日后需求变了要改
            }
        })
    };

    /*2.43	申请提现*/
    renrenc.SetWithdrawDetail = function () {

        //调用：2.42	  设置用户银行列表
        renrenc.SetUserBankInfo();
        var userId = rrcw.defaultsC.userid;
        var Amount = $("#withdrawalAmount").val();
        var SetWithdrawDetailJson = {
                "user_id":userId,
                "user_bank_id":userBankId,
                "amount":Amount
            };
        var SetWithdrawDetailUrl = {
                path:"/PlatApi/SetWithdrawDetail"
            };
        rrcw.requestSuccessC(SetWithdrawDetailJson,SetWithdrawDetailUrl,function (req) {
            if(req.Status==0){
                alert("提现成功！");
                window.location.href="c_withdrawalsResult.html";
            }
        })
    };

    //发送短信
    renrenc.SmsSend = function(mobile, fn) {
        var mobileJson = {
                "mobile":mobile,
                "code_type":1, //1 注册 2 其他
                "user_type":1
            };
        var mobileUrl = {
                path:"/PlatApi/SmsSend"
            };
        rrcw.requestSuccessC(mobileJson, mobileUrl, function(req) {
            console.log("发送短信状态：",req);
            if (req.Status == 203) {
                alert("该手机号码已注册！");
                return false;
            }else if (req.Status == 0) {
                fn();
                alert("短信验证码已发送");
            }else if (req.Status != 203 && req.Status != 0) {
                alert("发送失败！");
            }
        });
    };

    /*2.11	用户注册(绑定手机号)*/
    renrenc.UserRegister = function(){
        var mobileVal = $("#telphone").val(),
            codeVal = $("#phoneyzm").val();
        var openid = rrcw.defaultsC.openid;
        if (mobileVal== "") {
            alert("请输入手机号");
            return false;
        }else if(codeVal==""){
            alert("请输入验证码");
            return false;
        }else{
            var RegisterJson = {
                    "user_type":1,
                    "mobile":mobileVal,
                    "code":codeVal,
                    "openid":openid
                };
            var RegisterUrl = {
                    path:"/PlatApi/UserRegister"
                };
            rrcw.requestSuccessC(RegisterJson, RegisterUrl, function (req) {
                console.log("信息：",req);
                if (req.Status == 203) {
                    alert(req.Message);
                }else if (req.Status == 301) {
                    alert("验证码错误");
                    return false;
                }else if (req.Status == 0) {
                    var data = req.Data;
                    console.log("绑定手机号：",req);
                    if(!data.LoginId){
                        alert("注册失败");
                        return false;
                    }else{
                        rrcw.defaultsC.userid = data.UserId;
                        rrcw.localStorage.set("wechatC",rrcw.defaultsC);
                        //window.location.href = "c_essentialInfo1.html";
                        var GetUserInfoJson = {
                                "id":data.UserId,
                                "user_type":1
                            };
                        var GetUserInfoUrl = {
                                path:"/PlatApi/GetUserInfo"
                            };
                        rrcw.requestSuccessC(GetUserInfoJson,GetUserInfoUrl,function (req) {
                            if(req.Status==0) {
                                var user_status = req.Data.UserStatus;
                                renrenc.goTo(user_status);
                            }
                        });

                    }
                }
            });
        }
    };

    /*-----------------------------------------------2016年12月7日js代码整理(开始)-------------------------------------------*/

    /*c_beingTest.html(状态页面都用这一个)*/
    $("#refresh").on("click", function(){
        layer.open({
            type:2,
            content:"",
            time:.5,
            end:function () {
                renrenc.GetUserInfo();
            }
        });
    });

    /*c_boundPhone.html*/
    $("#boundPhoneNext").on("click", renrenc.UserRegister);

    //启动倒计时
    function startTime() {
        var countTime = 60;
        var codeBtn = $("#codeBtn");
        // 倒计时初始化函数
        function SetRemainTime() {
            if (countTime == 0) {
                window.clearInterval(InterValObj); //停止计时器
                codeBtn.attr("disabled",false); //启用按钮
                codeBtn.removeClass("disabled");
                codeBtn.val("获取验证码");
            } else {
                countTime--;
                if (countTime < 10){
                    countTime = "0" + countTime;
                }
                codeBtn.val(countTime + "秒后");
            }
        }

        //设置button效果
        codeBtn.attr("disabled",true);
        codeBtn.addClass("disabled");
        var InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
    }

    //点击获取验证码
    $("#codeBtn").on("click", function () {
        var telReg = /^1\d{10}$/;
        var val = $("#telphone").val();
        if (!val) {
            alert("请输入手机号");
            return false;
        } else if(!telReg.test(val)) {
            alert("手机号格式错误");
            return false;
        }
        renrenc.SmsSend(val,startTime);
    });

    /*c_orderList1.html*/
    //选项卡
    $("#navBar_orderList1 .bar").on("click", function () {
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
        $(".stateList").css("display","none");
        var status = $(this).attr("obj_status");
        renrenc.GetOrderList(status);
    });

    /*c_regComOrderList.html*/
    //注册公司订单列表选项卡
    $("#navBar_regCom .bar").on("click", function () {
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
        $(".stateList").css("display","none");
        var status = $(this).attr("obj_status");
        renrenc.GetRegComOrderList(status);
    });

    /*c_orderList2.html*/
    $(".cancelOrder").on("click", function () {
        $(".masks,.popOutCancelReason").css("display", "block");
        setTimeout(function () {
            $(".popOutCancelReason").css({ "z-index":"10", "opacity":"1", "top":"50%" });
        }, 1);
    });
    $(".reason").on("click", function () {
        $(this).siblings().children("div").removeClass("radioOn");
        $(this).children("div").addClass("radioOn");
        $(".confirmBtn1").css({ "color":"#000"});
        $("#otherReason").val($(this).children("span").html());
    });
    $(".otherReason").bind("input propertychange", function () {
        $(".radioDiv").removeClass("radioOn");
        $(".confirmBtn1").css({ "color":"#000"});
    });
    $(".confirmBtn1").on("click", function () {
        //C端用户取消订单
        renrenc.CancelOrder();
        //样式控制
        $(".popOutCancelReason").css({ "top":"55%", "display":"none" });
        $(".masks").css("display", "none");
        $(".popOutFromCenter,.popOutCancelReason").css({ "z-index":"-10", "opacity":"0", "top":"55%" });
        $(".radioDiv").removeClass("radioOn");
    });
    $(".cancelBtn").on("click", function () {
        setTimeout(function () {
            $(".popOutCancelReason,.masks").css("display", "none");
            $(".popOutCancelReason").css({ "z-index":"-10", "opacity":"0", "top":"55%" });
            $(".radioDiv").removeClass("radioOn");
            $(".otherReason").val("");
        }, 150);
    });

    /*c_workExperience.html*/
    //修改用户工作经历
    renrenc.GetUserWorksDetain = function(){
        var parameters = rrcw.getUrlParam("parameters");
        var updateParameters = parameters.split(",");
        $("#companyName").val(updateParameters[0]);
        $("#position").val(updateParameters[1]);
        $("#selectDate1").val(updateParameters[2]);
        $("#selectDate2").val(updateParameters[3]);
    };
    //调用
    renrenc.GetUserWorksDetain();
    $("#addExperienceGoBack").on("click", function(){
        var parameters = rrcw.getUrlParam("parameters"),
            param = parameters.split(",");
        var userId = rrcw.defaultsC.userid,
            companyName = param[0],
            position = param[1],
            startDate = param[2],
            endDate = param[3];
        var SetUserWorksInfoJson = {
                "user_id":userId,
                "name":companyName,
                "position":position,
                "start_date":startDate,
                "end_date":endDate
            };
        var SetUserWorksInfoUrl = {
                path:"/PlatApi/SetUserWorksInfo"
            };
        rrcw.requestSuccessC(SetUserWorksInfoJson,SetUserWorksInfoUrl,function (req) {
            if(req.Status==0) {
                window.location.href = "c_essentialInfo3.html?userId=" + userId;
            }
        });
    });
    if(rrcw.getUrlParam("remark")=="update"){
        $("#workExperienceAdd").val("修改经历");
    }
    $("#workExperienceAdd").on("click", function(){
        if($("#companyName").val() == ""){
            alert("请填写公司名称");
            return false;
        }else if($("#position").val() == ""){
            alert("请填写职位");
            return false;
        }else if($("#selectDate1").val() == ""){
            alert("请填写开始时间");
            return false;
        }else if($("#selectDate2").val() == ""){
            alert("请填写结束时间");
            return false;
        }else{
            renrenc.SetUserWorksInfo();
        }
    });

    /*c_essentialInfo3.html*/
    $("#addExperience").on("click", function(){
        window.location.href = "c_workExperience.html?userId="+rrcw.getUrlParam("userId");
        renrenc.SetUserInfo3FirstFour();//点击“添加经历”的时候把上面填入的“前四项”信息保存
    });
    $("#essentialInfo3Submit").on("click", function(){
        if($("#selectid1").html() == "请选择" || $("#selectid1").html() == ""){
            alert("请选择技术职称");
            return false;
        }else if($("#selectid1").html() != "无"){
            if($("#img_d").attr("src").length == 0){
                alert("请上传技术职称证书照片");
                return false;
            }else if($("#selectid2").html() == "请选择" || $("#selectid2").html() == ""){
                alert("请选择最高学历");
                return false;
            }else if($("#selectid4").html() == "请选择" || $("#selectid4").html() == ""){
                alert("请选择工作年限");
                return false;
            }else{
                renrenc.SetUserInfo3();
            }
        }else if($("#img_d").attr("src").length != 0){
            alert("检测到您有技术职称证书\n请如实选择技术职称");
            return false;
        }else if($("#selectid2").html() == "请选择" || $("#selectid2").html() == ""){
            alert("请选择最高学历");
            return false;
        }else if($("#selectid4").html() == "请选择" || $("#selectid4").html() == ""){
            alert("请选择工作年限");
            return false;
        }else{
            renrenc.SetUserInfo3();
        }
    });

    /*c_essentialInfo1.html*/
    $("#essentialInfo1Next").on("click", function(){
        if($("#userName").val() == ""){
            alert("请填写姓名");
            return false;
        }else if(!/^[\u4e00-\u9fa5]+$/.test($("#userName").val())){
            alert("便于统一管理\n请输入中文姓名");
            return false;
        }else if(!$(".sexIcon").hasClass("sexTrue")){
            alert("请选择性别");
            return false;
        }else if($("#email").val() == ""){
            alert("请填写邮箱");
            return false;
        }else if(!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test($("#email").val())){
            alert("邮箱格式不正确");
            return false;
        }else if($("#selectAddress").val() == ""){
            alert("请选择省市区");
            return false;
        }else if($("#addressDetails").val() == ""){
            alert("请填写详细地址");
            return false;
        }else if(!/^[\u4e00-\u9fa5#_()a-zA-Z0-9 ]+$/.test($("#addressDetails").val())){
            alert("地址不能输入特殊字符");
            return false;
        }else if($("#selectid").val() == "选择你擅长的领域(1-5项)" || $("#selectid").val() == ""){
            alert("请至少选择一项擅长领域");
            return false;
        }else{
            renrenc.SetUserInfo1();
        }
    });
    //姓名
    $("#userName,#CName1").blur(function(){
        var reg =/^[\u4e00-\u9fa5]+$/;
        var userName = $(this).val();
        if(userName==""){
            return false;
        }else if(!reg.test(userName)){
            alert("便于统一管理\n请输入中文姓名");
        }
    });
    //女
    $(".female").on("click", function(){
        $(this).children(".sexIcon").addClass("femaleIcon sexTrue");
        $(".male").children(".sexIcon").removeClass("maleIcon sexTrue");
    });
    //男
    $(".male").on("click", function(){
        $(this).children(".sexIcon").addClass("maleIcon sexTrue");
        $(".female").children(".sexIcon").removeClass("femaleIcon sexTrue");
    });
    //邮箱
    $("#email").blur(function(){
        var reg =/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        var email = $(this).val();
        if(email==""){
            return false;
        }else if(!reg.test(email)){
            alert("邮箱格式不正确");
        }
    });
    //详细地址
    $("#addressDetails").blur(function(){
        var reg =/^[\u4e00-\u9fa5#_()a-zA-Z0-9 ]+$/;
        var addressDetails = $(this).val();
        if(addressDetails==""){
            return false;
        }else if(!reg.test(addressDetails)){
            alert("地址不能输入特殊字符");
        }
    });
    var count = 0;
    //打开弹窗
    $("#selectid").on("click", function(){

        /*弹窗一出现即标黑用户当前擅长领域所对应的标签卡(开始)*/
        var val = $(this).val().split(" ");
        var len = $(this).val().split(" ").length - 1;
        var arr = new Array(len);
        for(var i=0; i<len; i++){
            arr[i] = val[i];
            $.each($(".popOutFromBottom .item"), function(){
                if($(this).html() == arr[i]+" "){
                    $(this).addClass("active");
                    count = len;
                }
            });
        }
        /*弹窗一出现即标黑用户当前擅长领域所对应的标签卡(结束)*/

        $(".masks").css("display","block");
        $(".popOutFromBottom").css({"z-index":"10","opacity":"1","bottom":"0"});
    });
    //关闭弹窗
    $("#datecancle").on("click", function(){
        count = 0;
        $(".masks").css("display","none");
        $(".popOutFromBottom").css({"bottom":"-12rem"});
        $(".popOutFromBottom .item").removeClass("active");
    });
    //确认
    $("#dateconfirm").on("click", function(){
        $("#selectid").val($(".active").text());//显示选择的值
        $(".masks").css("display","none");
        $(".popOutFromBottom").css({"bottom":"-12rem"});
    });
    //定义选中状态
    $(".popOutFromBottom .itemDiv").on("click",".item",function(){
        console.log("count=",count);
        if($(this).hasClass("active")){
            $(this).removeClass("active");
            count--;
        }else if(count < 5){
            $(this).addClass("active");
            count++;
        }else{
            alert("最多选择5项");
        }
    });

    /*c_essentialInfo2.html*/


    $(".exampleImg").on("click",function(){
        window.location.href = "c_showLocalImg.html";
    });
    $("#essentialInfo2Next").on("click", function(){
        if($("#idNumber").val() == ""){
            alert("请填写身份证号");
            return false;
        }else if(!/^\d{17}(\d|X|x)$/.test($("#idNumber").val()) || $("#idNumber").val().length != 18){
            alert("身份证格式不正确");
            return false;
        }else if($("#img_a").attr("src").length == 0){
            alert("请上传身份证正面照片");
            return false;
        }else if($("#img_b").attr("src").length == 0){
            alert("请上传身份证反面照片");
            return false;
        }else if($("#cardNumber").val() == ""){
            alert("请填写会计上岗证编号");
            return false;
        }/*else if(!/^\d{17}(\d|X|x)$/.test($("#cardNumber").val())){
            alert("会计上岗证格式不正确");
            return false;
        }*/else if($("#img_c").attr("src").length == 0){
            alert("请上传会计上岗证照片");
            return false;
        }else{
            //该页上的表单和照片已经失焦和转码的时候保存过了，故直接跳转下一页。
            var userId = rrcw.defaultsC.userid;
            window.location.href = "c_essentialInfo3.html?userId=" + userId;
        }
    });
    //身份证号
    $("#idNumber").blur(function(){
        var reg =/^\d{17}(\d|X|x)$/;
        var idNumber = $(this).val();
        if(idNumber==""){
            return false;
        }else if(!reg.test(idNumber) || idNumber.length != 18){
            alert("身份证格式不正确");
        }else{
            //失焦就保存
            var userId = rrcw.defaultsC.userid;
            var card = $("#idNumber").val();
            var SetUserInfoJson = {
                    "id":userId,
                    "card":card
                };
            var SetUserInfoUrl = {
                    path:"/PlatApi/SetUserInfo"
                };
            rrcw.requestSuccessC(SetUserInfoJson,SetUserInfoUrl,function (req) {
                if(req.Status==0){
                    console.log("身份证号保存成功！");
                }
            });
        }
    });
    //会计上岗证编号
    $("#cardNumber").blur(function(){
        // var reg =/^\d{17}(\d|X|x)$/;
        var cardNumber = $(this).val();
        if(cardNumber==""){
            return false;
        }/*else if(!reg.test(cardNumber)){
            alert("会计上岗证格式不正确");
        }*/else{
            //失焦就保存
            var userId = rrcw.defaultsC.userid;
            var accountantCard = $("#cardNumber").val();
            var SetUserInfoJson = {
                    "id":userId,
                    "accountant_no":accountantCard
                };
            var SetUserInfoUrl = {
                    path:"/PlatApi/SetUserInfo"
                };
            rrcw.requestSuccessC(SetUserInfoJson,SetUserInfoUrl,function (req) {
                if(req.Status==0){
                    console.log("会计上岗证编号保存成功！");
                }
            });
        }
    });

    /*-----------------------------------------------2016年12月7日js代码整理(结束)-------------------------------------------*/


    c_mobDate = function(content){
        var now = new Date(),
            min = new Date(now.getFullYear() - 20, now.getMonth(), now.getDate()),
            max = new Date(now.getFullYear() + 100, now.getMonth(), now.getDate());
        var instance = mobiscroll.date(content, {
            theme:'ios',
            lang:'zh',
            display:'bottom',
            min:min,
            max:max,
            minWidth:160,
            dateFormat:'yy/mm',
            monthNames:['01','02','03','04','05','06','07','08','09','10','11','12'],
            onSet:function(event,inst){
                $(content).val(event.valueText)
            }
        });
    };
    c_mobArea = function(content){
        var area = mobiscroll.scroller(content,{
            theme:'ios',
            lang:'zh',
            circular :false,
            height :40,
            display:'bottom',
            cssClass :"set-area",
            wheels:[
                [{
                    data:nc_a.province
                },{
                    data:nc_a.city
                },{
                    data:nc_a.county
                }]
            ],
            validate:function (data, inst) {
                var index = data.index,
                    arr = data.values,
                    settings = inst.settings,
                    valid = [];
                if(index >= 0){
                    if(index == 0){
                        c_city(settings.wheels[0][0].data[arr[0]].key);
                        inst.changeWheel({
                            1 :{data:nc_a.city},
                            2 :{data:nc_a.county}
                        }, 300);
                        valid = [arr[0], 0, 0];
                    }else if(index == 1){
                        c_county(settings.wheels[0][1].data[arr[1]].key);
                        inst.changeWheel({
                            2 :{data:nc_a.county}
                        }, 300);
                        valid = [arr[0], arr[1], 0];
                    }

                    if(index < 2){
                        return {
                            valid :valid
                        }
                    }
                }
            },
            onSet:function (event, inst) {
                var arr = inst._tempWheelArray,
                    settings = inst.settings,
                    output = settings.wheels[0][0].data[arr[0]].display + " "
                        + settings.wheels[0][1].data[arr[1]].display + " ";
                output += (settings.wheels[0][2].data.length>0)?settings.wheels[0][2].data[arr[2]].display:"";
                $(content).val(output);
            }
        });
    };
    c_mobScroll = function (content,data) {
        var scroll = mobiscroll.scroller(content,{
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
                $(content).text(event.valueText)
            }
        })
    };
    //初始化区县
    c_county = function(key){
        key = (!key)?nc_a.city[0].key:key;
        if(!nc_a[key]){
            nc_a.county = [];
            return false;
        }
        $.each(nc_a[key], function(i,item) {
            nc_a.county[i] = {key:item[0], value:i, display:item[1]};
        });
    };
    //初始化城市
    c_city = function(key){
        if(key){
            nc_a.city = [];
        }
        key = (!key)?nc_a.province[0].key:key;
        $.each(nc_a[key], function(i,item) {
            nc_a.city[i] = {key:item[0], value:i, display:item[1]};
        });
        c_county(nc_a.city[0].key);
    };

})(jQuery);