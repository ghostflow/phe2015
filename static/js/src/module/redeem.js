/**
 * Created by allen on 15/6/24.
 */
define(function(require,exports){
  var util = require('../common/util'),
      config = require('../common/config'),
      handlebarsHelper =  require('../component/handlebarsHelper');

  var app = require('../view/app');
  var user = require('../view/user');

  var pagination = require('../view/pagination');

  Backbone.history.start();

});