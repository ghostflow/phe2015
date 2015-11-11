/**
 * Created by EiT on 2015/10/27.
 */
define(function(require,exports){
  var consumingModel = Backbone.Model.extend({
    defaults: {
      status: -1
    }
  });
  return new consumingModel;
})