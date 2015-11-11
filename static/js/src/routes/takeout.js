/**
 * Created by allen on 15/8/28.
 */
define(function(require,exports) {
  var appModel = require('../model/takeout');

  var Router = Backbone.Router.extend({
    routes: {
      "newOrder": "newOrder",
      "process":  "process",
      "delivery": "delivery",
      "finished":  "finished"
    },
    newOrder: function() {
      appModel.set('status',0)
    },
    process: function() {
      appModel.set('status',1)
    },
    delivery: function(){
      appModel.set('status',2)
    },
    finished: function() {
      appModel.set('status',3)
    }
  });
  return new Router();
});