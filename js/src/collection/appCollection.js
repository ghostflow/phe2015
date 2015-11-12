/**
 * Created by allen on 15/7/23.
 */
define(function(require,exports){
  var appModel = require('../model/appModel');

  var appCollection = Backbone.Collection.extend({
    model: appModel
  });
  return new appCollection();
})