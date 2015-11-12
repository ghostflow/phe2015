/**
 * Created by allen on 15/7/24.
 */
define(function(require,exports){
  var pagination = Backbone.Model.extend({
    defaults: {
      'page': 1,
      'completed': false
    }
  });
  return new pagination;
})