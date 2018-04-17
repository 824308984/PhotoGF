// 布局脚本
/*====================================
*基于JQuery 1.9.0主框架
*DTcms管理界面
*作者：一些事情
====================================*/
/* 得到日期年月日等加数字后的日期 */
Date.prototype.dateAdd = function (interval, number) {
    var d = this;
    var k = { 'y': 'FullYear', 'q': 'Month', 'm': 'Month', 'w': 'Date', 'd': 'Date', 'h': 'Hours', 'n': 'Minutes', 's': 'Seconds', 'ms': 'MilliSeconds' };
    var n = { 'q': 3, 'w': 7 };
    eval('d.set' + k[interval] + '(d.get' + k[interval] + '()+' + ((n[interval] || 1) * number) + ')');
    return d;
}
/* 计算两日期相差的日期年月日等 */
Date.prototype.dateDiff = function (interval, objDate2) {
    var d = this, i = {}, t = d.getTime(), t2 = objDate2.getTime();
    i['y'] = objDate2.getFullYear() - d.getFullYear();
    i['q'] = i['y'] * 4 + Math.floor(objDate2.getMonth() / 4) - Math.floor(d.getMonth() / 4);
    i['m'] = i['y'] * 12 + objDate2.getMonth() - d.getMonth();
    i['ms'] = objDate2.getTime() - d.getTime();
    i['w'] = Math.floor((t2 + 345600000) / (604800000)) - Math.floor((t + 345600000) / (604800000));
    i['d'] = Math.floor(t2 / 86400000) - Math.floor(t / 86400000);
    i['h'] = Math.floor(t2 / 3600000) - Math.floor(t / 3600000);
    i['n'] = Math.floor(t2 / 60000) - Math.floor(t / 60000);
    i['s'] = Math.floor(t2 / 1000) - Math.floor(t / 1000);
    return i[interval];
}
//绑定需要浮动的表头
$(function () {
    $(".ltable tr:nth-child(odd)").addClass("odd_bg"); //隔行变色
    $("#floatHead").smartFloat();
    $(".rule-single-checkbox").ruleSingleCheckbox();
    $(".rule-multi-checkbox").ruleMultiCheckbox();
    $(".rule-multi-radio").ruleMultiRadio();
    $(".rule-single-select").ruleSingleSelect();
    $(".rule-multi-porp").ruleMultiPorp();
    $(".rule-date-input").ruleDateInput();

});
//将JSON格式的日期转化为一般格式
function ChangeDateFormat(jsondate) {
    jsondate = jsondate.replace("/Date(", "").replace(")/", "");
    if (jsondate.indexOf("+") > 0) {
        jsondate = jsondate.substring(0, jsondate.indexOf("+"));
    }
    else if (jsondate.indexOf("-") > 0) {
        jsondate = jsondate.substring(0, jsondate.indexOf("-"));
    }

    var date = new Date(parseInt(jsondate, 10));
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return date.getFullYear() + "-" + month + "-" + currentDate;
}
function openFile(me) {
    var vPath = $(me).closest("li").find("input[name='file.strWjlj']").val();
    window.location = vPath;
}

function deletefile(me) {
    var vId = $(me).closest("li").find("input[name='file.strGuid']").val();
    var vPath = $(me).closest("li").find("input[name='file.strWjlj']").val();
    var vPara = "";
    if (vId == null || vId == "") {
        vId = encodeURIComponent(vPath);
        vPara = "&path=" + vId;
    }
    else {
        vPara = "&id=" + vId;
    }
    top.dialog({
        title: '游天地提示您',
        content: "是否删除文件信息？",
        okValue: '确定',
        ok: function () {
            $.ajax({
                url: '../../../tools/Line_ajax.ashx?action=delfile' + vPara,
                type: 'GET',
                error: function () {

                },
                success: function (res) {
                    $(me).closest("li").remove();

                }
            });
            return true;
        },
        cancelValue: '取消',
        cancel: function () { return true }
    }).showModal();
   

}
//全选取消按钮函数
function checkAll(chkobj) {
    if ($(chkobj).text() == "全选") {
        $(chkobj).children("span").text("取消");
        $(".checkall input:enabled").prop("checked", true);
    } else {
        $(chkobj).children("span").text("全选");
        $(".checkall input:enabled").prop("checked", false);
    }
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }

    return null;
}

function SetEmail(formid, emailcode) {
    $("#" + formid).ajaxSubmit({
        success: function (data) {

            return true;
        },
        beforeSubmit: function (data) {

            return true;
        },
        error: function (data) {

            return true;
        },
        url: "../../../tools/Line_ajax.ashx?action=sendemail&emailcode=" + encodeURIComponent(emailcode),
        type: "post",
        dataType: "json",
        timeout: 60000
    });
}

/////////////////////////////////////////////////////////////////////////////////操作通用操作
function ListMeunOpt(formid, id, url, nav) {
   
    $($(top.document).find("iframe[name='line-dialog" + id + "']")[0].contentDocument).find("a[name='optmenu']").on("mousemove", function () {
        $($(top.document).find("iframe[name='line-dialog" + id + "']")[0].contentDocument).find("a[name='optmenu']").removeClass("onmove");
        $(this).addClass("onmove");
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    var vCommand = $($(top.document).find("iframe[name='line-dialog" + id + "']")[0].contentDocument).find("a");
    for (var i = 0; i < vCommand.length; i++) {
        var isurl = $(vCommand[i]).attr("target") == null ? false : true;
        var pagewh = $(vCommand[i]).attr("pagewh") == null ? false : true;
        if (pagewh) {
            $(vCommand[i]).on("click", function () {
                var pagewh = $(this).attr("pagewh").split("|");
                var url = $(this).attr("url");
                var dzmsg = $(this).attr("dzmsg");
                //获得参数，并给参数赋值
                var dzpara = $(this).attr("dzpara");
                top.dialog({
                    title: pagewh[0],
                    width: pagewh[1] + "px",
                    height: pagewh[2] + "px",
                    url: url,
                    onclose: function () {
                        if (this.returnValue == 1) {
                            PageSearch(1);
                        };
                        vdlg.close();
                        vdlg.remove();
                        return true;
                    },
                    quickClose: false
                }).showModal();
            });
        }
        else if (!isurl) {
            $(vCommand[i]).on("click", function () {
                var dzid = $(this).attr("dzid");
                var dztype = $(this).attr("dztype");
                var dzmsg = $(this).attr("dzmsg");
                var commandtype = $(this).attr("commandtype");
                //获得参数，并给参数赋值
                var dzpara = $(this).attr("dzpara");
                top.dialog({
                    title: '提示',
                    content: dzmsg,
                    okValue: '确定',
                    ok: function () {
                        MenuOptComm(formid, dzid, dztype, dzpara, url, nav, commandtype);
                        return true;
                    },
                    cancelValue: '取消',
                    cancel: function () { return true }
                }).showModal();
            });
        }
    }
}
function MenuOptComm(formid, dzid, dztype, dzpara, url, nav, commandtype) {
    if (dztype == "delete") {
        MenuOptDelelteComm(formid, dzid, dzpara, url, nav, commandtype);
    }
    else if (dztype == "update") {
        MenuOptUpdateComm(formid, dzid, dzpara, url, nav, commandtype);
    }
    else if (dztype == "exporttemplete") {
        MenuOptExportData(dzid, dzpara, nav, commandtype);
    }
    else if (dztype == "exportlist") {
        MenuOptExportListData(formid, dzid, dzpara, nav, commandtype);
    }
    else if (dztype == "copy") {
        MenuOptCopyData(formid, dzid, dzpara, url, nav, commandtype);
    }

}

function MenuOptDelelteComm(formid, dzid, dzpara, url, nav, commandtype) {
    if (dzpara == null) {
        dzpara = "";
    }
    else {
        dzpara = "&" + dzpara;
    }
    $("#" + formid).ajaxSubmit({
        success: function (data) {

            //刷新页面
            window.location.href = url;
            vdlg.close(); // 关闭（隐藏）对话框
            vdlg.remove(); 			 // 主动销毁对话框
            return true;
        },
        beforeSubmit: function (data) {

            return true;
        },
        error: function (data) {

            return true;
        },
        url: "../../../tools/Line_ajax.ashx?action=delete&evt=" + dzid + '&nav=' + nav + "&btn=" + commandtype + dzpara,
        type: "post",
        dataType: "json",
        timeout: 60000
    });
}

function MenuOptUpdateComm(formid, dzid, dzpara, url, nav, commandtype) {
    if (dzpara == null) {
        dzpara = "";
    }
    else {
        dzpara = "&" + dzpara;
    }
    $("#" + formid).ajaxSubmit({
        success: function (data) {
            //刷新页面
            window.location.href = url;
            vdlg.close(); // 关闭（隐藏）对话框
            vdlg.remove(); 			 // 主动销毁对话框
            return true;
        },
        beforeSubmit: function (data) {

            return true;
        },
        error: function (data) {

            return true;
        },
        url: "../../../tools/Line_ajax.ashx?action=update&evt=" + dzid + '&nav=' + nav + '&btn=' + commandtype + dzpara, // "&strwhere=" + encodeURIComponent("strGuid='" + id + "'") + "&recguid=" + id,
        type: "post",
        dataType: "json",
        timeout: 60000
    });
}

function MenuOptExportData(dzid, dzpara, nav, commandtype) {
    if (dzpara == null) {
        dzpara = "";
    }
    else {
        dzpara = "&" + dzpara;
    }
    var url = "../../../tools/Line_ajax.ashx?action=exportdata&evt=" + dzid + '&nav=' + nav + '&btn=' + commandtype + dzpara; // "&filename=" + encodeURIComponent(lineName + "行程单") + "&fld=strGuid&fldv=" + id;
    window.location.href = url;
}

function MenuOptExportListData(formid, dzid, dzpara, nav, commandtype) {

    if (dzpara == null) {
        dzpara = "";
    }
    else {
        dzpara = "&" + dzpara;
    }
    $("#" + formid).ajaxSubmit({
        url: '../../../tools/Line_ajax.ashx?action=exportpagelist&evt=' + dzid + '&nav=' + nav + '&btn=' + commandtype + dzpara,
        type: "post",
        dataType: "json",
        timeout: 60000,
        error: function (res) {
        },
        success: function (res) {
            if (res.status == 0) {
                var d = top.dialog({
                    content: "<div style=\"margin:0; padding:0; text-align:center; vertical-align:middle;font-size:14px;font-weight:bold\">" + res.info + "</div>",
                    width: "200px",
                    height: "60px"
                }).show();

                setTimeout(function () {
                    d.close().remove();
                }, 2000);
            }

            var url = '../../../tools/Line_ajax.ashx?action=doexportdownfile&file=' + encodeURIComponent(res.info);
            window.location.href = url;


        }
    });
}



function MenuOptCopyData(formid, dzid, dzpara, url, nav, commandtype) {

    $("#" + formid).ajaxSubmit({
        success: function (data) {
            if (data.status == 1) { //成功
                var d = top.dialog({ content: data.info }).show();

                setTimeout(function () {
                    d.close().remove();
                    location.href = url;
                }, 2000);
            } else { //失败
                top.dialog({ title: '提示', content: data.info, okValue: '确定', ok: function () { } }).showModal();


            }
            return true;
        },
        beforeSubmit: function (data) {

            return true;
        },
        error: function (data) {

            return true;
        },
        url: "../../../tools/Line_ajax.ashx?action=copyline&evt=" + dzid + '&nav=' + nav + '&btn=' + commandtype + "&site=" + encodeURIComponent(url) + "&" + dzpara,
        type: "post",
        dataType: "json",
        timeout: 60000
    });
}
////////////////////////////////////////////////////////////////////////通用操作结束


//随机码
function rnd() {
    var random = Math.floor(Math.random() * 10001);
    var id = (random + "_" + new Date().getTime()).toString();
    return id;
}
/**
* 判断是否含有某个className
* @param {Element}
* @param {String}
*/
function HasClss(el, cls) {
    var re = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    return re.test(el.className);
}
function DateFormat(d1) {

    //;
    var OsObject = "";
    if (navigator.userAgent.indexOf("MSIE 6.0") > 0 || navigator.userAgent.indexOf("MSIE 7.0") > 0 || navigator.userAgent.indexOf("MSIE 8.0") > 0) {
        OsObject = "MSIE";
    }
    if (OsObject == "MSIE") {
        d1 = d1.replace(/-/g, "/");
    }
    var vsd = new Date(d1);
    var year = vsd.getFullYear();
    var month = vsd.getMonth() + 1;
    var day = vsd.getDate();
    var hour = vsd.getHours();
    var minute = vsd.getMinutes();
    var second = vsd.getSeconds();
    var vData = year;
    if (month < 10) {
        month = "0" + month;
    }

    if (day < 10) {
        day = "0" + day;
    }

    if (hour < 10) {
        hour = "0" + hour;
    }

    if (minute < 10) {
        minute = "0" + minute;
    }

    if (second < 10) {
        second = "0" + second;
    }
    return vData + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;

}


function DateFormatGetMonth(d1) {

    //;
    var OsObject = "";
    if (navigator.userAgent.indexOf("MSIE 6.0") > 0 || navigator.userAgent.indexOf("MSIE 7.0") > 0 || navigator.userAgent.indexOf("MSIE 8.0") > 0) {
        OsObject = "MSIE";
    }
    if (OsObject == "MSIE") {
        d1 = d1.replace(/-/g, "/");
    }
    var vsd = new Date(d1);
    var year = vsd.getFullYear();
    var month = vsd.getMonth() + 1;
    var day = vsd.getDate();
    var hour = vsd.getHours();
    var minute = vsd.getMinutes();
    var second = vsd.getSeconds();
   
    return month ;

}
function DateFormatForDate(d1) {

    //var t = '2014-02-26T21:18:02.497'
    //    var a = d1.replace(/(\d{4})-(\d{2})-(\d{2})T(.*)?\.(.*)/, "$1/$2/$3 $4")
    var OsObject = "";
    if (navigator.userAgent.indexOf("MSIE 6.0") > 0 || navigator.userAgent.indexOf("MSIE 7.0") > 0 || navigator.userAgent.indexOf("MSIE 8.0") > 0) {
        OsObject = "MSIE";
    }
    if (OsObject == "MSIE") {
        d1 = d1.replace(/-/g, "/");
    }
    var vsd = new Date(d1);
    var year = vsd.getFullYear();
    var month = vsd.getMonth() + 1;
    var day = vsd.getDate();
    var hour = vsd.getHours();
    var minute = vsd.getMinutes();
    var second = vsd.getSeconds();
    var vData = year;
    if (month < 10) {
        month = "0" + month;
    }

    if (day < 10) {
        day = "0" + day;
    }


    return vData + "-" + month + "-" + day;

}

//查询
function DoSearch(res, tbid, cols, vHideText, vHeadObj) {
    if (res.length > 0 && res[0].trhtml != "") {
        var vHead = $("#" + tbid).find("tr")[0];
        var vHeadText = $(vHead).html();
        
        $("#" + tbid).empty();
        var vTr = '<thead><tr>' + vHeadText + '</tr></thead>';
        if (vHeadObj != null) {
            vTr = '<thead><tr class="datagrid-header-row">' + vHeadText + '</tr><tr class="datagrid-header-row">' + vHeadObj + '</tr></thead>';
        }
        vTr += vHideText;
        vTr += res[0].trhtml;
        $("#" + tbid).append(vTr);
        if (res.length > 0) {
            $("#pageContent").html(res[0].pagehtml);
        }
        $('tr[name="lineData"]').on('click', function () {


        });
    } else {
        var vHead = $("#" + tbid).find("tr")[0];
        var vHeadText = $(vHead).html();

        $("#" + tbid).empty();
        var vTr = '<tr>' + vHeadText + '</tr>';
        if (vHeadObj != null) {
            vTr = '<thead><tr class="datagrid-header-row">' + vHeadText + '</tr><tr class="datagrid-header-row">' + vHeadObj + '</tr></thead>';
        }
        vTr += vHideText;
        vTr += "<tr  name='lineData' linedata='[strGuid]'><td colspan='" + cols + "' style='font-size:14px;font-weight:bold; text-align:center'>未查询到数据！</td></tr>";
        $("#pageContent").html("");
        $("#" + tbid).append(vTr);
    }
    tablerowcolor();
}


//查询
function DoSearchDefine(res, tbid, vHideText) {
    if (res.length > 0 && res[0].trhtml != "") {

        var vTr = "";
        vTr = vHideText + res[0].trhtml;
        $("#" + tbid).html(vTr);
        if (res.length > 0) {
            $("#pageContent").html(res[0].pagehtml);
        }
        $('tr[name="lineData"]').on('click', function () {


        });
    } else {

        var vTr = vHideText + "<li class='purchase-purchase' name='lineData'><span></span>无数据</li>";
        $("#pageContent").html("");
        $("#" + tbid).html(vTr);
    }
    tablerowcolor();
}
//导出
function DoExport(vHeadText, vWhere, evt) {

    if (evt == null) {
        return alert("请传入事件编号！");
    }

    var url = '../../../tools/Line_ajax.ashx?action=exportpagelist&evt=' + evt + '&strwhere=' + encodeURIComponent(vWhere) + "&head=" + encodeURIComponent(vHeadText);
    window.location.href = url;

}

function DoExportDownFile(formid, vNav, evt, para) {
    if (para == null) {
        para = "";
    }
    $("#" + formid).ajaxSubmit({
        url: '../../../tools/Line_ajax.ashx?action=exportpagelist&evt=' + evt + '&nav=' + vNav + para,
        type: "post",
        dataType: "json",
        timeout: 60000,
        error: function (res) {
        },
        success: function (res) {
            if (res.status == 0) {
                var d = top.dialog({
                    content: "<div style=\"margin:0; padding:0; text-align:center; vertical-align:middle;font-size:14px;font-weight:bold\">" + res.info + "</div>",
                    width: "200px",
                    height: "60px"
                }).show();

                setTimeout(function () {
                    d.close().remove();
                }, 2000);
            }

            var url = '../../../tools/Line_ajax.ashx?action=doexportdownfile&file=' + encodeURIComponent(res.info);
            window.location.href = url;


        }
    });
}
function cutstring(text, len) {
    if (text.length > len) {
        return text.substring(0, len) + "…";
    }
    return text;
}
function isInteger(str) {
    if (str == '') { return true; }

    if (/^(\-?)(\d+)$/.test(str)) {
        return true;
    } else {
        return false;
    }
}

function isIntegert(oInput) {
    //    var str = oInput.value;
    //    if (str == '') {oInput.value = "" ; }

    //    if (/^(\-?)(\d+)$/.test(str)) {
    //       
    //    } else {
    //        oInput.value = ""
    //    }

    if ('' != oInput.value.replace(/(-\d{0,}|\d{1,})/, '') || '-' != oInput.value.replace(/(-\d{0,}|\d{1,})/, '')) {
        if (oInput.value != null && oInput.value != "") {

            oInput.value = oInput.value.match(/(-\d{0,}|\d{1,})/) == null ? '' : oInput.value.match(/(-\d{0,}|\d{1,})/)[0];
        }
    }
}

function IntFloat(oInput) {
    if ('' != oInput.value.replace(/^-{0,1}\d{1,}\.{0,1}\d{0,}/, '') || '-' != oInput.value.replace(/^-{0,1}\d{1,}\.{0,1}\d{0,}/, '')) {
        if (oInput.value != null && oInput.value != "") {

            oInput.value = oInput.value.match(/(-\d{0,}|\d{1,})\.{0,1}\d{0,}/) == null ? '' : oInput.value.match(/(-\d{0,}|\d{1,})\.{0,1}\d{0,}/)[0];
        }
    }
}


function onlyNum(obj) {
    // ; 
    if (!(event.keyCode == 46) && !(event.keyCode == 8) && !(event.keyCode == 37) && !(event.keyCode == 39)) {
        if (!((event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105))) {
            if (obj.value != null && obj.value != "") {
                if (!isNumber(obj.value)) {
                    obj.value = "";
                }
            }
            event.returnValue = false;
        }
    }
    $(obj).unbind("change");
    $(obj).bind("change", function () {
        if (obj.value != null && obj.value != "") {
            if (!isNumber(obj.value)) {
                obj.value = "";
            }
        }
    })
    // $(obj).trigger("change"); 
}
//===========================工具类函数============================
//只允许输入数字
function checkNumber(e) {

    var keynum = window.event ? e.keyCode : e.which;
    if ((48 <= keynum && keynum <= 57) || keynum == 8) {
        return true;
    } else {
        return false;
    }
}

function isNumber(str) {
    if (str == '') { return true; }

    //if(/^(\-?)(\d+)$/.test(str)||/^(\-?)(\d+)(.{1})(\d+)$/g.test(str))
    if (/^(\+|-)?\d+($|\.\d+$)/.test(str)) {
        return true;
    } else {
        return false;
    }
}
//只允许输入小数
function checkForFloat(obj, e) {
    var isOK = false;
    var key = window.event ? e.keyCode : e.which;
    if ((key > 95 && key < 106) || //小键盘上的0到9  
        (key > 47 && key < 60) ||  //大键盘上的0到9  
        (key == 110 && obj.value.indexOf(".") < 0) || //小键盘上的.而且以前没有输入.  
        (key == 190 && obj.value.indexOf(".") < 0) || //大键盘上的.而且以前没有输入.  
         key == 8 || key == 9 || key == 46 || key == 37 || key == 39) {
        isOK = true;
    } else {
        if (window.event) { //IE
            e.returnValue = false;   //event.returnValue=false 效果相同.    
        } else { //Firefox 
            e.preventDefault();
        }
    }
    return isOK;
}
//检查短信字数
function checktxt(obj, txtId) {
    var txtCount = $(obj).val().length;
    if (txtCount < 1) {
        return false;
    }
    var smsLength = Math.ceil(txtCount / 62);
    $("#" + txtId).html("您已输入<b>" + txtCount + "</b>个字符，将以<b>" + smsLength + "</b>条短信扣取费用。");
}
//四舍五入函数
function ForDight(Dight, How) {
    Dight = Math.round(Dight * Math.pow(10, How)) / Math.pow(10, How);
    return Dight;
}
//写Cookie
function addCookie(objName, objValue, objHours) {
    var str = objName + "=" + escape(objValue);
    if (objHours > 0) {//为0时不设定过期时间，浏览器关闭时cookie自动消失
        var date = new Date();
        var ms = objHours * 3600 * 1000;
        date.setTime(date.getTime() + ms);
        str += "; expires=" + date.toGMTString();
    }
    document.cookie = str;
}

//读Cookie
function getCookie(objName) {//获取指定名称的cookie的值
    var arrStr = document.cookie.split("; ");
    for (var i = 0; i < arrStr.length; i++) {
        var temp = arrStr[i].split("=");
        if (temp[0] == objName) return unescape(temp[1]);
    }
    return "";
}

//========================基于artdialog插件========================
//可以自动关闭的提示，基于artdialog插件
function jsprint(msgtitle, url, callback, para) {

    var d = dialog({ content: msgtitle }).show();
    setTimeout(function () {
        d.close().remove();
    }, 2000);
    if (url == "back") {
        frames["mainframe"].history.back(-1);
    } else if (url != "") {
        frames["mainframe"].location.href = url;
    }

    //执行回调函数
    if (arguments.length == 3) {
        callback();
    }
    if (arguments.length == 4) {
        var vpara = para.split('|');
        if (vpara.length == 1) {
            callback(vpara[0]);
        }
        else if (vpara.length == 2) {
            callback(vpara[0], vpara[1]);
        }
        else if (vpara.length == 3) {
            callback(vpara[0], vpara[1], vpara[2]);
        } else if (vpara.length == 4) {
            callback(vpara[0], vpara[1], vpara[2], vpara[4]);
        }
    }
}
//弹出一个Dialog窗口
function jsdialog(msgtitle, msgcontent, url, callback) {
    var d = dialog({
        title: msgtitle,
        content: msgcontent,
        okValue: '确定',
        ok: function () { },
        onclose: function () {
            if (url == "back") {
                history.back(-1);
            } else if (url != "") {
                location.href = url;
            }
            //执行回调函数
            if (argnum == 5) {
                callback();
            }
        }
    }).showModal();
}
//弹出一个Dialog窗口
function jsdialog1(msgtitle, msgcontent, url, callback) {
    var d = dialog({
        title: msgtitle,
        content: msgcontent,
        okValue: '确定',
        ok: function () { },
        onclose: function () {
             
        }
    }).showModal();
}
//打开一个最大化的Dialog
function ShowMaxDialog(tit, url) {
    dialog({
        title: tit,
        url: url
    }).showModal();
}
//执行回传函数
function ExePostBack(objId, objmsg) {
    if ($(".checkall input:checked").size() < 1) {
        parent.dialog({
            title: '提示',
            content: '对不起，请选中您要操作的记录！',
            okValue: '确定',
            ok: function () { }
        }).showModal();
        return false;
    }
    var msg = "删除记录后不可恢复，您确定吗？";
    if (arguments.length == 2) {
        msg = objmsg;
    }
    parent.dialog({
        title: '提示',
        content: msg,
        okValue: '确定',
        ok: function () {
            __doPostBack(objId, '');
        },
        cancelValue: '取消',
        cancel: function () { }
    }).showModal();

    return false;
}
//检查是否有选中再决定回传
function CheckPostBack(objId, objmsg) {
    var msg = "对不起，请选中您要操作的记录！";
    if (arguments.length == 2) {
        msg = objmsg;
    }
    if ($(".checkall input:checked").size() < 1) {
        parent.dialog({
            title: '提示',
            content: msg,
            okValue: '确定',
            ok: function () { }
        }).showModal();
        return false;
    }
    __doPostBack(objId, '');
    return false;
}
//执行回传无复选框确认函数
function ExeNoCheckPostBack(objId, objmsg) {
    var msg = "删除记录后不可恢复，您确定吗？";
    if (arguments.length == 2) {
        msg = objmsg;
    }
    parent.dialog({
        title: '提示',
        content: msg,
        okValue: '确定',
        ok: function () {
            __doPostBack(objId, '');
        },
        cancelValue: '取消',
        cancel: function () { }
    }).showModal();

    return false;
}
//======================以上基于artdialog插件======================

//========================基于Validform插件========================
//初始化验证表单
$.fn.initValidform = function () {
    var checkValidform = function (formObj) {
        $(formObj).Validform({
            tiptype: function (msg, o, cssctl) {
                /*msg：提示信息;
                o:{obj:*,type:*,curform:*}
                obj指向的是当前验证的表单元素（或表单对象）；
                type指示提示的状态，值为1、2、3、4， 1：正在检测/提交数据，2：通过验证，3：验证失败，4：提示ignore状态；
                curform为当前form对象;
                cssctl:内置的提示信息样式控制函数，该函数需传入两个参数：显示提示信息的对象 和 当前提示的状态（既形参o中的type）；*/
                //全部验证通过提交表单时o.obj为该表单对象;
                if (!o.obj.is("form")) {
                    //定位到相应的Tab页面
                    if (o.obj.is(o.curform.find(".Validform_error:first"))) {
                        var tabobj = o.obj.parents(".tab-content"); //显示当前的选项
                        var tabindex = $(".tab-content").index(tabobj); //显示当前选项索引
                        if (!$(".content-tab ul li").eq(tabindex).children("a").hasClass("selected")) {
                            $(".content-tab ul li a").removeClass("selected");
                            $(".content-tab ul li").eq(tabindex).children("a").addClass("selected");
                            $(".tab-content").hide();
                            tabobj.show();
                        }
                    }
                    //页面上不存在提示信息的标签时，自动创建;
                    if (o.obj.parents("dd").find(".Validform_checktip").length == 0) {
                        o.obj.parents("dd").append("<span class='Validform_checktip' />");
                        o.obj.parents("dd").next().find(".Validform_checktip").remove();
                    }
                    var objtip = o.obj.parents("dd").find(".Validform_checktip");
                    cssctl(objtip, o.type);
                    objtip.text(msg);
                }
            },
            showAllError: true
        });
    };
    return $(this).each(function () {
        checkValidform($(this));
    });
}
//======================以上基于Validform插件======================

//智能浮动层函数
$.fn.smartFloat = function () {
    var position = function (element) {
        var obj = element.children("div");
        var top = obj.position().top;
        var pos = obj.css("position");
        $(window).scroll(function () {
            var scrolls = $(this).scrollTop();
            if (scrolls > top) {
                obj.width(element.width());
                element.height(obj.outerHeight());
                if (window.XMLHttpRequest) {
                    obj.css({
                        position: "fixed",
                        top: 0
                    });
                } else {
                    obj.css({
                        top: scrolls
                    });
                }
            } else {
                obj.css({
                    position: pos,
                    top: top
                });
            }
        });
    };
    return $(this).each(function () {
        position($(this));
    });
};

//复选框
$.fn.ruleSingleCheckbox = function () {
    var singleCheckbox = function (parentObj) {
        //查找复选框
        var checkObj = parentObj.children('input:checkbox').eq(0);
        parentObj.children().hide();
        //添加元素及样式
        var newObj = $('<a href="javascript:;">'
		+ '<i class="off">否</i>'
		+ '<i class="on">是</i>'
		+ '</a>').prependTo(parentObj);
        parentObj.addClass("single-checkbox");
        //判断是否选中
        if (checkObj.prop("checked") == true) {
            newObj.addClass("selected");
        }
        //检查控件是否启用
        if (checkObj.prop("disabled") == true) {
            newObj.css("cursor", "default");
            return;
        }
        //绑定事件
        newObj.click(function () {
            if ($(this).hasClass("selected")) {
                $(this).removeClass("selected");
            } else {
                $(this).addClass("selected");
            }
            checkObj.trigger("click"); //触发对应的checkbox的click事件
        });
        //绑定反监听事件
        checkObj.on('click', function () {
            if ($(this).prop("checked") == true && !newObj.hasClass("selected")) {
                alert();
                newObj.addClass("selected");
            } else if ($(this).prop("checked") == false && newObj.hasClass("selected")) {
                newObj.removeClass("selected");
            }
        });
    };
    return $(this).each(function () {
        singleCheckbox($(this));
    });
};

//多项复选框
$.fn.ruleMultiCheckbox = function () {
    var multiCheckbox = function (parentObj) {
        parentObj.addClass("multi-checkbox"); //添加样式
        parentObj.children().hide(); //隐藏内容
        var divObj = $('<div class="boxwrap"></div>').prependTo(parentObj); //前插入一个DIV
        parentObj.find(":checkbox").each(function () {
            var indexNum = parentObj.find(":checkbox").index(this); //当前索引
            var newObj = $('<a href="javascript:;">' + parentObj.find('label').eq(indexNum).text() + '</a>').appendTo(divObj); //查找对应Label创建选项
            if ($(this).prop("checked") == true) {
                newObj.addClass("selected"); //默认选中
            }
            //检查控件是否启用
            if ($(this).prop("disabled") == true) {
                newObj.css("cursor", "default");
                return;
            }
            //绑定事件
            $(newObj).click(function () {
                if ($(this).hasClass("selected")) {
                    $(this).removeClass("selected");
                    //parentObj.find(':checkbox').eq(indexNum).prop("checked",false);
                } else {
                    $(this).addClass("selected");
                    //parentObj.find(':checkbox').eq(indexNum).prop("checked",true);
                }
                parentObj.find(':checkbox').eq(indexNum).trigger("click"); //触发对应的checkbox的click事件
                //alert(parentObj.find(':checkbox').eq(indexNum).prop("checked"));
            });
        });
    };
    return $(this).each(function () {
        multiCheckbox($(this));
    });
}

//多项选项PROP
$.fn.ruleMultiPorp = function () {

    var multiPorp = function (parentObj) {
        parentObj.addClass("multi-porp"); //添加样式
        parentObj.children().hide(); //隐藏内容
        var divObj = $('<ul></ul>').prependTo(parentObj); //前插入一个DIV
        parentObj.find(":checkbox").each(function () {
            var indexNum = parentObj.find(":checkbox").index(this); //当前索引
            var liObj = $('<li></li>').appendTo(divObj)
            var newObj = $('<a href="javascript:;">' + parentObj.find('label').eq(indexNum).text() + '</a><i></i>').appendTo(liObj); //查找对应Label创建选项
            if ($(this).prop("checked") == true) {
                liObj.addClass("selected"); //默认选中
            }
            //检查控件是否启用
            if ($(this).prop("disabled") == true) {
                newObj.css("cursor", "default");
                return;
            }
            //绑定事件
            $(newObj).click(function () {
                if ($(this).parent().hasClass("selected")) {
                    $(this).parent().removeClass("selected");
                } else {
                    $(this).parent().addClass("selected");
                }
                parentObj.find(':checkbox').eq(indexNum).trigger("click"); //触发对应的checkbox的click事件
                //alert(parentObj.find(':checkbox').eq(indexNum).prop("checked"));
            });
        });
    };
    return $(this).each(function () {
        multiPorp($(this));
    });
}


//多项单选
$.fn.ruleMultiRadio = function () {
    var multiRadio = function (parentObj) {
        parentObj.addClass("multi-radio"); //添加样式
        parentObj.children().hide(); //隐藏内容
        var divObj = $('<div class="boxwrap"></div>').prependTo(parentObj); //前插入一个DIV
        parentObj.find('input[type="radio"]').each(function () {
            var indexNum = parentObj.find('input[type="radio"]').index(this); //当前索引
            var newObj = $('<a href="javascript:;">' + parentObj.find('label').eq(indexNum).text() + '</a>').appendTo(divObj); //查找对应Label创建选项
            if ($(this).prop("checked") == true) {
                newObj.addClass("selected"); //默认选中
            }
            //检查控件是否启用
            if ($(this).prop("disabled") == true) {
                newObj.css("cursor", "default");
                return;
            }
            //绑定事件
            $(newObj).click(function () {
                $(this).siblings().removeClass("selected");
                $(this).addClass("selected");
                parentObj.find('input[type="radio"]').prop("checked", false);
                parentObj.find('input[type="radio"]').eq(indexNum).prop("checked", true);
                parentObj.find('input[type="radio"]').eq(indexNum).trigger("click"); //触发对应的radio的click事件
                //alert(parentObj.find('input[type="radio"]').eq(indexNum).prop("checked"));
            });
        });
    };
    return $(this).each(function () {
        multiRadio($(this));
    });
}

//单选下拉框
$.fn.ruleSingleSelect = function () {
    var singleSelect = function (parentObj) {
        parentObj.addClass("single-select"); //添加样式
        parentObj.children().hide(); //隐藏内容
        var divObj = $('<div class="boxwrap"></div>').prependTo(parentObj); //前插入一个DIV
        //创建元素
        var titObj = $('<a class="select-tit" href="javascript:;"><span></span><i></i></a>').appendTo(divObj);
        var itemObj = $('<div class="select-items"><ul></ul></div>').appendTo(divObj);
        var arrowObj = $('<i class="arrow"></i>').appendTo(divObj);
        var selectObj = parentObj.find("select").eq(0); //取得select对象
        //遍历option选项
        selectObj.find("option").each(function (i) {
            var indexNum = selectObj.find("option").index(this); //当前索引
            var liObj = $('<li>' + $(this).text() + '</li>').appendTo(itemObj.find("ul")); //创建LI
            if ($(this).prop("selected") == true) {
                liObj.addClass("selected");
                titObj.find("span").text($(this).text());
            }
            //检查控件是否启用
            if ($(this).prop("disabled") == true) {
                liObj.css("cursor", "default");
                return;
            }
            //绑定事件
            liObj.click(function () {
                $(this).siblings().removeClass("selected");
                $(this).addClass("selected"); //添加选中样式
                selectObj.find("option").prop("selected", false);
                selectObj.find("option").eq(indexNum).prop("selected", true); //赋值给对应的option
                titObj.find("span").text($(this).text()); //赋值选中值
                arrowObj.hide();
                itemObj.hide(); //隐藏下拉框
                selectObj.trigger("change"); //触发select的onchange事件
                //alert(selectObj.find("option:selected").text());
            });
        });
        //设置样式
        //titObj.css({ "width": titObj.innerWidth(), "overflow": "hidden" });
        //itemObj.children("ul").css({ "max-height": $(document).height() - titObj.offset().top - 62 });

        //检查控件是否启用
        if (selectObj.prop("disabled") == true) {
            titObj.css("cursor", "default");
            return;
        }
        //绑定单击事件
        titObj.click(function (e) {
            e.stopPropagation();
            if (itemObj.is(":hidden")) {
                //隐藏其它的下位框菜单
                $(".single-select .select-items").hide();
                $(".single-select .arrow").hide();
                //位于其它无素的上面
                arrowObj.css("z-index", "1");
                itemObj.css("z-index", "1");
                //显示下拉框
                arrowObj.show();
                itemObj.show();
            } else {
                //位于其它无素的上面
                arrowObj.css("z-index", "");
                itemObj.css("z-index", "");
                //隐藏下拉框
                arrowObj.hide();
                itemObj.hide();
            }
        });
        //绑定页面点击事件
        $(document).click(function (e) {
            selectObj.trigger("blur"); //触发select的onblure事件
            arrowObj.hide();
            itemObj.hide(); //隐藏下拉框
        });
    };
    return $(this).each(function () {
        singleSelect($(this));
    });
}

//日期控件
$.fn.ruleDateInput = function () {
    var dateInput = function (parentObj) {
        parentObj.wrap('<div class="date-input"></div>');
        parentObj.before('<i></i>');
    };
    return $(this).each(function () {
        dateInput($(this));
    });
}

//loading效果
GetLoading = function () {
    !function (a, b) { "object" == typeof exports ? module.exports = b() : "function" == typeof define && define.amd ? define(b) : a.Spinner = b() } (this, function () { "use strict"; function a(a, b) { var c, d = document.createElement(a || "div"); for (c in b) d[c] = b[c]; return d } function b(a) { for (var b = 1, c = arguments.length; c > b; b++) a.appendChild(arguments[b]); return a } function c(a, b, c, d) { var e = ["opacity", b, ~ ~(100 * a), c, d].join("-"), f = .01 + c / d * 100, g = Math.max(1 - (1 - a) / b * (100 - f), a), h = j.substring(0, j.indexOf("Animation")).toLowerCase(), i = h && "-" + h + "-" || ""; return m[e] || (k.insertRule("@" + i + "keyframes " + e + "{0%{opacity:" + g + "}" + f + "%{opacity:" + a + "}" + (f + .01) + "%{opacity:1}" + (f + b) % 100 + "%{opacity:" + a + "}100%{opacity:" + g + "}}", k.cssRules.length), m[e] = 1), e } function d(a, b) { var c, d, e = a.style; if (b = b.charAt(0).toUpperCase() + b.slice(1), void 0 !== e[b]) return b; for (d = 0; d < l.length; d++) if (c = l[d] + b, void 0 !== e[c]) return c } function e(a, b) { for (var c in b) a.style[d(a, c) || c] = b[c]; return a } function f(a) { for (var b = 1; b < arguments.length; b++) { var c = arguments[b]; for (var d in c) void 0 === a[d] && (a[d] = c[d]) } return a } function g(a, b) { return "string" == typeof a ? a : a[b % a.length] } function h(a) { this.opts = f(a || {}, h.defaults, n) } function i() { function c(b, c) { return a("<" + b + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', c) } k.addRule(".spin-vml", "behavior:url(#default#VML)"), h.prototype.lines = function (a, d) { function f() { return e(c("group", { coordsize: k + " " + k, coordorigin: -j + " " + -j }), { width: k, height: k }) } function h(a, h, i) { b(m, b(e(f(), { rotation: 360 / d.lines * a + "deg", left: ~ ~h }), b(e(c("roundrect", { arcsize: d.corners }), { width: j, height: d.scale * d.width, left: d.scale * d.radius, top: -d.scale * d.width >> 1, filter: i }), c("fill", { color: g(d.color, a), opacity: d.opacity }), c("stroke", { opacity: 0 })))) } var i, j = d.scale * (d.length + d.width), k = 2 * d.scale * j, l = -(d.width + d.length) * d.scale * 2 + "px", m = e(f(), { position: "absolute", top: l, left: l }); if (d.shadow) for (i = 1; i <= d.lines; i++) h(i, -2, "progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)"); for (i = 1; i <= d.lines; i++) h(i); return b(a, m) }, h.prototype.opacity = function (a, b, c, d) { var e = a.firstChild; d = d.shadow && d.lines || 0, e && b + d < e.childNodes.length && (e = e.childNodes[b + d], e = e && e.firstChild, e = e && e.firstChild, e && (e.opacity = c)) } } var j, k, l = ["webkit", "Moz", "ms", "O"], m = {}, n = { lines: 12, length: 7, width: 5, radius: 10, scale: 1, corners: 1, color: "#000", opacity: .25, rotate: 0, direction: 1, speed: 1, trail: 100, fps: 20, zIndex: 2e9, className: "spinner", top: "50%", left: "50%", shadow: !1, hwaccel: !1, position: "absolute" }; if (h.defaults = {}, f(h.prototype, { spin: function (b) { this.stop(); var c = this, d = c.opts, f = c.el = a(null, { className: d.className }); if (e(f, { position: d.position, width: 0, zIndex: d.zIndex, left: d.left, top: d.top }), b && b.insertBefore(f, b.firstChild || null), f.setAttribute("role", "progressbar"), c.lines(f, c.opts), !j) { var g, h = 0, i = (d.lines - 1) * (1 - d.direction) / 2, k = d.fps, l = k / d.speed, m = (1 - d.opacity) / (l * d.trail / 100), n = l / d.lines; !function o() { h++; for (var a = 0; a < d.lines; a++) g = Math.max(1 - (h + (d.lines - a) * n) % l * m, d.opacity), c.opacity(f, a * d.direction + i, g, d); c.timeout = c.el && setTimeout(o, ~ ~(1e3 / k)) } () } return c }, stop: function () { var a = this.el; return a && (clearTimeout(this.timeout), a.parentNode && a.parentNode.removeChild(a), this.el = void 0), this }, lines: function (d, f) { function h(b, c) { return e(a(), { position: "absolute", width: f.scale * (f.length + f.width) + "px", height: f.scale * f.width + "px", background: b, boxShadow: c, transformOrigin: "left", transform: "rotate(" + ~ ~(360 / f.lines * k + f.rotate) + "deg) translate(" + f.scale * f.radius + "px,0)", borderRadius: (f.corners * f.scale * f.width >> 1) + "px" }) } for (var i, k = 0, l = (f.lines - 1) * (1 - f.direction) / 2; k < f.lines; k++) i = e(a(), { position: "absolute", top: 1 + ~(f.scale * f.width / 2) + "px", transform: f.hwaccel ? "translate3d(0,0,0)" : "", opacity: f.opacity, animation: j && c(f.opacity, f.trail, l + k * f.direction, f.lines) + " " + 1 / f.speed + "s linear infinite" }), f.shadow && b(i, e(h("#000", "0 0 4px #000"), { top: "2px" })), b(d, b(i, h(g(f.color, k), "0 0 1px rgba(0,0,0,.1)"))); return d }, opacity: function (a, b, c) { b < a.childNodes.length && (a.childNodes[b].style.opacity = c) } }), "undefined" != typeof document) { k = function () { var c = a("style", { type: "text/css" }); return b(document.getElementsByTagName("head")[0], c), c.sheet || c.styleSheet } (); var o = e(a("group"), { behavior: "url(#default#VML)" }); !d(o, "transform") && o.adj ? i() : j = d(o, "animation") } return h });
    var vOptType = "add";
    var wi = document.body.clientWidth * 1 / 2 + "px";
    var opts = {
        lines: 9, // 花瓣数目
        length: 20, // 花瓣长度
        width: 5, // 花瓣宽度
        radius: 15, // 花瓣距中心半径
        corners: 1, // 花瓣圆滑度 (0-1)
        rotate: 0, // 花瓣旋转角度
        direction: 1, // 花瓣旋转方向 1: 顺时针, -1: 逆时针
        color: '#5882FA', // 花瓣颜色
        speed: 1, // 花瓣旋转速度
        trail: 60, // 花瓣旋转时的拖影(百分比)
        shadow: true, // 花瓣是否显示阴影
        hwaccel: false, //spinner 是否启用硬件加速及高速旋转            
        className: 'spinner', // spinner css 样式名称
        zIndex: 2e9, // spinner的z轴 (默认是2000000000)
        top: 'auto', // spinner 相对父容器Top定位 单位 px
        left: wi// spinner 相对父容器Left定位 单位 px
    };

    var spinner = new Spinner(opts);
    return spinner;
}
dlg = function (strContent) {
    top.dialog({
        title: "提示",
        content: strContent,
        okValue: "关闭",
        ok: function () {
            return true;
        }
    }).showModal();
}

var vcity = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古",
    21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏",
    33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南",
    42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆",
    51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃",
    63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外"
};

checkCard = function (card) {

    var vs = $(card).val();
    //是否为空
    if (vs === '') {
        alert('请输入身份证号，身份证号不能为空');
        $(card).focus();
        return false;
    }
    //校验长度，类型
    if (isCardNo(vs) === false) {
        alert('您输入的身份证号码不正确，请重新输入');
        $(card).focus();
        return false;
    }
    //检查省份
    if (checkProvince(vs) === false) {
        alert('您输入的身份证号码不正确,请重新输入');
        $(card).focus();
        return false;
    }
    //校验生日
    if (checkBirthday(vs) === false) {
        alert('您输入的身份证号码生日不正确,请重新输入');
        $(card).focus();
        return false;
    }
    //检验位的检测
    if (checkParity(vs) === false) {
        alert('您的身份证校验位不正确,请重新输入');
        $(card).focus();
        return false;
    }

    return true;
};


//检查号码是否符合规范，包括长度，类型
isCardNo = function (card) {
    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
    if (reg.test(card) === false) {
        return false;
    }

    return true;
};

//取身份证前两位,校验省份
checkProvince = function (card) {
    var province = card.substr(0, 2);
    if (vcity[province] == undefined) {
        return false;
    }
    return true;
};

//检查生日是否正确
checkBirthday = function (card) {
    var len = card.length;
    //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
    if (len == '15') {
        var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
        var arr_data = card.match(re_fifteen);
        var year = arr_data[2];
        var month = arr_data[3];
        var day = arr_data[4];
        var birthday = new Date('19' + year + '/' + month + '/' + day);
        return verifyBirthday('19' + year, month, day, birthday);
    }
    //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
    if (len == '18') {
        var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
        var arr_data = card.match(re_eighteen);
        var year = arr_data[2];
        var month = arr_data[3];
        var day = arr_data[4];
        var birthday = new Date(year + '/' + month + '/' + day);
        return verifyBirthday(year, month, day, birthday);
    }
    return false;
};

//校验日期
verifyBirthday = function (year, month, day, birthday) {
    var now = new Date();
    var now_year = now.getFullYear();
    //年月日是否合理
    if (birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day) {
        //判断年份的范围（3岁到100岁之间)
        var time = now_year - year;
        if (time >= 3 && time <= 100) {
            return true;
        }
        return false;
    }
    return false;
};

//校验位的检测
checkParity = function (card) {
    //15位转18位
    card = changeFivteenToEighteen(card);
    var len = card.length;
    if (len == '18') {
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
        var cardTemp = 0, i, valnum;
        for (i = 0; i < 17; i++) {
            cardTemp += card.substr(i, 1) * arrInt[i];
        }
        valnum = arrCh[cardTemp % 11];
        if (valnum == card.substr(17, 1)) {
            return true;
        }
        return false;
    }
    return false;
};

//15位转18位身份证号
changeFivteenToEighteen = function (card) {
    if (card.length == '15') {
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
        var cardTemp = 0, i;
        card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6);
        for (i = 0; i < 17; i++) {
            cardTemp += card.substr(i, 1) * arrInt[i];
        }
        card += arrCh[cardTemp % 11];
        return card;
    }
    return card;
};


var idCardNoUtil = {
    /*省,直辖市代码表*/
    provinceAndCitys: { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江",
        31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东",
        45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏",
        65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外"
    },

    /*每位加权因子*/
    powers: ["7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7", "9", "10", "5", "8", "4", "2"],

    /*第18位校检码*/
    parityBit: ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"],

    /*性别*/
    genders: { male: "男", female: "女" },

    /*校验地址码*/
    checkAddressCode: function (addressCode) {
        var check = /^[1-9]\d{5}$/.test(addressCode);
        if (!check) return false;
        if (idCardNoUtil.provinceAndCitys[parseInt(addressCode.substring(0, 2))]) {
            return true;
        } else {
            return false;
        }
    },

    /*校验日期码*/
    checkBirthDayCode: function (birDayCode) {
        var check = /^[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))$/.test(birDayCode);
        if (!check) return false;
        var yyyy = parseInt(birDayCode.substring(0, 4), 10);
        var mm = parseInt(birDayCode.substring(4, 6), 10);
        var dd = parseInt(birDayCode.substring(6), 10);
        var xdata = new Date(yyyy, mm - 1, dd);
        if (xdata > new Date()) {
            return false; //生日不能大于当前日期
        } else if ((xdata.getFullYear() == yyyy) && (xdata.getMonth() == mm - 1) && (xdata.getDate() == dd)) {
            return true;
        } else {
            return false;
        }
    },

    /*计算校检码*/
    getParityBit: function (idCardNo) {
        var id17 = idCardNo.substring(0, 17);
        /*加权 */
        var power = 0;
        for (var i = 0; i < 17; i++) {
            power += parseInt(id17.charAt(i), 10) * parseInt(idCardNoUtil.powers[i]);
        }
        /*取模*/
        var mod = power % 11;
        return idCardNoUtil.parityBit[mod];
    },

    /*验证校检码*/
    checkParityBit: function (idCardNo) {
        var parityBit = idCardNo.charAt(17).toUpperCase();
        if (idCardNoUtil.getParityBit(idCardNo) == parityBit) {
            return true;
        } else {
            return false;
        }
    },

    /*校验15位或18位的身份证号码*/
    checkIdCardNo: function (idCardNo) {
        //15位和18位身份证号码的基本校验
        var check = /^\d{15}|(\d{17}(\d|x|X))$/.test(idCardNo);
        if (!check) return false;
        //判断长度为15位或18位  
        if (idCardNo.length == 15) {
            return idCardNoUtil.check15IdCardNo(idCardNo);
        } else if (idCardNo.length == 18) {
            return idCardNoUtil.check18IdCardNo(idCardNo);
        } else {
            return false;
        }
    },

    //校验15位的身份证号码
    check15IdCardNo: function (idCardNo) {
        //15位身份证号码的基本校验
        var check = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/.test(idCardNo);
        if (!check) return false;
        //校验地址码
        var addressCode = idCardNo.substring(0, 6);
        check = idCardNoUtil.checkAddressCode(addressCode);
        if (!check) return false;
        var birDayCode = '19' + idCardNo.substring(6, 12);
        //校验日期码
        return idCardNoUtil.checkBirthDayCode(birDayCode);
    },

    //校验18位的身份证号码
    check18IdCardNo: function (idCardNo) {
        //18位身份证号码的基本格式校验
        var check = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/.test(idCardNo);
        if (!check) return false;
        //校验地址码
        var addressCode = idCardNo.substring(0, 6);
        check = idCardNoUtil.checkAddressCode(addressCode);
        if (!check) return false;
        //校验日期码
        var birDayCode = idCardNo.substring(6, 14);
        check = idCardNoUtil.checkBirthDayCode(birDayCode);
        if (!check) return false;
        //验证校检码   
        return idCardNoUtil.checkParityBit(idCardNo);
    },

    formateDateCN: function (day) {
        var yyyy = day.substring(0, 4);
        var mm = day.substring(4, 6);
        var dd = day.substring(6);
        return yyyy + '-' + mm + '-' + dd;
    },

    //获取信息
    getIdCardInfo: function (idCardNo) {
        var idCardInfo = {
            gender: "",   //性别
            birthday: "" // 出生日期(yyyy-mm-dd)
        };
        if (idCardNo.length == 15) {
            var aday = '19' + idCardNo.substring(6, 12);
            idCardInfo.birthday = idCardNoUtil.formateDateCN(aday);
            if (parseInt(idCardNo.charAt(14)) % 2 == 0) {
                idCardInfo.gender = idCardNoUtil.genders.female;
            } else {
                idCardInfo.gender = idCardNoUtil.genders.male;
            }
        } else if (idCardNo.length == 18) {
            var aday = idCardNo.substring(6, 14);
            idCardInfo.birthday = idCardNoUtil.formateDateCN(aday);
            if (parseInt(idCardNo.charAt(16)) % 2 == 0) {
                idCardInfo.gender = idCardNoUtil.genders.female;
            } else {
                idCardInfo.gender = idCardNoUtil.genders.male;
            }

        }
        return idCardInfo;
    },

    /*18位转15位*/
    getId15: function (idCardNo) {
        if (idCardNo.length == 15) {
            return idCardNo;
        } else if (idCardNo.length == 18) {
            return idCardNo.substring(0, 6) + idCardNo.substring(8, 17);
        } else {
            return null;
        }
    },

    /*15位转18位*/
    getId18: function (idCardNo) {
        if (idCardNo.length == 15) {
            var id17 = idCardNo.substring(0, 6) + '19' + idCardNo.substring(6);
            var parityBit = idCardNoUtil.getParityBit(id17);
            return id17 + parityBit;
        } else if (idCardNo.length == 18) {
            return idCardNo;
        } else {
            return null;
        }
    }
};

function ReplaceChar(str) {
    if (str == '') { return ""; }
    str = str.replace(/;/g, "；").replace(/'/g, "’").replace(/!/g, "！").replace(/,/g, "，").replace(/</g, "").replace(/>/g, "");
    str = str.replace(/\*/g, "X").replace(/exec/g, "").replace(/insert/g, "");
    str = str.replace(/select/g, "").replace(/delete/g, "").replace(/update/g, "").replace(/count/g, "").replace(/master/g, "").replace(/truncate/g, "");
    str = str.replace(/declare/g, "").replace(/\char/g, "").replace(/\mid/g, "").replace(/\chr/g, "").replace(/'/g, "");

    return str;
}
function ReplaceCharHtml(str) {
    if (str == '') { return ""; }
    str = str.replace(/!/g, "！").replace(/,/g, "，").replace(/【/g, "[").replace(/】/g, "]").replace(/{/g, "").replace(/}/g, "");
    return str;
}
/**
* 执行正则表达式
*/
function testRegExp(text, re) {
    return new RegExp(re).test(text);
};

function isEmail(str) {
    if (str == '') { return true; }

    if (str.charAt(0) == "." || str.charAt(0) == "@" || str.indexOf('@', 0) == -1
        || str.indexOf('.', 0) == -1 || str.lastIndexOf("@") == str.length - 1 || str.lastIndexOf(".") == str.length - 1) {
        return false;

    } else
        return true;
}

function isDate(str) {
    if (str == '') { return true; }
    //;
    var vDate = str.split(' ');
    if (vDate.length == 2) {
        str = vDate[0];
    }

    var pattern = /^((\d{4})|(\d{2}))-(\d{1,2})-(\d{1,2})$/g;
    // var pattern1 = /^((\d{4})|(\d{2}))-(\d{1,2})-(\d{1,2})$/g;
    if (!pattern.test(str)) {
        return false;
    } else {
        return true;
    }
}

function isDateTime(str) {
    if (str == '') { return true; }
    var pattern = "^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-)) (20|21|22|23|[0-1]?\d):[0-5]?\d:[0-5]?\d$";
    var regex = "^((\d{2}(([02468][048])|([13579][26]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|([1-2][0-9])))))|(\d{2}(([02468][1235679])|([13579][01345789]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))"; //日期部分
    regex += "(\s(((0?[0-9])|([1-2][0-3]))\:([0-5]?[0-9])((\s)|(\:([0-5]?[0-9])))))?$"; //时间部分
    return testRegExp(str, regex);
    if (!pattern.test(str)) {
        return false;
    } else {
        return true;
    }
}



function IntFloat(oInput) {
    if ('' != oInput.value.replace(/^-{0,1}\d{1,}\.{0,1}\d{0,}/, '') || '-' != oInput.value.replace(/^-{0,1}\d{1,}\.{0,1}\d{0,}/, '')) {
        if (oInput.value != null && oInput.value != "") {

            oInput.value = oInput.value.match(/(-\d{0,}|\d{1,})\.{0,1}\d{0,}/) == null ? '' : oInput.value.match(/(-\d{0,}|\d{1,})\.{0,1}\d{0,}/)[0];
        }
    }
}

function isNumber(str) {
    if (str == '') { return true; }

    //if(/^(\-?)(\d+)$/.test(str)||/^(\-?)(\d+)(.{1})(\d+)$/g.test(str))
    if (/^(\+|-)?\d+($|\.\d+$)/.test(str)) {
        return true;
    } else {
        return false;
    }
}



function isInteger(str) {
    if (str == '') { return true; }

    if (/^(\-?)(\d+)$/.test(str)) {
        return true;
    } else {
        return false;
    }
}

String.prototype.len = function () {
    return this.replace(/[^\x00-\xff]/g, "rr").length;
}
String.prototype.checkMaxLength = function (lenTemp) {
    var r = /[^\x00-\xff]/g;
    if (this.replace(r, "mm").length <= lenTemp) return this;
    var m = Math.floor(lenTemp / 2);
    for (var i = m; i < this.length; i++) {
        if (this.substr(0, i).replace(r, "mm").length >= lenTemp) {
            CM.alert('注意：文字长度不能超过' + lenTemp + ',系统自动将超出文字去掉!');
            return this.substr(0, i);
        }
    }
    return this;
};



function isNumOrChar(S, T) {
    var Obj = eval('document.all[\'' + S + '\']');
    var desc = T + "必须为数字、英文、或者下划线!";
    if (typeof (Obj) == "undefined") {
        alert("目标不存在。");
        return true;
    }
    var str = Obj.value;
    if (str == '') { return true; }
    if (!/[\W]/.test(str))
        return true;
    else {
        if (typeof (T) != "undefined") { alert(desc); }
        Obj.focus();
        return false;
    }
}
function isEmpty(S, T) {
    var Obj = document.getElementById(S);

    var desc = T + "不能为空!";
    if (typeof (Obj) == "undefined") {
        CM.alert("目标不存在。");
        return true;
    }
    var str = trim(Obj.value);

    if (str == '') {
        if (typeof (T) != "undefined") { alert(desc); }
        Obj.focus();
        return true;
    }

    return false;
}


function isSelected(S, T) {
    var Obj = eval('document.all[\'' + S + '\']');
    var desc = T + "必须选择!";
    if (typeof (Obj) == "undefined") {
        CM.alert("目标不存在。");
        return true;
    }
    var str = trim(Obj.value);

    if (Obj.selectedIndex == 0) {
        if (typeof (T) != "undefined") { alert(desc); }
        Obj.focus();
        return false;
    }
    return true;
}


function isIllegal(S, T) {

    var Obj = eval('document.all[\'' + S + '\']');
    var desc = T + "必须为汉字、数字、英文、或者下划线!";
    if (typeof (Obj) == "undefined") {
        CM.alert("目标不存在。");
        return true;
    }
    var str = Obj.value;
    if (str == '') { return true; }

    reg = '~!@#$%^&*()+{}|:\'<>?`=[]-/\\';
    for (var i = 0; i < reg.length; i++) {
        if (str.indexOf(reg.charAt(i)) != -1) {
            if (typeof (T) != "undefined") { alert(desc); }
            Obj.focus();
            return true;
        }
    }
    return false;
}


function isNormal(str) {
    if (str == '') { return true; }
    reg = '~!@#$%^&*()+{}|:\'<>?`=[]-/\\';
    for (var i = 0; i < reg.length; i++) {
        if (str.indexOf(reg.charAt(i)) != -1) {
            return false;
        }
    }
    return true;
}


function isHtmlChar(str) {
    if (str == '') { return true; }
    reg = '&\'<>/\\';
    for (var i = 0; i < reg.length; i++) {
        if (str.indexOf(reg.charAt(i)) != -1) {
            return true;
        }
    }
    return false;
}

//去左空格; 
function ltrim(s) {
    return s.replace(/^\s*/, "");
}
//去右空格; 
function rtrim(s) {
    return s.replace(/\s*$/, "");
}
//去左右空格; 
function trim(s) {
    return rtrim(ltrim(s));
}
//去所有的空格; 
function trimAll(s) {
    return rtrim(ltrim(s));
}


function validForm(formId) {
    var isvalid = true;

    var usehtml = 'false';
    $("form[id=" + formId + "]").find("input,textarea,select").each(function (i) {
        var Caption = $(this).attr('data-label');
        var notnull = $(this).attr('notnull');
        var maxlen = $(this).attr('maxlength');
        var datatype = $(this).attr('datatype');
        var noZero = $(this).attr('nozero');
        var nofushu = $(this).attr('nofushu');
        var id = this.name;
        if ($(this)[0].type != "password" && $(this)[0].type != "hidden" && $(this)[0].type != "file") {
            if ($(this)[0].type == "textarea") {
                if ($(this).css("display") != "none") {
                    $(this).val(ReplaceChar($(this).val()));
                }
                else {
                    $(this).val(ReplaceCharHtml($(this).val()));

                }
            }
            else {
                if ($(this).val() != '' && $(this).val() != null && id.indexOf("dt") != 0) {

                    $(this).val(ReplaceChar($(this).val()));
                }
            }
        }



        var vCtrl = $(this);

        //;
        if (notnull != null && notnull != "" && notnull == 'true') {
            //;
            if (!$(this).val() || trim($(this).val()) == '') {

                var d = dialog({
                    content: "<div style=\"margin:0; padding:0; text-align:center; vertical-align:middle;font-size:14px;font-weight:bold\">" + Caption + "不能为空!</div>",
                    width: "200px",
                    height: "60px"
                }).show();

                setTimeout(function () {
                    d.close().remove();
                    vCtrl.focus();
                }, 2000);
                isvalid = false;

                return false;
            }
        }

        if (noZero == 'true') {

            if (!isNumber($(this).val())) {

                var d = dialog({
                    content: "<div style=\"margin:0; padding:0; text-align:center; vertical-align:middle;font-size:14px;font-weight:bold\">" + Caption + "必须为数字!</div>",
                    width: "200px",
                    height: "60px"
                }).show();

                setTimeout(function () {
                    d.close().remove();
                    vCtrl.focus();
                }, 2000);
                isvalid = false;
                return false;
            }

            if (!$(this).val() || parseFloat(trim($(this).val())) == 0) {

                var d = dialog({
                    content: "<div style=\"margin:0; padding:0; text-align:center; vertical-align:middle;font-size:14px;font-weight:bold\">" + Caption + "不能为零值!</div>",
                    width: "200px",
                    height: "60px"
                }).show();

                setTimeout(function () {
                    d.close().remove();
                    vCtrl.focus();
                }, 2000);
                isvalid = false;
                return false;
            }
        }

        if (nofushu == 'true') {

            if (!isNumber($(this).val())) {

                var d = dialog({
                    content: "<div style=\"margin:0; padding:0; text-align:center; vertical-align:middle;font-size:14px;font-weight:bold\">" + Caption + "必须为数字!</div>",
                    width: "200px",
                    height: "60px"
                }).show();

                setTimeout(function () {
                    d.close().remove();
                    vCtrl.focus();
                }, 2000);
                isvalid = false;
                return false;
            }

            if (!$(this).val() || parseFloat(trim($(this).val())) < 0) {
                var d = dialog({
                    content: "<div style=\"margin:0; padding:0; text-align:center; vertical-align:middle;font-size:14px;font-weight:bold\">" + Caption + "不能为负数!</div>",
                    width: "200px",
                    height: "60px"
                }).show();

                setTimeout(function () {
                    d.close().remove();
                    vCtrl.focus();
                }, 2000);
                isvalid = false;
                return false;
            }
        }
        if (maxlen && maxlen > 0) {
            if ($(this).val().length > maxlen) {
                var d = dialog({
                    content: "<div style=\"margin:0; padding:0; text-align:center; vertical-align:middle;font-size:14px;font-weight:bold\">" + Caption + '长度不能大于' + maxlen + "!</div>",
                    width: "200px",
                    height: "60px"
                }).show();

                setTimeout(function () {
                    d.close().remove();
                    vCtrl.focus();
                }, 2000);
                isvalid = false;
                return false;
            }
        }


        if (datatype) {
            if (datatype == 'number') {

                if (!isNumber($(this).val())) {
                    var d = dialog({
                        content: "<div style=\"margin:0; padding:0; text-align:center; vertical-align:middle;font-size:14px;font-weight:bold\">" + Caption + "必须为数字!</div>",
                        width: "200px",
                        height: "60px"
                    }).show();

                    setTimeout(function () {
                        d.close().remove();
                        vCtrl.focus();
                    }, 2000);
                    isvalid = false;
                    return false;
                }
            }
            else if (datatype == 'integer') {

                if (!isInteger($(this).val())) {
                    var d = dialog({
                        content: "<div style=\"margin:0; padding:0; text-align:center; vertical-align:middle;font-size:14px;font-weight:bold\">" + Caption + "必须为整数!</div>",
                        width: "200px",
                        height: "60px"
                    }).show();

                    setTimeout(function () {
                        d.close().remove();
                        vCtrl.focus();
                    }, 2000);
                    isvalid = false;
                    return false;
                }
            } else if (datatype == 'date') {

                if (!isDate($(this).val())) {
                    var d = dialog({
                        content: "<div style=\"margin:0; padding:0; text-align:center; vertical-align:middle;font-size:14px;font-weight:bold\">" + Caption + "日期格式不正确(yyyy-mm-dd)!</div>",
                        width: "200px",
                        height: "60px"
                    }).show();


                    setTimeout(function () {
                        d.close().remove();
                        vCtrl.focus();
                    }, 2000);
                    $(this).focus();
                    isvalid = false;
                    return false;
                }
            } else if (datatype == 'email') {
                if (!isEmail($(this).val())) {
                    var d = dialog({
                        content: "<div style=\"margin:0; padding:0; text-align:center; vertical-align:middle;font-size:14px;font-weight:bold\">" + Caption + "格式不正确!</div>",
                        width: "200px",
                        height: "60px"
                    }).show();

                    setTimeout(function () {
                        d.close().remove();
                        vCtrl.focus();
                    }, 2000);
                    $(this).focus();
                    isvalid = false;
                    return false;
                }
            } else if (datatype == 'normal') {
                if (!isNormal($(this).val())) {
                    var d = dialog({
                        content: "<div style=\"margin:0; padding:0; text-align:center; vertical-align:middle;font-size:14px;font-weight:bold\">" + Caption + "不能含非法字符!</div>",
                        width: "200px",
                        height: "60px"
                    }).show();

                    setTimeout(function () {
                        d.close().remove();
                        vCtrl.focus();
                    }, 2000);

                    $(this).focus();
                    isvalid = false;
                    return false;
                }
            }

        }

    })

    return isvalid;
}



//表单的隔行变色  
function tablerowcolor() {

    $(".public_table tr").mouseover(function () { //如果鼠标移到class为public_table的表格的tr上时，执行函数  
        $(this).addClass("over");
    }).mouseout(function () { //给这行添加class值为over，并且当鼠标一出该行时执行函数  
        $(this).removeClass("over");
    }) //移除该行的class  
    $(".public_table tr:even").addClass("alt"); //给class为public_table的表格的偶数行添加class值为alt  
    $(".bordered tr:even").addClass("alt"); //给class为public_table的表格的偶数行添加class值为alt  

}  