/**
 * Created by EiT on 2015/10/27.
 */
define(function(require,exports) {
  var consumingModel = require('../model/consuming');

  var Router = Backbone.Router.extend({
    routes: {
      "discount": "discount",
      "qrPay":  "qrPay"
    },
    discount: function() {
      consumingModel.set('status',0)
    },
    qrPay: function() {
      consumingModel.set('status',1)
    }
  });
  return new Router();
});