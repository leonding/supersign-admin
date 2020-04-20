var tool = {GetQueryString: function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return""
}, getRandomString: function(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
            maxPos = $chars.length,
            str = '';
    for (i = 0; i < len; i++) {
        str += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return str;
}, downIpaApp: function(url, name, layer) {
    var that = this,
            x = new XMLHttpRequest(),
            randStr = that.getRandomString(8),
            loadingIndex = "";
    loadingIndex = that.loading(layer, '下载资源请求中...');
    x.open("GET", url, true);
    x.responseType = 'blob';
    x.onload = function(e) {
        layer.close(loadingIndex);
        download(x.response, name + randStr + ".ipa", "application/octet-stream.ipa");
    }
    x.send();
}, getTime: function(timeDance) {
    timeDance = timeDance * 1000;
    var time = new Date(parseInt(timeDance)), year = time.getFullYear(), month = time.getMonth() + 1, date = time.getDate(), hours = time.getHours(), minutes = time.getMinutes(), seconds = time.getSeconds();
    month = month < 10 ? '0' + month : month;
    date = date < 10 ? '0' + date : date;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return{all: (year + '-' + month + '-' + date + '  ' + hours + ':' + minutes + ':' + seconds), yyr: (year + '-' + month + '-' + date), yyrp: (year + '.' + month + '.' + date)}
}, goBack: function(url) {
    if (url != '') {
        window.location.href = url
    } else {
        if (document.referrer != '') {
            window.history.back(-1)
        } else {
            window.location.href = '/index.html'
        }
    }
}, loading: function(layer, loadStr) {
    var loading = layer.open({type: 0, title: false, content: '<p><i class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i></p><p>' + loadStr + '</p>', closeBtn: 0, btn: [], shade: [0.1, '#fff'], skin: "custom-loading", });
    return loading
}, isWeiXin: function() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true
    } else {
        return false
    }
}, isQQZone: function() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/QQ/i) == 'qq') {
        return true
    } else {
        return false
    }
}, isWeiBo: function() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/WeiBo/i) == 'weibo') {
        return true
    } else {
        return false
    }
}, mobileDevice: function() {
    var ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
        return'ios'
    } else if (/android/.test(ua)) {
        return'android'
    } else {
        return'other'
    }
}, httpRequest: function(url, data, type, layer, isLoad, loadMsg, succ, error, fail, isfile) {
    var loading = null;
    $.ajax({type: type, dataType: "json", timeout: isfile ? 0 : 60000, data: data, url: url, contentType: isfile ? false : "application/x-www-form-urlencoded", processData: isfile ? false : true, cache: isfile ? false : true, beforeSend: function() {
            if (isLoad) {
                var loadStr = loadMsg && loadMsg != '' ? loadMsg : '网络请求中...';
                // loading = layer.open({type: 0, title: false, content: '<p><i class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i></p><p>' + loadStr + '</p>', closeBtn: 0, btn: [], shade: [0.1, '#fff'], })
                loading = layer.msg(loadStr, {
                    icon:16,
                    shade:[0.1, '#000'],
                    time:false  //取消自动关闭
                }); 
            }
        }, success: function(data) {
            if (isLoad) {
                layer.close(loading)
            }
            if (data.status) {
                if (succ) {
                    succ(data)
                }
            } else {
                layer.msg(data.msg, {icon: 15, shade: 0.01, time: 1000, }, function() {
                    if (data.errCode == 100) {
                        window.location.href = data.loginUrl
                    }
                });
                if (error) {
                    error(data)
                }
            }
        }, error: function() {
            if (isLoad) {
                layer.close(loading)
            }
            layer.msg('服务异常，请稍后重试', {icon: 15, shade: 0.01, time: 1000, });
            if (fail) {
                fail()
            }
        }})
}, browserRedirect: function() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    var platform = "";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        platform = "mobile"
    } else {
        platform = "pc"
    }
    return platform
}, IEVersion: function() {
    var userAgent = navigator.userAgent;
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE;
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) {
            return 7
        } else if (fIEVersion == 8) {
            return 8
        } else if (fIEVersion == 9) {
            return 9
        } else if (fIEVersion == 10) {
            return 10
        } else {
            return 6
        }
    } else if (isEdge) {
        return'edge'
    } else if (isIE11) {
        return 11
    } else {
        return-1
    }
}, dataURLtoFile: function(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, {type: mime})
}, getObjectURL: function(file) {
    var url = null;
    if (window.createObjectURL != undefined) {
        url = window.createObjectURL(file)
    } else if (window.URL != undefined) {
        url = window.URL.createObjectURL(file)
    } else if (window.webkitURL != undefined) {
        url = window.webkitURL.createObjectURL(file)
    }
    return url
}, appSizeStr: function(appSize) {
    var str = "";
    appSize = Number(appSize);
    if (appSize < 1024) {
        str = appSize + ' B'
    } else if (appSize >= 1024 && appSize < 1024 * 1024) {
        str = Math.round(appSize / 1024 * 10) / 10 + " KB"
    } else if (appSize >= 1024 * 1024 && appSize < 1024 * 1024 * 1024) {
        str = Math.round(appSize / (1024 * 1024) * 10) / 10 + " MB"
    } else {
        str = Math.round(appSize / (1024 * 1024 * 1024) * 10) / 10 + " GB"
    }
    return str
}, isInteger: function(obj) {
    return Math.floor(obj) === obj
}, toInteger: function(floatNum) {
    var that = this;
    var ret = {times: 1, num: 0};
    if (that.isInteger(floatNum)) {
        ret.num = floatNum;
        return ret
    }
    var strfi = floatNum + '';
    var dotPos = strfi.indexOf('.');
    var len = strfi.substr(dotPos + 1).length;
    var times = Math.pow(10, len);
    var intNum = parseInt(floatNum * times + 0.5, 10);
    ret.times = times;
    ret.num = intNum;
    return ret
}, operation: function(a, b, op) {
    var that = this;
    var o1 = that.toInteger(a);
    var o2 = that.toInteger(b);
    var n1 = o1.num;
    var n2 = o2.num;
    var t1 = o1.times;
    var t2 = o2.times;
    var max = t1 > t2 ? t1 : t2;
    var result = null;
    switch (op) {
        case'add':
            if (t1 === t2) {
                result = n1 + n2
            } else if (t1 > t2) {
                result = n1 + n2 * (t1 / t2)
            } else {
                result = n1 * (t2 / t1) + n2
            }
            return Math.round(result / max * 100) / 100;
        case'subtract':
            if (t1 === t2) {
                result = n1 - n2
            } else if (t1 > t2) {
                result = n1 - n2 * (t1 / t2)
            } else {
                result = n1 * (t2 / t1) - n2
            }
            return Math.round(result / max * 100) / 100;
        case'multiply':
            result = (n1 * n2) / (t1 * t2);
            return Math.round(result * 100) / 100;
        case'divide':
            result = (n1 / n2) * (t2 / t1);
            return Math.round(result * 100) / 100
    }
}, };