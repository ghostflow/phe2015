define(function(require, exports) {
    var host;
    var env = window.env || 'release';
    if (env === 'release') {
        host = 'http://localhost';
    } else if (env === 'dev') {
         host = 'http://www.pheworld.net:8080/';
    }
    var config = {
        host: host,
    };
    return config;
});
