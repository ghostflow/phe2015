define(function(require, exports) {
    var config = require('config');
    var formatDate = function(date, format) {
        if (Object.prototype.toString.call(date) !== "[object Date]") {
            date = new Date(date);
        }
        var map = {
            "M": date.getMonth() + 1, //月份 
            "d": date.getDate(), //日 
            "h": date.getHours(), //小时 
            "m": date.getMinutes(), //分 
            "s": date.getSeconds(), //秒 
            "q": Math.floor((date.getMonth() + 3) / 3), //季度 
            "S": date.getMilliseconds() //毫秒 
        };
        format = format.replace(/([yMdhmsqS])+/g, function(all, t) {
            var v = map[t];
            if (v !== undefined) {
                if (all.length > 1) {
                    v = '0' + v;
                    v = v.substr(v.length - 2);
                }
                return v;
            } else if (t === 'y') {
                return (date.getFullYear() + '').substr(4 - all.length);
            }
            return all;
        });
        return format;
    };
    var Cookie = (function() {
        var get = function(key) {
            var arr = document.cookie.match(new RegExp("(^| )" + key + "=([^;]*)(;|$)"));
            if (arr !== null) {
                return decodeURIComponent(arr[2]);
            } else {
                return "";
            }
        };
        var remove = function(key) {
            var d = new Date();
            if (this.get(key) !== "") {
                d.setTime(d.getTime() - (86400 * 1000 * 1));
                document.cookie = key + "=;expires=" + d.toGMTString();
            }
        };
        //duration过期时间(duration单位为天)
        var set = function(key, value, duration) {
            Cookie.remove(key);
            var d = new Date();
            if (duration) {
                d.setTime(d.getTime() + 1000 * 60 * 60 * 24 * duration);
                document.cookie = key + "=" + encodeURI(value) + "; expires=" + d.toGMTString() + ";path=/";
            } else {
                document.cookie = key + "=" + encodeURI(value) + ";path=/";
            }

        };
        return {
            get: get,
            set: set,
            remove: remove
        };
    })();

    var parseURL = function(url) {
        url = url || location.href;
        var a = document.createElement('a');
        a.href = url;
        return {
            source: url,
            protocol: a.protocol.replace(':', ''),
            host: a.hostname,
            port: a.port,
            query: a.search,
            params: (function() {
                var ret = {},
                    seg = a.search.replace(/^\?/, '').split('&'),
                    len = seg.length,
                    i = 0,
                    s;
                for (; i < len; i++) {
                    if (!seg[i]) {
                        continue;
                    }
                    s = seg[i].split('=');
                    //ret[s[0]] = s[1];
                    ret[s.splice(0, 1)] = s.join('=');
                }
                return ret;
            })(),
            file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
            hash: a.hash.replace('#', ''),
            path: a.pathname.replace(/^([^\/])/, '/$1'),
            relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
            segments: a.pathname.replace(/^\//, '').split('/')
        };
    };

    var toQueryPair = function(key, value) {
        if (typeof value == 'undefined') {
            return key;
        }
        return key + '=' + encodeURIComponent(value === null ? '' : String(value));
    };
    var toQueryString = function(obj) {
        var ret = [];
        for (var key in obj) {
            key = encodeURIComponent(key);
            var values = obj[key];
            if (values && values.constructor == Array) { //数组
                var queryValues = [];
                for (var i = 0, len = values.length, value; i < len; i++) {
                    value = values[i];
                    queryValues.push(toQueryPair(key, value));
                }
                ret = ret.concat(queryValues);
            } else { //字符串
                ret.push(toQueryPair(key, values));
            }
        }
        return ret.join('&');
    };
    var toUrlQuery = function(obj) {
        return '?' + toQueryString(obj);
    };

    var getOS = function() {
        var ua = navigator.userAgent;
        if (/android/i.test(ua)) {
            return 'android';
        } else if (/iphone|ipad/i.test(ua)) {
            return 'ios';
        } else if (/windows phone/i.test(ua)) {
            return 'windows';
        }
    };
    var isWX = function() {
        var ua = navigator.userAgent;
        return (/MicroMessenger/i).test(ua);
    };
    var escape2Html = function(str) {
        var arrEntities = {
            'lt': '<',
            'gt': '>',
            'nbsp': ' ',
            'amp': '&',
            'quot': '"'
        };
        return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all, t) {
            return arrEntities[t];
        });
    };

    var removeHtmlTab = function(tab) {
        return tab.replace(/<[^<>]+?>/g, ''); //删除所有HTML标签
    };

    var getAjax = function(url,data,success,error) {
        $.ajax({
            url: url,
            type: 'get',
            data: data,
            dataType: 'json',
            xhrFields: {
                withCredentials: config.withCredentials
            },
            crossDomain: true,
            success: success,
            error: error
        });
    };

    var postAjax = function(url,data,success,error) {
        $.ajax({
            url: url,
            type: 'post',
            data: data,
            dataType: 'json',
            xhrFields: {
                withCredentials: config.withCredentials
            },
            crossDomain: true,
            success: success,
            error: error
        });
    }
    var getQuery = function(href){
        var url=location.search;
        var Request = {};
        if(url.indexOf("?")!=-1)
        {
            var str = url.substr(1);
            strs = str.split("&");
            for(var i=0;i<strs.length;i++)
            {
                var _key = strs[i].split("=")[0];
                Request[_key]=strs[i].split("=")[1];
            }
        }
        return Request;
    }
    var getTime = function(str){
        str = str.replace(/-/g,"/");
        return new Date(str);
    }
    var howLongAgo = function(serverTime,publishTime){
        var minute = 1000 * 60;
        var hour = minute * 60;
        var day = hour * 24;
        var month = day * 30;
        var diffValue = serverTime - publishTime;
        if(diffValue < 0){
            //若日期不符则弹出窗口告之
            //alert("结束日期不能小于开始日期！");
        }
        var monthC =diffValue/month;
        var weekC =diffValue/(7*day);
        var dayC =diffValue/day;
        var hourC =diffValue/hour;
        var minC =diffValue/minute;
        if(monthC>=1){
            result= parseInt(monthC) + "个月前";
        }
        else if(weekC>=1){
            result = parseInt(weekC) + "周前";
        }
        else if(dayC>=1){
            result = parseInt(dayC) +"天前";
        }
        else if(hourC>=1){
            result = parseInt(hourC) +"个小时前";
        }
        else if(minC>=1){
            result = parseInt(minC) +"分钟前";
        }else
            result ="刚刚";
        return result;

    }

    var util = {
        escape2Html: escape2Html,
        removeHtmlTab: removeHtmlTab,
        parseURL: parseURL,
        toQueryString: toQueryString,
        toUrlQuery:toUrlQuery,
        Cookie: Cookie,
        formatDate: formatDate,
        getAjax: getAjax,
        postAjax: postAjax,
        getQuery: getQuery,
        getTime: getTime,
        howLongAgo: howLongAgo,
        ua: {
            getOS: getOS,
            isWX: isWX
        },
        isEmptyObject: function(obj) {
            var name;
            for (name in obj) {
                return false;
            }
            return true;
        },
        str: {
            /**过滤字符串中html标签，去掉行尾空白，去掉多余空行
             去除HTML tag
             去除行尾空白
             **/
            removeHtmlTag: function(str) {
                str = str.replace(/<\/?[^>]*>/g, '');
                str = str.replace(/[ | ]*\n/g, '\n');
                str = str.replace(/ /ig, '');
                str = str.replace(/&nbsp;/g, '');
                return str;
            }
        },
        tools: {
            /**函数在指定time内只执行一次**/
            delayFuc: function(callback, time) {
                clearTimeout(this.timer);
                var delaytime = time ? time : 500;
                this.timer = setTimeout(function() {
                    callback.call(this);
                }, delaytime);
            }
        }
    };
    // window.util = util;
    return util;
});