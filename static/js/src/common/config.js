define(function(require, exports) {
    var host;
    var eachPageNumber = 20;
    var env = window.env || 'release';
    if (env === 'release') {
        host = 'http://wx.qfpay.com';
    } else if (env === 'dev') {
         host = 'http://1.wx.qfpay.com';
    }
    var config = {
        host: host,
        eachPageNumber: eachPageNumber,
        code: {
            OK: "0000", // 成功     
            DBERR: "2000", // 数据库查询错误   
            THIRDERR: "2001", // 第三方系统错误   
            SESSIONERR: "2002", // 用户未登录   
            DATAERR: "2003", // 数据错误     
            IOERR: "2004", // 文件读写错误    
            LOGINERR: "2100", // 用户登录失败     
            PARAMERR: "2101", // 参数错误    
            USERERR: "2102", // 用户不存在或未激活  
            ROLEERR: "2103", // 用户身份错误    
            // ROLEERR: "2103", // 密码错误    
            REQERR: "2200", // 非法请求或请求次数受限  
            IPERR: "2201", // IP受限  
            NODATA: "2300", // 无数据  
            DATAEXIST: "2301", // 数据已存在  
            UNKOWNERR: "2400", // 未知错误
            VERIFYCODE: '1001', //    验证码不正确
            REGISTERERR: '1000' //    注册失败
        }
    };
    return config;
});
