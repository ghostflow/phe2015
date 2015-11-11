/**
 * Created by allen on 15/7/23.
 */
define(function(require,exports){
  var util = require('../common/util'),
      config = require('../common/config'),
      handlebarsHelper =  require('../component/handlebarsHelper');

  var user = Backbone.View.extend({
    el: '.top-nav',
    events : {
      'click .logout': 'logoutHandler'
    },
    logoutHandler: function(){
      util.Cookie.remove('sessionid');
      localStorage.setItem('shop-name','');
      location.href = 'login.html';
    }
  });
  return new user();
})