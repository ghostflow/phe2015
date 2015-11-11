define(function(require, exports) {
    var config = require('../common/config');
    var code = config.code;
    var util = require("../common/util");
    var url;
    try {
        var configWx = function(cb) {
            $.ajax({
                url: config.host + '/server/wxshare',
                // url: 'http://mmwd.me/api/server/wxshare',
                data: {
                    url: location.href
                },
                success: function(data) {
                    var respCode = data.respcd;
                    if (respCode === code.OK) {
                        data = data.data;
                        //data.debug = window.env === 'release' ? false : true;
                        data.debug = true;
                        data.jsApiList = [
                            'checkJsApi',
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            'onMenuShareWeibo'
                        ];
                        data.nonceStr = data.noncestr;
                        delete data.noncestr;
                        wx.config(data);
                        if (cb) {
                            cb();
                        }
                    }
                },
                error: function(data) {
                    console.error(data);
                }
            });
        };

        wx.error(function(res) {
             alert(JSON.stringify(res));
        });
        var share = function(data) {
            data.appId = data.appId || 'wx5e7134db8a547f5a';
            data.desc = util.removeHtmlTab(util.escape2Html(data.desc)).substring(0, 100);
            url = util.parseURL(data.link);
            data.complete = function(data) {
                data.complete();
                ga('send', 'social', 'type', data.product, data.link);
            };
            var str;
            if (url.query.length === 0) {
                str = '?ga_source=' + data.page + '_sinaweibo';
            } else {
                str = '&ga_source=' + data.page + '_sinaweibo';
            }
            data.link += str;
            if (!data.isConfiged) {
                configWx();
            }
            wx.ready(function() {
                // 2. 分享接口
                // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
                wx.onMenuShareAppMessage(data);
                // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
                wx.onMenuShareTimeline(data);
                // 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
                wx.onMenuShareQQ(data);
                // 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
                wx.onMenuShareWeibo(data);
            });
        };
        return {
            weixin: share
        };
    } catch (e) {
        //console.log(e);
    }

});
