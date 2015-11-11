/**
 * Created by allen on 15/8/28.
 */
define(function(require,exports){
  var takeoutModel = Backbone.Model.extend({
    defaults: {
      status: -1
    }
  });
  return new takeoutModel;
})