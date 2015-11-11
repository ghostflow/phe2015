/**
 * Created by allen on 15/7/23.
 */
define(function(require,exports){
  var appModel = Backbone.Model.extend({
    defaults: {
      title: '',
      completed: false,
      status: 0
    }
  });
  return appModel;
})
